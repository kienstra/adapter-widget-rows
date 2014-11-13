( function( $ ) {
  $( function() {

    $.fn.assignIdentifiersToSortableWidgets = function() {
      sidebar_id = $( this ).attr( 'id' );
      $widget_children = $( this ).children( '.widget' );
      if ( $widget_children.length > 0 ) {
	$widget_children.map( function() {
	  $( this ).data( 'awr-parent-sidebar' , sidebar_id );
	} );
      }
      return this;
    };

    function remove_title_element_from_widgets() { 
      $( '.widget' ).removeAttr( 'title' );
    }

    var widget_in_customizer_controls = get_widget_that_is_open_in_customizer_controls();
    if ( widget_in_customizer_controls ) {
      scroll_to_top_of_iframe( widget_in_customizer_controls );
    }

    function get_widget_that_is_open_in_customizer_controls() {
      var $open_accordion_section = $( '.open' , window.parent.document );
      if ( ! $open_accordion_section.length ) {
	return false;
      }
      var id_of_open_section = $open_accordion_section.attr( 'id' ) ,
      wle_widget_regex = /wle-[\d]{1,3}/ ,
      general_widget_regex =  /customize-control-widget_([^\n]*)/;
      awr_regex = /awr-[\d]{1,5}-[\d]{1,5}/;

      if ( id_of_open_section.match( wle_widget_regex ) ) {
	return id_of_open_section.match( wle_widget_regex );
      }
      else if ( $open_accordion_section.attr( 'id' ).match( awr_regex ) ) {
	return $open_accordion_section.attr( 'id' ).match( awr_regex );
      }
    }

    function scroll_to_top_of_iframe( element_id ) {
      var $iframe_body = $( 'html, body' );
      var $el = $iframe_body.find( '#' + element_id );
      if ( ! $el.length ) {
	return false;
      }
      var scrollTop_value = ( $el.offset().top > 25 ) ? ( $el.offset().top - 25 ) : ( $el.offset().top );
      $iframe_body.animate( {
	  scrollTop : scrollTop_value
      } , 500 );
    }

    var sidebar_selector = '.awr-row' ,
	sortable_handle = '.awr-edit-controls';
    sortableSidebarSetup( sidebar_selector );

    function sortableSidebarSetup( sidebar_selector ) {
      set_up_sortable_handle();
      makeSidebarWidgetsSortable( sidebar_selector );

      $( sidebar_selector ).map( function() {  /* this instead of sidebar_selector? */
	$( this ).assignIdentifiersToSortableWidgets();
      } );
    }

    function set_up_sortable_handle() {
      $( sortable_handle ).on( 'hover' , function() {
	$( this ).css( 'cursor' , 'move' );
      } );
      $( sortable_handle ).attr( 'title' , 'drag and drop' );
    }

    function makeSidebarWidgetsSortable( sidebar_selector ) {
      $( sidebar_selector ).sortable( {
	   tolerance : 'pointer' ,
	   items     : '.widget' ,
	   dropOnEmpty : true ,
	   connectWith : sidebar_selector ,
	   handle : sortable_handle ,
	   start : function( event , ui ) {} ,
	   stop : function( event , ui ) {} ,
	   receive : function( event , ui ) {} ,
	   update : function( event , ui ) {} ,
	   over : function( event , ui ) {} ,
      } );
    }

    $( sidebar_selector ).on( 'sortstart' , function( event , ui ) {
      $( sidebar_selector ).addClass( 'awr-row-with-border' );
    } );

    $( sidebar_selector ).on( 'sortstop' , function( event , ui ) {
      $( sidebar_selector ).removeClass( 'awr-row-with-border' );
    } );

    $( sidebar_selector ).on( 'sortreceive' , function( event , ui ) {
	assignBootstrapClassesToWidgets();
	sidebar_id = $( this ).attr( 'id' );
	var parent_sidebar_of_each_widget = getParentSidebarsOfSortableWidgets( $( this ) );
	var sortable_order = $( this ).sortable( 'toArray' );

	data = { sidebar_id      : sidebar_id ,
		 parent_sidebars : parent_sidebar_of_each_widget ,
		 sortable_order  : sortable_order ,
	       };

	parent.jQuery( 'body' ).trigger( 'awr-remove-and-insert-widget' , data );
    } );

    // when iframe's widgets are moved, trigger event to reorder them in the customizer controls
    $( sidebar_selector ).on( 'sortupdate' , function( event , ui ) {
      var sidebar_id_with_underscores  = $( this ).attr( 'id' );
      var sidebar_id = sidebar_id_with_underscores.replace( /-/g , '_' );
      var parent_sidebar_of_each_widget = getParentSidebarsOfSortableWidgets( $( this ) );
      var sortable_order = $( this ).sortable( 'toArray' );
      awrUtility.manage_amounts_of_widgets_and_rows();

      data = { sidebar_id      : sidebar_id ,
	       parent_sidebars : parent_sidebar_of_each_widget ,
	       sortable_order  : sortable_order ,
	     };
      parent.jQuery( 'body' ).trigger( 'awr-reorder-widgets' , data );
    } );

    $( sidebar_selector ).on( 'sortover' , function( event , ui ) {
      assignBootstrapClassesToWidgets();
    } );

    parent.jQuery( 'body' ).bind( 'awr-reassign-identifiers' , function( event , data ) {
      var sidebar_id = data.sidebar_id;
      $( '#' + sidebar_id ).assignIdentifiersToSortableWidgets();
    } );

    function assignBootstrapClassesToWidgets() {
       $( sidebar_selector ).each( function() {
	  var column_prefix = 'col-md-';
	  var $child_widgets = $( this ).children( '.widget' ).not( '.ui-sortable-helper' );
	  var column_size = Math.floor( 12 / $child_widgets.length );
	  if ( column_size > 12 ) {
	    return;
	  }
	  var new_column_class = column_prefix + column_size;
	  $( this ).children( '.widget' ).each( function() {
	    var current_classes = $( this ).attr( 'class' );
	    var new_classes = current_classes.replace( /col-md-[\d]+/ , new_column_class );
	    $( this ).attr( 'class' ,  new_classes );
	  } );
       } );
    }

    function getParentSidebarsOfSortableWidgets( $sortable_widgets_container ) {
      var sidebars = [];
      $sortable_widgets_container.children( '.widget' ).each( function() {
	  sidebars.push( $( this ).data( 'awr-parent-sidebar' ) );
      } );
      return sidebars;
    }

    /* Handlers for buttons above every widget */
    $( '.awr-edit' ).live( 'click' , function() {
      data = { widget_id : get_widget_id( $( this ) ) ,
	       sidebar_id : get_id_of_parent_sidebar( $( this ) )
      };
      parent.jQuery( 'body' ).trigger( 'awr-open-widget-control' , data );
      return false;
    } );

    $( '.awr-add-new-widget' ).live( 'click' , function() {
      var sidebar_id = get_id_of_parent_sidebar( $( this ) );
      data = { sidebar_id : sidebar_id };
      parent.jQuery( 'body' ).trigger( 'awr-add-new-widget' , data );
      return false;
    } );

    $( '.awr-delete-widget' ).live( 'click' , function() {
      var widget_id = get_widget_id( $( this) );
      var sidebar_id  = get_id_of_parent_sidebar( $( this ) );
      data = { widget_id : widget_id ,
	       sidebar_id : sidebar_id };
      parent.jQuery( 'body' ).trigger( 'awr-delete-widget' , data );

      $( this ).parents( '.widget' ).fadeOut( 500 , function() {
	$( this ).detach();
	assignBootstrapClassesToWidgets();
	awrUtility.manage_amounts_of_widgets_and_rows();
      } );
      return false;
    } );

    function is_entire_page_done_saving() {
      return $( '#save' , window.parent.document ).attr( 'disabled' ) === 'disabled';
    }

    function get_widget_id( $element ) {
      return $element.parents( '.widget' ).attr( 'id' );
    }

    function get_id_of_parent_sidebar( $element ) {
      return $element.parents( '.awr-row' ).attr( 'id' );
    }

  } );
} )( jQuery );
