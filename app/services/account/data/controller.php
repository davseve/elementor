<?php
namespace Elementor\App\Services\Account\Data;

use Elementor\Data\V2\Base\Controller as Controller_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Controller extends Controller_Base {

	public function get_name() {
		return 'connect-url';
	}

	public function register_endpoints() {
		$this->register_endpoint( new Endpoints\Connect_Url( $this ) );
	}
}
