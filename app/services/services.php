<?php

namespace Elementor\App\Services;

use Elementor\App\Services\Account\Account_Service;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Services {
	/**
	 * @var Account_Service
	 */
	public $account;

	private function resister_services() {
		$this->account = ( new Account_Service() )->init();

		do_action( 'elementor/app/services/register', $this );
	}

	public function __construct() {
		add_action( 'elementor/init', function () {
			$this->resister_services();
		} );
	}
}
