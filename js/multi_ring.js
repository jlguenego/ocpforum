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

		this.options = {
			duration: {
				refreshRing: 500
			}
		};

		this.rings = {};
		this.nodes = {};

		this.addRing = function(name) {
			this.scenario.push({
				function: this._addRing,
				args: arguments,
				name: 'addRing',
				object: this
			});
		};

		this._addRing = function(name) {
			var scenario = this.scenario.getThread(arguments);

			this.rings[name] = {
				name: name,
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

			var y = this.svgbox.y / 2;
			var x = function(d, i) {
				var width = self.svgbox.x / ring_nbr;
				return width * i + width / 2;
			};

			ring_g.select('circle')
				.transition()
					.duration(this.options.duration.refreshRing)
					.attr('r', ((self.svgbox.x / ring_nbr) / 2) * 0.8);

			ring_g.transition()
				.duration(this.options.duration.refreshRing)
				.attr('transform', function(d, i) {
					return 'scale(1) translate(' + x(d, i) + ', ' + y + ')';
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

			this.refreshRings(scenario);
		};
	};

	sim.Node = function(n) {
		this.name = n.name;
		this.image = n.image;
		this.start_address = n.start_address;
		this.parent = null;
		this.ring = n.ring;
	};
})(sim)
