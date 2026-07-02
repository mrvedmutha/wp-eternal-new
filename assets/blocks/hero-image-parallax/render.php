<?php
/**
 * Hero Image Parallax block — frontend render template.
 *
 * Image-only hero section, fixed 668px height (see _hero-image-parallax.css),
 * with GSAP scroll parallax handled by src/view.js.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes = is_array( $attributes ?? null ) ? $attributes : array();

$hero_image_id         = (int) ( $attributes['heroImageId'] ?? 0 );
$hero_image_url        = $attributes['heroImageUrl'] ?? '';
$hero_mobile_image_id  = (int) ( $attributes['heroMobileImageId'] ?? 0 );
$hero_mobile_image_url = $attributes['heroMobileImageUrl'] ?? '';

// Prefer full WP attachment URL over stored URL (handles media library moves).
if ( $hero_image_id ) {
	$attachment_url = wp_get_attachment_image_url( $hero_image_id, 'full' );
	if ( $attachment_url ) {
		$hero_image_url = $attachment_url;
	}
}

if ( $hero_mobile_image_id ) {
	$mobile_attachment_url = wp_get_attachment_image_url( $hero_mobile_image_id, 'full' );
	if ( $mobile_attachment_url ) {
		$hero_mobile_image_url = $mobile_attachment_url;
	}
}

$has_desktop  = ! empty( $hero_image_url );
$has_mobile   = ! empty( $hero_mobile_image_url );
$fallback_url = $has_desktop ? $hero_image_url : $hero_mobile_image_url;

if ( ! $has_desktop && ! $has_mobile ) {
	return;
}

?>
<section class="hero-image-parallax">
	<picture>
		<?php if ( $has_mobile ) : ?>
		<source
			media="(max-width: 1024px)"
			srcset="<?php echo esc_url( $hero_mobile_image_url ); ?>"
		>
		<?php endif; ?>
		<img
			class="hero-image-parallax__bg"
			src="<?php echo esc_url( $fallback_url ); ?>"
			alt=""
			aria-hidden="true"
			decoding="async"
		>
	</picture>
</section>
