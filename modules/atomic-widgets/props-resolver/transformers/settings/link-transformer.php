<?php

namespace Elementor\Modules\AtomicWidgets\PropsResolver\Transformers\Settings;

use Elementor\Modules\AtomicWidgets\PropTypes\Link_Prop_Type;
use Elementor\Modules\AtomicWidgets\PropsResolver\Props_Resolver_Context;
use Elementor\Modules\AtomicWidgets\PropsResolver\Transformer_Base;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

class Link_Transformer extends Transformer_Base {
	public function transform( $value, Props_Resolver_Context $context ): ?array {
		$url = $this->extract_url( $value );

		$link_attrs = [
			'href' => $url,
			'target' => $value['isTargetBlank'] ? '_blank' : '_self',
			'tag' => $url && 'button' === $value['tag'] ? 'button' : 'a',
		];

		return array_filter( $link_attrs );
	}

	private function extract_url( $value ): ?string {
		if ( ! array_key_exists( 'destination', $value ) ) {
			return null;
		}

		$destination = Link_Prop_Type::sanitize_destination( $value['destination'] );

		if ( is_numeric( $destination ) ) {
			$post = get_post( $destination );

			if ( ! $post ) {
				return (string) $destination;
			}

			$permalink = get_permalink( $post );

			return is_string( $permalink ) && '' !== $permalink ? $permalink : null;
		}

		if ( ! is_string( $destination ) || '' === $destination ) {
			return null;
		}

		return $destination;
	}
}
