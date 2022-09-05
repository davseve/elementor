export default class accountService {
	authenticate( approveButtonRef, onSuccess, onError, pageId, popup ) {
		jQuery( approveButtonRef.current ).elementorConnect( {
			success: ( e, data ) => onSuccess( data ),
			error: () => onError( __( 'Unable to connect', 'elementor' ) ),
			parseUrl: ( url ) => url.replace( '%%page%%', pageId ),
			popup,
		} );
	}
}
