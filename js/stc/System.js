(function(sim, undefined) {
	stc.System = function(svg, viewSelectors) {
		var self = this;

		this.svg = svg;
		this.svg.on('click', function(d) {
			var thread = new Thread('select');
			self.unselectObject(thread, self.selectedObject);
			thread.finish();
			thread.start();
		});
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};

		this.sideView = d3.select(viewSelectors.sideView);
		this.actorsView = d3.select(viewSelectors.actorsView);
		this.nodesView = d3.select(viewSelectors.nodesView);

		this.defs = this.svg.append('defs');
		this.defs.append('filter')
			.attr('id', 'darker')
			.append('feColorMatrix')
				.attr('type', 'matrix')
				.attr('in', 'SourceGraphic')
				.attr('values', '0.8 0 0 0 -0.2 0 0.8 0 0 -0.2 0 0 0.8 0 -0.2 0 0 0 1 0');

		var man = this.defs.append('symbol')
			.attr('id', 'actor_symbol')
			.attr('viewBox', '120 0 228 455')
			.attr('preserveAspectRatio', 'xMinYMin');
		man.append('path').attr('d', 'm212.828003,128.610001l-85.639999,89.031998l17.806,17.806l67.834,-72.072998l0.848999,121.252014l-58.507004,180.607971c0,0 38.156998,0.951019 39.005005,-0.744995c0.423004,-0.847992 42.395004,-167.143005 44.091003,-169.686981l47.483994,169.583984l36.459991,0l-58.505981,-178.911987l0.847992,-122.100006l69.528992,70.378006l20.351013,-16.959l-88.184021,-88.184006l-53.419983,0z')
		man.append('path').attr('d', 'm239.113998,12.4448c-79.705002,1.6958 -78.856995,105.990197 -2.543991,106.838197c82.248993,0 84.791992,-105.990197 2.543991,-106.838197z')
		man.selectAll('path').attr('fill', 'currentColor');

		var node = this.defs.append('symbol')
			.attr('id', 'node_symbol')
			.attr('viewBox', '0 0 24 24')
			.attr('preserveAspectRatio', 'xMinYMin')
			.append('circle')
				.attr('cx', 12)
				.attr('cy', 12)
				.attr('r', 10)
				.attr('fill', 'currentColor');

		this.group = this.svg.insert('g', ':first-child').classed('main', true);
			//.attr('transform', 'translate(0, ' + (this.svgbox.y / 2) + ')');
		this.links = this.group.append('g').classed('links', true);

		this.options = {
			duration: {
				addActor: 1000,
				addNode: 1000
			},
			callback: {
				onActorSelected: function() {},
				onActorDeselected: function() {},
			},
			stcPerCycle: 100,
			report_elem: null,
			nodeCapacity: 50
		};
		this.scale = 1;

		this.foci = {
			actor: {x: this.svgbox.x / 3, y: this.svgbox.y / 2},
			node: {x: 2 * this.svgbox.x / 3, y: this.svgbox.y / 2}
		};
		this.actors = [];
		this.selectedObject = null;
		this.nodes = [];

		this.forceNodes = [];
		this.forceLinks = [];

		this.totalSTC = 0;
		this.NODE_SIZE = 50;
		this.cycle_id = 0;


		var tick = function(e) {
			var k = .1 * e.alpha;

			// Push nodes toward their designated focus.
			self.forceNodes.forEach(function(d, i) {
				d.y += (self.foci[d.type].y - d.y) * k;
				d.x += (self.foci[d.type].x - d.x) * k;
			});

			var actor_scale = stc.Utils.getActorScale(self);
			var node_scale = stc.Utils.getNodeScale(self);

			var force_node = self.group.selectAll('g.force_node');
			force_node.attr('transform', function(d) {
				var scale = 1.0;
				if (d.type == 'actor') {
					scale = actor_scale;
				} else {
					scale = node_scale;
				}
				return 'translate(' + d.x + ', ' + d.y + ') scale(' + scale + ')';
			});

			var force_links = self.group.selectAll('path.link');
			force_links.attr('d', function(d) {
				var start = {
					x: d.source.x + actor_scale * 12,
					y: d.source.y + actor_scale * 25
				};
				var end = {
					x: d.target.x + node_scale * 25,
					y: d.target.y + node_scale * 25
				};
				//var mid = stc.Utils.getMiddleLinkPoint(sys, d);
				return 'M' + start.x + ',' + start.y + ' ' + end.x + ',' + end.y;
			})
		};

		var force = d3.layout.force()
			.nodes(this.forceNodes)
			.links(this.forceLinks)
			.linkStrength(0)
			.charge(function(d) {
				var scale = 1.0;
				if (d.type == 'actor') {
					scale = stc.Utils.getActorScale(self);
				} else {
					scale = stc.Utils.getNodeScale(self);
				}
				return -100 * scale;
			})
			.gravity(0)
			.size([this.svgbox.x, this.svgbox.y])
			.on("tick", tick)
			.start();

		this.isSelectedObject = function(d) {
			return this.selectedObject == d;
		};

		this.selectObject = function(thread, d) {
			thread.push({
				function: this._selectObject,
				args: arguments,
				name: 'selectObject',
				object: this
			});
		};

		this._selectObject = function(thread, d) {
			this.selectedObject = d;
			this.options.callback.onObjectSelected(d);
			this._repaintAll(thread);
		};

		this.unselectObject = function(thread, d) {
			thread.push({
				function: this._unselectObject,
				args: arguments,
				name: 'unselectObject',
				object: this
			});
		};

		this._unselectObject = function(thread, d) {
			this.selectedObject = null;
			this.options.callback.onObjectDeselected(d);
			this._repaintAll(thread);
		};

		this.addActor = function(thread, actor) {
			thread.push({
				function: this._addActor,
				args: arguments,
				name: 'addActor',
				object: this
			});
		};

		this._addActor = function(thread, actor) {
			actor.x = Math.randomize(0, this.svgbox.x);
			actor.y = Math.randomize(0, this.svgbox.y);
			actor.parent = this;

			this.actors.push(actor);
			this.forceNodes.push(actor);

			this.report({ action: 'add_actor' });

			this._repaintActors(thread);
		};

		this.addNode = function(thread, node) {
			thread.push({
				function: this._addNode,
				args: arguments,
				name: 'addNode',
				object: this
			});
		};

		this._addNode = function(thread, node) {
			node.x = Math.randomize(0, this.svgbox.x);
			node.y = Math.randomize(0, this.svgbox.y);

			this.nodes.push(node);
			this.forceNodes.push(node);
			this.forceLinks.push({
				source: node.owner,
				target: node,
				name: node.owner.name + '_' + node.name
			});

			node.owner.nodes.push(node);
			this.report({
				action: 'add_node'
			});

			this._repaintNodes(thread);
		};

		this.removeNode = function(thread, node) {
			thread.push({
				function: this._removeNode,
				args: arguments,
				name: 'removeNode',
				object: this
			});
		};

		this._removeNode = function(thread, node) {
			var index = this.nodes.indexOf(node);
			if (index > -1) {
				this.nodes.splice(index, 1);
			}

			index = this.forceNodes.indexOf(node);
			if (index > -1) {
				this.forceNodes.splice(index, 1);
			}

			var link = jlg.find(this.forceLinks, function(d) { return d.target == node});
			index = this.forceLinks.indexOf(link);
			if (index > -1) {
				this.forceLinks.splice(index, 1);
			}

			index = node.owner.nodes.indexOf(node);
			if (index > -1) {
				node.owner.nodes.splice(index, 1);
			}

			this.report({
				action: 'remove_node'
			});

			this._repaintNodes(thread);
		};

		this.nextCycle = function(thread) {
			var ca = new stc.CycleAmount(this);
			ca.show(thread);
			ca.split(thread);
			ca.sendReward(thread);
			this.addReward(thread);
		};

		this.addReward = function(thread) {
			thread.push({
				function: this._addReward,
				args: arguments,
				name: 'addReward',
				object: this
			});
		};

		this._addReward = function(thread) {
			this.totalSTC += this.options.stcPerCycle;
			var stc_qty = this.options.stcPerCycle / this.nodes.length;
			for (var i = 0; i < this.nodes.length; i++) {
				var node = this.nodes[i];
				node.owner.amount += stc_qty;
			}
			thread.next();
			this.repaintSideView();
			this.cycle_id++;

			this.report({ action: 'next_cycle' });
		};

		this._repaintAll = function(thread) {
			this._repaintActors();
			this._repaintNodes(thread);
		};

		this._repaintActors = function(thread) {
			var actors = this.group.selectAll('g.actor').data(this.actors);
			force.start();

			actors.exit().remove();

			var new_actors = actors.enter().append('g');

			if (new_actors.empty()) {
				if (thread) {
					thread.next();
				}
			}

			new_actors.classed('actor', true)
				.classed('force_node', true)
				.classed('clickable', true)
				.style('opacity', 0);
			new_actors.append('rect')
				.attr('transform', 'translate(-5, -5)')
				.attr('width', 35)
				.attr('height', 60);
			new_actors.append('use')
				.attr('xlink:href', window.location.href + '#actor_symbol')
				.attr('width', 25)
				.attr('height', 50)
				.attr('color', jlg.accessor('color'));

			new_actors
				.on('click', this.onclick)
				.on('mouseover', function(d) {
					d.mouse = true;
					self._repaintAll();
				})
				.on('mouseout', function(d) {
					d.mouse = false;
					self._repaintAll();
				});

			var doNext = true;
			new_actors.transition()
				.duration(this.options.duration.addActor)
				.style('opacity', 1)
				.each('end', function() {
					if (doNext) {
						doNext = false;
						if (thread) {
							thread.next();
						}
					}
				});


			actors.classed('selected', function(d) {
				return self.isSelectedObject(d);
			});

			this.repaintSideView();
		};

		this._repaintNodes = function(thread) {
			var nodes = this.group.selectAll('g.node').data(this.nodes, function(d) { return d.name; });
			force.start();

			nodes.exit().remove();

			var new_nodes = nodes.enter().append('g');

			if (new_nodes.empty()) {
				self._repaintLinks(thread);
			}

			new_nodes.classed('node', true)
				.classed('force_node', true)
				.classed('clickable', true)
				.style('opacity', 0);
			new_nodes.append('rect')
				.attr('width', this.NODE_SIZE)
				.attr('height', this.NODE_SIZE);
			new_nodes.append('use')
				.attr('xlink:href', window.location.href + '#node_symbol')
				.attr('width', this.NODE_SIZE)
				.attr('height', this.NODE_SIZE)
				.attr('color', jlg.accessor('color'));

			new_nodes
				.on('mouseover', function(d) {
					d.mouse = true;
					self._repaintAll();
				})
				.on('mouseout', function(d) {
					d.mouse = false;
					self._repaintAll();
				})
				.on('click', this.onclick);

			var doNext = true;
			new_nodes.transition()
				.duration(this.options.duration.addNode)
				.style('opacity', 1)
				.each('end', function() {
					if (doNext) {
						doNext = false;
						self._repaintLinks(thread);
					}
				});


			nodes.classed('selected', function(d) {
				return d == self.selectedObject;
			});

			this.repaintSideView();
		};

		this._repaintLinks = function(thread) {
			var links = this.links.selectAll('path.link')
				.data(this.forceLinks, function(d) { return d.name; });

			links.exit().remove();

			var new_links = links.enter().append('path');

			new_links.classed('link', true)
				.attr('data-source', function(d) { return d.source.name; })
				.attr('data-target', function(d) { return d.target.name; })
				.style('stroke', function(d) { return d.target.color; });

			links.style('opacity', function(d) {
					if (self.isSelectedObject(d.target) || self.isSelectedObject(d.source)) {
						return 1;
					}
					if (d.target.mouse || d.source.mouse) {
						return 1;
					}
					return 0;
				});

			if (thread) {
				thread.next();
			}
		};

		this.report = function(report) {
			if (!this.options.report_elem) {
				return;
			}
			var event = new CustomEvent('system_stat', { detail: report });

			this.options.report_elem.dispatchEvent(event);
		};

		this.repaintSideView = function() {
			var tr = this.sideView.select('table.actors').selectAll('tr.actor').data(this.actors);

			tr.exit().remove();

			var new_tr = tr.enter().insert('tr').classed('actor', true);
			new_tr.append('td').classed('name', true);
			new_tr.append('td').classed('stc', true);
			new_tr.append('td').classed('volume', true);
			new_tr.append('td').classed('nodes', true);

			var gb_per_stc = this.totalSTC / (this.nodes.length * this.options.nodeCapacity);
			if (this.nodes.length < 1) {
				stc_rate = 0;
			}

			tr.select('td.name').text(jlg.accessor('name'));
			tr.select('td.stc').text(function(d) {
				return d.amount.toFixed(5);
			});
			tr.select('td.nodes').text(function(d) {
				return d.nodes.length;
			});
			tr.select('td.volume').text(function(d) {
				return (d.amount / gb_per_stc).toFixed(2) + ' GB';
			});

			tr.classed('selected', function(d) {
				return self.selectedObject == d;
			});

			if (this.selectedObject instanceof stc.Actor) {
				this.actorsView.select('table').select('.amount').text(this.selectedObject.amount.toFixed(5));
			}

			this.sideView.select('table.actors').select('tr.total').remove();
			var total = this.sideView.select('table.actors').append('tr').classed('total', true);
			total.append('th').classed('name', true).text('Total');
			total.append('th').classed('stc', true).text(this.totalSTC.toFixed(5));
			total.append('th').classed('volume', true).text(this.nodes.length * this.options.nodeCapacity + ' GB');
			total.append('th').classed('nodes', true).text(this.nodes.length);
		};

		this.onclick = function(d) {
			d3.event.stopPropagation();
			var thread = new Thread('select');
			if (self.isSelectedObject(d)) {
				self.unselectObject(thread, d);
			} else {
				self.selectObject(thread, d);
			}
			thread.finish();
			thread.start();
		};
	};
})(stc)
