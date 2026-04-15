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

// phpcs:ignore WordPress.Security.NonceVerification.Missing -- WooCommerce handles nonce verification for password reset forms.
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

// Determine which stage of the lost password flow we're in.
// Stage 1: Request reset link (default).
// Stage 2: Reset password (when user clicks link in email).
// phpcs:ignore WordPress.Security.NonceVerification.Missing
$is_reset_stage = isset( $_GET['show-reset-form'] ) && isset( $_GET['key'] ) && isset( $_GET['login'] );

// Build URLs.
$login_url = home_url( '/login/' );

// Build wrapper attributes using WordPress core function.
$wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'lost-password-form-wrapper' ) );

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="lost-password-form" data-block-id="<?php echo esc_attr( $block->block_type->name ?? 'wp-rig/lost-password-form' ); ?>">

		<?php if ( $is_reset_stage ) : ?>
			<!-- STAGE 2: Reset Password Form -->
			<div class="lost-password-form__title">
				<p class="lost-password-form__title-main">SET NEW PASSWORD</p>
			</div>

			<form id="wc-custom-reset-password-form" class="lost-password-form__form" method="post" novalidate>
				<?php
				// WooCommerce reset password form fields.
				if ( function_exists( 'wc_get_page_permalink' ) ) {
					// Get the reset key and login from URL.
					$reset_key        = sanitize_text_field( wp_unslash( $_GET['key'] ?? '' ) );
					$reset_user_login = sanitize_text_field( wp_unslash( $_GET['login'] ?? '' ) );

					// Add WooCommerce nonce.
					wp_nonce_field( 'wc_reset_password', 'woocommerce-reset-password-nonce' );
					?>
					<input type="hidden" name="reset_key" value="<?php echo esc_attr( $reset_key ); ?>">
					<input type="hidden" name="reset_login" value="<?php echo esc_attr( $reset_user_login ); ?>">
					<?php
				}
				?>

				<!-- Password Field -->
				<div class="lost-password-form__field">
					<label for="password_1" class="lost-password-form__label">NEW PASSWORD</label>
					<div class="lost-password-form__input-wrapper lost-password-form__input-wrapper--has-toggle">
						<input
							type="password"
							name="password_1"
							id="password_1"
							class="lost-password-form__input"
							required
							minlength="8"
							placeholder="••••••••••••"
							aria-required="true"
						>
						<button type="button" class="lost-password-form__password-toggle" data-target="password_1" aria-label="Toggle password visibility">
							<svg class="lost-password-form__eye-icon lost-password-form__eye-icon--slash" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
							</svg>
						</button>
					</div>
				</div>

				<!-- Confirm Password Field -->
				<div class="lost-password-form__field">
					<label for="password_2" class="lost-password-form__label">CONFIRM NEW PASSWORD</label>
					<div class="lost-password-form__input-wrapper">
						<input
							type="password"
							name="password_2"
							id="password_2"
							class="lost-password-form__input"
							required
							placeholder="••••••••••••"
							aria-required="true"
						>
					</div>
				</div>

				<!-- Submit Button -->
				<button type="submit" class="lost-password-form__submit" id="reset-password-submit">
					SAVE NEW PASSWORD
				</button>

				<!-- Footer -->
				<div class="lost-password-form__footer">
					<span>←</span>
					<a href="<?php echo esc_url( $login_url ); ?>" class="lost-password-form__link">
						Back to Sign In
					</a>
				</div>

				<!-- Messages -->
				<div id="reset-password-messages" class="lost-password-form__messages" aria-live="polite"></div>
			</form>

		<?php else : ?>
			<!-- STAGE 1: Request Reset Link Form -->
			<div class="lost-password-form__title">
				<p class="lost-password-form__title-main">FORGOT YOUR PASSWORD?</p>
				<p class="lost-password-form__title-sub">ACCOUNT RECOVERY</p>
			</div>

			<form id="wc-custom-lost-password-form" class="lost-password-form__form" method="post" novalidate>
				<?php
				// WooCommerce security fields.
				if ( function_exists( 'wc_get_page_permalink' ) ) {
					wp_nonce_field( 'woocommerce-lost-password', 'woocommerce-lost-password-nonce' );
				}
				?>

				<!-- Consent/Info Text -->
				<div class="lost-password-form__consent">
					<p class="lost-password-form__consent-text">
						Enter the email address associated with your account. We will send a discreet reset link.
					</p>
				</div>

				<!-- Email Field -->
				<div class="lost-password-form__field">
					<label for="user_login" class="lost-password-form__label">EMAIL ADDRESS</label>
					<div class="lost-password-form__input-wrapper">
						<input
							type="email"
							name="user_login"
							id="user_login"
							class="lost-password-form__input"
							required
							placeholder="your@email.com"
							aria-required="true"
							autocomplete="email"
						>
					</div>
				</div>

				<!-- Submit Button -->
				<button type="submit" class="lost-password-form__submit" id="lost-password-submit">
					SEND RESET LINK
				</button>

				<!-- Footer -->
				<div class="lost-password-form__footer">
					<span>←</span>
					<a href="<?php echo esc_url( $login_url ); ?>" class="lost-password-form__link">
						Back to Sign In
					</a>
				</div>

				<!-- Messages -->
				<div id="lost-password-messages" class="lost-password-form__messages" aria-live="polite"></div>
			</form>
		<?php endif; ?>

	</div>
</div>
