/**
 * Category Split — parallax on panel images.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	document.querySelectorAll( '.category-split__image' ).forEach( ( img ) => {
		const panel = img.closest( '.category-split__panel' );
		if ( ! panel ) return;
		gsap.fromTo( img,
			{ yPercent: 0 },
			{
				yPercent: -25,
				ease: 'none',
				scrollTrigger: {
					trigger: panel,
					start:   'top bottom',
					end:     'bottom top',
					scrub:   1,
				},
			}
		);
	} );
}
