(function(sim, undefined) {
	stc.Scenario = function(sys, context) {
		var self = this;

		this.sys = sys;
		this.context = context;

		this.thread = new Thread('main');

		this.addProvider = function() {
			var actor = new stc.Actor('Provider_' + this.context.providerIndex);
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
			var actor = new stc.Actor('Consumer_' + this.context.userIndex);
			this.context.userIndex++;

			this.sys.addActor(this.thread, actor);
			context.consumers.push(actor);
		};

		this.randomBuy = function() {
			var t = new Thread('buy');
			t.execute(function() {
				if (self.context.consumers.length > 0 && self.context.providers.length > 0) {
					var consumer_i = Math.randomizeInt(0, self.context.consumers.length - 1);
					var consumer = this.context.consumers[consumer_i];
					var provider_i = Math.randomizeInt(0, self.context.providers.length - 1);
					var provider = self.context.providers[provider_i];

					var stc_amount = Math.randomize(0, provider.amount);
					self.buy(consumer, provider, stc_amount);
				}
			});
			this.thread.startThread(t);
			this.thread.wait(t);
		};

		this.buy = function(consumer, provider, stc_amount) {
			this.sys.buy(this.thread, consumer, provider, stc_amount);
		};

		this.addNode = function(index) {
			var node = new stc.Node('Node_' + this.context.nodeIndex, context.providers[index]);
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
		};

		this.doCycle = function() {
			if (context.providers.length < 1) {
				this.addProvider();
			}
			var n = Math.floor(Math.randomize(1, 2) * (context.providers.length + context.consumers.length));
			n = Math.max(n, 10);
			for (var i = 0; i < n; i++) {
				var p = Math.randomize(1, 100);
				if (p < 5) {
					this.addConsumer();
				} else if (p < 15) {
					this.addProvider();
				} else if (p < 60) {
					var a = Math.randomizeInt(0, context.providers.length - 1);
					this.addNode(a);
				} else {
					if (context.nodes.length > 0) {
						var node_index = Math.randomizeInt(0, context.nodes.length - 1);
						this.removeNode(node_index);
					}
				}
			}
			this.nextCycle();
		};

		this.start = function() {
			this.thread.finish();
			this.thread.start();
		};
	};
})(stc)
