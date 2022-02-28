import After from 'elementor-api/modules/hooks/ui/after';

export class BackgroundImageSize extends After {
	getCommand() {
		return 'document/elements/settings';
	}

	getId() {
		return 'background-image-size';
	}

	getConditions( args ) {
		return undefined !== args.settings.background_image_size;
	}

	apply( args ) {
		const { containers = [ args.container ] } = args;

		containers.forEach( ( /* Container */ container ) => {
			console.log( 'BackgroundImageSize: ', container.view );
		} );
	}
}

export default BackgroundImageSize;
