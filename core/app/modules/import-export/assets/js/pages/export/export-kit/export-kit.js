import React, { useEffect, useContext } from 'react';

import { ExportContext } from '../../../context/export-context/export-context-provider';

import Layout from '../../../templates/layout';
import PageHeader from '../../../ui/page-header/page-header';
import KitContent from '../../../shared/kit-content/kit-content';
import KitInformation from './components/kit-information/kit-information';
import ActionsFooter from '../../../shared/actions-footer/actions-footer';
import InlineLink from 'elementor-app/ui/molecules/inline-link';
import Button from 'elementor-app/ui/molecules/button';

import kitContentData from '../../../shared/kit-content-data/kit-content-data';

import './export-kit.scss';

export default function ExportKit() {
	const exportContext = useContext( ExportContext ),
		getFooter = () => (
			<ActionsFooter>
				<Button
					variant="contained"
					text={ __( 'Next', 'elementor' ) }
					color="primary"
					url="/export/plugins"
				/>
			</ActionsFooter>
		),
		getLearnMoreLink = () => (
			<InlineLink url="https://go.elementor.com/app-what-are-kits" italic>
				{ __( 'Learn More', 'elementor' ) }
			</InlineLink>
		);

	useEffect( () => {
		exportContext.dispatch( { type: 'SET_IS_EXPORT_PROCESS_STARTED', payload: true } );
	}, [] );

	const getCustomPostTypes = () => {
		const content = elementorAppConfig[ 'import-export' ].summaryTitles.content?.customPostTypes;
		const cptOptionsArray = [];
		Object.keys( content ).forEach( ( key ) => cptOptionsArray.push( {
			label: content[ key ].plural,
			value: key,
		} ) );
		return cptOptionsArray;
	};

	return (
		<Layout type="export" footer={ getFooter() }>
			<section className="e-app-export-kit">
				<PageHeader
					heading={ __( 'Export a Template Kit', 'elementor' ) }
					description={ [
						__( 'Choose which Elementor components - templates, content and site settings - to include in your kit file.', 'elementor' ),
						<React.Fragment key="description-secondary-line">
							{ __( 'By default, all of your components will be exported.', 'elementor' ) } { getLearnMoreLink() }
						</React.Fragment>,
					] }
				/>

				<KitContent contentData={ kitContentData } select2CustomPostTypesOptions={ getCustomPostTypes() } />

				<KitInformation />
			</section>
		</Layout>
	);
}
