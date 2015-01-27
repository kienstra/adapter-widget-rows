( function( $ ) {
	$( function() {

		/* Module-scope variables, including functions */
		var getSidebarAccordionSection , addClassesToFirstAndLastWidgetsIn ,
		    triggerSortUpdateFor , manageUriVariables , findQueryVarValue ,
		    openWidgetCustomizerControl , openWleAccordionSection ,
		    exitPanelIfNotIn , openAccordionSection , scrollSectionToTopOfControls ,
		    scrollElementToTopOfControls , openPanel , openSidebarAccordionSection ,
		    openWidgetAccordionSection , scrollSidebarToTopOfControls ,
		    deleteWidgetFromCustomizerControls , ifIsWleWidgetDeletePanel ,
		    openNewWidgetPanelForSidebar , getCustomizeControlsSidebar ,
		    getCustomizeControlsWidget , afterDeleteWidgetFrom;

		/* Begin module-scope utility functions */

		getSidebarAccordionSection = function( sidebar_id ) {
			return $( '#accordion-section-sidebar-widgets-' + sidebar_id + ' .accordion-section-content' );
		};

		addClassesToFirstAndLastWidgetsIn = function( $sidebarAccordionSection ) {
			var widgets = $sidebarAccordionSection.find( '.customize-control-widget_form' );
			widgets.map( function() {
				$( this ).removeClass( 'first-widget' ).removeClass( 'last-widget' );
			} );
			widgets.first().addClass( 'first-widget' );
			widgets.last().addClass( 'last-widget' );
		};

		triggerSortUpdateFor = function( sidebar_id ) {
			var sortable_element = $( '#accordion-section-sidebar-widgets-' + sidebar_id + ' .ui-sortable' ).data( 'ui-sortable' );
			sortable_element._trigger( "update" , null , sortable_element._uiHash( sortable_element ) );
		};

		manageUriVariables = function() {
			var awr_edit = findQueryVarValue( 'awr_edit' ) ,
			    awr_delete = findQueryVarValue( 'awr_delete' ) ,
			    awr_new = findQueryVarValue( 'awr_new' ) ,
			    awr_widget = findQueryVarValue( 'awr_widget' ) ,
			    wle_target = findQueryVarValue( 'wle_target' );

			if ( awr_edit && awr_widget ) {
				openWidgetCustomizerControl( awr_edit , awr_widget );
			}
			else if ( wle_target ) {
				openWleAccordionSection( wle_target );
			}
			else if ( awr_new ) {
				openNewWidgetPanelForSidebar( awr_new );
			}
			else if ( awr_delete && awr_widget ) {
				deleteWidgetFromCustomizerControls( awr_widget , awr_delete );
			}
		};

		findQueryVarValue = function( query_var_key ) {
			 var href = encodeURI( document.location.href ) ,
			     query_value = href.match( query_var_key + '=([^&^#]*)' );
			 if ( query_value && query_value.length > 0 ) {
				 return query_value[ 1 ];
			 }
		 };

		openWidgetCustomizerControl = function( sidebar_id , widget_id ) {
			var scrollInterval , interval;
			if ( widget_id.match( /wle-[\d]{1,3}/ ) ) {
				openWleAccordionSection( widget_id );
				return;
			}
			openPanel( 'widgets' );
			openSidebarAccordionSection( sidebar_id );
			openWidgetAccordionSection( widget_id );

			scrollInterval = function() {
				scrollSidebarToTopOfControls( sidebar_id );
				clearInterval( interval ) ;
			};
			interval = setInterval( scrollInterval , 200 );
		};

		openWleAccordionSection = function( widget_id ) {
			openPanel( 'wle_panel' );
			openAccordionSection( widget_id );
		};

		exitPanelIfNotIn = function( panel_title ) {
			if ( ( $( '.in-sub-panel' ).length > 0 ) && $( '.current-panel' ).attr( 'id' ) !== 'accordion-panel-' + panel_title ) {
				$( '.control-panel-back' ).click();
			}
		};

		openAccordionSection = function( title ) {
			var $accordion_section = $( '#accordion-section-' + title );
			if ( ! $accordion_section.hasClass( 'open' ) ) {
				$accordion_section.find( '.accordion-section-title' ).click();
			}
			scrollSectionToTopOfControls( title );
			return false;
		};

		scrollSectionToTopOfControls = function( title ) {
			var $element = $( '#accordion-section-' + title );
			scrollElementToTopOfControls( $element );
		};

		scrollElementToTopOfControls = function( $element ) {
			if ( $element.length < 1 ) {
				return;
			}
			var $accordionContainer = $( '.accordion-container' ) ,
			    currentScrollTop = $accordionContainer.scrollTop() ,
			    elementOffset = $element.offset().top ,
			    newScrollTop = elementOffset + currentScrollTop;
			$accordionContainer.scrollTop( newScrollTop );
		};

		openPanel = function( panelName ) {
			var $panel;
			exitPanelIfNotIn( panelName );
			$panel = $( '#accordion-panel-' + panelName );
			if ( ! $panel.hasClass( 'current-panel' ) ) {
				$panel.find( '.accordion-section-title' ).click();
			}
		};

		openSidebarAccordionSection = function( sidebar_id ) {
			var $sidebarAccordionSection = getCustomizeControlsSidebar( sidebar_id );
			if ( ! $sidebarAccordionSection.hasClass( 'open' ) ) {
				$sidebarAccordionSection.find( '.accordion-section-title' ).click();
			}
		};

		openWidgetAccordionSection = function( widget_id ) {
			var $widget_accordion_section = getCustomizeControlsWidget( widget_id );
			if ( ! $widget_accordion_section.hasClass( 'expanded' ) ) {
				$widget_accordion_section.siblings().removeClass( 'expanded' );
				$widget_accordion_section.find( 'h4' ).click();
			}
		};

		scrollSidebarToTopOfControls = function( sidebar_id ) {
			var currentScrollTopValue = $( '.accordion-container' ).scrollTop() ,
			    newScrollTopValue = currentScrollTopValue + $( '#accordion-section-sidebar-widgets-' + sidebar_id ).position().top;
			$( '.accordion-container' ).scrollTop( newScrollTopValue );
		};

		deleteWidgetFromCustomizerControls = function( widget_id , sidebar_id ) {
			getCustomizeControlsWidget( widget_id ).find( '.widget-control-remove' ).click();
			ifIsWleWidgetDeletePanel( widget_id );
			afterDeleteWidgetFrom( sidebar_id );
		};

		ifIsWleWidgetDeletePanel = function( widget_id ) {
			if ( widget_id && widget_id.match( /wle-[\d]{1,3}/ ) ) {
				$( '#accordion-section-' + widget_id ).hide( 500 );
			}
		};

		openNewWidgetPanelForSidebar = function( sidebar_id ) {
			openPanel( 'widgets' );
			$customize_controls_sidebar = getCustomizeControlsSidebar( sidebar_id );
			setTimeout( function() {
				$customize_controls_sidebar.find( '.accordion-section-title' ).click();
				$customize_controls_sidebar.find( '.add-new-widget' ).click();
				scrollSidebarToTopOfControls( sidebar_id );
			}, 300 );
			return false;
		};

		getCustomizeControlsSidebar = function( sidebar_id ) {
			return $( '#accordion-section-sidebar-widgets-' + sidebar_id );
		};

		getCustomizeControlsWidget = function( widget_id ) {
			return $( '#customize-control-widget_' + widget_id );
		};

		afterDeleteWidgetFrom = function( sidebar_id ) {
			var $sidebarAccordionSection = getSidebarAccordionSection( sidebar_id );
			addClassesToFirstAndLastWidgetsIn( $sidebarAccordionSection );
			triggerSortUpdateFor( sidebar_id );
		};

		/* End module-scope utility functions */

		/* Begin DOM handlers */

		$.fn.awrInsertInGivenOrderBeforeElement = function( order , element ) {
			var widgets = [];

			for ( var index in order ) {
				widget_id = order[ index ];
				$elementToInsert = $( this ).filter( '[id=customize-control-widget_' + widget_id + ']' );
				widgets.push( $elementToInsert.detach() );
			}

			widgets.map( function( widget , index ) {
				widget.insertBefore( element );
			} );
		};

		/*
		 * Customizer iframe triggers this on sortupdate
		 * (when sorting of widgets has changed)
		 * Reorders widgets in customizer controls to match the new order
		 */
		$( 'body' ).bind( 'awr-reorder-widgets' , function( event , data ) {
			var sidebarHasWidgetFromOtherSidebar , triggerIframeReassignIds ,
			    reorderCustomizeControlsSidebarWidgets ,
			    sidebarIdWithUnderscores = data.sidebar_id ,
			    sidebar_id = sidebarIdWithUnderscores.replace( /_/g , '-' ) ,
			    order = data.sortable_order ,
			    parent_sidebar_of_each_widget = data.parent_sidebars;


			sidebarHasWidgetFromOtherSidebar = function() {
				parent_sidebar_of_each_widget.map( function( parent_sidebar , index ) {
					if ( parent_sidebar !== sidebar_id ) {
						return true;
					}
				} );
			};

			triggerIframeReassignIds =  function() {
				$( 'body' ).trigger( 'awr-reassign-identifiers' , { sidebar_id : sidebar_id } );
			};

			reorderCustomizeControlsSidebarWidgets = function( sidebar_id , order ) {
				var $last_li_in_sidebar,
				    $sidebarAccordionSection = getSidebarAccordionSection( sidebar_id ) ,
				    $widgets_in_sidebar = $sidebarAccordionSection.find( '.customize-control-widget_form' );
				if ( $widgets_in_sidebar.length !== order.length ) {
					return false; // there's been a deletion or addition, no need to reorder widgets
				} else if ( sidebarHasWidgetFromOtherSidebar() ) {
					triggerIframeReassignIds(); // no reorder needed, but assign parent ids to all widgets
					return false;
				} else {
					$last_li_in_sidebar = $sidebarAccordionSection.find( 'li' ).last();
					$widgets_in_sidebar.awrInsertInGivenOrderBeforeElement( order , $last_li_in_sidebar );
					addClassesToFirstAndLastWidgetsIn( $sidebarAccordionSection );
					triggerIframeReassignIds();
					triggerSortUpdateFor( sidebar_id );
				}
			}; /* end of function reorderCustomizeControlsSidebarWidgets */

			reorderCustomizeControlsSidebarWidgets( sidebar_id , order );

		} ); /*	End $( 'body' ).bind( 'awr-reorder-widgets'	*/

		$( 'body' ).bind( 'awr-remove-and-insert-widget' , function( event , data ) {
			console.log( data );
			var getOrdinalOfWidgetFromDifferentSidebar ,
			    getIdOfWidgetFromDifferentSidebar ,
			    getParentSidebarOfWidgetFromDifferentSidebar ,
			    getWidgetFromDifferentSidebar ,
			    sidebarIdWithUnderscores = data.sidebarId ,
			    sidebar_id = sidebarIdWithUnderscores.replace( /_/g , '-' ) ,
			    order = data.sortable_order ,
			    parent_sidebars = data.parent_sidebars ;

			/* Begin private methods */
			getOrdinalOfWidgetFromDifferentSidebar = function() {
				var ordinal_of_widgets = [];
				parent_sidebars.map( function( parent_sidebar , index ) {
					if ( parent_sidebar !== sidebar_id ) {
						ordinal_of_widgets.push( index );
					}
				} );
				if ( ordinal_of_widgets.length > 1 ) {
					console.warn( 'There are ' + ordinal_of_widgets.length + ' new widgets in the sidebar. There should only be one.' );
				}
				return ordinal_of_widgets[ 0 ] ;
			};

			getIdOfWidgetFromDifferentSidebar = function() {
				return order[ ordinalOfWidgetFromDifferentSidebar ];
			};

			getParentSidebarOfWidgetFromDifferentSidebar = function() {
				return parent_sidebars[ ordinalOfWidgetFromDifferentSidebar ];
			};

			getWidgetFromDifferentSidebar = function() {
				return getSidebarAccordionSection( parent_sidebar_of_widget_from_different_sidebar )
					.find( '#customize-control-widget_' + idOfWidgetFromDifferentSidebar ).detach();
			};

			getElementToInsertBefore = function() {
				var $elementToInsertBefore = getSidebarAccordionSection( sidebar_id )
					.find( '.customize-control-widget_form' )
					.eq( ordinalOfWidgetFromDifferentSidebar );
				if ( $elementToInsertBefore.length === 0 ) {
					$elementToInsertBefore = getSidebarAccordionSection( sidebar_id ).find( '.customize-control-sidebar_widgets' );
				}
				return $elementToInsertBefore;
			};

			/* End private methods: awr-remove-and-insert-widget */

			ordinalOfWidgetFromDifferentSidebar = getOrdinalOfWidgetFromDifferentSidebar();
			idOfWidgetFromDifferentSidebar = getIdOfWidgetFromDifferentSidebar();
			parent_sidebar_of_widget_from_different_sidebar = getParentSidebarOfWidgetFromDifferentSidebar();
			$widgetFromDifferentSidebar = getWidgetFromDifferentSidebar();
			$widgetFromDifferentSidebar.insertBefore( getElementToInsertBefore() );
			addClassesToFirstAndLastWidgetsIn( getSidebarAccordionSection( sidebar_id ) );
			openWidgetCustomizerControl( sidebar_id , idOfWidgetFromDifferentSidebar ); // new, need to test
			triggerSortUpdateFor( sidebar_id );
			triggerSortUpdateFor( parent_sidebar_of_widget_from_different_sidebar );

		} ); /* End $( 'body' ).bind( 'awr-remove-and-insert-widget'	*/

		$( 'body' ).bind( 'awr-delete-widget' , function( event , data ) {
			var widget_id = data.widget_id ,
			    sidebar_id = data.sidebarId;
			deleteWidgetFromCustomizerControls( widget_id , sidebar_id );
		} );

		$( 'body' ).bind( 'awr-add-new-widget' , function( event , data ) {
			openNewWidgetPanelForSidebar( data.sidebarId );
		} );

		$( 'body' ).bind( 'awr-open-widget-control' , function( event , data ) {
			var widget_id = data.widget_id ,
			    sidebar_id = data.sidebarId;
			openWidgetCustomizerControl( sidebar_id , widget_id );
		} );

		/* End DOM handlers */

		manageUriVariables();

	} );
} )( jQuery );
