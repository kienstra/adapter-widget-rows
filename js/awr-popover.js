( function( $ ) {
	$( function()	{
		var popoverSelector = '.awr-popover';

		/*
		 * Sets up popovers at top of rows
		 */
		$( popoverSelector ).popover( {
			html	    : true ,
			placement : 'bottom' ,
			title	    : '' ,
			animation : false ,
			content   : function() {
					return $( this ).next().html();
			}
			}
		);

		// when a popover is shown, hide all other popovers
		$( popoverSelector ).on( 'show.bs.popover' , function() {
			$other_popovers = $( popoverSelector ).not( $( this ) );
			$other_popovers.popover( 'hide' );
		} );

		// When a popover link is clicked, hide the popover
		$( '.popover-content a' ).live( 'click' , function() {
			var popover_anchor = $( this ).parents( '.popover' ).prev( popoverSelector );
			popover_anchor.popover( 'hide' );
		} );

		awrUtility.manageAmountsOfWidgetsAndRows();

	} );
} )( jQuery );
