/**
 * Editorial Feature Panel — CTA line hover + parallax image animation.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

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

// ── Parallax on feature images ────────────────────────────────────
if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	document.querySelectorAll( '.pdp-feature__img' ).forEach( ( img ) => {
		const container = img.closest( '.pdp-feature__image' );
		if ( ! container ) return;
		gsap.fromTo( img,
			{ yPercent: 0 },
			{
				yPercent: -30,
				ease: 'none',
				scrollTrigger: {
					trigger: container,
					start:   'top bottom',
					end:     'bottom top',
					scrub:   1,
				},
			}
		);
	} );
}
