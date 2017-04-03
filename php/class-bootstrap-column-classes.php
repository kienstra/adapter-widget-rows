<?php
/**
 * Class file for Bootstrap_Column_Classes
 *
 * @package AdapterWidgetRows
 */

namespace AdapterWidgetRows;

/**
 * Class Bootstrap_Column_Classes
 */
class Bootstrap_Column_Classes {

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
		add_filter( 'dynamic_sidebar_params', array( $this, 'assign_bootstrap_classes_to_widgets' ) );
	}

	public function assign_bootstrap_classes_to_widgets( $sidebars ) {
		if ( preg_match( $this->plugin->id_regex , $sidebars[0]['id'] ) ) {
			$widget_id = $sidebars[0]['widget_id'];
			$bootstrap_class = $this->get_bootstrap_widget_class( $sidebars[0]['id'] );
			$initial_before_widget = $sidebars[0]['before_widget'];
			$before_widget_with_added_classes = $this->add_new_class_to_opening_div_of_widget( $bootstrap_class , $initial_before_widget );
			$sidebars[0]['before_widget'] = $before_widget_with_added_classes;
		}

		return $sidebars;
	}

	public function get_bootstrap_widget_class( $sidebar_id ) {
		$sidebars_widgets = get_option( 'sidebars_widgets' );
		$all_widgets_in_sidebar = $sidebars_widgets[ $sidebar_id ];
		$number_of_widgets_in_sidebar = count( $all_widgets_in_sidebar );

		if ( $number_of_widgets_in_sidebar > 0 ) {
			$col_number = floor( 12 / $number_of_widgets_in_sidebar );
			$bootstrap_class = 'col-md-' . $col_number;
			return $bootstrap_class;
		} else {
			return '';
		}
	}

	public function add_new_class_to_opening_div_of_widget( $new_class, $opening_div ) {
		$div_with_new_class = preg_replace( '/class="(.*?)"/' , "/class='{$new_class} $1'/" , $opening_div );
		if ( $div_with_new_class === $opening_div ) {
			$div_with_new_class = preg_replace( '/(<div)/' , "/$1 class='{$new_class}'/" , $opening_div );
		}
		return $div_with_new_class;
	}

}
