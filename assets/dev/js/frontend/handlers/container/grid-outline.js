export default class GridOutline extends elementorModules.frontend.handlers.Base {
	isActive() {
		return elementorFrontend.isEditMode();
	}

	getDefaultSettings() {
		return {
			selectors: {
				gridOverlay: '.e-grid-outline',
				directChildGridOverlay: ':scope > .e-grid-outline',
			},
			classes: {
				overlay: 'e-grid-outline',
				overlayItem: 'e-grid-outline-item',
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
			directChildGridOverlay: container.querySelectorAll( selectors.directChildGridOverlay ),
		};
	}

	onInit() {
		super.onInit();

		this.addLayoutOverlay();
	}

	bindEvents() {
		elementorFrontend.elements.$window.on( 'resize', this.onDeviceModeChange.bind( this ) );

		this.addChildLifeCycleEventListeners();
	}

	unbindEvents() {
		this.removeChildLifeCycleEventListeners();
		elementorFrontend.elements.$window.off( 'resize', this.onDeviceModeChange.bind( this ) );
	}

	addLayoutOverlay() {
		const container = this.getContainer();

		if ( ! container ) {
			return;
		}

		this.removeExistingOverlay( container );
		this.createOverlayParentContainer( container );
	}

	getContainer() {
		const elementSettings = this.getElementSettings();

		if ( elementSettings.grid_outline && '' !== elementSettings.grid_outline ) {
			return this.getCorrectContainer( elementSettings, this.elements.container );
		}
	}

	removeExistingOverlay( container ) {
		const existingOverlay = container.querySelector( ':scope > .e-grid-outline' );
		existingOverlay?.remove();
	}

	createOverlayParentContainer( container ) {
		if ( container.querySelector( ':scope > .e-grid-outline' ) ) {
			return;
		}

		const gridOverlayContainer = document.createElement( 'div' );

		gridOverlayContainer.classList.add( 'e-grid-outline' );
		container.appendChild( gridOverlayContainer );

		this.createOverlayChildCells( gridOverlayContainer, container );
		// this.createOverlayChildCellsByComputedStyle( gridOverlayContainer, container );
	}

	/**
	 * This function will replace `createOverlayChildCells` and all the calculations I am doing at the moment.
	 */
	createOverlayChildCellsByComputedStyle( gridOverlayContainer, container ) {
		const rows = this.getComputedStyle( container, 'grid-template-rows' ),
			columns = this.getComputedStyle( container, 'grid-template-Columns' );
		gridOverlayContainer.style.gridTemplateRows = rows;
		gridOverlayContainer.style.gridTemplateColumns = columns;

		const rowsArray = rows.split( ' ' ).length,
			columnsArray = columns.split( ' ' ).length,
			numberOfCells = rowsArray * columnsArray;

		for ( let i = 0; i < numberOfCells; i++ ) {
			const cell = document.createElement( 'div' );

			cell.classList.add( 'e-grid-outline-item' );

			if ( containerChildren[ i ] ) {
				cell.style.height = this.getComputedStyle( containerChildren[ i ], 'height' );
				cell.style.width = this.getComputedStyle( containerChildren[ i ], 'width' );
			}
			gridOverlayContainer.append( cell );
		}
	}

	createOverlayChildCells( gridOverlayContainer, container ) {
		const containerChildren = container.querySelectorAll( ':scope >.elementor-element' ),
			numberOfChildrenInContainer = containerChildren.length,
			calculatedCellsInGrid = this.calculateNumberOfItemsInGrid(),
			numberOfCells = calculatedCellsInGrid >= numberOfChildrenInContainer
				? calculatedCellsInGrid
				: this.calculateNumberOfItemsInGridByInnerElements( gridOverlayContainer, numberOfChildrenInContainer );

		for ( let i = 0; i < numberOfCells; i++ ) {
			const cell = document.createElement( 'div' );

			cell.classList.add( 'e-grid-outline-item' );

			if ( containerChildren[ i ] ) {
				cell.style.height = this.getComputedStyle( containerChildren[ i ], 'height' );
				cell.style.width = this.getComputedStyle( containerChildren[ i ], 'width' );
			}
			gridOverlayContainer.append( cell );
		}
	}

	calculateNumberOfItemsInGrid() {
		const { currentDeviceGridColumns, currentDeviceGridRows } = this.getGridDimensions();

		return currentDeviceGridColumns * currentDeviceGridRows;
	}

	calculateNumberOfItemsInGridByInnerElements( gridOverlayContainer, numberOfCells ) {
		const { currentDeviceGridColumns } = this.getGridDimensions(),
			numberOfRows = numberOfCells / currentDeviceGridColumns;

		while ( numberOfCells % currentDeviceGridColumns !== 0 ) {
			numberOfCells++;
		}

		// Set a new number of rows in the outline grid.
		gridOverlayContainer.style.gridTemplateRows = `repeat( ${ numberOfRows } , 1fr)`;

		return numberOfCells;
	}

	getCorrectContainer() {
		const { container } = this.elements;

		return container.querySelector( ':scope > .e-con-inner' ) || container;
	}

	onElementChange( propertyName ) {
		let propsThatTriggerGridLayoutRender = [
			'grid_rows_grid',
			'grid_columns_grid',
			'container_type',
			'boxed_width',
			'content_width',
			'height',
			'container_type',
		];

		// Add responsive props.
		propsThatTriggerGridLayoutRender = this.getResponsiveControlNames( propsThatTriggerGridLayoutRender );

		if ( propsThatTriggerGridLayoutRender.includes( propertyName ) ) {
			this.addLayoutOverlay();
		}
	}

	/**
	 * Function renderDataBindings().
	 *
	 * Create an array that contains a list of the responsive controls that should re render the handler.
	 *
	 * @param propsThatTriggerGridLayoutRender {array} - array of props.
	 * @return {boolean} - array.
	 */
	getResponsiveControlNames( propsThatTriggerGridLayoutRender ) {
		propsThatTriggerGridLayoutRender.forEach( ( prop ) => {
			this.getActiveBreakpointsList().forEach( ( breakpoint ) => {
				propsThatTriggerGridLayoutRender.push( prop + '_' + breakpoint );
			} );
		} );

		return propsThatTriggerGridLayoutRender;
	}

	getGridDimensions() {
		const currentDevice = elementor.channels.deviceMode.request( 'currentMode' );

		return {
			currentDeviceGridRows: this.getControlValue( 'grid_rows_grid', currentDevice ) || 1,
			currentDeviceGridColumns: this.getControlValue( 'grid_columns_grid', currentDevice ) || 1,
		};
	}

	getActiveBreakpointsList() {
		return elementorFrontend.breakpoints.getActiveBreakpointsList();
	}

	getControlValue( control, currentDevice ) {
		const elementSettings = this.getElementSettings(),
			controlData = elementSettings[ control ],
			controlValueForCurrentDevice = elementorFrontend.utils.controls.getResponsiveControlValue( elementSettings, control, 'size', currentDevice )

		if ( 'custom' === controlData.unit && 'string' === typeof controlValueForCurrentDevice ) {
			return +controlValueForCurrentDevice.split( ' ' ).length;
		}

		return controlValueForCurrentDevice;
	}

	onDeviceModeChange() {
		this.addLayoutOverlay();
	}

	/**
	 * Rerender Grid Overlay when child element is added or removed from its parent.
	 *
	 * @return {void}
	 */
	addChildLifeCycleEventListeners() {
		this.lifecycleChangeListener = this.addLayoutOverlay.bind( this );

		window.addEventListener( 'elementor/editor/element-rendered', this.lifecycleChangeListener );
		window.addEventListener( 'elementor/editor/element-destroyed', this.lifecycleChangeListener );
	}

	removeChildLifeCycleEventListeners() {
		window.removeEventListener( 'elementor/editor/element-rendered', this.lifecycleChangeListener );
		window.removeEventListener( 'elementor/editor/element-destroyed', this.lifecycleChangeListener );
	}

	getComputedStyle( container, property ) {
		return window.getComputedStyle( container, null ).getPropertyValue( property );
	}
}
