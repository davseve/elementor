export default class ConfigService {
	/**
	 * ConfigService
	 *
	 * @param {string} configPath
	 */

	get( app = '' ) {
		return new Promise( ( resolve, reject ) => {
			if ( elementorAppConfig.hasOwnProperty( app ) ) {
				resolve( elementorAppConfig[ app ] );
			} else if ( elementorAppConfig ) {
				resolve( elementorAppConfig );
			} else {
				resolve( console.error( 'Unable to retrieve elementorAppConfig object' ) );
			}
		} )
	}
}
