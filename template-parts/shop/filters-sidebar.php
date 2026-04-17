<?php
/**
 * Shop Sort Dropdown - Simplified sort functionality only
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Get current orderby from query.
// @phpcs:disable WordPress.Security.ValidatedSanitizedInput,WordPress.WP.GlobalVariablesOverride,WordPress.CSRF.NonceVerification.NoNonceVerification
$orderby = isset( $_GET['orderby'] ) ? wc_clean( wp_unslash( $_GET['orderby'] ) ) : apply_filters( 'woocommerce_default_catalog_orderby', get_option( 'woocommerce_default_catalog_orderby' ) );
// @phpcs:enable

// Sort options.
$sort_options = apply_filters(
	'woocommerce_catalog_orderby',
	array(
		'menu_order' => __( 'Popularity', 'wp-rig' ),
		'popularity' => __( 'Best selling', 'wp-rig' ),
		'date'       => __( 'Newness', 'wp-rig' ),
		'price'      => __( 'Price: low to high', 'wp-rig' ),
		'price-desc' => __( 'Price: high to low', 'wp-rig' ),
	)
);
?>
<aside class="shop-filters" data-node-id="694-1732">
	<div class="shop-filters__inner">
		<div class="shop-filters__header">
			<span class="shop-filters__sort-label">SORT BY:</span>
			<div class="shop-filters__sort">
				<span class="shop-filters__sort-value" id="shop-sort-value">
					<?php echo esc_html( $sort_options[ $orderby ] ?? $sort_options['menu_order'] ); ?>
				</span>
			</div>
		</div>

		<div class="shop-filters__sort-dropdown">
			<form method="get" class="shop-filters__sort-form">
				<?php foreach ( $sort_options as $value => $label ) : ?>
					<a href="<?php echo esc_url( add_query_arg( 'orderby', $value ) ); ?>"
						class="shop-filters__sort-option <?php echo $orderby === $value ? 'shop-filters__sort-option--active' : ''; ?>"
						data-orderby="<?php echo esc_attr( $value ); ?>">
						<?php echo esc_html( $label ); ?>
					</a>
				<?php endforeach; ?>
			</form>
		</div>
	</div>
</aside>
