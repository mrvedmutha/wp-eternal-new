<?php
/**
 * Template Name: Checkout Page
 *
 * Custom page template for the WooCommerce checkout page.
 * Adds checkout page header with proper spacing and styling.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<main id="primary" class="site-main site-main--no-sidebar">
	<div class="checkout-page-wrapper">
		<?php
		// Checkout page header.
		?>
		<header class="checkout-page-header">
			<h1 class="checkout-page-header__title">Checkout</h1>
		</header>

		<?php
		// Render the checkout block content.
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>

				<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
					<div class="entry-content">
						<?php the_content(); ?>
					</div>
				</article>

				<?php
			endwhile;
		else :
			?>

			<p><?php esc_html_e( 'Sorry, no page found.', 'wp-rig' ); ?></p>

			<?php
		endif;
		?>
	</div>
</main>

<?php
get_footer();
