( function( $ ) {
	$( function() {
		var remove_title_element_from_widgets , widgetInCustomizerControls ,
		    getWidgetThatIsOpenInCustomizerControls , scrollToTopOfIframe ,
		    setUpSortableSidebar , setUpSortableHandle ,
		    makeSidebarWidgetsSortable , assignBootstrapClassesToWidgets ,
		    getParentSidebarsOfSortableWidgets , getWidgetId ,
		    getIdOfParentSidebar ;

		var sidebar_selector = '.awr-row' ,
		    sortable_handle = '.awr-edit-controls';

		/*
		 * jQuery plugin to give names to sortable widgets
		 */
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

		/* Begin private utility functions */
		
		remove_title_element_from_widgets = function() {
			$( '.widget' ).removeAttr( 'title' );
		};

		getWidgetThatIsOpenInCustomizerControls = function() {
			var $open_accordion_section = $( '.open' , window.parent.document );
			if ( ! $open_accordion_section.length ) {
				return false;
			}
			var id_of_open_section = $open_accordion_section.attr( 'id' ) ,
			    wle_widget_regex = /wle-[\d]{1,3}/ ,
			    general_widget_regex = /customize-control-widget_([^\n]*)/ ,
			    awr_regex = /awr-[\d]{1,5}-[\d]{1,5}/;

			if ( id_of_open_section.match( wle_widget_regex ) ) {
				return id_of_open_section.match( wle_widget_regex );
			}
			else if ( $open_accordion_section.attr( 'id' ).match( awr_regex ) ) {
				return $open_accordion_section.attr( 'id' ).match( awr_regex );
			}
		}

		scrollToTopOfIframe = function( element_id ) {
			var $iframe_body = $( 'html, body' ),
			    $el = $iframe_body.find( '#' + element_id );
			if ( ! $el.length ) {
				return false;
			}
			var scrollTop_value = ( $el.offset().top > 25 ) ? ( $el.offset().top - 25 ) : ( $el.offset().top );
			$iframe_body.animate( {
				scrollTop : scrollTop_value
			} , 500 );
		}

		setUpSortableSidebar = function( sidebar_selector ) {
			setUpSortableHandle();
			makeSidebarWidgetsSortable( sidebar_selector );

			$( sidebar_selector ).map( function() {	
				$( this ).assignIdentifiersToSortableWidgets();
			} );
		}

		setUpSortableHandle = function() {
			$( sortable_handle ).on( 'hover' , function() {
				$( this ).css( 'cursor' , 'move' );
			} );
			$( sortable_handle ).attr( 'title' , 'drag and drop' );
		}

		makeSidebarWidgetsSortable = function( sidebar_selector ) {
			$( sidebar_selector ).sortable( {
				tolerance   : 'pointer' ,
				items       : '.widget' ,
				dropOnEmpty : true ,
				connectWith : sidebar_selector ,
				handle      : sortable_handle ,
				start       : function( event , ui ) {} ,
				stop        : function( event , ui ) {} ,
				receive     : function( event , ui ) {} ,
				update      : function( event , ui ) {} ,
				over        : function( event , ui ) {} ,
			} );
		}

		getWidgetId = function( $element ) {
			return $element.parents( '.widget' ).attr( 'id' );
		}

		getIdOfParentSidebar = function( $element ) {
			return $element.parents( '.awr-row' ).attr( 'id' );
		}

		assignBootstrapClassesToWidgets = function() {
			$( sidebar_selector ).each( function() {
				var column_prefix = 'col-md-',
				    $child_widgets = $( this ).children( '.widget' ).not( '.ui-sortable-helper' ),
				    column_size = Math.floor( 12 / $child_widgets.length );
				if ( column_size > 12 ) {
					return;
				}
				var new_column_class = column_prefix + column_size;
				$( this ).children( '.widget' ).each( function() {
					var current_classes = $( this ).attr( 'class' ),
					    new_classes = current_classes.replace( /col-md-[\d]+/ , new_column_class );
					$( this ).attr( 'class' ,	new_classes );
				} );
			 } );
		}

		getParentSidebarsOfSortableWidgets = function( $sortable_widgets_container ) {
			var sidebars = [];
			$sortable_widgets_container.children( '.widget' ).each( function() {
	 sidebars.push( $( this ).data( 'awr-parent-sidebar' ) );
			} );
			return sidebars;
		}

		/* End private utility functions */

		/* Begin DOM event handlers for jQuery sortable API */

		$( sidebar_selector ).on( 'sortstart' , function( event , ui ) {
			$( sidebar_selector ).addClass( 'awr-row-with-border' );
		} );

		$( sidebar_selector ).on( 'sortstop' , function( event , ui ) {
			$( sidebar_selector ).removeClass( 'awr-row-with-border' );
		} );

		$( sidebar_selector ).on( 'sortreceive' , function( event , ui ) {
			assignBootstrapClassesToWidgets();
			sidebar_id = $( this ).attr( 'id' );
			var parent_sidebar_of_each_widget = getParentSidebarsOfSortableWidgets( $( this ) ) ,
			    sortable_order = $( this ).sortable( 'toArray' ) ,

			    data = {
				     sidebar_id	     : sidebar_id ,
				     parent_sidebars : parent_sidebar_of_each_widget ,
				     sortable_order  : sortable_order ,
				   };

			parent.jQuery( 'body' ).trigger( 'awr-remove-and-insert-widget' , data );
		} );

		// when iframe's widgets are moved, trigger event to reorder them in the customizer controls
		$( sidebar_selector ).on( 'sortupdate' , function( event , ui ) {
			var sidebar_id_with_underscores	= $( this ).attr( 'id' );
			var sidebar_id = sidebar_id_with_underscores.replace( /-/g , '_' );
			var parent_sidebar_of_each_widget = getParentSidebarsOfSortableWidgets( $( this ) );
			var sortable_order = $( this ).sortable( 'toArray' );
			awrUtility.manageAmountsOfWidgetsAndRows();

			data = { sidebar_id	: sidebar_id ,
				parent_sidebars : parent_sidebar_of_each_widget ,
				sortable_order	: sortable_order ,
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

		/* End DOM event handlers for jQuery sortable API */

		/* Begin DOM event handlers for buttons above every widget */

		$( '.awr-edit' ).live( 'click' , function() {
			data = { widget_id : getWidgetId( $( this ) ) ,
				sidebar_id : getIdOfParentSidebar( $( this ) )
			};
			parent.jQuery( 'body' ).trigger( 'awr-open-widget-control' , data );
			return false;
		} );

		$( '.awr-add-new-widget' ).live( 'click' , function() {
			var sidebar_id = getIdOfParentSidebar( $( this ) );
			data = { sidebar_id : sidebar_id };
			parent.jQuery( 'body' ).trigger( 'awr-add-new-widget' , data );
			return false;
		} );

		$( '.awr-delete-widget' ).live( 'click' , function() {
			var widget_id = getWidgetId( $( this) );
			var sidebar_id	= getIdOfParentSidebar( $( this ) );
			data = { widget_id : widget_id ,
				sidebar_id : sidebar_id };
			parent.jQuery( 'body' ).trigger( 'awr-delete-widget' , data );

			$( this ).parents( '.widget' ).fadeOut( 500 , function() {
				$( this ).detach();
				assignBootstrapClassesToWidgets();
				awrUtility.manageAmountsOfWidgetsAndRows();
			} );
			return false;
		} );

		/* End DOM event handlers for buttons above every widget */

		widgetInCustomizerControls = getWidgetThatIsOpenInCustomizerControls();

		if ( widgetInCustomizerControls ) {
			scrollToTopOfIframe( widgetInCustomizerControls );
		}

		setUpSortableSidebar( sidebar_selector );

	} );
} )( jQuery );
