const BOXED = 'boxed';

export default class GridOverlay extends elementorModules.frontend.handlers.Base {
	isActive() {
		return elementorFrontend.isEditMode();
	}

	getDefaultSettings() {
		return {
			selectors: {
				container: '.elementor-element-editable',
				gridOverlay: '.e-grid-overlay',
				directChildGridOverlay: ':scope > .e-grid-overlay',
			},
			classes: {
				overlay: 'e-grid-overlay',
				overlayItem: 'e-grid-overlay-item',
				container: 'elementor-element-editable',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' ),
			container = this.$element[ 0 ];

		return {
			container,
			gridOverlay: container.querySelector( selectors.gridOverlay ),
			directChildGridOverlay: container.querySelector( selectors.directChildGridOverlay ),
		};
	}

	onInit() {
		super.onInit();

		this.addLayoutOverlay();
	}

	bindEvents() {
		elementor.listenTo( elementor.channels.deviceMode, 'change', () => this.onDeviceModeChange() );
	}

	addLayoutOverlay() {
		const container = this.getContainer();

		if ( ! container ) {
			return;
		}

		this.removeExistingOverlay();
		this.createOverlayParentContainer();
	}

	getContainer() {
		const elementSettings = this.getElementSettings();

		if ( elementSettings.grid_overlay && '' !== elementSettings.grid_overlay ) {
			return this.getCorrectContainer( elementSettings, this.elements.container );
		}
	}

	removeExistingOverlay() {
		if ( this.elements.container.querySelector( ':scope > .e-grid-overlay' ) ) {
			this.elements.container.querySelector( ':scope > .e-grid-overlay' ).remove();
		}
	}

	createOverlayParentContainer() {
		const gridOverlayContainer = document.createElement( 'div' );

		gridOverlayContainer.classList.add( 'e-grid-overlay' );
		this.elements.container.appendChild( gridOverlayContainer );

		this.createOverlayChildCells( gridOverlayContainer );
	}

	createOverlayChildCells( gridOverlayContainer ) {
		const numberOfElementsInCurrentContainer = this.elements.container.querySelectorAll( ':scope >.elementor-element' ).length,
			calculatedCellsInGrid = this.calculateNumberOfItemsInGrid(),
			numberOfCells = calculatedCellsInGrid > numberOfElementsInCurrentContainer
				? calculatedCellsInGrid
				: this.calculateNumberOfItemsInGridByInnerElements( gridOverlayContainer, numberOfElementsInCurrentContainer );

		for ( let i = 0; i < numberOfCells; i++ ) {
			const cell = document.createElement( 'div' );

			cell.classList.add( 'e-grid-overlay-item' );
			gridOverlayContainer.append( cell );
		}
	}

	calculateNumberOfItemsInGrid() {
		const gridDimensions = this.getGridDimensions();

		return gridDimensions.currentDeviceGridColumns * gridDimensions.currentDeviceGridRows;
	}

	calculateNumberOfItemsInGridByInnerElements( gridOverlayContainer, numberOfElements ) {
		const gridDimensions = this.getGridDimensions();
		let numberOfCells = numberOfElements;

		while ( numberOfCells % gridDimensions.currentDeviceGridColumns !== 0 ) {
			numberOfCells++;
		}

		const numberOfRows = numberOfCells / gridDimensions.currentDeviceGridColumns;
		gridOverlayContainer.style.gridTemplateRows = `repeat( ${ numberOfRows } , 1fr)`;

		return numberOfCells;
	}

	getCorrectContainer( elementSettings ) {
		let correctContainer;

		if ( BOXED === elementSettings.content_width ) {
			correctContainer = this.elements.container.querySelector( ':scope > .e-con-inner' );
		} else {
			correctContainer = this.elements.container;
		}

		return correctContainer;
	}

	onElementChange( propertyName ) {
		// Maybe it better to separate responsive control from the rest of the controls
		const propsThatTriggerGridLayoutCalculation = [
			'grid_rows_grid',
			'grid_columns_grid',
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

	getGridDimensions() {
		const elementSettings = this.getElementSettings(),
			getCurrentDeviceName = 'desktop' === elementorFrontend.getCurrentDeviceMode() ? '' : '_' + elementorFrontend.getCurrentDeviceMode();

		return {
			currentDeviceGridColumns: elementSettings[ 'grid_columns_grid' + getCurrentDeviceName ].size,
			currentDeviceGridRows: elementSettings[ 'grid_rows_grid' + getCurrentDeviceName ].size,
		};
	}

	getActiveBreakpointsList() {
		return elementorFrontend.breakpoints.getActiveBreakpointsList();
	}

	onDeviceModeChange() {
		this.addLayoutOverlay();
	}
}
