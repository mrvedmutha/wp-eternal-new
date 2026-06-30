import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin( ScrollTrigger );

document.querySelectorAll( '.hhl' ).forEach( ( hero ) => {
	const slides = Array.from( hero.querySelectorAll( '.hhl__slide' ) );
	const panels = Array.from( hero.querySelectorAll( '.hhl__panel' ) );

	if ( ! slides.length ) return;

	const interval = parseInt( hero.dataset.interval, 10 ) || 5000;

	// ── Entrance animation — first panel's content only ──────────────
	// CSS holds heading/subtext/cta at opacity:0 on --first panel.
	// GSAP animates them in, matching the original homepage-hero behaviour.
	const firstPanel = panels[ 0 ];
	if ( firstPanel ) {
		const els = firstPanel.querySelectorAll( '.hhl__heading, .hhl__subtext, .hhl__cta' );
		if ( els.length ) {
			gsap.fromTo(
				els,
				{ opacity: 0, y: -20 },
				{ opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.2 }
			);
		}
	}

	if ( slides.length <= 1 ) return;

	// ── Multi-slide crossfade ─────────────────────────────────────────
	// Images and content panels fade simultaneously (position 0 in timeline).
	let current     = 0;
	let isAnimating = false;

	function goTo( next ) {
		if ( isAnimating || next === current ) return;
		isAnimating = true;

		const prev = current;
		current    = next;

		const tl = gsap.timeline( { onComplete: () => { isAnimating = false; } } );

		// Images crossfade
		tl.to( slides[ prev ], { opacity: 0, duration: 1, ease: 'power2.inOut' }, 0 );
		tl.to( slides[ next ], { opacity: 1, duration: 1, ease: 'power2.inOut' }, 0 );

		// Content panels crossfade — also restore pointer-events
		if ( panels[ prev ] ) {
			tl.to( panels[ prev ], { opacity: 0, duration: 1, ease: 'power2.inOut', pointerEvents: 'none' }, 0 );
		}
		if ( panels[ next ] ) {
			tl.to( panels[ next ], { opacity: 1, duration: 1, ease: 'power2.inOut', pointerEvents: 'auto' }, 0 );
		}
	}

	setInterval( () => {
		goTo( ( current + 1 ) % slides.length );
	}, interval );
} );

// ── Parallax on hero background images ───────────────────────────
if ( ! window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) {
	document.querySelectorAll( '.hhl__bg img' ).forEach( ( img ) => {
		const slide = img.closest( '.hhl__slide' );
		if ( ! slide ) return;
		gsap.fromTo( img,
			{ yPercent: 0 },
			{
				yPercent: -25,
				ease: 'none',
				scrollTrigger: {
					trigger: slide.closest( '.hhl' ),
					start:   'top bottom',
					end:     'bottom top',
					scrub:   1,
				},
			}
		);
	} );
}
