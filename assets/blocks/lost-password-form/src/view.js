/**
 * Lost Password Form View Script
 *
 * Handles password toggle and form submission for both lost password stages.
 */

( function() {
	'use strict';

	/**
	 * Toggle password visibility.
	 */
	function togglePasswordVisibility( toggleButton ) {
		const inputId = toggleButton.dataset.target;
		const input = document.getElementById( inputId );
		const eyeIcon = toggleButton.querySelector( '.lost-password-form__eye-icon' );

		if ( ! input || ! eyeIcon ) {
			return;
		}

		const isPassword = input.type === 'password';

		// Toggle input type.
		input.type = isPassword ? 'text' : 'password';

		// Toggle icon appearance (slash vs regular).
		if ( isPassword ) {
			eyeIcon.classList.remove( 'lost-password-form__eye-icon--slash' );
			toggleButton.setAttribute( 'aria-label', 'Hide password' );
		} else {
			eyeIcon.classList.add( 'lost-password-form__eye-icon--slash' );
			toggleButton.setAttribute( 'aria-label', 'Show password' );
		}
	}

	/**
	 * Display form messages.
	 */
	function displayMessage( containerId, message, type = 'success' ) {
		const messagesContainer = document.getElementById( containerId );
		if ( ! messagesContainer ) {
			return;
		}

		const messageEl = document.createElement( 'div' );
		messageEl.className = `lost-password-form__message lost-password-form__message--${ type }`;
		messageEl.textContent = message;

		messagesContainer.innerHTML = '';
		messagesContainer.appendChild( messageEl );

		// Scroll to message.
		messageEl.scrollIntoView( { behavior: 'smooth', block: 'nearest' } );

		// Auto-remove success messages after 5 seconds.
		if ( 'success' === type ) {
			setTimeout( () => {
				messageEl.remove();
			}, 5000 );
		}
	}

	/**
	 * Handle Stage 1: Lost Password form submission.
	 */
	async function handleLostPasswordSubmit( event ) {
		event.preventDefault();

		const form = event.target;
		const submitButton = form.querySelector( '#lost-password-submit' );
		const formData = new FormData( form );

		// Disable submit button.
		submitButton.disabled = true;
		submitButton.classList.add( 'lost-password-form__submit--loading' );

		try {
			// Post to current page (WooCommerce handles the form processing)
			const response = await fetch( window.location.href, {
				method: 'POST',
				body: formData,
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
				},
				credentials: 'same-origin',
			} );

			// Get response text for parsing
			const text = await response.text();

			// Parse HTML response
			const parser = new DOMParser();
			const doc = parser.parseFromString( text, 'text/html' );

			// Check for WooCommerce errors first
			const errorNotice = doc.querySelector( '.woocommerce-error, .woocommerce-error li' );
			if ( errorNotice ) {
				const errorMessage = errorNotice.textContent.trim();
				// Filter out the "discreet" message - only show real errors
				if ( ! errorMessage.includes( 'If an email address' ) && ! errorMessage.includes( 'check your email' ) ) {
					displayMessage( 'lost-password-messages', errorMessage, 'error' );
					return;
				}
			}

			// Check for PHP fatal errors or WordPress errors
			const phpErrors = doc.querySelector( '.php-error, .fatal-error, .wp-die-message' );
			if ( phpErrors ) {
				displayMessage( 'lost-password-messages', 'A system error occurred. Please contact site support.', 'error' );
				console.error( 'PHP Error:', phpErrors.textContent );
				return;
			}

			// Check for success messages
			const successNotice = doc.querySelector( '.woocommerce-message, .woocommerce-info' );
			if ( successNotice ) {
				const successMessage = successNotice.textContent.trim();
				displayMessage( 'lost-password-messages', successMessage, 'success' );
				return;
			}

			// Check response status for server errors
			if ( ! response.ok ) {
				if ( response.status >= 500 ) {
					displayMessage( 'lost-password-messages', 'Server error occurred. Please try again later or contact support.', 'error' );
				} else if ( response.status === 404 ) {
					displayMessage( 'lost-password-messages', 'Page not found. Please contact support.', 'error' );
				} else {
					displayMessage( 'lost-password-messages', `Error: ${response.status} - ${response.statusText}`, 'error' );
				}
				return;
			}

			// If redirected, check the redirect URL for errors
			if ( response.redirected ) {
				// Try to fetch the redirected page to check for errors
				try {
					const redirectResponse = await fetch( response.url );
					const redirectText = await redirectResponse.text();
					const redirectDoc = parser.parseFromString( redirectText, 'text/html' );
					const redirectError = redirectDoc.querySelector( '.woocommerce-error, .woocommerce-error li' );

					if ( redirectError && ! redirectError.textContent.includes( 'If an email address' ) ) {
						displayMessage( 'lost-password-messages', redirectError.textContent.trim(), 'error' );
						return;
					}
				} catch ( e ) {
					// If we can't check the redirect, assume success
				}

				displayMessage( 'lost-password-messages', 'Password reset email sent. Please check your inbox.', 'success' );
				return;
			}

			// Default: check if WooCommerce processed the form
			// Look for any form elements that indicate WooCommerce handled it
			const hasWooCommerceNotices = doc.querySelector( '.woocommerce-error, .woocommerce-message, .woocommerce-info' );

			if ( hasWooCommerceNotices ) {
				// Already handled above, but this is a fallback
				displayMessage( 'lost-password-messages', 'If an account exists with that email, a password reset link has been sent.', 'success' );
			} else {
				// No notices from WooCommerce - might be a processing issue
				displayMessage( 'lost-password-messages', 'Password reset email sent. Please check your inbox.', 'success' );
			}

		} catch ( error ) {
			console.error( 'Lost password error:', error );
			displayMessage( 'lost-password-messages', 'An error occurred. Please try again or contact support if the problem persists.', 'error' );
		} finally {
			// Re-enable submit button.
			submitButton.disabled = false;
			submitButton.classList.remove( 'lost-password-form__submit--loading' );
		}
	}

	/**
	 * Handle Stage 2: Reset Password form submission.
	 */
	async function handleResetPasswordSubmit( event ) {
		event.preventDefault();

		const form = event.target;
		const submitButton = form.querySelector( '#reset-password-submit' );
		const formData = new FormData( form );

		// Validate passwords match.
		const password1 = formData.get( 'password_1' );
		const password2 = formData.get( 'password_2' );

		if ( password1 !== password2 ) {
			displayMessage( 'reset-password-messages', 'Passwords do not match.', 'error' );
			return;
		}

		// Validate password strength.
		if ( password1.length < 8 ) {
			displayMessage( 'reset-password-messages', 'Password must be at least 8 characters long.', 'error' );
			return;
		}

		// Disable submit button.
		submitButton.disabled = true;
		submitButton.classList.add( 'lost-password-form__submit--loading' );

		try {
			// Post to current page (WooCommerce handles the form processing)
			const response = await fetch( window.location.href, {
				method: 'POST',
				body: formData,
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
				},
				credentials: 'same-origin',
			} );

			// Get response text for parsing
			const text = await response.text();

			// Parse HTML response
			const parser = new DOMParser();
			const doc = parser.parseFromString( text, 'text/html' );

			// Check for WooCommerce errors
			const errorNotice = doc.querySelector( '.woocommerce-error, .woocommerce-error li' );
			if ( errorNotice ) {
				const errorMessage = errorNotice.textContent.trim();
				displayMessage( 'reset-password-messages', errorMessage, 'error' );
				return;
			}

			// Check for success or redirect
			const successNotice = doc.querySelector( '.woocommerce-message' );
			if ( successNotice || response.redirected ) {
				displayMessage( 'reset-password-messages', 'Password reset successful. Redirecting to login...', 'success' );
				setTimeout( () => {
					window.location.href = '/login/';
				}, 2000 );
				return;
			}

			// Check response status
			if ( ! response.ok ) {
				if ( response.status >= 500 ) {
					displayMessage( 'reset-password-messages', 'Server error occurred. Please try again later.', 'error' );
				} else {
					displayMessage( 'reset-password-messages', `Error: ${response.status}`, 'error' );
				}
				return;
			}

		} catch ( error ) {
			console.error( 'Reset password error:', error );
			displayMessage( 'reset-password-messages', 'An error occurred. Please try again.', 'error' );
		} finally {
			// Re-enable submit button (unless redirecting).
			const isRedirecting = document.querySelector( '.lost-password-form__message--success' );
			if ( ! isRedirecting ) {
				submitButton.disabled = false;
				submitButton.classList.remove( 'lost-password-form__submit--loading' );
			}
		}
	}

	/**
	 * Initialize the lost password forms.
	 */
	function init() {
		// Initialize password toggles.
		const passwordToggles = document.querySelectorAll( '.lost-password-form__password-toggle' );
		passwordToggles.forEach( ( toggle ) => {
			toggle.addEventListener( 'click', function() {
				togglePasswordVisibility( this );
			} );
		} );

		// Initialize Stage 1: Lost Password form.
		const lostPasswordForm = document.getElementById( 'wc-custom-lost-password-form' );
		if ( lostPasswordForm ) {
			lostPasswordForm.addEventListener( 'submit', handleLostPasswordSubmit );
		}

		// Initialize Stage 2: Reset Password form.
		const resetPasswordForm = document.getElementById( 'wc-custom-reset-password-form' );
		if ( resetPasswordForm ) {
			resetPasswordForm.addEventListener( 'submit', handleResetPasswordSubmit );
		}
	}

	// Initialize on DOM ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
