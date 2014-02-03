(function(jlg, undefined){
	jlg.Chart = function(selector, xDimention) {
		var self = this;

		var ndx = crossfilter();
		var xDim = ndx.dimension(jlg.accessor(xDimention));
		var group; // crossfilter group
		var chart;

		d3.select(selector).classed('jlg_chart', true);
		this.buttons = d3.select(selector).append('div').classed('chart_header', true);

		d3.select(selector).append('div').classed('chart_view', true);

		this.chartDivSelector = selector + ' .chart_view';

		this.buttons_dataset = [];
		this.groups = [];
		var group_stack = [];

		this.init = function() {
			var min = xDim.bottom(1)[0][xDimention];
			var max = xDim.top(1)[0][xDimention];
			group = xDim.group().reduceSum(function(d) {return d.price_per_stc;});

			chart = dc.lineChart(this.chartDivSelector)
				.width(950).height(190)
				.renderArea(true)
				.x(d3.scale.linear().domain([min, max]))
				.legend(dc.legend().x(40).y(20).itemHeight(10).gap(5))
				.dimension(xDim)
				.group(group)
				.elasticY(true)
				.elasticX(true);

			dc.renderAll();

			this.repaintButtons();
			var defaultGraph = this.getDefaultGraph();

			d3.select('#' + defaultGraph.parent.id + '_' + defaultGraph.name).classed('selected', true);
			this.setDataset(defaultGraph.dataset);
			this.updateChart(defaultGraph);
		};

		this.setDataset = function(dataset) {
			ndx.remove();
			ndx.add(dataset);
		};

		this.addGroup = function(label, id) {
			var group = new jlg.Group(label, id);
			this.groups.push(group);
			return group;
		};

		this.getDefaultGraph = function() {
			for (var i = 0; i < this.groups; i++) {
				var graph = this.groups[i].getDefaultGraph();
				if (graph) {
					return graph;
				}
			}
			return this.groups[0].graphs[0];
		};

		this.repaintButtons = function() {
			var groups = this.buttons.selectAll('div.chart_group').data(this.groups);

			groups.exit().remove();

			var new_groups = groups.enter().append('div');

			new_groups.attr('class', function(d) {
					return 'chart_group ' + d.id
				})
				.append('div').classed('title', true)
				.text(function(d) { return d.label + ':'; });
			new_groups.append('div').classed('button_container', true);

			var buttons = groups.selectAll('div.button_container')
				.selectAll('div.button').data(jlg.accessor('graphs'));

			buttons.exit().remove();

			var new_buttons = buttons.enter();
			new_buttons.append('div')
				.attr('class', function(d) {
					var myclass = '';
					if (d.class) {
						myclass = ' ' + d.class;
					}
					return 'button' + myclass
				})
				.attr('id', function(d) {
					return d.parent.id + '_' + d.name;
				})
				.attr('title', jlg.accessor('title'))
				.text(jlg.accessor('text'))
				.on('click', function(d) {
					self.buttons.selectAll('.button').classed('selected', false);
					d3.select(this).classed('selected', true);
					self.setDataset(d.dataset);
					self.updateChart(d);
				});
		};

		this.updateChart = function(graph) {
			if (graph.type == 'stack') {
				self.setStackChart(graph);
			} else if (graph.type == 'composite') {
				self.setCompositeChart(graph);
			}
			self.repaintChart();
		};

		this.repaintChart = function() {
			chart.group(group_stack[0].group, group_stack[0].label);

			for (var i = 1; i < group_stack.length; i++) {
				var g = group_stack[i];
				chart.stack(g.group, g.label);
			}

			var min = xDim.bottom(1)[0][xDimention];
			var max = xDim.top(1)[0][xDimention];
			chart.x(d3.scale.linear().domain([min, max]));
			dc.redrawAll();
		};

		this.setStackChart = function(graph) {
			clean_stack(graph.accessors.length);

			for (var i = 0; i < graph.accessors.length; i++) {
				var g = xDim.group().reduceSum(jlg.accessor(graph.accessors[i]));
				group_stack.push({ label: graph.labels[i], group: g });
			}

			chart.yAxis().tickFormat(function(v) {return v;});
		};

		this.setCompositeChart = function(accessors) {
		};

		function clean_stack(nbr) {
			group_stack = [];
			var my_dataset = [];
			for (var i = 0; i < nbr; i++) {
				my_dataset.push(i);
			}
			var svg = d3.select('#chart').select('svg');
			var stack = svg.select('g.chart-body').selectAll('g.stack-list').selectAll('g.stack');
			stack.data(my_dataset)
				.exit().remove();
			svg.select('g.chart-body').selectAll('g.dc-tooltip-list').selectAll('g.dc-tooltip').data(my_dataset)
				.exit().remove();
		};
	};

	jlg.Group = function(label, id) {
		this.label = label;
		this.id = id;
		this.graphs = [];

		this.addGraph = function(graph) {
			graph.parent = this;
			this.graphs.push(graph);
		};

		this.getDefaultGraph = function() {
			return null;
		};
	};
})(jlg)