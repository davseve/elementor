import Base from 'elementor/assets/dev/js/frontend/handlers/base';

export default class NestedAccordion extends Base {
	getDefaultSettings() {
		return {
			selectors: {
				accordionContentContainers: '.e-n-accordion > .e-con',
				accordionItems: '.e-n-accordion-item',
				accordionItemTitles: '.e-n-accordion-item-title',
			},
		};
	}

	getDefaultElements() {
		const selectors = this.getSettings( 'selectors' );

		return {
			$contentContainers: this.findElement( selectors.accordionContentContainers ),
			$items: this.findElement( selectors.accordionItems ),
			$titles: this.findElement( selectors.accordionItemTitles ),
		};
	}

	bindEvents() {
		const { max_items_expended: maxItemsExpended } = this.getElementSettings();

		if ( 'one' === maxItemsExpended ) {
			this.elements.$titles.on( 'click', this.maxItemsExpanded );
		}
	}

	unbindEvents() {
		this.elements.$titles.off( 'click', this.maxItemsExpanded() );
	}

	onInit( ...args ) {
		super.onInit( ...args );

		if ( elementorFrontend.isEditMode() ) {
			this.interlaceContainers();
		}
	}

	interlaceContainers() {
		const { $contentContainers, $items } = this.getDefaultElements();

		$contentContainers.each( ( index, element ) => {
			$items[ index ].appendChild( element );
		} );
	}

	maxItemsExpanded() {
		// const { $titles } = this.getDefaultElements();
		this.elements.$titles = $titles;
		// this.deactivateAllItems();
		$titles.each( ( index, title ) => {
			// let item = title.parentNode;
			// if ( item !== this.parentNode ) {
			// 	item.removeAttribute( 'open' );
			// }

			console.log( this )
		} );
		console.log( 'maxItemsExpanded' );
	}

	deactivateAllItems() {
		// const { $items } = this.getDefaultElements();

		$items.each( ( index, item ) => {
			item.removeAttribute( 'open' );
		} );
	}
}
