(function(sim, undefined) {
	stc.Scenario = function(sys, context) {
		var self = this;

		this.sys = sys;
		this.context = context;

		this.thread = new Thread('main');

		this.addProvider = function() {
			var actor = new stc.Actor('Provider_' + this.context.providerIndex, 'provider');
			this.context.providerIndex++;

			this.sys.addActor(this.thread, actor);
			context.providers.push(actor);

			this.addNode(context.providers.length - 1);
		};

		this.addRandomProviders = function(min, max) {
			var actor_qty = Math.randomizeInt(min, max);
			for (var j = 0; j < actor_qty; j++) {
				this.addProvider();
			}
		};

		this.addConsumer = function() {
			var actor = new stc.Actor('Consumer_' + this.context.userIndex, 'consumer');
			this.context.userIndex++;

			this.sys.addActor(this.thread, actor);
			context.consumers.push(actor);
		};

		this.buy = function(consumer, provider, stc_amount) {
			this.sys.buy(this.thread, consumer, provider, stc_amount);
		};

		this.publishOffers = function() {
			for (var i = 0; i < this.context.providers.length; i++) {
				var provider = this.context.providers[i];
				var offer = this.context.offers_aa[provider.name];
				if (offer) {
					delete this.context.offers_aa[provider.name];
				}
				var p = Math.randomize(0, 100);
				if (p < 40) {
					var percent = Math.randomize(0, 100);
					this.sys.publishOffer(this.thread, provider, percent);
				}
			}
		};

		this.addNode = function(index) {
			var node = new stc.Node(context.providers[index]);
			this.context.nodeIndex++;

			this.sys.addNode(this.thread, node);
			context.nodes.push(node);
		};

		this.removeNode = function(index) {
			this.sys.removeNode(this.thread, context.nodes[index]);
			context.nodes.splice(index, 1);
		};

		this.removeRandomNodes = function(probability) {
			for (var j = 0; j < context.nodes.length; j++) {
				if (Math.randomize(0, 1) <= probability) {
					this.removeNode(j);
				}
			}
		};

		this.addRandomNodes = function() {
			for (var j = 0; j < context.providers.length; j++) {
				if (Math.randomizeInt(0, 10) > 5) {
					// Don't add node for this actor.
					continue;
				}

				var node_qty = Math.randomizeInt(1, 3);
				for (var k = 0; k < node_qty; k++) {
					this.addNode(j);
				}
			}
		};

		this.nextCycle = function() {
			this.sys.nextCycle(this.thread);
			this.context.cycle_id++;
		};

		this.doCycle = function() {
			if (context.providers.length < 1) {
				this.addProvider();
			}
			if (context.consumers.length < 1) {
				this.addConsumer();
			}

			this.performExternalEvents();

			var n = Math.floor(Math.randomize(1, 2) * (context.providers.length + context.consumers.length));
			n = Math.max(n, 10);
			for (var i = 0; i < n; i++) {
				var p = Math.randomize(1, 100);
				if (p < 15) {
					this.addProvider();
				} if (p < 30) {
					this.addConsumer();
				} else if (p < 60) {
					var a = Math.randomizeInt(0, context.providers.length - 1);
					this.addNode(a);
				} if (p < 70) {
					var index = Math.randomizeInt(0, context.providers.length - 1);
					this.publishOffer(context.providers[index]);
				} if (p < 80) {
					var index = Math.randomizeInt(0, context.consumers.length - 1);
					this.publishDemand(context.consumers[index]);
				} else if (p <= 100) {
					if (context.nodes.length > 0) {
						var node_index = Math.randomizeInt(0, context.nodes.length - 1);
						this.removeNode(node_index);
					}
				}
			}
			this.performDeals();
			this.nextCycle();
		};

		this.performExternalEvents = function() {
			switch(this.context.cycle_id) {
				case 10:
					this.sys.competition_price_per_gb = this.sys.competition_price_per_gb / 2;
					break;
			}
		};

		this.publishOffer = function(provider) {
			var amount_percent = Math.randomize(10, 100);
			var rate_coef = Math.randomize(0.5, 1.5);
			this.sys.publishOffer(this.thread, provider, amount_percent, rate_coef);
		};

		this.publishDemand = function(consumer) {
			var gb_needed = Math.randomize(10, 100);
			var rate_coef = Math.randomize(0.5, 1.5);
			this.sys.publishDemand(this.thread, consumer, gb_needed, rate_coef);
		};

		this.performDeals = function() {
			this.sys.processDeals(this.thread);
		};

		this.start = function() {
			this.thread.finish();
			this.thread.start();
		};
	};
})(stc)
