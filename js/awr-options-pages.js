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
			var setElementBeforeNewButton , setNewPageNumber ,
			    setIdNewPageInput , setNewPageInput , setNewPageDeleteButton ,
			    $elementBeforeNewButton , newPageNumber , idNewPageInput ,
			    $newPageInput , $newPageDeleteButton , $breakTags ,
			    createNewPageFields , insertFieldsIntoPage ,
			    $awrPages = $( '.awr-page-input' ) ,
			    $lastPageInput = $awrPages.last() ,
			    $breakTags = $( '</br></br>' );

			setElementBeforeNewButton = function() {
				if ( $lastPageInput.length === 0 ) {
					$elementBeforeNewButton = $( '.awr-options-form .form-table td' );
				}
				else {
					$elementBeforeNewButton = $lastPageInput.next();
				}
			}

			setNewPageNumber = function() {
				var lastPageId , lastPageNumber ;

				if ( $lastPageInput.length === 0 ) {
					newPageNumber = 1;
				} else {
					lastPageId = $lastPageInput.attr( 'id' );
					lastPageNumber = Number( lastPageId.match( /awr-page-([\d]*)/ )[ 1 ] );
					newPageNumber = lastPageNumber + 1;
				}
			}

			setIdNewPageInput = function() {
				idNewPageInput = 'awr-page-' + newPageNumber;
			}

			setNewPageInput = function() {
				$newPageInput = $( '<input>' ).attr( {
					type  : 'text' ,
					id    : idNewPageInput ,
					class : 'awr-page-input' ,
					value : '' ,
					name  : 'map_awr_index_to_page_title[' + newPageNumber + ']'
				} );
			}

			setNewPageDeleteButton = function() {
				$newPageDeleteButton = $( '<a>' )
					.attr( {
						href  : '#' ,
						class : 'button-secondary awr-delete-page' ,
					       }
					     )
					.data( 'awr-target' , idNewPageInput )
					.html( 'Delete' );
			}

			createNewPageFields = function() {
				setElementBeforeNewButton();
				setNewPageNumber();
				setIdNewPageInput();
				setNewPageInput();
				setNewPageDeleteButton();
			}

			insertFieldsIntoPage = function() {
				[ $newPageDeleteButton , $newPageInput , $breakTags ].map( function( element , index ) {
				element.insertAfter( $elementBeforeNewButton );
				} );
			}

			createNewPageFields();
			insertFieldsIntoPage();

			return false;

		} ); /* End $( '.awr-new-page' ).on( 'click'	*/

	} );
} )( jQuery );
