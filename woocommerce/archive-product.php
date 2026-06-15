<?php
/**
 * WooCommerce Shop Archive Template
 *
 * Custom template for the main shop page that uses the Shop component.
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

get_header();
?>

	<div class="content-area">
		<main id="main" class="site-main" role="main">

			<?php
			/**
			 * Hook: woocommerce_archive_description.
			 *
			 * @hooked Shop\Component::output_header - 10
			 */
			do_action( 'woocommerce_archive_description' );

			/**
			 * Hook: woocommerce_before_shop_loop.
			 *
			 * @hooked Shop\Component::output_filters_and_grid - 10
			 */
			do_action( 'woocommerce_before_shop_loop' );

			if ( have_posts() ) {

				/**
				 * Hook: woocommerce_after_shop_loop.
				 *
				 * @hooked Shop\Component::output_faq_section - 10
				 */
				do_action( 'woocommerce_after_shop_loop' );

			} else {
				/**
				 * Hook: woocommerce_no_products_found.
				 */
				do_action( 'woocommerce_no_products_found' );
			}
			?>

		</main><!-- #main -->
	</div><!-- .content-area -->

<?php
get_footer();
