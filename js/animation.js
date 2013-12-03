function Animation() {
};

var anim = new Animation();

(function(anim, undefined) {
	anim.Object = function(svg, source, center) {
		var self = this;

		this.center = center;

		this.source = source;
		this.svg = svg;
		this.image = null;

		this.im = null;
		this.width = 200;
		this.height = 0;

		this.options = {
			duration: {
				show: 1000,
				split: 2000
			},
			h: 1.5
		};

		this.orders = [];

		this.start = function() {
			this._next();
		};

		this._next = function() {
			console.log('remaining orders');
			console.log(this.orders.map(function(d) { return d.name; }));
			var order = this.orders.shift();
			if (order) {
				order.function.apply(this, order.args);
			} else {
				console.log('no order anymore.');
			}
		};

		this.show = function() {
			this.orders.push({
				function: self._show,
				args: arguments,
				name: 'show'
			});
		};

		this._show = function() {
			this.im = new Image();
			this.im.src = this.source;
			console.log(this.im);
			this.im.onload = function() {
				self.height = self.width * (self.im.height / self.im.width);
				console.log('self.height=' + self.height);

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
							self._next();
						});
			};
		};

		this.split = function(row, col) {
			this.orders.push({
				function: self._split,
				args: arguments,
				name: 'split'
			});
		};

		this._split = function(row, col) {
			console.log('_split');
			this.image.remove();

			var dataset = [];

			for (var i = 0; i < row; i++) {
				for (var j = 0; j < col; j++) {
					dataset.push({ i: i, j: j });
				}
			}
			console.log(dataset);

			var cell_width = this.width / col;
			var cell_height = this.height / row;

			var g = this.svg.append('g');

			var svg = g.selectAll('svg').data(dataset);

			var subsvg = svg.enter().append('svg')
				.attr('x', function(d) {
					console.log(d);
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
				.attr('overflow', 'hidden');

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
				});

			this._next();
		};
	};
})(anim)