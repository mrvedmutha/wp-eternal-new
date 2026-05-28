<?php
/**
 * Contact Form block render template.
 *
 * Renders a Contact Form 7 shortcode when a form ID is configured.
 * Falls back to a styled static form matching the Figma design if CF7
 * is not active or no form ID has been set yet.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes  = is_array( $attributes ?? null ) ? $attributes : array();
$form_id     = isset( $attributes['formId'] ) ? (int) $attributes['formId'] : 0;
$terms_url   = esc_url( $attributes['termsUrl'] ?? '/terms-conditions/' );
$privacy_url = esc_url( $attributes['privacyUrl'] ?? '/privacy-policy/' );

$wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'contact-form-wrapper' ) );

// Use CF7 if plugin is active and a form ID has been set.
$use_cf7 = $form_id > 0 && function_exists( 'wpcf7_contact_form' );

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="contact-form">

		<?php if ( $use_cf7 ) : ?>

			<?php
			// Output the CF7 shortcode. CF7 wraps this in its own form markup.
			// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			echo do_shortcode( '[contact-form-7 id="' . $form_id . '"]' );
			?>

		<?php else : ?>

			<?php
			// Fallback: full Figma-styled static form.
			// Renders identically to the CF7 output so the page always looks right.
			// Once you create the CF7 form and add the ID in the block sidebar, this is replaced.
			?>
			<form class="contact-form__form contact-form__form--fallback" method="post" novalidate>

				<div class="contact-form__name-row">
					<div class="contact-form__field">
						<label class="contact-form__label">FIRST NAME*</label>
						<input type="text" class="contact-form__input" placeholder="First name" name="first-name" required>
					</div>
					<div class="contact-form__field">
						<label class="contact-form__label">LAST NAME*</label>
						<input type="text" class="contact-form__input" placeholder="Last name" name="last-name" required>
					</div>
				</div>

				<div class="contact-form__field">
					<label class="contact-form__label">EMAIL ADDRESS*</label>
					<input type="email" class="contact-form__input" placeholder="your@email.com" name="your-email" required>
				</div>

				<div class="contact-form__field">
					<label class="contact-form__label">COUNTRY*</label>
					<input type="text" class="contact-form__input" placeholder="Country" name="country" required>
				</div>

				<div class="contact-form__field">
					<label class="contact-form__label">ORDER NUMBER</label>
					<input type="text" class="contact-form__input" placeholder="Your Order Number" name="order-number">
				</div>

				<div class="contact-form__field">
					<label class="contact-form__label">TOPICS*</label>
					<div class="contact-form__radio-row">
						<label class="contact-form__radio-item">
							<span class="contact-form__radio-circle"></span>
							<input type="radio" name="topics" value="Orders &amp; Returns">
							<span class="contact-form__radio-label">ORDERS &amp; RETURNS</span>
						</label>
						<label class="contact-form__radio-item">
							<span class="contact-form__radio-circle"></span>
							<input type="radio" name="topics" value="General Enquiries">
							<span class="contact-form__radio-label">GENERAL ENQUIRIES</span>
						</label>
						<label class="contact-form__radio-item">
							<span class="contact-form__radio-circle"></span>
							<input type="radio" name="topics" value="Privacy &amp; Data">
							<span class="contact-form__radio-label">PRIVACY &amp; DATA</span>
						</label>
					</div>
				</div>

				<div class="contact-form__field">
					<label class="contact-form__label">COMMENTS</label>
					<textarea class="contact-form__input contact-form__textarea" placeholder="Message" name="comments"></textarea>
				</div>

				<p class="contact-form__disclaimer">Please do not include any sensitive personal data, including health information, in this form.</p>

				<button type="submit" class="contact-form__submit">SUBMIT</button>

				<p class="contact-form__legal">
					<?php esc_html_e( 'By clicking Submit button I agree to ETERNAL-LABS ', 'wp-rig' ); ?>
					<a href="<?php echo esc_url( $terms_url ); ?>" class="contact-form__legal-link">TERMS &amp; CONDITIONS</a>
					<?php esc_html_e( ' and ', 'wp-rig' ); ?>
					<a href="<?php echo esc_url( $privacy_url ); ?>" class="contact-form__legal-link">PRIVACY POLICY</a>.
				</p>

			</form>

		<?php endif; ?>

	</div>
</div>
