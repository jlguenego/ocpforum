(function( jlg, undefined ) {
	jlg.Table = function(selector, columns, dataset) {
		var self = this;

		this.columns = columns;
		this.dataset = dataset;
		this.selected_row = null;

		this.table = d3.select(selector).append('table').classed('jlg_table', true);
		this.header = this.table.append('thead').append('tr');
		this.body = this.table.append('tbody');

		this.options = {
			repaintDuration: 300,
			sort: null
		};

		// Build header
		for (var i = 0; i < this.columns.length; i++) {
			this.header.append('th')
				.html(this.columns[i]);
		}

		this.addRecord = function(record) {
			this.dataset.push(record);
			this.sort();
		};

		this.insertRecord = function(record) {
			this.dataset.unshift(record);
		};

		this.removeRecord = function(index) {
			index = index || this.dataset.indexOf(this.selected_row);
			if (index >= 0) {
				this.dataset.splice(index, 1);
			}
			this.selected_row = null;
		};

		this.repaint = function(duration) {
			duration = duration || this.options.repaintDuration;

			var tr = this.body.selectAll('tr').data(this.dataset, function(d) {return d;});

			var exit_tr = tr.exit();
			exit_tr.selectAll('div.jlg_cell')
				.transition()
					.duration(duration)
					.style('height', '0px')
					.each('end', function(d, i) {
						if (i == 0) {
							exit_tr.remove()
						}
					});

			var new_tr = tr.enter().append('tr')
				.classed('jlg_row', true);

			new_tr.on('click', function(d) {
				tr.classed('jlg_selected', false);
				d3.select(this).classed('jlg_selected', true);
				self.selected_row = d;
			});

			var td = new_tr.selectAll('td').data(function(d) { return d; });
			var new_td = td.enter().append('td');
			new_td.append('div')
				.classed('jlg_cell', true)
				.style('height', '0px')
				.text(function(d) { return d; })
				.transition()
					.duration(duration)
					.style('height', '20px');

			tr.order();
		};

		this.copyRow = function(row, p) {
			this._animateRow(row, p, false);
		};

		this.moveRow = function(row, p) {
			this._animateRow(row, p, true);
		};

		this._animateRow = function(row, p, remove_flag) {
			var all_tr = this.body.selectAll('tr.jlg_row');
			var tr;

			all_tr.each( function(d, i){
				if (d == row){
					tr = d3.select(this);
				}
			});

			if (!tr) {
				return;
			}

			var data = [];
			var row_div = tr.selectAll('div');

			row_div.each(function(d, i) {
				var bbox = this.getBoundingClientRect();
				data[i] = { bbox: bbox, data: row[i] };
			});

			var bbox = tr.node().getBoundingClientRect();

			var div = d3.select('body').append('div').classed('jlg_moving_box', true);
			div.style('position', 'absolute')
				.style('top', bbox.top + 'px')
				.style('left', bbox.left + 'px')
				.style('width', bbox.width + 'px')
				.style('height', bbox.height + 'px');

			var moving_tr = div.append('table')
				.classed('jlg_table', true)
				.append('tr')
					.classed('jlg_row', true);

			var td = moving_tr.selectAll('td').data(data);
			var new_td = td.enter().append('td');
			new_td.append('div')
				.classed('jlg_cell', true)
				.style('height', function(d) {
					return d.bbox.height + 'px';
				})
				.style('width', function(d) {
					return d.bbox.width + 'px';
				})
				.text(function(d) { return d.data; });

			if (remove_flag) {
				tr.style('opacity', 0);
			}

			div
				.transition()
					.duration(2000)
					.style('top', p.y + 'px')
					.style('left', p.x + 'px')
					.each('end', function() {
						if (remove_flag) {
							var index = self.dataset.indexOf(row);
							self.removeRecord(index);
							self.repaint();
						}
					})
				.transition()
					.duration(500)
					.style('opacity', 0)
				.remove();
		};

		this.clean = function() {
			this.dataset = [];
			this.selected_row = null;
			this.repaint();
		}

		this.sort = function() {
			if (!this.options.sort) {
				return;
			}
			this.dataset.sort(this.options.sort);
			//this.repaint(0);
		};
	};
})(jlg);
