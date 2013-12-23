(function(sim, undefined) {
	sim.AddressPicker = function(mr, field, cache) {
		var self = this;
		this.mr = mr;
		this.address = null;
		this.field = $(field);
		this.cache_dataset = [];
		this.cache = d3.select(cache);



		this.activate = function() {
			var rings = this.mr.svg.selectAll('g.ring');
			rings
				.on('mousemove', function(d) {
					console.log('mousemove: ' + d.name);
					d.address_picker = [ 0 ];
					self.refresh();
				})
				.on('mouseout', function(d) {
					console.log('mouseout');
					delete d.address_picker;
					self.field.val('');
					self.refresh();
				})
				.on('click', function(d) {
					delete d.address_picker;
					rings.on('mousemove', null)
						.on('mouseout', null)
						.on('click', null);
					self.refresh();
					self.cache_dataset.push(self.address);
					self.refreshCache();
				});
		};

		this.refresh = function() {
			var rings = this.mr.svg.selectAll('g.ring');
			var path = rings.selectAll('path.address_picker').data(function(d) {
				console.log(d);
				return d.address_picker || [];
			});
			path.exit().remove();
			path.enter().insert('path', ':first-child')
				.classed('address_picker', true);

			var perimeter = parseInt('1' + new Array(41).join('0'), 16);
			var address = this.field.val();
			path.attr('d', function(d) {
				console.log(d);
				var mouse_coord = d3.mouse(this);
				var x = mouse_coord[0];
				var y = mouse_coord[1];
				var angle = Math.acos(x / Math.sqrt(x*x + y*y));
				if (y < 0) {
					angle = -angle;
				}
				var r = mr.ring_r(d) + 10;

				var x1 = r*Math.cos(angle);
				var y1 = r*Math.sin(angle);
				angle = -angle;
				if (angle < 0) {
					angle += 2 * Math.PI;
				}

				address = Math.floor((angle / (2 * Math.PI)) * perimeter).toString(16);
				address = address.padleft(40, '0');
				return 'M0,0 ' + x1 + ',' + y1;
			});
			this.field.val(address);
			this.field.css('background-color', this.mr.getColorFromAddress(address));
			this.address = address;
		};

		this.refreshCache = function() {
			var address = this.cache.selectAll('div.object').data(this.cache_dataset);
			address.exit().remove();

			address.enter().append('div');

			address.classed('object', true)
				.attr('title', function(d) { console.log(d);return d; })
				.style('background-color', function(d) { return self.mr.getColorFromAddress(d); })
				.on('click', function(d) {
					self.field.val(d)
						.css('background-color', self.mr.getColorFromAddress(d));
				});
		};

		this.refreshCache();
		this.field.val('');
		this.field.css('background-color', '');
	};
})(sim)
