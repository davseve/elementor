export default class accountService {
	authenticate( buttonRef, success, error, parseUrl, popup = null ) {
		jQuery( buttonRef ).elementorConnect( {
			success,
			error,
			parseUrl,
			...popup,
		} );
	}
}
