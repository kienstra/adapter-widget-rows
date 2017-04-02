<?php

add_action( 'admin_menu' , 'awr_plugin_page' );
function awr_plugin_page() {
	add_options_page(
		__( 'Bootstrap Widget Rows Settings' , 'adapter-widget-rows' ) ,
		__( 'Widget Rows' , 'adapter-widget-rows' ) ,
		'manage_options' ,
		'awr_options_page' ,
	'awr_plugin_options_page' );
}

function awr_plugin_options_page() {
	?>
	<div class="wrap">
		<?php screen_icon(); ?>
		<h2><?php _e( 'Bootstrap Widget Rows' , 'adapter-widget-rows' ); ?></h2>
		<form action="options.php" method="post" class="awr-options-form">
			<?php settings_fields( 'awr_plugin_options' ); ?>
			<?php do_settings_sections( 'awr_options_page' ); ?>
			<input class="button-primary" name="Submit" type="submit" value="Save Changes" />
			<a href="#" class="awr-new-page button-secondary"><?php _e( 'New Page' , 'adapter-widget-rows' ); ?></a>						
		</form>
	</div>
	<?php
}

add_action( 'admin_init' , 'awr_settings_setup' );
function awr_settings_setup() {
	register_setting( 'awr_plugin_options' , 'map_awr_index_to_page_title' , 'awr_plugin_validate_options' );

	function awr_plugin_validate_options( $input ) {
		$result = array();
		foreach ( $input as $key => $value ) {
			if ( is_int( $key ) ) {
				$result[ $key ] = strip_tags( $input[ $key ] );
			}
		}
		return $result;
	}

	add_settings_section( 'awr_plugin_primary' , 'Settings',
	'awr_plugin_section_text', 'awr_options_page' );

	function awr_plugin_section_text() {
		_e( 'Titles of widget row pages' , 'adapter-widget-rows' );
	}

	add_settings_field( 'awr_plugin_first_page_title' , __( 'Page titles' , 'adapter-widget-rows' ) , 'awr_plugin_setting_first_page_title_output' , 'awr_options_page' , 'awr_plugin_primary' );

	function awr_plugin_setting_first_page_title_output() {
		$map_awr_index_to_page_title = get_option( 'map_awr_index_to_page_title' );
		foreach ( $map_awr_index_to_page_title as $awr_index => $page_title ) {
			if ( $page_title ) {
				$delete_text = __( 'Delete' , 'adapter-widget-rows' );
				echo '<input type="text" id="awr-page-' . esc_attr( $awr_index ) . '" class="awr-page-input" value="' . esc_attr( $page_title ) . '" name="map_awr_index_to_page_title[' . esc_attr( $awr_index ) . ']" />
						<a href="#" class="button-secondary awr-delete-page" data-awr-target="awr-page-' . esc_attr( $awr_index ) . '">' . esc_html( $delete_text ) . '</a>
						</br></br>';
			}
		}
	}
}

// Add settings link on the main plugin page
add_filter( 'plugin_action_links' , 'awr_add_settings_link' , 2 , 2 );
function awr_add_settings_link( $actions, $file ) {
	if ( false !== strpos( $file, AWR_PLUGIN_SLUG ) ) {
		$options_url = admin_url( 'options-general.php?page=awr_options_page' );
		$actions['settings'] = "<a href='{$options_url}'>" . __( 'Settings' ,	'adapter-widget-rows' ) . '</a>';
	}
	return $actions;
}
