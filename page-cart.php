<?php
/**
 * Template Name: Cart Page
 *
 * Custom page template for the WooCommerce cart page.
 * Adds cart page header with proper spacing and styling.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<main id="primary" class="site-main site-main--no-sidebar">
	<div class="cart-page-wrapper">
		<?php
		// Cart page header.
		?>
		<header class="cart-page-header">
			<h1 class="cart-page-header__title">Cart</h1>
		</header>

		<?php
		// Render the cart block content.
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
