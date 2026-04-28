<?php
/**
 * Blog Hero block — frontend render template.
 *
 * Variables provided by WordPress at include-time:
 *   $attributes (array)    Block attributes from block.json + editor input.
 *   $content    (string)   Inner blocks HTML (unused).
 *   $block      (WP_Block) Block instance.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes   = is_array( $attributes ?? null ) ? $attributes : array();
$heading      = $attributes['heading'] ?? __( 'The Eternal Journal', 'wp-rig' );
$subtitle     = $attributes['subtitle'] ?? '';
$cta_text     = $attributes['ctaText'] ?? __( 'SHOP NOW', 'wp-rig' );
$cta_url      = $attributes['ctaUrl'] ?? '/shop';
$bg_image_id  = (int) ( $attributes['bgImageId'] ?? 0 );
$bg_image_url = esc_url( $attributes['bgImageUrl'] ?? '' );
$bg_image_alt = $attributes['bgImageAlt'] ?? '';

// Prefer live attachment URL (handles media library moves).
if ( $bg_image_id ) {
	$live_url = wp_get_attachment_image_url( $bg_image_id, 'full' );
	if ( $live_url ) {
		$bg_image_url = esc_url( $live_url );
	}
	$live_alt = get_post_meta( $bg_image_id, '_wp_attachment_image_alt', true );
	if ( $live_alt ) {
		$bg_image_alt = $live_alt;
	}
}

$has_image = ! empty( $bg_image_url );
?>
<section class="blog-hero">
	<?php if ( $has_image ) : ?>
	<img
		class="blog-hero__bg"
		src="<?php echo esc_url( $bg_image_url ); ?>"
		alt="<?php echo esc_attr( $bg_image_alt ); ?>"
		aria-hidden="<?php echo $bg_image_alt ? 'false' : 'true'; ?>"
		decoding="async"
	>
	<?php endif; ?>

	<div class="blog-hero__content">
		<div class="blog-hero__text">
			<h1 class="blog-hero__heading"><?php echo esc_html( $heading ); ?></h1>
			<?php if ( $subtitle ) : ?>
			<p class="blog-hero__subtitle"><?php echo esc_html( $subtitle ); ?></p>
			<?php endif; ?>
		</div>

		<?php if ( $cta_text && $cta_url ) : ?>
		<a class="blog-hero__cta" href="<?php echo esc_url( $cta_url ); ?>">
			<span class="blog-hero__cta-label"><?php echo esc_html( $cta_text ); ?></span>
			<span class="blog-hero__cta-line" aria-hidden="true"></span>
		</a>
		<?php endif; ?>
	</div>
</section>
