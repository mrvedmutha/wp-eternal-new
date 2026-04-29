/**
 * Single Post — Table of Contents
 *
 * Discovers all H2 / H3 inside .single-post__content, generates the TOC list
 * inside .single-post__toc-list, enables smooth-scroll on click, and highlights
 * the active section using IntersectionObserver.
 */
( function () {
	document.addEventListener( 'DOMContentLoaded', function () {
		const content = document.querySelector( '.single-post__content' );
		const tocList = document.querySelector( '.single-post__toc-list' );

		if ( ! content || ! tocList ) {
			return;
		}

		// ── 1. Discover headings ──────────────────────────────────
		const headings = Array.from(
			content.querySelectorAll( 'h2, h3' )
		);

		if ( headings.length === 0 ) {
			// Hide the TOC column when there are no headings.
			const toc = document.querySelector( '.single-post__toc' );
			if ( toc ) {
				toc.style.display = 'none';
			}
			return;
		}

		// ── 2. Build TOC markup ───────────────────────────────────
		headings.forEach( function ( heading, index ) {
			// Assign a stable ID if the heading doesn't already have one.
			if ( ! heading.id ) {
				heading.id =
					'toc-' +
					index +
					'-' +
					heading.textContent
						.trim()
						.toLowerCase()
						.replace( /[^a-z0-9]+/g, '-' )
						.replace( /^-|-$/g, '' );
			}

			const li = document.createElement( 'li' );
			li.className = 'single-post__toc-item';

			if ( heading.tagName === 'H3' ) {
				li.classList.add( 'single-post__toc-item--sub' );
			}

			const a = document.createElement( 'a' );
			a.href = '#' + heading.id;
			a.textContent = heading.textContent.trim();

			// Smooth scroll — prevent default jump and animate.
			a.addEventListener( 'click', function ( e ) {
				e.preventDefault();
				const target = document.getElementById( heading.id );
				if ( target ) {
					target.scrollIntoView( { behavior: 'smooth', block: 'start' } );
					// Update URL without triggering scroll.
					history.pushState( null, '', '#' + heading.id );
				}
			} );

			li.appendChild( a );
			tocList.appendChild( li );
		} );

		// ── 3. Intersection observer for active state ─────────────
		const tocItems = Array.from(
			tocList.querySelectorAll( '.single-post__toc-item a' )
		);

		let activeIndex = -1;

		function setActive( index ) {
			if ( index === activeIndex ) {
				return;
			}
			tocItems.forEach( function ( link, i ) {
				const li = link.parentElement;
				if ( i === index ) {
					li.classList.add( 'single-post__toc-item--active' );
				} else {
					li.classList.remove( 'single-post__toc-item--active' );
				}
			} );
			activeIndex = index;
		}

		// Activate the first item by default.
		if ( tocItems.length > 0 ) {
			setActive( 0 );
		}

		// Track which headings are in the viewport.
		const observer = new IntersectionObserver(
			function ( entries ) {
				entries.forEach( function ( entry ) {
					if ( ! entry.isIntersecting ) {
						return;
					}
					const id = entry.target.id;
					const matchIndex = tocItems.findIndex(
						function ( link ) {
							return link.getAttribute( 'href' ) === '#' + id;
						}
					);
					if ( matchIndex !== -1 ) {
						setActive( matchIndex );
					}
				} );
			},
			{
				// Fire when the heading enters the top 20% of the viewport.
				rootMargin: '-10% 0px -70% 0px',
				threshold: 0,
			}
		);

		headings.forEach( function ( heading ) {
			observer.observe( heading );
		} );
	} );
} )();
