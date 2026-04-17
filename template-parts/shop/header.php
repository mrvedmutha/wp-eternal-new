<?php
/**
 * Shop Page Header
 *
 * Displays breadcrumb, shop title, and combined category context.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="shop-header" data-node-id="694-1717">
	<div class="shop-header__inner">
		<?php if ( function_exists( 'woocommerce_breadcrumb' ) ) : ?>
		<div class="shop-breadcrumb" data-node-id="694-1719">
			<?php
			$breadcrumbs = woocommerce_breadcrumb(
				array(
					'delimiter'   => ' / ',
					'wrap_before' => '<nav class="woocommerce-breadcrumb">',
					'wrap_after'  => '</nav>',
					'before'      => '',
					'after'       => '',
					'home'        => _x( 'HOME', 'breadcrumb', 'wp-rig' ),
				),
				false
			);
			?>
		</div>
		<?php endif; ?>

		<div class="shop-title-group" data-node-id="694-1721">
			<h1 class="shop-title" data-node-id="694-1722">SHOP</h1>

			<div class="shop-description" data-node-id="694-1723">
				<p>
					Explore our complete collection of Swiss-formulated skincare and nutraceuticals.
					From hydrating face crèmes to essential oils, each product is designed to support
					your journey to timeless beauty and wellness.
				</p>
			</div>
		</div>
	</div>
</div>
