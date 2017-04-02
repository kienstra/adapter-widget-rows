<?php
/**
 * Class file for Adapter_Gravity_Add_On_Plugin
 *
 * @package AdapterWidgetRows
 */

namespace AdapterWidgetRows;

/**
 * Class Adapter_Widget_Rows_Plugin
 */
class Adapter_Widget_Rows_Plugin {

	/**
	 * Plugin slug.
	 *
	 * @var string
	 */
	public $plugin_slug = 'adapter-widget-rows';

	/**
	 * Plugin version.
	 *
	 * @var string
	 */
	public $plugin_version = '1.0.1';

	/**
	 * Regex for row ids.
	 *
	 * @var string
	 */
	public $id_regex = '/awr-[0-9]*-([0-9]*)/';

	/**
	 * Plugin components.
	 *
	 * @var array
	 */
	public $components = array();

	/**
	 * Construct the class.
	 */
	public function __construct() {
		register_activation_hook( array( $this, 'deactivate_if_early_wordpress_version' ) );
		register_activation_hook( array( $this, 'install_with_default_options' ) );
		add_action( 'plugins_loaded', array( $this, 'plugin_localization' ) );
		add_action( 'plugins_loaded', array( $this, 'load_plugin_files' ) );
		add_action( 'wp_enqueue_scripts' , array( $this, 'enqueue_scripts_and_styles' ) );
		add_action( 'customize_register', array( $this, 'enqueue_customizer_scripts' ) );
		add_action( 'customize_controls_enqueue_scripts' , array( $this, 'enqueue_customize_control_scripts' ) );
		add_action( 'admin_enqueue_scripts' , array( $this, 'admin_scripts' ) );
	}

	public function deactivate_if_early_wordpress_version() {
		if ( version_compare( get_bloginfo( 'version' ) , '3.8', '<' ) ) {
			deactivate_plugins( basename( __FILE__ ) );
		}
	}

	/**
	 * Load the textdomain for the plugin, enabling translation.
	 *
	 * @return void.
	 */
	public function plugin_localization() {
		load_plugin_textdomain( $this->plugin_slug, false, $this->plugin_slug . '/languages' );
	}

	public function install_with_default_options() {
		add_option( 'map_awr_index_to_page_title', array() );
		add_option( 'map_awr_index_to_page_id', array() );
		add_option( 'awr_titles_in_trash', array() );
	}

	/**
	 * Load the files for the plugin.
	 *
	 * @return void.
	 */
	public function load_plugin_files() {
		$files_slugs = array(
			'bootstrap-column-classes',
			'class-awr-sidebar',
			'class-awr-markup',
			'awr-icons-popovers',
			'awr-pages-and-sidebars',
			'awr-sidebar-options',
			'class-awr-page',
		);

		foreach ( $files_slugs as $file_slug ) {
			require_once __DIR__ . $file_slug . '.php';
		}
	}

	public function current_user_can_edit_widgets() {
		$capability = apply_filters( 'awr_capability_to_edit_widgets', 'manage_options' );
		return current_user_can( $capability );
	}

	public function enqueue_scripts_and_styles() {
		if ( page_has_awr_rows() && $this->current_user_can_edit_widgets() ) {
			wp_enqueue_style( $this->plugin_slug . '-priveleged-user', plugins_url( '/css/awr-priveleged-user.css' , __FILE__ ), array(), $this->plugin_version );
			wp_enqueue_script( $this->plugin_slug . '-utility', plugins_url( '/js/awr-utility.js' , __FILE__ ), array( 'jquery' ), $this->plugin_version, true );
			wp_enqueue_script( $this->plugin_slug . '-popover', plugins_url( '/js/awr-popover.js' , __FILE__ ) , array( 'jquery', $this->plugin_slug . '-utility' ), $this->plugin_version , true );
		}
	}

	public function enqueue_customizer_scripts() {
		if ( $this->current_user_can_edit_widgets() ) {
			wp_enqueue_script( 'jquery-ui-sortable' );
			wp_enqueue_script( $this->plugin_slug . '-utility', plugins_url( '/js/awr-utility.js' , __FILE__ ), array( 'jquery' ), $this->plugin_version, true );
			wp_enqueue_script( $this->plugin_slug . '-customizer-iframe', plugins_url( '/js/awr-customizer-iframe.js' , __FILE__ ), array( 'jquery', $this->plugin_slug . '-utility', 'jquery-ui-sortable' ), $this->plugin_version, true );
		}
	}

	public function enqueue_customize_control_scripts() {
		wp_enqueue_script( $this->plugin_slug . '-customize-controls-widgets', plugins_url( '/js/awr-customize-controls-widgets.js' , __FILE__ ), array( 'jquery' ), $this->plugin_version, true );
	}

	public function admin_scripts( $hook_suffix ) {
		if ( 'settings_page_awr_options_page' == $hook_suffix ) {
			wp_enqueue_script( AWR_PLUGIN_SLUG . '-options-pages', plugins_url( '/js/awr-options-pages.js' , __FILE__ ), array( 'jquery' ), $this->plugin_version, true );
		}
	}

}