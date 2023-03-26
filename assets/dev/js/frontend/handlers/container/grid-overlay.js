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
		if ( ! this.isActive() ) {
			return;
		}
		this.initElements();

		this.addLayoutOverlay();
	}

	initElements() {
		this.elements = this.getDefaultElements();
	}

	bindEvents() {

	};

	addLayoutOverlay() {
		const container = this.getContainer();

		if ( ! container ) {
			return;
		}

		this.createLayoutOverlay( container );
	}

	getContainer() {
		const elementSettings = this.getElementSettings(),
			classes = this.getSettings( 'classes' );

		this.removeExistingOverlay();
		if ( elementSettings.grid_overlay && '' !== elementSettings.grid_overlay && this.elements.editableContainer.classList.contains( classes.editableContainer ) ) {
			return this.getCorrectContainer( elementSettings, this.elements.editableContainer );
		}
	}

	removeExistingOverlay() {
		const selectors = this.getSettings( 'selectors' ),
			gridOverlayInCurrentContainer = this.elements.editableContainer.querySelector( selectors.gridOverlay );

		if ( gridOverlayInCurrentContainer ) {
			gridOverlayInCurrentContainer.remove();
		}
	}

	createLayoutOverlay( container ) {
		this.createOverlayParentContainer( container );
	}

	createOverlayParentContainer( container ) {
		const elementSettings = this.getElementSettings(),
			leftPosition = this.getContainerPosition( container ).left,
			leftBoxedPosition = leftPosition - this.getComputedStyle( container, '--padding-left', true ) + 'px',
			gridOverlayLeftPosition = this.containerWidthType === BOXED ? leftBoxedPosition : leftPosition;
		let gridOverlayContainer = document.createElement( 'div' );

		gridOverlayContainer.classList.add( 'e-grid-overlay' );
		gridOverlayContainer.style.position = 'absolute';
		gridOverlayContainer.style.display = 'grid';
		gridOverlayContainer.style.pointerEvents = 'none';
		gridOverlayContainer.style.height = this.getContainerPosition( container ).height + 'px';
		gridOverlayContainer.style.bottom = '0px';
		// gridOverlayContainer.style.left = leftPosition + 'px';
		gridOverlayContainer.style.left = gridOverlayLeftPosition;
		gridOverlayContainer.style.width = this.getComputedStyle( container, 'width' );
		gridOverlayContainer.style.margin = this.getComputedStyle( container, 'margin' );
		gridOverlayContainer.style.padding = this.getComputedStyle( container, 'padding' );
		gridOverlayContainer.style.paddingRight = this.getComputedStyle( container, '--padding-right' );
		gridOverlayContainer.style.paddingLeft = this.getComputedStyle( container, '--padding-left' );
		gridOverlayContainer.style.gridTemplateColumns = this.getComputedStyle( container, 'grid-template-columns' );
		gridOverlayContainer.style.gridTemplateRows = this.getComputedStyle( container, 'grid-template-rows' );
		gridOverlayContainer.style.gridGap = this.getComputedStyle( container, 'grid-gap' );
		gridOverlayContainer.style.gridAutoFlow = this.getComputedStyle( container, 'grid-auto-flow' );
		gridOverlayContainer.style.gridAutoRows = this.getComputedStyle( container, 'grid-auto-rows' );
		gridOverlayContainer.style.gridAutoColumns = this.getComputedStyle( container, 'grid-auto-columns' );
		gridOverlayContainer.style.justifyItems = this.getComputedStyle( container, 'justify-items' );
		gridOverlayContainer.style.alignItems = this.getComputedStyle( container, 'align-items' );
		gridOverlayContainer.style.alignSelf = this.getComputedStyle( container, 'align-self' );

		this.elements.editableContainer.appendChild( gridOverlayContainer );
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
}
