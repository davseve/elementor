import { useState, useEffect, useContext, useRef } from 'react';
import TemplatesFeatures from './components/templates-features/templates-features';
import KitContentCheckbox from './components/kit-content-checkbox/kit-content-checkbox';
import CptOptionsSelectBox from '../cpt-select-box/cpt-select-box';
import GoProButton from 'elementor-app/molecules/go-pro-button';
import Connect from 'elementor-app/molecules/connect';
import Box from 'elementor-app/ui/atoms/box';
import List from 'elementor-app/ui/molecules/list';
import Heading from 'elementor-app/ui/atoms/heading';
import Text from 'elementor-app/ui/atoms/text';
import Grid from 'elementor-app/ui/grid/grid';
import { appsEventTrackingDispatch } from 'elementor-app/event-track/apps-event-tracking';
import Button from 'elementor-app/ui/molecules/button';
import { SharedContext } from './../../context/shared-context/shared-context-provider.js';

import './kit-content.scss';

export default function KitContent( { contentData, hasPro, processType } ) {
	const [ containerHover, setContainerHover ] = useState( {} ),
		sharedContext = useContext( SharedContext ),
		{ referrer, currentPage, proStatus } = sharedContext.data,
		// Need to read the hasPro value first from the props because the plugin might be installed during the process.
		isProExist = hasPro || elementorAppConfig.hasPro,
		isProStatus = proStatus || elementorAppConfig.proStatus,
		connectUrl = elementorAppConfig[ 'import-export' ].connectUrlInner,

		getTemplateFeatures = ( features, index ) => {
			if ( ! features ) {
				return;
			}

			return (
				<TemplatesFeatures
					features={ features }
					isLocked={ ! isProExist }
					proStatus={ proStatus }
					showTooltip={ containerHover[ index ] }
				/>
			);
		},
		setLicenseType = ( data ) => {
			sharedContext.dispatch( { type: 'IS_PRO_ACTIVATED', payload: data } );
			console.log( 'setLicenseType', data );
		},
		setContainerHoverState = ( index, state ) => {
			setContainerHover( ( prevState ) => ( { ...prevState, [ index ]: state } ) );
		},
		actionButton = ( isLockedFeaturesNoPro ) => {
			if ( isLockedFeaturesNoPro && 'undefined' === typeof isProStatus ) {
				return (
					<GoProButton
						className="e-app-export-kit-content__go-pro-button"
						url="https://go.elementor.com/go-pro-import-export"
					/>
				);
			} else if ( false === isProStatus ) {
				const renewUrl = `https://go.elementor.com/renew-${ processType }?utm_term=${ processType }&utm_source=import-export&utm_medium=wp-dash&utm_campaign=connect-and-activate-license`;
				return (
					<Connect
						onSuccess={ ( data ) => setLicenseType( { success: data } ) }
						onError={ ( message ) => setLicenseType( { onError: message } ) }
						url={ elementorAppConfig[ 'import-export' ].connectUrlInner }
						processType={ processType }
					/>
				);
			}
		},
		eventTracking = ( event, chosenPart ) => {
			if ( 'kit-library' === referrer ) {
				const command = event.target.checked && event.target.checked ? 'check' : 'uncheck';
				appsEventTrackingDispatch(
					`kit-library/${ command }`,
					{
						page_source: 'import',
						step: currentPage,
						event_type: 'click',
						site_part: chosenPart,
					},
				);
			}
		};
	// UseEffect( async () => {
	// 	const connectUrl = await elementorAppPackages.services.accountService.connectUrl();
	// 	console.log( 'connect-url', connectUrl );
	// }, [] );

	if ( ! contentData.length ) {
		return null;
	}

	return (
		<Box>
			<List separated className="e-app-export-kit-content">
				{
					contentData.map( ( { type, data }, index ) => {
						const isLockedFeaturesNoPro = data.features?.locked && ! isProExist;
						return (
							<List.Item padding="20" key={ type } className="e-app-export-kit-content__item">
								<div
									onMouseEnter={ () => isLockedFeaturesNoPro && setContainerHoverState( index, true ) }
									onMouseLeave={ () => isLockedFeaturesNoPro && setContainerHoverState( index, false ) }
								>
									<Grid container noWrap >
										<KitContentCheckbox
											type={ type }
											className="e-app-export-kit-content__checkbox"
											onCheck={ ( event, chosenPart ) => {
												eventTracking( event, chosenPart );
											} }
										/>

										<Grid item container>
											<Heading variant="h4" tag="h3" className="e-app-export-kit-content__title">
												{ data.title }
												{ ( isLockedFeaturesNoPro ) &&
													<Button
														text={ __( 'PRO', 'elementor' ) }
														url="https://go.elementor.com/go-pro-import-export"
														target="_blank"
														icon="eicon-lock e-app-export-kit-content__go-pro-label-icon"
														className="e-app-export-kit-content__go-pro-label"
													/>
												}
											</Heading>

											<Grid item container direction={ 'templates' === type ? 'row' : 'column' } alignItems={ 'baseline' } >
												<Text variant="sm" tag="p" className="e-app-export-kit-content__description">
													{ data.description || getTemplateFeatures( data.features, index ) }
												</Text>
												{ 'templates' === type && actionButton( isLockedFeaturesNoPro ) }
												{ 'content' === type && <CptOptionsSelectBox /> }
											</Grid>
										</Grid>
									</Grid>
								</div>
							</List.Item>
						);
					} )
				}
			</List>
		</Box>
	);
}

KitContent.propTypes = {
	className: PropTypes.string,
	contentData: PropTypes.array.isRequired,
	hasPro: PropTypes.bool,
	processType: PropTypes.oneOf( [ 'import', 'export' ] ),
};

KitContent.defaultProps = {
	className: '',
};
