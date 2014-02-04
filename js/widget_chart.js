(function(jlg, undefined){
	jlg.Chart = function(selector, x_axis, my_dataset) {
		var self = this;

		var dataset = my_dataset;
		var ndx = crossfilter();
		var xDim = ndx.dimension(jlg.accessor(x_axis));
		var chart; // dc.compositeChart

		var charts = [];

		d3.select(selector).classed('jlg_chart', true);
		this.buttons = d3.select(selector).append('div').classed('chart_header', true);

		d3.select(selector).append('div').classed('chart_view', true);

		this.chartDivSelector = selector + ' .chart_view';

		this.buttons_dataset = [];
		this.groups = [];

		this.init = function() {
			var min = xDim.bottom(1)[0][x_axis];
			var max = xDim.top(1)[0][x_axis];

			var group = xDim.group().reduceSum(d3.functor(0));

			chart = dc.compositeChart(this.chartDivSelector)
				.width(950).height(190)
				.x(d3.scale.linear().domain([min, max]))
				.legend(dc.legend().x(40).y(20).itemHeight(10).gap(5))
				.dimension(xDim)
				.group(group)
				.elasticY(true)
				.elasticX(true)
				.brushOn(false);

			dc.renderAll();

			this.repaintButtons();
			var defaultGraph = this.getDefaultGraph();

			d3.select('#' + defaultGraph.parent.id + '_' + defaultGraph.name).classed('selected', true);
			this.setDataset(defaultGraph.dataset);
			this.updateChart(defaultGraph);
		};

		this.setDataset = function(my_dataset) {
			dataset = my_dataset;
			refreshDataset();
		};

		function refreshDataset() {
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
			self.setChart(graph);
			self.repaintChart();
		};

		this.repaintChart = function() {
			refreshDataset();
			dc.redrawAll();
		};

		this.setChart = function(graph) {
			var previous_charts = chart.children();
			charts = [];
			for (var i = 0; i < graph.accessors.length; i++) {
				(function(i) {
					var colors = d3.scale.category20b();
					if (graph.colors && graph.colors[i]) {
						colors = graph.colors[i];
					}
					var group = xDim.group().reduceSum(jlg.accessor(graph.accessors[i][0]));
					var lineChart = dc.lineChart(chart)
						.dimension(xDim)
						.colors(colors)
						.colorAccessor(function(d, j) {
							console.log(d);console.log('j='+j);console.log('i='+i);
							if (d.x && d.y) {
								var stack_id = graph.labels[i].indexOf(d.layer);
								return stack_id % colors.length;
							}
							return j % colors.length;
						})
						.colorDomain([0, colors.length])
						.brushOn(false);
					var areaFlag = graph.accessors[i].length > 1;
					lineChart.renderArea(areaFlag);

					for (var j = 0; j < graph.accessors[i].length; j++) {
						var g = xDim.group().reduceSum(jlg.accessor(graph.accessors[i][j]));
						if (j == 0) {
							lineChart.group(group, graph.labels[i][0]);
						} else {
							lineChart.stack(g, graph.labels[i][j]);
						}
					}
					if (previous_charts[i]) {
						var g = previous_charts[i].g();
						var chartBodyG = previous_charts[i].chartBodyG();
						lineChart.g(g);
						lineChart.chartBodyG(chartBodyG);
						manageArea(areaFlag, i, lineChart);
					}
					charts.push(lineChart);
				})(i);
			}
			var unit = graph.x_axis_unit || function(v) {return v;};
			chart.yAxis().tickFormat(unit);

			chart.compose(charts);
			clean_stack(graph);
		};

		function manageArea(areaFlag, i, _chart) {
			var svg = d3.select(self.chartDivSelector).select('svg');
			var stack = svg.select('g.sub._' + i).select('g.chart-body').selectAll('g.stack-list').selectAll('g.stack');
			var areas = stack.selectAll('.area');
			if (areaFlag) {
				if (areas.empty()) {
					console.log(_chart);
					var area = d3.svg.area()
		                .x(function (d) {
		                    return chart.x()(d.x);
		                })
		                .y(function (d) {
		                    return chart.y()(d.y + d.y0);
		                })
		                .y0(function (d) {
		                    return chart.y()(d.y0);
		                })
		                .interpolate(_chart.interpolate())
		                .tension(_chart.tension());

		            if (_chart.defined()) {
		                area.defined(_chart.defined());
		            }

				    function safeD(d){
				        return (!d || d.indexOf("NaN") >= 0) ? "M0,0" : d;
				    }

		            stack.append("path")
		                .attr("class", "area")
		                .attr("fill", function(d, i) {
							return _chart.getColor.call(d, d.values, i);
						})
		                .attr("d", function (d) {
		                    return safeD(area(d.values));
		                });
				}
			} else {
				areas.remove();
			}
		};

		function clean_stack(graph) {
			var svg = d3.select(self.chartDivSelector).select('svg');
			svg.selectAll('g.sub').data(graph.accessors).exit().remove();

			for (var i = 0; i < graph.accessors.length; i++) {
				var stack = svg.select('g.sub._' + i).select('g.chart-body').selectAll('g.stack-list').selectAll('g.stack');
				stack.data(graph.accessors[i])
					.exit().remove();
				svg.select('g.sub._' + i).select('g.chart-body').selectAll('g.dc-tooltip-list').selectAll('g.dc-tooltip').data(graph.accessors[i])
					.exit().remove();
			}
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