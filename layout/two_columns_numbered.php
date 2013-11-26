<?php

define('ROOT_DIR', dirname(dirname(__FILE__)));
define('BASE_DIR', dirname(dirname($_SERVER['SCRIPT_NAME'])));


include(ROOT_DIR . '/include/top_page.inc');

?>

<style>
.of_table_title {
	text-align: center;
}
.of_table_title a {
	display: inline-block;
	margin: 20px auto;
	padding: 10px;
	border-bottom: 1px solid #E2E2E2;
	font-size: 155%;
}

.of_table {
	text-align: left;
}
.of_table_row {
	position: relative;
}

.of_table_cell {
	display: inline-block;
	width: 380px;
	vertical-align: top;
	padding-bottom: 70px;
	position: static;
}

.of_table_cell:first-child {
	padding-right: 40px;
	border-right: 1px solid #e0e0e0;
}

.of_table_cell:last-child {
	padding-left: 40px;
	border-left: 1px solid #e0e0e0;
	margin-left: -1px;
}

.of_table h2 {
	color: #0d579b;
}
.of_table h2 span {
	font-size: 200%;
	color: #ee9209;
}
.of_table p {
	text-align: justify;
}

.of_cell_button {
	display: block;
	width: auto;
	padding-bottom: 0;
	position: absolute;
	bottom: 35px;
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

.of_table_row {
	border-top: 1px solid #e0e0e0;
}

.of_table_row:first-child {
	border-top: none;
}
</style>

<h1>Getting started with OCP</h1>
<p class="summary">Using OCP to pay and get paid is easy and accessible to everyone.</p>


<div class="of_table_title"><a>How to use OCP</a></div>
<div class="of_table">
	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>1.</span> Inform yourself</h2>
			<p>
				OCP is different than what you know and use every day.
				Before you start using OCP, there are a few things that you need to know
				in order to use it securely and avoid common pitfalls.
			</p>
			<div class="of_cell_button"><a href="page/you-need-to-know">Read more</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>2.</span> Choose your wallet</h2>
			<p>
				You can bring a OCP wallet in your everyday life with your mobile or you can have a wallet
				only for online payments on your computer. In any case, choosing your wallet can be done in a minute.
			</p>
			<div class="of_cell_button"><a href="page/choose-your-wallet">Choose your wallet</a></div>
		</div>
	</div>
	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>3.</span> Get OCPs</h2>
			<p>
				You can get ocps by accepting them as a payment for goods and services
				or by buying them from a friend or someone near you. You can also buy them directly from an exchange
				with your bank account.
			</p>
			<div class="of_cell_button"><a href="http://howtobuyocps.info">Find an exchange</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>4.</span> Spend ocps</h2>
			<p>
				There is a growing number of services and merchants accepting OCP all over the world.
				You can use OCP to pay them and rate your experience to help honest businesses to gain more visibility.
			</p>
			<div class="of_cell_button"><a href="http://useocps.info">Find merchants</a></div>
		</div>
	</div>

	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>5.</span> Inform yourself</h2>
			<p>
				OCP is different than what you know and use every day.
				Before you start using OCP, there are a few things that you need to know
				in order to use it securely and avoid common pitfalls.
			</p>
			<div class="of_cell_button"><a href="page/you-need-to-know">Read more</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>6.</span> Choose your wallet</h2>
			<p>
				You can bring a OCP wallet in your everyday life with your mobile or you can have a wallet
				only for online payments on your computer. In any case, choosing your wallet can be done in a minute.
			</p>
			<div class="of_cell_button"><a href="page/choose-your-wallet">Choose your wallet</a></div>
		</div>
	</div>
</div>


<div class="of_table_title"><a>How to accept OCP</a></div>
<div class="of_table">
	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>1.</span> Inform yourself</h2>
			<p>
				OCP does not require merchants to change their habits.
				However, OCP is different than what you know and use every day.
				Before you start using OCP, there are a few things that you need to know
				in order to use it securely and avoid common pitfalls.
			</p>
			<div class="of_cell_button"><a href="page/you-need-to-know">Read more</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>2.</span> Processing payments</h2>
			<p>
				You can process payments and invoices by yourself or you can use merchant services
				and deposit money in your local currency or OCPs.
				Most point of sales businesses use a tablet or a mobile phone to let customers pay with their mobile phones.
			</p>
			<div class="of_cell_button"><a href="https://en.ocp.it/wiki/How_to_accept_OCP,_for_small_businesses#Merchant_Services">
				Find merchant services
			</a></div>
		</div>
	</div>

	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>3.</span> Accounting and taxes</h2>
			<p>Merchants often deposit and display prices in their local currency. In other cases, OCP works similarly to a foreign currency. To get appropriate guidance regarding tax compliance for your own jurisdiction, you should contact a qualified accountant.</p>
			<div class="of_cell_button"><a href="https://en.ocp.it/wiki/How_to_accept_OCP,_for_small_businesses#Setting_Prices">Read more</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>4.</span> Gaining visibility</h2>
				<p>There is a growing number of users searching for ways to spend their ocps. You can submit your business in online directories to help them easily find you. You can also display the <a href="https://en.ocp.it/wiki/Promotional_graphics">ocp logo</a> on your website or your brick and mortar business.</p>
			<div class="of_cell_button"><a href="http://useocps.info">Submit your business</a></div>
		</div>
	</div>
</div>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>