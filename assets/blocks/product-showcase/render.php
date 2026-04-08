<?php
/**
 * Product Showcase block — frontend render.
 *
 * Passes block attributes into the shared related-products template part.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'wc_get_products' ) ) {
	return;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

get_template_part(
	'template-parts/product/part-related-products',
	null,
	array(
		'context'  => 'general',
		'heading'  => $attributes['heading'] ?? __( 'Explore Our Collection', 'wp-rig' ),
		'body'     => $attributes['body'] ?? '',
		'orderby'  => $attributes['orderby'] ?? 'rand',
		'category' => $attributes['category'] ?? '',
		'limit'    => isset( $attributes['limit'] ) ? (int) $attributes['limit'] : 9,
	)
);
