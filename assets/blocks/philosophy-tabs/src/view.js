/**
 * Philosophy Tabs — frontend tab-switching animation.
 *
 * Image transition: clip-path wipe.
 *   Forward  (prev → next, index increases): bottom-to-top reveal.
 *   Backward (prev → next, index decreases): top-to-bottom reveal.
 *
 * Text transition: outgoing fades out (0.4s), incoming fades in near-instantly
 * (0.15s after 0.05s delay). No directional logic for text.
 *
 * Panel layout: all panels are CSS grid-stacked (grid-area: 1/1) so the
 * container height never changes on switch — no padding jump.
 *
 * Requires GSAP (bundled via esbuild).
 */

import { gsap } from 'gsap';

const block = document.querySelector( '[data-pt-block]' );

if ( block ) {
	const tabBtns = Array.from( block.querySelectorAll( '.pt-tab-btn' ) );
	const images  = Array.from( block.querySelectorAll( '[data-pt-image]' ) );
	const panels  = Array.from( block.querySelectorAll( '[data-pt-panel]' ) );

	let current   = 0;
	let animating = false;

	// Initial image state: first visible, rest clipped out.
	images.forEach( ( img, i ) => {
		gsap.set( img, {
			clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
			zIndex:   i === 0 ? 1 : 0,
		} );
	} );

	// Initial panel state: handled by CSS (.pt-panel opacity:0, .is-active opacity:1).
	// Remove the PHP-set [hidden] attrs so all panels are in the layout grid.
	panels.forEach( ( panel ) => {
		panel.removeAttribute( 'hidden' );
	} );

	function switchTab( next ) {
		if ( next === current || animating ) return;
		animating = true;

		const prev    = current;
		const forward = next > prev;

		const incoming = images[ next ];
		const outgoing = images[ prev ];
		const panelIn  = panels[ next ];
		const panelOut = panels[ prev ];
		const btnIn    = tabBtns[ next ];
		const btnOut   = tabBtns[ prev ];

		// Clip start: forward = slide up from bottom, backward = slide down from top.
		const clipStart = forward ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)';
		const clipEnd   = 'inset(0% 0% 0% 0%)';

		// Lift incoming above outgoing.
		gsap.set( incoming, { clipPath: clipStart, zIndex: 2 } );
		gsap.set( outgoing, { zIndex: 1 } );

		// Wipe incoming image in.
		gsap.to( incoming, {
			clipPath: clipEnd,
			duration: 0.7,
			ease: 'power2.inOut',
			onComplete: () => {
				gsap.set( outgoing, {
					clipPath: forward ? 'inset(0% 0% 100% 0%)' : 'inset(100% 0% 0% 0%)',
					zIndex: 0,
				} );
				gsap.set( incoming, { zIndex: 1 } );
				animating = false;
			},
		} );

		// Text: fade out previous panel, fade in next (no direction logic).
		gsap.to( panelOut, {
			opacity: 0,
			duration: 0.4,
			ease: 'power1.out',
			onComplete: () => {
				panelOut.classList.remove( 'is-active' );
				gsap.set( panelOut, { pointerEvents: 'none' } );
			},
		} );

		gsap.fromTo(
			panelIn,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 0.15,
				delay: 0.05,
				ease: 'none',
				onStart: () => {
					panelIn.classList.add( 'is-active' );
					gsap.set( panelIn, { pointerEvents: 'auto' } );
				},
			}
		);

		// Tab button active states.
		btnOut.classList.remove( 'is-active' );
		btnOut.setAttribute( 'aria-selected', 'false' );
		btnIn.classList.add( 'is-active' );
		btnIn.setAttribute( 'aria-selected', 'true' );

		current = next;
	}

	tabBtns.forEach( ( btn, i ) => {
		btn.addEventListener( 'click', () => switchTab( i ) );
	} );
}
