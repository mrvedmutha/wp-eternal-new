import { gsap } from 'gsap';

document.querySelectorAll( '.hhl' ).forEach( ( hero ) => {
	const slides = Array.from( hero.querySelectorAll( '.hhl__slide' ) );
	if ( ! slides.length ) return;

	const interval = parseInt( hero.dataset.interval, 10 ) || 5000;

	// ── Entrance animation for the first slide's content ─────────────
	const firstContent = slides[ 0 ].querySelectorAll( '.hhl__heading, .hhl__subtext, .hhl__cta' );
	if ( firstContent.length ) {
		gsap.fromTo(
			firstContent,
			{ opacity: 0, y: -20 },
			{ opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.2 }
		);
	}

	if ( slides.length <= 1 ) return;

	// ── Multi-slide setup ─────────────────────────────────────────────
	// CSS already sets .hhl__slide { opacity:0 } and .hhl__slide--first { opacity:1 }
	// so there's no flash before JS runs. GSAP takes over from here.
	let current     = 0;
	let isAnimating = false;

	function goTo( next ) {
		if ( isAnimating || next === current ) return;
		isAnimating = true;

		const outSlide = slides[ current ];
		const inSlide  = slides[ next ];
		current        = next;

		gsap.timeline( {
			onComplete: () => { isAnimating = false; },
		} )
			.to( outSlide, { opacity: 0, duration: 1, ease: 'power2.inOut' }, 0 )
			.to( inSlide,  { opacity: 1, duration: 1, ease: 'power2.inOut' }, 0 );
	}

	setInterval( () => {
		goTo( ( current + 1 ) % slides.length );
	}, interval );
} );
