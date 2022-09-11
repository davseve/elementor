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

			const error = () => {
				resolve( { data: null, error: 'Unable to connect' } );
			};

			jQuery( buttonRef ).elementorConnect( {
				success,
				error,
				parseUrl,
				popup: sizes,
			} );
		} );
	}
}
