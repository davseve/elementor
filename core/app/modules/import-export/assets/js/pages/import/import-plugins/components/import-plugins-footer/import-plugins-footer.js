import { useContext } from 'react';

import { ImportContext } from '../../../../../context/import-context/import-context-provider';
import { SharedContext } from '../../../../../context/shared-context/shared-context-provider';

import ActionsFooter from '../../../../../shared/actions-footer/actions-footer';
import Button from 'elementor-app/ui/molecules/button';

import useImportActions from '../../../hooks/use-import-actions';

export default function ImportPluginsFooter() {
	const importContext = useContext( ImportContext ),
	 	sharedContext = useContext( SharedContext ),
		{ referrer } = sharedContext.data,
		{ navigateToMainScreen } = useImportActions();
	return (
		<ActionsFooter>
			<Button
				text={ __( 'Previous', 'elementor' ) }
				variant="contained"
				onClick={ () => {
					importContext.dispatch( { type: 'SET_FILE', payload: null } );
					if ( 'kit-library' === referrer ) {
						elementorCommon.events.eventTracking(
							'kit-library/go-back',
							{
								placement: 'kit library',
								event: 'previous button',
							},
							{
								source: 'import',
								step: '3',
							},
						)
					}
					navigateToMainScreen();
				} }
			/>

			<Button
				variant="contained"
				text={ __( 'Next', 'elementor' ) }
				color="primary"
				url="/import/content"
				onClick={ () => {
					if ( 'kit-library' === referrer ) {
						elementorCommon.events.eventTracking(
							'kit-library/approve-selection',
							{
								placement: 'kit library',
								event: 'next button',
							},
							{
								source: 'import',
								step: '3',
							},
						)
					}
				} }
			/>
		</ActionsFooter>
	);
}
