import { useEffect, useRef } from 'react';
import ConnectLicenseButton from 'elementor-app/molecules/connect-license-button';

export default function Connect( props ) {
	const connectButtonRef = useRef();
	// const connectSuccessCallback = ( data ) => {
	// 	let isLibraryConnected = false;
	//
	// 	elementorCommon.config.library_connect.is_connected = true;
	// 	elementorCommon.config.library_connect.current_access_level = data.kits_access_level || data.access_level || 0;
	//
	// 	isLibraryConnected = true;
	// };



	useEffect( async () => {
		const parseUrl = ( url ) => url.replace( '%%page%%', 'export' );
		const { data, error } = await elementorAppPackages.services.accountService.auth( connectButtonRef.current, parseUrl );

		if ( error ) {
			props.onError( __( 'Unable to connect', 'elementor' ) );
		}
		if ( data ) {
			props.onSuccess( data );
		}
		// jQuery( connectButtonRef.current ).elementorConnect( {
		// 	success: ( e, data ) => props.onSuccess( data ),
		// 	error: () => props.onError( __( 'Unable to connect', 'elementor' ) ),
		// 	// parseUrl: ( url ) => url.replace( '%%page%%', 'export' ),
		// } );
	}, [] );

	return (
		<ConnectLicenseButton
			connectButtonRef={ connectButtonRef }
			// approveButtonUrl={ settings.library_connect_url }
			// onClick={ props.onClick }
			url={ props.url }
		/>
	);
}

Connect.propTypes = {
	connectButtonRef: PropTypes.object,
	onError: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired,
};
