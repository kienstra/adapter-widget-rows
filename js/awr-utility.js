var awrUtility =
( function( $ ) {
	var manageAmountsOfWidgetsAndRows, sidebar_selector = '.awr-row';

	/* Public function */
	function manageAmountsOfWidgetsAndRows() {
		$( sidebar_selector ).map( function() {
			$sidebar = $( this );
			manageSidebar( $sidebar );
		} );
	}

	/* Private functions */
	function manageSidebar( $sidebar ) {
		hideOrShowButtonToDeleteSidebar( $sidebar );
		setClassBasedOnChildWidgets( $sidebar );
		manageNumberOfSidebarsAndWidgets( $sidebar );
	}

	function hideOrShowButtonToDeleteSidebar( $sidebar ) {
		if ( hasWidgets( $sidebar ) && ( isOnlyOneSidebarOnPage() ) ) {
			hideButtonToDeleteSidebar();
		}
		else {
			showButtonToDeleteSidebar();
		}
	}

	function hasWidgets( $sidebar ) {
		if ( $sidebar.children( '.widget' ) ) {
			return ( $sidebar.children( '.widget' ).length > 0 );
		}
	}

	function isOnlyOneSidebarOnPage() {
		return ( $( sidebar_selector ).length === 1 );
	}

	function hideButtonToDeleteSidebar() {
		$( '.awr-delete-sidebar' ).css( 'display' , 'none' );
	}

	function showButtonToDeleteSidebar() {
		$( '.awr-delete-sidebar' ).show();
	}

	function setClassBasedOnChildWidgets( $sidebar ) {
		if ( hasWidgets( $sidebar ) ) {
			setHasChildWidget( $sidebar );
		}
		else if ( ! hasWidgets( $sidebar ) ) {
			setNoChildWidget( $sidebar );
		}
	}

	function setHasChildWidget( $sidebar ) {
		$sidebar.removeClass( 'awr-empty' );
	}

	function setNoChildWidget( $sidebar ) {
		$sidebar.addClass( 'awr-empty' );
	}

	function manageNumberOfSidebarsAndWidgets( $sidebar ) {
		if ( ( ! hasWidgets( $sidebar ) ) && ( isOnlyOneSidebarOnPage() ) ) {
			setOnlySidebarAndNoWidget( $sidebar );
		}
		else {
			setPageHasMultipleSidebarsForWidgets( $sidebar );
		}
	}

	function setOnlySidebarAndNoWidget( $sidebar ) {
		$sidebar.addClass( 'awr-only-sidebar' );
		$sidebar.find( '.awr-popover-add-new' ).click();
	}

	function setPageHasMultipleSidebarsForWidgets( $sidebar ) {
		$sidebar.removeClass( 'awr-only-sidebar' );
	}

	return { manageAmountsOfWidgetsAndRows : manageAmountsOfWidgetsAndRows };

} )( jQuery );
