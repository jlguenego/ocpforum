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
	};
})( jlg );