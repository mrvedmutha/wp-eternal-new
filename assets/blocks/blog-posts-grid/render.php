<?php
/**
 * Blog Posts Grid block — frontend render template.
 *
 * Renders the full section: heading, category tabs (All + WP categories),
 * initial card grid, and pagination. JS takes over for AJAX tab/page switching.
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

use WP_Rig\WP_Rig\Blog_Posts_Grid\Component as Blog_Posts_Grid;

$attributes      = is_array( $attributes ?? null ) ? $attributes : array();
$section_heading = $attributes['sectionHeading'] ?? __( 'Latest from the Eternal', 'wp-rig' );
$posts_per_page  = max( 1, (int) ( $attributes['postsPerPage'] ?? 12 ) );
$nonce           = wp_create_nonce( 'wp_rig_blog_posts' );

// Fetch all non-empty categories for the tab bar.
$categories = get_categories(
	array(
		'hide_empty' => true,
		'orderby'    => 'name',
		'order'      => 'ASC',
	)
);

// Initial WP_Query — always page 1, all posts (no category filter).
$query = new WP_Query(
	array(
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => $posts_per_page,
		'paged'          => 1,
		'orderby'        => 'date',
		'order'          => 'DESC',
	)
);
?>
<section
	class="blog-posts-grid"
	data-posts-per-page="<?php echo esc_attr( (string) $posts_per_page ); ?>"
	data-is-home="1"
>
	<div class="blog-posts-grid__inner">

		<h2 class="blog-posts-grid__heading"><?php echo esc_html( $section_heading ); ?></h2>

		<?php if ( ! empty( $categories ) ) : ?>
		<div class="blog-posts-grid__tabs-wrap">
			<div class="blog-posts-grid__tabs" role="tablist" aria-label="<?php esc_attr_e( 'Filter by category', 'wp-rig' ); ?>">
				<button
					class="blog-posts-grid__tab is-active"
					data-category=""
					role="tab"
					aria-selected="true"
				><?php esc_html_e( 'All', 'wp-rig' ); ?></button>

				<?php foreach ( $categories as $category_item ) : ?>
				<button
					class="blog-posts-grid__tab"
					data-category="<?php echo esc_attr( $category_item->slug ); ?>"
					data-category-url="<?php echo esc_url( get_category_link( $category_item->term_id ) ); ?>"
					role="tab"
					aria-selected="false"
				><?php echo esc_html( $category_item->name ); ?></button>
				<?php endforeach; ?>
			</div>
			<div class="blog-posts-grid__tab-rule" aria-hidden="true"></div>
		</div>
		<?php endif; ?>

		<div class="blog-posts-grid__cards" id="blog-grid-cards">
			<?php
			if ( $query->have_posts() ) {
				while ( $query->have_posts() ) {
					$query->the_post();
					get_template_part( 'template-parts/content/blog-card' );
				}
				wp_reset_postdata();
			} else {
				echo '<p class="blog-posts-grid__no-results">' . esc_html__( 'No posts found.', 'wp-rig' ) . '</p>';
			}
			?>
		</div>

		<div class="blog-posts-grid__pagination" id="blog-grid-pagination">
			<?php echo Blog_Posts_Grid::render_pagination( 1, (int) $query->max_num_pages ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>

	</div>
</section>
