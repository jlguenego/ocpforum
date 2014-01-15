(function(sim, undefined) {
	stc.CycleAmount = function(sys) {
		var self = this;

		this.sys = sys;
		this.group = this.sys.svg.append('g').classed('cycle_amount', true);

		this.options = {
			duration: {
				show: 500,
				split: 1000
			},
			h: 1.5
		};

		this.show = function(thread) {
			thread.push({
				function: this._show,
				args: arguments,
				name: 'show',
				object: this
			});
		};

		this._show = function(thread) {
			this.group.append('rect')
				.classed('total_reward', true)
				.attr('width', 300)
				.attr('height', 10)
				.attr('x', this.sys.svgbox.x / 2 - 150)
				.attr('y', 50)
				.style('opacity', 0)
				.transition()
					.duration(this.options.duration.show)
					.style('opacity', 1)
					.each('end', function() {
						thread.next();
					});
		};

		this.split = function(thread) {
			thread.push({
				function: this._split,
				args: arguments,
				name: 'split',
				object: this
			});
		};

		this._split = function(thread) {
			var rects = this.group.selectAll('rect.reward').data(this.sys.nodes);

			if (this.sys.nodes.length < 1) {
				thread.next();
				return;
			}

			var reward_width = 300 / this.sys.nodes.length;
			var new_rects = rects.enter().append('rect')
				.classed('reward', true)
				.attr('x', function(d, i) {
					var offset_x = i * reward_width;
					var x = self.sys.svgbox.x / 2 - 150 + offset_x;
					return x;
				})
				.attr('y', 5)
				.attr('height', 10)
				.attr('width', reward_width);

			this.group.select('rect.total_reward')
				.transition()
					.duration(20)
					.style('opacity', 0)
					.remove();

			var doNext = true;
			rects.transition()
				.duration(this.options.duration.split)
				.attr('x', function(d, i) {
					var offset_x = self.options.h * i * reward_width;
					var x = ((self.sys.svgbox.x / 2) - (self.options.h * 300) / 2) + offset_x;
					return x;
				})
				.transition()
					.duration(500)
					.style('opacity', 0)
					.each('end', function(d) {
						if (doNext) {
							doNext = false;
							thread.next();
						}
					})
					.remove();
		};
	};
})(stc)
