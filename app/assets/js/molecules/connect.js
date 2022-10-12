import {useEffect, useRef} from 'react';
import ConnectLicenseButton from 'elementor-app/molecules/connect-license-button';

export default function Connect( props ) {
	console.log( 'Connect props: ', props );
	const connectButtonRef = useRef();
	// const connectSuccessCallback = ( data ) => {
	// 	let isLibraryConnected = false;
	//
	// 	elementorCommon.config.library_connect.is_connected = true;
	// 	elementorCommon.config.library_connect.current_access_level = data.kits_access_level || data.access_level || 0;
	//
	// 	isLibraryConnected = true;
	// };

	useEffect( () => {
		jQuery( connectButtonRef.current ).elementorConnect( {
			success: ( e, data ) => props.onSuccess( data ),
			error: () => props.onError( __( 'Unable to connect', 'elementor' ) ),
			// parseUrl: ( url ) => url.replace( '%%page%%', 'export' ),
		} );
	}, [] );

	return (
		<ConnectLicenseButton
			connectButtonRef={ connectButtonRef }
			// approveButtonUrl={ settings.library_connect_url }
			// onClick={ props.onClick }
			connectUrl="https://my.elementor.com/authorize?response_type=code&client_id=1&redirect_uri=https://my.elementor.com/authorize&scope=library"
		/>
	);
}

Connect.propTypes = {
	connectButtonRef: PropTypes.object,
	onError: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
};
