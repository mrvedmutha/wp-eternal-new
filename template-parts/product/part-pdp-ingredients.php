<?php
/**
 * PDP — Key ingredients section.
 *
 * Only renders if at least one ingredient is configured.
 *
 * Args:
 *   $args['meta'] array — from wp_rig()->get_product_meta()
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

$meta          = isset( $args['meta'] ) ? $args['meta'] : array();
$ingredients   = isset( $meta['key_ingredients'] ) ? $meta['key_ingredients'] : array();
$section_title = isset( $meta['ingredients_title'] ) ? $meta['ingredients_title'] : '';

if ( empty( $ingredients ) ) {
	return;
}

$count         = count( $ingredients );
$has_title     = ! empty( $section_title );
$section_class = 'pdp-ingredients' . ( $has_title ? ' pdp-ingredients--tinted' : '' );
?>

<section class="<?php echo esc_attr( $section_class ); ?>">

	<?php if ( $has_title ) : ?>
		<h2 class="pdp-ingredients__title"><?php echo esc_html( $section_title ); ?></h2>
	<?php endif; ?>

	<div class="pdp-ingredients__slider-wrap">

		<div class="pdp-ingredients__grid pdp-ingredients__grid--<?php echo esc_attr( $count ); ?>col" data-ingredients-track>

			<?php
			foreach ( $ingredients as $ingredient ) :
				$image_id  = isset( $ingredient['image_id'] ) ? (int) $ingredient['image_id'] : 0;
				$image_url = isset( $ingredient['image_url'] ) ? $ingredient['image_url'] : '';
				$name      = isset( $ingredient['name'] ) ? $ingredient['name'] : '';
				$desc      = isset( $ingredient['description'] ) ? $ingredient['description'] : '';
				?>
				<div class="pdp-ingredients__card">

					<div class="pdp-ingredients__img">
						<?php if ( $image_id > 0 ) : ?>
							<?php
							echo wp_get_attachment_image(
								$image_id,
								'large',
								false,
								array(
									'loading' => 'lazy',
									'alt'     => esc_attr( $name ),
								)
							); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							?>
						<?php elseif ( $image_url ) : ?>
							<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $name ); ?>" loading="lazy">
						<?php endif; ?>
						<!-- If neither: placeholder bg from CSS -->
					</div><!-- .pdp-ingredients__img -->

					<?php if ( $name ) : ?>
						<p class="pdp-ingredients__name"><?php echo esc_html( $name ); ?></p>
					<?php endif; ?>

					<?php if ( $desc ) : ?>
						<p class="pdp-ingredients__desc"><?php echo esc_html( $desc ); ?></p>
					<?php endif; ?>

				</div><!-- .pdp-ingredients__card -->
			<?php endforeach; ?>

		</div><!-- .pdp-ingredients__grid -->

	</div><!-- .pdp-ingredients__slider-wrap -->

	<?php if ( $count > 1 ) : ?>
	<div class="pdp-ingredients__slider-nav" data-ingredients-nav>
		<button class="pdp-ingredients__slider-btn pdp-ingredients__slider-btn--prev" data-ingredients-prev aria-label="Previous ingredient">
			<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M9 1L1 9L9 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
		<div class="pdp-ingredients__slider-progress">
			<span class="pdp-ingredients__slider-fill" data-ingredients-fill style="width:<?php echo esc_attr( round( 1 / $count * 100, 2 ) ); ?>%"></span>
		</div>
		<button class="pdp-ingredients__slider-btn pdp-ingredients__slider-btn--next" data-ingredients-next aria-label="Next ingredient">
			<svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M1 1L9 9L1 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	</div><!-- .pdp-ingredients__slider-nav -->
	<?php endif; ?>

</section><!-- .pdp-ingredients -->
