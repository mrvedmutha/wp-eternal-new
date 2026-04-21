<?php
/**
 * Template part for displaying the page content when a 404 error has occurred
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig;

?>
<section class="error-404">
	<?php get_template_part( 'template-parts/content/page_header' ); ?>

	<div class="error-404__content">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="error-404__home-link js-404-underline">
			<span class="error-404__home-link__label">← Go Back Home</span>
			<span class="error-404__home-link__line"></span>
		</a>
	</div>
</section><!-- .error-404 -->
