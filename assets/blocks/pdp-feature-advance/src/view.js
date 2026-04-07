/**
 * PDP Feature Advance — GSAP-pinned scroll-driven accordion (desktop)
 *                       + auto-play carousel with chevron nav (mobile ≤700px).
 *
 * Uses gsap.matchMedia() so ScrollTrigger is created/killed automatically
 * when the viewport crosses the 700px breakpoint.
 *
 * Desktop: n × SECTION_H scroll budget, GSAP pin + scrub.
 * Mobile:  rAF auto-play (3 s/item, loops), chevron prev/next buttons.
 */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

const MOBILE_BP       = 700;
const MOBILE_DURATION = 3000; // ms per item

const section = document.querySelector( '[data-pfa-block]' );

if ( section ) {
	const items = Array.from( section.querySelectorAll( '[data-pfa-item]' ) );
	const bars  = items.map( ( item ) => item.querySelector( '.pfa-block__item-progress' ) );
	const n     = items.length;

	if ( n > 0 ) {
		const prevBtn = section.querySelector( '.pfa-block__nav-prev' );
		const nextBtn = section.querySelector( '.pfa-block__nav-next' );

		// ── Shared helper: set active item, reset all bars ────────────────
		function setActive( index ) {
			items.forEach( ( item, i ) => {
				item.classList.toggle( 'is-active',    i === index );
				item.classList.toggle( 'is-collapsed', i !== index );
				gsap.set( bars[ i ], { scaleX: 0 } );
			} );
		}

		// ── Initial state (first item active) ────────────────────────────
		setActive( 0 );

		// ── Responsive contexts via gsap.matchMedia() ─────────────────────
		const mm = gsap.matchMedia();

		// ── Mobile ≤700px: auto-play + chevron controls ───────────────────
		mm.add( `(max-width: ${ MOBILE_BP }px)`, () => {
			let currentIndex = 0;
			let startTime    = performance.now();
			let rafId        = null;

			function activate( index ) {
				currentIndex = ( ( index % n ) + n ) % n;
				setActive( currentIndex );
				startTime = performance.now();
			}

			function tick( now ) {
				const progress = Math.min( ( now - startTime ) / MOBILE_DURATION, 1 );
				gsap.set( bars[ currentIndex ], { scaleX: progress } );

				if ( progress >= 1 ) {
					activate( currentIndex + 1 );
				}

				rafId = requestAnimationFrame( tick );
			}

			activate( 0 );
			rafId = requestAnimationFrame( tick );

			function onPrev() {
				cancelAnimationFrame( rafId );
				activate( currentIndex - 1 );
				rafId = requestAnimationFrame( tick );
			}

			function onNext() {
				cancelAnimationFrame( rafId );
				activate( currentIndex + 1 );
				rafId = requestAnimationFrame( tick );
			}

			if ( prevBtn ) prevBtn.addEventListener( 'click', onPrev );
			if ( nextBtn ) nextBtn.addEventListener( 'click', onNext );

			// Cleanup when context is killed (e.g. viewport widens past 700px).
			return () => {
				cancelAnimationFrame( rafId );
				if ( prevBtn ) prevBtn.removeEventListener( 'click', onPrev );
				if ( nextBtn ) nextBtn.removeEventListener( 'click', onNext );
				setActive( 0 );
			};
		} );

		// ── Desktop >700px: GSAP ScrollTrigger pin ────────────────────────
		mm.add( `(min-width: ${ MOBILE_BP + 1 }px)`, () => {
			const SECTION_H = section.offsetHeight || 896;

			const st = ScrollTrigger.create( {
				trigger:    section,
				start:      'top top',
				end:        `+=${ n * SECTION_H }`,
				pin:        true,
				pinSpacing: true,
				scrub:      true,
				onUpdate( self ) {
					const pos         = self.progress * n;
					const activeIndex = Math.min( Math.floor( pos ), n - 1 );
					const localProg   = pos - Math.floor( pos );

					items.forEach( ( item, i ) => {
						const bar = bars[ i ];
						if ( i < activeIndex ) {
							item.classList.remove( 'is-active' );
							item.classList.add( 'is-collapsed' );
							gsap.set( bar, { scaleX: 1 } );
						} else if ( i === activeIndex ) {
							item.classList.add( 'is-active' );
							item.classList.remove( 'is-collapsed' );
							gsap.set( bar, { scaleX: self.progress >= 1 ? 1 : localProg } );
						} else {
							item.classList.remove( 'is-active' );
							item.classList.add( 'is-collapsed' );
							gsap.set( bar, { scaleX: 0 } );
						}
					} );
				},
			} );

			// Cleanup when context is killed (e.g. viewport narrows to ≤700px).
			return () => {
				st.kill();
				setActive( 0 );
			};
		} );
	}
}
