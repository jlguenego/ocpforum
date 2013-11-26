<?php

define('ROOT_DIR', dirname(dirname(__FILE__)));
define('BASE_DIR', dirname(dirname($_SERVER['SCRIPT_NAME'])));


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

    <h1>How does OCP work?</h1>
<p class="summary">This is a question that often causes confusion. Here's a quick explanation!</p>

<h2>The basics for a new user</h2>
<p>As a new user, you can <a href="/en/getting-started">get started</a> with OCP
	without understanding the technical details. Once you have installed an OCP Client
	on your computer or mobile phone, you can create an OCP user account.
	The space will be empty, and in order to store content, you can buy OCP storage resources
	more whenever you need. The OCP Client connects to any available OCP Market Place and
	let you choose the best deal to start.</p>

<h2>The basics for a new provider</h2>
<p>As a new provider, you can <a href="/en/getting-started">get started</a> with OCP
	without understanding the technical details. Once you have installed an OCP Storage Node
	on your computer, you can create an OCP user account.
	You can then start your OCP storage node and wait that it is accepted on the network.
	Once accepted, you can create and publish a deal to sell the totality or only a part of your
	OCP storage node memory. Once the deal has been bought by another user, you node start to be used.
	If you want to receive the money as expected, do not turn off your OCP Storage Node and let it
	connected to the network.</p>

<p><br><img src="image/ocp_presentation_2.png" width="400" alt="Buy and sell storage on OCP" /></p>

<h2>Storing data</a></h2>
<p>When storing data on an OCP network, the data is splitted into small
	blocks and encrypted. All blocks are sent to the OCP network,
	a hat block that contains addresses of the other blocks is also sent to the network.
	The user account is locally updated with the reference on the hat block</p>

<h2>Retrieving data</a></h2>
<p>When retrieving a file on an OCP network, the hat block of the file is first retrieved.
	Then all blocks indicated in that file is also retrieved from the OCP network.
	The block are all decrypted and join to rebuild the file.</p>

<p><br><img src="image/ocp_presentation_1.png" width="400" alt="Storing and retrieving data with OCP" /></p>

<h2>Immutable objects</h2>
<p>
	All objects stored in the OCP network are immutable, except connection objects.
	Immutable objects are object which address is linked to their content.
	In other words: <code>address = f(content)</code> where f is a global function chosen
	by the OCP network before initialization. The function f should be homogeneous in order to use
	the whole address range. The function f should not be reversible, it should not be easy to guess the content
	with a given address. The function f should be quasi-injective (or anti-collusive) to avoid two different
	content to be stored at the same address. The good candidate for f
	is therefore a hash function (like SHA1, SHA256, etc.).
	Immutable object has two interesting properties: when getting an immutable object, its integrity can be easily checked. And an immutable object can be cached anywhere. There is no expiration date.
</p>

<h2>Data Structure Model</h2>
<p>
	Immutable objects content can store addresses of other immutable objects. So it is possible to make graph with only immutable objects. Such graph are necessarely directed acyclic graph (DAG). Fortunately, most current used data struture such file system can be represented as a DAG. It is better if the DAG has only one root object. In this case, to retrieve all objects, it is necessary to know only one object which is the root object of the DAG.
	A <b>data structure model</b> represents the type of DAG used: file system, versioning system, relational database, etc.
</p>

<h2>Connection objects</h2>
<p>
	Connection objects are used to allow user to get the address of its root object. The principle is to get the connection object address from some information that the user knows: login, password. Thus we have address = <code>f(login, password)</code>. Connection object can be stored on decentralized system the same way cryptocurrencies do for storing money transactions.
</p>

<h2>Address topology</h2>
<p>
	In a distributed storage system, when retrieving an object from its address, the system must indicate which node must have a copy of it. The way it is done depends of the address topology. On a mathematical point of view, an address topology can be defined by a triplet (S, U, D) where S is a distributed system with a set of node N and a set of oriented connections between these nodes L, where U is a set of all possible addresses, and D is a function that attribute the address responsabilities. D is a function that associate foreach address at every instant, the set of nodes that are responsible for this address. The topology term is used because generally, it is possible to represent U as a shape (ring, rectangle, etc.) and represent the node responsabilities area as part of the U set.
</p>

<h2>Multi-ring address topology</h2>
<p>
	The set of address U is represented many times as a counter-clockwise directed ring. Each node N is represented as point located on rings at different angles. The successor of a node is a node represented on the same ring and located just after the node. For a given node, the addresses under its responsability are the ones located between the node and its succeessor. The function D (called find in the figure below) indicates foreach address the set of currently responsible nodes.
</p>

<p><br><img src="image/ocp_presentation_4.png" width="600" alt="Multi-ring topology address" /></p>

<h2>Caching on the road</h2>
<p>
	Each OCP node has two repositories: one for storing the data which the node is responsible for (the <b>storage repository</b>), and another one for caching the data that pass through the node (the <b>caching repository</b>). All immutable object passing through a node is potentially stored in its cache. The advantage is to reduce the trajectory of object on the network.
</p>
<p>
	From a client node, when retrieving data, the OCP node checks if the data is already in its cache. If the data is already in the cache, then it is taken as is and no network connection is needed. If no data is in the cache, the node connects to its closed nodes, and request the data. This is done recursively until a responsible node is found.
</p>

<p><br><img src="image/ocp_presentation_5.png" width="600" alt="Cache on the road mechanism" /></p>

<h2>Want to know more ?</h2>

<p>There are some interesting links:</p>
<ul>
	<li><a href="http://ocpforum.org/publications/BastugEtAl-CloudNet2012.pdf">Cloud Storage for Small Cell Networks</a></li>
	<li><a href="http://ocpforum.org/publications/BastugEtAl-ICT2013-PropCaching.pdf">Proactive Small Cell Networks</a></li>
</ul>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>