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
<p class="summary">Using OCP to store, buy or sell storage is easy and accessible to everyone.</p>


<div class="of_table_title"><a>How to use Open Cloud Protocol</a></div>
<div class="of_table">
	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>1.</span> Inform yourself</h2>
			<p>
				OCP is different than what you know and use every day.
				Before you start using OCP, there are a few things that you need to know
				in order to use it securely and avoid common pitfalls.
			</p>
			<div class="of_cell_button"><a href="page/you-need-to-know.php">Read more</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>2.</span> Choose your OCP Client</h2>
			<p>
				You can buy, sell, resell, store, retrieve, share, collaborate with an OCP client
				in your everyday life installed on your mobile or your computer.
				In any case, choosing an OCP Client can be done in a minute.
			</p>
			<div class="of_cell_button"><a href="page/you-need-to-know.php">Choose your OCP client</a></div>
		</div>
	</div>
	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>3.</span> Get OCP storage space</h2>
			<p>
				You can get storage by accepting them as a payment for goods and services
				or by buying them from a friend or someone near you. You can also buy them directly from an exchange
				with your bank account. All this operation can be done on an OCP Market Place.
			</p>
			<div class="of_cell_button"><a href="page/find-a-market-place.php">Find an OCP Market Place</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>4.</span> Sell or resell OCP storage space</h2>
			<p>
				There is a growing number of services and merchants needing OCP storage space all over the world.
				You can sell your own physical OCP Storage space or resell some OCP storage space you already bought.
			</p>
			<div class="of_cell_button"><a href="page/find-a-market-place.php">Find an OCP Market Place</a></div>
		</div>
	</div>
</div>


<div class="of_table_title"><a>How to use OCP storage space</a></div>
<div class="of_table">
	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>1.</span> Storing data</h2>
			<p>
				You can store data using an OCP Client. The way to store data is highly configurable
				to meet your security needs, and performance requirements.
			</p>
			<div class="of_cell_button"><a href="page/storing-data.php">Choose your wallet</a></div>
		</div><!--
		--><div class="of_table_cell">
			<h2><span>2.</span> Retrieving data</h2>
			<p>Data can be retrieved with the OCP Client. To retrieve a piece of data,
				the address must be known and if the data is encrypted,
				the encryption key must be known as well.</p>
			<div class="of_cell_button"><a href="page/retrieving-data.php">Read more</a></div>
		</div>
	</div>

	<div class="of_table_row">
		<div class="of_table_cell">
			<h2><span>3.</span> Share and Collaborate</h2>
				<p>More than simply storing and retrieving your data,
					you can share your data and have all collaboration processes to work on them
					with your organization (friends, work team, etc.)</p>
			<div class="of_cell_button"><a href="page/share-and-collaborate.php">Read More</a></div>

		</div><!--
		--><div class="of_table_cell">
			<h2><span>4.</span> Extends OCP usage</h2>
				<p>OCP is just a storage layer, so you can write a lot of applications using this
					storage layer. For instance, you can imagine a social network where everybody own
					its own storage space and control exactly what there is inside.</p>
			<div class="of_cell_button"><a href="page/write-your-own-ocp-application.php">Read More</a></div>
		</div>
	</div>
</div>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>