<?php


define( 'AWR_PLUGIN_SLUG', 'adapter-widget-rows' );
define( 'AWR_PLUGIN_VERSION', '1.0.1' );
define( 'AWR_ID_REGEX', '/awr-[0-9]*-([0-9]*)/' );

register_activation_hook( __FILE__, 'awr_deactivate_if_early_wordpress_version' );
register_activation_hook( __FILE__, 'awr_install_with_default_options' );

function awr_deactivate_if_early_wordpress_version() {
	if ( version_compare( get_bloginfo( 'version' ) , '3.8', '<' ) ) {
		deactivate_plugins( basename( __FILE__ ) );
	}
}

load_plugin_textdomain( 'adapter-widget-rows', false , basename( dirname( __FILE__ ) ) . '/languages' );

function awr_install_with_default_options() {
	add_option( 'map_awr_index_to_page_title', array() );
	add_option( 'map_awr_index_to_page_id', array() );
	add_option( 'awr_titles_in_trash', array() );
}

add_action( 'plugins_loaded', 'awr_get_included_files' );
function awr_get_included_files() {
	$included_files = array(
		'bootstrap-column-classes',
	'class-awr-sidebar',
	'class-awr-markup',
	'awr-icons-popovers',
	'awr-pages-and-sidebars',
	'awr-sidebar-options',
	'class-awr-page',
	);
	foreach ( $included_files as $file ) {
		include_once( plugin_dir_path( __FILE__ ) . $file . '.php' );
	}
}

function awr_current_user_can_edit_widgets() {
	$capability = apply_filters( 'awr_capability_to_edit_widgets', 'manage_options' );
	return current_user_can( $capability );
}

add_action( 'wp_enqueue_scripts' , 'awr_enqueue_scripts_and_styles' );
function awr_enqueue_scripts_and_styles() {
	if ( page_has_awr_rows() && awr_current_user_can_edit_widgets() ) {
		wp_enqueue_style( AWR_PLUGIN_SLUG . '-priveleged-user', plugins_url( '/css/awr-priveleged-user.css' , __FILE__ ), array(), AWR_PLUGIN_VERSION );
		wp_enqueue_script( AWR_PLUGIN_SLUG . '-utility', plugins_url( '/js/awr-utility.js' , __FILE__ ), array( 'jquery' ), AWR_PLUGIN_VERSION, true );
		wp_enqueue_script( AWR_PLUGIN_SLUG . '-popover', plugins_url( '/js/awr-popover.js' , __FILE__ ) , array( 'jquery', AWR_PLUGIN_SLUG . '-utility' ), AWR_PLUGIN_VERSION , true );
	}
}

add_action( 'customize_register' , 'awr_enqueue_customizer_scripts' );
function awr_enqueue_customizer_scripts() {
	if ( awr_current_user_can_edit_widgets() ) {
		wp_enqueue_script( 'jquery-ui-sortable' );
		wp_enqueue_script( AWR_PLUGIN_SLUG . '-utility', plugins_url( '/js/awr-utility.js' , __FILE__ ), array( 'jquery' ), AWR_PLUGIN_VERSION, true );
		wp_enqueue_script( AWR_PLUGIN_SLUG . '-customizer-iframe', plugins_url( '/js/awr-customizer-iframe.js' , __FILE__ ), array( 'jquery', AWR_PLUGIN_SLUG . '-utility', 'jquery-ui-sortable' ), AWR_PLUGIN_VERSION, true );
	}
}

add_action( 'customize_controls_enqueue_scripts' , 'awr_enqueue_customize_control_scripts' );
function awr_enqueue_customize_control_scripts() {
	wp_enqueue_script( AWR_PLUGIN_SLUG . '-customize-controls-widgets', plugins_url( '/js/awr-customize-controls-widgets.js' , __FILE__ ), array( 'jquery' ), AWR_PLUGIN_VERSION, true );
}

add_action( 'admin_enqueue_scripts' , 'awr_admin_scripts' );
function awr_admin_scripts( $hook_suffix ) {
	if ( 'settings_page_awr_options_page' == $hook_suffix ) {
		wp_enqueue_script( AWR_PLUGIN_SLUG . '-options-pages', plugins_url( '/js/awr-options-pages.js' , __FILE__ ), array( 'jquery' ), AWR_PLUGIN_VERSION, true );
	}
}
