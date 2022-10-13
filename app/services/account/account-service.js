export default class AccountService {
	/**
	 * Authorisation service.
	 *
	 * @param {string} buttonRef
	 * @param {string} parseUrl
	 * @param {string} sizes
	 * @since 3.9.0
	 *
	 * @return {Promise}
	 */

	auth( buttonRef, parseUrl, sizes ) {
		return new Promise( ( resolve ) => {
			const success = ( e, data ) => {
				resolve( { data, error: null } );
			};

			const error = ( e, errorMsg ) => {
				resolve( { data: null, error: errorMsg } );
			};

			jQuery( buttonRef ).elementorConnect( {
				success,
				error,
				parseUrl,
				popup: sizes,
			} );
		} );
	}

	/**
	 * Check if the user is connected to the Elementor library
	 *
	 * @param app
	 * @since 3.9.0
	 */
	isConnected( app ) {
		if ( elementorAppConfig ) {
			return elementorAppConfig[ app ].is_library_connectedd;
		}
	}

	connectUrl() {
		return $e.data.get( 'connect/connect-url', {}, { refresh: true } )
			.then( ( response ) => response.data )
			.then( ( data ) => data );
	}
}
