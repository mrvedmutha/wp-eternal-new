<?php
/**
 * Single Product page — WooCommerce template override.
 *
 * Replaces WooCommerce's default single-product.php to give us full layout
 * control. The actual product content is rendered by content-single-product.php.
 *
 * @package wp_rig
 * @see     woocommerce/templates/single-product.php
 */

namespace WP_Rig\WP_Rig;

defined( 'ABSPATH' ) || exit;

get_header();
?>

<main id="primary" class="site-main pdp-page">

	<?php
	while ( have_posts() ) :
		the_post();
		wc_get_template_part( 'content', 'single-product' );
	endwhile;
	?>

</main>

<?php
get_footer();
