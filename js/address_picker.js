(function(sim, undefined) {
	sim.AddressPicker = function(mr, field) {
		var self = this;
		this.mr = mr;
		this.angle = 0;
		this.field = $(field);

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
			var hue = (parseInt(address, 16) / perimeter) * 360;
			this.field.css('background-color', 'hsl(' + hue + ', 100%, 90%)')
		};
	};
})(sim)
