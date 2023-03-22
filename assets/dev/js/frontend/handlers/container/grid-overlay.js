export default class GridOverlay extends elementorModules.frontend.handlers.Base {
	isActive() {
		return elementorFrontend.isEditMode();
	}

	getDefaultSettings() {
		return {
			selectors: {
				editableContainer: '.elementor-widget-container',
				overlayContainer: '.e-grid-overlay',
			},
			classes: {
				overlay: 'e-grid-overlay',
				overlayItem: 'e-grid-overlay-item',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$editableContainer: this.findElement( selectors.editableContainer ),
			$overlayContainer: this.findElement( selectors.overlayContainer ),
		};
	}

	onInit() {
		if ( ! this.isActive() ) {
			return;
		}

		this.addLayoutOverlay();
	}

	addLayoutOverlay() {
		const container = this.getContainer();

		if ( ! container ) {
			return;
		}

		this.createLayoutOverlay( container );
	}

	getContainer() {
		const elementSettings = this.getElementSettings(),
			container = this.$element[ 0 ];

		if ( elementSettings.grid_overlay && '' !== elementSettings.grid_overlay && container.classList.contains( 'elementor-element-editable' ) ) {
			return this.getCorrectContainer( elementSettings, container );
		} else if ( document.querySelector( '.e-grid-overlay' ) && '' === elementSettings.grid_overlay ) {
			document.querySelector( '.e-grid-overlay' ).remove();
		}
	}

	createLayoutOverlay( container ) {
		this.createOverlayParentContainer( container );
	}

	createOverlayParentContainer( container ) {
		const position = this.getContainerPosition( container ),
			elementSettings = this.getElementSettings(),
			cells = document.createElement( 'div' ),
			editorBody = document.querySelector( 'body.elementor-editor-active' );

		cells.classList.add( 'e-grid-overlay' );
		cells.style.position = 'absolute';
		cells.style.display = 'grid';
		cells.style.pointerEvents = 'none';
		// cells.style.width = position.width + 'px';
		// cells.style.height = position.height + 'px';
		// cells.style.top = position.top + 'px';
		cells.style.gridTemplateColumns = this.getComputedStyle( container, 'grid-template-columns' );
		cells.style.gridTemplateRows = this.getComputedStyle( container, 'grid-template-rows' );

		editorBody.appendChild( cells );
		this.createOverlayCells( cells );
	}

	getContainerPosition( container ) {
		return container.getBoundingClientRect();
	}

	createOverlayCells( cells ) {
		const numberOfCells = this.calculateNumberOfItemsInGrid();

		for ( let i = 0; i < numberOfCells; i++ ) {
			const cell = document.createElement( 'div' );

			cell.classList.add( 'e-grid-overlay-item' );
			cells.appendChild( cell );
		}
	}

	calculateNumberOfItemsInGrid() {
		const elementSettings = this.getElementSettings();
		// Calculate responsive grids as well
		const numberOfRows = elementSettings.grid_rows_grid.size;
		const numberOfColumns = elementSettings.grid_columns_grid.size;
		return numberOfRows * numberOfColumns;
	}

	getComputedStyle( container, cssProp ) {
		const cssObj = window.getComputedStyle( container, null );
		return cssObj.getPropertyValue( cssProp );
	}

	getCorrectContainer( elementSettings, container ) {
		return 'boxed' === elementSettings.content_width ? this.findElement( '.e-con-inner' ) : container;
	}
}
