(function(sim, undefined) {
	stc.Scenario = function(sys, context) {
		var self = this;

		this.sys = sys;
		this.context = context;

		this.actors = sys.actors.slice(0);
		this.nodes = sys.nodes.slice(0);

		this.thread = new Thread('main');

		this.addProvider = function() {
			var actor = new stc.Actor('Provider_' + this.context.actorIndex);
			this.context.actorIndex++;

			this.sys.addActor(this.thread, actor);
			this.actors.push(actor);

			this.addNode(this.actors.length - 1);
		};

		this.addRandomProviders = function(min, max) {
			var actor_qty = Math.randomizeInt(min, max);
			for (var j = 0; j < actor_qty; j++) {
				this.addProvider();
			}
		};

		this.addConsumer = function() {
			var actor = new stc.Actor('Consumer_' + this.context.actorIndex);
			this.context.actorIndex++;

			this.sys.addActor(this.thread, actor);
			this.actors.push(actor);
		};

		this.addNode = function(index) {
			var node = new stc.Node('Node_' + this.context.nodeIndex, this.actors[index]);
			this.context.nodeIndex++;

			this.sys.addNode(this.thread, node);
			this.nodes.push(node);
		};

		this.removeNode = function(index) {
			this.sys.removeNode(this.thread, this.nodes[index]);
			this.nodes.splice(index, 1);
		};

		this.removeRandomNodes = function(probability) {
			for (var j = 0; j < this.nodes.length; j++) {
				if (Math.randomize(0, 1) <= probability) {
					this.removeNode(j);
				}
			}
		};

		this.addRandomNodes = function() {
			for (var j = 0; j < this.actors.length; j++) {
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
			if (this.actors.length < 1) {
				this.addProvider();
			}
			var n = Math.floor(Math.randomize(1, 2) * this.actors.length);
			n = Math.max(n, 10);
			for (var i = 0; i < n; i++) {
				var p = Math.randomize(1, 100);
				if (p < 15) {
					this.addProvider();
				} else if (p < 60) {
					var a = Math.randomizeInt(0, this.actors.length - 1);
					this.addNode(a);
				} else {
					if (this.nodes.length > 0) {
						var node_index = Math.randomizeInt(0, this.nodes.length - 1);
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
