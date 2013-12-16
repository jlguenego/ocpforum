function Animation() {
};

var anim = new Animation();

(function(anim, undefined) {
	anim.Object = function(thread, svg, source, center) {
		var self = this;

		this.center = center;

		this.source = source;
		this.svg = svg;
		this.defs = this.svg.append('defs');
		this.image = null;
		this.group = null;

		this.cryptedNbr = 7;

		this.crypted = [];
		for (var i = 0; i < this.cryptedNbr; i++) {
			var img = new Image();
			img.src = 'image/test/crypted_' + i + '.jpg'
			this.crypted.push(img);
		}

		this.blocks = {};
		this.thread = thread;

		this.im = null;
		this.width = 200;
		this.height = 0;

		this.cell_width = 0;
		this.cell_height = 0;

		this.options = {
			duration: {
				show: 500,
				split: 1000,
				crypt: 500,
				minimize: 1000,
				sendBlock: 1000,
				receiveBlock: 1000
			},
			scale: {
				minimize: 0.3
			},
			h: 1.5
		};

		this.show = function() {
			this.thread.push({
				function: this._show,
				args: arguments,
				name: 'show',
				object: this
			});
		};

		this._show = function() {
			var thread = this.thread.getThread(arguments);

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
						thread._next();
					});
			};
		};

		this.split = function(row, col) {
			for (var i = 0; i < row; i++) {
				for (var j = 0; j < col; j++) {
					var block = {
						i: i,
						j: j,
						name: 'flower_' + i + '_' + j
					};

					var hash = CryptoJS.SHA1(block.name).toString();
					var nbr = parseInt(hash.substr(0, 4), 16) % self.cryptedNbr;
					block.src = self.crypted[nbr].src;

					this.blocks[block.name] = block;
				}
			}
			this.thread.push({
				function: this._split,
				args: arguments,
				name: 'split',
				object: this
			});
		};

		this._split = function(row, col) {
			var thread = this.thread.getThread(arguments);

			var dataset = d3.values(this.blocks);

			this.cell_width = this.width / col;
			this.cell_height = this.height / row;

			this.group = this.svg.append('g')
				.attr('id', 'g');

			var svg = this.group.selectAll('svg').data(dataset);

			var subsvg = svg.enter().append('svg')
				.attr('x', function(d) {
					var offset_x = d.j * self.cell_width;
					var x = (self.center.x - self.width / 2) + offset_x;
					return x;
				})
				.attr('y', function(d) {
					var offset_y = d.i * self.cell_height;
					var y = (self.center.y - self.height / 2) + offset_y;
					return y;
				})
				.attr('height', this.cell_height)
				.attr('width', this.cell_width)
				.attr('overflow', 'hidden')
				.attr('id', function(d) {
					return d.name;
				});

			subsvg.append('image')
				.attr('xlink:href', this.source)
				.attr('x', function(d) {
					var offset_x = d.j * self.cell_width;
					return -offset_x;
				})
				.attr('y', function(d) {
					var offset_y = d.i * self.cell_height;
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
					var offset_x = self.options.h * d.j * self.cell_width;
					var x = (self.center.x - (self.options.h * self.width) / 2) + offset_x;
					return x;
				})
				.attr('y', function(d) {
					var offset_y = self.options.h * d.i * self.cell_height;
					var y = (self.center.y - (self.options.h * self.height) / 2) + offset_y;
					return y;
				})
				.each('end', function(d) {
					if (d.i == 0 && d.j == 0) {
						thread._next();
					}
				});
		};

		this.merge = function() {
			this.thread.push({
				function: this._merge,
				args: arguments,
				name: 'merge',
				object: this
			});
		};

		this._merge = function() {
			var thread = this.thread.getThread(arguments);

			var svg = this.group.selectAll('svg.block');

			svg.transition()
				.duration(self.options.duration.split)
				.attr('x', function(d) {
					var offset_x = d.j * self.cell_width;
					var x = (self.center.x - self.width / 2) + offset_x;
					return x;
				})
				.attr('y', function(d) {
					var offset_y = d.i * self.cell_height;
					var y = (self.center.y - self.height / 2) + offset_y;
					return y;
				})
				.each('end', function(d) {
					if (d.i != 0 || d.j != 0) {
						return;
					}
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
						.duration(20)
						.style('opacity', 1)
						.each('end', function() {
							thread._next();
						});
				})
				.transition()
					.duration(30)
					.remove();
		};

		this.encrypt = function() {
			this.thread.push({
				function: this._encrypt,
				args: arguments,
				name: 'encrypt',
				object: this
			});
		};

		this._encrypt = function() {
			var thread = this.thread.getThread(arguments);

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
					.each('end', function(d) {
						var hash = CryptoJS.SHA1(d.name).toString();
						var nbr = parseInt(hash.substr(0, 4), 16) % self.cryptedNbr;
						d3.select(this).select('image')
								.attr('xlink:href', function(d) { console.log(d);return d.src; });
					})
					.transition()
						.duration(self.options.duration.crypt)
						.attr('width', function(d) { return d.width; })
						.attr('x', function(d) { return d.x; })
						.each('end', function(d) {
							if (d.i == 0 && d.j == 0) {
								thread._next();
							}
						});
		};



		this.decrypt = function() {
			this.thread.push({
				function: this._decrypt,
				args: arguments,
				name: 'decrypt',
				object: this
			});
		};

		this._decrypt = function() {
			var thread = this.thread.getThread(arguments);

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
								.attr('xlink:href', self.source);
					})
					.transition()
						.duration(self.options.duration.crypt)
						.attr('width', function(d) { return d.width; })
						.attr('x', function(d) { return d.x; })
						.each('end', function(d) {
							if (d.i == 0 && d.j == 0) {
								thread._next();
							}
						});
		};

		this.minimize = function() {
			this.thread.push({
				function: this._minimize,
				args: arguments,
				name: 'minimize',
				object: this
			});
		};

		this._minimize = function() {
			var thread = this.thread.getThread(arguments);

			this.group
				.attr('transform', 'scale(1)')
				.transition()
					.duration(self.options.duration.minimize)
					.attr('transform', 'scale(' + self.options.scale.minimize + ')')
					.each('end', function() {
						thread._next();
					});
		};

		this.maximize = function() {
			this.thread.push({
				function: this._maximize,
				args: arguments,
				name: 'maximize',
				object: this
			});
		};

		this._maximize = function() {
			var thread = this.thread.getThread(arguments);

			this.group
				.attr('transform', 'scale(' + self.options.scale.minimize + ')')
				.transition()
					.duration(self.options.duration.minimize)
					.attr('transform', 'scale(1)')
					.each('end', function() {
						thread._next();
					});
		};

		this.sendBlock = function(block_name, ds, nodeName) {
			this.thread.push({
				function: this._sendBlock,
				args: arguments,
				name: 'sendBlock',
				object: this
			});
		};

		this._sendBlock = function(block_name, ds, nodeName) {
			var thread = this.thread.getThread(arguments);
			var node = ds.nodes[nodeName];
			var coord = node.getAbsoluteCoordSVG();

			var svg = this.group.select('svg#' + block_name)
				.transition()
					.duration(self.options.duration.sendBlock)
					.attr('x', coord.x / self.options.scale.minimize)
					.attr('y', coord.y / self.options.scale.minimize)
					.each('end', function(d) {
						thread._next();
					});
		};

		this.receiveBlock = function(block_name, ds, nodeName) {
			this.thread.push({
				function: this._receiveBlock,
				args: arguments,
				name: 'receiveBlock',
				object: this
			});
		};

		this._receiveBlock = function(block_name, ds, nodeName) {
			var thread = this.thread.getThread(arguments);
			var node = ds.nodes[nodeName];
			var coord = node.getAbsoluteCoordSVG();

			var block = this.blocks[block_name];

			var svg = this.group.append('svg').attr('id', block.name).classed('block', true);
			svg.data([block])
			svg.attr('x', coord.x / self.options.scale.minimize)
				.attr('y', coord.y / self.options.scale.minimize)
				.attr('height', this.cell_height)
				.attr('width', this.cell_width)
				.attr('overflow', 'hidden');

			svg.append('image')
				.attr('xlink:href', function(d) { return d.src; })
				.attr('x', function(d) {
					var offset_x = d.j * self.cell_width;
					return -offset_x;
				})
				.attr('y', function(d) {
					var offset_y = d.i * self.cell_height;
					return -offset_y;
				})
				.attr('width', this.width)
				.attr('height', this.height);

			svg.transition()
				.duration(self.options.duration.receiveBlock)
				.attr('x', function(d) {
					var offset_x = self.options.h * d.j * self.cell_width;
					var x = (self.center.x - (self.options.h * self.width) / 2) + offset_x;
					return x;
				})
				.attr('y', function(d) {
					var offset_y = self.options.h * d.i * self.cell_height;
					var y = (self.center.y - (self.options.h * self.height) / 2) + offset_y;
					return y;
				})
				.each('end', function(d) {
					//if (d.i == 0 && d.j == 0) {
						thread._next();
					//}
				});
		};

		this.remove = function(block_name) {
			this.thread.push({
				function: this._remove,
				args: arguments,
				name: 'remove',
				object: this
			});
		};

		this._remove = function(block_name) {
			var thread = this.thread.getThread(arguments);

			this.group.select('svg#' + block_name).remove();
			this.image.remove();
			thread._next();
		};

		this.sleep = function(duration) {
			this.thread.push({
				function: this._sleep,
				args: arguments,
				name: 'sleep',
				object: this
			});
		};

		this._sleep = function(duration) {
			var thread = this.thread.getThread(arguments);
			setTimeout(function() {
				thread._next();
			}, duration);
		};

		this.onClick = function(callback) {
			this.thread.push({
				function: this._onClick,
				args: arguments,
				name: 'onClick',
				object: this
			});
		};

		this._onClick = function(callback) {
			var thread = this.thread.getThread(arguments);
			this.image.classed('clickable', true)
				.on('click', callback);
			thread._next();
		};
	};
})(anim)
