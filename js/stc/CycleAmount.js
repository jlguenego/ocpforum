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
				.attr('height', 50)
				.attr('x', this.sys.svgbox.x / 2 - 150)
				.attr('y', 50)
				.style('opacity', 0)
				.transition()
					.duration(1)
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

			var reward_width = 300 / self.sys.nodes.length;
			var new_rects = rects.enter().append('rect')
				.classed('reward', true)
				.attr('x', function(d, i) {
					var offset_x = i * reward_width;
					var x = self.sys.svgbox.x / 2 - 150 + offset_x;
					return x;
				})
				.attr('y', 50)
				.attr('height', 50)
				.attr('width', reward_width);

			this.group.select('rect.total_reward')
				.transition()
					.duration(20)
					.style('opacity', 0)
					.remove();

			var doNext = true;
			rects.transition()
				.duration(self.options.duration.split)
				.attr('x', function(d, i) {
					var offset_x = self.options.h * i * reward_width;
					var x = ((self.sys.svgbox.x / 2) - (self.options.h * 300) / 2) + offset_x;
					return x;
				})
				.each('end', function(d) {
					if (doNext) {
						doNext = false;
						thread.next();
					}
				});
		};

		this.sendReward = function(thread) {
			thread.push({
				function: this._sendReward,
				args: arguments,
				name: 'sendReward',
				object: this
			});
		};

		this._sendReward = function(thread) {
			var scale = stc.Utils.getNodeScale(this.sys);
			var doNext = true;
			var rect_size = 10;
			this.group.selectAll('rect.reward')
				.transition()
					.duration(1000)
					.attr('x', function(d) {
						console.log(d);
						return d.x + scale * sys.NODE_SIZE / 2 - rect_size / 2;
					})
					.attr('y', function(d) {
						console.log(d);
						return d.y + scale * sys.NODE_SIZE / 2 - rect_size / 2;
					})
					.attr('width', rect_size)
					.attr('height', rect_size)
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
