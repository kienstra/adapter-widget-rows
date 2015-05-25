( function( $ ) {
	$( function() {
		var widgetInCustomizerControls , getWidgetThatIsOpenInCustomizerControls ,
		    scrollToTopOfIframe , setUpSortableSidebar , setUpSortableHandle ,
		    makeSidebarWidgetsSortable , assignBootstrapClassesToWidgets ,
		    getParentSidebarsOfSortableWidgets , getWidgetId ,
		    getIdOfParentSidebar ,
		    sidebar_selector = '.awr-row' ,
		    sortable_handle = '.awr-edit-controls';

		/* Begin private utility functions */

		getWidgetThatIsOpenInCustomizerControls = function() {
			var idOfOpenSection , wleWidgetRegex , generalWidgetRegex , awrRegex ,
				$openAccordionSection = $( '.open.control-subsection' , window.parent.document );
			if ( ! $openAccordionSection.length ) {
				return false; // there's no widget open in customizer controls
			}

			idOfOpenSection = $openAccordionSection.attr( 'id' );
			wleWidgetRegex = /wle-[\d]{1,3}/;
			generalWidgetRegex = /customize-control-widget_([^\n]*)/;
			awrRegex = /awr-[\d]{1,5}-[\d]{1,5}/;

			if ( idOfOpenSection.match( wleWidgetRegex ) ) {
				return idOfOpenSection.match( wleWidgetRegex );
			} else if ( $openAccordionSection.attr( 'id' ).match( awrRegex ) ) {
				return $openAccordionSection.attr( 'id' ).match( awrRegex );
			}
		};

		scrollToTopOfIframe = function( element_id ) {
			var scrollTopValue ,
			    $iframe_body = $( 'html, body' ) ,
			    $el = $iframe_body.find( '#' + element_id );

			if ( ! $el.length ) {
				return false;
			}
			scrollTopValue = ( $el.offset().top > 25 ) ? ( $el.offset().top - 25 ) : ( $el.offset().top );
			$iframe_body.animate( {
				scrollTop : scrollTopValue
			} , 500 );
		};

		setUpSortableSidebar = function( sidebar_selector ) {
			setUpSortableHandle();
			makeSidebarWidgetsSortable( sidebar_selector );

			$( sidebar_selector ).map( function() {
				$( this ).assignIdentifiersToSortableWidgets();
			} );
		};

		setUpSortableHandle = function() {
			$( sortable_handle ).on( 'hover' , function() {
				$( this ).css( 'cursor' , 'move' );
			} );
			$( sortable_handle ).attr( 'title' , 'drag and drop' );
		};

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
				over        : function( event , ui ) {}
			} );
		};

		getWidgetId = function( $element ) {
			return $element.parents( '.widget' ).attr( 'id' );
		};

		getIdOfParentSidebar = function( $element ) {
			return $element.parents( '.awr-row' ).attr( 'id' );
		};

		assignBootstrapClassesToWidgets = function() {
			$( sidebar_selector ).each( function() {
				var newColumnClass ,
				    columnPrefix = 'col-md-' ,
				    $childWidgets = $( this ).children( '.widget' ).not( '.ui-sortable-helper' ) ,
				    columnSize = Math.floor( 12 / $childWidgets.length );
				if ( columnSize > 12 ) {
					return;
				}
				newColumnClass = columnPrefix + columnSize;
				$( this ).children( '.widget' ).each( function() {
					var currentClasses = $( this ).attr( 'class' ) ,
					    newClasses = currentClasses.replace( /col-md-[\d]+/ , newColumnClass );
					$( this ).attr( 'class' , newClasses );
				} );
			 } );
		};

		getParentSidebarsOfSortableWidgets = function( $sortable_widgets_container ) {
			var sidebars = [];
			$sortable_widgets_container.children( '.widget' ).each( function() {
				sidebars.push( $( this ).data( 'awr-parent-sidebar' ) );
			} );
			return sidebars;
		};

		/* End private utility functions */

		/* Begin jQuery plugin to give names to sortable widgets */

		$.fn.assignIdentifiersToSortableWidgets = function() {
			var sidebarId = this.attr( 'id' ) ,
			    $widgetChildren = this.children( '.widget' );

			if ( $widgetChildren.length > 0 ) {
				$widgetChildren.map( function() {
					$( this ).data( 'awr-parent-sidebar' , sidebarId );
				} );
			}
			return this;
		};

		/* End jQuery plugin */

		/* Begin DOM event handlers for jQuery sortable API */

		$( sidebar_selector ).on( 'sortstart' , function( event , ui ) {
			$( sidebar_selector ).addClass( 'awr-row-with-border' );
		} );

		$( sidebar_selector ).on( 'sortstop' , function( event , ui ) {
			$( sidebar_selector ).removeClass( 'awr-row-with-border' );
		} );

		$( sidebar_selector ).on( 'sortreceive' , function( event , ui ) {
			var parentSidebarOfEachWidget , sidebarId , sortable_order , data;

			assignBootstrapClassesToWidgets();
			sidebarId = $( this ).attr( 'id' );
			parentSidebarOfEachWidget = getParentSidebarsOfSortableWidgets( $( this ) );
			sortable_order = $( this ).sortable( 'toArray' );
			data = {
				sidebarId       : sidebarId ,
				parent_sidebars : parentSidebarOfEachWidget ,
				sortable_order	: sortable_order
			       };

			parent.jQuery( 'body' ).trigger( 'awr-remove-and-insert-widget' , data );
		} );

		// when iframe's widgets are moved, trigger event to reorder them in the customizer controls
		$( sidebar_selector ).on( 'sortupdate' , function( event , ui ) {
			var data ,
			    sidebar_id_with_underscores	= $( this ).attr( 'id' ) ,
			    sidebarId = sidebar_id_with_underscores.replace( /-/g , '_' ) ,
			    parent_sidebar_of_each_widget = getParentSidebarsOfSortableWidgets( $( this ) ) ,
			    sortable_order = $( this ).sortable( 'toArray' );
			awrUtility.manageAmountsOfWidgetsAndRows();

			data = {
				sidebarId	: sidebarId ,
				parent_sidebars : parent_sidebar_of_each_widget ,
				sortable_order	: sortable_order ,
			       };
			parent.jQuery( 'body' ).trigger( 'awr-reorder-widgets' , data );
		} );

		$( sidebar_selector ).on( 'sortover' , function( event , ui ) {
			assignBootstrapClassesToWidgets();
		} );

		parent.jQuery( 'body' ).bind( 'awr-reassign-identifiers' , function( event , data ) {
			var sidebarId = data.sidebarId;
			$( '#' + sidebarId ).assignIdentifiersToSortableWidgets();
		} );

		/* End DOM event handlers for jQuery sortable API */

		/* Begin DOM event handlers for buttons above every widget */

		$( '.awr-edit' ).live( 'click' , function() {
			var data = {
				    widget_id  : getWidgetId( $( this ) ) ,
				    sidebarId : getIdOfParentSidebar( $( this ) )
				   };
			parent.jQuery( 'body' ).trigger( 'awr-open-widget-control' , data );
			return false;
		} );

		$( '.awr-add-new-widget' ).live( 'click' , function() {
			var sidebarId = getIdOfParentSidebar( $( this ) ) ,
			    data = { sidebarId : sidebarId };
			parent.jQuery( 'body' ).trigger( 'awr-add-new-widget' , data );
			return false;
		} );

		$( '.awr-delete-widget' ).live( 'click' , function() {
			var widget_id = getWidgetId( $( this) ) ,
			    sidebarId	= getIdOfParentSidebar( $( this ) ) ,
			    data = {
				    widget_id : widget_id ,
				    sidebarId : sidebarId
				   };

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
