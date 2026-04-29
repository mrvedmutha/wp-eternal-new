<?php
/**
 * Template part: single post hero.
 *
 * Renders the full-width hero with the post's featured image, category eyebrow,
 * date, and title — matching Figma node 694:5002.
 *
 * Must be called inside the WordPress loop (after the_post()).
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Category eyebrow — first assigned category.
$categories  = get_the_category();
$primary_cat = ! empty( $categories ) ? $categories[0] : null;

// Date formatted as per Figma (e.g. "Skin Concerns | 02.03.2026").
$date_str = get_the_date( 'd.m.Y' );
$eyebrow  = '';
if ( $primary_cat ) {
	$eyebrow = $primary_cat->name . ' | ' . $date_str;
} else {
	$eyebrow = $date_str;
}

// Featured image.
$has_thumb = has_post_thumbnail();
$thumb_id  = get_post_thumbnail_id();
$thumb_url = $has_thumb ? esc_url( get_the_post_thumbnail_url( null, 'full' ) ) : '';
$thumb_alt = '';
if ( $thumb_id ) {
	$thumb_alt = get_post_meta( $thumb_id, '_wp_attachment_image_alt', true );
}
?>
<div class="post-hero">
	<?php if ( $thumb_url ) : ?>
	<img
		class="post-hero__bg"
		src="<?php echo $thumb_url; // phpcs:ignore ?>"
		alt="<?php echo esc_attr( $thumb_alt ); ?>"
		aria-hidden="<?php echo $thumb_alt ? 'false' : 'true'; ?>"
		decoding="async"
		fetchpriority="high"
	>
	<?php endif; ?>

	<div class="post-hero__overlay" aria-hidden="true"></div>

	<div class="post-hero__content">
		<?php if ( $eyebrow ) : ?>
		<span class="post-hero__eyebrow">
			<?php if ( $primary_cat ) : ?>
			<a href="<?php echo esc_url( get_category_link( $primary_cat ) ); ?>">
				<?php echo esc_html( $eyebrow ); ?>
			</a>
			<?php else : ?>
				<?php echo esc_html( $eyebrow ); ?>
			<?php endif; ?>
		</span>
		<?php endif; ?>

		<h1 class="post-hero__title"><?php the_title(); ?></h1>
	</div>
</div>
