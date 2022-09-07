import AccountService from 'elementor/app/modules/services/account-service/account-service';
import { JSDOM } from "jsdom"
const dom = new JSDOM();

/**
 *  Mock button
 */

global.document = dom.window.document;
global.window = dom.window;

describe( 'account-service.test.js', () => {
	let mockElement;

	beforeAll( () => {
		mockElement = global.window.createElement( 'button' );
	} );
	// Arrange
	const accountService = new AccountService();

	// Act
	const { e, data, error } = accountService.auth( mockElement );

	// Assert
	expect( data ).toBeTruthy();
} );
