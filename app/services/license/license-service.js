export default class AppsLicenseService extends $e.modules.ComponentBase {
	getNamespace() {
		return 'apps/license';
	}

	isActive() {
		return Promise.resolve( false );
	}

	isExpired() {
		return Promise.resolve( false );
	}

	isValid() {
		return this.isActive()
			.then( () => false );
	}
}
