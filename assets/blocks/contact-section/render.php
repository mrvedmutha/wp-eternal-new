<?php
/**
 * Contact Section block render template.
 *
 * Two-column layout: contact form (left) + info panel (right).
 * Matches Figma node 694:5186 exactly.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes        = is_array( $attributes ?? null ) ? $attributes : array();
$form_id           = trim( (string) ( $attributes['formId'] ?? '' ) );
$terms_url         = esc_url( $attributes['termsUrl'] ?? '/terms-conditions/' );
$privacy_url       = esc_url( $attributes['privacyUrl'] ?? '/privacy-policy/' );
$heading           = $attributes['heading'] ?? 'Contact Us';
$body              = $attributes['body'] ?? 'Have a question, need support, or just want to chat about our products? Our team is ready to assist you. Reach out and we\'ll get back to you as soon as possible.';
$email             = $attributes['email'] ?? 'customerservice@eternallabs.health';
$email_href        = esc_url( $attributes['emailHref'] ?? 'mailto:customerservice@eternallabs.health' );
$hours             = $attributes['hours'] ?? 'Mon - Fri, 9:30am - 5:30pm (GMT & EST)';
$chat_label        = $attributes['chatLabel'] ?? 'CHAT WITH US';
$chat_url          = esc_url( $attributes['chatUrl'] ?? '#' );
$chat_icon_url     = esc_url( $attributes['chatIconUrl'] ?? '' );
$appointment_label = $attributes['appointmentLabel'] ?? 'BOOK APPOINTMENT';
$appointment_url   = esc_url( $attributes['appointmentUrl'] ?? '#' );

$use_cf7 = '' !== $form_id && function_exists( 'wpcf7_contact_form' );

// Build the shortcode string: accept a full shortcode or a bare ID (numeric or hash).
if ( $use_cf7 ) {
	if ( str_starts_with( $form_id, '[' ) ) {
		$cf7_shortcode = $form_id;
	} else {
		$cf7_shortcode = '[contact-form-7 id="' . esc_attr( $form_id ) . '"]';
	}
}

$wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'contact-section-wrapper' ) );

?>
<section <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="contact-section">

		<?php /* ── LEFT: Form column ────────────────────── */ ?>
		<div class="contact-section__form-col">
			<div class="contact-form">

				<?php if ( $use_cf7 ) : ?>

					<?php
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					echo do_shortcode( $cf7_shortcode );
					?>

				<?php else : ?>

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
									<input type="radio" name="topics" value="Orders & Returns">
									<span class="contact-form__radio-circle"></span>
									<span class="contact-form__radio-label">ORDERS &amp; RETURNS</span>
								</label>
								<label class="contact-form__radio-item">
									<input type="radio" name="topics" value="General Enquiries">
									<span class="contact-form__radio-circle"></span>
									<span class="contact-form__radio-label">GENERAL ENQUIRIES</span>
								</label>
								<label class="contact-form__radio-item">
									<input type="radio" name="topics" value="Privacy & Data">
									<span class="contact-form__radio-circle"></span>
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

		<?php /* ── RIGHT: Info panel column ──────────────── */ ?>
		<div class="contact-section__info-col">
			<div class="contact-info">

				<div class="contact-info__content">
					<h2 class="contact-info__heading"><?php echo esc_html( $heading ); ?></h2>
					<p class="contact-info__body"><?php echo esc_html( $body ); ?></p>
					<div class="contact-info__details">
						<p class="contact-info__detail-line">
							<strong class="contact-info__detail-label">Email:</strong>
							<a href="<?php echo esc_url( $email_href ); ?>" class="contact-info__email"><?php echo esc_html( $email ); ?></a>
						</p>
						<p class="contact-info__detail-line">
							<strong class="contact-info__detail-label">Hours:</strong>
							<span><?php echo esc_html( $hours ); ?></span>
						</p>
					</div>
				</div>

				<div class="contact-info__ctas">
					<a href="<?php echo esc_url( $chat_url ); ?>" class="contact-info__btn contact-info__btn--filled">
						<?php if ( $chat_icon_url ) : ?>
							<img src="<?php echo esc_url( $chat_icon_url ); ?>" alt="" class="contact-info__btn-icon" aria-hidden="true" width="22" height="22">
						<?php endif; ?>
						<span><?php echo esc_html( $chat_label ); ?></span>
					</a>
					<a href="<?php echo esc_url( $appointment_url ); ?>" class="contact-info__btn contact-info__btn--outlined">
						<span><?php echo esc_html( $appointment_label ); ?></span>
					</a>
				</div>

			</div>
		</div>

	</div>
</section>
