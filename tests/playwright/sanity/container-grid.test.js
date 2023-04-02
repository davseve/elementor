const { test, expect } = require( '@playwright/test' );
const WpAdminPage = require( '../pages/wp-admin-page' );

test.describe( 'Container tests', () => {
	test.beforeAll( async ( { browser }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo );
		await wpAdmin.setExperiments( {
			container: true,
			container_grid: true,
		} );
	} );

	test.afterAll( async ( { browser }, testInfo ) => {
		const context = await browser.newContext();
		const page = await context.newPage();
		const wpAdmin = new WpAdminPage( page, testInfo );
		await wpAdmin.setExperiments( {
			container: false,
			container_grid: false,
		} );
	} );

	test( 'Test grid container', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo );
		const editor = await wpAdmin.useElementorCleanPost();

		// Arrange.
		await test.step( 'Arrange', async () => {
			await editor.addElement( { elType: 'container' }, 'document' );
			await editor.closeNavigatorIfOpen();
			await editor.setSelectControlValue( 'container_type', 'grid' );
		} );

		const frame = editor.getPreviewFrame();
		const container = await frame.locator( '.e-grid .e-con-inner' );

		await test.step( 'Assert gaps', async () => {
			await page.locator( '.elementor-control-gaps .elementor-link-gaps' ).first().click();
			await page.locator( '.elementor-control-gaps .elementor-control-gap:nth-child(1) input' ).first().fill( '10' );
			await page.locator( '.elementor-control-gaps .elementor-control-gap:nth-child(2) input' ).first().fill( '20' );
			await expect( container ).toHaveCSS( 'gap', '20px 10px' );
		} );

		await test.step( 'Assert justify and align start', async () => {
			await page.locator( '.elementor-control-grid_justify_content [data-tooltip="Start"]' ).click();
			await page.locator( '.elementor-control-grid_align_content [data-tooltip="Start"]' ).click();
			await expect( container ).toHaveCSS( 'justify-content', 'start' );
			await expect( container ).toHaveCSS( 'align-content', 'start' );
		} );

		await test.step( 'Assert justify align and content middle', async () => {
			await page.locator( '.elementor-control-grid_justify_content [data-tooltip="Middle"]' ).click();
			await page.locator( '.elementor-control-grid_align_content [data-tooltip="Middle"]' ).click();
			await expect( container ).toHaveCSS( 'justify-content', 'center' );
			await expect( container ).toHaveCSS( 'align-content', 'center' );
		} );

		await test.step( 'Assert justify align and content end', async () => {
			await page.locator( '.elementor-control-grid_justify_content [data-tooltip="End"]' ).click();
			await page.locator( '.elementor-control-grid_align_content [data-tooltip="End"]' ).click();
			await expect( container ).toHaveCSS( 'justify-content', 'end' );
			await expect( container ).toHaveCSS( 'align-content', 'end' );
		} );

		await test.step( 'Assert grid auto flow', async () => {
			await editor.setSelectControlValue( 'grid_auto_flow', 'row' );
			await expect( container ).toHaveCSS( 'grid-auto-flow', 'row' );
			await editor.setSelectControlValue( 'grid_auto_flow', 'column' );
			await expect( container ).toHaveCSS( 'grid-auto-flow', 'column' );
		} );

		await test.step( 'Assert that the drag area is visible when using boxed width', async () => {
			await page.selectOption( '.elementor-control-content_width >> select', 'boxed' );
			const dragAreaIsVisible = await editor.getPreviewFrame().locator( '.elementor-empty-view' ).evaluate( ( element ) => {
				return 200 < element.offsetWidth;
			} );
			await expect( dragAreaIsVisible ).toBeTruthy();
		} );

		await test.step( 'Assert boxed width content alignment', async () => {
			await page.selectOption( '.elementor-control-content_width >> select', 'boxed' );
			await page.locator( '.elementor-control-grid_columns_grid .elementor-slider-input input' ).fill( '' );

			// Add flex container.
			const flexContainerId = await editor.addElement( { elType: 'container' }, 'document' );

			// Assert.
			const gridDragAreaOffsetLeft = await editor.getPreviewFrame().locator( '.e-grid .elementor-empty-view' ).evaluate( ( gridContent ) => gridContent.offsetLeft ),
				flexDragAreaOffsetLeft = await editor.getPreviewFrame().locator( '.e-flex .elementor-empty-view' ).evaluate( ( flexContent ) => flexContent.offsetLeft );

			await expect( gridDragAreaOffsetLeft ).toEqual( flexDragAreaOffsetLeft );

			// Add heading.
			await editor.addWidget( 'heading', flexContainerId );
			await editor.getPreviewFrame().waitForSelector( '.elementor-widget-heading' );

			// Assert.
			const headingOffsetLeft = await editor.getPreviewFrame().locator( '.elementor-widget-heading' ).evaluate( ( heading ) => heading.offsetLeft );
			await expect( gridDragAreaOffsetLeft ).toEqual( headingOffsetLeft );

			// Remove flex container.
			await editor.removeElement( flexContainerId );
		} );

		await test.step( 'Assert mobile is in one column', async () => {
			// Open responsive bar and select mobile view
			await page.locator( '#elementor-panel-footer-responsive i' ).click();
			await page.waitForSelector( '#e-responsive-bar' );
			await page.locator( '#e-responsive-bar-switcher__option-mobile' ).click();

			const gridTemplateColumnsCssValue = await container.evaluate( ( element ) => {
				return window.getComputedStyle( element ).getPropertyValue( 'grid-template-columns' );
			} );

			const isOneColumn = ! hasWhiteSpace( gridTemplateColumnsCssValue );

			expect( isOneColumn ).toBeTruthy();
		} );
	} );

	test( 'Test grid outline', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo );
		const editor = await wpAdmin.useElementorCleanPost(),
			parentContainer = await editor.addElement( { elType: 'container' }, 'document' );

		// Arrange.
		await test.step( 'Arrange', async () => {
			await editor.closeNavigatorIfOpen();
			await editor.setSelectControlValue( 'container_type', 'grid' );
		} );

		const frame = editor.getPreviewFrame(),
			gridOutline = await frame.locator( '.e-grid-outline' ),
			gridOutlineChildren = await frame.locator( '.e-grid-outline-item' );

		let gridOutlineChildrenInitialValue = 6;

		await test.step( 'Assert default outline', async () => {
			await expect( gridOutline ).toBeVisible();
			await expect( gridOutlineChildren ).toHaveCount( gridOutlineChildrenInitialValue );
		} );

		await test.step( 'Assert outline shut down', async () => {
			await editor.setSwitcherControlValue( 'grid_outline', false );
			await expect( gridOutline ).not.toBeVisible();
		} );

		await test.step( 'Assert outline turn on', async () => {
			await editor.setSwitcherControlValue( 'grid_outline', true );
			await expect( gridOutline ).toBeVisible();
		} );

		await test.step( 'Assert number of child elements when there are less Items than grid cells', async () => {
			// Arrange.
			gridOutlineChildrenInitialValue = 12;

			// Act.
			await editor.setSliderControlValue( 'grid_columns_grid', '4' );
			await editor.setSliderControlValue( 'grid_rows_grid', '3' );

			// Assert.
			await expect( gridOutlineChildren ).toHaveCount( gridOutlineChildrenInitialValue );
		} );

		await test.step( 'Assert outline match responsive grid', async () => {
			gridOutlineChildrenInitialValue = 4;

			// Open responsive bar and select mobile view
			const firstGridOutlineChildren = gridOutline.first().locator( '.e-grid-outline-item' );
			await editor.changeResponsiveView( 'tablet' );
			await editor.setSliderControlValue( 'grid_columns_grid_tablet', '2' );
			await editor.setSliderControlValue( 'grid_rows_grid_tablet', '2' );

			await expect( gridOutline.first() ).toBeVisible();

			await editor.setSelectControlValue( 'content_width', 'full' );

			await expect( firstGridOutlineChildren ).toHaveCount( gridOutlineChildrenInitialValue );

			await editor.removeElement( parentContainer );
			await editor.changeResponsiveView( 'desktop' );
		} );

		await test.step( 'Assert number of child elements when there are more Items than grid cells', async () => {
			// Arrange
			const newParentContainer = await editor.addElement( { elType: 'container' }, 'document' ),
				numberOfWidgets = 5,
				expectedNumberOfChildren = 6;

			await editor.setSelectControlValue( 'container_type', 'grid' );

			await editor.setSliderControlValue( 'grid_columns_grid', '2' );
			await editor.setSliderControlValue( 'grid_rows_grid', '2' );

			// Act.
			for ( let i = 0; i < numberOfWidgets; i++ ) {
				await editor.addWidget( 'button', newParentContainer );
			}

			// Assert.
			await expect( gridOutlineChildren ).toHaveCount( expectedNumberOfChildren );

		} );
	} );

	test( 'Test grid outline multiple controls', async ( { page }, testInfo ) => {
		const wpAdmin = new WpAdminPage( page, testInfo );
		const editor = await wpAdmin.useElementorCleanPost(),
			parentContainer = await editor.addElement( { elType: 'container' }, 'document' ),
			frame = editor.getPreviewFrame(),
			gridOutline = await frame.locator( '.e-grid-outline' ),
			gridOutlineChildren = await frame.locator( '.e-grid-outline-item' );

		// Arrange.
		await test.step( 'Arrange', async () => {
			await editor.closeNavigatorIfOpen();
			await editor.setSelectControlValue( 'container_type', 'grid' );
		} );

		await test.step( 'Check that Gaps control effects the grid outline ', async () => {
			const desiredGapValue = '30px 30px';
			await page.locator( '.elementor-control-grid_gaps .elementor-control-gap >> nth=0' ).locator( 'input' ).fill( '30' );

			await expect( gridOutline ).toHaveCSS( 'grid-gap', desiredGapValue );
		} );

		await test.step( 'Check that Custom control is set to grid outline', async () => {
			const desiresCustomValue = '50px 150px 100px 100px',
				gridColumnsControl = page.locator( '.elementor-control-grid_columns_grid' );

			await gridColumnsControl.locator( '.e-units-switcher' ).click();
			await gridColumnsControl.locator( '[data-choose="custom"]' ).click();
			await gridColumnsControl.locator( '.elementor-slider-input input' ).fill( '50px 150px repeat(2, 100px)' );

			await expect( gridOutline ).toHaveCSS( 'grid-template-columns', desiresCustomValue );
		} );
	} );
} );
function hasWhiteSpace( s ) {
	return /\s/g.test( s );
}
