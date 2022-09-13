import { useEffect, useContext } from 'react';
import { OnboardingContext } from '../context/context';
import AccountService from 'elementor/app/services/account/account-service';

export default function Connect( props ) {
	const { state, updateState, getStateObjectToUpdate } = useContext( OnboardingContext );

	const connectSuccessCallback = ( data ) => {
		const stateToUpdate = getStateObjectToUpdate( state, 'steps', 'account', 'completed' );

		elementorCommon.config.library_connect.is_connected = true;
		elementorCommon.config.library_connect.current_access_level = data.kits_access_level || data.access_level || 0;

		stateToUpdate.isLibraryConnected = true;

		updateState( stateToUpdate );
	};

	useEffect( async () => {
		const accountService = new AccountService();
		const { data, error } = await accountService.auth(
			props.buttonRef.current,
			undefined, {
			width: 726,
			height: 534,
		} );
		if ( error && props.errorCallback ) {
			props.errorCallback();
		}
		if ( data ) {
			if ( props.successCallback ) {
				props.successCallback( data );
			} else {
				connectSuccessCallback( data );
			}
		}
	}, [] );

	return null;
}

Connect.propTypes = {
	buttonRef: PropTypes.object.isRequired,
	successCallback: PropTypes.func,
	errorCallback: PropTypes.func,
};
