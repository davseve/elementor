export default class ConfigService {
	/**
	 * ConfigService
	 *
	 * @param {string} configPath
	 */

	get( app ) {
		if ( elementorAppConfig[ app ] ) {
			return elementorAppConfig[ app ];
		}
		return elementorAppConfig;
	}
}
