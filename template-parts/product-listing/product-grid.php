<?php
/**
 * Product Grid Section with Filters and Product Display
 *
 * Implements the two-column layout from Figma:
 * - Left: 206px filters sidebar (≈20%)
 * - Right: Product grid with 2-1-1-2 pattern (≈80%)
 *
 * @package wp_rig
 */

use function WP_Rig\WP_Rig\wp_rig;

global $wp_query;

$products       = $wp_query->posts;
$total_products = count( $products );
$has_products   = $wp_query->have_posts();
?>

<div class="plp-grid" data-node-id="694-1726">
	<div class="plp-grid__top" data-node-id="694-1727">
	<div class="plp-grid__top-row">
		<div class="plp-grid__count">
			<?php
			echo esc_html(
				sprintf(
					/* translators: %d: Number of products */
					_n( '%d PRODUCT', '%d PRODUCTS', $total_products, 'wp-rig' ),
					intval( $total_products )
				)
			);
			?>
		</div>
		</div>
		<button class="plp-grid__filter-toggle" data-node-id="694-1728">
			<?php esc_html_e( 'Add Filter', 'wp-rig' ); ?>
		</button>
	</div>
	<div class="plp-grid__divider"></div>
	</div>

	<div class="plp-grid__columns" data-node-id="694-1731">
		<!-- Filters Sidebar -->
		<?php get_template_part( 'template-parts/product-listing/filters-sidebar' ); ?>

		<!-- Product Grid Content -->
		<div class="plp-grid__content" data-node-id="694-1798">
			<?php if ( $has_products ) : ?>
				<?php
				// 2-up grid: all cards are half-width, 2 per row.
				$display_products = array_slice( $products, 0, 6 );
				$total_display    = count( $display_products );

				foreach ( $display_products as $index => $product_post ) :
					$product = wc_get_product( $product_post->ID );

					if ( ! $product ) {
						continue;
					}

					$is_even_index = ( 0 === $index % 2 );

					// Open row at the start of each pair.
					if ( $is_even_index ) :
						?>
					<div class="plp-grid__row plp-grid__row--2up">
						<?php
					endif;

					// Product data.
					$pid        = $product->get_id();
					$permalink  = get_permalink( $pid );
					$name       = $product->get_name();
					$price_html = $product->get_price_html();
					$atc_url    = $product->add_to_cart_url();

					// Product images — use srcset for Retina sharpness.
					$img_size    = 'woocommerce_single';
					$img_sizes   = '(max-width: 700px) 50vw, (max-width: 1024px) 33vw, 316px';
					$main_img_id = $product->get_image_id();
					$main_alt    = $main_img_id ? (string) get_post_meta( $main_img_id, '_wp_attachment_image_alt', true ) : $name;

					if ( $main_img_id ) {
						$main_img_html = wp_get_attachment_image(
							$main_img_id,
							$img_size,
							false,
							array(
								'class'   => 'plp-product__img',
								'alt'     => $main_alt ? $main_alt : $name,
								'loading' => 0 === $index ? 'eager' : 'lazy',
								'sizes'   => $img_sizes,
							)
						);
					} else {
						$main_img_html = sprintf(
							'<img class="plp-product__img" src="%s" alt="%s" loading="lazy" />',
							esc_url( wc_placeholder_img_src() ),
							esc_attr( $name )
						);
					}

					$gallery_ids    = $product->get_gallery_image_ids();
					$hover_img_html = '';
					if ( ! empty( $gallery_ids ) ) {
						$hover_img_html = wp_get_attachment_image(
							$gallery_ids[0],
							$img_size,
							false,
							array(
								'class'       => 'plp-product__img plp-product__img--hover',
								'alt'         => '',
								'loading'     => 'lazy',
								'aria-hidden' => 'true',
								'sizes'       => $img_sizes,
							)
						);
					}

					// Product metadata.
					$meta        = wp_rig()->get_product_meta( $pid );
					$french_text = $meta['french_text'] ?? '';
					$tagline     = $meta['caption'] ?? '';
					if ( ! $tagline ) {
						$tagline = wp_strip_all_tags( $product->get_short_description() );
					}

					$buy_amount = $meta['buy_box_amount'] ?? '';
					$buy_unit   = $meta['buy_box_unit'] ?? '';
					$size_label = trim( $buy_amount . $buy_unit );

					// Variant pills: size label + non-variation product attributes.
					$pills = array();
					if ( $size_label ) {
						$pills[] = strtoupper( $size_label );
					}
					foreach ( $product->get_attributes() as $attribute ) {
						if ( $attribute->is_taxonomy() && ! $attribute->get_variation() ) {
							$terms = wc_get_product_terms( $pid, $attribute->get_name(), array( 'fields' => 'names' ) );
							foreach ( $terms as $term_name ) {
								$pills[] = strtoupper( $term_name );
							}
						}
					}
					$pills = array_unique( $pills );
					?>

					<div class="plp-grid__item plp-grid__item--half">
						<!-- Image zone -->
						<div class="plp-product__img-zone">
							<a class="plp-product__img-link"
								href="<?php echo esc_url( $permalink ); ?>"
								aria-label="<?php echo esc_attr( $name ); ?>"></a>

							<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_get_attachment_image is trusted. ?>
							<?php echo $main_img_html; ?>

							<?php if ( $hover_img_html ) : ?>
								<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wp_get_attachment_image is trusted. ?>
								<?php echo $hover_img_html; ?>
							<?php endif; ?>

							<!-- ADD TO BAG bar -->
							<div class="plp-product__atb" data-plp-atb>
								<a class="plp-product__atb-link"
									href="<?php echo esc_url( $atc_url ); ?>"
									data-product-id="<?php echo esc_attr( $pid ); ?>"
									data-product-type="<?php echo esc_attr( $product->get_type() ); ?>">
									ADD TO BAG
								</a>
							</div>
						</div>

						<!-- Product info -->
						<div class="plp-product__info">
							<?php if ( ! empty( $pills ) ) : ?>
							<div class="plp-product__pills">
								<?php foreach ( $pills as $pill ) : ?>
								<span class="plp-product__pill"><?php echo esc_html( $pill ); ?></span>
								<?php endforeach; ?>
							</div>
							<?php endif; ?>

							<div class="plp-product__names">
								<a class="plp-product__name-link" href="<?php echo esc_url( $permalink ); ?>">
									<p class="plp-product__name"><?php echo esc_html( strtoupper( $name ) ); ?></p>
									<?php if ( $french_text ) : ?>
									<p class="plp-product__name-fr"><?php echo esc_html( strtoupper( $french_text ) ); ?></p>
									<?php endif; ?>
								</a>
							</div>

							<?php if ( $tagline ) : ?>
							<p class="plp-product__tagline"><?php echo esc_html( $tagline ); ?></p>
							<?php endif; ?>

							<div class="plp-product__price">
								<?php
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WooCommerce output is already escaped.
								echo $price_html;
								?>
							</div>
						</div><!-- .plp-product__info -->
					</div><!-- .plp-grid__item -->

					<?php
					// Close row after each pair, or after the last card when count is odd.
					$is_last = ( $index === $total_display - 1 );
					if ( ! $is_even_index || $is_last ) :
						?>
				</div><!-- .plp-grid__row -->
						<?php
				endif;

			endforeach;

				if ( count( $products ) > 6 ) :
					?>
				<!-- Show "Load More" button for additional products -->
				<div class="plp-grid__load-more">
					<a href="#" class="plp-grid__load-more-link">
						Load More Products
					</a>
				</div>
				<?php endif; ?>
			<?php else : ?>
				<!-- No products found message -->
				<div class="plp-grid__empty">
					<p class="plp-grid__empty-message">
						<?php esc_html_e( 'No products found matching your selection.', 'wp-rig' ); ?>
					</p>
				</div>
			<?php endif; ?>
		</div><!-- .plp-grid__content -->
	</div><!-- .plp-grid__columns -->
</div><!-- .plp-grid -->

<?php
// Always show FAQ section, even when there are no products.
get_template_part( 'template-parts/product-listing/faq-section' );
?>
