import { useContext, useEffect, useMemo } from 'react';
import { useNavigate } from '@reach/router';

import { SharedContext } from '../../../context/shared-context/shared-context-provider';
import { ImportContext } from '../../../context/import-context/import-context-provider';

import Layout from '../../../templates/layout';
import WizardStep from '../../../ui/wizard-step/wizard-step';
import KitData from '../../../shared/kit-data/kit-data';
import InlineLink from 'elementor-app/ui/molecules/inline-link';

import FailedPluginsNotice from './components/failed-plugins-notice/failed-plugins-notice';
import ConnectProNotice from './components/connect-pro-notice/connect-pro-notice';
import ImportCompleteFooter from './components/import-complete-footer/import-complete-footer';

import useImportedKitData from './hooks/use-imported-kit-data';
import { eventTrackingDispatch } from 'elementor-app/event-track/events';

export default function ImportComplete() {
	const sharedContext = useContext( SharedContext ),
		importContext = useContext( ImportContext ),
		navigate = useNavigate(),
		{ importedPlugins, uploadedData, importedData, isProInstalledDuringProcess } = importContext.data || {},
		{ referrer } = sharedContext.data || {},
		{ getTemplates, getContent, getWPContent, getPlugins } = useImportedKitData(),
		{ activePlugins, failedPlugins } = getPlugins( importedPlugins ),
		{ elementorHomePageUrl, recentlyEditedElementorPageUrl } = importedData?.configData || {},
		seeItLiveUrl = elementorHomePageUrl || recentlyEditedElementorPageUrl || null,
		getKitData = () => {
			if ( ! uploadedData || ! importedData ) {
				return {};
			}

			const manifest = uploadedData.manifest;

			return {
				templates: getTemplates( manifest.templates, importedData ),
				content: getContent( manifest.content, importedData ),
				'wp-content': getWPContent( manifest[ 'wp-content' ], importedData ),
				'site-settings': sharedContext.data.includes.includes( 'settings' ) ? manifest[ 'site-settings' ] : {},
				plugins: activePlugins,
				configData: importedData.configData,
			};
		},
		kitLiveLoadEvent = () => eventTrackingDispatch(
			'kit-library/kit-is-live-load',
			{
				event: 'kit is live load',
				source: 'kit is live',
				event_type: 'load',
			},
		),
		kitData = useMemo( () => getKitData(), [] );
		useEffect( () => {
			if ( ! uploadedData ) {
				navigate( '/import' );
			}

			if ( uploadedData && 'kit-library' === referrer ) {
				kitLiveLoadEvent();
			}
		}, [] );

	return (
		<Layout type="import" footer={ <ImportCompleteFooter seeItLiveUrl={ seeItLiveUrl } referrer={ referrer } /> }>
			<WizardStep
				image={ elementorAppConfig.assets_url + 'images/go-pro.svg' }
				heading={ __( 'Your kit is now live on your site!', 'elementor' ) }
				description={ __( 'You’ve imported and applied the following to your site:', 'elementor' ) }
				notice={ (
					<>
						<InlineLink
							url="https://go.elementor.com/app-what-are-kits"
							italic
							onLinkClick={ () => {
								if ( 'kit-library' === referrer ) {
									eventTrackingDispatch(
										'kit-library/seek-more-info',
										{
											event: 'learn more-kits',
											source: 'kit-is-live',
										},
									);
								}
							} }
						>
							{ __( 'Click here', 'elementor' ) }
						</InlineLink> { __( 'to learn more about building your site with Elementor Kits', 'elementor' ) }
					</>
				) }
			>
				{ ! ! failedPlugins.length && <FailedPluginsNotice failedPlugins={ failedPlugins } /> }

				{ isProInstalledDuringProcess && <ConnectProNotice /> }

				<KitData data={ kitData } />
			</WizardStep>
		</Layout>
	);
}
