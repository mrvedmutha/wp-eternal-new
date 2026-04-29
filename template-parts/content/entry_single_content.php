<?php
/**
 * Template part: single post body — TOC + content two-column layout.
 *
 * Left: sticky table of contents (populated by single-toc.js from the headings).
 * Right: post body via the_content().
 *
 * Matches Figma node 694:5007.
 * Must be called inside the WordPress loop (after the_post()).
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="single-post__layout">

	<nav class="single-post__toc" aria-label="<?php esc_attr_e( 'Table of contents', 'wp-rig' ); ?>">
		<ol class="single-post__toc-list">
			<?php /* Populated by single-toc.js */ ?>
		</ol>
	</nav>

	<div class="single-post__content">
		<?php the_content(); ?>
	</div>

</div>
