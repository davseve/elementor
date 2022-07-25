import ActionsFooter from '../../../../../shared/actions-footer/actions-footer';
import Button from 'elementor-app/ui/molecules/button';

import useImportActions from '../../../hooks/use-import-actions';
import { eventTrackingDispatch } from 'elementor-app/event-track/events';

export default function ImportCompleteFooter( { seeItLiveUrl, referrer } ) {
	const { closeApp } = useImportActions();
	return (
		<ActionsFooter>
			{
				seeItLiveUrl &&
				<Button
					text={ __( 'See it live', 'elementor' ) }
					variant="contained"
					onClick={ () => {
						if ( 'kit-library' === referrer ) {
							eventTrackingDispatch(
								'kit-library/see-it-live',
								{
									event: 'see it live button',
									source: 'kit is live',
								},
							);
						}
						window.open( seeItLiveUrl, '_blank' );
					} }
				/>
			}

			<Button
				text={ __( 'Close', 'elementor' ) }
				variant="contained"
				color="primary"
				onClick={ () => {
					if ( 'kit-library' === referrer ) {
						eventTrackingDispatch(
							'kit-library/close',
							{
								event: 'close button',
								source: 'kit is live',
							},
						);
					}
					closeApp();
				} }
			/>
		</ActionsFooter>
	);
}

ImportCompleteFooter.propTypes = {
	seeItLiveUrl: PropTypes.string,
};
