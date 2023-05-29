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
			this.elements.$titles.on( 'click', this.maxItemsExpanded.bind( this ) );
		}
	}

	unbindEvents() {
		this.elements.$titles.off( 'click', this.maxItemsExpanded() );
	}

	onInit( ...args ) {
		super.onInit( ...args );
		const { max_items_expended: maxItemsExpended } = this.getElementSettings();

		if ( elementorFrontend.isEditMode() ) {
			this.interlaceContainers();
		}

		if ( 'one' === maxItemsExpended ) {
			this.deactivateAllItems();
		}
	}

	interlaceContainers() {
		const { $contentContainers, $items } = this.getDefaultElements();

		$contentContainers.each( ( index, element ) => {
			$items[ index ].appendChild( element );
		} );
	}

	maxItemsExpanded( event ) {
		const { $titles, $items } = this.getDefaultElements(),
			clickedItem = event ? event.target : $titles[ 0 ],
			itemIndex = $items.index( clickedItem );

		this.deactivateAllItems( clickedItem );
	}

	deactivateAllItems( clickedItem ) {
		const { $titles, $items } = this.getDefaultElements();

		$titles.each( ( index, title ) => {
			if ( title !== clickedItem ) {
				$items[ index ].removeAttribute( 'open' );
			}
		} );
	}
}
