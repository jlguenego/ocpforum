<?php

define('ROOT_DIR', dirname(__FILE__));
define('BASE_DIR', dirname($_SERVER['SCRIPT_NAME']));


include(ROOT_DIR . '/include/top_page.inc');

?>

<style>
.maindesc {
	max-width: 760px;
	margin: auto;
}

.image {
	display: block;
	margin: auto;
}

#slide_container {
	width: 600px;
	margin: auto;
}

.slidesjs-container {
	border: 1px solid black;

	box-sizing: border-box;
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

.slidesjs-previous, .slidesjs-next {
	float: left;
	display: inline-block;
	vertical-align: top;

	width: 18px;
	height: 18px;

	margin-top: 15px;


	font-size: 0px;
	background-image: url('image/arrows.png');
	overflow: hidden;
}

.slidesjs-previous {
	margin-left: 10px;
}

.slidesjs-next {
	background-position: 100% 0%;
}

.slidesjs-previous:hover, .slidesjs-next:hover {
	background-image: url('image/arrows_hover.png');
}

.slidesjs-pagination {
	float: right;
	margin: 0px;
	padding: 0px;
	margin-right: 10px;
	margin-top: 15px;
}

.slidesjs-pagination-item {
	display: inline-block;
	vertical-align: top;
	width: 7px;
	height: 7px;

	margin: 0px;
	padding: 0px;
	padding-left: 10px;


	font-size: 0px;
}

.slidesjs-pagination-item a {
	display: block;
	border: 2px solid black;
	border-radius: 10px;
	width: 100%;
	height: 100%;
	cursor: pointer;
}

.slidesjs-pagination-item a:hover {
	background-color: #CE2C29;
	border-color: #CE2C29;
}

.slidesjs-pagination-item a.active {
	border-color: black;
	background-color: black;
}
</style>

<p class="mainsummary">OCP allows anybody to store data in anybody computer without trusting anybody.</p>

<div id="slide_container">
	<div id="slides" class="image">
		<img src="image/ocp_presentation_1.png" />
		<img src="image/ocp_presentation_2.png" />
		<img src="image/ocp_presentation_3.png" />
	</div>
</div>
<div class="mainlist">
	<div><div>
		<img src="image/icon/main_ico_instant.svg" alt="Icon">
		<div>Open and<br/>transparent</div>
	</div></div>
	<div><div>
		<img src="image/icon/main_ico_worldwide.svg" alt="Icon">
		<div>Fully<br/>distributed</div>
	</div></div>
	<div><div>
		<img src="image/icon/main_ico_lowfee.svg" alt="Icon">
		<div>Secure and<br/>Confidential</div>
	</div></div>
</div>
<p class="maindesc">
	OCP (Open Cloud Protocol) uses peer-to-peer technology to operate with no central authority or storage provider;
	all storage functionalities, such as buying or selling storage space, storing or retrieving data is carried out collectively by the network.
	<b>OCP is open-source; its design is public, nobody owns or controls OCP and everyone can take part</b>.
	Through many of its unique properties, OCP allows exciting uses that could not be covered by any previous storage system.
</p>
<div class="mainbutton"><a href="/en/getting-started">
	<img src="image/logo_shadow.png" alt="icon">Get started with OCP
</a></div>
<div class="mainoverview">Or get a quick overview for</div>
<div class="mainoverviews">
	<a href="page/individual.php">Individuals</a>
	<a href="page/business.php">Businesses</a>
	<a href="page/developer.php">Developers</a>
</div>

<script>
$(document).ready(function() {
	$("#slides").slidesjs({
		width: 200,
		height: 130
	});
});
</script>

<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>