/**
 * Simple Rich Text — frontend scroll reveal animation.
 *
 * Word-by-word stagger: heading → body primary → body secondary.
 * One-shot: plays once when section enters the viewport.
 * Preserves inline HTML (e.g. <strong>) by splitting text nodes only.
 *
 * Requires GSAP + ScrollTrigger (bundled via esbuild).
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

/**
 * Walk an element's text nodes and wrap each word in a <span class="srt-word">.
 * Returns the array of created word spans.
 * Preserves surrounding elements (e.g. <strong>, <em>) intact.
 *
 * @param {HTMLElement} el
 * @returns {HTMLElement[]}
 */
function splitWords( el ) {
	const walker = document.createTreeWalker( el, NodeFilter.SHOW_TEXT );
	const textNodes = [];
	let node;

	while ( ( node = walker.nextNode() ) ) {
		textNodes.push( node );
	}

	const spans = [];

	textNodes.forEach( ( textNode ) => {
		const parts = textNode.textContent.split( /(\s+)/ );
		const frag  = document.createDocumentFragment();

		parts.forEach( ( part ) => {
			if ( /\S/.test( part ) ) {
				const span       = document.createElement( 'span' );
				span.className   = 'srt-word';
				span.textContent = part;
				spans.push( span );
				frag.appendChild( span );
			} else if ( part ) {
				frag.appendChild( document.createTextNode( part ) );
			}
		} );

		textNode.parentNode.replaceChild( frag, textNode );
	} );

	return spans;
}

const section = document.querySelector( '.simple-rich-text' );

if ( section ) {
	const heading   = section.querySelector( '.simple-rich-text__heading' );
	const primary   = section.querySelector( '.simple-rich-text__body--primary' );
	const secondary = section.querySelector( '.simple-rich-text__body--secondary' );

	const allWords = [
		...( heading   ? splitWords( heading )   : [] ),
		...( primary   ? splitWords( primary )   : [] ),
		...( secondary ? splitWords( secondary ) : [] ),
	];

	if ( allWords.length ) {
		// Set initial muted state on all words.
		gsap.set( allWords, { color: '#a8a8a8' } );

		gsap.timeline( {
			scrollTrigger: {
				trigger:       section,
				start:         'top bottom',
				toggleActions: 'play none none none',
			},
		} ).to( allWords, {
			color:    '#021f1d',
			ease:     'power2.out',
			duration: 0.4,
			stagger:  {
				each: 0.05,
				from: 'start',
			},
		} );
	}
}
