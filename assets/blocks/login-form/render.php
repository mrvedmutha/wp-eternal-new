<?php
/**
 * Dynamic block render template.
 *
 * WordPress includes this file when block.json contains: "render": "file:./render.php"
 * Variables provided by core at include-time:
 * - $attributes (array) Block attributes from block.json and user input.
 * - $content (string)   Rendered inner blocks HTML (if the block supports innerBlocks).
 * - $block (WP_Block)   Block instance (may be null in some contexts).
 *
 * This template echoes markup; WordPress captures the output as the block's HTML.
 *
 * @link https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/#render
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// If user is already logged in, redirect to my account dashboard.
// Skip this redirect in the block editor context.
if ( is_user_logged_in() && ! ( is_admin() || ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) ) {
	$my_account_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' );
	wp_safe_redirect( $my_account_url );
	exit;
}

// Normalize core-provided variables with sane defaults.
$attributes = is_array( $attributes ?? null ) ? $attributes : array();
/**
 * Block instance.
 *
 * @var WP_Block|null $block
 */
$block = ( isset( $block ) && $block instanceof WP_Block ) ? $block : null;

// Build URLs.
$lost_password_url = home_url( '/lost-password/' );
$signup_url        = home_url( '/signup/' );

// Build wrapper attributes using WordPress core function.
$wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'login-form-wrapper' ) );

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="login-form" data-block-id="<?php echo esc_attr( $block->block_type->name ?? 'wp-rig/login-form' ); ?>">

		<!-- Title Section -->
		<div class="login-form__title">
			<p class="login-form__title-main">MY ETERNAL ACCOUNT</p>
		</div>

		<!-- Form -->
		<form id="wc-custom-login-form" class="login-form__form" method="post" novalidate>

			<!-- Header -->
			<div class="login-form__header">
				<p class="login-form__header-text">SIGN IN</p>
			</div>

			<!-- Email Field -->
			<div class="login-form__field">
				<label for="username" class="login-form__label">EMAIL ADDRESS</label>
				<div class="login-form__input-wrapper">
					<input
						type="email"
						name="username"
						id="username"
						class="login-form__input"
						required
						placeholder="your@email.com"
						aria-required="true"
						autocomplete="email"
					>
				</div>
			</div>

			<!-- Password Field -->
			<div class="login-form__field">
				<label for="password" class="login-form__label">PASSWORD</label>
				<div class="login-form__input-wrapper login-form__input-wrapper--has-toggle">
					<input
						type="password"
						name="password"
						id="password"
						class="login-form__input"
						required
						placeholder="••••••••••••"
						aria-required="true"
						autocomplete="current-password"
					>
					<button type="button" class="login-form__password-toggle" data-target="password" aria-label="Toggle password visibility">
						<svg class="login-form__eye-icon login-form__eye-icon--slash" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
						</svg>
					</button>
				</div>

				<!-- Forgot Password Row -->
				<div class="login-form__forgot-row">
					<a href="<?php echo esc_url( $lost_password_url ); ?>" class="login-form__forgot-link">
						FORGOT PASSWORD?
					</a>
				</div>
			</div>

			<?php
			// WooCommerce security fields.
			if ( function_exists( 'wc_get_page_permalink' ) ) {
				?>
				<input type="hidden" name="redirect" value="<?php echo esc_url( wc_get_page_permalink( 'myaccount' ) ); ?>">
				<?php
				wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' );
			} else {
				wp_nonce_field( 'wp_rest', 'wc_login_nonce' );
			}
			?>

			<!-- Submit Button -->
			<button type="submit" class="login-form__submit" id="login-submit">
				SIGN IN
			</button>

			<!-- Footer -->
			<div class="login-form__footer">
				<span>New to Eternal?</span>
				<a href="<?php echo esc_url( $signup_url ); ?>" class="login-form__link">
					Create an account
				</a>
			</div>

			<!-- Messages -->
			<div id="login-messages" class="login-form__messages" aria-live="polite"></div>
		</form>
	</div>
</div>
