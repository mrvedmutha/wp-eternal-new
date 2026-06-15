<?php
/**
 * Single Product content — WooCommerce template override.
 *
 * Clears all default WooCommerce action hooks and rebuilds the PDP layout
 * using our own template parts.
 *
 * @package wp_rig
 * @see     woocommerce/templates/content-single-product.php
 */

namespace WP_Rig\WP_Rig;

defined( 'ABSPATH' ) || exit;

// Remove all default WooCommerce single-product output hooks.
remove_action( 'woocommerce_before_single_product', 'woocommerce_output_all_notices', 10 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_rating', 10 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_price', 10 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_add_to_cart', 30 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
remove_action( 'woocommerce_single_product_summary', 'woocommerce_template_single_sharing', 50 );
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_product_data_tabs', 10 );
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_upsell_display', 15 );
remove_action( 'woocommerce_after_single_product_summary', 'woocommerce_output_related_products', 20 );
remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_images', 20 );
remove_action( 'woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10 );

global $product;

if ( ! $product instanceof \WC_Product ) {
	$product = wc_get_product( get_the_ID() );
}

if ( ! $product ) {
	return;
}

// Gather shared data once; template parts read from these variables.
$meta  = wp_rig()->get_product_meta( get_the_ID() );
$plans = wp_rig()->get_supply_plans( get_the_ID() );

do_action( 'woocommerce_before_single_product' );

if ( post_password_required() ) {
	echo get_the_password_form(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	return;
}
?>

<article id="product-<?php the_ID(); ?>" <?php wc_product_class( 'pdp-article', $product ); ?>>

	<?php get_template_part( 'template-parts/product/part-pdp', 'breadcrumb', array( 'product' => $product ) ); ?>

	<div class="pdp-layout">

		<?php get_template_part( 'template-parts/product/part-pdp', 'gallery', array( 'product' => $product ) ); ?>

		<div class="pdp-right">

			<?php
			get_template_part(
				'template-parts/product/part-pdp',
				'buybox',
				array(
					'product' => $product,
					'meta'    => $meta,
					'plans'   => $plans,
				)
			);
			?>

		</div><!-- .pdp-right -->

	</div><!-- .pdp-layout -->

	<?php if ( ! empty( $meta['features'] ) ) : ?>
		<div class="pdp-features">
			<?php
			foreach ( $meta['features'] as $feature ) {
				get_template_part(
					'template-parts/product/part-pdp',
					'feature',
					array( 'feature' => $feature )
				);
			}
			?>
		</div><!-- .pdp-features -->
	<?php endif; ?>

	<?php
	// Key ingredients section.
	get_template_part(
		'template-parts/product/part-pdp',
		'ingredients',
		array( 'meta' => $meta )
	);
	?>

</article>

<?php
get_template_part(
	'template-parts/product/part-related',
	'products',
	array(
		'product' => $product,
		'context' => 'pdp',
	)
);
?>

<?php do_action( 'woocommerce_after_single_product' ); ?>
