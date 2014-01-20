(function(jlg, undefined) {
	jlg.Table = function(selector, columns, dataset) {
		var self = this;

		this.columns = columns;
		this.dataset = dataset;
		this.view_dataset = this.dataset.slice(0);
		this.selected_row = null;

		this.table = d3.select(selector).append('table').classed('jlg_table', true);
		this.header = this.table.append('thead').append('tr');
		this.body = this.table.append('tbody');

		this.options = {
			repaintDuration: 300,
			sort: null
		};

		// Build header
		this.header.selectAll('th').data(this.columns).enter().append('th')
			.html(jlg.accessor('label'))
			.attr('class', jlg.accessor('name'));

		this.addRecord = function(record) {
			this.dataset.push(record);
			this.view_dataset.push(record);
		};

		this.removeRecord = function(record) {
			record = record || this.selected_row;
			this.selected_row = null;

			var index = this.dataset.indexOf(record);
			if (index < 0) {
				return;
			}

			this.dataset.splice(index, 1);
			this.body.selectAll('tr').filter(function(d) { console.log(d);return d == record; })
				.classed('jlg_to_be_removed', true);
		};

		this.repaint = function(duration) {
			this.sort();

			duration = duration || this.options.repaintDuration;

			var tr = this.body.selectAll('tr').data(this.view_dataset, function(d) {return d;});

			var exit_tr = this.body.selectAll('tr.jlg_to_be_removed');
			exit_tr.selectAll('div.jlg_cell')
				.transition()
					.duration(duration)
					.style('height', '0px')
					.each('end', function(d, i) {
						if (i == 0) {
							exit_tr.remove();
							var data = exit_tr.data();
							console.log(data);
							data.forEach(function(d) {
								console.log(d);
								var index = self.view_dataset.indexOf(d);
								if (index >= 0) {
									self.view_dataset.splice(index, 1);
								}
							});
						}
					});

			var new_tr = tr.enter().append('tr')
				.classed('jlg_row', true)
				.classed('jlg_being_inserted', true);

			new_tr.on('click', function(d) {
				self.body.selectAll('tr').classed('jlg_selected', false);
				d3.select(this).classed('jlg_selected', true);
				self.selected_row = d;
			});

			var td = new_tr.selectAll('td').data(function(d) { return d; });
			var new_td = td.enter().append('td');
			new_td.append('div')
				.attr('class', function(d, i) {
					return 'jlg_cell ' + self.columns[i].name;
				})
				.attr('data-col-index', function(d, i) {
					return i;
				})
				.style('height', '0px')
				.text(function(d) { return d; })
				.transition()
					.duration(duration)
					.style('height', '20px')
					.each('end', function(d, i) {
						new_tr.classed('jlg_being_inserted', false);
					});

			var update_td = tr.selectAll('td').data(function(d) { return d; });
			update_td.select('div').text(function(d) { return d; });

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
							self.removeRecord(row);
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
			this.view_dataset.sort(this.options.sort);
		};

		this.getRecord = function(index, colname) {
			var record = this.dataset[index];
			if (!colname) {
				return record;
			}

			var cols = this.columns;
			for (var i = 0; i < cols.length; i++) {
				if (cols[i].name == colname) {
					return record[i];
				}
			}
		};

		this.setRecord = function(index, colname, value) {
			var record = this.dataset[index];
			var cols = this.columns;
			for (var i = 0; i < cols.length; i++) {
				if (cols[i].name == colname) {
					record[i] = value;
					return;
				}
			}
			throw new Error('Colname ' + colname + ' does not exists.');
		};
	};
})(jlg);
