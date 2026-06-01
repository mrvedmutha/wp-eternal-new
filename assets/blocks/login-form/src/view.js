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
		const currentPath = window.location.pathname;

		// Disable submit button.
		submitButton.disabled = true;
		submitButton.classList.add( 'login-form__submit--loading' );

		try {
			const response = await fetch( window.location.href, {
				method: 'POST',
				body: formData,
				headers: {
					'X-Requested-With': 'XMLHttpRequest',
				},
				credentials: 'same-origin',
			} );

			const text = await response.text();

			// WooCommerce redirects away from the login page on success.
			// If the final URL path is different from the login page, the user is now authenticated.
			if ( response.redirected && new URL( response.url ).pathname !== currentPath ) {
				displayMessage( 'Login successful! Redirecting...', 'success' );
				setTimeout( () => {
					window.location.href = response.url;
				}, 800 );
				return;
			}

			// Parse WooCommerce error notices from the response HTML.
			const parser = new DOMParser();
			const doc = parser.parseFromString( text, 'text/html' );

			const errorItem = doc.querySelector( '.woocommerce-error li' );
			if ( errorItem ) {
				displayMessage( errorItem.textContent.trim(), 'error' );
				return;
			}

			const errorBlock = doc.querySelector( '.woocommerce-error' );
			if ( errorBlock ) {
				displayMessage( errorBlock.textContent.trim(), 'error' );
				return;
			}

			displayMessage( 'Login failed. Please check your credentials.', 'error' );

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
