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

<p><br><img src="/img/bitcoin-how-it-works.svg" alt="Bitcoin" /></p>

<h2>Balances<a class="titlelight"> - block chain</a></h2>
<p>The block chain is a <b>shared public ledger</b> on which the entire Bitcoin network relies. All confirmed transactions are included in the block chain. This way, Bitcoin wallets can calculate their spendable balance and new transactions can be verified to be spending bitcoins that are actually owned by the spender. The integrity and the chronological order of the block chain are enforced with <a href="/en/vocabulary#cryptography">cryptography</a>.</p>

<h2>Transactions<a class="titlelight"> - private keys</a></h2>
<p>A transaction is <b>a transfer of value between Bitcoin wallets</b> that gets included in the block chain. Bitcoin wallets keep a secret piece of data called a <a href="/en/vocabulary#private-key"><i>private key</i></a> or seed, which is used to sign transactions, providing a mathematical proof that they have come from the owner of the wallet. The <a href="/en/vocabulary#signature"><i>signature</i></a> also prevents the transaction from being altered by anybody once it has been issued. All transactions are broadcast between users and usually begin to be confirmed by the network in the following 10 minutes, through a process called <a href="/en/vocabulary#mining"><i>mining</i></a>.</p>

<h2>Processing<a class="titlelight"> - mining</a></h2>
<p>Mining is a <b>distributed consensus system</b> that is used to <a href="/en/vocabulary#confirmation"><i>confirm</i></a> waiting transactions by including them in the block chain. It enforces a chronological order in the block chain, protects the neutrality of the network, and allows different computers to agree on the state of the system. To be confirmed, transactions must be packed in a <a href="/en/vocabulary#block"><i>block</i></a> that fits very strict cryptographic rules that will be verified by the network. These rules prevent previous blocks from being modified because doing so would invalidate all following blocks. Mining also creates the equivalent of a competitive lottery that prevents any individual from easily adding new blocks consecutively in the block chain. This way, no individuals can control what is included in the block chain or replace parts of the block chain to roll back their own spends.</p>

<h2>Going down the rabbit hole</h2>
<p>This is only a very short and concise summary of the system. If you want to get into the details, you can <a href="/bitcoin.pdf">read the original paper</a> that describes the system's design, and explore the <a href="https://en.bitcoin.it/wiki/Main_Page">Bitcoin wiki</a>.</p>
<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>