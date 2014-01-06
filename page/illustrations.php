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

.of_cell_button {
	display: block;
	width: auto;
	padding-bottom: 0;
}
.of_cell_button a, .of_cell_button a:link, .of_cell_button a:active, .of_cell_button a:visited {
	display: inline-block;
	padding: 6px 12px;
	font-size: 115%;
	color: #fff;
	border: 1px solid #d57700;
	background-color: #ee9209;
	background-image: -o-linear-gradient(bottom, #e28700 14%, #ee9209 70%);
	background-image: -moz-linear-gradient(bottom, #e28700 14%, #ee9209 70%);
	background-image: -webkit-linear-gradient(bottom, #e28700 14%, #ee9209 70%);
	background-image: -ms-linear-gradient(bottom, #e28700 14%, #ee9209 70%);
	background-image: linear-gradient(bottom, #e28700 14%, #ee9209 70%);
	-webkit-border-radius: 3px;
	-moz-border-radius: 3px;
	border-radius: 3px;
}

.of_cell_button a:hover {
	background-image: none;
	color: #fff;
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
<div class="of_cell_button">
	<a href="animation\demo1.html" target="_blank">Run the demo</a>
</div>


<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Interactive distributed storage system</h2>
<p>
	In this demo, You can specify the number of rings your system will have. Then
	you can add, remove node and see how the links are created or removed.
	You can also pick an address, and simulate how to store or retrieve an object
	located at the specified address from any node. This demo includes the
	processus of refreshing the distributed system when node are added or removed.
</p>
<div class="of_cell_button">
	<a href="animation\demo2.html" target="_blank">Run the demo</a>
</div>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Interactive store and retrieve</h2>
<p>
	In this demo, you can build a distributed storage system, store and retrieve file.
</p>
<div class="of_cell_button">
	<a href="animation\demo3.html" target="_blank">Run the demo</a>
</div>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>