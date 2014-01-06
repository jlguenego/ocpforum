(function(sim, undefined) {
	sim.NodeUtils = {};

	sim.NodeUtils.ADDRESS_MIN = new Array(41).join('0');
	sim.NodeUtils.ADDRESS_MAX = new Array(41).join('f');

	sim.NodeUtils.getAddressFromAngle = function(angle, perimeter) {
		perimeter = perimeter || 360;
		var new_perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var address = (angle / perimeter) * new_perimeter;
		return address.toString(16).padleft(40, '0');
	};

	sim.NodeUtils.getAngleFromAddress = function(address, perimeter) {
		perimeter = perimeter || 360;
		var address_perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var angle = (parseInt(address, 16) / address_perimeter) * perimeter;
		return angle;
	};

	sim.NodeUtils.getColorFromAddress = function(address) {
		var perimeter = parseInt('1' + new Array(41).join('0'), 16);
		var hue = (parseInt(address, 16) / perimeter) * 360;
		return 'hsl(' + hue + ', 100%, 90%)';
	};

	sim.NodeUtils.getNodeScale = function(mr, ringName) {
		var result = 1.0;
		var node_nbr = d3.values(mr.rings[ringName].nodes).length;
		var n = Math.floor(jlg.log2(node_nbr));
		if (n > 2) {
			result = 1 / jlg.log2(n - 1);
		}
//		console.log('n=' + result);
//		console.log('result=' + result);
//		console.log('node_nbr=' + node_nbr);
//		console.log(mr.rings[ringName]);
		return result;
	};
})(sim)
