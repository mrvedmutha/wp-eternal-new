/**
 * Login Form View Script
 *
 * Handles password toggle and form submission.
 */

( function() {
	'use strict';

	/**
	 * Toggle password visibility.
	 */
	function togglePasswordVisibility( toggleButton ) {
		const inputId = toggleButton.dataset.target;
		const input = document.getElementById( inputId );
		const eyeIcon = toggleButton.querySelector( '.login-form__eye-icon' );

		if ( ! input || ! eyeIcon ) {
			return;
		}

		const isPassword = input.type === 'password';

		// Toggle input type.
		input.type = isPassword ? 'text' : 'password';

		// Toggle icon appearance (slash vs regular).
		if ( isPassword ) {
			eyeIcon.classList.remove( 'login-form__eye-icon--slash' );
			toggleButton.setAttribute( 'aria-label', 'Hide password' );
		} else {
			eyeIcon.classList.add( 'login-form__eye-icon--slash' );
			toggleButton.setAttribute( 'aria-label', 'Show password' );
		}
	}

	/**
	 * Display form messages.
	 */
	function displayMessage( message, type = 'success' ) {
		const messagesContainer = document.getElementById( 'login-messages' );
		if ( ! messagesContainer ) {
			return;
		}

		const messageEl = document.createElement( 'div' );
		messageEl.className = `login-form__message login-form__message--${ type }`;
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
	 * Handle form submission via AJAX.
	 */
	async function handleLoginSubmit( event ) {
		event.preventDefault();

		const form = event.target;
		const submitButton = form.querySelector( '#login-submit' );
		const formData = new FormData( form );

		// Disable submit button.
		submitButton.disabled = true;
		submitButton.classList.add( 'login-form__submit--loading' );

		try {
			// Post to WooCommerce login endpoint
			const loginUrl = window.location.href; // Current page URL

			const response = await fetch( loginUrl, {
				method: 'POST',
				body: formData,
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
				},
				credentials: 'same-origin',
			} );

			// Check if response is HTML (WooCommerce redirect on success)
			const contentType = response.headers.get( 'content-type' );
			if ( contentType && contentType.includes( 'text/html' ) ) {
				// Login was successful, redirect to my-account
				displayMessage( 'Login successful! Redirecting...', 'success' );
				const redirectUrl = form.querySelector( 'input[name="redirect"]' )?.value || '/my-account/';
				setTimeout( () => {
					window.location.href = redirectUrl;
				}, 1000 );
				return;
			}

			// Try to parse JSON response
			const data = await response.json();

			if ( data.success ) {
				displayMessage( 'Login successful! Redirecting...', 'success' );
				setTimeout( () => {
					const redirectUrl = form.querySelector( 'input[name="redirect"]' )?.value || '/my-account/';
					window.location.href = redirectUrl;
				}, 1000 );
			} else {
				displayMessage( data.message || 'Login failed. Please try again.', 'error' );
			}
		} catch ( error ) {
			displayMessage( 'An error occurred. Please try again.', 'error' );
		} finally {
			// Re-enable submit button.
			submitButton.disabled = false;
			submitButton.classList.remove( 'login-form__submit--loading' );
		}
	}

	/**
	 * Initialize the login form.
	 */
	function init() {
		// Initialize password toggles.
		const passwordToggles = document.querySelectorAll( '.login-form__password-toggle' );
		passwordToggles.forEach( ( toggle ) => {
			toggle.addEventListener( 'click', function() {
				togglePasswordVisibility( this );
			} );
		} );

		// Initialize form submission.
		const loginForm = document.getElementById( 'wc-custom-login-form' );
		if ( loginForm ) {
			loginForm.addEventListener( 'submit', handleLoginSubmit );
		}
	}

	// Initialize on DOM ready.
	if ( document.readyState === 'loading' ) {
		document.addEventListener( 'DOMContentLoaded', init );
	} else {
		init();
	}
} )();
