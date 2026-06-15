/**
 * Footer — mobile accordion, newsletter form, currency drop-up.
 *
 * Responsibilities:
 *  1. Mobile nav accordion: one-open-at-a-time, chevron rotation, max-height animation.
 *  2. Newsletter form async submission for all .js-newsletter-form elements.
 *  3. Footer currency drop-up toggle.
 */

import gsap from 'gsap';

document.addEventListener( 'DOMContentLoaded', () => {

	// ── Accordion ─────────────────────────────────────────────────────────────
	const items = document.querySelectorAll( '.footer-mobile__acc-item' );

	if ( items.length ) {
		const openItem = ( item ) => {
			item.classList.add( 'is-open' );
			const trigger = item.querySelector( '.footer-mobile__acc-trigger' );
			const body    = item.querySelector( '.footer-mobile__acc-body' );
			body.style.maxHeight = body.scrollHeight + 'px';
			if ( trigger ) trigger.setAttribute( 'aria-expanded', 'true' );
		};

		const closeItem = ( item ) => {
			item.classList.remove( 'is-open' );
			const trigger = item.querySelector( '.footer-mobile__acc-trigger' );
			const body    = item.querySelector( '.footer-mobile__acc-body' );
			body.style.maxHeight = '0';
			if ( trigger ) trigger.setAttribute( 'aria-expanded', 'false' );
		};

		// Open first accordion by default
		openItem( items[ 0 ] );

		items.forEach( ( item ) => {
			const trigger = item.querySelector( '.footer-mobile__acc-trigger' );
			if ( ! trigger ) return;

				trigger.addEventListener( 'click', () => {
				const isOpen = item.classList.contains( 'is-open' );

				// Close all
				items.forEach( closeItem );

				// Open clicked if it was closed
				if ( ! isOpen ) {
					openItem( item );
				}
			} );
		} );
	}

	// ── Newsletter forms ──────────────────────────────────────────────────────
	document.querySelectorAll( '.js-newsletter-form' ).forEach( ( form ) => {
		form.addEventListener( 'submit', async ( e ) => {
			e.preventDefault();

			const endpoint = form.dataset.endpoint;
			const nonce    = form.dataset.nonce;
			const input    = form.querySelector( 'input[type="email"]' );
			const msg      = form.querySelector( '.js-newsletter-msg' );

			if ( ! endpoint || ! input ) return;

			try {
				const res = await fetch( endpoint, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': nonce,
					},
					body: JSON.stringify( { email: input.value } ),
				} );
				const data = await res.json();

				if ( msg ) {
					msg.hidden = false;
					msg.textContent = data.message || ( res.ok ? 'Thank you for subscribing!' : 'Something went wrong.' );
				}

				if ( res.ok ) {
					input.value = '';
				}
			} catch {
				if ( msg ) {
					msg.hidden = false;
					msg.textContent = 'Something went wrong. Please try again.';
				}
			}
		} );
	} );

	// ── Currency drop-up ──────────────────────────────────────────────────────
	const currencyTrigger = document.querySelector( '.footer-bar__currency-trigger' );
	const currencyDropup  = document.querySelector( '.footer-bar__currency-dropup' );

	if ( currencyTrigger && currencyDropup ) {
		const openDropup = () => {
			currencyDropup.removeAttribute( 'hidden' );
			currencyTrigger.setAttribute( 'aria-expanded', 'true' );
			gsap.fromTo(
				currencyDropup,
				{ opacity: 0, y: 6 },
				{ opacity: 1, y: 0, duration: 0.2, ease: 'power1.out' }
			);
		};

		const closeDropup = () => {
			gsap.to( currencyDropup, {
				opacity: 0,
				y: 6,
				duration: 0.15,
				ease: 'power1.in',
				onComplete() {
					currencyDropup.setAttribute( 'hidden', '' );
				},
			} );
			currencyTrigger.setAttribute( 'aria-expanded', 'false' );
		};

		// Desktop: open/close on hover.
		const isDesktop = () => window.innerWidth > 1024;
		let hoverCloseTimer;

		currencyTrigger.closest( '.footer-bar__currency' ).addEventListener( 'mouseenter', () => {
			if ( ! isDesktop() ) return;
			clearTimeout( hoverCloseTimer );
			openDropup();
		} );

		currencyTrigger.closest( '.footer-bar__currency' ).addEventListener( 'mouseleave', () => {
			if ( ! isDesktop() ) return;
			hoverCloseTimer = setTimeout( closeDropup, 100 );
		} );

		// Click still works on all screen sizes (mobile tap + desktop toggle).
		currencyTrigger.addEventListener( 'click', () => {
			const isOpen = currencyTrigger.getAttribute( 'aria-expanded' ) === 'true';
			isOpen ? closeDropup() : openDropup();
		} );

		document.addEventListener( 'click', ( e ) => {
			if (
				! currencyTrigger.contains( e.target ) &&
				! currencyDropup.contains( e.target )
			) {
				closeDropup();
			}
		} );

		document.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'Escape' ) closeDropup();
		} );
	}

} );
