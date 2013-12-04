function Animation() {
};

var anim = new Animation();

(function(anim, undefined) {
	anim.Object = function(scenario, svg, source, center) {
		var self = this;

		this.center = center;

		this.source = source;
		this.svg = svg;
		this.defs = this.svg.append('defs');
		this.image = null;
		this.group = null;

		this.crypted = new Image();
		this.crypted.src = 'image/test/crypted.jpg';

		this.blocks = [];
		this.scenario = scenario;

		this.im = null;
		this.width = 200;
		this.height = 0;

		this.options = {
			duration: {
				show: 500,
				split: 1000,
				crypt: 500,
				minimize: 1000,
				sendBlock: 1000
			},
			scale: {
				minimize: 0.3
			},
			h: 1.5
		};

		this.show = function() {
			this.scenario.push({
				function: this._show,
				args: arguments,
				name: 'show',
				object: this
			});
		};

		this._show = function() {
			this.im = new Image();
			this.im.src = this.source;
			this.im.onload = function() {
				self.height = self.width * (self.im.height / self.im.width);

				self.image = self.svg.append('image')
					.attr('xlink:href', self.source)
					.style('opacity', 0)
					.attr('width', self.width)
					.attr('height', self.height)
					.attr('x', self.center.x - self.width / 2)
					.attr('y', self.center.y - self.height / 2)
					.attr('preserveAspectRatio', 'xMinYMin')
					.style('opacity', 0);
				self.image.transition()
						.duration(self.options.duration.show)
						.style('opacity', 1)
						.each('end', function() {
							self.scenario._next();
						});
			};
		};

		this.split = function(row, col) {
			for (var i = 0; i < row; i++) {
				for (var j = 0; j < col; j++) {
					this.blocks.push({
						name: 'flower_' + i + '_' + j
					});
				}
			}
			this.scenario.push({
				function: this._split,
				args: arguments,
				name: 'split',
				object: this
			});
		};

		this._split = function(row, col) {
			var dataset = [];

			for (var i = 0; i < row; i++) {
				for (var j = 0; j < col; j++) {
					dataset.push({
						i: i,
						j: j,
						name: 'flower_' + i + '_' + j
					});
				}
			}

			var cell_width = this.width / col;
			var cell_height = this.height / row;

			this.group = this.svg.append('g')
				.attr('id', 'g');

			var svg = this.group.selectAll('svg').data(dataset);

			var subsvg = svg.enter().append('svg')
				.attr('x', function(d) {
					var offset_x = d.j * cell_width;
					var x = (self.center.x - self.width / 2) + offset_x;
					return x;
				})
				.attr('y', function(d) {
					var offset_y = d.i * cell_height;
					var y = (self.center.y - self.height / 2) + offset_y;
					return y;
				})
				.attr('height', cell_height)
				.attr('width', cell_width)
				.attr('overflow', 'hidden')
				.attr('id', function(d) {
					return d.name;
				});

			subsvg.append('image')
				.attr('xlink:href', this.source)
				.attr('x', function(d) {
					var offset_x = d.j * cell_width;
					return -offset_x;
				})
				.attr('y', function(d) {
					var offset_y = d.i * cell_height;
					return -offset_y;
				})
				.attr('width', this.width)
				.attr('height', this.height);

			this.image.transition()
				.duration(20)
				.style('opacity', 0)
				.remove();

			subsvg.transition()
				.duration(self.options.duration.split)
				.attr('x', function(d) {
					var offset_x = self.options.h * d.j * cell_width;
					var x = (self.center.x - (self.options.h * self.width) / 2) + offset_x;
					return x;
				})
				.attr('y', function(d) {
					var offset_y = self.options.h * d.i * cell_height;
					var y = (self.center.y - (self.options.h * self.height) / 2) + offset_y;
					return y;
				})
				.each('end', function(d) {
					if (d.i == 0 && d.j == 0) {
						self.scenario._next();
					}
				});
		};

		this.crypt = function() {
			this.scenario.push({
				function: this._crypt,
				args: arguments,
				name: 'crypt',
				object: this
			});
		};

		this._crypt = function() {
			this.group.selectAll('svg')
				.each(function(d) {
					d.width = parseInt(d3.select(this).attr('width'));
					d.x = parseInt(d3.select(this).attr('x'));
				});
			this.group.selectAll('svg')
				.transition()
					.duration(self.options.duration.crypt)
					.attr('width', 0)
					.attr('x', function(d) {
						var r = d.x + d.width / 2;
						return r;
					})
					.each('end', function() {
						d3.select(this).select('image')
								.attr('xlink:href', self.crypted.src);
					})
					.transition()
						.duration(self.options.duration.crypt)
						.attr('width', function(d) { return d.width; })
						.attr('x', function(d) { return d.x; })
						.each('end', function(d) {
							if (d.i == 0 && d.j == 0) {
								self.scenario._next();
							}
						});
		};

		this.minimize = function() {
			this.scenario.push({
				function: this._minimize,
				args: arguments,
				name: 'minimize',
				object: this
			});
		};

		this._minimize = function() {
			this.group
				.attr('transform', 'scale(1)')
				.transition()
					.duration(self.options.duration.minimize)
					.attr('transform', 'scale(' + self.options.scale.minimize + ')')
					.each('end', function() {
						self.scenario._next();
					});
		};

		this.sendBlock = function(block_name, coord) {
			this.scenario.push({
				function: this._sendBlock,
				args: arguments,
				name: 'sendBlock',
				object: this
			});
		};

		this._sendBlock = function(block_name, coord) {
			var svg = this.group.select('svg#' + block_name)
				.transition()
					.duration(self.options.duration.sendBlock)
					.attr('x', coord.x / self.options.scale.minimize)
					.attr('y', coord.y / self.options.scale.minimize)
					.each('end', function(d) {
						self.scenario._next();
					});
		};

		this.remove = function(block_name) {
			this.scenario.push({
				function: this._remove,
				args: arguments,
				name: 'remove',
				object: this
			});
		};

		this._remove = function(block_name) {
			this.group.select('svg#' + block_name).remove();
			this.scenario._next();
		};
	};
})(anim)
