<?php
/**
 * My Account - Login Form
 *
 * Override of WooCommerce default login form with custom Figma design.
 * Figma Reference: node-id 856:1778, file: aJ4VjKdFNahXA6Ly4jkRtJ
 *
 * @package wp_rig
 */

defined( 'ABSPATH' ) || exit;

// If user is already logged in, redirect to my account dashboard.
if ( is_user_logged_in() ) {
	$my_account_url = wc_get_page_permalink( 'myaccount' );
	wp_safe_redirect( $my_account_url );
	exit;
}

// Build URLs.
$lost_password_url = wc_lost_password_url();
$signup_url        = home_url( '/signup/' );

// Get return URL.
$redirect = wc_get_page_permalink( 'myaccount' );

?>
<div class="woocommerce-login-form-wrapper">
	<div class="login-form">

		<!-- Title Section -->
		<div class="login-form__title">
			<p class="login-form__title-main">MY ETERNAL ACCOUNT</p>
		</div>

		<!-- Form -->
		<form class="woocommerce-form woocommerce-form-login login login-form__form" method="post" <?php do_action( 'woocommerce_login_form_start' ); ?>>

			<?php do_action( 'woocommerce_login_form_before_fields' ); ?>

			<!-- Header -->
			<div class="login-form__header">
				<p class="login-form__header-text">SIGN IN</p>
			</div>

			<!-- Email Field -->
			<div class="login-form__field">
				<label for="username" class="login-form__label"><?php esc_html_e( 'EMAIL ADDRESS', 'wp-rig' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
				<div class="login-form__input-wrapper">
					<input
						type="email"
						class="woocommerce-Input woocommerce-Input--text input-text login-form__input"
						name="username"
						id="username"
						autocomplete="email"
						required="required"
						placeholder="<?php esc_attr_e( 'your@email.com', 'wp-rig' ); ?>"
						value="<?php echo ( isset( $_POST['username'] ) ) ? esc_attr( wp_unslash( $_POST['username'] ) ) : ''; // phpcs:ignore WordPress.Security.NonceVerification.Missing, WordPress.Security.ValidatedSanitizedInput.InputNotSanitized ?>"
					/>
				</div>
			</div>

			<!-- Password Field -->
			<div class="login-form__field">
				<label for="password" class="login-form__label"><?php esc_html_e( 'PASSWORD', 'wp-rig' ); ?>&nbsp;<span class="required" aria-hidden="true">*</span></label>
				<div class="login-form__input-wrapper login-form__input-wrapper--has-toggle">
					<input
						class="woocommerce-Input woocommerce-Input--text input-text login-form__input"
						type="password"
						name="password"
						id="password"
						autocomplete="current-password"
						required="required"
						placeholder="••••••••••••"
					/>
					<button type="button" class="login-form__password-toggle" data-target="password" aria-label="Toggle password visibility">
						<svg class="login-form__eye-icon login-form__eye-icon--slash" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
						</svg>
					</button>
				</div>

				<!-- Forgot Password Row -->
				<div class="login-form__forgot-row">
					<a href="<?php echo esc_url( $lost_password_url ); ?>" class="login-form__forgot-link">
						<?php esc_html_e( 'FORGOT PASSWORD?', 'wp-rig' ); ?>
					</a>
				</div>
			</div>

			<?php do_action( 'woocommerce_login_form_fields' ); ?>

			<!-- Security Fields -->
			<?php wp_nonce_field( 'woocommerce-login', 'woocommerce-login-nonce' ); ?>
			<input type="hidden" name="redirect" value="<?php echo esc_url( $redirect ); ?>" />
			<input type="hidden" name="login" value="1" />

			<!-- Submit Button -->
			<button type="submit" class="woocommerce-form-login__submit login-form__submit" name="login" value="<?php esc_attr_e( 'Sign in', 'wp-rig' ); ?>">
				<?php esc_html_e( 'SIGN IN', 'wp-rig' ); ?>
			</button>

			<?php do_action( 'woocommerce_login_form_end' ); ?>

			<!-- Footer -->
			<div class="login-form__footer">
				<span><?php esc_html_e( 'New to Eternal?', 'wp-rig' ); ?></span>
				<a href="<?php echo esc_url( $signup_url ); ?>" class="login-form__link">
					<?php esc_html_e( 'Create an account', 'wp-rig' ); ?>
				</a>
			</div>

		</form>

		<?php do_action( 'woocommerce_after_customer_login_form' ); ?>

	</div>
</div>

<!-- JavaScript for password toggle -->
<script>
(function() {
	'use strict';

	document.addEventListener( 'DOMContentLoaded', function() {
		// Initialize password toggles.
		const passwordToggles = document.querySelectorAll( '.login-form__password-toggle' );
		passwordToggles.forEach( function( toggle ) {
			toggle.addEventListener( 'click', function() {
				const inputId = this.dataset.target;
				const input = document.getElementById( inputId );
				const eyeIcon = this.querySelector( '.login-form__eye-icon' );

				if ( ! input || ! eyeIcon ) {
					return;
				}

				const isPassword = input.type === 'password';
				input.type = isPassword ? 'text' : 'password';

				if ( isPassword ) {
					eyeIcon.classList.remove( 'login-form__eye-icon--slash' );
					this.setAttribute( 'aria-label', 'Hide password' );
				} else {
					eyeIcon.classList.add( 'login-form__eye-icon--slash' );
					this.setAttribute( 'aria-label', 'Show password' );
				}
			} );
		} );
	} );
})();
</script>
