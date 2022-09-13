import { Dialog } from '@elementor/app-ui';
import { useSettingsContext } from '../context/settings-context';
import AccountService from 'elementor/app/services/account/account-service';

const { useEffect, useRef } = React;

export default function ConnectDialog( props ) {
	const { settings } = useSettingsContext();
	const approveButtonRef = useRef();

	useEffect( async () => {
		const accountService = new AccountService();
		const parseUrl = ( url ) => url.replace( '%%page%%', props.pageId );
		const { data, error } = await accountService.auth( approveButtonRef.current, parseUrl );
		if ( error ) {
			props.onError( __( 'Unable to connect', 'elementor' ) );
		}
		if ( data ) {
			props.onSuccess( data );
		}
	}, [] );

	return (
		<Dialog
			title={ __( 'Connect to Template Library', 'elementor' ) }
			text={ __( 'Access this template and our entire library by creating a free personal account', 'elementor' ) }
			approveButtonText={ __( 'Get Started', 'elementor' ) }
			approveButtonUrl={ settings.library_connect_url }
			approveButtonOnClick={ () => props.onClose() }
			approveButtonColor="primary"
			approveButtonRef={ approveButtonRef }
			dismissButtonText={ __( 'Cancel', 'elementor-pro' ) }
			dismissButtonOnClick={ () => props.onClose() }
			onClose={ () => props.onClose() }
		/>
	);
}

ConnectDialog.propTypes = {
	onClose: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired,
	onSuccess: PropTypes.func.isRequired,
	pageId: PropTypes.string,
};
