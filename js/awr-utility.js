var awrUtility =
( function( $ ) {
  var sidebar_selector = '.awr-row';

  /* Public function */
  function manage_amounts_of_widgets_and_rows() {
    $( sidebar_selector ).map( function() {
      $sidebar = $( this );
      manage_sidebar( $sidebar );
    } );
  }

  function manage_sidebar( $sidebar ) {
    hide_or_show_button_to_delete_sidebar( $sidebar );
    set_class_based_on_child_widgets( $sidebar );
    manage_number_of_sidebars_and_widgets( $sidebar );
  }

  function hide_or_show_button_to_delete_sidebar( $sidebar ) {
    if ( has_widgets( $sidebar ) && ( is_only_one_sidebar_on_page() ) ) {
      hide_button_to_delete_sidebar();
    }
    else {
      show_button_to_delete_sidebar();
    }
  }

  function has_widgets( $sidebar ) {
    if ( $sidebar.children( '.widget' ) ) {
      return ( $sidebar.children( '.widget' ).length > 0 );
    }
  }

  function is_only_one_sidebar_on_page() {
    return ( $( sidebar_selector ).length === 1 );
  }

  function hide_button_to_delete_sidebar() {
    $( '.awr-delete-sidebar' ).css( 'display' , 'none' );
  }

  function show_button_to_delete_sidebar() {
    $( '.awr-delete-sidebar' ).show();
  }

  function set_class_based_on_child_widgets( $sidebar ) {
    if ( has_widgets( $sidebar ) ) {
      set_has_child_widget( $sidebar );
    }
    else if ( ! has_widgets( $sidebar ) ) {
      set_no_child_widget( $sidebar );
    }
  }

  function set_has_child_widget( $sidebar ) {
    $sidebar.removeClass( 'awr-empty' );
  }

  function set_no_child_widget( $sidebar ) {
    $sidebar.addClass( 'awr-empty' );
  }

  function manage_number_of_sidebars_and_widgets( $sidebar ) {
    if ( ( ! has_widgets( $sidebar ) ) && ( is_only_one_sidebar_on_page() ) ) {
      set_only_sidebar_and_no_widget( $sidebar );
    }
    else {
      set_page_has_multiple_sidebars_or_widgets( $sidebar );
    }
  }

  function set_only_sidebar_and_no_widget( $sidebar ) {
    $sidebar.addClass( 'awr-only-sidebar' );
    $sidebar.find( '.awr-popover-add-new' ).click();
  }

  function set_page_has_multiple_sidebars_or_widgets( $sidebar ) {
    $sidebar.removeClass( 'awr-only-sidebar' );
  }

  return { manage_amounts_of_widgets_and_rows : manage_amounts_of_widgets_and_rows };

} )( jQuery );
