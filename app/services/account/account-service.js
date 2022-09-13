export default class AccountService {
	/**
	 * Authorisation service.
	 *
	 * @param {string} buttonRef
	 * @param {string} parseUrl
	 * @param {string} sizes
	 * @since 3.8.0
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

	// isUserConnected() {
	// 	return elementorAppConfig[ 'kit-library' ].is_library_connected;
	// }
}
