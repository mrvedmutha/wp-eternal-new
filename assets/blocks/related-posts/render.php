<?php
/**
 * Related Posts block — frontend render template.
 *
 * On single posts: passes category term IDs so the view script fetches
 * related posts. On all other contexts: passes mode=latest so the view
 * script fetches the most recent posts.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

global $post;

$attributes   = is_array( $attributes ?? null ) ? $attributes : array();
$posts_count  = max( 1, (int) ( $attributes['postsCount'] ?? 3 ) );
$discover_url = esc_url( $attributes['discoverUrl'] ?? '/blogs' );
$heading_text = esc_html( $attributes['headingText'] ?? 'Related Topics' );

$term_ids        = array();
$current_post_id = 0;
$query_mode      = 'latest';

if ( is_single() && $post ) {
	$query_mode      = 'related';
	$current_post_id = (int) $post->ID;
	$post_categories = get_the_category( $post->ID );
	foreach ( $post_categories as $cat_item ) {
		$term_ids[] = $cat_item->term_id;
	}
}

$nonce    = wp_create_nonce( 'wp_rig_related_posts' );
$ajax_url = esc_url( admin_url( 'admin-ajax.php' ) );
?>
<section
	class="related-posts"
	data-mode="<?php echo esc_attr( $query_mode ); ?>"
	data-post-id="<?php echo esc_attr( (string) $current_post_id ); ?>"
	data-term-ids="<?php echo esc_attr( implode( ',', $term_ids ) ); ?>"
	data-count="<?php echo esc_attr( (string) $posts_count ); ?>"
	data-ajax-url="<?php echo $ajax_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>"
	data-nonce="<?php echo esc_attr( $nonce ); ?>"
>
	<div class="related-posts__header">
		<h2 class="related-posts__heading"><?php echo $heading_text; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></h2>
		<a href="<?php echo $discover_url; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>" class="related-posts__discover">
			<span class="related-posts__discover-label"><?php esc_html_e( 'DISCOVER MORE', 'wp-rig' ); ?></span>
		</a>
	</div>

	<div class="related-posts__grid">
		<?php for ( $i = 0; $i < $posts_count; $i++ ) : ?>
		<article class="related-posts__card related-posts__card--skeleton" aria-hidden="true">
			<div class="related-posts__thumb skeleton-shimmer"></div>
			<div class="related-posts__body">
				<div class="skeleton-shimmer skeleton-line skeleton-line--short"></div>
				<div class="skeleton-shimmer skeleton-line"></div>
				<div class="skeleton-shimmer skeleton-line skeleton-line--medium"></div>
				<div class="skeleton-shimmer skeleton-line skeleton-line--short skeleton-line--bottom"></div>
			</div>
		</article>
		<?php endfor; ?>
	</div>
</section>
