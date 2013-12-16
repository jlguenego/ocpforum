function Simulation() {
};

var sim = new Simulation();

(function(sim, undefined) {
	sim.MultiRingDS = function(thread, svg) {
		var self = this;

		this.thread = thread;
		this.svg = svg;
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};
		this.defs = this.svg.append('defs');
		this.group = this.svg.insert('g', ':first-child').classed('main', true)
			.attr('transform', 'translate(0, ' + (this.svgbox.y / 2) + ')');
		this.links_g = this.group.insert('g', ':first-child').classed('links', true);
		this.reportElem = null;

		this.options = {
			duration: {
				refreshRing: 500,
				addNode: 100,
				addLink: 100,
				addObject: 100,
				doTransfer: 500,
				transform: 500
			},
			ring: {
				radius: 300,
				node: {
					scale: 2
				}
			},
			storage_method: 'redundancy_first'
		};

		this.rings = {};
		this.nodes = {};
		this.links = {};
		this.objects = {};
		this.locator = {};

		this.scale = 1;

		this.ring_cx = function(d) {
			var width = self.options.ring.radius * 2 + 200;
			return width * d.index + width / 2;
		};
		this.ring_cy = function(d) {
			return 0;
		};
		this.ring_r = function(d) {
			return self.options.ring.radius;
		};

		this.addRing = function(name) {
			this.thread.push({
				function: this._addRing,
				args: arguments,
				name: 'addRing',
				object: this
			});
		};

		this._addRing = function(name, i) {
			var thread = this.thread.getThread(arguments);

			this.rings[name] = {
				name: name,
				index: i,
				nodes: {}
			};
			this.refreshRings(thread);
		};

		this.refreshMain = function() {
			var bbox = this.group.node().getBBox();
			if (bbox.width == 0) {
				return;
			}
			var scale = this.scale;
			var box_width = this.svgbox.x * 0.9;
			var box_height = this.svgbox.y * 0.9;

			if (bbox.width > box_width) {
				scale = (box_width / bbox.width);
			}
			if (bbox.height > box_height) {
				scale = Math.min(box_height / bbox.height, box_width / bbox.width);
			}
			this.scale = scale;
			var y = this.svgbox.y / 2;
			this.group.transition()
				.duration(this.options.duration.refreshRing)
				.attr('transform', 'translate(0, ' + y + ') scale(' + this.scale + ')');
		};

		this.refreshRings = function(thread) {
			var dataset = d3.values(this.rings);

			var ring_g = this.group.selectAll('g.ring').data(dataset);
			ring_g.exit().remove();

			var new_ring_g = ring_g.enter().append('g')
				.classed('ring', true);
			new_ring_g.append('circle')
					.attr('r', 0);

			if (dataset.length == 0) {
				return;
			}
			var first_ring = dataset[0];

			ring_g.select('circle').attr('r', this.ring_r);

			ring_g.transition()
				.duration(this.options.duration.refreshRing)
				.attr('transform', function(d) {
					return 'translate(' + self.ring_cx(d) + ', ' + self.ring_cy(d) + ')';
				})
				.each('end', function(d) {
					if (d.name == first_ring.name) {
						self.refreshMain();
						thread._next();
					}
				});


		};

		this.addNode = function(node) {
			node.parent = this;
			this.thread.push({
				function: this._addNode,
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

		this._addNode = function(node) {
			var thread = this.thread.getThread(arguments);

			this.nodes[node.name] = node;
			this.rings[node.ring].nodes[node.name] = node;

			this.refreshNodes(thread);
		};

		this.refreshNodes = function(thread) {
			var dataset = d3.values(this.rings);
			var ring_g = this.svg.selectAll('g.ring').data(dataset);

			var node = ring_g.selectAll('g.node')
				.data(function(d, i) { return d3.values(d.nodes); });
			node.exit().remove();

			var new_g = node.enter().append('g')
				.classed('node', true)
				.style('opacity', 0);

			var text = new_g.append('text')
				.attr('x', 25)
				.style('opacity', 0);
			text.append('tspan')
				.text(function(d) { return d.name; });

			new_g.on('mouseover', function() {
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

			new_g.append('image')
				.attr('xlink:href', function(d) { return d.image; })
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			new_g.transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 1)
				.each('end', function() {
					thread._next();
				});

			node.attr('transform', function(d) {
				// 0, 0: center of the ring.
				var ring = self.rings[d.ring];
				var r = self.ring_r(ring);
				var angle = (parseInt(d.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
				var x = r * Math.cos(angle);
				var y = - r * Math.sin(angle);
				return 'translate(' + x + ', ' + y + ') scale(' + self.options.ring.node.scale + ')';
			});
		};

		this.addLinks = function(topologyName) {
			this.thread.push({
				function: this._addLinks,
				args: arguments,
				name: 'addLinks',
				object: this
			});
		};

		this._addLinks = function(topologyName) {
			var thread = this.thread.getThread(arguments);

			if (topologyName == 'topology_all_to_all') {
				this.addTopoA2A(thread);
			} else if (topologyName == 'topology_optimum') {
				this.addTopoOptimum(thread);
			}
		};

		this.addTopoA2A = function(thread) {
			var nodeName_a = d3.keys(this.nodes);
			for (var i = 0; i < nodeName_a.length; i++) {
				for (var j = 0; j < nodeName_a.length; j++) {
					if (i == j) {
						continue;
					}
					this.thread.unshift({
						function: this._addLink,
						args: [ nodeName_a[i], nodeName_a[j] ],
						name: 'addLink',
						object: this
					});
				}
			}
			thread._next();
		};

		this.addTopoOptimum = function(thread) {
			for (var ringName in this.rings) {
				var ring = this.rings[ringName];

				var addressMap = {};
				var addressList = [];
				for (var nodeName in ring.nodes) {
					var node = ring.nodes[nodeName];
					addressMap[node.start_address] = node.name;
					addressList.push(node.start_address);
				}

				addressList.sort();
				var nbr = addressList.length;
				for (var i = 0; i < nbr; i++) {
					for (var j = 1; j <= nbr; j = j * 2) {
						var j2 = (i + j) % nbr;
						var sourceNodeName = addressMap[addressList[i]];
						var targetNodeName = addressMap[addressList[j2]];

						this.thread.unshift({
							function: this._addLink,
							args: [ sourceNodeName, targetNodeName ],
							name: 'addLink',
							object: this
						});
						this.thread.unshift({
							function: this._addLink,
							args: [ targetNodeName, sourceNodeName ],
							name: 'addLink',
							object: this
						});
					}
				}
			}

			for (var nodeName in this.nodes) {
				var node = this.nodes[nodeName];
				var start_address = node.start_address;

				for (var ringName in this.rings) {
					if (node.ring == ringName) {
						continue;
					}

					var ringNode = this.getNodeResponsibleForRing(ringName, start_address);
					this.thread.unshift({
						function: this._addLink,
						args: [ nodeName, ringNode.name ],
						name: 'addLink',
						object: this
					});
				}
			}


			thread._next();
		};

		this.getNodeResponsibleForRing = function(ringName, address) {
			var nodes = this.rings[ringName].nodes;
			var addressList = [];
			for (var nodeName in nodes) {
				var n = nodes[nodeName];
				if (n.start_address == address) {
					return n;
				}
				addressList.push(n.start_address);
			}

			addressList.push(address);

			addressList.sort();
			var index = addressList.indexOf(address);
			if (index == 0) {
				index = addressList.length;
			}
			var node_address = addressList[index - 1];

			var node = d3.values(nodes).find(function(d) {
				return d.start_address == node_address;
			});

			return node;
		};

		this.addLink = function(sourceName, targetName) {
			this.thread.push({
				function: this._addLink,
				args: arguments,
				name: 'addLink',
				object: this
			});
		};

		this._addLink = function(sourceName, targetName) {
			var thread = this.thread.getThread(arguments);

			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];
			this.links[source.name + '_' + target.name] = {
				source: source,
				target: target,
				id: source.name + '_' + target.name
			};

			target.links.in.push(source);
			source.links.out.push(target);
			if (source.ring == target.ring) {
				source.links.out_ring.push(target);
			}
			this.refreshLinks(thread);
		};

		this.refreshLinks = function(thread) {
			var doNext = true;
			var dataset = d3.values(this.links);

			var path = this.links_g.selectAll('path').data(dataset);
			path.exit().remove();

			var new_path = path.enter().append('path');
			path.attr('id', function(d) { return d.id; })
				.attr('d', function(d) {
					var source_coord = d.source.getAbsoluteCoord();
					var target_coord = d.target.getAbsoluteCoord();
					var bbox = self.group.node().getBBox();

					var p1 = {
						x: ((bbox.width / 2) + source_coord.x) / 2,
						y: (source_coord.y) / 2
					};
					var p2 = {
						x: ((bbox.width / 2) + target_coord.x) / 2,
						y: (target_coord.y) / 2
					};

					if (d.source.ring == d.target.ring) {
						var ring = self.rings[d.source.ring];
						var cx = self.ring_cx(ring);
						var cy = self.ring_cy(ring);

						p1 = {
							x: (cx + source_coord.x) / 2,
							y: (cy + source_coord.y) / 2
						};
						p2 = {
							x: (cx + target_coord.x) / 2,
							y: (cy + target_coord.y) / 2
						};
					}
					return 'M' + source_coord.x + ',' + source_coord.y
						+ ' C' + p1.x + ',' + p1.y + ' ' + p2.x + ',' + p2.y
						+ ' ' + target_coord.x + ',' + target_coord.y;
				});

			if (new_path.empty()) {
				thread._next();
			}
			new_path.attr('stroke-dasharray', function(d) {
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
					.duration(this.options.duration.addLink)
					.attr('stroke-dashoffset', 0)
					.each('end', function(d, i) {
						if (doNext) {
							doNext = false;
							thread._next();
						}
					});
		};

		this.addObject = function(nodeName, name, source) {
			this.thread.push({
				function: this._addObject,
				args: [ nodeName, name, source, undefined ],
				name: 'addObject',
				object: this
			});
		};

		this._addObject = function(nodeName, name, source, duration) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			var obj = {
				name: name,
				source: source
			};
			node.objects[obj.name] = obj;
			this.objects[obj.name] = obj;

			this.refreshObjects(thread, duration);
		};

		this.refreshObjects = function(thread, duration) {
			if (duration === undefined) {
				duration = this.options.duration.addObject;
			}

			var symbols = this.defs.selectAll('symbol').data(d3.values(this.objects));
			symbols.exit().remove();
			symbols.enter().append('symbol')
				.attr('id', function(d) {
					return d.name;
				})
				.append('image')
					.attr('xlink:href', function(d) { return d.source; })
					.attr('width', 25)
					.attr('height', 25);

			var nodes = this.group.selectAll('g.node');
			var objects = nodes.selectAll('use.object').data(function(d) { return d3.values(d.objects); });

			objects.exit().remove();
			var new_objects = objects.enter();
			if (new_objects.empty()) {
				thread._next();
			}
			new_objects.append('use')
				.classed('object', true)
				.attr('xlink:href', function(d) { return '#' + d.name; })
				.attr('x', 0)
				.attr('y', 0)
				.style('opacity', 0)
				.transition()
					.duration(duration)
					.style('opacity', 1)
					.each('end', function() {
						thread._next();
					});

		};

		this.store = function(nodeName, objectName) {
			this.thread.push({
				function: this._store,
				args: arguments,
				name: 'store',
				object: this
			});
		};

		this._store = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			if (this.options.storage_method == 'redundancy_first') {
				this._storeRF(thread, nodeName, objectName);
			} else if (this.options.storage_method == 'redundancy_last') {
				this._storeRL(thread, nodeName, objectName);
			}
		};

		this._storeRF = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.store(thread, objectName);

			this.sendToOtherRings(thread, node, objectName);

		};

		this._storeRL = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.store(thread, objectName, { initial_ring: node.ring });
		};

		this.sendToOtherRings = function(thread, node, objectName) {
			for (var ringName in this.rings) {
				if (ringName == node.ring) {
					continue;
				}

				var object_address = CryptoJS.SHA1(CryptoJS.SHA1(objectName)).toString();
				var ringNode = node.getResponsibleForRing(ringName, object_address);

				if (!ringNode) {
					continue;
				}

				var tname = objectName + '_' + ringName;
				var new_thread = new Thread(tname, thread);
				this.doTransfer(new_thread, node.name, ringNode.name, objectName);
				new_thread.push({
					function: this._storeRec,
					args: [ ringNode.name, objectName, {} ],
					name: '_storeRec',
					object: this
				});
				new_thread.start();
			}
		};

		this._storeRec = function(nodeName, objectName, context) {
			var thread = this.thread.getThread(arguments);
			var node = this.nodes[nodeName];
			node.store(thread, objectName, context);
		};

		this.retrieve = function(nodeName, objectName) {
			this.thread.push({
				function: this._retrieve,
				args: arguments,
				name: 'retrieve',
				object: this
			});
		};

		this._retrieve = function(nodeName, objectName) {
			var thread = this.thread.getThread(arguments);

			var node = this.nodes[nodeName];
			node.retrieve(thread, objectName, { initial: true });
		};

		this.doTransfer = function(thread, sourceName, targetName, objectName) {
			thread.unshift({
				function: this._doTransfer,
				args: [ sourceName, targetName, objectName ],
				name: 'doTransfer',
				object: this
			});
		};

		this._doTransfer = function(sourceName, targetName, objectName) {
			var thread = this.thread.getThread(arguments);
			var source = this.nodes[sourceName];
			var target = this.nodes[targetName];
			var transfer = {
				source: source,
				target: target,
				object: this.objects[objectName]
			};

			this.performTransfer(thread, transfer);
		};

		this.performTransfer = function(thread, transfer) {
			var duration = this.options.duration.doTransfer;

			var pathNode = d3.select('#' + transfer.source.name + '_' + transfer.target.name).node();
			var pathLength = pathNode.getTotalLength();
			var g_obj = this.group.append('g')
				.classed('transfer', true)
				.attr('transform', 'translate(-12, -12)');


			g_obj.append('use')
				.attr('transform', function(d) {
					var p = pathNode.getPointAtLength(0)
					return 'translate(' + [p.x, p.y] + ') scale(' + self.options.ring.node.scale + ')';
				})
				.attr('xlink:href', '#' + transfer.object.name)
				.transition()
					.duration(duration)
					.ease("linear")
					.attrTween("transform", function (d, i) {
						return function (t) {
							var p = pathNode.getPointAtLength(pathLength*t);
							return 'translate(' + [p.x, p.y] + ') scale(' + self.options.ring.node.scale + ')';
						}
					})
				.each('end', function() {
					g_obj.remove();
					self._addObject(thread, transfer.target.name, transfer.object.name, transfer.object.source, 0);

					self.report({ add_transfer: 1 });
				});
		};

		this.transform = function(transform_val) {
			this.thread.push({
				function: this._transform,
				args: arguments,
				name: 'transform',
				object: this
			});
		};

		this._transform = function(transform_val, scale_val) {
			var thread = this.thread.getThread(arguments);
			var transform = this.group.attr('transform');
			if (!transform) {
				transform = 'translate(0, ' + (this.svgbox.y / 2) + ') scale(' + this.scale + ')';
			}
			var scale = this.scale * scale_val;
			this.group.attr('transform', transform)
				.transition()
					.duration(this.options.duration.transform)
					.attr('transform', transform_val + ' scale(' + scale + ')')
					.each('end', function() {
						thread._next();
					});
		};

		this.report = function(report) {
			if (!this.reportElem) {
				return;
			}
			var event = new CustomEvent('multi_ring_stat', { detail: report });

			this.reportElem.dispatchEvent(event);
		};
	};

	sim.Node = function(n) {
		var self = this;

		this.name = n.name;
		this.image = n.image;
		this.start_address = n.start_address;
		this.parent = null;
		this.ring = n.ring;

		this.links = {
			in: [],
			out: [],
			out_ring: []
		};

		this.objects = {};

		this.getAbsoluteCoord = function() {
			var ring = this.parent.rings[this.ring];
			var cx = this.parent.ring_cx(ring);
			var cy = this.parent.ring_cy(ring);
			var r = this.parent.ring_r(ring);

			var angle = (parseInt(this.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
			var x = cx + r * Math.cos(angle);
			var y = cy - r * Math.sin(angle);
			return {
				x: x,
				y: y
			};
		};

		this.getAbsoluteCoordSVG = function() {
			var ring = this.parent.rings[this.ring];
			var cx = this.parent.ring_cx(ring);
			var cy = this.parent.ring_cy(ring);
			var r = this.parent.ring_r(ring);

			var angle = (parseInt(this.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
			var x = cx + r * Math.cos(angle);
			var y = cy - r * Math.sin(angle);

			var result = {
				x: x * this.parent.scale,
				y: (y * this.parent.scale) + (this.parent.svgbox.y / 2)
			};
			return result;
		};

		this.store = function(thread, objectName, context) {
			var next_node = this.getResponsible(objectName);

			if (this == next_node) {
				// This is the responsible node.
				if (this.parent.options.storage_method == 'redundancy_last') {
					if (context.initial_ring == this.ring) {
						this.parent.sendToOtherRings(thread, this, objectName);
					}
				}
				thread._next();
			} else {
				thread.unshift({
					function: this.parent._storeRec,
					args: [ next_node.name, objectName, context ],
					name: '_storeRec',
					object: this.parent
				});
				this.parent._doTransfer(thread, this.name, next_node.name, objectName);
			}
		};

		this.retrieve = function(thread, objectName, context) {
			var next_node = this.getResponsible(objectName);

			if (this == next_node) {
				// This is the responsible node.
				if (!this.objects[objectName]) {
					throw new Error('Object not found on ' + this.name + ': ' + objectName);
				}
				thread._next();
			} else {
				this.parent.doTransfer(thread, next_node.name, this.name, objectName);
				next_node.retrieve(thread, objectName, { initial: false });
			}
		};

		this.getResponsible = function(objectName) {
			var object_address = CryptoJS.SHA1(CryptoJS.SHA1(objectName)).toString();

			var ring = this.links.out_ring.map(function(d) { return d.start_address; });

			ring.push(this.start_address);
			ring.push(object_address);

			ring.sort();
			var index = ring.indexOf(object_address);
			if (index == 0) {
				index = ring.length;
			}
			var node_address = ring[index - 1];

			if (node_address == this.start_address) {
				// Object is stored.
				return this;
			}

			var node = this.links.out_ring.find(function(d) {
				return d.start_address == node_address;
			});

			return node;
		};

		this.getResponsibleForRing = function(ringName, object_address) {
			var ring = [];
			for (var nodeName in this.links.out) {
				var n = this.links.out[nodeName];
				if (n.ring != ringName) {
					continue;
				}
				if (n.start_address == object_address) {
					return n;
				}
				ring.push(n.start_address);
			}

			ring.push(object_address);

			ring.sort();
			var index = ring.indexOf(object_address);
			if (index == 0) {
				index = ring.length;
			}
			var node_address = ring[index - 1];

			var node = this.links.out.find(function(d) {
				return (d.start_address == node_address) && (d.ring == ringName);
			});

			return node;
		};
	};
})(sim)
