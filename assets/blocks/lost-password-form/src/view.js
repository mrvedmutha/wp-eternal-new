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
			// WooCommerce process_lost_password() only fires on the WooCommerce endpoint,
			// not on a custom page URL. Post there so the handler actually runs.
			const response = await fetch( '/my-account/lost-password/', {
				method: 'POST',
				body: formData,
				credentials: 'same-origin',
			} );

			// A redirect means WooCommerce processed the submission (success or user-not-found).
			// WooCommerce always redirects after processing for privacy — it never reveals
			// whether the email exists.
			if ( response.redirected ) {
				displayMessage( 'lost-password-messages', 'If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.', 'success' );
				return;
			}

			// Non-redirect means something went wrong before WooCommerce could process it.
			// Parse the HTML for any error notices.
			const text = await response.text();
			const parser = new DOMParser();
			const doc = parser.parseFromString( text, 'text/html' );

			const errorItem = doc.querySelector( '.woocommerce-error li' );
			if ( errorItem ) {
				displayMessage( 'lost-password-messages', errorItem.textContent.trim(), 'error' );
				return;
			}

			const errorBlock = doc.querySelector( '.woocommerce-error' );
			if ( errorBlock ) {
				displayMessage( 'lost-password-messages', errorBlock.textContent.trim(), 'error' );
				return;
			}

			displayMessage( 'lost-password-messages', 'Something went wrong. Please try again.', 'error' );

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
