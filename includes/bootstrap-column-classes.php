<?php

add_filter( 'dynamic_sidebar_params', 'awr_assign_bootstrap_classes_to_widgets' ); 
function awr_assign_bootstrap_classes_to_widgets( $sidebars ) {
	if ( preg_match( AWR_ID_REGEX , $sidebars[ 0 ][ 'id' ] ) ) {
		$widget_id = $sidebars[ 0 ][ 'widget_id' ]; 
		$bootstrap_class = awr_get_bootstrap_widget_class( $sidebars[ 0 ][ 'id' ] );
		$initial_before_widget = $sidebars[ 0 ][ 'before_widget' ];	
		$before_widget_with_added_classes = awr_add_new_class_to_opening_div_of_widget( $bootstrap_class , $initial_before_widget );
		$sidebars[ 0 ][ 'before_widget' ] = $before_widget_with_added_classes;
	}
	return $sidebars;
}

function awr_get_bootstrap_widget_class( $sidebar_id ){
	$sidebars_widgets = get_option( 'sidebars_widgets' );
	$all_widgets_in_sidebar = $sidebars_widgets[ $sidebar_id ];
	$number_of_widgets_in_sidebar = count( $all_widgets_in_sidebar );
	if ( $number_of_widgets_in_sidebar > 0 ) {
		$col_number = floor( 12 / $number_of_widgets_in_sidebar ); 
		$bootstrap_class = 'col-md-' . $col_number;
		return $bootstrap_class;
	}
}

function awr_add_new_class_to_opening_div_of_widget( $new_class , $opening_div ) {
	 $div_with_new_class = preg_replace( '/class="(.*?)"/' , "/class='{$new_class} $1'/" , $opening_div );
	 if ( $div_with_new_class === $opening_div ) {	
		 $div_with_new_class = preg_replace( '/(<div)/' , "/$1 class='{$new_class}'/" , $opening_div );
	 }
	 return $div_with_new_class; 
}