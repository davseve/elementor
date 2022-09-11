import Kit from 'elementor/app/modules/kit-library/assets/js/models/kit';

export default class KitService {
	fetchAll( force ) {
		return $e.data.get( 'kits/index', {
			force: force ? 1 : undefined,
		}, { refresh: true } )
			.then( ( response ) => response.data )
			.then( ( { data } ) => data.map( ( item ) => Kit.createFromResponse( item ) ) );
	}
}
