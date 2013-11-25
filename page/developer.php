<?php

define('BASE_DIR', '..');


include(BASE_DIR . '/include/top_page.inc');

?>

<style>
.introlink {
	text-align: center;
	font-size: 125%;
	font-weight: bold;
	margin-top: 30px;
}
</style>

<h1>OCP for Developers</h1>
<p class="summary">OCP can be used to build amazing things or just answer common needs.</p>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">The simplest of all storage systems</h2>
<p>
	OCP primitive are very simple: <code>store(data, address)</code> and <code>data retrieve(address)</code>. All the rest is secondary.
	And because most of the object are immutable, the <code>store(data, address)</code> primitive is
	in fact address <code>address store(data)</code>.

</p>

<h2><img class="titleicon" src="image/icon/ico_international.svg" alt="Icon">Many third party APIs</h2>
<p>
	OCP being open, people are developing a lot of API to improve the OCP ecosystems. So don't start to develop,
	check the existing work before so you will get faster the expected needs.
</p>

<h2><img class="titleicon" src="image/icon/ico_lock.svg" alt="Icon">Develop on top of OCP</h2>
<p>
	The OCP protocol can be extended for your own purpose. You can also develop applications that use
	OCP as the storage layer. Your application can store and retrieve data locally or from the OCP storage system.
</p>

<h2><img class="titleicon" src="image/icon/ico_lock.svg" alt="Icon">OCP Supervision</h2>
<p>
	OCP tries to be as transparent as possible. Monitoring and supervising an OCP network is possible.
	Checking information of every storage node, getting statistic on various variable is essential.
	However, transparency does not mean lack of confidentiality regarding data content and who stores what.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Testing</h2>
<p>
	OCP is also a good platform to test distributed software as it provides the core functionality for testing any kind
	of distributed protocol.
</p>

<div class="introlink">
	Visit the
	<a href="http://ocpforum.org/wiki/How_to_accept_Bitcoin,_for_small_businesses#Merchant_Services">OCP services list</a>
	on the wiki.
</div>

<div class="introlink">
	Or read OCP's
	<a href="http://ocpforum.org/wiki/API_reference_(JSON-RPC)">API reference</a> and
	<a href="http://ocpforum.org/wiki/Original_Bitcoin_client/API_Calls_list">API calls list</a>.
</div>

<div class="mainbutton">
	<a href="page/getting_started.php"><img src="image/logo_shadow.png" alt="icon">Get started with Bitcoin</a>
</div>

<?php

include(BASE_DIR . '/include/bottom_page.inc');

?>