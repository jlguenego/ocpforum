(function( jlg, undefined ) {
	jlg.Table = function(selector, columns, dataset) {
		var self = this;

		this.columns = columns;
		this.dataset = dataset;
		this.selected_row = null;

		this.table = d3.select(selector).append('table').classed('ocp_table', true);
		this.header = this.table.append('thead').append('tr');
		this.body = this.table.append('tbody');

		// Build header
		for (var i = 0; i < this.columns.length; i++) {
			this.header.append('th')
				.classed('ocp_th', true)
				.html(this.columns[i]);
		}

		this.addRecord = function(record) {
			this.dataset.push(record);
		};

		this.removeRecord = function() {
			var index = this.dataset.indexOf(this.selected_row);
			if (index >= 0) {
				this.dataset.splice(index, 1);
			}
			this.selected_row = null;
		};

		this.repaint = function() {
			var tr = this.body.selectAll('tr').data(this.dataset, function(d) {return d;});

			var exit_tr = tr.exit();
			exit_tr.selectAll('div.cell')
				.transition()
					.duration(100)
					.style('height', '0px')
					.each('end', function(d, i) {
						if (i == 0) {
							exit_tr.remove()
						}
					});

			var new_tr = tr.enter().append('tr')
				.classed('ocp_row', true);

			new_tr.on('click', function(d) {
				tr.classed('selected', false);
				d3.select(this).classed('selected', true);
				self.selected_row = d;
			});

			var td = new_tr.selectAll('td').data(function(d) { return d; });
			var new_td = td.enter().append('td');
			new_td.append('div')
				.classed('cell', true)
				.style('height', '0px')
				.text(function(d) { return d; })
				.transition()
					.duration(100)
					.style('height', '20px');
		};

		this.move = function(p) {
			var tr = this.body.selectAll('tr.selected');
			if (tr.empty()) {
				return;
			}

			var data = [];
			var old_data = tr.datum();
			var old_div = tr.selectAll('div');

			old_div[0].forEach(function(d, i) {
				var width = d.getBoundingClientRect().width;
				data[i] = { width: width, data: old_data[i] };
			});

			var bbox = tr.node().getBoundingClientRect();

			var div = d3.select('body').append('div').classed('moving_box', true);
			div
				.style('top', bbox.top + 'px')
				.style('left', bbox.left + 'px')
				.style('width', bbox.width + 'px')
				.style('height', bbox.height + 'px');

			var moving_tr = div.append('table')
				.classed('ocp_table', true)
				.append('tr')
					.classed('ocp_row', true);

			var td = moving_tr.selectAll('td').data(data);
			var new_td = td.enter().append('td');
			new_td.append('div')
				.classed('cell', true)
				.style('height', '20px')
				.style('width', function(d) {
					return d.width + 'px';
				})
				.text(function(d) { return d.data; });

			tr.style('opacity', 0);

			div
				.transition()
					.duration(2000)
					.style('top', p.y + 'px')
					.style('left', p.x + 'px')
					.each('end', function() {
						self.removeRecord();
						self.repaint();
					})
				.transition()
					.duration(500)
					.style('opacity', 0)
				.remove();
		};
	};
})( jlg );
