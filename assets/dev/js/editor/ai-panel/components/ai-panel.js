import {
	Panel,
	PanelHeader,
	PanelHeaderTitle,
	PanelBody,
} from '@elementor/editor-panels';

import {
	Chip,
	FormControl,
	InputLabel,
	Button,
	Select,
	MenuItem,
	Typography,
	Container,
	LinearProgress,
	OutlinedInput,
	Box,
} from '@elementor/ui';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const areasNames = [ 'SEO', 'Performance', 'UX' ];
const widgetsNames = [ 'Heading', 'Image', 'Text Editor' ];

export default function AiPanel() {
	const [ areas, setAreas ] = React.useState( [ 'SEO', 'UX' ] );
	const [ widgets, setWidgets ] = React.useState( [ 'Heading', 'Text Editor' ] );
	const [ recommendations, setRecommendations ] = React.useState( [] );
	const [ loading, setLoading ] = React.useState( false );
	const [ isTyping, setIsTyping ] = React.useState( false );

	const handleChange = ( event ) => {
		const {
			target: { value },
		} = event;
		setAreas(
			// On autofill we get a stringified value.
			'string' === typeof value ? value.split( ',' ) : value,
		);
	};

	const generateRecommendations = () => {
		// Admin-ajax.php
		$.ajax( {
			url: '/wp-admin/admin-ajax.php',
			type: 'POST',
			data: {
				areas: [ 'SEO' ],
				widgets: [ 'Heading' ],
				action: 'optimentor_generate_recommendations',
			},
			beforeSend( xhr ) {
				xhr.setRequestHeader( 'Content-Type', 'application/json' );
			},
			success( response ) {
				console.log( response );
				setLoading( false );
			},
			error( error ) {
				console.log( error );
				setLoading( false );
			},
		} );

		setLoading( true );
		// Wait 5 seconds
		setTimeout( () => {
			setIsTyping( true );
		}, 5000 );
	};

	return (
		<Panel>
			<PanelHeader>
				<PanelHeaderTitle>Optimentor AI Assistant</PanelHeaderTitle>
			</PanelHeader>
			{ loading && <LinearProgress color="primary" /> }
			<PanelBody>
				<Container maxWidth="sm">
					<Box my={ 4 } textAlign={ 'center' }>
						{ ! loading && (
							<Typography
								variant="subtitle1"
								gutterBottom
								style={ {
									fontWeight: 'bold',
								} }
							>
								Hello, Im Optimentor AI Assistant
								<br />I can help you to create a better website!
							</Typography>
						) }

						{ loading && (
							<Typography
								variant="subtitle1"
								gutterBottom
								style={ {
									fontWeight: 'bold',
								} }
							>
								Please wait, I'm generating recommendations JUST FOR YOU!
							</Typography>
						) }
						<img
							alt="Optimentor AI Assistant"
							src={
								'https://miro.medium.com/v2/resize:fit:1400/1*fZsdZisozTZbM6AaPQKI4Q.gif'
							}
						/>
						{ ! loading && (
							<>
								<Typography variant="subtitle1" gutterBottom>
									What do you want to improve?
								</Typography>

								<FormControl sx={ { m: 1, width: '90%', marginTop: '30px' } }>
									<InputLabel id="demo-multiple-chip-label">
										Select Focus Areas:
									</InputLabel>
									<Select
										labelId="demo-multiple-chip-label"
										id="demo-multiple-chip"
										multiple
										value={ areas }
										onChange={ handleChange }
										input={
											<OutlinedInput
												id="select-multiple-chip"
												label="Select Focus Areas:"
											/>
										}
										renderValue={ ( selected ) => (
											<Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
												{ selected.map( ( value ) => (
													<Chip key={ value } label={ value } />
												) ) }
											</Box>
										) }
										MenuProps={ MenuProps }
									>
										{ areasNames.map( ( name ) => (
											<MenuItem key={ name } value={ name }>
												{ name }
											</MenuItem>
										) ) }
									</Select>
								</FormControl>

								<FormControl sx={ { m: 1, width: '90%', marginTop: '20px' } }>
									<InputLabel id="demo-multiple-chip-label">
										Select Widgets:
									</InputLabel>
									<Select
										labelId="demo-multiple-chip-label"
										id="demo-multiple-chip"
										multiple
										value={ widgets }
										onChange={ handleChange }
										input={
											<OutlinedInput
												id="select-multiple-chip"
												label="Select Widgets:"
											/>
										}
										renderValue={ ( selected ) => (
											<Box sx={ { display: 'flex', flexWrap: 'wrap', gap: 0.5 } }>
												{ selected.map( ( value ) => (
													<Chip key={ value } label={ value } />
												) ) }
											</Box>
										) }
										MenuProps={ MenuProps }
									>
										{ widgetsNames.map( ( name ) => (
											<MenuItem key={ name } value={ name }>
												{ name }
											</MenuItem>
										) ) }
									</Select>
								</FormControl>

								<Button
									variant="contained"
									style={ { marginTop: '30px' } }
									onClick={ generateRecommendations }
									disabled={ loading }
								>
									Generate Recommendations
								</Button>
							</>
						) }
					</Box>

					<Box my={ 4 } textAlign={ 'center' }>

						{ isTyping && (
							<span>
								<img
									style={ {
										height: '25px',
										float: 'left',
										marginLeft: '11px',
									} }
									alt="Optimentor AI Assistant"
									src={ 'https://res.cloudinary.com/practicaldev/image/fetch/s--aLdmG8eR--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/i/rf4nb3r7qsn2u9fjrf47.gif' }
								/>
								<Typography variant="caption" gutterBottom
									style={ {
										textAlign: 'left',
										float: 'left',
										marginTop: '4px',
										marginLeft: '10px',
									} }>
									<strong>Optimentor</strong> is Typing...
								</Typography>
							</span>
						) }
					</Box>
				</Container>
			</PanelBody>
		</Panel>
	);
}
