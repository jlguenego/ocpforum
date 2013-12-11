<?php

define('ROOT_DIR', dirname(dirname(__FILE__)));
include(ROOT_DIR . '/include/constant.inc');
include(ROOT_DIR . '/include/top_page.inc');

?>

<style>
.introlink {
	text-align: center;
	font-size: 125%;
	font-weight: bold;
	margin-top: 30px;
}
</style>

<h1>Illustrations</h1>
<p class="summary">A picture is worth a thousand words...</p>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Store: split, crypt and send</h2>
<p>
	This illustration shows how OCP stores a simple file.
	First the network is built: the nodes are positioned on a ring and linked together.
	The link set tries to be as small as possible. Each node tries to have a minimum set of links in order to
	not saturate the network rooting tables.
	We call distance between two nodes the number of links an object needs to take in order to join two nodes.
	The distance between two nodes must be as small as possible.
	This illustration shows a file to be stored. The file is first splitted in many blocks and then each block is
	encrypted. Then each block is delivered to a bootstrap node that will diffuse it through the distributed system
	using a multi-ring topology and the caching on the road.
</p>
<?php include(ROOT_DIR . '/animation/multi_ring.html'); ?>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>