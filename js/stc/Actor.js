(function(sim, undefined) {
	stc.Actor = function(name) {
		var self = this;

		this.name = name;

		this.color = stc.Utils.getColorFromString(this.name);
	};
})(stc)
