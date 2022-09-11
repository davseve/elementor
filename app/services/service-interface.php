<?php
namespace Elementor\App\Services;

interface Service_Interface {
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
	public function get_name(): string;
}
