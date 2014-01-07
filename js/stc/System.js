(function(sim, undefined) {
	stc.System = function(svg) {
		var self = this;

		this.svg = svg;
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};
		this.defs = this.svg.append('defs');
		this.defs.append('filter')
			.attr('id', 'darker')
			.append('feColorMatrix')
				.attr('type', 'matrix')
				.attr('in', 'SourceGraphic')
				.attr('values', '0.8 0 0 0 -0.2 0 0.8 0 0 -0.2 0 0 0.8 0 -0.2 0 0 0 1 0');

		var man = this.defs.append('symbol')
			.attr('id', 'actor_symbol')
			.attr('viewBox', '120 0 228 455')
			.attr('preserveAspectRatio', 'xMinYMin');
		man.append('path').attr('d', 'm212.828003,128.610001l-85.639999,89.031998l17.806,17.806l67.834,-72.072998l0.848999,121.252014l-58.507004,180.607971c0,0 38.156998,0.951019 39.005005,-0.744995c0.423004,-0.847992 42.395004,-167.143005 44.091003,-169.686981l47.483994,169.583984l36.459991,0l-58.505981,-178.911987l0.847992,-122.100006l69.528992,70.378006l20.351013,-16.959l-88.184021,-88.184006l-53.419983,0z')
		man.append('path').attr('d', 'm239.113998,12.4448c-79.705002,1.6958 -78.856995,105.990197 -2.543991,106.838197c82.248993,0 84.791992,-105.990197 2.543991,-106.838197z')
		man.selectAll('path').attr('fill', 'currentColor');

		this.group = this.svg.insert('g', ':first-child').classed('main', true);
			//.attr('transform', 'translate(0, ' + (this.svgbox.y / 2) + ')');

		this.options = {
			duration: {
				addActor: 1000
			},
			report_elem: null
		};
		this.scale = 1;

		this.foci = {
			actor: {x: 100, y: 100},
			node: {x: 200, y: 200}
		};
		this.actors = [];


		var tick = function(e) {
			var k = .1 * e.alpha;

			// Push nodes toward their designated focus.
			self.actors.forEach(function(d, i) {
				d.y += (self.foci[d.id].y - d.y) * k;
				d.x += (self.foci[d.id].x - d.x) * k;
			});

			var actors = self.group.selectAll('g.actor');

			actors.attr('transform', function(d) {
				return 'translate(' + d.x + ', ' + d.y + ') scale(' + stc.Utils.getActorScale(self) + ')';
			});
		};

		var force = d3.layout.force()
			.nodes(this.actors)
			.links([])
			.charge(function() {
				return -100 * stc.Utils.getActorScale(self);
			})
			.gravity(0)
			.size([this.svgbox.x, this.svgbox.y])
			.on("tick", tick)
			.start();

		this.addActor = function(thread, actor) {
			thread.push({
				function: this._addActor,
				args: arguments,
				name: 'addActor',
				object: this
			});
		};

		this._addActor = function(thread, actor) {
			actor.id = 'actor';
			actor.x = Math.randomize(0, this.svgbox.x);
			actor.y = Math.randomize(0, this.svgbox.y);
			console.log(this.svgbox);
			console.log(actor);
			this.actors.push(actor);
			this._repaintActors(thread);
		};

		this._repaintActors = function(thread) {
			var actors = this.group.selectAll('g.actor').data(this.actors);
			force.start();

			actors.exit().remove();

			var new_actors = actors.enter().append('g');

			if (new_actors.empty()) {
				thread.next();
			}

			new_actors.classed('actor', true)
				.style('opacity', 0)
				.append('use')
					.attr('xlink:href', window.location.href + '#actor_symbol')
					.attr('width', 50)
					.attr('height', 50)
					.attr('color', jlg.accessor('color'));

			var doNext = true;
			new_actors.transition()
				.duration(this.options.duration.addActor)
				.style('opacity', 1)
				.each('end', function() {
					if (doNext) {
						doNext = false;
						thread.next();
					}
				});

			actors.call(force.drag);
		};
	};
})(stc)
