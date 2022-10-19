import { useEffect, useRef } from 'react';
import ConnectLicenseButton from 'elementor-app/molecules/connect-license-button';

export default function Connect( props ) {
	const connectButtonRef = useRef();

	useEffect( async () => {
		jQuery( connectButtonRef.current ).elementorConnect( {
			success: ( e, data ) => props.onSuccess( data ),
			error: () => props.onError( __( 'Unable to connect', 'elementor' ) ),
			parseUrl: ( url ) => url.replace( '%%page%%', props.processType ),
		} );
	}, [] );

	return (
		<ConnectLicenseButton
			connectButtonRef={ connectButtonRef }
			url={ props.url }
		/>
	);
}

Connect.propTypes = {
	connectButtonRef: PropTypes.object,
	onError: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired,
	processType: PropTypes.string,
};
