export default class GridOverlay extends elementorModules.frontend.handlers.Base {
	isActive() {
		return elementorFrontend.isEditMode();
	}

	getDefaultElements() {
		const elements = {},
			selectors = this.getSettings( 'selectors' );

		elements.$currentContainer = this.$element.find( selectors.container );

		return elements;
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
		const elementSettings = this.getElementSettings();

		if ( elementSettings.grid_overlay && '' !== elementSettings.grid_overlay ) {
			return this.$element[ 0 ];
		}
	}

	createLayoutOverlay( container ) {
		this.createOverlayParentContainer( container );
		this.calculateNumberOfItemsInGrid( container );
	}

	calculateNumberOfItemsInGrid() {
		const elementSettings = this.getElementSettings();
		// Calculate responsive grids as well
		const numberOfRows = elementSettings.grid_rows_grid.size;
		const numberOfColumns = elementSettings.grid_columns_grid.size;
		return numberOfRows * numberOfColumns;
	}

	createOverlayParentContainer( container ) {
		const position = this.getContainerPosition( container ),
			cells = document.createElement( 'div' ),
			editorBody = document.querySelector( 'body.elementor-editor-active' );

		cells.classList.add( 'elementor-grid-overlay__cells' );
		cells.style.position = 'absolute';
		cells.style.pointerEvents = 'none';
		cells.style.width = position.width + 'px';
		cells.style.height = position.height + 'px';
		cells.style.top = position.top + 'px';

		editorBody.appendChild( cells );
	}

	getContainerPosition( container ) {
		return container.getBoundingClientRect();
	}
}
