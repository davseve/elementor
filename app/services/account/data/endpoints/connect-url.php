<?php
namespace Elementor\App\Services\Account\Data\Endpoints;

use Elementor\Plugin;
use Elementor\Data\V2\Base\Endpoint;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Connect_Url extends Endpoint {
	public function get_name() {
		return 'connect-url';
	}

	public function get_format() {
		return 'account/connect-url';
	}

	public function get_item( $id, $request ) {
		$connect = Plugin::$instance->common->get_component( 'connect' );

		return [
			'connect-url' => $connect->get_app( 'activate' )->get_admin_url( 'authorize', [
				'utm_source' => 'import-export',
				'utm_medium' => 'wp-dash',
				'utm_campaign' => 'library-connect',
				'utm_term' => '%%page%%', // Will be replaced in the frontend.
			] ),
		];
	}
}
