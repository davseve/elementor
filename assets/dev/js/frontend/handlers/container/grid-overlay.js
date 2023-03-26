const BOXED = 'boxed';

export default class GridOverlay extends elementorModules.frontend.handlers.Base {
	containerWidthType = 'full_width';

	isActive() {
		return elementorFrontend.isEditMode();
	}

	getDefaultSettings() {
		return {
			selectors: {
				editableContainer: '.elementor-element-editable',
				gridOverlay: '.e-grid-overlay',
			},
			classes: {
				overlay: 'e-grid-overlay',
				overlayItem: 'e-grid-overlay-item',
				editableContainer: 'elementor-element-editable',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' ),
			container = this.$element[ 0 ];

		return {
			editableContainer: container,
			gridOverlay: container.querySelector( selectors.gridOverlay ),
		};
	}

	onInit() {
		super.onInit();

		this.addLayoutOverlay();
	}

	bindEvents() {

	}

	addLayoutOverlay() {
		const container = this.getContainer();

		if ( ! container ) {
			return;
		}

		this.createLayoutOverlay( container );
	}

	getContainer() {
		const elementSettings = this.getElementSettings();

		this.removeExistingOverlay();
		if ( elementSettings.grid_overlay && '' !== elementSettings.grid_overlay ) {
			return this.getCorrectContainer( elementSettings, this.elements.editableContainer );
		}
	}

	removeExistingOverlay() {
		// const selectors = this.getSettings( 'selectors' ),
			// gridOverlayInCurrentContainer = this.elements.editableContainer.querySelector( selectors.gridOverlay );

		if ( this.elements.gridOverlay ) {
			this.elements.gridOverlay.remove();
		}
	}

	createLayoutOverlay( container ) {
		this.createOverlayParentContainer( container );
	}

	createOverlayParentContainer( container ) {
		const elementSettings = this.getElementSettings(),
			leftZeroPosition = 0,
			leftPosition = this.getContainerPosition( container ).left,
			leftBoxedPosition = leftPosition - this.getComputedStyle( container, '--padding-left', true ) + 'px',
			gridOverlayLeftPosition = this.containerWidthType === BOXED ? leftPosition : 0,
			ParentContainer = this.containerWidthType === BOXED ? container.querySelectorAll( '.e-con-inner' ) : container;

		const gridOverlayContainer = document.createElement( 'div' );

		gridOverlayContainer.classList.add( 'e-grid-overlay' );
		container.appendChild( gridOverlayContainer );
		this.createOverlayCells( gridOverlayContainer );
	}

	getContainerPosition( container ) {
		return container.getBoundingClientRect();
	}

	createOverlayCells( gridOverlayContainer ) {
		const numberOfCells = this.calculateNumberOfItemsInGrid();

		for ( let i = 0; i < numberOfCells; i++ ) {
			const cell = document.createElement( 'div' );

			cell.classList.add( 'e-grid-overlay-item' );
			gridOverlayContainer.append( cell );
		}
	}

	calculateNumberOfItemsInGrid() {
		const elementSettings = this.getElementSettings(),
			getCurrentDeviceName = 'desktop' === elementorFrontend.getCurrentDeviceMode() ? '' : '_' + elementorFrontend.getCurrentDeviceMode(),
			currentDeviceGridColumns = elementSettings[ 'grid_columns_grid' + getCurrentDeviceName ].size,
			currentDeviceGridRows = elementSettings[ 'grid_rows_grid' + getCurrentDeviceName ].size;

		return currentDeviceGridRows * currentDeviceGridColumns;
	}

	getComputedStyle( container, cssProp, cleanNumber = false ) {
		const cssObj = window.getComputedStyle( container, null ),
			cssPropertyValue = cssObj.getPropertyValue( cssProp );

		if ( cleanNumber ) {
			return parseInt( cssPropertyValue );
		}

		return cssPropertyValue;
	}

	getCorrectContainer( elementSettings ) {
		let correctContainer;

		if ( BOXED === elementSettings.content_width ) {
			this.containerWidthType = elementSettings.content_width;
			correctContainer = this.elements.editableContainer.querySelector( '.e-con-inner' );
		} else {
			correctContainer = this.elements.editableContainer;
		}

		return correctContainer;
	}

	onElementChange( propertyName ) {
		// Maybe it better to separate responsive control from the rest of the controls
		const propsThatTriggerGridLayoutCalculation = [
			'grid_rows_grid',
			'grid_rows_grid',
			'grid_columns_grid',
			'grid_gaps',
			'padding',
			'width',
			'boxed_width',
			'boxed_height',
			'min_height',
			'container_type',
		];

		const allPropsThatTriggerGridLayoutCalculation = this.getResponsiveControlNames( propsThatTriggerGridLayoutCalculation );

		if ( allPropsThatTriggerGridLayoutCalculation.includes( propertyName ) ) {
			this.addLayoutOverlay();
		}
	}

	getResponsiveControlNames( propsThatTriggerGridLayoutCalculation ) {
		propsThatTriggerGridLayoutCalculation.forEach( ( prop ) => {
			this.getActiveBreakpointsList().forEach( ( breakpoint ) => {
				propsThatTriggerGridLayoutCalculation.push( prop + '_' + breakpoint );
			} );
		} );

		return propsThatTriggerGridLayoutCalculation;
	}

	getActiveBreakpointsList() {
		return elementorFrontend.breakpoints.getActiveBreakpointsList();
	}

	// onDeviceModeChange{
	// 	this.addLayoutOverlay();
	// }
}
