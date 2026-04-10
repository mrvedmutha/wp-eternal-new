<?php
/**
 * Product Listing Header
 *
 * Displays breadcrumb, category title, and description for product category pages.
 *
 * @package wp_rig
 */

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Category name is safe.
$category = get_queried_object();

if ( ! $category ) {
	return;
}
?>

<div class="plp-header" data-node-id="694-1717">
	<div class="plp-header__inner">
		<?php if ( function_exists( 'woocommerce_breadcrumb' ) ) : ?>
		<div class="plp-breadcrumb" data-node-id="694-1719">
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

		<div class="plp-title-group" data-node-id="694-1721">
			<h1 class="plp-title" data-node-id="694-1722"><?php echo esc_html( $category->name ); ?></h1>

			<?php if ( ! empty( $category->description ) ) : ?>
			<div class="plp-description" data-node-id="694-1723">
				<?php
				// Allow paragraphs in description.
				echo wp_kses_post( $category->description );
				?>
			</div>
			<?php endif; ?>
		</div>
	</div>
</div>
