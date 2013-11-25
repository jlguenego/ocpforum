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

<h1>Coming Soon</h1>
<p>This page was not yet written. But it is coming soon. To speed up the OCP project, you can participate by making donation
	or even spending time as a developer, web designer, tester, and even as a researcher...</p>
<?php

include(ROOT_DIR . '/include/bottom_page.inc');

?>