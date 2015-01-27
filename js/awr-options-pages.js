( function( $ ) {
	$( function() {

		// Link to delete page
		$( '.awr-delete-page' ).live( 'click' , function() {
			var pageToDelete ,
			    dataAwrTarget = $( this ).attr( 'data-awr-target' );

			if ( ! dataAwrTarget ) {
				dataAwrTarget = $( this ).data( 'awr-target' );
			}
			pageToDelete = $( '#' + dataAwrTarget );
			pageToDelete.css( 'display' , 'none' )
				    .val( '' );
			$( this ).css( 'display' , 'none' );
			return false;
		} );

		// Link to create new page
		$( '.awr-new-page' ).on( 'click' , function() {
			var getElementBeforeNewButton , getNewPageNumber ,
			    getNewPageInput , getNewPageDeleteButton ,
			    $elementBeforeNewButton , newPageNumber , newPageInputId ,
			    $newPageInput , $newPageDeleteButton , $breakTags,
			    $awrPages = $( '.awr-page-input' ) ,
			    $lastPageInput = $awrPages.last();

			getElementBeforeNewButton = function() {
				if ( $lastPageInput.length === 0 ) {
					return $( '.awr-options-form .form-table td' );
				}
				else {
					return $lastPageInput.next();
				}
			}

			getNewPageNumber = function() {
				if ( $lastPageInput.length === 0 ) {
					return 1;
				}
				else {
					var last_page_id = $lastPageInput.attr( 'id' );
					var last_page_number = Number( last_page_id.match( /awr-page-([\d]*)/ )[ 1 ] );
					return last_page_number + 1;
				}
			}

			getNewPageInput = function() {
				return $( '<input>' ).attr( {
					type  : 'text' ,
					id    : newPageInputId ,
					class : 'awr-page-input' ,
					value : '' ,
					name  : 'map_awr_index_to_page_title[' + newPageNumber + ']'
				} );
			}

			getNewPageDeleteButton = function() {
				return $( '<a>' )
					.attr( {
						href  : '#' ,
						class : 'button-secondary awr-delete-page' ,
					       }
					     )
					.data( 'awr-target' , newPageInputId )
					.html( 'Delete' );
			}

			$elementBeforeNewButton = getElementBeforeNewButton();
			newPageNumber = getNewPageNumber();
			newPageInputId = 'awr-page-' + newPageNumber;
			$newPageInput = getNewPageInput();
			$newPageDeleteButton = getNewPageDeleteButton();
			$breakTags = $( '</br></br>' );

			[ $newPageDeleteButton , $newPageInput , $breakTags ].map( function( element , index ) {
				element.insertAfter( $elementBeforeNewButton );
			} );

			return false;

		} ); /* End $( '.awr-new-page' ).on( 'click'	*/

	} );
} )( jQuery );
