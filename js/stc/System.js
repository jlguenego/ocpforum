(function(sim, undefined) {
	stc.System = function(svg) {
		var self = this;

		this.svg = svg;
		this.svg.on('click', function(d) {
			var thread = new Thread('select');
			self.unselectActor(thread, null);
			thread.finish();
			thread.start();
		});
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};
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
			.attr('viewBox', '0 0 50 50')
			.attr('preserveAspectRatio', 'xMinYMin')
			.append('circle')
				.attr('cx', 25)
				.attr('cy', 25)
				.attr('r', 12)
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
			report_elem: null
		};
		this.scale = 1;

		this.foci = {
			actor: {x: this.svgbox.x / 3, y: this.svgbox.y / 2},
			node: {x: 2 * this.svgbox.x / 3, y: this.svgbox.y / 2}
		};
		this.actors = [];
		this.selectedActor = null;
		this.nodes = [];

		this.forceNodes = [];
		this.forceLinks = [];


		var tick = function(e) {
			var k = .1 * e.alpha;

			// Push nodes toward their designated focus.
			self.forceNodes.forEach(function(d, i) {
				d.y += (self.foci[d.id].y - d.y) * k;
				d.x += (self.foci[d.id].x - d.x) * k;
			});

			var actor_scale = stc.Utils.getActorScale(self);
			var node_scale = stc.Utils.getNodeScale(self);

			var force_node = self.group.selectAll('g.force_node');
			force_node.attr('transform', function(d) {
				var scale = 1.0;
				if (d.id == 'actor') {
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
					x: d.target.x + node_scale * 50,
					y: d.target.y + node_scale * 50
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
				if (d.id == 'actor') {
					scale = stc.Utils.getActorScale(self)
				} else {
					scale = stc.Utils.getNodeScale(self)
				}
				return -100 * scale;
			})
			.gravity(0)
			.size([this.svgbox.x, this.svgbox.y])
			.on("tick", tick)
			.start();

		this.isSelectedActor = function(d) {
			return this.selectedActor == d;
		};

		this.selectActor = function(thread, d) {
			thread.push({
				function: this._selectActor,
				args: arguments,
				name: 'selectActor',
				object: this
			});
		};

		this._selectActor = function(thread, d) {
			this.selectedActor = d;
			this.options.callback.onActorSelected(d);
			this._repaintActors(thread);
		};

		this.unselectActor = function(thread, d) {
			thread.push({
				function: this._unselectActor,
				args: arguments,
				name: 'unselectActor',
				object: this
			});
		};

		this._unselectActor = function(thread, d) {
			this.selectedActor = null;
			this.options.callback.onActorDeselected(d);
			this._repaintActors(thread);
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
			actor.id = 'actor';
			actor.x = Math.randomize(0, this.svgbox.x);
			actor.y = Math.randomize(0, this.svgbox.y);
			actor.parent = this;

			this.actors.push(actor);
			this.forceNodes.push(actor);
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
			node.id = 'node';
			node.x = Math.randomize(0, this.svgbox.x);
			node.y = Math.randomize(0, this.svgbox.y);

			this.nodes.push(node);
			this.forceNodes.push(node);
			this.forceLinks.push({
				source: jlg.find(this.actors, function(d) { return d == node.owner; }),
				target: node
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
			var stc_qty = this.options.stcPerCycle / this.nodes.length;
			for (var i = 0; i < this.nodes.length; i++) {
				var node = this.nodes[i];
				node.owner.amount += stc_qty;
			}
			thread.next();
		};

		this._repaintActors = function(thread) {
			var actors = this.group.selectAll('g.actor').data(this.actors);
			force.start();

			actors.exit().remove();

			var new_actors = actors.enter().append('g');

			if (new_actors.empty()) {
				thread.next();
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
				.on('click', function(d) {
					d3.event.stopPropagation();
					var thread = new Thread('select');
					if (self.isSelectedActor(d)) {
						self.unselectActor(thread, d);
					} else {
						self.selectActor(thread, d);
					}
					thread.finish();
					thread.start();
				})
				.on('mouseover', function(d) {
					d.showLinks();
				})
				.on('mouseout', function(d) {
					d.hideLinks();
				});

			var doNext = true;
			new_actors.transition()
				.duration(this.options.duration.addActor)
				.style('opacity', 1)
				.each('end', function() {
					if (doNext) {
						doNext = false;
						thread.next();
					}
				});


			actors.classed('selected', function(d) {
				return d == self.selectedActor;
			});

			this.report({ actors: this.actors.length });
		};

		this._repaintNodes = function(thread) {
			var nodes = this.group.selectAll('g.node').data(this.nodes);
			force.start();

			nodes.exit().remove();

			var new_nodes = nodes.enter().append('g');

			if (new_nodes.empty()) {
				thread.next();
			}

			new_nodes.classed('node', true)
				.classed('force_node', true)
				.classed('clickable', true)
				.style('opacity', 0);
			new_nodes.append('use')
				.attr('xlink:href', window.location.href + '#node_symbol')
				.attr('width', 100)
				.attr('height', 100)
				.attr('color', jlg.accessor('color'));

			new_nodes
				.on('mouseover', function(d) {
					d.showLinks();
				})
				.on('mouseout', function(d) {
					d.hideLinks();
				});
//				.on('click', function(d) {
//					d3.event.stopPropagation();
//					var thread = new Thread('select');
//					if (self.isSelectedNode(d)) {
//						self.unselectNode(thread, d);
//					} else {
//						self.selectNode(thread, d);
//					}
//					thread.finish();
//					thread.start();
//				});

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
				return d == self.selectedNode;
			});

			this.report({ nodes: this.nodes.length });
		};

		this._repaintLinks = function(thread) {
			var links = this.links.selectAll('path.link').data(this.forceLinks);

			links.exit().remove();

			var new_links = links.enter().append('path');

			new_links.classed('link', true)
				.attr('data-source', function(d) { return d.source.name; })
				.attr('data-target', function(d) { return d.target.name; })
				.style('stroke', function(d) { return d.source.color; })
				.style('opacity', 0);

			thread.next();
		};

		this.report = function(report) {
			if (!this.options.report_elem) {
				return;
			}
			var event = new CustomEvent('multi_ring_stat', { detail: report });

			this.options.report_elem.dispatchEvent(event);
		};
	};
})(stc)
