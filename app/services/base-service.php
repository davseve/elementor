<?php
namespace Elementor\App\Services;

use Elementor\Plugin;

abstract class Base_service {

	public $connect;
	public $connected_app;
	/**
	 * Get service name.
	 *
	 * Retrieve the module name.
	 *
	 * @since 3.8.0
	 * @access public
	 * @abstract
	 *
	 * @return string service name.
	 */
	abstract public function get_name();

	public function __construct(...$connected_app) {
		$this->connected_app = $connected_app;
		$this->connect = Plugin::$instance->common->get_component( 'connect' )->get_app( $this->connected_app[0] );
	}
}
