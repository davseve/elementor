import { useState, useEffect, useContext } from 'react';
import { useNavigate } from '@reach/router';

import { SharedContext } from '../../../context/shared-context/shared-context-provider';
import { ImportContext } from '../../../context/import-context/import-context-provider';

import Layout from '../../../templates/layout';
import PageHeader from '../../../ui/page-header/page-header';
import ProcessFailedDialog from '../../../shared/process-failed-dialog/process-failed-dialog';
import InlineLink from 'elementor-app/ui/molecules/inline-link';
import Notice from 'elementor-app/ui/molecules/notice';
import DropZone from 'elementor-app/organisms/drop-zone';
import Button from 'elementor-app/ui/molecules/button';
import { appsEventTrackingDispatch } from 'elementor-app/event-track/apps-event-tracking';

import useKit from '../../../hooks/use-kit';

import './import-kit.scss';

export default function ImportKit() {
	const sharedContext = useContext( SharedContext ),
		importContext = useContext( ImportContext ),
		navigate = useNavigate(),
		{ kitState, kitActions, KIT_STATUS_MAP } = useKit(),
		[ errorType, setErrorType ] = useState( '' ),
		[ isLoading, setIsLoading ] = useState( false ),
		{ referrer, wizardStepNum } = sharedContext.data,
		resetImportProcess = () => {
			importContext.dispatch( { type: 'SET_FILE', payload: null } );
			setErrorType( null );
			setIsLoading( false );
			kitActions.reset();
		},
		eventTracking = ( command, eventName, element = null, eventType = 'click', step = null, error = null ) => appsEventTrackingDispatch(
			command,
			{
				event: eventName,
				element,
				source: 'import',
				event_type: eventType,
				step,
				error_type: error,

			},
		),
		onFileUpload = ( uploadMethod ) => {
			const uploadMethodName = ( 'drop' === uploadMethod ? 'drop' : 'browse' );
			appsEventTrackingDispatch(
				`kit-library/${ uploadMethodName }`,
				{
					method: uploadMethodName,
					event: 'select kit file',
					source: 'import',
				},
			);
		};

		const getLearnMoreLink = () => (
			<InlineLink
				url="https://go.elementor.com/app-what-are-kits"
				key="learn-more-link"
				italic
				onClick={ () => {
					if ( 'kit-library' === referrer ) {
						eventTracking( 'kit-library/seek-more-info', 'learn more', null, 'click', wizardStepNum );
					}
				} }
			>
				{ __( 'Learn More', 'elementor' ) }
			</InlineLink>
		);

	// On load.
	useEffect( () => {
		sharedContext.dispatch( { type: 'SET_INCLUDES', payload: [] } );
		sharedContext.dispatch( { type: 'SET_WIZARD_STEP_NUM', payload: 1 } );
	}, [] );

	// Uploading the kit after file is selected.
	useEffect( () => {
		if ( importContext.data.file ) {
			kitActions.upload( { file: importContext.data.file } );
		}
	}, [ importContext.data.file ] );

	// Listening to kit upload state.
	useEffect( () => {
		if ( KIT_STATUS_MAP.UPLOADED === kitState.status ) {
			importContext.dispatch( { type: 'SET_UPLOADED_DATA', payload: kitState.data } );
		} else if ( 'error' === kitState.status ) {
			setErrorType( kitState.data );
		}
	}, [ kitState.status ] );

	// After kit was uploaded.
	useEffect( () => {
		if ( importContext.data.uploadedData && importContext.data.file ) {
			sharedContext.dispatch( { type: 'SET_WIZARD_STEP_NUM', payload: wizardStepNum + 1 } );
			const url = importContext.data.uploadedData.manifest.plugins ? '/import/plugins' : '/import/content';

			navigate( url );
		}
	}, [ importContext.data.uploadedData ] );

	return (
		<Layout type="import">
			<section className="e-app-import">
				{
					'kit-library' === referrer &&
					<Button
						className="e-app-import__back-to-library"
						icon="eicon-chevron-left"
						text={ __( 'Back to Kit Library', 'elementor' ) }
						url="/kit-library"
					/>
				}

				<PageHeader
					heading={ __( 'Import a Website Kit', 'elementor' ) }
					description={ [
						__( 'Upload a file with templates, site settings, content, etc., and apply them to your site automatically.', 'elementor' ),
						getLearnMoreLink(),
					] }
				/>

				<Notice label={ __( 'Important:', 'elementor' ) } color="warning" className="e-app-import__notice">
					{ __( 'We recommend that you backup your site before importing a kit file.', 'elementor' ) }
				</Notice>

				<DropZone
					className="e-app-import__drop-zone"
					heading={ __( 'Upload Files to Your Library', 'elementor' ) }
					text={ __( 'Drag & drop the .zip file with your Kit', 'elementor' ) }
					secondaryText={ __( 'Or', 'elementor' ) }
					filetypes={ [ 'zip' ] }
					onFileChoose={ () => {
						if ( 'kit-library' === referrer ) {
							eventTracking( 'kit-library/choose-file', 'select kit file' );
						}
					} }
					onFileSelect={ ( file, e ) => {
						setIsLoading( true );
						importContext.dispatch( { type: 'SET_FILE', payload: file } );
						if ( 'kit-library' === referrer ) {
							onFileUpload( e.type );
						}
					} }
					onError={ () => setErrorType( 'general' ) }
					isLoading={ isLoading }
					referrer={ referrer }
				/>

				{ errorType && <ProcessFailedDialog
					errorType={ errorType }
					onApprove={ resetImportProcess }
					onModalClose={ () => {
						if ( 'kit-library' === referrer ) {
							eventTracking( 'kit-library/modal-close', 'error modal close', null, 'load', wizardStepNum );
						}
					} }
					onError={ () => {
						if ( 'kit-library' === referrer ) {
							eventTracking( 'kit-library/modal-error', 'error modal load', null, 'load', wizardStepNum, `error modal load  ${ errorType }` );
						}
					} }
					onLearnMore={ () => {
						if ( 'kit-library' === referrer ) {
							eventTracking( 'kit-library/seek-more-info', 'error modal learn more', null, 'click', wizardStepNum );
						}
					} }
				/>	}
			</section>
		</Layout>
	);
}
