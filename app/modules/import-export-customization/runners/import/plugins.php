<?php

namespace Elementor\App\Modules\ImportExportCustomization\Runners\Import;

use Elementor\Core\Utils\Collection;
use Elementor\Core\Utils\Plugins_Manager;
use Elementor\Core\Utils\Str;
use Elementor\Plugin;

class Plugins extends Import_Runner_Base {

	/**
	 * @var Plugins_Manager
	 */
	private $plugins_manager;

	public function __construct( $plugins_manager = null ) {
		if ( $plugins_manager ) {
			$this->plugins_manager = $plugins_manager;
		} else {
			$this->plugins_manager = new Plugins_Manager();
		}
	}

	public static function get_name(): string {
		return 'plugins';
	}

	public function should_import( array $data ) {
		return (
			isset( $data['include'] ) &&
			in_array( 'plugins', $data['include'], true ) &&
			! empty( $data['manifest']['plugins'] ) &&
			! empty( $data['selected_plugins'] )
		);
	}

	public function import( array $data, array $imported_data ) {
		$customization = $data['customization']['plugins'] ?? null;

		if ( $customization ) {
			$enabled_plugin_keys = Collection::make( $customization )->filter()->keys();

			$plugins = Collection::make( $data['selected_plugins'] )
				->filter( function( $plugin_data, $plugin_key ) use ( $enabled_plugin_keys ) {
					return $enabled_plugin_keys->contains( $plugin_data['plugin'] );
				} )
				->values();
		} else {
			$plugins = $data['selected_plugins'];
		}

		$plugins_collection = ( new Collection( $plugins ) )
			->map( function ( $item ) {
				if ( ! Str::ends_with( $item['plugin'], '.php' ) ) {
					$item['plugin'] .= '.php';
				}
				return $item;
			} );

		$installed_plugins = Plugin::$instance->wp->get_plugins()->keys()->all();

		$skipped_plugins = $plugins_collection
			->filter( function ( $item ) use ( $installed_plugins ) {
				return ! $this->can_import_plugin( $item['plugin'], $installed_plugins );
			} )
			->map( function ( $item ) {
				return $item['name'];
			} )
			->values();

		$plugins_collection = $plugins_collection->filter( function ( $item ) use ( $installed_plugins ) {
			return $this->can_import_plugin( $item['plugin'], $installed_plugins );
		} );

		$result['plugins'] = $this->install_and_activate( $plugins_collection );

		if ( ! empty( $skipped_plugins ) ) {
			$result['plugins_skipped'] = $skipped_plugins;
		}

		return $result;
	}

	private function install_and_activate( Collection $plugins_collection ): array {
		if ( $plugins_collection->is_empty() ) {
			return [];
		}

		$slugs = $plugins_collection
			->map( function ( $item ) {
				return $item['plugin'];
			} )
			->all();

		if ( ! function_exists( 'request_filesystem_credentials' ) ) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
			require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
		}

		$installed = $this->plugins_manager->install( $slugs );
		$activated = $this->plugins_manager->activate( $installed['succeeded'] );

		return $plugins_collection
			->filter( function ( $item ) use ( $activated ) {
				return in_array( $item['plugin'], $activated['succeeded'], true );
			} )
			->map( function ( $item ) {
				return $item['name'];
			} )
			->all();
	}

	private function can_import_plugin( string $slug, array $installed_plugins ): bool {
		if ( ! in_array( $slug, $installed_plugins, true ) ) {
			return current_user_can( 'install_plugins' ) && current_user_can( 'activate_plugins' );
		}

		if ( Plugin::$instance->wp->is_plugin_active( $slug ) ) {
			return true;
		}

		if ( ! current_user_can( 'activate_plugins' ) ) {
			return false;
		}

		return ! is_multisite() || current_user_can( 'manage_network_plugins' ) || ! is_network_only_plugin( $slug );
	}
}
