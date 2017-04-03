<?php
/**
 * Plugin bootstrap file.
 *
 * @package AdapterWidgetRows
 */

namespace AdapterWidgetRows;

/*

Plugin Name: Adapter Widget Rows
Plugin URI: www.ryankienstra.com/plugins/adapter-widget-rows
Description: Drag and drop widgets into rows. To get started, click "Settings" and enter a page name. Find that page in the front of your site and add widgets.
Version: 1.0.1
Author: Ryan Kienstra
Author URI: www.ryankienstra.com
License: GPLv2

*/

require_once dirname( __FILE__ ) . '/includes/class-adapter-widget-rows-plugin.php';

global $adapter_widget_rows_plugin;
$adapter_widget_rows_plugin = new Adapter_Widget_Rows_Plugin();
