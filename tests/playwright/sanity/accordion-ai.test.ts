import { expect } from '@playwright/test';
import { parallelTest as test } from '../parallelTest';
import { auto } from "auto-playwright";
import WpAdminPage from '../pages/wp-admin-page';

test('Accordion', async ({ page, apiRequests }, testInfo) => {
	// Arrange.
	const wpAdmin = new WpAdminPage(page, testInfo, apiRequests);
	const editor = await wpAdmin.openNewPage();

	// Act.
	await editor.addWidget('accordion');

	const accordion = await auto('get accordion selector', { page, test });
	const numberOfItems = await auto('get Number of items', { page, test });

	console.log({ accordion, numberOfItems });

	// Assert.
	expect(accordion).not.toBeNull();
	expect(numberOfItems).toBe(3);
});
