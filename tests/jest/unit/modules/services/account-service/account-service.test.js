import AccountService from 'elementor/app/modules/services/account-service/account-service';
import * as myPromise from '@reach/router/lib/utils';

describe( 'account-service.test.js', () => {
	beforeEach( () => {
		// global.jQuery = jest.requireActual( 'jquery' );
		global.jQuery = () => {
			return {
				// elementorConnect: jest.fn( () => ( { access_level: 0 } ) ),
				// elementorConnect: jest.fn( () => myPromise.resolve( { data: 'b' } ) ),
				elementorConnect: jest.fn( () => myPromise.resolve( { data: 'b' } ) ),
			};
		};
	} );

	afterEach( () => {
		jest.clearAllMocks();
	} );

	test( 'should fail', async () => {
		// Arrange
		const accountService = new AccountService();
		const approveButton = document.createElement( 'button' );

		const parseUrl = ( url ) => url.replace( '%%page%%', 'demo' );
		// Act
		const { data } = await accountService.auth( approveButton, parseUrl );
		console.log( data );
	} );
} );

// Tests:
// 1. Check error (noEqual({access_level: 0}))
// 2. Check success( isEqual({access_level: 0}))
// 3. Url in parseUrl should change ('%%page%%', 'demo' )
