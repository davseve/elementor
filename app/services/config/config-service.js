export default class ConfigService {
	/**
	 * ConfigService
	 *
	 * @param {string} configPath
	 */

	get( app ) {
		return new Promise( ( resolve, reject ) => {
			if ( elementorAppConfig[ app ] ) {
				resolve( elementorAppConfig[ app ] );
			}
		} )
	}
}
