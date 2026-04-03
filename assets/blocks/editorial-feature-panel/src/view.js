/**
 * Editorial Feature Panel — CTA line hover animation.
 *
 * On mouseenter: wipe the line in from left to right.
 * On mouseleave: line stays in place (no reverse).
 *
 * Requires GSAP (bundled via esbuild).
 */

import { gsap } from 'gsap';

document.querySelectorAll( '.pdp-feature__cta' ).forEach( ( cta ) => {
	const line = cta.querySelector( '.pdp-feature__cta-line' );

	if ( ! line ) {
		return;
	}

	// Line starts fully visible.
	gsap.set( line, { scaleX: 1, transformOrigin: 'left center' } );

	// On mouseenter: wipe out right→left, then wipe back in left→right.
	cta.addEventListener( 'mouseenter', () => {
		gsap.killTweensOf( line );
		gsap.set( line, { transformOrigin: 'right center' } );
		const tl = gsap.timeline();
		tl.to( line, { scaleX: 0, duration: 0.35, ease: 'power2.in' } );
		tl.set( line, { transformOrigin: 'left center' } );
		tl.to( line, { scaleX: 1, duration: 0.45, ease: 'power2.out' } );
	} );
} );
