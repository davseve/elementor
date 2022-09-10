// import { useRef } from 'react';
import AccountService from 'elementor/app/services/account/account-service';
describe( 'account-service.test.js', () => {
	const accountService = new AccountService();
	const approveButton = document.createElement( 'button' );


	test( 'auth service should return a fulfilled request with data ', async () => {
		// Arrange
		// Mock the data that returns from elementorConnect.success
		global.jQuery = () => {
			return {
				elementorConnect: ( { success } ) => {
					success( jest.fn(), { access_level: 0 } );
				},
			};
		};

		const successExpectedData = { access_level: 0 }
		const errorExpectedData = null;

		// Act
		const { data, error } = await accountService.auth( approveButton );

		// Assert
		expect( successExpectedData ).toEqual( data );
		expect( errorExpectedData ).toBe( error );
	} );

	test( 'auth service should return a fulfilled request with an error ', async () => {
		// Arrange
		// Mock the data that returns from elementorConnect.error
		global.jQuery = () => {
			return {
				elementorConnect: ( { error } ) => {
					error( jest.fn(), 'Unable to connect' );
				},
			};
		};
		const successExpectedData = null;
		const errorExpectedData = 'Unable to connect';

		// Act
		const { data, error } = await accountService.auth( approveButton );

		// Assert
		expect( errorExpectedData ).toBe( error );
		expect( successExpectedData ).toBe( data );
	} );

	test( 'check that service receives the desired variables', async () => {
		// const elementorConnect = jest.fn();
		const url = 'http://elementor1.local/wp-admin/admin.php?page=elementor-connect&app=activate&action=authorize&nonce=3dc0139959&utm_source=kit-library&utm_medium=wp-dash&utm_campaign=connect-and-activate-license&utm_term=%%page%%&mode=popup&callback_id=cb2';

		// global.jQuery = jest.fn( () => elementorConnect );
		const parseUrl = () => url.replace( '%%page%%', 'demo' );

		// Act
		let spy = jest.spyOn( accountService, 'auth' );
		// const eConnect = accountService.auth( approveButton, parseUrl );

		expect( spy ).toHaveBeenCalled();
	} );
} );


// Tests:
// 1. Check error (noEqual({access_level: 0}))  - v
// 2. Check success( isEqual({access_level: 0})) - v
// check that elementor connect with the desired properties
// -> spy on elementor connect  - cant reach elementor connect
// mock to jquery button, popup and parseUrl values - cant make it work

