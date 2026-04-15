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

use function WP_Rig\WP_Rig\wp_rig;

// If user is already logged in, redirect to my account.
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

// Extract attributes with defaults.
$terms_url             = $attributes['termsUrl'] ?? '/terms/';
$privacy_url           = $attributes['privacyUrl'] ?? '/privacy-policy/';
$marketing_title       = $attributes['marketingTitle'] ?? 'Sign me up to hear more from Eternal Labs.';
$marketing_description = $attributes['marketingDescription'] ?? 'By checking this box, you agree to receive marketing emails and other communications from Eternal Labs. To learn more, view our PRIVACY POLICY.';
$terms_agreement_text  = $attributes['termsAgreementText'] ?? 'By clicking Create Account button I agree to ETERNAL-LABS TERMS & CONDITIONS and PRIVACY POLICY.';

// Build wrapper attributes via namespaced helper (it handles core fallback internally).
$wrapper_attrs = wp_rig()->block_wrapper_attributes( array( 'signup-form-wrapper' ), $attributes );

// Sanitize URLs.
$terms_url      = esc_url( $terms_url );
$privacy_url    = esc_url( $privacy_url );
$my_account_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : home_url( '/my-account/' );

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="signup-form" data-block-id="<?php echo esc_attr( $block->block_type->name ?? 'wp-rig/signup-form' ); ?>">

		<!-- Title Section -->
		<div class="signup-form__title">
			<p class="signup-form__title-main">CREATE YOUR ETERNAL ACCOUNT</p>
			<p class="signup-form__title-sub">JOIN THE RITUAL</p>
		</div>

		<!-- Form -->
		<form id="wc-custom-signup-form" class="signup-form__form" method="post" novalidate>
			<?php wp_nonce_field( 'wp_rest', 'wc_signup_nonce' ); ?>

			<!-- Name Row -->
			<div class="signup-form__name-row">
				<div class="signup-form__field">
					<label for="first_name" class="signup-form__label">FIRST NAME</label>
					<div class="signup-form__input-wrapper">
						<input
							type="text"
							name="first_name"
							id="first_name"
							class="signup-form__input"
							required
							minlength="2"
							maxlength="50"
							placeholder="First name"
							aria-required="true"
						>
					</div>
				</div>

				<div class="signup-form__field">
					<label for="last_name" class="signup-form__label">LAST NAME</label>
					<div class="signup-form__input-wrapper">
						<input
							type="text"
							name="last_name"
							id="last_name"
							class="signup-form__input"
							required
							minlength="2"
							maxlength="50"
							placeholder="Last name"
							aria-required="true"
						>
					</div>
				</div>
			</div>

			<!-- Email Field -->
			<div class="signup-form__field">
				<label for="email" class="signup-form__label">EMAIL ADDRESS</label>
				<div class="signup-form__input-wrapper">
					<input
						type="email"
						name="email"
						id="email"
						class="signup-form__input"
						required
						placeholder="your@email.com"
						aria-required="true"
					>
				</div>
			</div>

			<!-- Password Field -->
			<div class="signup-form__field">
				<label for="password" class="signup-form__label">PASSWORD</label>
				<div class="signup-form__input-wrapper signup-form__input-wrapper--has-toggle">
					<input
						type="password"
						name="password"
						id="password"
						class="signup-form__input"
						required
						minlength="8"
						placeholder="••••••••••••"
						aria-required="true"
					>
					<button type="button" class="signup-form__password-toggle" data-target="password" aria-label="Toggle password visibility">
						<svg class="signup-form__eye-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
							<path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
						</svg>
					</button>
				</div>
			</div>

			<!-- Confirm Password Field -->
			<div class="signup-form__field">
				<label for="confirm_password" class="signup-form__label">CONFIRM PASSWORD</label>
				<div class="signup-form__input-wrapper">
					<input
						type="password"
						name="confirm_password"
						id="confirm_password"
						class="signup-form__input"
						required
						placeholder="••••••••••••"
						aria-required="true"
					>
				</div>
			</div>

			<!-- Marketing Consent Checkbox -->
			<div class="signup-form__field signup-form__field--checkbox">
				<div class="signup-form__checkbox-group">
					<input
						type="checkbox"
						name="marketing_consent"
						id="marketing_consent"
						value="1"
						class="signup-form__checkbox"
					>
					<div class="signup-form__checkbox-content">
						<label for="marketing_consent" class="signup-form__checkbox-label">
							<?php echo esc_html( $marketing_title ); ?>
						</label>
						<p class="signup-form__checkbox-description">
							<?php
							// Allow HTML in description for link styling.
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
							echo $marketing_description;
							?>
						</p>
					</div>
				</div>
			</div>

			<!-- Terms Agreement Text -->
			<div class="signup-form__terms-text">
				<?php
				// Replace TERMS & CONDITIONS and PRIVACY POLICY with links.
				$agreement_with_links = $terms_agreement_text;
				$agreement_with_links = preg_replace(
					'/TERMS & CONDITIONS/i',
					'<a href="' . $terms_url . '" class="signup-form__link">TERMS & CONDITIONS</a>',
					$agreement_with_links
				);
				$agreement_with_links = preg_replace(
					'/PRIVACY POLICY\.?/i',
					'<a href="' . $privacy_url . '" class="signup-form__link">PRIVACY POLICY</a>',
					$agreement_with_links
				);
				// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo '<p>' . $agreement_with_links . '</p>';
				?>
			</div>

			<!-- CAPTCHA Placeholder (if configured) -->
			<div id="signup-captcha-container" class="signup-form__captcha"></div>
			<input type="hidden" name="captcha_token" id="captcha_token">

			<!-- Submit Button -->
			<button type="submit" class="signup-form__submit" id="signup-submit">
				CREATE ACCOUNT
			</button>

			<!-- Footer -->
			<div class="signup-form__footer">
				<span><?php esc_html_e( 'Already have an account?', 'wp-rig' ); ?></span>
				<a href="<?php echo esc_url( $my_account_url ); ?>" class="signup-form__link">
					<?php esc_html_e( 'Sign in', 'wp-rig' ); ?>
				</a>
			</div>

			<!-- Messages -->
			<div id="signup-messages" class="signup-form__messages" aria-live="polite"></div>
		</form>
	</div>
</div>
