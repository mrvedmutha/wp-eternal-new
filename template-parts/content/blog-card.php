<?php
/**
 * Template part for a single blog card.
 *
 * Used inside WP_Query loops in blog-posts-grid/render.php,
 * category.php, and the AJAX handler in Blog_Posts_Grid/Component.php.
 * Requires the loop to have already called the_post() / setup_postdata().
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Primary category eyebrow (first assigned category).
$primary_cat     = '';
$post_categories = get_the_category();
if ( ! empty( $post_categories ) ) {
	$primary_cat = $post_categories[0]->name;
}

// Date formatted as DD.MM.YYYY per Figma design.
$date_formatted = get_the_date( 'd.m.Y' );

// Thumbnail.
$has_thumb = has_post_thumbnail();
?>
<article class="blog-card" id="post-<?php the_ID(); ?>">
	<a class="blog-card__thumb-link" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
		<div class="blog-card__thumb-wrap">
			<?php if ( $has_thumb ) : ?>
				<?php
				the_post_thumbnail(
					'blog-card-thumb',
					array(
						'class'   => 'blog-card__thumb',
						'loading' => 'lazy',
					)
				);
				?>
			<?php else : ?>
				<div class="blog-card__thumb blog-card__thumb--placeholder" aria-hidden="true"></div>
			<?php endif; ?>
		</div>
	</a>

	<div class="blog-card__body">
		<?php if ( $primary_cat ) : ?>
		<span class="blog-card__eyebrow"><?php echo esc_html( strtoupper( $primary_cat ) ); ?></span>
		<?php endif; ?>

		<h3 class="blog-card__title">
			<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
		</h3>

		<time class="blog-card__date" datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
			<?php echo esc_html( $date_formatted ); ?>
		</time>
	</div>
</article>
