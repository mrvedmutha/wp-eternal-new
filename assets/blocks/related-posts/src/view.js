/**
 * Related Posts block — frontend view script.
 *
 * Loaded automatically by WordPress whenever the block is rendered (viewScript).
 * Works on single posts (related mode) and any other page (latest mode).
 */

function escHtml( str ) {
	return String( str )
		.replace( /&/g, '&amp;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		.replace( /"/g, '&quot;' );
}

function buildCardHtml( post ) {
	const thumb = post.thumb
		? `<a href="${ escHtml( post.url ) }" tabindex="-1" aria-hidden="true">
				<img src="${ escHtml( post.thumb ) }" alt="${ escHtml( post.title ) }" loading="lazy">
			</a>`
		: '';

	return `
		<div class="related-posts__thumb">${ thumb }</div>
		<div class="related-posts__body">
			<div class="related-posts__body-inner">
				<div class="related-posts__top">
					<span class="related-posts__eyebrow">${ escHtml( post.category ) }</span>
					<h3 class="related-posts__title">
						<a href="${ escHtml( post.url ) }">${ escHtml( post.title ) }</a>
					</h3>
				</div>
				<time class="related-posts__date" datetime="${ escHtml( post.dateISO ) }">${ escHtml( post.date ) }</time>
			</div>
		</div>
	`;
}

document.addEventListener( 'DOMContentLoaded', function () {
	document.querySelectorAll( '.related-posts[data-ajax-url]' ).forEach( function ( section ) {
		const ajaxUrl = section.dataset.ajaxUrl;
		const nonce   = section.dataset.nonce;
		const postId  = section.dataset.postId || '0';
		const termIds = section.dataset.termIds || '';
		const count   = section.dataset.count || '3';
		const mode    = section.dataset.mode || 'latest';
		const grid    = section.querySelector( '.related-posts__grid' );

		if ( ! grid || ! ajaxUrl ) {
			return;
		}

		const body = new FormData();
		body.append( 'action', 'wp_rig_related_posts' );
		body.append( 'nonce', nonce );
		body.append( 'post_id', postId );
		body.append( 'term_ids', termIds );
		body.append( 'count', count );
		body.append( 'mode', mode );

		fetch( ajaxUrl, { method: 'POST', body } )
			.then( ( r ) => r.json() )
			.then( ( r ) => {
				if ( ! r.success || ! Array.isArray( r.data?.posts ) ) {
					return;
				}

				const posts    = r.data.posts;
				const skeletons = Array.from( grid.querySelectorAll( '.related-posts__card' ) );

				posts.forEach( function ( post, i ) {
					const card = skeletons[ i ];
					if ( ! card ) {
						return;
					}

					card.classList.add( 'related-posts__card--loading' );
					card.classList.remove( 'related-posts__card--skeleton' );
					card.setAttribute( 'aria-hidden', 'false' );
					card.innerHTML = buildCardHtml( post );

					// Trigger fade-in after paint
					requestAnimationFrame( function () {
						requestAnimationFrame( function () {
							card.classList.remove( 'related-posts__card--loading' );
						} );
					} );
				} );
			} )
			.catch( function () {
				// Silently fail — skeletons remain visible
			} );
	} );
} );
