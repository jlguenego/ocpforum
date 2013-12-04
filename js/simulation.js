function Simulation() {
};

var sim = new Simulation();

(function(sim, undefined) {
	sim.DistributedSystem = function(scenario, svg) {
		var self = this;

		this.options = {
			duration: {
				addNode: 100,
				addLink: 100,
				addObject: 100,
				doTransfer: 1000,
				move: 1000
			}
		};

		this.nodes = {};
		this.links = [];
		this.scenario = scenario;
		this.svg = svg;
		this.group = this.svg.append('g');
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};
		this.stack = d3.layout.stack();
		this.defs = this.svg.append('defs');
		this.isVisible = false;

		this.objects = {};
		this.locator = {};
		this.addressMap = {};
		this.quick = false;

		this.computeDuration = function(value) {
			if (this.quick) {
				return 0;
			}
			return value;
		};

		this.updateLocator = function(obj, node) {
			this.objects[obj.name] = obj;
			if (!(obj.name in this.locator)) {
				this.locator[obj.name] = [];
			}

			for (var i = 0; i < self.locator[obj.name].length; i++) {
				if (self.locator[obj.name][i] == node) {
					return;
				}
			}
			this.locator[obj.name].push(node);
		};

		this.addNode = function(node) {
			node.parent = self;
			this.scenario.push({
				function: this._addNode,
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

		this._addNode = function(node) {
			var scenario = this.scenario.getThread(arguments);

			this.getNodeCoord(node);
			this.nodes[node.name] = node;
			this.addressMap[node.start_address] = node.name;
			this.refreshNodes(scenario);
		};

		this.addLink = function(sourceName, targetName) {
			this.scenario.push({
				function: this._addLink,
				args: arguments,
				name: 'addLink',
				object: this
			});
		};

		this._addLink = function(sourceName, targetName) {
			var scenario = this.scenario.getThread(arguments);
			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];
			this.links.push({
				source: source,
				target: target,
				id: source.name + '_' + target.name
			});
			target.links.push(source);
			this.refreshLinks(scenario);
		};

		this.addObject = function(nodeName, name, source) {
			this.scenario.push({
				function: this._addObject,
				args: [ nodeName, name, source, undefined ],
				name: 'addObject',
				object: this
			});
		};

		this._addObject = function(nodeName, name, source, duration) {
			var scenario = this.scenario.getThread(arguments);
			console.log('nodeName=' + nodeName);
			console.log('name=' + name);
			console.log('source=' + source);
			var node = this.nodes[nodeName];
			var obj = {
				name: name,
				source: source
			};
			node.objects.push(obj);
			this.updateLocator(obj, node);
			this.refreshObjects(scenario, duration);
		};

		this.requestObject = function(nodeName, objectName) {
			this.scenario.push({
				function: this._requestObject,
				args: arguments,
				name: 'requestObject',
				object: this
			});
		};

		this._requestObject = function(nodeName, objectName) {
			console.log(arguments);
			var scenario = this.scenario.getThread(arguments);
			var target = this.nodes[nodeName];

			console.log(objectName);
			if (!(objectName in this.objects)) {
				throw new Error('Object not found.');
			}

			var nodeRoute = this.getCloserNodeRoute(objectName, target);

			if (nodeRoute.length == 0) {
				throw new Error('No node found.');
			} else if (nodeRoute.length > 1) {
				for (var i = nodeRoute.length - 2; i >= 0 ; i--) {
					this.doTransfer(scenario, nodeRoute[i], nodeRoute[i + 1], objectName);
				}
			}
			scenario._next();
		};

		this.transform = function(transform_val) {
			this.scenario.push({
				function: this._transform,
				args: arguments,
				name: 'transform',
				object: this
			});
		};

		this._transform = function(transform_val) {
			var scenario = this.scenario.getThread(arguments);
			var transform = this.group.attr('transform');
			if (!transform) {
				transform = 'translate(0, 0) scale(1)';
			}
			this.group.attr('transform', transform)
				.transition()
					.duration(this.options.duration.move)
					.attr('transform', transform_val)
					.each('end', function() {
						scenario._next();
					});
		};

		this.getCloserNodeRoute = function(objectName, target, explored) {
			explored = explored || {};
			for (var i = 0; i < target.objects.length; i++) {
				if (target.objects[i].name == objectName) {
					return [ target ];
				}
			}

			// Target does not have the object.
			explored[target.name] = target;
			var routes = [];
			for (var i = 0; i < target.links.length; i++) {
				var node = target.links[i];
				if (node.name in explored) {
					continue;
				}
				var route = this.getCloserNodeRoute(objectName, target.links[i], explored);
				if (route.length > 0) {
					routes.push(route);
				}
			}

			var smallerSize = 0;
			var result = [];
			for (var i = 0; i < routes.length; i++) {
				var routeSize = routes[i].length;
				if (smallerSize == 0 || routeSize < smallerSize) {
					result = routes[i];
					smallerSize = routeSize;
				}
			}
			result.push(target);

			return result;
		};

		this.doTransfer = function(scenario, source, target, objectName) {
			scenario.current.orders.unshift({
				function: this._doTransfer,
				args: [ source, target, objectName ],
				name: 'doTransfer',
				object: this
			});
		};

		this._doTransfer = function(source, target, objectName) {
			var scenario = this.scenario.getThread(arguments);
			var transfer = {
				source: source,
				target: target,
				object: this.objects[objectName]
			};

			this.performTransfer(scenario, transfer);
		};

		this.getNodeCoord = function(node) {
			node.start_address = CryptoJS.SHA1(CryptoJS.SHA1(node.name)).toString();
			var angle = (parseInt(node.start_address.substr(15, 4), 16) / 0xffff) * 2 * Math.PI;
			node.x = (self.svg.attr('width') / 2) * (1 + 0.8 * Math.cos(angle));
			node.y = (self.svg.attr('height') / 2) * (1 + 0.8 * Math.sin(angle));
		};

		this.refreshNodes = function(scenario) {
			var duration = self.computeDuration(this.options.duration.addNode);

			// Join data
			var nodes = this.group.selectAll('g.node')
				.data(d3.values(this.nodes));

			// Enter
			var g = nodes.enter().append('g');
			g.classed('node', true)
				.style('opacity', 0);

			var text = g.append('text')
				.attr('x', function(d) {
					return d.x + 25;
				})
				.attr('y', function(d) {
					return d.y;
				})
				.style('opacity', 0);
			text.append('tspan')
				.text(function(d) { return d.name; });

			g.on('mouseover', function() {
					d3.select(this).select('text')
						.transition()
							.duration(200)
							.style('opacity', 1);
				})
				.on('mouseout', function() {
					d3.select(this).select('text')
						.transition()
							.duration(200)
							.style('opacity', 0);
				});

			g.append('image')
				.attr('xlink:href', function(d) { return d.image; })
				.attr('x', this.stack.x())
				.attr('y', this.stack.y())
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			g.transition()
				.duration(duration)
				.style('opacity', 1)
				.each('end', function() {
					scenario._next();
				});

			// Update
			// nodes.attr()...

			// Exit
			nodes.exit().remove();
		};

		this.refreshLinks = function(scenario) {
			var duration = self.computeDuration(this.options.duration.addLink);

			var links = self.group.selectAll('path.link')
				.data(self.links);

			var center = {
				x: this.svgbox.x / 2,
				y: this.svgbox.y / 2,
			};

			var path = links.enter().insert('path', ":first-child");
			path.classed('link', true)
				.attr('stroke', 'red')
				.attr('fill', 'none')
				.attr('id', function(d) { return d.id; })
				.attr('d', function(d) {
					var p1 = {
						x: (d.source.x + center.x) / 2,
						y: (d.source.y + center.y) / 2,
					};
					var p2 = {
						x: (d.target.x + center.x) / 2,
						y: (d.target.y + center.y) / 2,
					};
					return 'M' + d.source.x + ',' + d.source.y
						+ ' C' + p1.x + ',' + p1.y + ' ' + p2.x + ',' + p2.y
						+ ' ' + d.target.x + ',' + d.target.y;
				})
				.attr('stroke-dasharray', function(d) {
					var my_path = d3.select('#' + d.id).node();
					var length = my_path.getTotalLength();
					return length + ' ' + length;
				})
				.attr('stroke-dashoffset', function(d) {
					var my_path = d3.select('#' + d.id).node();
					var length = my_path.getTotalLength();
					return length;
				})
				.transition()
					.duration(duration)
					.attr('stroke-dashoffset', 0)
					.each('end', function() {
						scenario._next();
					});
		};

		this.refreshObjects = function(scenario, duration) {
			if (duration === undefined) {
				duration = self.computeDuration(this.options.duration.addObject);
			}

			var symbols = self.defs.selectAll('symbol').data(d3.values(self.objects));
			symbols.enter().append('symbol')
				.attr('id', function(d) {
					return d.name;
				})
				.append('image')
					.attr('xlink:href', function(d) { return d.source; })
					.attr('width', 25)
					.attr('height', 25);
			symbols.exit().remove();



			var nodes = self.group.selectAll('g.node').data(d3.values(self.nodes));
			var objects = nodes.selectAll('use.object').data(function(d) {
				var objects = [];
				for (var i = 0; i < d.objects.length; i++) {
					objects.push({
						object: d.objects[i],
						x: d.x,
						y: d.y
					});
				}
				return objects;
			});
			objects.enter().append('use')
				.classed('object', true)
				.attr('xlink:href', function(d) { return '#' + d.object.name; })
				.attr('x', function(d) { return d.x; })
				.attr('y', function(d) { return d.y; })
				.style('opacity', 0)
				.transition()
					.duration(duration)
					.style('opacity', 1)
					.each('end', function() {
						scenario._next();
					});
			objects.exit().remove();
		};

		this.performTransfer = function(scenario, transfer) {
			var duration = self.computeDuration(this.options.duration.doTransfer);

			var pathNode = d3.select('#' + transfer.source.name + '_' + transfer.target.name).node();
			var pathLength = pathNode.getTotalLength();
			var g_obj = this.group.append('g')
				.classed('transfer', true)
				.attr('transform', 'translate(-12, -12)');
			g_obj.append('use')
				.attr('transform', function(d) {
					var p = pathNode.getPointAtLength(0)
					return "translate(" + [p.x, p.y] + ")";
				})
				.attr('xlink:href', '#' + transfer.object.name)
				.transition()
					.duration(duration)
					.ease("linear")
					.attrTween("transform", function (d, i) {
						return function (t) {
							var p = pathNode.getPointAtLength(pathLength*t);
							return "translate(" + [p.x, p.y] + ")";
						}
					})
				.each('end', function() {
					g_obj.remove();
					self._addObject(scenario, transfer.target.name, transfer.object.name, transfer.object.source, 0);
				});
		};

		this.store = function(objectName) {
			this.scenario.push({
				function: this._store,
				args: arguments,
				name: 'store',
				object: this
			});
		};

		this._store = function(objectName) {
			var scenario = this.scenario.getThread(arguments);
			var object_address = CryptoJS.SHA1(CryptoJS.SHA1(objectName)).toString();

			var list = [];
			for (nodeName in this.nodes) {
				var node = this.nodes[nodeName];
				list.push(node.start_address);
			}

			list.push(object_address);
			list.sort();
			var index = list.indexOf(object_address);
			if (index == 0) {
				index = list.length;
			}
			var node_name = this.addressMap[list[index - 1]];
			this._requestObject(scenario, node_name, objectName);
		};
	};

	sim.Node = function(n) {
		this.name = n.name;
		this.image = n.image;
		this.parent = null;

		this.links = [];

		this.objects = [];

		this.setSelector = function(selector) {
			this.selector = selector;
		};

		this.addObject = function(name, source, doItNow) {
			this.parent.addObject(this.name, name, source, doItNow);
		};

		this.requestObject = function(name) {
			this.parent.requestObject(this.name, name);
		};
	};

	sim.Random = function(seed) {
		this.seed = seed || '0';

		this.random = function(min, max) {
			min = min || 0;
			max = max || 1000;
			this.seed = CryptoJS.SHA1(this.seed).toString();
			return (parseInt(this.seed, 16) % (max - min)) + min;
		};
	};
})(sim)
