<?php

namespace Elementor\App\Services;

use Elementor\App\Services\Account\Account_Service;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

/**
 * @since 3.9.0
 */
class Services {
	public $account;

	public function __construct() {
		add_action( 'elementor/common/after_register_scripts', function () {
//			$this->register_services();
		} );
	}

	private function register_services() {
		$this->account = ( new Account_Service() )->register();

		do_action( 'elementor/app/services/register', $this );
	}
}
