<?php
define('ROOT_DIR', dirname(__FILE__));
define('BASE_DIR', dirname($_SERVER['SCRIPT_NAME']));


if (file_exists('.htaccess')) {
	header('Location: ' . BASE_DIR);
	header('Cache-Control: no-cache');
	exit(0);
}

$base_dir = BASE_DIR;

$content = <<<EOF
Options +Includes
AddType text/html .html
AddOutputFilter INCLUDES .html
ErrorDocument 404 ${base_dir}/page/coming-soon.php
EOF;

file_put_contents('.htaccess', $content);

header('Location: ' . BASE_DIR);
header('Cache-Control: no-cache');
exit(0);
?>