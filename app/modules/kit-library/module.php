<?php
namespace Elementor\App\Modules\KitLibrary;

use Elementor\Core\Admin\Menu\Main as MainMenu;
use Elementor\Plugin;
use Elementor\TemplateLibrary\Source_Local;
use Elementor\Core\Base\Module as BaseModule;
use Elementor\App\Modules\KitLibrary\Connect\Kit_Library;
use Elementor\Core\Common\Modules\Connect\Module as ConnectModule;
use Elementor\App\Modules\KitLibrary\Data\Kits\Controller as Kits_Controller;
use Elementor\App\Modules\KitLibrary\Data\Taxonomies\Controller as Taxonomies_Controller;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

class Module extends BaseModule {

	private $account_service;

	/**
	 * Get name.
	 *
	 * @access public
	 *
	 * @return string
	 */
	public function get_name() {
		return 'kit-library';
	}

	private function register_admin_menu( MainMenu $menu ) {
		$menu->add_submenu( [
			'page_title' => __( 'Kit Library', 'elementor' ),
			'menu_title' => '<span id="e-admin-menu__kit-library">' . __( 'Kit Library', 'elementor' ) . '</span>',
			'menu_slug' => Plugin::$instance->app->get_base_url() . '#/kit-library',
			'index' => 40,
		] );
	}

	/**
	 * Register the admin menu the old way.
	 */
	private function register_admin_menu_legacy() {
		add_submenu_page(
			Source_Local::ADMIN_MENU_SLUG,
			__( 'Kit Library', 'elementor' ),
			__( 'Kit Library', 'elementor' ),
			'manage_options',
			Plugin::$instance->app->get_base_url() . '#/kit-library'
		);
	}

	private function set_kit_library_settings() {
		if ( ! Plugin::$instance->common ) {
			return;
		}

		Plugin::$instance->app->set_settings( 'kit-library', [
			'has_access_to_module' => current_user_can( 'administrator' ),
			'subscription_plans' => $this->account_service->get_subscription_plans( 'kit-library' ),
			'is_pro' => false,
			'is_library_connected' => $this->account_service->is_connected( 'kit-library' ),
			'library_connect_url'  => $this->account_service->get_admin_url( 'kit-library', 'authorize', [
				'utm_source' => 'kit-library',
				'utm_medium' => 'wp-dash',
				'utm_campaign' => 'library-connect',
				'utm_term' => '%%page%%', // Will be replaced in the frontend.
			] ),
			'access_level' => ConnectModule::ACCESS_LEVEL_CORE,
		] );
	}

	public function init() {
		$this->account_service = Plugin::$instance->app->services->account;
	}

	/**
	 * Module constructor.
	 */
	public function __construct() {
		Plugin::$instance->data_manager_v2->register_controller( new Kits_Controller() );
		Plugin::$instance->data_manager_v2->register_controller( new Taxonomies_Controller() );

		if ( Plugin::$instance->experiments->is_feature_active( 'admin_menu_rearrangement' ) ) {
			add_action( 'elementor/admin/menu_registered/elementor', function( MainMenu $menu ) {
				$this->register_admin_menu( $menu );
			} );
		} else {
			add_action( 'admin_menu', function() {
				$this->register_admin_menu_legacy();
			}, 50 /* after Elementor page */ );
		}

		add_action( 'elementor/connect/apps/register', function ( ConnectModule $connect_module ) {
			$connect_module->register_app( 'kit-library', Kit_Library::get_class_name() );
		} );

		add_action( 'elementor/init', function () {
			$this->init();
			$this->set_kit_library_settings();
		}, 12 /** after the initiation of the connect kit library */ );
	}
}
