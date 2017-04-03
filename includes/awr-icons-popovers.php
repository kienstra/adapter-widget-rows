<?php
/**
 * Class file for Icons_Popovers
 *
 * @package AdapterWidgetRows
 */

namespace AdapterWidgetRows;

/**
 * Class Icons_Popovers
 */
class Icons_Popovers {

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
		$this->conditionally_add_controls_to_widget();
		add_action( 'dynamic_sidebar_after' , array( $this, 'after_sidebar' ) );
	}

	public function conditionally_add_controls_to_widget() {
		if ( $this->plugin->current_user_can_edit_widgets() ) {
			add_filter( 'dynamic_sidebar_params', array( $this, 'add_controls_to_widget' ) );
		}
	}

	function add_controls_to_widget( $params ) {
		$widget_id = $params[0]['widget_id'];
		$sidebar_id = $params[0]['id'];
		if ( $this->sidebar_was_created_by_awr( $sidebar_id ) ) {
			$edit_controls = $this->get_edit_controls( $sidebar_id , $widget_id );
			$controls_in_wrapper = '<ul class="awr-edit-controls list-group">
							 <li class="awr-edit-icons list-group-item">'
								. $edit_controls
							. '</li>
						</ul>';
			$params[0]['after_widget'] = $controls_in_wrapper . $params[0]['after_widget'];
		}
		return $params;
	}

	public function sidebar_was_created_by_awr( $sidebar ) {
		return preg_match( $this->plugin->id_regex, $sidebar );
	}

	public function get_edit_controls( $sidebar_id, $widget_id ) {
		$url_for_edit = $this->get_url_for_edit( $sidebar_id , $widget_id );
		$add_new_popover_link_and_content = $this->get_add_new_popover_link_and_content( $sidebar_id );
		$delete_popover_link_and_content = $this->get_delete_popover_link_and_content( $sidebar_id , $widget_id );

		$edit_controls = "<a class='awr-edit' href='{$url_for_edit}' title='edit widget' >
					<span class='glyphicon glyphicon-edit'>
					</span>
				  </a>
				  {$add_new_popover_link_and_content}
				  {$delete_popover_link_and_content}";
		return $edit_controls;
	}

	public function get_url_for_edit( $sidebar_id, $widget_id ) {
		$url = add_query_arg( array(
			'awr_edit'	 => $sidebar_id,
			'awr_widget' => $widget_id,
					  ) ,
			$this->get_customizer_url()
		);
		return $url;
	}

	public function get_customizer_url() {
		if ( is_page() ) {
			$admin_customize_url = admin_url( 'customize.php' );
			$permalink = get_permalink();
			if ( isset( $admin_customize_url ) && isset( $permalink ) ) {
				$customizer_url = add_query_arg( array( 'url' => $permalink ) , $admin_customize_url );
				return $customizer_url;
			}
		}
	}

	public function get_add_new_popover_link_and_content( $sidebar_id ) {
		$url_for_add_new = $this->get_customizer_url_for_add_new( $sidebar_id );
		$link = $this->get_popover_link( 'new' );
		$content = $this->get_popover_content( 'New' , $sidebar_id );
		return $link . $content;
	}

	public function get_customizer_url_for_add_new( $sidebar_id ) {
		$customizer_url = $this->get_customizer_url();
		$customizer_url_for_add_new = add_query_arg(
			array( 'awr_new' => $sidebar_id ),
			$customizer_url
		);
		return $customizer_url_for_add_new;
	}

	public function get_popover_link( $type ) {
		if ( 'new' == $type ) {
			$glyph_suffix = 'plus';
			$title = 'add new';
		} elseif ( 'delete' == $type ) {
			$glyph_suffix = 'trash';
			$title = 'delete';
		}
		$class = str_replace( ' ' , '-' , $title );
		return "<a class='awr-popover awr-popover-{$class}' tabindex='0' >
					<span class='glyphicon glyphicon-{$glyph_suffix}' title='{$title} row or widget'></span>
				</a>";
	}

	public function get_popover_content( $text, $sidebar_id, $widget_id = '' ) {
		global $post;
		if ( ! isset( $post ) ) {
			return;
		}
		$lower_case_text = strtolower( $text );
		if ( 'Delete' == $text ) {
			$class = 'awr-delete';
			$customizer_url = $this->get_customizer_url();

			$widget_url = add_query_arg( array(
				'awr_delete' => $sidebar_id,
				'awr_widget' => $widget_id,
				),
			$customizer_url );
			$sidebar_url = add_query_arg( array( 'awr_delete_sidebar' => $sidebar_id ) ,
			$customizer_url );
		}
		if ( 'New' == $text ) {
			$class = 'awr-add-new';
			$page_id = $post->ID;
			$widget_url = $this->get_customizer_url_for_add_new( $sidebar_id );
			$sidebar_url = add_query_arg( array(
				'awr_new_sidebar' => 'true',
								 'awr_page_id'     => $page_id,
							  ) , $this->get_customizer_url()
			);
		}

		return "<div class='awr-popover-content awr-popover-content-{$lower_case_text} ' style='display: none'>
					 <a href='{$widget_url}' class='{$class}-widget awr-widget btn btn-primary btn-sm'>
						{$text} widget</a>
				 <a class='awr-cancel btn btn-danger btn-sm'>Cancel</a>
			</div>";
	}

	public function get_delete_popover_link_and_content( $sidebar_id, $widget_id ) {
		$popover_for_delete = $this->get_popover_link( 'delete' );
		$delete_popover_content = $this->get_popover_content( 'Delete' , $sidebar_id , $widget_id );
		return $popover_for_delete . $delete_popover_content;
	}

	public function after_sidebar( $sidebar_id ) {
		if ( $this->sidebar_was_created_by_awr( $sidebar_id ) && $this->plugin->current_user_can_edit_widgets() ) {
			$add_new = $this->get_add_new_popover_link_and_content( $sidebar_id );
			$delete = $this->get_delete_anchor( $sidebar_id );
			echo "<ul class='awr-sidebar-icons list-group'>
					<li class='list-group-item'>
						 {$add_new}
					</li>
				  </ul>";
		}
	}

	public function get_delete_anchor( $sidebar_id ) {
		$url_for_delete = add_query_arg( array( 'awr_delete_sidebar' => $sidebar_id ) );
		return "<a href='{$url_for_delete}' class='awr-delete-sidebar' title='delete row'>
				<span class='glyphicon glyphicon-trash'></span>
			</a>\n";
	}

}
