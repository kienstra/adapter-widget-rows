( function( $ ) {
	$( function() {

		var utils = {};
		
		/* Begin utility functions */

		utils.getSidebarAccordionSection = function( sidebarId ) {
			return $( '#accordion-section-sidebar-widgets-' + sidebarId + ' .accordion-section-content' );
		};

		utils.addClassesToFirstAndLastWidgetsIn = function( $sidebarAccordionSection ) {
			var widgets = $sidebarAccordionSection.find( '.customize-control-widget_form' );
			widgets.map( function() {
				$( this ).removeClass( 'first-widget' ).removeClass( 'last-widget' );
			} );
			widgets.first().addClass( 'first-widget' );
			widgets.last().addClass( 'last-widget' );
		};

		utils.triggerSortUpdateFor = function( sidebarId ) {
			var sortable_element = $( '#accordion-section-sidebar-widgets-' + sidebarId + ' .ui-sortable' ).data( 'ui-sortable' );
			sortable_element._trigger( "update" , null , sortable_element._uiHash( sortable_element ) );
		};

		utils.manageUriVariables = function() {
			var awr_edit = utils.findQueryVarValue( 'awr_edit' ) ,
			    awr_delete = utils.findQueryVarValue( 'awr_delete' ) ,
			    awr_new = utils.findQueryVarValue( 'awr_new' ) ,
			    awr_widget = utils.findQueryVarValue( 'awr_widget' ) ,
			    wle_target = utils.findQueryVarValue( 'wle_target' );

			if ( awr_edit && awr_widget ) {
				utils.openWidgetCustomizerControl( awr_edit , awr_widget );
			}
			else if ( wle_target ) {
				utils.openWleAccordionSection( wle_target );
			}
			else if ( awr_new ) {
				utils.openNewWidgetPanelForSidebar( awr_new );
			}
			else if ( awr_delete && awr_widget ) {
				utils.deleteWidgetFromCustomizerControls( awr_widget , awr_delete );
			}
		};

		utils.findQueryVarValue = function( query_var_key ) {
			 var href = encodeURI( document.location.href ) ,
			     query_value = href.match( query_var_key + '=([^&^#]*)' );
			 if ( query_value && query_value.length > 0 ) {
				 return query_value[ 1 ];
			 }
		 };

		utils.openWidgetCustomizerControl = function( sidebarId , widget_id ) {
			var scrollInterval , interval;
			if ( widget_id.match( /wle-[\d]{1,3}/ ) ) {
				utils.openWleAccordionSection( widget_id );
				return;
			}
			utils.openThisPanel( 'widgets' );
			utils.openSidebarAccordionSection( sidebarId );
			utils.openWidgetAccordionSection( widget_id );

			scrollInterval = function() {
				utils.scrollSidebarToTopOfControls( sidebarId );
				clearInterval( interval ) ;
			};
			interval = setInterval( scrollInterval , 200 );
		};

		utils.openWleAccordionSection = function( widget_id ) {
			utils.openThisPanel( 'wle_panel' );
			utils.openAccordionSection( widget_id );
		};

		utils.exitPanelIfNotIn = function( panel_title ) {
			if ( ( $( '.in-sub-panel' ).length > 0 ) && $( '.current-panel' ).attr( 'id' ) !== 'accordion-panel-' + panel_title ) {
				$( '.control-panel-back' ).click();
			}
		};

		utils.openAccordionSection = function( title ) {
			var $accordion_section = $( '#accordion-section-' + title );
			if ( ! $accordion_section.hasClass( 'open' ) ) {
				$accordion_section.find( '.accordion-section-title' ).click();
			}
			utils.scrollSectionToTopOfControls( title );
			return false;
		};

		utils.scrollSectionToTopOfControls = function( title ) {
			var $element = $( '#accordion-section-' + title );
			utils.scrollElementToTopOfControls( $element );
		};

		utils.scrollElementToTopOfControls = function( $element ) {
			if ( $element.length < 1 ) {
				return;
			}
			var $accordionContainer = $( '.accordion-container' ) ,
			    currentScrollTop = $accordionContainer.scrollTop() ,
			    elementOffset = $element.offset().top ,
			    newScrollTop = elementOffset + currentScrollTop;
			$accordionContainer.scrollTop( newScrollTop );
		};

		utils.openThisPanel = function( panelName ) {
			var $panel;
			utils.exitPanelIfNotIn( panelName );
			$panel = $( '#accordion-panel-' + panelName );
			if ( ! $panel.hasClass( 'current-panel' ) ) {
				$panel.find( '.accordion-section-title' ).click();
			}
		};

		utils.openSidebarAccordionSection = function( sidebarId ) {
			var $sidebarAccordionSection = utils.getCustomizeControlsSidebar( sidebarId );
			if ( ! $sidebarAccordionSection.hasClass( 'open' ) ) {
				$sidebarAccordionSection.find( '.accordion-section-title' ).click();
			}
		};

		utils.openWidgetAccordionSection = function( widget_id ) {
			var $widget_accordion_section = utils.getCustomizeControlsWidget( widget_id );
			if ( ! $widget_accordion_section.hasClass( 'expanded' ) ) {
				$widget_accordion_section.siblings().removeClass( 'expanded' );
				$widget_accordion_section.find( 'h4' ).click();
			}
		};

		utils.scrollSidebarToTopOfControls = function( sidebarId ) {
			var currentScrollTopValue = $( '.accordion-container' ).scrollTop() ,
			    newScrollTopValue = currentScrollTopValue + $( '#accordion-section-sidebar-widgets-' + sidebarId ).position().top;
			$( '.accordion-container' ).scrollTop( newScrollTopValue );
		};

		utils.deleteWidgetFromCustomizerControls = function( widget_id , sidebarId ) {
			utils.getCustomizeControlsWidget( widget_id ).find( '.widget-control-remove' ).click();
			utils.ifIsWleWidgetDeletePanel( widget_id );
			utils.afterDeleteWidgetFrom( sidebarId );
		};

		utils.ifIsWleWidgetDeletePanel = function( widget_id ) {
			if ( widget_id && widget_id.match( /wle-[\d]{1,3}/ ) ) {
				$( '#accordion-section-' + widget_id ).hide( 500 );
			}
		};

		utils.openNewWidgetPanelForSidebar = function( sidebarId ) {
			var $customize_controls_sidebar;
			utils.openThisPanel( 'widgets' );
			$customize_controls_sidebar = utils.getCustomizeControlsSidebar( sidebarId );
			setTimeout( function() {
				$customize_controls_sidebar.find( '.accordion-section-title' ).click();
				$customize_controls_sidebar.find( '.add-new-widget' ).click();
				utils.scrollSidebarToTopOfControls( sidebarId );
			}, 300 );
			return false;
		};

		utils.getCustomizeControlsSidebar = function( sidebarId ) {
			return $( '#accordion-section-sidebar-widgets-' + sidebarId );
		};

		utils.getCustomizeControlsWidget = function( widget_id ) {
			return $( '#customize-control-widget_' + widget_id );
		};

		utils.afterDeleteWidgetFrom = function( sidebarId ) {
			var $sidebarAccordionSection = utils.getSidebarAccordionSection( sidebarId );
			utils.addClassesToFirstAndLastWidgetsIn( $sidebarAccordionSection );
			utils.triggerSortUpdateFor( sidebarId );
		};

		/* End module-scope utility functions */

		/* Begin jQuery plugin */

		$.fn.awrInsertInGivenOrderBeforeElement = function( order , element ) {
			var index , widgetId , $elementToInsert ,
			    widgets = [];

			for ( index in order ) {
				widgetId = order[ index ];
				$elementToInsert = this.filter( '[id=customize-control-widget_' + widgetId + ']' );
				widgets.push( $elementToInsert.detach() );
			}

			widgets.map( function( widget , index ) {
				widget.insertBefore( element );
			} );

			return this;
		};

		/* End jQuery plugin */

		/* Begin DOM handlers */

		/*
		 * Customizer iframe triggers this on sortupdate
		 * (when sorting of widgets has changed)
		 * Reorders widgets in customizer controls to match the new order
		 */
		$( 'body' ).bind( 'awr-reorder-widgets' , function( event , data ) {
			var sidebarHasWidgetFromOtherSidebar , triggerIframeReassignIds ,
			    reorderCustomizeControlsSidebarWidgets ,
			    sidebarIdWithUnderscores = data.sidebarId ,
			    sidebarId = sidebarIdWithUnderscores.replace( /_/g , '-' ) ,
			    order = data.sortable_order ,
			    parent_sidebar_of_each_widget = data.parent_sidebars;


			sidebarHasWidgetFromOtherSidebar = function() {
				parent_sidebar_of_each_widget.map( function( parent_sidebar , index ) {
					if ( parent_sidebar !== sidebarId ) {
						return true;
					}
				} );
			};

			triggerIframeReassignIds =  function() {
				$( 'body' ).trigger( 'awr-reassign-identifiers' , { sidebarId : sidebarId } );
			};

			reorderCustomizeControlsSidebarWidgets = function( sidebarId , order ) {
				var $last_li_in_sidebar,
				    $sidebarAccordionSection = utils.getSidebarAccordionSection( sidebarId ) ,
				    $widgets_in_sidebar = $sidebarAccordionSection.find( '.customize-control-widget_form' );
				if ( $widgets_in_sidebar.length !== order.length ) {
					return false; // there's been a deletion or addition, no need to reorder widgets
				} else if ( sidebarHasWidgetFromOtherSidebar() ) {
					triggerIframeReassignIds(); // no reorder needed, but assign parent ids to all widgets
					return false;
				} else {
					$last_li_in_sidebar = $sidebarAccordionSection.find( 'li' ).last();
					$widgets_in_sidebar.awrInsertInGivenOrderBeforeElement( order , $last_li_in_sidebar );
					utils.addClassesToFirstAndLastWidgetsIn( $sidebarAccordionSection );
					triggerIframeReassignIds();
					utils.triggerSortUpdateFor( sidebarId );
				}
			}; /* end of function reorderCustomizeControlsSidebarWidgets */

			reorderCustomizeControlsSidebarWidgets( sidebarId , order );

		} ); /*	End $( 'body' ).bind( 'awr-reorder-widgets'	*/

		$( 'body' ).bind( 'awr-remove-and-insert-widget' , function( event , data ) {
			var getOrdinalOfWidgetFromDifferentSidebar ,
			    getIdOfWidgetFromDifferentSidebar ,
			    getParentSidebarOfWidgetFromDifferentSidebar ,
			    getWidgetFromDifferentSidebar ,
			    sidebarIdWithUnderscores = data.sidebarId ,
			    sidebarId = sidebarIdWithUnderscores.replace( /_/g , '-' ) ,
			    order = data.sortable_order ,
			    parent_sidebars = data.parent_sidebars ;

			/* Begin private methods */
			getOrdinalOfWidgetFromDifferentSidebar = function() {
				var ordinal_of_widgets = [];
				parent_sidebars.map( function( parent_sidebar , index ) {
					if ( parent_sidebar !== sidebarId ) {
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
				return utils.getSidebarAccordionSection( parent_sidebar_of_widget_from_different_sidebar )
					.find( '#customize-control-widget_' + idOfWidgetFromDifferentSidebar ).detach();
			};

			getElementToInsertBefore = function() {
				var $elementToInsertBefore = utils.getSidebarAccordionSection( sidebarId )
					.find( '.customize-control-widget_form' )
					.eq( ordinalOfWidgetFromDifferentSidebar );
				if ( $elementToInsertBefore.length === 0 ) {
					$elementToInsertBefore = utils.getSidebarAccordionSection( sidebarId ).find( '.customize-control-sidebar_widgets' );
				}
				return $elementToInsertBefore;
			};

			/* End private methods: awr-remove-and-insert-widget */

			ordinalOfWidgetFromDifferentSidebar = getOrdinalOfWidgetFromDifferentSidebar();
			idOfWidgetFromDifferentSidebar = getIdOfWidgetFromDifferentSidebar();
			parent_sidebar_of_widget_from_different_sidebar = getParentSidebarOfWidgetFromDifferentSidebar();
			$widgetFromDifferentSidebar = getWidgetFromDifferentSidebar();
			
			$widgetFromDifferentSidebar.insertBefore( getElementToInsertBefore() );
			utils.addClassesToFirstAndLastWidgetsIn( utils.getSidebarAccordionSection( sidebarId ) );
			utils.openWidgetCustomizerControl( sidebarId , idOfWidgetFromDifferentSidebar ); // new, need to test
			utils.triggerSortUpdateFor( sidebarId );
			utils.triggerSortUpdateFor( parent_sidebar_of_widget_from_different_sidebar );

		} ); /* End $( 'body' ).bind( 'awr-remove-and-insert-widget'	*/

		$( 'body' ).bind( 'awr-delete-widget' , function( event , data ) {
			var widget_id = data.widget_id ,
			    sidebarId = data.sidebarId;
			utils.deleteWidgetFromCustomizerControls( widget_id , sidebarId );
		} );

		$( 'body' ).bind( 'awr-add-new-widget' , function( event , data ) {
			utils.openNewWidgetPanelForSidebar( data.sidebarId );
		} );

		$( 'body' ).bind( 'awr-open-widget-control' , function( event , data ) {
			var widget_id = data.widget_id ,
			    sidebarId = data.sidebarId;
			utils.openWidgetCustomizerControl( sidebarId , widget_id );
		} );

		/* End DOM handlers */

		utils.manageUriVariables();

	} );
} )( jQuery );
