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

<h1>OCP for Businesses</h1>
<p class="summary">OCP provides high storage system quality for best market prices.</p>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Confidentiality</h2>
<p>
	OCP is designed to store confidential data. The data is always crypted and splitted in small pieces
	on the origin client machine and then sent to OCP storage nodes, so only crypted data transit on the network.
	This does not prevent data to be stolen from the origin machine
	if the machine is contaminated by malicious software or hardware. OCP security works only with trusted clients.
</p>

<h2><img class="titleicon" src="image/icon/ico_international.svg" alt="Icon">Integrity</h2>
<p>
	When retrieving data, user expects that the data will be the same as what was previousely stored. To
	insure this, all data content can be checked. This is called integrity checking. Because OCP exclusively uses
	immutable objects, it can be easily done by checking that the hash of the object content
	is equals to the address where it is stored.
</p>

<h2><img class="titleicon" src="image/icon/ico_lock.svg" alt="Icon">Persistency</h2>
<p>
	As most of cloud storage system, OCP tries to make your data always retrievable,
	even if some nodes of the distributed are down. This is insured by duplication and redundancy permanent
	activities inside the OCP network. OCP propose a default configuration for managing persistency aspect,
	but let the user customize algorithm and parameters to suit his needs. Increasing persistency requires
	increasing used storage space per semantic data unit.
</p>

<h2><img class="titleicon" src="image/icon/ico_lock.svg" alt="Icon">Resiliency</h2>
<p>
	OCP is a fully distributed system meaning that there is no central node in the system. Having
	central node, or node with exclusive responsability makes the system more vulnerable to internal or external
	attacks. OCP is designed to form a distributed system with a maximum of resiliency. Any node shutdown
	must have the smallest impact possible on the system behavior. Single point of failure are avoided.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Performance</h2>
<p>
	Network performance clearly relied on the physical network throughput. But OCP still tries to increase
	performance by reducing the trajectory of the object on the network. When you store object on an OCP network,
	the object will be stored in a such way that the OCP system does not lose them, but sill they will also
	be stored close to the location you are probably accessing to them. OCP for instance use caching on the road
	mechanism.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Security</h2>
<p>
	All user data sent to the network are encrypted according the user algorithm and password. All
	user algorithm can be chosen by the user at his sole discretion. The user algorithm
	must be integrated as a plugin on the OCP Client. Because OCP is open, we try to make a big
	community working with it, and make it able to detect all potential security breach to insure
	the best support.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Transparency</h2>
<p>
	All OCP network details can be visualized. Each node that is used can be inspected. The quality of service
	can be measured and evaluated. So the final user can have a good and reliable measure of the health of the system.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Portability</h2>
<p>
	OCP is open, and we make our best to get OCP software for most of possible platforms, including
	Personal Computer, mobile, tablet, server on all major operating system
	(Windows, Android, Mac OS, Linux, etc.) and on all technologies (Standalone program, web based, etc.).
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Compatibility</h2>
<p>
	Unlike most of the proprietary solution, if a company decides to change OCP cloud storage provider,
	there is no impact on OCP based software. The advantage is to keep paying cloud storage
	at the best price of the market.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Free Competition</h2>
<p>
	The OCP Market Place give you a clear view on the OCP Storage price. Unlike the proprietary solution,
	you can really compare the offer because they are based on the same technical content.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Resellable storage</h2>
<p>
	Most of the cloud storage are based on monthly fee. With OCP, you can resell what you don't use.
</p>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Public and private network</h2>
<p>
	There is one OCP official public network where you can connect to (see the <a href="pages/sponsor-list">official sponsor list</a>).
	But OCP network can be also private. A company can decide to run its own private OCP network.
</p>

<div class="introlink">
	Visit the
	<a href="http://ocpforum.org/wiki/OCP_Service_List">OCP service list</a>
	on the wiki.
</div>

<div class="introlink">
	Or read OCP's
	<a href="http://ocpforum.org/wiki/API_reference_(JSON-RPC)">API reference</a> and
	<a href="http://ocpforum.org/wiki/Original_OCP_client/API_Calls_list">API calls list</a>.
</div>

<div class="mainbutton">
	<a href="getting-started"><img src="image/logo_shadow.png" alt="icon">Get started with OCP</a>
</div>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>