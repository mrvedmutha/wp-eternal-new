<?php
/**
 * Related Products section.
 *
 * Reusable across PDP, homepage, and other pages.
 *
 * PDP context:  pulls up to 9 products from the same category, excludes current product.
 * Other pages:  pulls up to 9 products from all categories (random).
 *
 * Args:
 *   $args['heading']  string      Optional. Section heading. Defaults by context.
 *   $args['product']  WC_Product  Optional. Passed automatically from PDP template.
 *   $args['context']  string      Optional. 'pdp'|'general'. Auto-detected if omitted.
 *   $args['limit']    int         Optional. Max products. Defaults to 9.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

use function WP_Rig\WP_Rig\wp_rig;

if ( ! function_exists( 'wc_get_products' ) ) {
	return;
}

$context      = isset( $args['context'] ) ? $args['context'] : ( is_product() ? 'pdp' : 'general' );
$limit        = isset( $args['limit'] ) ? (int) $args['limit'] : 9;
$orderby_arg  = isset( $args['orderby'] ) ? $args['orderby'] : 'rand';
$category_arg = isset( $args['category'] ) ? (string) $args['category'] : '';

// ─── Build product query ──────────────────────────────────────────────────────

$query_args  = array(
	'limit'  => $limit,
	'status' => 'publish',
);
$exclude_ids = array();

// ── Special filter types: on_sale / featured ──────────────────────────────────

if ( 'on_sale' === $orderby_arg ) {
	$sale_ids = wc_get_product_ids_on_sale();
	if ( empty( $sale_ids ) ) {
		return;
	}
	shuffle( $sale_ids );
	$query_args['include'] = array_slice( $sale_ids, 0, $limit );
	$query_args['orderby'] = 'include';
} elseif ( 'featured' === $orderby_arg ) {
	$query_args['featured'] = true;
	$query_args['orderby']  = 'rand';
} else {
	$query_args['orderby'] = $orderby_arg;
}

// ── Context-specific adjustments ─────────────────────────────────────────────

if ( 'pdp' === $context ) {
	/** @var \WC_Product|null $current_product */
	$current_product = isset( $args['product'] ) ? $args['product'] : wc_get_product( get_the_ID() );

	if ( ! $current_product ) {
		return;
	}

	$exclude_ids           = array( $current_product->get_id() );
	$query_args['exclude'] = $exclude_ids;

	$cat_slugs = wc_get_product_terms( $current_product->get_id(), 'product_cat', array( 'fields' => 'slugs' ) );
	if ( ! empty( $cat_slugs ) ) {
		$query_args['category'] = $cat_slugs;
	}

	$default_heading = 'Explore Other Skincare Essentials';
} else {
	// Block / general context: apply optional category filter.
	if ( $category_arg ) {
		$query_args['category'] = array( $category_arg );
	}

	$default_heading = 'Explore Our Collection';
}

$heading = isset( $args['heading'] ) ? $args['heading'] : $default_heading;

$related = wc_get_products( $query_args );

if ( empty( $related ) ) {
	return;
}

// ─── Group products into pages of 3 for the slider ───────────────────────────
$pages       = array_chunk( $related, 3 );
$total_pages = count( $pages );
?>

<section class="related-products" data-related-products>
	<div class="related-products__inner">

		<div class="related-products__header">
			<h2 class="related-products__heading"><?php echo esc_html( $heading ); ?></h2>
		</div>

		<div class="related-products__slider-wrap" data-rp-wrap>
			<div class="related-products__track" data-rp-track>

				<?php foreach ( $pages as $page_index => $page_products ) : ?>
				<div class="related-products__page" data-rp-page>

					<?php foreach ( $page_products as $rel_product ) :
						$pid        = $rel_product->get_id();
						$permalink  = get_permalink( $pid );
						$name       = $rel_product->get_name();
						$price_html = $rel_product->get_price_html();
						$atc_url    = $rel_product->add_to_cart_url();

						// Images
						$main_img_id  = $rel_product->get_image_id();
						$main_src     = $main_img_id ? wp_get_attachment_image_src( $main_img_id, 'woocommerce_single' ) : null;
						$main_url     = $main_src ? $main_src[0] : wc_placeholder_img_src( 'woocommerce_single' );
						$main_alt     = $main_img_id ? (string) get_post_meta( $main_img_id, '_wp_attachment_image_alt', true ) : $name;

						$gallery_ids   = $rel_product->get_gallery_image_ids();
						$hover_url     = '';
						if ( ! empty( $gallery_ids ) ) {
							$hover_src = wp_get_attachment_image_src( $gallery_ids[0], 'woocommerce_single' );
							$hover_url = $hover_src ? $hover_src[0] : '';
						}

						// Meta
						$meta        = wp_rig()->get_product_meta( $pid );
						$french_text = $meta['french_text'] ?? '';
						$tagline     = $meta['caption'] ?? '';
						if ( ! $tagline ) {
							$tagline = wp_strip_all_tags( $rel_product->get_short_description() );
						}

						$buy_amount = $meta['buy_box_amount'] ?? '';
						$buy_unit   = $meta['buy_box_unit'] ?? '';
						$size_label = trim( $buy_amount . $buy_unit );

						// Variant pills: size label + non-variation product attributes
						$pills      = array();
						if ( $size_label ) {
							$pills[] = strtoupper( $size_label );
						}
						foreach ( $rel_product->get_attributes() as $attribute ) {
							if ( $attribute->is_taxonomy() && ! $attribute->get_variation() ) {
								$terms = wc_get_product_terms( $pid, $attribute->get_name(), array( 'fields' => 'names' ) );
								foreach ( $terms as $term_name ) {
									$pills[] = strtoupper( $term_name );
								}
							}
						}
						$pills = array_unique( $pills );
					?>

					<div class="related-products__card" data-rp-card>

						<!-- Image zone -->
						<div class="related-products__img-zone" data-rp-hover>

							<!-- Full-zone transparent link (image click → product page) -->
							<a class="related-products__img-zone-link"
							   href="<?php echo esc_url( $permalink ); ?>"
							   aria-label="<?php echo esc_attr( $name ); ?>"
							   tabindex="0"></a>

							<img class="related-products__img related-products__img--main"
								 src="<?php echo esc_url( $main_url ); ?>"
								 alt="<?php echo esc_attr( $main_alt ?: $name ); ?>"
								 width="316" height="423" loading="lazy" />

							<?php if ( $hover_url ) : ?>
							<img class="related-products__img related-products__img--hover"
								 src="<?php echo esc_url( $hover_url ); ?>"
								 alt="" width="316" height="423"
								 loading="lazy" aria-hidden="true" />
							<?php endif; ?>

							<!-- ADD TO BAG bar (desktop hover, GSAP-animated) -->
							<div class="related-products__atb" data-rp-atb>
								<a class="related-products__atb-link"
								   href="<?php echo esc_url( $atc_url ); ?>"
								   data-product-id="<?php echo esc_attr( $pid ); ?>"
								   data-product-type="<?php echo esc_attr( $rel_product->get_type() ); ?>">
									ADD TO BAG
								</a>
							</div>

						</div><!-- .related-products__img-zone -->

						<!-- Product info -->
						<div class="related-products__info">

							<?php if ( ! empty( $pills ) ) : ?>
							<div class="related-products__pills">
								<?php foreach ( $pills as $pill ) : ?>
								<span class="related-products__pill"><?php echo esc_html( $pill ); ?></span>
								<?php endforeach; ?>
							</div>
							<?php endif; ?>

							<div class="related-products__names">
								<a class="related-products__name-link" href="<?php echo esc_url( $permalink ); ?>">
									<p class="related-products__name"><?php echo esc_html( strtoupper( $name ) ); ?></p>
									<?php if ( $french_text ) : ?>
									<p class="related-products__name-fr"><?php echo esc_html( strtoupper( $french_text ) ); ?></p>
									<?php endif; ?>
								</a>
							</div>

							<?php if ( $tagline ) : ?>
							<p class="related-products__tagline"><?php echo esc_html( $tagline ); ?></p>
							<?php endif; ?>

							<div class="related-products__price">
								<?php echo $price_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped — WC output ?>
							</div>

						</div><!-- .related-products__info -->

					</div><!-- .related-products__card -->

					<?php endforeach; ?>

				</div><!-- .related-products__page -->
				<?php endforeach; ?>

			</div><!-- .related-products__track -->
		</div><!-- .related-products__slider-wrap -->

		<?php if ( $total_pages > 1 ) : ?>
		<div class="related-products__dots" data-rp-dots role="tablist" aria-label="Product slides">
			<?php for ( $i = 0; $i < $total_pages; $i++ ) : ?>
			<button class="related-products__dot<?php echo 0 === $i ? ' is-active' : ''; ?>"
					data-rp-dot="<?php echo esc_attr( $i ); ?>"
					role="tab"
					aria-label="Slide <?php echo esc_attr( $i + 1 ); ?>"
					aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>">
			</button>
			<?php endfor; ?>
		</div>
		<?php endif; ?>

	</div><!-- .related-products__inner -->
</section><!-- .related-products -->
