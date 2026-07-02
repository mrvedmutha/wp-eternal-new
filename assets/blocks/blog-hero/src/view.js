/**
 * Blog Hero — frontend scroll parallax.
 *
 * Loaded automatically by WordPress only on pages that contain
 * the wp-rig/blog-hero block (via viewScript in block.json).
 *
 * Same technique as hero-image-parallax: the background image is
 * pre-scaled to 130% height inside an overflow:hidden section and
 * panned with transform (yPercent), so movement is always visible
 * regardless of the uploaded image's aspect ratio.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

if (
	!window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
	window.matchMedia('(min-width: 1025px)').matches
) {
	document.querySelectorAll('.blog-hero').forEach((hero) => {
		const bg = hero.querySelector('.blog-hero__bg');

		if (!bg) {
			return;
		}

		gsap.fromTo(
			bg,
			{ yPercent: -8 },
			{
				yPercent: 8,
				ease: 'none',
				scrollTrigger: {
					trigger: hero,
					start: 'top bottom',
					end: 'bottom top',
					scrub: 1,
				},
			}
		);
	});
}
