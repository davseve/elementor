<?php
namespace Elementor\App\Services\Account;

use Elementor\Plugin;
use Elementor\App\Services\Base_service;

class Account_Service extends Base_service {

	/**
	 * Get name.
	 *
	 * @access public
	 *
	 * @return string
	 */
	public function get_name() {
		return 'account_service';
	}

	public function get_subscription_plans( $app = '' ) {
		return Plugin::$instance->common->get_component( 'connect' )->get_subscription_plans( $app );
	}

	public function is_connected() {
		return $this->connect->is_connected();
	}

	public function get_admin_url( $action, $params ) {
		return $this->connect->get_admin_url( $action, $params );
	}

	public function __construct( $connected_app = 'library' ) {
		parent::__construct( $connected_app );
//		$this->connected_app = $connected_app;
//		$this->connect = Plugin::$instance->common->get_component( 'connect' )->get_app( $this->connected_app );
	}
}
