<?php

class AWR_Markup {

	private static $instance;
	private $sidebars_in_page;
	private $page_id;
	private $awr_id;

	private function __construct() {
		$this->set_page_id();
		$this->set_sidebars_in_page();
	}

	public static function echo_sidebars() {
		self::$instance = new self();
		self::$instance->echo_markup_to_page();
	}

	private function set_page_id() {
		global $post;
		if ( is_page() && isset( $post->ID ) ) {
			$this->page_id = $post->ID;
		}
	}

	function set_sidebars_in_page() {
		$this->sidebars_in_page = awr_get_ids_of_sidebars_for_page( $this->page_id );
	}

	private function echo_markup_to_page() {
		foreach( $this->sidebars_in_page as $sidebar ) {
			$this->maybe_echo_sidebar_markup( $sidebar );
		}
		if ( $this->page_has_no_sidebars_with_widgets() ) {
			$this->handle_no_sidebars_with_widgets();
		}
	}

	private function maybe_echo_sidebar_markup( $sidebar ) {
		if ( is_active_sidebar( $sidebar ) || $this->is_customizer_page() ) {
			$this->echo_sidebar_markup( $sidebar );
		}
	}

	private function is_customizer_page() {
		global $wp_customize;
		return ( isset( $wp_customize ) );
	}

	private function echo_sidebar_markup( $sidebar ) {
		echo "<div class='row awr-row' id='{$sidebar}'>";
			if ( dynamic_sidebar( $sidebar ) );
		echo "</div>\n";
	}

	private function page_has_no_sidebars_with_widgets() {
		foreach( $this->sidebars_in_page as $sidebar ) {
			if ( is_active_sidebar( $sidebar ) ) {
				return false;
			}
		}
		return true;
	}

	private function handle_no_sidebars_with_widgets() {
		if ( current_user_can( 'manage_options' ) ) {
			$first_sidebar = reset( $this->sidebars_in_page );
			$this->echo_sidebar_markup( $first_sidebar );
		}
	}

}	/* end class AWR_Markup */