/**
 * PDP Feature Medium — parallax on right-side image.
 * Only applies to the image variant (not video).
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	document.querySelectorAll( '.pfm-block__media' ).forEach( ( media ) => {
		if ( ! ( media instanceof HTMLImageElement ) ) return;
		const container = media.closest( '.pfm-block__right' );
		if ( ! container ) return;
		gsap.fromTo( media,
			{ yPercent: 0 },
			{
				yPercent: -25,
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
