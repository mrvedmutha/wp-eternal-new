<?php
/**
 * Ingredient Spotlight block — frontend render template.
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

$attributes      = is_array( $attributes ?? null ) ? $attributes : array();
$section_heading = $attributes['sectionHeading'] ?? __( 'Ingredient Spotlight', 'wp-rig' );
$image_id        = (int) ( $attributes['imageId'] ?? 0 );
$image_url       = esc_url( $attributes['imageUrl'] ?? '' );
$image_alt       = $attributes['imageAlt'] ?? '';
$article_title   = $attributes['articleTitle'] ?? '';
$body_text       = $attributes['bodyText'] ?? '';

// Prefer live attachment URL.
if ( $image_id ) {
	$live_url = wp_get_attachment_image_url( $image_id, 'full' );
	if ( $live_url ) {
		$image_url = esc_url( $live_url );
	}
	$live_alt = get_post_meta( $image_id, '_wp_attachment_image_alt', true );
	if ( $live_alt ) {
		$image_alt = $live_alt;
	}
}

$has_image = ! empty( $image_url );
?>
<section class="ingredient-spotlight">
	<div class="ingredient-spotlight__divider" aria-hidden="true"></div>

	<header class="ingredient-spotlight__header">
		<h2 class="ingredient-spotlight__label"><?php echo esc_html( $section_heading ); ?></h2>
	</header>

	<?php if ( $has_image ) : ?>
	<div class="ingredient-spotlight__image-wrap">
		<img
			class="ingredient-spotlight__image"
			src="<?php echo esc_url( $image_url ); ?>"
			alt="<?php echo esc_attr( $image_alt ); ?>"
			loading="lazy"
			decoding="async"
		>
	</div>
	<?php endif; ?>

	<div class="ingredient-spotlight__text">
		<?php if ( $article_title ) : ?>
		<p class="ingredient-spotlight__title"><?php echo esc_html( $article_title ); ?></p>
		<?php endif; ?>
		<?php if ( $body_text ) : ?>
		<p class="ingredient-spotlight__body"><?php echo esc_html( $body_text ); ?></p>
		<?php endif; ?>
	</div>
</section>
