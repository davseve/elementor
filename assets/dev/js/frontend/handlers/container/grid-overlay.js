export default class GridOverlay extends elementorModules.frontend.handlers.Base {
	currentContainerPosition = {};

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
		if ( elementSettings.grid_overlay && '' !== elementSettings.grid_overlay && this.elements.editableContainer ) {
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
			leftPosition = container.getBoundingClientRect().left - this.getComputedStyle( container, '--padding-left', true );
		let gridOverlayContainer = document.createElement( 'div' );

		gridOverlayContainer.classList.add( 'e-grid-overlay' );
		gridOverlayContainer.style.position = 'absolute';
		gridOverlayContainer.style.display = 'grid';
		gridOverlayContainer.style.pointerEvents = 'none';
		gridOverlayContainer.style.height = 'auto';
		gridOverlayContainer.style.bottom = '0px';
		gridOverlayContainer.style.left = leftPosition + 'px';
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
		const elementSettings = this.getElementSettings();
		// Calculate responsive grids as well
		const numberOfRows = elementSettings.grid_rows_grid.size;
		const numberOfColumns = elementSettings.grid_columns_grid.size;
		return numberOfRows * numberOfColumns;
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
		return 'boxed' === elementSettings.content_width ? this.elements.editableContainer.querySelector( '.e-con-inner' ) : this.elements.editableContainer;

		// let correctContainer;
		//
		// if ( 'boxed' === elementSettings.content_width ) {
		// 	correctContainer = this.elements.editableContainer.querySelector( '.e-con-inner' );
		// 	this.getParentpadding( correctContainer );
		// } else {
		// 	correctContainer = this.elements.editableContainer;
		// }

		return correctContainer;
	}

	onElementChange( propertyName ) {
		const listeningControls = [
			'grid_rows_grid',
			'grid_columns_grid',
			'grid_gaps',
			'padding',
			'width',
			'min_height',
		];
		if ( listeningControls.includes( propertyName ) ) {
			this.addLayoutOverlay();
		}
	}

	getCurrentContainerPosition( container ) {

	}
}
