<?php
/**
 * The template for displaying the Blog Posts Page (/blog).
 *
 * WordPress uses this template when a static front page is set and
 * the Posts Page is configured in Settings → Reading. It fetches the
 * posts page post object and renders its Gutenberg block content
 * (Blog Hero → Blog Posts Grid → Ingredient Spotlight).
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 * @package wp_rig
 */

get_header();

$blog_page = get_post( (int) get_option( 'page_for_posts' ) );

if ( $blog_page && ! empty( $blog_page->post_content ) ) {
	?>
	<main id="primary" class="site-main">
		<?php
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		echo do_blocks( $blog_page->post_content );
		?>
	</main>
	<?php
}

get_footer();
