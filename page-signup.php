<?php
/**
 * Template Name: Signup Page
 *
 * Custom page template for the WooCommerce customer registration form.
 *
 * @package wp_rig
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// If user is already logged in, redirect to my account.
if ( is_user_logged_in() ) {
	$my_account_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' );
	wp_safe_redirect( $my_account_url );
	exit;
}

get_header();

// Check if the Signup Form block is available in this page content.
$has_signup_block = false;
if ( have_posts() ) {
	while ( have_posts() ) {
		the_post();
		$content = get_the_content();

		// Check if signup-form block exists in content.
		if ( has_block( 'wp-rig/signup-form', get_the_ID() ) || strpos( $content, 'wp-rig/signup-form' ) !== false ) {
			$has_signup_block = true;
		}
	}
	// Reset the post data for later use.
	rewind_posts();
}
?>

<main id="primary" class="site-main site-main--no-sidebar">
	<div class="signup-page-container">
		<?php
		// If the page has the signup form block, render the page content.
		if ( have_posts() ) :
			while ( have_posts() ) :
				the_post();
				?>

				<article <?php post_class(); ?> id="post-<?php the_ID(); ?>">
					<div class="entry-content">
						<?php
						// Render the signup form block or fallback.
						if ( $has_signup_block ) {
							the_content();
						} else {
							// Fallback: Display the signup form directly via do_blocks.
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo do_blocks( '<!-- wp:wp-rig/signup-form /-->' );
						}
						?>
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
