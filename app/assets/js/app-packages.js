/**
 * Temporary solution for share components.
 * TODO.
 */

// Make router available for use within packages.
import router from './router';
import services from './services';

// Alphabetical order.
import { appUi, components, hooks } from './package';
import siteEditor from '../../modules/site-editor/assets/js/package';

window.elementorAppPackages = {
	appUi,
	components,
	hooks,
	router,
	services,
	siteEditor,
};
