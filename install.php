<?php
define('ROOT_DIR', dirname(__FILE__));
$base_dir = dirname($_SERVER['SCRIPT_NAME']);
if ($base_dir == '/') {
	$base_dir = '';
}

if (file_exists('.htaccess')) {
	header('Location: ' . $base_dir.'/');
	header('Cache-Control: no-cache');
	exit(0);
}

$content = <<<EOF
Options +Includes
AddType text/html .html
AddOutputFilter INCLUDES .html
ErrorDocument 404 ${base_dir}/page/coming-soon.php
EOF;

file_put_contents('.htaccess', $content);

$content = <<<EOF
<?php
	define('BASE_DIR', '${base_dir}');
?>
EOF;

file_put_contents('include/constant.inc', $content);

header('Location: ' . $base_dir);
header('Cache-Control: no-cache');
exit(0);
?>