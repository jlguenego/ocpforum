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


		this.group = this.svg.insert('g', ':first-child').classed('main', true)
			.attr('transform', 'translate(0, ' + (this.svgbox.y / 2) + ')');

		this.options = {
			duration: {
				addActor: 1000
			},
			report_elem: null
		};
		this.scale = 1;

		this.actors = {};

		this.addActor = function(thread, actor) {
			thread.push({
				function: this._addActor,
				args: arguments,
				name: 'addActor',
				object: this
			});
		};

		this._addActor = function(thread, actor) {
			this.actors[actor.name] = actor;
			this._repaintActors(thread);
		};

		this._repaintActors = function(thread) {
			var actors = this.group.selectAll('g.actor').data(d3.values(this.actors));

			actors.exit().remove();

			var new_actors = actors.enter().append('g');

			if (new_actors.empty()) {
				thread.next();
			}

			new_actors.classed('actor', true)
				.style('opacity', 0)
				.append('image')
					.attr('xlink:href', 'image/icon/man.svg')
					.attr('width', 25)
					.attr('height', 25);

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
		};
	};
})(stc)
