(function(sim, undefined) {
	stc.Actor = function(name, type) {
		var self = this;

		this.parent = null;
		this.name = name;
		this.color = stc.Utils.getColorFromString(this.name);
		this.amount = 0;
		this.mined_amount = 0;
		this.price_earned_amount = 0;
		this.nodes = [];
		this.type = type;
		this.last_mined_amount = 0;
		this.price_cost = 0;

		this.attractivity = 1;

		this.profile = {
			mental_rate: Math.randomize(-1, 1),
			marge: Math.randomize(1, 2),
			wealth: Math.randomize(1, 5),
			strategy: Math.randomizeInt(1, 2), // 1: normal, 2: speculator
			price_cost_per_gb: 0
		};

		this.setParent = function(system) {
			this.parent = system;
			this.profile.price_cost_per_gb = Math.randomizeInt(0.9, 1.1) * this.parent.min_cycle_revenue_price_per_gb;
		};

		this.computeAttractivity = function() {
			if (this.type == 'provider') {
				var a = this.parent.normalize((this.last_mined_amount * this.parent.price_per_stc - this.price_cost) / this.price_cost);
				this.attractivity = jlg.avg([ a, this.profile.mental_rate ], [ 1, 0.2 ]);
			}
			if (this.type == 'consumer') {
				// TODO
			}
		}

		this.behave = function(thread) {
			if (this.type == 'provider') {
				this.behave_p(thread);
			}
			if (this.type == 'consumer') {
				this.behave_c(thread);
			}
		};

		this.behave_p = function(thread) {
			this.manageNode_p(thread);
			this.manageOffer_p(thread);
			//this.manageDemand_p(thread);
		};

		this.manageNode_p = function(thread) {
			var node_to_manage = Math.floor(1 * this.profile.wealth * this.attractivity);

			//console.log('node_to_manage=' + node_to_manage);
			var node_to_add = Math.max(0, node_to_manage);
			var node_to_remove = Math.min(Math.abs(Math.min(0, node_to_manage)), Math.max(0, this.nodes.length - 5));

			for (var i = 0; i < node_to_add; i++) {
				this.parent.addNode(thread, new stc.Node(this));
			}

			for (var i = 0; i < node_to_remove; i++) {
				this.parent.removeNode(thread, this.nodes[i]);
			}
		};

		this.manageOffer_p = function(thread) {
			//console.log('manageOffer_p start with cycle ' + this.parent.cycle_id);
			var price_per_stc = Math.randomize(0.9, 1.1) * this.parent.price_per_stc;
			//console.log('my price_per_stc=' + price_per_stc);

			if (this.parent.demands_table.dataset.length > 0) {
				//console.log('demand price per stc =' + this.parent.demands_table.dataset[0].price_per_stc);
				//console.log(this.parent.demands_table.dataset[0]);
				price_per_stc = Math.max(this.parent.demands_table.dataset[0].price_per_stc, price_per_stc);
			}

			price_per_stc = Math.randomize(0.9, 1.1) * price_per_stc;

			//console.log('my corrected price_per_stc=' + price_per_stc);
			price_per_stc = Math.max(this.parent.min_cycle_revenue_price_per_gb * this.parent.gb_per_stc(), price_per_stc);

			this.parent.publishOffer(thread, this, this.amount, price_per_stc);
		};

		this.manageDemand_p = function(thread) {
		};

		this.behave_c = function(thread) {

			var opportunity = Math.randomize(0, 100) > 10;
			//console.log('opportunity=' + opportunity);
			if (!opportunity) {
				this.parent.removeDemand(thread, this);
				return;
			}

			if (this.parent.competition_price_per_gb < this.parent.renting_price_per_gb()) {
				//console.log('Not competitive on cycle ' + this.parent.cycle_id + ': ' + (this.parent.competition_price_per_gb / this.parent.min_cycle_revenue_price_per_gb));
				this.parent.removeDemand(thread, this);
				return;
			}

			var gb_needed = Math.randomize(0, 100);
			//console.log('demand gb_needed=' + gb_needed);

			var price_per_gb = this.parent.price_per_gb();
			//console.log('debug default price_per_gb=' + price_per_gb);
			if (this.parent.offers_table.dataset.length > 0) {
				price_per_gb = this.parent.offers_table.dataset[0].price_per_gb;
				//console.log('debug offers_table price_per_gb=' + price_per_gb);
			}
			price_per_gb = Math.randomize(1, 1.1) * price_per_gb;
			if (price_per_gb > 20 * this.parent.competition_price_per_gb) {
				this.parent.removeDemand(thread, this);
				return;
			}

			this.parent.publishDemand(thread, this, gb_needed, price_per_gb);
		};
	};
})(stc)
