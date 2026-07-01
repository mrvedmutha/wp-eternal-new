/**
 * Synthesis Explosion — parallax on background image.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches && window.matchMedia( '(min-width: 1025px)' ).matches ) {
	document.querySelectorAll( '.synthesis-explosion__image' ).forEach( ( img ) => {
		const container = img.closest( '.synthesis-explosion__image-wrap' );
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
