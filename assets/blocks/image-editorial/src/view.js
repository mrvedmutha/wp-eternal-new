/**
 * Image Editorial — frontend animation
 *
 * Stagger reveal on scroll entry: each element (headline, then each body
 * paragraph) fades in and slides down from slightly above into position.
 * Elements animate sequentially top → bottom, one-shot.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

const section = document.querySelector( '.image-editorial' );

if ( section && ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	const headline  = section.querySelector( '.image-editorial__headline' );
	const bodyParas = section.querySelectorAll( '.image-editorial__body-p' );

	const elements = [
		...( headline ? [ headline ] : [] ),
		...Array.from( bodyParas ),
	];

	if ( elements.length ) {
		gsap.set( elements, { opacity: 0, y: -20 } );

		gsap.to( elements, {
			opacity: 1,
			y: 0,
			ease: 'power2.out',
			duration: 0.6,
			stagger: 0.15,
			scrollTrigger: {
				trigger: section,
				start: 'top bottom',
				toggleActions: 'play none none none',
			},
		} );
	}
}
