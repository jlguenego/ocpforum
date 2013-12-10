function Simulation() {
};

var sim = new Simulation();

(function(sim, undefined) {
	sim.MultiRingDS = function(scenario, svg) {
		var self = this;

		this.scenario = scenario;
		this.svg = svg;
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};
		this.links_g = this.svg.insert('g', ':first-child').classed('links', true);

		this.options = {
			duration: {
				refreshRing: 500,
				addNode: 100,
				addLink: 100
			},
			ring: {
				radius: 300,
				node: {
					scale: 2
				}
			}
		};

		this.rings = {};
		this.nodes = {};
		this.links = [];

		this.addRing = function(name) {
			this.scenario.push({
				function: this._addRing,
				args: arguments,
				name: 'addRing',
				object: this
			});
		};

		this._addRing = function(name, i) {
			var scenario = this.scenario.getThread(arguments);

			this.rings[name] = {
				name: name,
				index: i,
				nodes: {}
			};

			this.refreshRings();
		};

		this.refreshRings = function() {
			var ring_nbr = d3.values(this.rings).length;

			var dataset = d3.values(this.rings);

			var ring_g = this.svg.selectAll('g.ring').data(dataset);
			ring_g.exit().remove();

			var new_ring_g = ring_g.enter().append('g')
				.classed('ring', true)
				.attr('transform', 'scale(0)');
			new_ring_g.append('circle')
					.attr('r', 0);

			if (dataset.length == 0) {
				return;
			}
			var first_ring = dataset[0];

			var ring_cx = function(d) {
				var width = self.svgbox.x / ring_nbr;
				return width * d.index + width / 2;
			};
			var ring_cy = function(d) {
				return self.svgbox.y / 2;
			};
			var ring_r = function(d) {
				return self.options.ring.radius;
			};
			var scale = function(d) {
				return 1 / ring_nbr;
			};

			ring_g.select('circle').attr('r', ring_r);

			ring_g.transition()
				.duration(this.options.duration.refreshRing)
				.attr('transform', function(d) {
					return 'translate(' + ring_cx(d) + ', ' + ring_cy(d) + ') scale(' + scale(d) + ')';
				})
				.each('end', function(d) {
					if (d.name == first_ring.name) {
						scenario._next();
					}
				});


		};

		this.addNode = function(node) {
			node.parent = this;
			this.scenario.push({
				function: this._addNode,
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

		this._addNode = function(node) {
			var scenario = this.scenario.getThread(arguments);

			this.nodes[node.name] = node;
			console.log(node);
			this.rings[node.ring].nodes[node.name] = node;

			this.refreshNodes(scenario);
		};

		this.refreshNodes = function(scenario) {
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
					scenario._next();
				});

			var ring_r = function(d) {
				return self.options.ring.radius;
			};

			node.attr('transform', function(d) {
				// 0, 0: center of the ring.
				var ring = self.rings[d.ring];
				var r = ring_r(ring);
				var angle = (parseInt(d.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
				var x = r * Math.cos(angle);
				var y = - r * Math.sin(angle);
				return 'translate(' + x + ', ' + y + ') scale(' + self.options.ring.node.scale + ')';
			});
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

			target.links.in.push(source);
			source.links.out.push(target);
			this.refreshLinks(scenario);
		};

		this.refreshLinks = function(scenario) {
			var dataset = this.links;

			var path = this.links_g.selectAll('path').data(dataset);
			path.exit().remove();

			var new_path = path.enter().append('path');
			path.attr('id', function(d) { return d.id; })
				.attr('d', function(d) {
					var source_coord = self.getNodeAbsoluteCoord(d.source);
					var target_coord = self.getNodeAbsoluteCoord(d.target);
					var p1 = {
						x: ((self.svgbox.x / 2) + source_coord.x) / 2,
						y: ((self.svgbox.y / 2) + source_coord.y) / 2
					};
					var p2 = {
						x: ((self.svgbox.x / 2) + target_coord.x) / 2,
						y: ((self.svgbox.y / 2) + target_coord.y) / 2
					};

					if (d.source.ring == d.target.ring) {
						var ring_nbr = d3.values(self.rings).length;
						var width = self.svgbox.x / ring_nbr;

						var ring = self.rings[d.source.ring];
						var cx = width * ring.index + width / 2;
						var cy = self.svgbox.y / 2;

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
						scenario._next();
					});
		};

		this.getNodeAbsoluteCoord = function(node) {
			var ring_nbr = d3.values(this.rings).length;
			var width = this.svgbox.x / ring_nbr;

			var ring = this.rings[node.ring];
			var cx = width * ring.index + width / 2;
			var cy = this.svgbox.y / 2;
			var r = self.options.ring.radius / ring_nbr;

			var angle = (parseInt(node.start_address.substr(0, 4), 16) / 0xffff) * 2 * Math.PI;
			var x = cx + r * Math.cos(angle);
			var y = cy - r * Math.sin(angle);
			return {
				x: x,
				y: y
			};
		};
	};

	sim.Node = function(n) {
		this.name = n.name;
		this.image = n.image;
		this.start_address = n.start_address;
		this.parent = null;
		this.ring = n.ring;
		this.links = {
			in: [],
			out: []
		};
	};
})(sim)
