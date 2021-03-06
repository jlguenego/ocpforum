(function(jlg, undefined){
	jlg.Chart = function(selector, x_axis, my_dataset) {
		var self = this;

		var dataset = my_dataset;
		var ndx = crossfilter();
		var xDim = ndx.dimension(jlg.accessor(x_axis));
		var chart; // dc.compositeChart

		var charts = [];
		var currentChartGroup;
		var renderArea = false;

		this.buttons;
		this.chartDivSelector = selector + ' .chart_view';
		this.buttons_dataset = [];
		this.groups = [];

		this.init = function() {
			var defaultGraph = this.getDefaultGraph();
			this.setDataset(defaultGraph.dataset());

			d3.select(selector).text('');

			d3.select(selector).classed('jlg_chart', true);
			this.buttons = d3.select(selector).append('div').classed('chart_header', true);
			d3.select(selector).append('div').classed('chart_view', true);

			var min = xDim.bottom(1)[0][x_axis];
			var max = xDim.top(1)[0][x_axis];

			var group = xDim.group().reduceSum(d3.functor(0));

			chart = dc.compositeChart(this.chartDivSelector)
				.width(950).height(190)
				.x(d3.scale.linear().domain([min, max]))
				.legend(dc.legend().x(60).y(20).itemHeight(10).gap(5))
				.dimension(xDim)
				.group(group)
				.elasticY(true)
				.elasticX(true)
				.brushOn(false);
			chart.margins().left = 50;

			dc.renderAll();

			this.repaintButtons();

			this.focus(defaultGraph);
		};

		this.focus = function(graph) {
			graph = graph || this.graph;
			currentChartGroup = graph.parent.id;
			this.buttons.selectAll('.button').classed('selected', false);
			d3.select('#' + graph.parent.id + '_' + graph.name).classed('selected', true);
			this.setDataset(graph.dataset());
			this.setChart(graph);
			this.repaint();
		};

		this.currentChartGroup = function() {
			return currentChartGroup;
		};

		this.setDataset = function(my_dataset) {
			dataset = my_dataset;
			refreshDataset();
		};

		function refreshDataset() {
			ndx.remove();
			ndx.add(dataset);
		};

		this.addGroup = function(id, label, dataset) {
			var group = new jlg.Group(id, label, dataset);
			this.groups.push(group);
			return group;
		};

		this.getGroup = function(id) {
			return jlg.find(this.groups, function(d) { return d.id == id; });
		};

		this.getDefaultGraph = function(group) {
			if (group && group.isEnabled()) {
				return group.defaultGraph() || group.graphs[0];
			}

			for (var i = 0; i < this.groups.length; i++) {
				var graph = this.groups[i].defaultGraph();
				if (this.groups[i].isEnabled() && graph) {
					return graph;
				}
			}

			var defaultGroup = jlg.find(this.groups, function(d) { return d.isEnabled();});
			return defaultGroup.graphs[0];
		};

		this.renderArea = function(b) {
			if (!arguments.length) {
				return renderArea;
			}
			renderArea = b;
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

			groups.classed('disabled', function(d) {
				return !d.isEnabled();
			});

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
					if (!d.parent.isEnabled()) {
						return;
					}
					self.focus(d);
				});
		};

		this.repaint = function() {
			refreshDataset();
			//chart.renderYAxis();
			chart.redraw();
			this.repaintButtons();
		};

		this.setChart = function(graph) {
			this.graph = graph;
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
							if (d.x && d.y) {
								var stack_id = graph.labels[i].indexOf(d.layer);
								return stack_id % colors.length;
							}
							return j % colors.length;
						})
						.colorDomain([0, colors.length])
						.brushOn(false);
					var areaFlag = graph.renderArea;
					if (areaFlag == undefined) {
						areaFlag = renderArea || (graph.accessors[i].length > 1);
					}
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
			chart.yAxis().tickFormat(graph.y_axis_unit);

			chart.compose(charts);
			clean_stack(graph);
		};

		function manageArea(areaFlag, i, _chart) {
			var svg = d3.select(self.chartDivSelector).select('svg');
			var stack = svg.select('g.sub._' + i).select('g.chart-body').selectAll('g.stack-list').selectAll('g.stack');
			var areas = stack.selectAll('.area');
			if (areaFlag) {
				if (areas.empty()) {
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

	jlg.Group = function(id, label, dataset) {
		this.label = label;
		this.id = id;
		this.graphs = [];
		var isEnabled = true;
		var defaultGraph = null;
		this.dataset = dataset;

		this.addGraph = function(graph) {
			graph.parent = this;
			this.graphs.push(graph);
			this.setDataset(graph, graph.dataset);
			if (graph.y_axis_unit == undefined) {
				graph.y_axis_unit = function(v) {return v;};
			}
		};

		this.isEnabled = function(b) {
			if (!arguments.length) {
				return isEnabled;
			}
			isEnabled = b;
		};

		this.defaultGraph = function(graphName) {
			if (!arguments.length) {
				return defaultGraph;
			}
			defaultGraph = jlg.find(this.graphs, function(d) { return d.name == graphName; });
		};

		this.setDataset = function(graph, dataset) {
			graph.dataset = function() {return dataset;};
			if (!dataset) {
				graph.dataset = function() {return this.parent.dataset;};
			}
		};
	};
})(jlg)