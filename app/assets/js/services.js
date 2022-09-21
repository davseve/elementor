import AccountService from 'elementor/app/services/account/account-service';
import ConfigService from 'elementor/app/services/config/config-service';

class Services {
	accountService = new AccountService();
	configService = new ConfigService();
}

const services = new Services();
// window.elementorAppPackages = {
// 	...window.elementorAppPackages,
// 	services,
// };

export default services;
