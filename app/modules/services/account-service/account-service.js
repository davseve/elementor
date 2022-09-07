export default class AccountService {
	auth( buttonRef, parseUrl, sizes ) {
		return new Promise( ( resolve, reject ) => {
			const success = ( e, data ) => {
				resolve( { e, data, error: null } )
			};

			const error = () => {
				resolve( { data: null, error: 'Error' } )
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
