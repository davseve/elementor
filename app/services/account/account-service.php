<?php
namespace Elementor\App\Services\Account;

use Elementor\Plugin;
use Elementor\App\Services\Service_Interface;

class Account_Service implements service_interface {
	/**
	 * @var mixed|string
	 */
	public $app;
	public $connect_app;
	public $connect;
	public $name;

	public function init() {
		if ( ! Plugin::$instance->common ) {
			return;
		}

		$this->connect_app = Plugin::$instance->common->get_component( 'connect' );
		return $this;
	}

	/**
	 * @access public
	 * @param string $app
	 * @return object
	 */
	public function get_subscription_plans( $app = '' ) {
		return $this->connect_app->get_subscription_plans( $app );
	}

	/**
	 * @return mixed
	 * @access public
	 */
	public function is_connected( $app = 'library' ) {
		return $this->connect_app->get_app( $app )->is_connected( $app );
	}

	/**
	 * @param $app
	 * @param $action
	 * @param $params
	 * @return mixed
	 */
	public function get_admin_url( $app, $action, $params ) {
		return $this->connect_app->get_app( $app )->get_admin_url( $action, $params );
	}
}
