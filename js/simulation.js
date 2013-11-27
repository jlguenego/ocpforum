function Simulation() {
};

var sim = new Simulation();

(function(sim, undefined) {
	sim.DistributedSystem = function(svg) {
		var self = this;

		this.nodes = [];
		this.links = [];
		this.requests = [];
		this.svg = svg;
		this.defs = this.svg.append('defs');
		this.isVisible = false;

		this.transfer_duration = 1000;

		this.delay = 0;

		this.addNode = function(node) {
			this.nodes.push(node);
			node.parent = this;
			this.refresh();
		};

		this.addLink = function(source, target) {
			this.links.push({
				source: source,
				target: target,
				id: source.name + '_' + target.name
			});
			this.refresh();
		};

		this.addRequest = function(objectName, target) {
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

			this.requests.push(transfer);
			this.refresh();
		};

		this.refresh = function() {
			this.refreshNodes();
			this.refreshLinks();
			this.refreshObjects();
			this.refreshObjectsSend();
		};

		this.refreshNodes = function() {
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
				.attr('x', function(d) { return d.lat; })
				.attr('y', function(d) { return d.lng; })
				.attr('transform', 'translate(-25, -25)')
				.attr('width', 50)
				.attr('height', 50);

			g.transition()
				.delay(function(d) {
					var delay = self.delay;
					self.delay += duration;
					return delay;
				})
				.duration(duration)
				.style('opacity', 1);

			// Update
			// nodes.attr()...

			// Exit
			nodes.exit().remove();
		};

		this.refreshLinks = function() {
			var duration = 1000;

			var links = this.svg.selectAll('path.link')
				.data(this.links);

			var path = links.enter().insert('path', ":first-child");
			path.classed('link', true)
				.attr('stroke', 'red')
				.attr('fill', 'none')
				.attr('id', function(d) { return d.id; })
				.attr('d', function(d) {
					return 'M' + d.source.lat + ',' + d.source.lng + ' C500,100 500,100 ' + d.target.lat + ',' + d.target.lng;
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
					.delay(function(d) {
						var delay = self.delay;
						self.delay += duration;
						return delay;
					})
					.duration(duration)
					.attr('stroke-dashoffset', 0);
		};

		this.refreshObjects = function() {
			var duration = 1000;

			var objects = this.svg.selectAll('g.node')
				.selectAll('image.object')
				.data(function(d) {
					var objects = [];
					for (var i in d.objects) {
						objects[i] = d.objects[i];
						objects[i].lat = d.lat;
						objects[i].lng = d.lng;
					}
					return d.objects;
				});
			objects.enter().append('image')
				.classed('object', true)
				.attr('xlink:href', function(d) { return d.source; })
				.attr('x', function(d) { return d.lat; })
				.attr('y', function(d) { return d.lng; })
				.attr('width', 25)
				.attr('height', 25)
				.style('opacity', 0)
				.transition()
					.delay(function(d) {
						var delay = self.delay;
						self.delay += duration;
						return delay;
					})
					.duration(duration)
					.style('opacity', 1);
			objects.exit().remove();
		};

		this.refreshObjectsSend = function() {
			var duration = 1000;

			var tranfers = this.svg.selectAll('g.transfer')
				.data(this.requests);

			tranfers.exit().remove();

			var g_obj = tranfers.enter().append('g');

			var transition = g_obj.style('opacity', 0)
				.classed('transfer', true)
				.transition()
				.delay(function(d) {
					var delay = self.delay;
					self.delay += duration;
					return delay;
				})
				.style('opacity', 1);

			var delay = self.delay - duration;
			transition.each('end', function() {
					console.log('on end');
					g_obj.append('image')
						.attr('xlink:href', function(d) { return d.object.source; })
						.attr('transform', 'translate(-12, -12)')
						.attr('width', 25)
						.attr('height', 25)
						.append('animateMotion')
							.attr('begin', delay + 'ms')
							.attr('dur', duration + 'ms')
							.attr('repeatCount', 1)
							.append('mpath')
								.attr('xlink:href', function(d) {
									console.log(d);
									return '#' + d.source.name + '_' + d.target.name;
								});
				})
				.transition()
					.delay(function(d) {
						var delay = self.delay;
						self.delay += duration;
						return delay;
					})
					.remove()
					.each('end', function(d) {
						var index = self.requests.indexOf(d);
						console.log('index=' + index);
						self.requests.splice(index, 1);
					});
		};
	};

	sim.Node = function(n) {
		this.name = n.name;
		this.image = n.image;
		this.lat = n.lat;
		this.lng = n.lng;
		this.parent = null;

		this.objects = [];

		this.setSelector = function(selector) {
			this.selector = selector;
		};

		this.addObject = function(name, source) {
			this.objects.push({
				name: name,
				source: source
			});
			this.parent.refreshObjects();
		};

		this.requestObject = function(name) {
			this.parent.addRequest(name, this);
		};
	};
})(sim)
