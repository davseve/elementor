<?php
namespace Elementor\App\Services;

use Elementor\App\Services\Service_Interface;

abstract class Base_Service implements Service_Interface {
	public static $service = null;

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
}
