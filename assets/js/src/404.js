/**
 * 404 Page Animations
 *
 * Home link hover: underline draws left→right on enter, right→left on leave.
 * Follows the same pattern as homepage-hero CTA animations.
 *
 * Requires GSAP (already installed as a project dependency).
 */

import { gsap } from 'gsap';

const link = document.querySelector( '.js-404-underline' );

if ( link ) {
	const line = link.querySelector( '.error-404__home-link__line' );

	// ── Home link underline hover ─────────────────────────────────────
	// Line starts fully visible (scaleX: 1).
	// mouseenter triggers a wipe: right→left out, then left→right in.

	if ( line ) {
		gsap.set( line, { scaleX: 1, transformOrigin: 'left center' } );

		link.addEventListener( 'mouseenter', () => {
			gsap.killTweensOf( line );
			gsap.set( line, { transformOrigin: 'right center' } );
			const wipeTl = gsap.timeline();
			wipeTl.to( line, { scaleX: 0, duration: 0.35, ease: 'power2.in' } );
			wipeTl.set( line, { transformOrigin: 'left center' } );
			wipeTl.to( line, { scaleX: 1, duration: 0.45, ease: 'power2.out' } );
		} );
	}
}
