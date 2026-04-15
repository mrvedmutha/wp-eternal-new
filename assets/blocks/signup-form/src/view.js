/**
 * Frontend JavaScript for Signup Form block.
 *
 * Handles form submission, password toggle, and API communication.
 *
 * @package wp_rig
 */

( function() {
	'use strict';

	// Wait for DOM to be ready.
	document.addEventListener( 'DOMContentLoaded', function() {
		// Don't run in block editor or admin context.
		if ( document.body.classList.contains( 'block-editor-page' ) ||
			document.body.classList.contains( 'wp-admin' ) ) {
			return;
		}

		const form = document.getElementById( 'wc-custom-signup-form' );
		if ( ! form ) {
			return;
		}

		// Password toggle functionality.
		const passwordToggles = document.querySelectorAll( '.signup-form__password-toggle' );
		passwordToggles.forEach( function( toggle ) {
			toggle.addEventListener( 'click', function() {
				const targetId = this.dataset.target;
				const input = document.getElementById( targetId );
				if ( ! input ) {
					return;
				}

				if ( input.type === 'password' ) {
					input.type = 'text';
					this.setAttribute( 'aria-label', 'Hide password' );
				} else {
					input.type = 'password';
					this.setAttribute( 'aria-label', 'Show password' );
				}
			} );
		} );

		// Form submission handler.
		form.addEventListener( 'submit', async function( e ) {
			e.preventDefault();

			// Get form data.
			const formData = new FormData( form );

			// Build data object.
			const data = {
				first_name: formData.get( 'first_name' ) || '',
				last_name: formData.get( 'last_name' ) || '',
				email: formData.get( 'email' ) || '',
				password: formData.get( 'password' ) || '',
				confirm_password: formData.get( 'confirm_password' ) || '',
				marketing_consent: formData.has( 'marketing_consent' ),
			};

			// Add captcha token if present.
			const captchaToken = document.getElementById( 'captcha_token' );
			if ( captchaToken && captchaToken.value ) {
				data.captcha_token = captchaToken.value;
			}

			// Get nonce.
			const nonceInput = form.querySelector( '[name="wc_signup_nonce"]' );
			const nonce = nonceInput ? nonceInput.value : '';

			// Show loading state.
			const submitBtn = document.getElementById( 'signup-submit' );
			const originalBtnText = submitBtn.textContent;
			submitBtn.disabled = true;
			submitBtn.textContent = 'Creating Account...';
			submitBtn.classList.add( 'signup-form__submit--loading' );

			// Clear previous messages.
			const messagesDiv = document.getElementById( 'signup-messages' );
			messagesDiv.innerHTML = '';
			messagesDiv.className = 'signup-form__messages';

			try {
				const response = await fetch( '/wp-json/wc-register/v1/signup', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': nonce,
					},
					body: JSON.stringify( data ),
				} );

				const result = await response.json();

				if ( result.success ) {
					// Success - show message and redirect.
					messagesDiv.innerHTML = '<div class="signup-form__message signup-form__message--success">' +
						escapeHTML( result.message || 'Account created successfully! Redirecting...' ) +
						'</div>';

					setTimeout( function() {
						if ( result.redirect_url ) {
							window.location.href = result.redirect_url;
						} else {
							// Fallback to my account page.
							const myAccountUrl = form.querySelector( '.signup-form__footer a' );
							if ( myAccountUrl ) {
								window.location.href = myAccountUrl.href;
							}
						}
					}, 1500 );
				} else {
					// Error - show message.
					showErrorMessage( result.code, result.message || 'An error occurred. Please try again.' );
				}
			} catch ( error ) {
				console.error( 'Signup error:', error );
				messagesDiv.innerHTML = '<div class="signup-form__message signup-form__message--error">' +
					escapeHTML( 'An error occurred. Please try again.' ) +
					'</div>';
			} finally {
				// Reset button state.
				submitBtn.disabled = false;
				submitBtn.textContent = originalBtnText;
				submitBtn.classList.remove( 'signup-form__submit--loading' );
			}
		} );

		/**
		 * Show error message based on error code.
		 *
		 * @param {string} code - Error code.
		 * @param {string} message - Error message.
		 */
		function showErrorMessage( code, message ) {
			const messagesDiv = document.getElementById( 'signup-messages' );
			let errorMessage = escapeHTML( message );

			// Add specific handling for known error codes.
			switch ( code ) {
				case 'email_exists':
					errorMessage = escapeHTML( message ) +
						' <a href="/my-account/">Log in here</a>';
					break;

				case 'passwords_mismatch':
					// Highlight password fields.
					const password = document.getElementById( 'password' );
					const confirmPassword = document.getElementById( 'confirm_password' );
					if ( password ) password.classList.add( 'signup-form__input--error' );
					if ( confirmPassword ) confirmPassword.classList.add( 'signup-form__input--error' );
					break;

				case 'rest_invalid_param':
					// Highlight invalid fields based on message.
					if ( message.includes( 'email' ) ) {
						const email = document.getElementById( 'email' );
						if ( email ) email.classList.add( 'signup-form__input--error' );
					}
					if ( message.includes( 'password' ) ) {
						const password = document.getElementById( 'password' );
						if ( password ) password.classList.add( 'signup-form__input--error' );
					}
					break;
			}

			messagesDiv.innerHTML = '<div class="signup-form__message signup-form__message--error">' +
				errorMessage +
				'</div>';
		}

		/**
		 * Escape HTML to prevent XSS.
		 *
		 * @param {string} str - String to escape.
		 * @return {string} Escaped string.
		 */
		function escapeHTML( str ) {
			const div = document.createElement( 'div' );
			div.textContent = str;
			return div.innerHTML;
		}
	} );
} )();
