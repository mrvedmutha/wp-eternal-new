<?php
/**
 * Image Editorial block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (unused — no inner blocks).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function WP_Rig\WP_Rig\wp_rig;

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$image_id  = (int) ( $attributes['imageId'] ?? 0 );
$image_url = $attributes['imageUrl'] ?? '';
$image_alt = $attributes['imageAlt'] ?? '';
$headline  = $attributes['headlineText'] ?? '';
$body_p1   = $attributes['bodyParagraph1'] ?? '';
$body_p2   = $attributes['bodyParagraph2'] ?? '';
$body_p3   = $attributes['bodyParagraph3'] ?? '';

// Prefer resolved WP attachment URL so media library moves don't break the image.
if ( $image_id ) {
	$resolved = wp_get_attachment_image_url( $image_id, 'full' );
	if ( $resolved ) {
		$image_url = $resolved;
	}
}

$wrapper_attrs = wp_rig()->block_wrapper_attributes( array( 'image-editorial' ), $attributes );
?>
<section <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>

	<?php if ( $image_url ) : ?>
	<figure class="image-editorial__image-wrap" aria-hidden="true">
		<img
			class="image-editorial__image"
			src="<?php echo esc_url( $image_url ); ?>"
			alt="<?php echo esc_attr( $image_alt ); ?>"
			decoding="async"
			loading="lazy"
		>
	</figure>
	<?php endif; ?>

	<div class="image-editorial__content">
		<div class="image-editorial__inner">

			<?php if ( $headline ) : ?>
			<h2 class="image-editorial__headline">
				<?php echo esc_html( $headline ); ?>
			</h2>
			<?php endif; ?>

			<div class="image-editorial__body">
				<?php if ( $body_p1 ) : ?>
				<p class="image-editorial__body-p"><?php echo esc_html( $body_p1 ); ?></p>
				<?php endif; ?>
				<?php if ( $body_p2 ) : ?>
				<p class="image-editorial__body-p"><?php echo esc_html( $body_p2 ); ?></p>
				<?php endif; ?>
				<?php if ( $body_p3 ) : ?>
				<p class="image-editorial__body-p"><?php echo esc_html( $body_p3 ); ?></p>
				<?php endif; ?>
			</div>

		</div>
	</div>

</section>
