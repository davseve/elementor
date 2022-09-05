import { useEffect, useContext } from 'react';
import { OnboardingContext } from '../context/context';
import accountService from 'elementor/app/modules/services/account-service/account-service';

export default function Connect( props ) {
	const { state, updateState, getStateObjectToUpdate } = useContext( OnboardingContext );

	const connectSuccessCallback = ( data ) => {
		const stateToUpdate = getStateObjectToUpdate( state, 'steps', 'account', 'completed' );

		elementorCommon.config.library_connect.is_connected = true;
		elementorCommon.config.library_connect.current_access_level = data.kits_access_level || data.access_level || 0;

		stateToUpdate.isLibraryConnected = true;

		updateState( stateToUpdate );
	};
	const bridge = new accountService();

	useEffect( async () => {
		const successCallback = ( data ) => props.successCallback ? props.successCallback( data ) : connectSuccessCallback( data );
		const errorCallback = () => {
						if ( props.errorCallback ) {
							props.errorCallback();
						}
					};
		const parseUrl = ( url ) => url;
		const popup = { popup: {
				width: 726,
				height: 534,
			} };
		await bridge.authenticate( props.buttonRef.current, successCallback, errorCallback, parseUrl, popup );
	}, [] );

	return null;
}

Connect.propTypes = {
	buttonRef: PropTypes.object.isRequired,
	successCallback: PropTypes.func,
	errorCallback: PropTypes.func,
};
