<?php
/**
 * PDP — Editorial feature panel (sticky text + full-bleed image).
 *
 * Args:
 *   $args['feature'] array { image_id, image_url, heading, body }
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

use function WP_Rig\WP_Rig\wp_rig;

defined( 'ABSPATH' ) || exit;

$feature = isset( $args['feature'] ) ? $args['feature'] : array();

// Support both $args['feature'] (PDP context) and flat $args (block context).
if ( empty( $feature ) ) {
	$feature = $args;
}

if ( empty( $feature ) ) {
	return;
}

$image_id  = isset( $feature['image_id'] ) ? (int) $feature['image_id'] : 0;
$image_url = isset( $feature['image_url'] ) ? $feature['image_url'] : '';
$heading   = isset( $feature['heading'] ) ? $feature['heading'] : '';
$body      = isset( $feature['body'] ) ? $feature['body'] : '';
$hashtag   = isset( $feature['hashtag'] ) ? sanitize_text_field( $feature['hashtag'] ) : '';
$cta_label = isset( $feature['cta_label'] ) ? sanitize_text_field( $feature['cta_label'] ) : '';
$cta_url   = isset( $feature['cta_url'] ) ? esc_url( $feature['cta_url'] ) : '';

// Resolve image: prefer attachment, fall back to raw URL.
if ( $image_id > 0 ) {
	$img_tag = wp_get_attachment_image(
		$image_id,
		'full',
		false,
		array(
			'class'   => 'pdp-feature__img',
			'loading' => 'lazy',
			'alt'     => esc_attr( $heading ),
		)
	);
} elseif ( $image_url ) {
	$img_tag = '<img class="pdp-feature__img" src="' . esc_url( $image_url ) . '" alt="' . esc_attr( $heading ) . '" loading="lazy">';
} else {
	$img_tag = '';
}

// Convert body text: **bold** → <strong>, double newlines → <p> blocks.
$body_html = $body ? wp_kses_post( wp_rig()->parse_markdown_light( $body ) ) : '';
?>

<div class="pdp-feature">

	<div class="pdp-feature__text">

		<div class="pdp-feature__text-body">
			<?php if ( $hashtag ) : ?>
				<p class="pdp-feature__hashtag"><?php echo esc_html( $hashtag ); ?></p>
			<?php endif; ?>

			<?php if ( $heading ) : ?>
				<h3 class="pdp-feature__headline"><?php echo esc_html( $heading ); ?></h3>
			<?php endif; ?>

			<?php if ( $body_html ) : ?>
				<div class="pdp-feature__body">
					<?php echo $body_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- sanitized via wp_kses_post above ?>
				</div>
			<?php endif; ?>
		</div><!-- .pdp-feature__text-body -->

		<?php if ( $cta_label && $cta_url ) : ?>
			<div class="pdp-feature__cta">
				<a class="pdp-feature__cta-link" href="<?php echo $cta_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- esc_url applied above ?>">
					<?php echo esc_html( $cta_label ); ?>
				</a>
				<div class="pdp-feature__cta-line" aria-hidden="true"></div>
			</div>
		<?php endif; ?>

	</div><!-- .pdp-feature__text -->

	<?php if ( $img_tag ) : ?>
		<div class="pdp-feature__image">
			<?php echo $img_tag; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- escaped above ?>
		</div>
	<?php endif; ?>

</div><!-- .pdp-feature -->
