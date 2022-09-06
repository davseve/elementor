export default class accountService {
	authenticate( buttonRef, parseUrl, sizes ) {
		return new Promise( ( resolve, reject ) => {
			const success = ( data ) => {
				resolve( { data, error: null } )
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
