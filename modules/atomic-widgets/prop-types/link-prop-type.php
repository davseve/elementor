<?php

namespace Elementor\Modules\AtomicWidgets\PropTypes;

use Elementor\Modules\AtomicWidgets\PropDependencies\Manager as Dependency_Manager;
use Elementor\Modules\AtomicWidgets\PropTypes\Base\Object_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Primitives\Boolean_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropTypes\Primitives\String_Prop_Type;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Link_Prop_Type extends Object_Prop_Type {
	public const DEFAULT_TAG = 'a';

	public static function get_key(): string {
		return 'link';
	}

	public static function sanitize_destination( $destination ) {
		if ( is_array( $destination ) && 'url' === ( $destination['$$type'] ?? '' ) && is_string( $destination['value'] ?? null ) ) {
			$destination['value'] = self::sanitize_url_destination( $destination['value'] );

			return $destination;
		}

		if ( ! is_string( $destination ) ) {
			return $destination;
		}

		return self::sanitize_url_destination( $destination );
	}

	private static function sanitize_url_destination( string $destination ): string {
		if ( is_numeric( $destination ) ) {
			return $destination;
		}

		return esc_url_raw( $destination );
	}

	protected function define_shape(): array {
		$target_blank_dependencies = Dependency_Manager::make()
			->where( [
				'operator' => 'exists',
				'path' => [ 'link', 'destination' ],
			] )
			->get();

		$tag_dependencies = Dependency_Manager::make()
			->where( [
				'operator' => 'ne',
				'path' => [ 'link', 'destination' ],
				'nestedPath' => [ 'group' ],
				'value' => 'action',
				'newValue' => String_Prop_Type::generate( 'button' ),
			] )->get();

		return [
			'destination' => Union_Prop_Type::make()
				->add_prop_type( Url_Prop_Type::make()->skip_validation() )
				->add_prop_type( Query_Prop_Type::make() ),
			'isTargetBlank' => Boolean_Prop_Type::make()
				->set_dependencies( $target_blank_dependencies ),
			'tag' => String_Prop_Type::make()
				->enum( [ 'a', 'button' ] )
				->default( self::DEFAULT_TAG )
				->set_dependencies( $tag_dependencies ),
		];
	}
}
