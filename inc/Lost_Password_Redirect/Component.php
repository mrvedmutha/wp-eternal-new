<?php
/**
 * WP_Rig\WP_Rig\Lost_Password_Redirect\Component class
 *
 * @package wp_rig
 */

namespace WP_Rig\WP_Rig\Lost_Password_Redirect;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function add_filter;
use function function_exists;
use function wc_get_page_permalink;
use function wp_safe_redirect;
use function home_url;
use function wp_mail;
use function is_admin;
use function did_action;
use function wc_add_notice;
use function sanitize_email;
use function get_option;

/**
 * Class for handling 301 redirect and email error handling for lost password.
 */
class Component implements Component_Interface {

	/**
	 * Gets the unique identifier for the theme component.
	 *
	 * @return string Component slug.
	 */
	public function get_slug(): string { // phpcs:ignore WordPress.WhiteSpace.SpaceBeforeColon
		return 'lost_password_redirect';
	}

	/**
	 * Adds the action and filter hooks to integrate with WordPress.
	 */
	public function initialize() {
		add_action( 'template_redirect', array( $this, 'handle_lost_password_redirect' ) );
		add_action( 'login_form_lostpassword', array( $this, 'handle_lost_password_submission' ), 5 );
	}

	/**
	 * Handle 301 redirect from /my-account/lost-password/ to /lost-password/.
	 *
	 * This ensures SEO preservation by using a permanent (301) redirect.
	 */
	public function handle_lost_password_redirect() {
		// Only redirect on the lost password page.
		if ( ! function_exists( 'wc_get_page_permalink' ) ) {
			return;
		}

		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$request_uri = wp_unslash( $_SERVER['REQUEST_URI'] ?? '' );
		$request_uri = sanitize_text_field( $request_uri );

		// Check if we're on /my-account/lost-password/.
		if ( strpos( $request_uri, '/my-account/lost-password/' ) !== false || strpos( $request_uri, '/my-account/lost-password' ) !== false ) {
			$new_url = home_url( '/lost-password/' );
			wp_safe_redirect( $new_url, 301 ); // Permanent redirect for SEO.
			exit;
		}
	}

	/**
	 * Intercept lost password form submission to check email configuration.
	 */
	public function handle_lost_password_submission() {
		// Only run this during POST requests.
		// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.MissingUnslash,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$request_method = wp_unslash( $_SERVER['REQUEST_METHOD'] ?? 'GET' );
		$request_method = sanitize_text_field( $request_method );
		if ( 'POST' !== $request_method ) {
			return;
		}

		// Check if this is an AJAX request from our block.
		if ( ! empty( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && 'XMLHttpRequest' === $_SERVER['HTTP_X_REQUESTED_WITH'] ) {
			$this->check_email_configuration();
		}
	}

	/**
	 * Check if email system is properly configured.
	 *
	 * Add error notice if not.
	 */
	private function check_email_configuration() {
		// Check if WP Mail SMTP or similar is configured.
		$mailer     = get_option( 'smtp_mailer', get_option( 'mailer_from', '' ) );
		$from_email = get_option( 'smtp_from_email', get_option( 'admin_email', '' ) );

		// If no mailer is configured and no from email, show error.
		if ( empty( $mailer ) && empty( $from_email ) ) {
			// Check if any transactional email plugin is active.
			$active_plugins = get_option( 'active_plugins', array() );
			$mail_plugins   = array(
				'wp-mail-smtp/wp_mail_smtp.php',
				'wp-mail-smtp-pro/wp_mail_smtp.php',
				'sendgrid-email-delivery-simplified/wpsendgrid.php',
				'mailgun/mailgun.php',
				'post-smtp/post-smtp.php',
				'smtp-mailer/smtp-mailer.php',
				'ses-for-wordpress/ses-for-wp.php',
			);

			$has_mail_plugin = false;
			foreach ( $mail_plugins as $plugin ) {
				if ( in_array( $plugin, $active_plugins, true ) ) {
					$has_mail_plugin = true;
					break;
				}
			}

			if ( ! $has_mail_plugin ) {
				// No mail plugin found - this is likely an error condition.
				add_action(
					'woocommerce_lostpassword_form_message',
					function () {
						wc_add_notice( 'Unable to send password reset email. The email system is not configured. Please contact site support.', 'error' );
					},
					5
				);
			}
		}
	}
}
