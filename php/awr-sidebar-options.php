<?php
/**
 * Class file for Sidebar_Options
 *
 * @package AdapterWidgetRows
 */

namespace AdapterWidgetRows;

/**
 * Class Sidebar_Options
 */
class Sidebar_Options {

	/**
	 * Plugin instance
	 *
	 * @var object
	 */
	public $plugin;

	/**
	 * Construct the class.
	 *
	 * @param object $plugin Instance of this plugin.
	 */
	public function __construct( $plugin ) {
		$this->plugin = $plugin;
		add_action( 'admin_menu', array( $this, 'awr_plugin_page' ) );
		add_action( 'admin_init', array( $this, 'settings_setup' ) );
		add_filter( 'plugin_action_links_' . $this->plugin->plugin_slug . '/' . $this->plugin->plugin_slug . '.php', array( $this, 'add_settings_link' ), 10, 2 );
	}

	/**
	 * Adds an options page in /wp-admin under 'Settings.'
	 *
	 * @return void.
	 */
	public function awr_plugin_page() {
		add_options_page(
			__( 'Bootstrap Widget Rows Settings', 'adapter-widget-rows' ),
			__( 'Widget Rows', 'adapter-widget-rows' ),
			'manage_options',
			'awr_options_page',
			array( $this, 'plugin_options_page' )
		);
	}

	/**
	 * Echoes plugin options page in the 'Settings' menu.
	 *
	 * @return void.
	 */
	public function plugin_options_page() {
		?>
		<div class="wrap">
			<?php screen_icon(); ?>
			<h2><?php esc_html_e( 'Bootstrap Widget Rows' , 'adapter-widget-rows' ); ?></h2>
			<form action="options.php" method="post" class="awr-options-form">
				<?php settings_fields( 'awr_plugin_options' ); ?>
				<?php do_settings_sections( 'awr_options_page' ); ?>
				<input class="button-primary" name="Submit" type="submit" value="Save Changes" />
				<a href="#" class="awr-new-page button-secondary"><?php esc_html_e( 'New Page', 'adapter-widget-rows' ); ?></a>
			</form>
		</div>
		<?php
	}

	/**
	 * Adds an options page in /wp-admin under 'Settings.'
	 *
	 * @return void.
	 */
	public function settings_setup() {
		register_setting( 'awr_plugin_options', 'map_awr_index_to_page_title', array( $this, 'awr_validate_options' ) );
		add_settings_section(
			'awr_plugin_primary',
			'Settings',
			array( $this, 'plugin_section_text' ),
			'awr_options_page'
		);

		add_settings_field( 'awr_plugin_first_page_title', __( 'Page titles' , 'adapter-widget-rows' ), array( $this, 'plugin_setting_page_title_output' ), 'awr_options_page', 'awr_plugin_primary' );
	}

	/**
	 * Callback to validate settings values on the /wp-admin settings page.
	 *
	 * @param array $input Options, not fully validated.
	 * @return array $result Options, filtered through this validation.
	 */
	public function awr_validate_options( $input ) {
		$result = array();
		foreach ( $input as $key => $value ) {
			if ( is_int( $key ) ) {
				$result[ $key ] = strip_tags( $input[ $key ] );
			}
		}
		return $result;
	}

	/**
	 * Echo the title text on the plugin options page.
	 *
	 * @return void.
	 */
	public function plugin_section_text() {
		esc_html_e( 'Titles of widget row pages', 'adapter-widget-rows' );
	}

	/**
	 * Echo the title fields on the plugin settings page.
	 *
	 * @return void.
	 */
	public function plugin_setting_page_title_output() {
		$map_awr_index_to_page_title = get_option( 'map_awr_index_to_page_title' );
		foreach ( $map_awr_index_to_page_title as $awr_index => $page_title ) {
			if ( $page_title ) {
				$delete_text = __( 'Delete', 'adapter-widget-rows' );
				echo '<input type="text" id="awr-page-' . esc_attr( $awr_index ) . '" class="awr-page-input" value="' . esc_attr( $page_title ) . '" name="map_awr_index_to_page_title[' . esc_attr( $awr_index ) . ']" />
						<a href="#" class="button-secondary awr-delete-page" data-awr-target="awr-page-' . esc_attr( $awr_index ) . '">' . esc_html( $delete_text ) . '</a>
						</br></br>';
			}
		}
	}

	/**
	 * Add 'Settings' link to the plugin entry on the /wp-admin/plugins.php.
	 *
	 * @param array  $actions Plugin action links.
	 * @param string $plugin_file Path to the plugin file relative to the plugins directory.
	 * @return array $actions Plugin action links.
	 */
	public function add_settings_link( $actions, $plugin_file ) {
		if ( false !== strpos( $plugin_file, $this->plugin->plugin_slug ) ) {
			$options_url = admin_url( 'options-general.php?page=awr_options_page' );
			$actions['settings'] = '<a href="' . esc_url( $options_url ) . '">' . esc_html_e( 'Settings', 'adapter-widget-rows' ) . '</a>';
		}
		return $actions;
	}

}
