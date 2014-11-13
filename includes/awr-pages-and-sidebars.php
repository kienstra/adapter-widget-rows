<?php

add_action( 'init' , 'awr_manage_pages_and_register_sidebars' );
function awr_manage_pages_and_register_sidebars() {
	$all_pages_that_have_awr_sidebars = awr_get_all_page_titles_that_have_awr_sidebars();
	awr_handle_pages( $all_pages_that_have_awr_sidebars );
}

function awr_get_all_page_titles_that_have_awr_sidebars() {
	$map_awr_index_to_page_title = get_option( 'map_awr_index_to_page_title' );
	$awr_indices = array_keys( $map_awr_index_to_page_title );
	return $awr_indices;
}

function awr_handle_pages( $all_pages_that_have_awr_sidebars ) {
	foreach( $all_pages_that_have_awr_sidebars as $page ) {
		AWR_Page::manage( $page ); // includes/class-awr-page.php
		awr_handle_sidebars_in_page( $page );
	}
}

function awr_handle_sidebars_in_page( $awr_index ) {
	$page_id = awr_get_page_id( $awr_index );
	if ( $page_id ) {
		awr_register_all_sidebars( $awr_index );
	}
}

function awr_register_all_sidebars( $awr_index ) {
	$page_id = awr_get_page_id( $awr_index );
	$sidebars_in_page = awr_get_ids_of_sidebars_for_page( $page_id );
	if ( ! $sidebars_in_page ) {
		return;
	}
	foreach( $sidebars_in_page as $sidebar_id ) {
		AWR_Sidebar::register( $sidebar_id , $awr_index );
	}
}

function awr_get_page_id( $awr_index ) {
	$map_awr_index_to_page_id = get_option( 'map_awr_index_to_page_id' );
	$page_id = isset( $map_awr_index_to_page_id[ $awr_index ] ) ? $map_awr_index_to_page_id[ $awr_index ] : "";
	return $page_id;
}

function awr_get_ids_of_sidebars_for_page( $page_id ) {
	$ids = array();
	$amount_of_sidebars = apply_filters( 'awr_amount_of_sidebars_on_page' , 6 );
	for( $i = 1; $i <= $amount_of_sidebars; $i++ ) {
		array_push( $ids , 'awr-' . $page_id . '-' . $i );
	}
	return $ids;
}

add_action( 'wp_trash_post', '_wp_delete_post_menu_item' );

add_action( 'template_redirect' , 'awr_route_to_template' );
function awr_route_to_template() {
	$template_path = apply_filters( 'awr_template_path' , plugin_dir_path( __FILE__ ) . 'awr-default-template.php' );
	if ( page_has_awr_rows() ) {
		require_once( $template_path );
		exit;
	}
}

function page_has_awr_rows() {
	global $post;
	$pages_that_have_awr_rows = awr_get_pages_that_have_awr_rows();
	if ( is_page() && $pages_that_have_awr_rows ) {
		return in_array( $post->ID , $pages_that_have_awr_rows );
	}
}

function awr_get_pages_that_have_awr_rows() {
	$map_awr_index_to_page_id = get_option( 'map_awr_index_to_page_id' );
	$result = array_values( $map_awr_index_to_page_id );
	return $result;
}