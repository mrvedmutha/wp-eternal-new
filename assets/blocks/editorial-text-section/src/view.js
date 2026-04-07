/**
 * Editorial Text Section — frontend animation
 *
 * Sticky behaviour is handled by CSS (position: sticky).
 * The 80px spacer div in the HTML ensures pinning starts from
 * the eyebrow position, not the top of the section wrapper.
 *
 * Word reveal: one-shot, plays once when section enters viewport.
 * Zones animate sequentially: eyebrow → body paragraphs → pull quote.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

const section = document.querySelector( '.editorial-text-section' );

if ( section ) {
	/**
	 * Splits an element's text into word spans and returns the NodeList.
	 *
	 * @param {Element} el Target element.
	 * @return {NodeList} The injected .ets-word spans.
	 */
	function wrapWords( el ) {
		const words = el.textContent.trim().split( /\s+/ );
		el.innerHTML = words
			.map( ( w ) => `<span class="ets-word">${ w }</span>` )
			.join( ' ' );
		return el.querySelectorAll( '.ets-word' );
	}

	const eyebrow    = section.querySelector( '.editorial-text-section__eyebrow' );
	const bodyParas  = section.querySelectorAll( '.editorial-text-section__body-p' );
	const pullQuote  = section.querySelector( '.editorial-text-section__pull-quote' );

	const allWordSets = [];

	if ( eyebrow ) {
		allWordSets.push( wrapWords( eyebrow ) );
	}

	bodyParas.forEach( ( p ) => {
		allWordSets.push( wrapWords( p ) );
	} );

	if ( pullQuote ) {
		allWordSets.push( wrapWords( pullQuote ) );
	}

	if ( allWordSets.length ) {
		const tl = gsap.timeline( {
			scrollTrigger: {
				trigger:       section,
				start:         'top bottom',
				toggleActions: 'play none none none',
			},
		} );

		allWordSets.forEach( ( wordSpans ) => {
			tl.to(
				wordSpans,
				{
					color:    '#021f1d',
					opacity:  1,
					ease:     'power2.out',
					duration: 0.4,
					stagger:  {
						each: 0.05,
						from: 'start',
					},
				},
				'<0.1' // each zone starts 0.1s after the previous finishes
			);
		} );
	}
}
