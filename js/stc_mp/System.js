(function(sim, undefined) {
	stc.System = function(svg, actor_dataset_aa, dataset, offers_table_selector, demands_table_selector, viewSelectors) {
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
				addNode: 1000,
				ca: {
					show: 500,
					split: 1000
				}
			},
			callback: {
				onActorSelected: function() {},
				onActorDeselected: function() {},
			},
			stcPerCycle: 100,
			report_elem: null,
			nodeCapacity: 500
		};
		this.scale = 1;

		this.foci = {
			actor: {x: this.svgbox.x / 3, y: this.svgbox.y / 2},
			node: {x: 2 * this.svgbox.x / 3, y: this.svgbox.y / 2}
		};

		this.pause = {
			isRequested: false,
			thread: null,
		};

		this.consumers = [];
		this.providers = [];
		this.actors = [];
		this.selectedObject = null;
		this.nodes = [];
		this.node_index = 0;

		this.forceNodes = [];
		this.forceLinks = [];

		this.totalSTC = 0;
		this.cycle_id = 0;
		this.gb_per_stc = 0.001;
		this.price_per_stc = 0.005;
		this.price_per_gb = 5;

		this.competition_price_per_gb = 500; // 100 / (1000 * 365); // $/(gb.day)
		this.min_cycle_revenue_price_per_gb = 1; //100 / (1000 * 365 * 5); // Per GB/Day
		this.attractivity = null;

		this.performed_deal_nbr = 0;

		this.actors_dataset_aa = actor_dataset_aa;
		this.dataset = dataset;

		// MARKET PLACE STUFF
		var columns = [
			{ label: 'Name', name: 'name' },
			{ label: 'STC Qty', name: 'stc_qty' },
			{ label: 'GB Qty', name: 'gb_qty' },
			{ label: '$/STC', name: 'price_per_stc' },
			{ label: '$/GB', name: 'price_per_gb' },
			{ label: 'Price $', name: 'price' },
		];

		// Offers
		d3.select(offers_table_selector).selectAll('.jlg_table').remove();
		var offers_dataset = [];
		this.offers_table = new jlg.Table(offers_table_selector, columns, offers_dataset);
		this.offers_table.options.sort = function(a, b) {
			return a.price_per_stc - b.price_per_stc;
		};

		// Demands
		d3.select(demands_table_selector).selectAll('.jlg_table').remove();
		var demands_dataset = [];
		this.demands_table = new jlg.Table(demands_table_selector, columns, demands_dataset);
		this.demands_table.options.sort = function(a, b) {
			return b.price_per_stc - a.price_per_stc;
		};

		this.offers_table.clean();
		this.demands_table.clean();
		// END MARKET PLACE STUFF

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
			actor.parent = this;

			this.actors.push(actor);

			this.report({ action: 'add_actor', actor: actor });

			this._repaintAll(thread);
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
			node.name = 'Node_' + this.node_index;
			this.node_index++;
			var already_exists = jlg.find(this.nodes, function(d) {
				return d.name == node.name;
			});

			if (already_exists) {
				throw new Error('Node already exists with name=' + node.name);
			}

			this.nodes.push(node);

			node.owner.nodes.push(node);
			this.report({
				action: 'add_node'
			});

			thread.next();
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

			index = node.owner.nodes.indexOf(node);
			if (index > -1) {
				node.owner.nodes.splice(index, 1);
			}

			this.report({
				action: 'remove_node'
			});

			thread.next();
		};

		this.nextCycle = function(thread) {
			var ca = new stc.CycleAmount(this);
			ca.options.duration = this.options.duration.ca;
			ca.show(thread);
			ca.split(thread);
			this.addReward(thread);
			this.updateMarketPlace(thread);
		};

		this.updateMarketPlace = function(thread) {
			thread.push({
				function: this._updateMarketPlace,
				args: arguments,
				name: 'updateMarketPlace',
				object: this
			});
		};

		this._updateMarketPlace = function(thread) {
			for (var i = 0; i < this.offers_table.dataset.length; i++) {
				this.offers_table.dataset[i].gb_qty = jlg.round(this.offers_table.dataset[i].stc_qty * this.gb_per_stc);
				this.offers_table.dataset[i].price_per_gb = jlg.round(this.offers_table.dataset[i].price_per_stc / this.gb_per_stc);
			}
			for (var i = 0; i < this.demands_table.dataset.length; i++) {
				this.demands_table.dataset[i].price_per_stc = jlg.round(this.demands_table.dataset[i].gb_qty * this.gb_per_stc);
				this.demands_table.dataset[i].stc_qty = jlg.round(this.demands_table.dataset[i].gb_qty / this.gb_per_stc);
			}
			this.offers_table.repaint();
			this.demands_table.repaint();
			setTimeout(function() {
				self.report({ action: 'next_cycle' });
				thread.next();
			}, this.demands_table.options.duration.repaint);
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
				node.owner.mined_amount += stc_qty;
			}

			if (this.totalSTC > 0) {
				this.gb_per_stc = this.nodes.length * this.options.nodeCapacity / this.totalSTC;
			}

			this.repaintSideView();
			this.cycle_id++;

			thread.next();
		};

		this._repaintAll = function(thread) {
			this.repaintSideView();
			thread.next();
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

			var new_tr = tr.enter().insert('tr').classed('actor', true).classed('clickable', true);
			new_tr.append('td').classed('name', true);
			new_tr.append('td').classed('stc', true);
			new_tr.append('td').classed('volume', true);
			new_tr.append('td').classed('nodes', true);
			new_tr.on('click', function(d) {
				var thread = new Thread('select_actor_sideView');
				self.selectObject(thread, d);
				thread.finish();
				thread.start();
			});

			tr.select('td.name').text(jlg.accessor('name'));
			tr.select('td.stc').text(function(d) {
				return jlg.round(d.amount, 5);
			});
			tr.select('td.nodes').text(function(d) {
				return d.nodes.length;
			});
			tr.select('td.volume').text(function(d) {
				if (this.gb_per_stc == 0) {
					return '0.00 GB';
				}
				return jlg.round(d.amount * self.gb_per_stc) + ' GB';
			});

			tr.classed('selected', function(d) {
				return self.selectedObject == d;
			});

			if (this.selectedObject instanceof stc.Actor) {
				this.actorsView.select('table').select('.amount').text(jlg.round(this.selectedObject.amount, 5));
			}

			this.sideView.select('table.actors').select('tr.total').remove();
			var total = this.sideView.select('table.actors').append('tr').classed('total', true);
			total.append('th').classed('name', true).text('Total');
			total.append('th').classed('stc', true).text(jlg.round(this.totalSTC, 5));
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

		this.buy = function(thread, consumer, provider, stc_amount) {
			thread.push({
				function: this._buy,
				args: arguments,
				name: 'buy',
				object: this
			});
		};

		this._buy = function(thread, consumer, provider, stc_amount) {
			if (provider.amount < stc_amount) {
				throw new Error('Not enough STC for the transaction.');
			}
			consumer.amount += stc_amount;
			provider.amount -= stc_amount;
			thread.next();
		};

		this.publishOffer = function(thread, provider, stc_qty, price_per_stc) {
			thread.push({
				function: this._publishOffer,
				args: arguments,
				name: 'publishOffer',
				object: this
			});
		};

		this._publishOffer = function(thread, provider, stc_qty, price_per_stc) {
			console.log('_publishOffer start');
			var record = jlg.find(this.offers_table.dataset, function(d) {
				return d.name == provider.name;
			});
			if (record) {
				this.offers_table.removeRecord(record);
			}
			console.log('price_per_stc=' + price_per_stc);

			var gb_qty = stc_qty * this.gb_per_stc;

			if (gb_qty < 5) {
				console.log('gb_qty < 5');
				thread.next();
				return;
			}

			this.offers_table.addRecord({
				name: provider.name,
				stc_qty: jlg.round(stc_qty, 5),
				gb_qty: jlg.round(gb_qty, 0),
				price_per_gb: jlg.round(price_per_stc / this.gb_per_stc),
				price_per_stc: jlg.round(price_per_stc),
				price: jlg.round(stc_qty * price_per_stc)
			});
			this.offers_table.dataset.sort(this.offers_table.options.sort);
			this.offers_table.repaint();
			setTimeout(function() {
				thread.next();
			}, this.offers_table.options.duration.repaint);
		};

		this.publishDemand = function(thread, consumer, gb_needed, rate_coef) {
			thread.push({
				function: this._publishDemand,
				args: arguments,
				name: 'publishDemand',
				object: this
			});
		};

		this._publishDemand = function(thread, consumer, gb_needed, price_per_gb) {
			var record = jlg.find(this.demands_table.dataset, function(d) {
				return d.name == consumer.name;
			});

			if (record) {
				this.demands_table.removeRecord(record);
			}

			var price_per_stc = price_per_gb * this.gb_per_stc;
			this.demands_table.addRecord({
				name: consumer.name,
				gb_qty: jlg.round(gb_needed, 0),
				stc_qty: jlg.round(gb_needed / this.gb_per_stc, 5),
				price_per_gb: jlg.round(price_per_gb),
				price_per_stc: jlg.round(price_per_stc),
				price: jlg.round(gb_needed * price_per_gb)
			});
			this.demands_table.dataset.sort(this.demands_table.options.sort);

			this.demands_table.repaint();
			setTimeout(function() {
				thread.next();
			}, this.demands_table.options.duration.repaint);
		};

		this.tableSortByRate = function(a, b) {
			return a[2] - b[2];
		};

		this.processDeals = function(thread) {
			thread.push({
				function: this._processDeals,
				args: arguments,
				name: 'processDeals',
				object: this
			});
		};

		this._processDeals = function(thread) {
			this.demands_table.dataset.sort(this.demands_table.options.sort);
			this.offers_table.dataset.sort(this.offers_table.options.sort);

			this.performed_deal_nbr = 0;
			this._processDealRec(thread);
		};

		this.do_processDealRec = function(thread) {
			thread.unshift({
				function: this._processDealRec,
				args: arguments,
				name: 'processDeals',
				object: this
			});
		};

		this._processDealRec = function(thread) {
			var demand = this.demands_table.dataset[0];
			var offer = this.offers_table.dataset[0];

			if ((!offer || !demand) || offer.price_per_stc > demand.price_per_stc) {
				if (this.performed_deal_nbr == 0) {
					console.log('no deal during cycle ' + this.cycle_id);
					console.log('this.competition_price_per_gb=' + this.competition_price_per_gb);
					console.log('this.gb_per_stc=' + this.gb_per_stc);
					this.price_per_stc = Math.max(this.price_per_stc / 2, this.competition_price_per_gb * this.gb_per_stc / 2);
					console.log('this.price_per_stc=' + this.price_per_stc);
					this.price_per_gb = this.price_per_stc / this.gb_per_stc;
				}
				thread.next();
				return;
			}


			// Deal
			var bbox = this.svg.node().getBoundingClientRect();
			var p = {
				x: bbox.left + bbox.width / 4,
				y: bbox.top,
			};
			this.offers_table.copyRow(offer, p);
			this.demands_table.copyRow(demand, p);

			setTimeout(function() {
				var transaction = Math.min(demand.stc_qty, offer.stc_qty);

				self.price_per_stc = demand.price_per_stc;
				self.price_per_gb = self.price_per_stc / self.gb_per_stc;
				self.performed_deal_nbr = self.performed_deal_nbr + 1;

				var provider = self.getActor(offer.name);
				var consumer = self.getActor(demand.name);
				provider.amount -= transaction;
				provider.price_earned_amount += transaction * offer.price_per_stc;
				consumer.amount += transaction;

				var gb_needed = demand.gb_qty - (transaction * self.gb_per_stc);
				demand.gb_qty = jlg.round(gb_needed, 0);
				demand.stc_qty = jlg.round(gb_needed / self.gb_per_stc, 5);
				demand.price = jlg.round(demand.price_per_gb * gb_needed);

				offer.stc_qty = jlg.round(offer.stc_qty - transaction, 5);
				offer.gb_qty = jlg.round(offer.stc_qty * self.gb_per_stc, 0);
				offer.price = jlg.round(offer.price_per_stc * offer.stc_qty);

				if (offer.stc_qty <= 0) {
					self.offers_table.removeRecord(offer);
				}
				if (demand.gb_qty <= 0) {
					self.demands_table.removeRecord(demand);
				}

				self.offers_table.repaint();
				self.demands_table.repaint();
				setTimeout(function() {
					self.do_processDealRec(thread);
					self._repaintAll(thread);
				}, self.offers_table.options.duration.repaint);
			}, this.offers_table.options.duration.move);
		};

		this.getActor = function(name) {
			return jlg.find(this.actors, function(d) { return d.name == name; })
		};

		this.runCycle = function(thread, cycle_nbr) {
			thread.push({
				function: this._runCycle,
				args: arguments,
				name: 'runCycle',
				object: this
			});
		};

		this._runCycle = function(thread, cycle_nbr) {
			var t = new Thread('runCycle_' + this.cycle_id);

			if (this.providers.length < 1) {
				this.addProvider(t);
			}

			if (this.consumers.length < 1) {
				this.addConsumer(t);
			}

			this.computeAttractivity();

			for (var i = 0; i < this.attractivity.providers_to_add; i++) {
				this.addProvider(t);
			}

			for (var i = 0; i < this.attractivity.consumers_to_add; i++) {
				this.addConsumer(t);
			}

			for (var i = 0; i < this.actors.length; i++) {
				var actor = this.actors[i];
				this.makeActivity(t, actor);
			}

			this.checkPause(t);
			this.processDeals(t);

			this.nextCycle(t);
			if (this.cycle_id < cycle_nbr) {
				this.runCycle(t, cycle_nbr);
			}

			thread.do_wait(t);
			t.start();
			thread.next();
		};

		this.checkPause = function(thread) {
			this.pause.thread = thread;
			thread.push({
				function: this._checkPause,
				args: arguments,
				name: 'checkPause',
				object: this
			});
		};

		this._checkPause = function(thread) {
			if (!this.pause.isRequested) {
				thread.next();
			}
		};

		this.makeActivity = function(thread, actor) {
			thread.push({
				function: this._makeActivity,
				args: arguments,
				name: 'makeActivity',
				object: this
			});
		};

		this._makeActivity = function(thread, actor) {
			//console.log('_makeActivity start');
			var t = new Thread('makeActivity_' + this.cycle_id);
			actor.behave(t);
			thread.do_wait(t);
			//console.log(t.orders.slice(0));
			//console.log(thread.orders.slice(0));
			t.start();
			thread.next();
		};

		this.normalize = function(x) {
			return (2 / Math.PI) * Math.atan(x);
		};

		this.computeAttractivity = function() {
			if (this.cycle_id % 10 == 0) {
				this.competition_price_per_gb = this.competition_price_per_gb * Math.randomize(0.75, 1.25);
			}

			var c2 = this.cycle_id;
			var c1 = Math.max(0, this.cycle_id - 3);
			var mining_revenue_price_per_gb = (this.options.stcPerCycle / (Math.max(1, this.nodes.length) * this.options.nodeCapacity)) * this.price_per_stc;
			console.log('this.nodes.length=' + this.nodes.length);
			console.log('mining_revenue_price_per_gb=' + mining_revenue_price_per_gb);
			console.log('min_cycle_revenue_price_per_gb=' + this.min_cycle_revenue_price_per_gb);
			var provider_rate = this.normalize(2 * (mining_revenue_price_per_gb - this.min_cycle_revenue_price_per_gb) / this.min_cycle_revenue_price_per_gb);

			console.log('provider_rate=' + provider_rate);

			var providers_to_add = Math.floor(3 * Math.max(0, provider_rate));

			//console.log(this.dataset);
			var diff = (this.competition_price_per_gb - ((this.dataset[c2].price_per_gb + this.dataset[c1].price_per_gb) / 2));
			var consumer_rate = 0.5 + (1/Math.PI)*Math.atan(1000 * diff);

			var consumers_to_add = Math.floor(2 * consumer_rate);

			this.attractivity = {
				provider_rate: provider_rate,
				consumer_rate: consumer_rate,
				providers_to_add: providers_to_add,
				consumers_to_add: consumers_to_add,
			};

			//if (this.actors.length > 40) {

				this.attractivity.providers_to_add = 0;
			//}
			this.attractivity.consumers_to_add = 0;
		};

		this.addProvider = function(thread) {
			var actor = new stc.Actor('Provider_' + this.providers.length, 'provider');
			this.addActor(thread, actor);
			this.providers.push(actor);

			var node = new stc.Node(actor);
			this.addNode(thread, node);
		};

		this.addConsumer = function(thread) {
			var actor = new stc.Actor('Consumer_' + this.consumers.length, 'consumer');
			this.addActor(thread, actor);
			this.consumers.push(actor);
		};
	};
})(stc)
