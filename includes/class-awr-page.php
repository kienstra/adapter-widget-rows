<?php

class AWR_Page {
	private static $instance;
	private $awr_index;
	private $page_title;
	private $map_awr_index_to_page_id;
	private $map_awr_index_to_page_title;
	private $page_id;
	private $new_page_id;

	private function __construct( $awr_index ) {
		$this->awr_index = $awr_index;
		$this->set_instance_properties();
	}

	public static function manage( $awr_index ) {
		self::$instance = new self( $awr_index );
		self::$instance->manage_page_and_update_record();
	}

	private function set_instance_properties() {
		$this->map_awr_index_to_page_id = get_option( 'map_awr_index_to_page_id' );
		$this->page_id = isset( $this->map_awr_index_to_page_id[ $this->awr_index ] ) ? $this->map_awr_index_to_page_id[ $this->awr_index ] : 0;
		$this->map_awr_index_to_page_title = get_option( 'map_awr_index_to_page_title' );
		$this->page_title = $this->map_awr_index_to_page_title[ $this->awr_index ];

	}

	private function manage_page_and_update_record() {
		if ( $this->page_should_be_deleted() ) {
			$this->delete_post_and_update_record();
		} elseif ( $this->page_is_in_awr_trash() ) {
			$this->insert_post_from_trash();
			$this->maybe_update_record();
		} else {
			$this->update_or_add_page();
			$this->maybe_update_record();
		}
	}

	private function page_should_be_deleted() {
		if ( isset( $this->page_title ) ) {
			 return ( '' == $this->page_title );
		}
		return false;
	}

	function delete_post_and_update_record() {
		wp_trash_post( $this->page_id );
		add_awr_page_id_to_trash_list( $this->page_id );

		unset( $this->map_awr_index_to_page_id[ $this->awr_index ] );
		update_option( 'map_awr_index_to_page_id' , $this->map_awr_index_to_page_id );

		unset( $this->map_awr_index_to_page_title[ $this->awr_index ] );
		update_option( 'map_awr_index_to_page_title' , $this->map_awr_index_to_page_title );
	}

	private function page_is_in_awr_trash() {
		if ( 0 == $this->page_id ) {
			$old_page = get_page_by_title( $this->page_title );
			return ( isset( $old_page ) && is_awr_page_id_in_trash( $old_page->ID ) );
		}
	}

	function insert_post_from_trash() {
		 $old_page = get_page_by_title( $this->page_title );
		 $page_id = $old_page->ID;
		 $post_name = $old_page->post_name;

		 $this->new_page_id = wp_insert_post( array(
				'ID'		 => $page_id,
				'post_title'	 => $this->page_title,
				'post_status'	 => 'publish',
				'post_type'	 => 'page',
				'post_author'	 => get_current_user_id(),
				'post_name'	 => $post_name,
		 ) );
	}

	function update_or_add_page() {
		$this->new_page_id = wp_insert_post( array(
				'ID'		=> $this->page_id,
				'post_title'	=> $this->page_title,
				'post_status'	=> 'publish',
				'post_type'	=> 'page',
				'post_author'	=> get_current_user_id(),
		) );
	}

	private function maybe_update_record() {
		if ( $this->new_page_was_created_or_taken_out_of_trash() ) {
			$this->update_record_for_new_page();
		}
	}

	private function new_page_was_created_or_taken_out_of_trash() {
		return ( ( $this->new_page_id ) && ( $this->new_page_id != $this->page_id ) );
	}

	function update_record_for_new_page() {
		$this->map_awr_index_to_page_id[ $this->awr_index ] = $this->new_page_id;
		update_option( 'map_awr_index_to_page_id' , $this->map_awr_index_to_page_id );
	}

}	 /* End class AWR_Page */


function is_awr_page_id_in_trash( $title ) {
	$trash = get_option( 'awr_pages_in_trash' );
	if ( $trash ) {
		return in_array( $title , $trash );
	}
}

function add_awr_page_id_to_trash_list( $title ) {
	$trash = get_option( 'awr_pages_in_trash' );
	$trash[] = $title;
	update_option( 'awr_pages_in_trash' , $trash );
}
