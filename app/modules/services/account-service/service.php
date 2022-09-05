<?php
namespace Elementor\App\Modules\Services\Account_Service;

use Elementor\Plugin;

class Service {

	public $connect;
	public $connected_app;
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
		$this->connected_app = $connected_app;
		$this->connect = Plugin::$instance->common->get_component( 'connect' )->get_app( $this->connected_app );
	}
}
