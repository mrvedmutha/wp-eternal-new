/**
 * Blog Posts Grid — AJAX tab filtering + pagination + skeleton + pushState.
 *
 * Context: /blog page (is-home=1) — tab clicks → AJAX, no page redirect.
 *          /category/* pages (is-home=0) — tab clicks → page routing (handled by server).
 *          Both contexts: pagination clicks → AJAX.
 */

interface WpRigBlog {
	ajaxUrl: string;
	nonce: string;
	blogUrl: string;
	isHome: string;
	isCategory: string;
}

declare const wpRigBlog: WpRigBlog;

interface FetchBlogOptions {
	category: string;
	paged: number;
	postsPerPage: number;
}

// ── Selectors ────────────────────────────────────────────────────────────────

function getGrid(): HTMLElement | null {
	return document.querySelector( '.blog-posts-grid' );
}
function getCardsContainer(): HTMLElement | null {
	return document.getElementById( 'blog-grid-cards' );
}
function getPaginationContainer(): HTMLElement | null {
	return document.getElementById( 'blog-grid-pagination' );
}
function getTabs(): NodeListOf<HTMLElement> {
	return document.querySelectorAll( '.blog-posts-grid__tab' );
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function buildSkeletonCards( count: number ): string {
	let html = '';
	for ( let i = 0; i < count; i++ ) {
		html += `
			<article class="blog-card blog-card--skeleton">
				<div class="blog-card__thumb-link">
					<div class="blog-card__thumb-wrap"></div>
				</div>
				<div class="blog-card__body">
					<span class="blog-card__eyebrow">&nbsp;</span>
					<h3 class="blog-card__title">&nbsp;</h3>
					<time class="blog-card__date">&nbsp;</time>
				</div>
			</article>`;
	}
	return html;
}

function showSkeleton( cardsEl: HTMLElement, count: number ): void {
	cardsEl.innerHTML = buildSkeletonCards( count );
}

// ── AJAX fetch ────────────────────────────────────────────────────────────────

async function fetchBlogPosts( opts: FetchBlogOptions ): Promise<void> {
	const cardsEl = getCardsContainer();
	const paginEl = getPaginationContainer();

	if ( ! cardsEl ) return;

	showSkeleton( cardsEl, opts.postsPerPage );
	if ( paginEl ) paginEl.innerHTML = '';

	const body = new FormData();
	body.append( 'action', 'wp_rig_blog_posts' );
	body.append( 'nonce', wpRigBlog.nonce );
	body.append( 'category', opts.category );
	body.append( 'paged', String( opts.paged ) );
	body.append( 'posts_per_page', String( opts.postsPerPage ) );

	try {
		const response = await fetch( wpRigBlog.ajaxUrl, {
			method: 'POST',
			body,
		} );

		const data = await response.json() as {
			success: boolean;
			data: { cardsHtml: string; paginationHtml: string; maxPages: number; currentPage: number };
		};

		if ( ! data.success ) return;

		cardsEl.innerHTML = data.data.cardsHtml;

		// Native lazy-load doesn't fire for images injected via innerHTML —
		// force eager loading so images appear immediately on all browsers.
		cardsEl.querySelectorAll<HTMLImageElement>( 'img[loading]' ).forEach( ( img ) => {
			img.loading = 'eager';
		} );

		if ( paginEl ) {
			paginEl.innerHTML = data.data.paginationHtml;
			bindPaginationClicks( opts.category, opts.postsPerPage );
		}
	} catch {
		// On error, clear skeleton.
		cardsEl.innerHTML = '';
	}
}

// ── Tab handling (blog home only — AJAX) ─────────────────────────────────────

function setActiveTab( slug: string ): void {
	getTabs().forEach( ( tab ) => {
		const isActive = tab.dataset.category === slug;
		tab.classList.toggle( 'is-active', isActive );
		tab.setAttribute( 'aria-selected', isActive ? 'true' : 'false' );
	} );
}

function bindTabClicks( postsPerPage: number ): void {
	getTabs().forEach( ( tab ) => {
		tab.addEventListener( 'click', ( e ) => {
			e.preventDefault();
			const category = tab.dataset.category ?? '';
			setActiveTab( category );

			const url = new URL( window.location.href );
			if ( category ) {
				url.searchParams.set( 'tab', category );
			} else {
				url.searchParams.delete( 'tab' );
			}
			url.searchParams.delete( 'page' );
			history.pushState( { category, paged: 1 }, '', url.toString() );

			void fetchBlogPosts( { category, paged: 1, postsPerPage } );
		} );
	} );
}

// ── Pagination ────────────────────────────────────────────────────────────────

function bindPaginationClicks( currentCategory: string, postsPerPage: number ): void {
	const paginEl = getPaginationContainer();
	if ( ! paginEl ) return;

	paginEl.querySelectorAll<HTMLElement>( '[data-page]' ).forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			const paged = parseInt( btn.dataset.page ?? '1', 10 );

			const url = new URL( window.location.href );
			if ( currentCategory ) {
				url.searchParams.set( 'tab', currentCategory );
			} else {
				url.searchParams.delete( 'tab' );
			}
			if ( paged > 1 ) {
				url.searchParams.set( 'page', String( paged ) );
			} else {
				url.searchParams.delete( 'page' );
			}
			history.pushState( { category: currentCategory, paged }, '', url.toString() );

			void fetchBlogPosts( { category: currentCategory, paged, postsPerPage } );

			// Scroll to top of grid section.
			const grid = getGrid();
			if ( grid ) {
				grid.scrollIntoView( { behavior: 'smooth', block: 'start' } );
			}
		} );
	} );
}

// ── popstate — restore tab + page from history ────────────────────────────────

function handlePopState( postsPerPage: number ): void {
	window.addEventListener( 'popstate', ( e ) => {
		const state = ( e.state as { category?: string; paged?: number } | null );
		const category = state?.category ?? '';
		const paged    = state?.paged ?? 1;

		setActiveTab( category );
		void fetchBlogPosts( { category, paged, postsPerPage } );
	} );
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener( 'DOMContentLoaded', () => {
	if ( typeof wpRigBlog === 'undefined' ) return;

	const grid = getGrid();
	if ( ! grid ) return;

	const postsPerPage = parseInt( grid.dataset.postsPerPage ?? '12', 10 );
	const isHome       = grid.dataset.isHome === '1';

	// Restore state from URL on initial load (handles direct /blog?tab=X visits).
	const urlParams   = new URLSearchParams( window.location.search );
	const initialTab  = urlParams.get( 'tab' ) ?? '';
	const initialPage = parseInt( urlParams.get( 'page' ) ?? '1', 10 );

	if ( isHome ) {
		// On /blog: tabs and pagination both AJAX.
		if ( initialTab ) {
			setActiveTab( initialTab );
			void fetchBlogPosts( { category: initialTab, paged: initialPage, postsPerPage } );
		} else {
			bindPaginationClicks( '', postsPerPage );
		}
		bindTabClicks( postsPerPage );
		handlePopState( postsPerPage );
	} else {
		// On /category/*: only pagination is AJAX; tabs are regular links.
		const activeCategory = grid.dataset.activeCategory ?? '';
		bindPaginationClicks( activeCategory, postsPerPage );
		handlePopState( postsPerPage );
	}
} );
