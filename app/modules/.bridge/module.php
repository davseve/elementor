<?php
namespace Elementor\App\Modules\Bridge;

use Elementor\Core\Base\Module as BaseModule;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Module extends BaseModule {

	public function get_name() {
		'bridge';
	}

	public function __construct() {

	}
}
