import services from '../../../../../app/assets/js/services';

describe( 'account-service.test.js', () => {
	test( 'auth service should return a fulfilled request with data ', async () => {
		const approveButton = document.createElement( 'a' );
		// Arrange
		global.jQuery = () => {
			return {
				elementorConnect: ( { success } ) => {
					success( jest.fn(), { access_level: 0 } );
				},
			};
		};

		const successExpectedData = { access_level: 0 };
		const errorExpectedData = null;

		// Act
		const { data, error } = await services.accountService.auth( approveButton );

		// Assert
		expect( successExpectedData ).toEqual( data );
		expect( errorExpectedData ).toBe( error );
	} );

	test( 'auth service should return a fulfilled request with an error ', async () => {
		const approveButton = document.createElement( 'a' );
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
		const { data, error } = await services.accountService.auth( approveButton );

		// Assert
		expect( errorExpectedData ).toBe( error );
		expect( successExpectedData ).toBe( data );
	} );

	test( 'check that service receives the desired variables', () => {
		const approveButton = document.createElement( 'a' );

		// Arrange
		const elementorConnect = jest.fn();

		global.jQuery = jest.fn( () => {
			return {
				elementorConnect,
			};
		} );

		const parseUrl = () => {};
		const sizes = { width: '100', height: '200' };

		// Act
		services.accountService.auth( approveButton, parseUrl, sizes );

		// Assert
		expect( window.jQuery ).toHaveBeenCalledTimes( 1 );
		expect( window.jQuery ).toHaveBeenCalledWith( approveButton );
		expect( elementorConnect ).toHaveBeenCalledTimes( 1 );
		expect( elementorConnect ).toHaveBeenCalledWith( {
			success: expect.any( Function ),
			error: expect.any( Function ),
			parseUrl,
			popup: sizes,
		} );
	} );
} );
