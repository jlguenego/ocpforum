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

<h1>OCP for Individuals</h1>
<p class="summary">OCP wants to be the simplest way to use and exchange storage resources at the best cost.</p>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Buying cloud storage</h2>
<p>
	OCP cloud storage can be bought using an OCP Market Place site
	(like for instance <a href="http://ocpforum.org/webocp/client/#market_place">OCPForum market place</a>).
	Just select an existing offer (which can be eventually free of charge in some cases).
	When selected, click on 'Buy' and pay in your preferred currency (BTC, USD, EUR, etc.)
	by following the indications.
</p>

<h2><img class="titleicon" src="image/icon/ico_lock.svg" alt="Icon">Selling cloud storage</h2>
<p>
	You can resell cloud storage that you have already bought, or sell your own personal
	storage resources (hard drive, etc.). This can be done with an OCP Market Place
	(like for instance <a href="http://ocpforum.org/webocp/client/#market_place">OCPForum market place</a>).
	By selling your home storage, you can make money with your hardware and a little bit of electrical energy.
	In some case, this can reduce your heating bill.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Storing data</h2>
<p>
	After getting some OCP storage space, it is possible to save any kind of data in your OCP storage space.
	Just take an OCP client (web, or OS based) and connect to your OCP space, then upload. Some clients automatically
	synchronize your device (PC, mobile, etc.) to your OCP storage space.
</p>

<h2><img class="titleicon" src="image/icon/ico_international.svg" alt="Icon">Retrieving data</h2>
<p>
	Data can easily be retrieved from a OCP storage space after identification and authentication process.
	OCP is designed to have the best performance possible from the network and the OCP storage
	node individual performances.
</p>

<h2><img class="titleicon" src="image/icon/ico_lowfee.svg" alt="Icon">Sharing data</h2>
<p>
	Any file has its own read-only access key. To share a file with a friend or someone else, just
	communicate the file address and the key.
</p>

<h2><img class="titleicon" src="image/icon/ico_anon.svg" alt="Icon">Collaborative work</h2>
<p>
	With OCP, you can buy some storage space and share access with many people through an OCP third-party proxy.
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