<?php
/**
 * The template for displaying Category Archive pages (/category/[slug]).
 *
 * Renders:
 *   1. Blog Hero — sourced from the /blog page's block attributes (single source of truth).
 *   2. Blog Posts Grid — uses the current WP category archive query, pre-highlights the active tab.
 *   3. Ingredient Spotlight — sourced from the /blog page's block attributes.
 *
 * Tab clicks navigate via standard page routing (not AJAX). Pagination is AJAX.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use WP_Rig\WP_Rig\Blog_Posts_Grid\Component as Blog_Posts_Grid;

get_header();

// ── Retrieve the blog page and parse its blocks. ───────────────────────────
$blog_page       = get_post( (int) get_option( 'page_for_posts' ) );
$all_blocks      = $blog_page ? parse_blocks( $blog_page->post_content ) : array();
$current_term    = get_queried_object(); // WP_Term for the current category.
$active_category = ( $current_term instanceof WP_Term ) ? $current_term->slug : '';
$posts_per_page  = get_option( 'posts_per_page', 12 );

// Extract block attributes from the blog page for reuse.
$blog_hero_block      = null;
$blog_grid_block      = null;
$spotlight_block      = null;
$grid_section_heading = __( 'Latest from the Eternal', 'wp-rig' );

foreach ( $all_blocks as $block ) {
	switch ( $block['blockName'] ) {
		case 'wp-rig/blog-hero':
			$blog_hero_block = $block;
			break;
		case 'wp-rig/blog-posts-grid':
			$blog_grid_block      = $block;
			$grid_section_heading = $block['attrs']['sectionHeading'] ?? $grid_section_heading;
			$posts_per_page       = max( 1, (int) ( $block['attrs']['postsPerPage'] ?? $posts_per_page ) );
			break;
		case 'wp-rig/ingredient-spotlight':
			$spotlight_block = $block;
			break;
	}
}

?>
<main id="primary" class="site-main">
<?php

// ── 1. Blog Hero ───────────────────────────────────────────────────────────
if ( $blog_hero_block ) {
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo render_block( $blog_hero_block );
}

// ── 2. Blog Posts Grid (category-aware) ────────────────────────────────────

// Fetch all categories for the tab bar.
$all_categories = get_categories(
	array(
		'hide_empty' => true,
		'orderby'    => 'name',
		'order'      => 'ASC',
	)
);

$blog_home_url = get_permalink( (int) get_option( 'page_for_posts' ) );
?>
<section
	class="blog-posts-grid"
	data-posts-per-page="<?php echo esc_attr( (string) $posts_per_page ); ?>"
	data-is-home="0"
	data-active-category="<?php echo esc_attr( $active_category ); ?>"
>
	<div class="blog-posts-grid__inner">

		<h2 class="blog-posts-grid__heading"><?php echo esc_html( $grid_section_heading ); ?></h2>

		<?php if ( ! empty( $all_categories ) ) : ?>
		<div class="blog-posts-grid__tabs-wrap">
			<div class="blog-posts-grid__tabs" role="tablist" aria-label="<?php esc_attr_e( 'Filter by category', 'wp-rig' ); ?>">
				<a
					class="blog-posts-grid__tab<?php echo empty( $active_category ) ? ' is-active' : ''; ?>"
					href="<?php echo esc_url( $blog_home_url ); ?>"
					role="tab"
					aria-selected="<?php echo empty( $active_category ) ? 'true' : 'false'; ?>"
				><?php esc_html_e( 'All', 'wp-rig' ); ?></a>

				<?php foreach ( $all_categories as $category_item ) : ?>
					<?php $is_active = ( $category_item->slug === $active_category ); ?>
				<a
					class="blog-posts-grid__tab<?php echo $is_active ? ' is-active' : ''; ?>"
					href="<?php echo esc_url( get_category_link( $category_item->term_id ) ); ?>"
					data-category="<?php echo esc_attr( $category_item->slug ); ?>"
					role="tab"
					aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>"
				><?php echo esc_html( $category_item->name ); ?></a>
				<?php endforeach; ?>
			</div>
			<div class="blog-posts-grid__tab-rule" aria-hidden="true"></div>
		</div>
		<?php endif; ?>

		<div class="blog-posts-grid__cards" id="blog-grid-cards">
			<?php
			global $wp_query;
			if ( $wp_query->have_posts() ) {
				while ( $wp_query->have_posts() ) {
					$wp_query->the_post();
					get_template_part( 'template-parts/content/blog-card' );
				}
				wp_reset_postdata();
			} else {
				echo '<p class="blog-posts-grid__no-results">' . esc_html__( 'No posts found in this category.', 'wp-rig' ) . '</p>';
			}
			?>
		</div>

		<div class="blog-posts-grid__pagination" id="blog-grid-pagination">
			<?php
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo Blog_Posts_Grid::render_pagination( max( 1, (int) get_query_var( 'paged' ) ), (int) $wp_query->max_num_pages );
			?>
		</div>

	</div>
</section>

<?php
// ── 3. Ingredient Spotlight ────────────────────────────────────────────────
if ( $spotlight_block ) {
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo render_block( $spotlight_block );
}

?>
</main>
<?php

get_footer();
