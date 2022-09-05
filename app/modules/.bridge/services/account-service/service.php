<?php
namespace Elementor\App\Modules\Services\Account_Service;

use Elementor\Plugin;

class Service {

	public $connect;
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

	public function get_subscription_plans() {
		return Plugin::$instance->common->get_component( 'connect' )->get_subscription_plans( 'kit-library' );
	}

	public function is_connected() {
		return $this->connect->is_connected();
	}

	public function get_admin_url( $method, $params ) {
		return $this->connect->get_admin_url( $method, $params );
	}

	public function app_connect( $app_name = 'connect' ) {
		/** @var $bridge $$bridge */
		return $this->connect()->get_app( $app_name );
	}

	public function __construct() {
		$this->connect = Plugin::$instance->common->get_component( 'connect' )->get_app( 'library' );
	}
}
