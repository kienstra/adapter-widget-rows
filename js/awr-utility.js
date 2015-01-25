var awrUtility = ( function( $ ) {
	var manageAmountsOfWidgetsAndRows , manageSidebar , hideOrShowButtonToDeleteSidebar ,
	    hasWidgets , isOnlyOneSidebarOnPage , showButtonToDeleteSidebar ,
	    setClassBasedOnChildWidgets , setHasChildWidget , setNoChildWidget ,
	    manageNumberOfSidebarsAndWidgets , setOnlySidebarAndNoWidget ,
	    setPageHasMultipleSidebarsForWidgets ,
	    sidebar_selector = '.awr-row';

	/* Public function */
	manageAmountsOfWidgetsAndRows = function() {
		$( sidebar_selector ).map( function() {
			$sidebar = $( this );
			manageSidebar( $sidebar );
		} );
	}

	/* Begin private functions */
	manageSidebar = function( $sidebar ) {
		hideOrShowButtonToDeleteSidebar( $sidebar );
		setClassBasedOnChildWidgets( $sidebar );
		manageNumberOfSidebarsAndWidgets( $sidebar );
	}

	hideOrShowButtonToDeleteSidebar = function( $sidebar ) {
		if ( hasWidgets( $sidebar ) && ( isOnlyOneSidebarOnPage() ) ) {
			hideButtonToDeleteSidebar();
		}
		else {
			showButtonToDeleteSidebar();
		}
	}

	hasWidgets = function( $sidebar ) {
		if ( $sidebar.children( '.widget' ) ) {
			return ( $sidebar.children( '.widget' ).length > 0 );
		}
	}

	isOnlyOneSidebarOnPage = function() {
		return ( $( sidebar_selector ).length === 1 );
	}

	hideButtonToDeleteSidebar = function() {
		$( '.awr-delete-sidebar' ).css( 'display' , 'none' );
	}

	showButtonToDeleteSidebar = function() {
		$( '.awr-delete-sidebar' ).show();
	}

	setClassBasedOnChildWidgets = function( $sidebar ) {
		if ( hasWidgets( $sidebar ) ) {
			setHasChildWidget( $sidebar );
		}
		else if ( ! hasWidgets( $sidebar ) ) {
			setNoChildWidget( $sidebar );
		}
	}

	setHasChildWidget = function( $sidebar ) {
		$sidebar.removeClass( 'awr-empty' );
	}

	setNoChildWidget = function( $sidebar ) {
		$sidebar.addClass( 'awr-empty' );
	}

	manageNumberOfSidebarsAndWidgets = function( $sidebar ) {
		if ( ( ! hasWidgets( $sidebar ) ) && ( isOnlyOneSidebarOnPage() ) ) {
			setOnlySidebarAndNoWidget( $sidebar );
		}
		else {
			setPageHasMultipleSidebarsForWidgets( $sidebar );
		}
	}

	setOnlySidebarAndNoWidget = function( $sidebar ) {
		$sidebar.addClass( 'awr-only-sidebar' );
		$sidebar.find( '.awr-popover-add-new' ).click();
	}

	setPageHasMultipleSidebarsForWidgets = function( $sidebar ) {
		$sidebar.removeClass( 'awr-only-sidebar' );
	}
	/* End private functions */
	
	return { manageAmountsOfWidgetsAndRows : manageAmountsOfWidgetsAndRows };

} )( jQuery );
