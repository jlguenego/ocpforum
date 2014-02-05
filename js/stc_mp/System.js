(function(sim, undefined) {
	stc.System = function(svg, offers_table_selector, demands_table_selector, viewSelectors) {
		var self = this;

		this.svg = svg;
		this.svgbox = {
			x: svg.attr('width'),
			y: svg.attr('height')
		};

		this.sideView = d3.select(viewSelectors.sideView);
		this.actorsView = d3.select(viewSelectors.actorsView);
		this.nodesView = d3.select(viewSelectors.nodesView);

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
			nodeCapacity: 50
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

		this.competition_price_per_gb = 5;// 100 / (1000 * 365); // $/(gb.day)
		this.min_cycle_revenue_price_per_gb = 1; // 100 / (1000 * 365 * 5); // Per GB/Day

		//console.log('ratio =' + this.competition_price_per_gb / this.min_cycle_revenue_price_per_gb);

		this.attractivity = {
			provider_rate: 0,
			consumer_rate: 0,
		};

		this.totalSTC = 0;
		this.cycle_id = 0;
		this.gb_per_stc = function() {
			return Math.max(1, this.nodes.length) * this.options.nodeCapacity / Math.max(this.totalSTC, this.options.stcPerCycle);
		};

		this.price_per_stc = 1;
		this.price_per_gb = function() {
			return this.price_per_stc / this.gb_per_stc();
		};
		this.used = function() {
			if (this.totalSTC == 0) {
				return 0;
			}
			var used = 0;
			for (var i = 0; i < this.consumers.length; i++) {
				used += this.consumers[i].amount;
			}
			return used * 100 / this.totalSTC
		};
		this.cas = 0;

		this.performed_deal_nbr = 0;

		this.actors_dataset_aa = {};
		this.dataset = [];

		this.computeProviderMinPricePerSTC = function() {
			return 1 * Math.max(this.nodes.length, 1) * this.options.nodeCapacity * this.min_cycle_revenue_price_per_gb / this.options.stcPerCycle;
		};

		this.renting_price_per_gb = function() {
			var previous = this.dataset[this.dataset.length - 1];
			if (!previous) {
				previous = {
					nodes: this.nodes.length,
					total_stc: this.options.stcPerCycle,
					price_per_stc: this.price_per_stc
				};
			}
			var gb_start = Math.max(1, previous.nodes) * this.options.nodeCapacity / previous.total_stc;
			var gb_end = Math.max(1, this.nodes.length) * this.options.nodeCapacity / Math.max(this.options.stcPerCycle, this.totalSTC);
			return (previous.price_per_stc - this.price_per_stc) / Math.min(gb_start, gb_end);
		};

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
			this.actor_push_data(actor);

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
			this.nextCycleMisc(thread);
			this.updateMarketPlace(thread);
		};

		this.nextCycleMisc = function(thread) {
			thread.push({
				function: this._nextCycleMisc,
				args: arguments,
				name: 'nextCycleMisc',
				object: this
			});
		};

		this._nextCycleMisc = function(thread) {
			this.updateDatasets();
			thread.next();
		};

		this.updateDatasets = function() {
			this.dataset.push({
				cycle: this.cycle_id,
				gb_per_stc: this.gb_per_stc(),
				price_per_stc: this.price_per_stc,
				price_per_gb: this.price_per_gb(),
				renting_price_per_gb: this.renting_price_per_gb(),
				total_stc: this.totalSTC,
				nodes: this.nodes.length,
				actors: this.actors.length,
				consumers: this.consumers.length,
				providers: this.providers.length,
				capacity: this.nodes.length * this.options.nodeCapacity,
				performed_deal_nbr: this.performed_deal_nbr,
				usage: this.used(),
				competition: this.competition_price_per_gb,
				attractivity_provider_rate: this.attractivity.provider_rate,
				attractivity_consumer_rate: this.attractivity.consumer_rate,
				cas: this.cas
			});

			for (var i = 0; i < this.actors.length; i++) {
				var actor = this.actors[i];
				this.actor_push_data(actor);
			}
		};

		this.actor_push_data = function(actor) {
			var price_amount = actor.amount * this.price_per_stc;
			var effectiveness = 0;
			if (actor.mined_amount > 0) {
				effectiveness = (actor.price_earned_amount + price_amount) / (actor.mined_amount * self.price_per_stc);
			}

			if (!this.actors_dataset_aa[actor.name]) {
				this.actors_dataset_aa[actor.name] = [];
			}

			this.actors_dataset_aa[actor.name].push({
				cycle: self.cycle_id,
				actor_stc: actor.amount,
				actor_nodes: actor.nodes.length,
				actor_volume: jlg.round(actor.amount * self.gb_per_stc()),
				actor_price_amount: price_amount,
				actor_cumulated_mined_stc: actor.mined_amount,
				actor_price_earned_amount: actor.price_earned_amount,
				actor_effectiveness: effectiveness
			});
		}

		this.updateMarketPlace = function(thread) {
			thread.push({
				function: this._updateMarketPlace,
				args: arguments,
				name: 'updateMarketPlace',
				object: this
			});
		};

		this._updateMarketPlace = function(thread) {
			this.updateTables();
			this.offers_table.repaint();
			this.demands_table.repaint();

			setTimeout(function() {
				self.report({ action: 'next_cycle' });
				thread.next();
			}, this.demands_table.options.duration.repaint);
		};

		this.updateTables = function() {
			for (var i = 0; i < this.offers_table.dataset.length; i++) {
				this.offers_table.dataset[i].gb_qty = jlg.round(this.offers_table.dataset[i].stc_qty * this.gb_per_stc());
				this.offers_table.dataset[i].price_per_gb = jlg.round(this.offers_table.dataset[i].price_per_stc / this.gb_per_stc());
			}
			for (var i = 0; i < this.demands_table.dataset.length; i++) {
				this.demands_table.dataset[i].price_per_stc = jlg.round(this.demands_table.dataset[i].price_per_gb * this.gb_per_stc());
				this.demands_table.dataset[i].stc_qty = jlg.round(this.demands_table.dataset[i].gb_qty / this.gb_per_stc());
			}
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

			this.repaintSideView();
			this.cycle_id++;

			thread.next();
		};

		this._repaintAll = function(thread) {
			this.repaintSideView();
			thread.next();
		};

		this.report = function(report) {
			this.repaintSideView();

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
				if (self.gb_per_stc() == 0) {
					return '0.00 GB';
				}
				return jlg.round(d.amount * self.gb_per_stc()) + ' GB';
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

		this.publishOffer = function(thread, provider, stc_qty, price_per_stc) {
			thread.push({
				function: this._publishOffer,
				args: arguments,
				name: 'publishOffer',
				object: this
			});
		};

		this._publishOffer = function(thread, provider, stc_qty, price_per_stc) {
			//console.log('_publishOffer start');
			var record = jlg.find(this.offers_table.dataset, function(d) {
				return d.name == provider.name;
			});
			if (record) {
				this.offers_table.removeRecord(record);
			}
			//console.log('price_per_stc=' + price_per_stc);

			var gb_qty = stc_qty * this.gb_per_stc();

			if (gb_qty < 5) {
				//console.log('gb_qty < 5');
				thread.next();
				return;
			}

			this.offers_table.addRecord({
				name: provider.name,
				stc_qty: jlg.round(stc_qty, 5),
				gb_qty: jlg.round(gb_qty, 0),
				price_per_gb: jlg.round(price_per_stc / this.gb_per_stc()),
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

			var price_per_stc = price_per_gb * this.gb_per_stc();
			this.demands_table.addRecord({
				name: consumer.name,
				gb_qty: jlg.round(gb_needed, 0),
				stc_qty: jlg.round(gb_needed / this.gb_per_stc(), 5),
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

		this.removeDemand = function(thread, consumer) {
			thread.push({
				function: this._removeDemand,
				args: arguments,
				name: 'removeDemand',
				object: this
			});
		};

		this._removeDemand = function(thread, consumer) {
			var record = jlg.find(this.demands_table.dataset, function(d) {
				return d.name == consumer.name;
			});

			if (record) {
				this.demands_table.removeRecord(record);
			}

			thread.next();
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

			this.updateTables();

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
					//console.log('no deal during cycle ' + this.cycle_id);
					//console.log('this.competition_price_per_gb=' + this.competition_price_per_gb);
					//console.log('this.gb_per_stc=' + this.gb_per_stc());
					this.price_per_stc = Math.max(this.computeProviderMinPricePerSTC(), this.price_per_stc * 0.9);
					//this.price_per_stc = this.price_per_stc / 1.001;
					//console.log('this.price_per_stc=' + this.price_per_stc);
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

				self.price_per_stc = Math.max(demand.price_per_gb * self.gb_per_stc(), self.computeProviderMinPricePerSTC());

				self.performed_deal_nbr = self.performed_deal_nbr + 1;

				var provider = self.getActor(offer.name);
				var consumer = self.getActor(demand.name);
				provider.amount -= transaction;
				provider.price_earned_amount += transaction * offer.price_per_stc;
				consumer.amount += transaction;



				demand.stc_qty = jlg.round(demand.stc_qty - transaction, 5);
				demand.gb_qty = jlg.round(demand.stc_qty * self.gb_per_stc(), 0);
				demand.price = jlg.round(demand.price_per_gb * demand.gb_qty);

				offer.stc_qty = jlg.round(offer.stc_qty - transaction, 5);
				offer.gb_qty = jlg.round(offer.stc_qty * self.gb_per_stc(), 0);
				offer.price = jlg.round(offer.price_per_stc * offer.stc_qty);

				if (offer.stc_qty <= 0) {
					self.offers_table.removeRecord(offer);
				}
				if (demand.gb_qty <= 0) {
					//console.log(demand);
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

		this.runCycle = function(thread) {
			thread.push({
				function: this._runCycle,
				args: arguments,
				name: 'runCycle',
				object: this
			});
		};

		this._runCycle = function(thread) {
			var t = new Thread('runCycle_' + this.cycle_id);

			var cycle_id = this.cycle_id;

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

			this.processDeals(t);
			this.checkPause(t);
			this.nextCycle(t);

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
			//console.log('Start computeAttractivity at cycle ' + this.cycle_id);
			if (this.cycle_id % 10 == 0) {
				this.competition_price_per_gb = this.competition_price_per_gb * Math.randomize(0.75, 1.25);
			}


			// Provider: \[\frac{Gp(n)}{N(n)vc_{i}}\ge 1\]
			var G = this.options.stcPerCycle;
			var p = this.price_per_stc;
			var N = Math.max(1, this.nodes.length);
			var v = this.options.nodeCapacity;
			var c = this.min_cycle_revenue_price_per_gb;

			var q = (G * p) / (N * v * c);
			var provider_rate = this.normalize(4 * (q - 1));
			//console.log('provider_rate=' + provider_rate);
			var providers_to_add = Math.floor(3 * Math.max(0, provider_rate));

			// Consumer: \[\frac{1}{M}\sum\limits_{k=1}^M \frac{kdV(n-k)}{T(n-k)(p(n-k)-p(n))}\ge 1\]
			//console.log(this.dataset);
			var sum = function(n) {
				var result = 0;
				if (n < 2) {
					return 0;
				}
				for (var b = 1; b < n; b++) {
					var d = self.competition_price_per_gb;
//					console.log(self.dataset);
					var V = v * self.dataset[b].nodes;
					var T = G * b;
					var p_buy = self.dataset[b].price_per_stc;
					var p_sell = self.dataset[n].price_per_stc;
					var frac_up = T * (p_buy - p_sell);
					var frac_down = V * d * (n - b);
					console.log('d=' + d);
					console.log('V=' + V);
					console.log('n=' + n);
					console.log('b=' + b);
					console.log('T=' + T);
					console.log('p_buy=' + p_buy);
					console.log('p_sell=' + p_sell);
					console.log('frac_up=' + frac_up);
					console.log('frac_down=' + frac_down);

					result += frac_up / frac_down;
					console.log('result=' + result);
				}
				return result;
			}

			var n = this.cycle_id;
			this.cas += sum(n);
			console.log('cycle_id=' + this.cycle_id);
			console.log('cas=' + this.cas);
			var cai = this.cas * (2 / (n * (n - 1)));
			var consumer_rate = this.normalize(4 * (1 - cai));
			if (n < 2) {
				consumer_rate = 0;
			}

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
