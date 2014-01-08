(function(sim, undefined) {
	stc.Scenario = function(sys) {
		var self = this;

		this.sys = sys;
		this.actors = [];
		this.nodes = [];
		this.actor_seq = new jlg.Sequence();
		this.node_seq = new jlg.Sequence();

		this.thread = new Thread('main');

		this.addProvider = function() {
			var actor = new stc.Actor('Provider_' + this.actor_seq.next());

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
			var actor = new stc.Actor('Consumer_' + this.actor_seq.next());

			this.sys.addActor(this.thread, actor);
			this.actors.push(actor);
		};

		this.addNode = function(index) {
			var node = new stc.Node('Node_' + this.node_seq.next(), this.actors[index]);

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

		this.start = function() {
			this.thread.finish();
			this.thread.start();
		};
	};
})(stc)
