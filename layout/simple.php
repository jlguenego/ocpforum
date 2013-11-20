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

<h1>Bitcoin for Individuals</h1>
<p class="summary">Bitcoin is the simplest way to exchange money at very low cost.</p>

<h2><img class="titleicon" src="image/icon/ico_mobile.svg" alt="Icon">Mobile payments made easy</h2>
<p>
	Bitcoin on mobiles allows you to pay with a simple two step scan-and-pay.
	No need to sign up, swipe your card, type a PIN, or sign anything.
	All you need to receive Bitcoin payments is to display the QR code in your Bitcoin wallet app and let your friend
	scan your mobile, or touch the two phones together (using NFC radio technology).
</p>

<h2><img class="titleicon" src="image/icon/ico_lock.svg" alt="Icon">Security and control over your money</h2>
<p>
	Bitcoin transactions are secured by military grade cryptography.
	Nobody can charge you money or make a payment on your behalf.
	So long as you take the required steps to <a href="/en/secure-your-wallet">protect your wallet</a>,
	Bitcoin can give you control over your money and a strong level of protection against many types of fraud.
</p>

<h2><img class="titleicon" src="image/icon/ico_simple.svg" alt="Icon">Works everywhere, anytime</h2>
<p>
	Just like with email, you don't need to ask your family to use the same software or the same service providers.
	Just let them stick to their own favorites. No problem there; they are all compatible as they use the same open technology.
	The Bitcoin network never sleeps, even on holidays!
</p>

<h2><img class="titleicon" src="image/icon/ico_international.svg" alt="Icon">Fast international payments</h2>
<p>
	Bitcoins can be transferred from Africa to Canada in 10 minutes.
	There is no bank to slow down the process, level outrageous fees, or freeze the transfer.
	You can pay your neighbors the same way as you can pay a member of your family in another country.
</p>

<h2><img class="titleicon" src="image/icon/ico_lowfee.svg" alt="Icon">Zero or low fees</h2>
<p>
	Bitcoin allows you to send and receive payments at very low cost.
	Except for special cases like very small payments, there is no enforced fee.
	It is however recommended to pay a higher voluntary fee for faster confirmation of your transaction
	and to remunerate the people who operate the Bitcoin network.
</p>

<h2><img class="titleicon" src="image/icon/ico_anon.svg" alt="Icon">Protect your identity</h2>
<p>With Bitcoin, there is no credit card number that some malicious actor can collect in order to impersonate you.
	In fact, it is even possible to send a payment without revealing your identity, almost just like with physical money.
	You should however take note that some effort can be required to <a href="/en/protect-your-privacy">protect your privacy</a>.
</p>

<div class="introlink">
	Visit the
	<a href="https://en.bitcoin.it/wiki/How_to_accept_Bitcoin,_for_small_businesses#Merchant_Services">merchant services list</a>
	on the wiki.
</div>

<div class="introlink">
	Or read bitcoind's
	<a href="https://en.bitcoin.it/wiki/API_reference_(JSON-RPC)">API reference</a> and
	<a href="https://en.bitcoin.it/wiki/Original_Bitcoin_client/API_Calls_list">API calls list</a>.
</div>

<div class="mainbutton">
	<a href="getting-started"><img src="image/logo_shadow.png" alt="icon">Get started with Bitcoin</a>
</div>

<?php

include(BASE_DIR . '/include/bottom_page.inc');

?>