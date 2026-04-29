<?php
/**
 * Template for all single posts.
 *
 * Renders:
 *   1. Post Hero       — featured image, category eyebrow, date, post title.
 *   2. Content + TOC   — sticky two-column layout; TOC built by single-toc.js.
 *   3. Related Posts   — wp-rig/related-posts block (AJAX-loaded, skeleton state).
 *   4. Ingredient Spotlight — sourced from the /blog page's block attributes.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-post
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

wp_rig()->print_styles( 'wp-rig-content' );

// ── Source the Ingredient Spotlight from the blog page (single source of truth) ──
$blog_page       = get_post( (int) get_option( 'page_for_posts' ) );
$all_blocks      = $blog_page ? parse_blocks( $blog_page->post_content ) : array();
$spotlight_block = null;

foreach ( $all_blocks as $block ) {
	if ( 'wp-rig/ingredient-spotlight' === $block['blockName'] ) {
		$spotlight_block = $block;
		break;
	}
}
?>
<main id="primary" class="site-main">
<?php

while ( have_posts() ) {
	the_post();

	// ── 1. Post Hero ─────────────────────────────────────────────────────────
	get_template_part( 'template-parts/content/entry_hero' );

	// ── 2. Content + sticky TOC ───────────────────────────────────────────────
	get_template_part( 'template-parts/content/entry_single_content' );

	// ── 3. Related Posts (block rendered server-side; JS upgrades to real posts)
	echo render_block( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		array(
			'blockName'    => 'wp-rig/related-posts',
			'attrs'        => array( 'postsCount' => 3 ),
			'innerBlocks'  => array(),
			'innerHTML'    => '',
			'innerContent' => array(),
		)
	);
}

// ── 4. Ingredient Spotlight ───────────────────────────────────────────────────
if ( $spotlight_block ) {
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	echo render_block( $spotlight_block );
}

?>
</main>
<?php

get_footer();
