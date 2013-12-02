function Simulation() {
};

var sim = new Simulation();

(function(sim, undefined) {
	sim.DistributedSystem = function(svg) {
		var self = this;

		this.orders = [];

		this.nodes = [];
		this.links = [];
		this.svg = svg;
		this.defs = this.svg.append('defs');
		this.isVisible = false;

		this.objects = {};

		this.start = function() {
			this._next();
		};

		this._next = function() {
			console.log(this);
			console.log(self.orders);
			var order = self.orders.shift();
			if (order) {
				order.function.apply(self, order.args);
			} else {
				console.log('no order anymore.');
			}
		};

		this.addNode = function(node) {
			node.parent = self;
			this.orders.push({
				function: self._addNode,
				args: arguments
			});
		};

		this._addNode = function(node) {
			self.nodes.push(node);
			self.refreshNodes();
			console.log(node);
		};

		this.addLink = function(source, target) {
			this.orders.push({
				function: self._addLink,
				args: arguments
			});
		};

		this._addLink = function(source, target) {
			this.links.push({
				source: source,
				target: target,
				id: source.name + '_' + target.name
			});
			this.refreshLinks();
		};

		this.addObject = function(obj, duration, notOrder) {
			if (notOrder === false) {
				this._addObject(obj, duration, notOrder)
				return;
			}
			this.orders.push({
				function: self._addObject,
				args: arguments
			});
		};

		this._addObject = function(obj, duration) {
			this.objects[obj.name] = obj;
			this.refreshObjects(duration);
		};

		this.addRequest = function(objectName, target) {
			this.orders.push({
				function: self._addRequest,
				args: arguments
			});
		};

		this._addRequest = function(objectName, target) {
			var transfer = null;
			for (var i in this.nodes) {
				var node = this.nodes[i];

				for (var j in node.objects) {
					var obj = node.objects[j];

					if (obj.name == objectName) {
						transfer = {
							source: node,
							target: target,
							object: obj
						};
						break;
					}
				}
			}

			this.performTransfer(transfer);
		};

		this.refreshNodes = function() {
			console.log(self);
			var duration = 1000;

			// Join data
			var nodes = this.svg.selectAll('g.node')
				.data(this.nodes);

			// Enter
			var g = nodes.enter().append('g');
			g.classed('node', true)
				.style('opacity', 0);

			g.append('image')
				.attr('xlink:href', function(d) { return d.image; })
				.attr('x', function(d) { return d.x; })
				.attr('y', function(d) { return d.y; })
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			g.transition()
				.duration(duration)
				.style('opacity', 1)
				.each('end', self._next);

			// Update
			// nodes.attr()...

			// Exit
			nodes.exit().remove();
		};

		this.refreshLinks = function() {
			var duration = 1000;

			var links = self.svg.selectAll('path.link')
				.data(self.links);

			var path = links.enter().insert('path', ":first-child");
			path.classed('link', true)
				.attr('stroke', 'red')
				.attr('fill', 'none')
				.attr('id', function(d) { return d.id; })
				.attr('d', function(d) {
					return 'M' + d.source.x + ',' + d.source.y + ' C500,100 500,100 ' + d.target.x + ',' + d.target.y;
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
					.each('end', self._next);
		};

		this.refreshObjects = function(duration) {
			duration = duration || 1000;

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



			var nodes = self.svg.selectAll('g.node').data(self.nodes);
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
					.each('end', self._next);
			objects.exit().remove();
		};

		this.performTransfer = function(transfer) {
			var duration = 1000;

			var pathNode = d3.select('#' + transfer.source.name + '_' + transfer.target.name).node();
			var pathLength = pathNode.getTotalLength();
			console.log(transfer);
			var g_obj = this.svg.append('g')
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
					transfer.target.addObject(transfer.object.name, transfer.object.source, 0, false);
				});
		};
	};

	sim.Node = function(n) {
		this.name = n.name;
		this.image = n.image;
		this.x = n.x;
		this.y = n.y;
		this.parent = null;

		this.objects = [];

		this.setSelector = function(selector) {
			this.selector = selector;
		};

		this.addObject = function(name, source, duration, notOrder) {
			var obj = {
				name: name,
				source: source
			};
			this.objects.push(obj);
			this.parent.addObject(obj, duration, notOrder);
		};

		this.requestObject = function(name) {
			this.parent.addRequest(name, this);
		};
	};
})(sim)
