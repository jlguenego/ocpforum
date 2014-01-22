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
		this.mouse = false;

		this.profile = {
			mental_level: Math.randomize(-0.5, 0.5)
		};

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
			this.manageDemand_p(thread);
		};

		this.manageNode_p = function(thread) {
			var f_x = (1 - (2 / (this.parent.attractivity.provider_rate + 1))) + this.profile.mental_level * 1;
			var node_to_manage = Math.floor(f_x * (this.nodes.length * 0.5 + 1));

			var node_to_add = Math.max(0, node_to_manage);
			var node_to_remove = Math.min(Math.abs(Math.min(0, node_to_manage)), this.nodes.length);

			for (var i = 0; i < node_to_add; i++) {
				this.parent.addNode(thread, new stc.Node(this));
			}

			for (var i = 0; i < node_to_remove; i++) {
				this.parent.removeNode(thread, this.nodes[0]);
			}
		};

		this.manageOffer_p = function(thread) {
			var amount_percent = Math.randomize(10, 100);
			var rate_coef = Math.randomize(0.5, 1.5);
			this.parent.publishOffer(thread, this, amount_percent, rate_coef);
		};

		this.manageDemand_p = function(thread) {
		};

		this.behave_c = function(thread) {
			var gb_needed = Math.randomize(10, 100);
			var rate_coef = Math.randomize(0.5, 1.5);
			this.parent.publishDemand(thread, this, gb_needed, rate_coef);
		};
	};
})(stc)
