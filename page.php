<?php
/**
 * Page template.
 *
 * Renders standard WordPress pages via Gutenberg blocks.
 * Full-width layout — no sidebar. Add content directly in
 * the block editor for each page.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/#single-page
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

get_header();
?>

<main id="primary" class="site-main">
	<?php
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	?>
</main>

<?php
get_footer();
