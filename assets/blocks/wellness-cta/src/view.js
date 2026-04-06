/**
 * Wellness CTA — CTA rule hover animation.
 *
 * On mouseenter: wipe the rule out right→left, then back in left→right.
 *
 * Requires GSAP (bundled via esbuild).
 */

import { gsap } from 'gsap';

document.querySelectorAll( '.wellness-cta__cta' ).forEach( ( cta ) => {
	const rule = cta.querySelector( '.wellness-cta__cta-rule' );

	if ( ! rule ) {
		return;
	}

	gsap.set( rule, { scaleX: 1, transformOrigin: 'left center' } );

	cta.addEventListener( 'mouseenter', () => {
		gsap.killTweensOf( rule );
		gsap.set( rule, { transformOrigin: 'right center' } );
		const tl = gsap.timeline();
		tl.to( rule, { scaleX: 0, duration: 0.35, ease: 'power2.in' } );
		tl.set( rule, { transformOrigin: 'left center' } );
		tl.to( rule, { scaleX: 1, duration: 0.45, ease: 'power2.out' } );
	} );
} );
