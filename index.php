<?php

define('BASE_DIR', '.');


include(BASE_DIR . '/include/top_page.inc');

?>

<style>
.maindesc {
	max-width: 760px;
	margin: auto;
}

.image {
	display: block;
	width: 75%;
	height: 75%;
	margin: auto;
	border: 1px solid black;
}

.mainsummary {
	font-size:145%;
	color:#7b7c7c;
	margin:20px auto 45px auto;
	text-align: center;
}

.mainlist {
	font-size:125%;
	margin:30px 0;
	text-align: center;
}
.mainlist>div {
	width:250px;
	display:inline-block;
}
.mainlist>div>div{
	display:inline-block;
	line-height:1.5em;
	text-align:left;
}
.mainlist>div:first-child{
	text-align:left;
}
.mainlist>div:first-child+div{
	text-align:center;
}
.mainlist>div:first-child+div+div{
	text-align:right;
}
.mainlist>div>div>div{
	display:inline-block;
}
.mainlist img{
	vertical-align:top;
	position:relative;
	top:4px;
	margin-right:10px;
	float:left;
	height:48px;
	width:48px;
}

.mainoverview {
	font-size: 130%;
	text-align: center;
	margin-bottom: 10px;
}
.mainoverviews{
	font-size:145%;
	text-align:center;
	margin-bottom:10px;
}
.mainoverviews a{
	margin:5px 15px;
	display:inline-block;
}
</style>

<p class="mainsummary">Bitcoin is an innovative payment network and a new kind of money.</p>
<img src="image/ocp_presentation.png" class="image" />
<div class="mainlist">
	<div><div>
		<img src="image/icon/main_ico_instant.svg" alt="Icon">
		<div>Instant peer-to-peer<br>transactions</div>
	</div></div>
	<div><div>
		<img src="image/icon/main_ico_worldwide.svg" alt="Icon">
		<div>Worldwide<br>payments</div>
	</div></div>
	<div><div>
		<img src="image/icon/main_ico_lowfee.svg" alt="Icon">
		<div>Zero or low<br>processing fees</div>
	</div></div>
</div>
<p class="maindesc">
	Bitcoin uses peer-to-peer technology to operate with no central authority or banks;
	managing transactions and the issuing of bitcoins is carried out collectively by the network.
	<b>Bitcoin is open-source; its design is public, nobody owns or controls Bitcoin and everyone can take part</b>.
	Through many of its unique properties, Bitcoin allows exciting uses that could not be covered by any previous payment system.
</p>
<div class="mainbutton"><a href="/en/getting-started">
	<img src="image/logo_shadow.png" alt="icon">Get started with Bitcoin
</a></div>
<div class="mainoverview">Or get a quick overview for</div>
<div class="mainoverviews">
	<a href="simple.html">Individuals</a>
	<a href="/en/bitcoin-for-businesses">Businesses</a>
	<a href="/en/bitcoin-for-developers">Developers</a>
</div>

<?php

include(BASE_DIR . '/include/bottom_page.inc');

?>