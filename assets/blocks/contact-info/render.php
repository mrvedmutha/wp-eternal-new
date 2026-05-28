<?php
/**
 * Contact Info Panel block render template.
 *
 * @package wp_rig
 */

declare( strict_types=1 );

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$attributes        = is_array( $attributes ?? null ) ? $attributes : array();
$heading           = $attributes['heading'] ?? 'Contact Us';
$body              = $attributes['body'] ?? 'Have a question, need support, or just want to chat about our products? Our team is ready to assist you. Reach out and we\'ll get back to you as soon as possible.';
$email             = $attributes['email'] ?? 'customerservice@eternallabs.health';
$email_href        = esc_url( $attributes['emailHref'] ?? 'mailto:customerservice@eternallabs.health' );
$hours             = $attributes['hours'] ?? 'Mon - Fri, 9:30am - 5:30pm (GMT & EST)';
$chat_label        = $attributes['chatLabel'] ?? 'CHAT WITH US';
$chat_url          = esc_url( $attributes['chatUrl'] ?? '#' );
$appointment_label = $attributes['appointmentLabel'] ?? 'BOOK APPOINTMENT';
$appointment_url   = esc_url( $attributes['appointmentUrl'] ?? '#' );

$wrapper_attrs = get_block_wrapper_attributes( array( 'class' => 'contact-info-wrapper' ) );

?>
<div <?php echo $wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
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
				<span><?php echo esc_html( $chat_label ); ?></span>
			</a>
			<a href="<?php echo esc_url( $appointment_url ); ?>" class="contact-info__btn contact-info__btn--outlined">
				<span><?php echo esc_html( $appointment_label ); ?></span>
			</a>
		</div>

	</div>
</div>
