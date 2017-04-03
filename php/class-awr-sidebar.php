<?php
/**
 * Class file for AWR_Sidebar
 *
 * @package AdapterWidgetRows
 */

namespace AdapterWidgetRows;

/**
 * Class AWR_Sidebar
 */
class AWR_Sidebar {

	private static $instance;
	private static $map_page_to_number_of_awr_sidebars = array();
	private $page_id;
	private $page_title;
	private $sidebar_ordinal;
	private $awr_index;
	private $sidebar_id;

	public function __construct( $sidebar_id, $awr_index ) {
		$this->sidebar_id = $sidebar_id;
		$this->awr_index = $awr_index;
		$this->set_variables();
	}

	public static function register( $sidebar_id, $awr_index ) {
		self::$instance = new self( $sidebar_id , $awr_index );
		self::$instance->awr_register_sidebar();
	}

	public function set_variables() {
		$this->set_page_id();
		$this->set_page_title();
		$this->set_sidebar_ordinal_and_increment_map();
	}

	public function set_page_id() {
		$map_awr_index_to_page_id = get_option( 'map_awr_index_to_page_id' );
		$this->page_id = $map_awr_index_to_page_id[ $this->awr_index ];
	}

	public function set_page_title() {
		$map_awr_index_to_page_title = get_option( 'map_awr_index_to_page_title' );
		$this->page_title = $map_awr_index_to_page_title[ $this->awr_index ];
	}

	public function set_sidebar_ordinal_and_increment_map() {
		if ( ! isset( self::$map_page_to_number_of_awr_sidebars[ $this->page_id ] ) ) {
			$this->sidebar_ordinal = 1;
			self::$map_page_to_number_of_awr_sidebars[ $this->page_id ] = 2;
		} else {
			$this->sidebar_ordinal = self::$map_page_to_number_of_awr_sidebars[ $this->page_id ];
			$this->increment_ordinal();
		}
	}

	public function increment_ordinal() {
		self::$map_page_to_number_of_awr_sidebars[ $this->page_id ] = 1 + self::$map_page_to_number_of_awr_sidebars[ $this->page_id ];
	}

	public function awr_register_sidebar() {
		$sidebar_name_to_display = $this->page_title . ': Row #' . $this->sidebar_ordinal;
		if ( $this->do_register_awr_sidebars() ) {
			register_sidebar( array(
				'name'	=> $sidebar_name_to_display,
				'id'	=> $this->sidebar_id,
				'description'	=> __( 'Adapter Widget Row' , 'adapter-widget-rows' ),
				'before_widget'	=> '<div id="%1$s" class="widget %2$s">', /* must have 'widget' class for .sortable to work */
				'after_widget'	=> '</div>',
				'before_title'	=> '<h2>',
				'after_title'	=> '</h2>',
			) );
		}
	}

	/**
	 * Whether to register the plugin's widget sidebars.
	 *
	 * @return bool $do_register Whether to register sidebars
	 */
	public function do_register_awr_sidebars() {
		return ( is_customize_preview() || ! is_admin() );
	}

}
