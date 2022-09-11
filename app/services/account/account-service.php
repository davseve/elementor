<?php
namespace Elementor\App\Services\Account;

use Elementor\Plugin;
use Elementor\App\Services\Base_Service;

class Account_Service extends Base_Service {
	/**
	 * @var mixed|string
	 */
	public $app;
	public $connect_app;
	public $connect;

	/**
	 * Get name.
	 *
	 * @access public
	 *
	 * @return string
	 */
	public function get_name(): string {
		return 'account_service';
	}

//	public function init() {
//		$this->connect_app = Plugin::$instance->common->get_component( 'connect' );
//		$this->connect = $this->connect_app->get_app();
//	}

	/**
	 * @access public
	 * @param string $app
	 * @return object
	 */
	public function get_subscription_plans( $app = '' ): object {
		return $this->connect_app->get_subscription_plans( $app );
	}

	/**
	 * @return mixed
	 * @access public
	 */
//	public function is_connected() {
//		return $this->connect->is_connected();
//	}

	public function get_admin_url( $action, $params ) {
		return $this->connect->get_admin_url( $action, $params );
	}

	public function __construct( $app = 'library' ) {
		$this->app = $app;
	}
}
