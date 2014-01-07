(function(sim, undefined) {
	stc.Utils = {};

	stc.Utils.getColorFromString = function(str) {
		var hash = CryptoJS.SHA1(str).toString();
		var perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var hue = (parseInt(hash, 16) / perimeter) * 360;
		return 'hsl(' + hue + ', 100%, 60%)';
	};

	stc.Utils.getActorScale = function(sys) {
		var result = 1.0;
		var actor_nbr = sys.actors.length;

		result = 20 / (actor_nbr + 20);

		return result;
	};

	stc.Utils.getNodeScale = function(sys) {
		var result = 1.0;
		var node_nbr = sys.nodes.length;

		result = 20 / (node_nbr + 20);

		return result;
	};

	stc.Utils.disableButton = function(thread, selector) {
		thread.execute(function() {
			$(selector).attr('disabled', 'disabled');
		});
	};

	stc.Utils.enableButton = function(thread, selector) {
		thread.execute(function() {
			$(selector).attr('disabled', null);
		});
	};
})(stc)
