( function( $ ) {
  $( function()  {
    var sidebar_selector = '.awr-row' ,
	popover_selector = '.awr-popover';

    /* Sets up popovers at top of rows */
    $( popover_selector ).popover(
      {	html      : true ,
	placement : 'bottom' ,
	title     : '' ,
	animation : false ,
	content   : function() {
		      return $( this ).next().html();
      }
    } );

    // when a popover is shown, hide all other popovers
    $( popover_selector ).on( 'show.bs.popover' , function() {
      $other_popovers = $( popover_selector ).not( $( this ) );
      $other_popovers.popover( 'hide' );
    } );

    // When a popover link is clicked, hide the popover
    $( '.popover-content a' ).live( 'click' , function() {
      var popover_anchor = $( this ).parents( '.popover' ).prev( popover_selector );
      popover_anchor.popover( 'hide' );
    } );

    awrUtility.manage_amounts_of_widgets_and_rows();

    function is_in_iframe() {
      return parent.length > 0;
    }

  } );
} )( jQuery );
