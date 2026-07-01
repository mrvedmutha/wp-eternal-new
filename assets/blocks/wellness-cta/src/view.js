/**
 * Wellness CTA — CTA rule hover animation + parallax image.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

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

// ── Parallax on wellness image ────────────────────────────────────
if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches && window.matchMedia( '(min-width: 1025px)' ).matches ) {
	document.querySelectorAll( '.wellness-cta__img' ).forEach( ( img ) => {
		const container = img.closest( '.wellness-cta__image-bg' );
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
