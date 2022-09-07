export default class AccountService {
	/**
	 * Wrapps elementorConnect with a promise function.
	 *
	 * @param buttonRef
	 * @param parseUrl
	 * @param sizes
	 * @returns {Promise}
	 */
	auth( buttonRef, parseUrl, sizes ) {
		return new Promise( ( resolve, reject ) => {
			// setTimeout( () => {
			// 	resolve( { data: 'dav' } )
			// }, 100 );

				const success = ( e, data ) => {
					resolve( { data, error: null } );
				};

				const error = () => {
					resolve( { data: null, error: 'Error' } );
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
