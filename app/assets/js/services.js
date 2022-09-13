import AccountService from 'elementor/app/services/account/account-service';

class Services {
	accountService = new AccountService();
}

const services = new Services();
window.elementorAppPackages = {
	...window.elementorAppPackages,
	services,
};

export default services;
