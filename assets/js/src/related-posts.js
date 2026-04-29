/**
 * Related Posts — AJAX loader
 *
 * Finds every .related-posts block on the page, reads post/term data from
 * data attributes, fetches related posts via AJAX, then replaces the skeleton
 * cards with rendered HTML.
 */
( function () {
	document.addEventListener( 'DOMContentLoaded', function () {
		const blocks = document.querySelectorAll( '.related-posts[data-ajax-url]' );

		blocks.forEach( function ( block ) {
			const ajaxUrl = block.dataset.ajaxUrl;
			const nonce   = block.dataset.nonce;
			const postId  = block.dataset.postId || '0';
			const termIds = block.dataset.termIds || '';
			const count   = block.dataset.count || '3';
			const grid    = block.querySelector( '.related-posts__grid' );

			if ( ! grid || ! ajaxUrl ) {
				return;
			}

			const body = new FormData();
			body.append( 'action',   'wp_rig_related_posts' );
			body.append( 'nonce',    nonce );
			body.append( 'post_id',  postId );
			body.append( 'term_ids', termIds );
			body.append( 'count',    count );

			fetch( ajaxUrl, { method: 'POST', body: body } )
				.then( function ( res ) {
					return res.json();
				} )
				.then( function ( json ) {
					if ( ! json.success || ! Array.isArray( json.data?.posts ) ) {
						return;
					}

					const posts    = json.data.posts;
					const existing = Array.from( grid.querySelectorAll( '.related-posts__card' ) );

					posts.forEach( function ( post, i ) {
						const card = existing[ i ];
						if ( ! card ) {
							return;
						}

						// Mark as loading so we can fade in.
						card.classList.add( 'related-posts__card--loading' );
						card.classList.remove( 'related-posts__card--skeleton' );
						card.setAttribute( 'aria-hidden', 'false' );

						// Build real card HTML.
						const thumbHtml = post.thumb
							? `<a href="${ escAttr( post.url ) }" tabindex="-1" aria-hidden="true">
								<img
									src="${ escAttr( post.thumb ) }"
									alt="${ escAttr( post.title ) }"
									loading="lazy"
									decoding="async"
								>
							</a>`
							: '';

						const eyebrow = post.category
							? `<span class="related-posts__eyebrow">${ escHtml( post.category.toUpperCase() ) }</span>`
							: '';

						card.innerHTML = `
							<div class="related-posts__thumb">${ thumbHtml }</div>
							<div class="related-posts__body">
								<div class="related-posts__body-inner">
									<div class="related-posts__top">
										${ eyebrow }
										<h3 class="related-posts__title">
											<a href="${ escAttr( post.url ) }">${ escHtml( post.title ) }</a>
										</h3>
									</div>
									<time class="related-posts__date" datetime="${ escAttr( post.dateISO ) }">
										${ escHtml( post.date ) }
									</time>
								</div>
							</div>
						`;

						// Fade in after a microtask so the browser paints the opacity:0 first.
						requestAnimationFrame( function () {
							requestAnimationFrame( function () {
								card.classList.remove( 'related-posts__card--loading' );
							} );
						} );
					} );

					// Remove any extra skeleton cards not replaced by posts.
					existing.slice( posts.length ).forEach( function ( card ) {
						card.remove();
					} );
				} )
				.catch( function () {
					// On error leave the skeleton in place — no crash.
				} );
		} );
	} );

	function escHtml( str ) {
		const div = document.createElement( 'div' );
		div.appendChild( document.createTextNode( String( str ) ) );
		return div.innerHTML;
	}

	function escAttr( str ) {
		return String( str )
			.replace( /&/g, '&amp;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#39;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' );
	}
} )();
