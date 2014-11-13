( function( $ ) {
	$( function() {

		// Link to delete page
		$( '.awr-delete-page' ).live( 'click' , function() {
			var data_awr_target = $( this ).attr( 'data-awr-target' );
			if ( ! data_awr_target ) {
				data_awr_target = $( this ).data( 'awr-target' );
			}
			page_to_delete = $( '#' + data_awr_target );
			page_to_delete.css( 'display' , 'none' )
				.val( '' );
			$( this ).css( 'display' , 'none' );
			return false;
		} );

		// Link to create new page
		$( '.awr-new-page' ).on( 'click' , function() {
			var $awr_pages = $( '.awr-page-input' ) ,
			$last_page_input = $awr_pages.last() ,
			$element_before_new_button = get_element_before_new_button() ,
			new_page_number = get_new_page_number() ,
			new_page_input_id = 'awr-page-' + new_page_number ,
			$new_page_input = get_new_page_input() ,
			$new_page_delete_button = get_new_page_delete_button() ,
			$break_tags = $( '</br></br>' );

			[ $new_page_delete_button , $new_page_input , $break_tags	].map( function( element , index ) {
				element.insertAfter( $element_before_new_button );
			} );

			function get_element_before_new_button() {
				if ( $last_page_input.length === 0 ) {
					return $( '.awr-options-form .form-table td' );
				}
				else {
					return $last_page_input.next();
				}
			}

			function get_new_page_number() {
				if ( $last_page_input.length === 0 ) {
					return 1;
				}
				else {
					var last_page_id = $last_page_input.attr( 'id' );
					var last_page_number = Number( last_page_id.match( /awr-page-([\d]*)/ )[ 1 ] );
					return last_page_number + 1;
				}
			}

			function get_new_page_input() {
				return $( '<input>' ).attr( {
					type	: 'text' ,
					id		: new_page_input_id ,
					class : 'awr-page-input' ,
					value : '' ,
					name : 'map_awr_index_to_page_title[' + new_page_number + ']'
				} );
			}

			function get_new_page_delete_button() {
				return $( '<a>' )
					.attr( {
						href : '#' ,
						class : 'button-secondary awr-delete-page' ,
					} )
					.data( 'awr-target' , new_page_input_id )
					.html( 'Delete' );
			}

			return false;

		} ); /* End $( '.awr-new-page' ).on( 'click'	*/

	} );
} )( jQuery );
