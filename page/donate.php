<?php

define('ROOT_DIR', dirname(dirname(__FILE__)));
include(ROOT_DIR . '/include/constant.inc');
include(ROOT_DIR . '/include/top_page.inc');

?>

<script type="text/javascript" src="_ext/jquery.qrcode.min.js"></script>

<style>
.span4 {
	width: 370px;
	margin: auto;
}

.boxed {
	padding: 20px;
	margin: 10px;
	text-align: center;
	background-color: #f0f0f0;
	border-bottom: solid 1px #ccc;
	-webkit-border-radius: 4px;
	-moz-border-radius: 4px;
	border-radius: 4px;
	-webkit-box-shadow: 0 0 7px #aaa;
	-moz-box-shadow: 0 0 7px #aaa;
	box-shadow: 0 0 7px #aaa;
}
.boxed h3 {
	margin: -20px -20px 20px;
	padding: 5px;
	font-size: 1.1em;
	-moz-border-radius-topright: 4px;
	-moz-border-radius-topleft: 4px;
	border-top-right-radius: 4px;
	border-top-left-radius: 4px;
	color: #fff;
	text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
	background-color: #2f548c;
	background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#4781b5), to(#2f548c));
	background-image: -webkit-linear-gradient(top, #4781b5, #2f548c);
	background-image: -o-linear-gradient(top, #4781b5, #2f548c);
	background-image: linear-gradient(to bottom, #4781b5, #2f548c);
	background-image: -moz-linear-gradient(top, #4781b5, #2f548c);
	background-repeat: repeat-x;
	filter: progid:dximagetransform.microsoft.gradient(startColorstr='#ff4781b5', endColorstr='#ff2f548c', GradientType=0);
	filter: progid:dximagetransform.microsoft.gradient(enabled=false);
}
</style>

	<div class="span4">
		<div class="boxed">
			<h3>Make a donation</h3>
			<p>
				Bitcoin address:
				<small>
					<a class="BTC" href="bitcoin:189iz3xHTBLePDXTbpMfuiNfobGbw6SS8T?label=OCP+Forum+Donation">
						189iz3xHTBLePDXTbpMfuiNfobGbw6SS8T
					</a>
				</small>
			</p>
			<div id="qrcodeDonate">
				<div id="qrcode"></div>
			</div>
		</div>
	</div>

<div class="mainbutton">
	<a href="page/getting-started"><img src="image/logo_shadow.png" alt="icon">Get started with OCP</a>
</div>

<script>
	$('#qrcode').qrcode("bitcoin:189iz3xHTBLePDXTbpMfuiNfobGbw6SS8T?label=OCP+Forum+Donation");
</script>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>