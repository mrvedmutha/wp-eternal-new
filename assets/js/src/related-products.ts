/**
 * Related Products — slider + GSAP hover effects.
 *
 * Desktop:
 *   - Pages of 3 cards, dot navigation
 *   - Auto-advance every 6 s with pause-on-hover
 *   - GSAP hover: second gallery image fades in with zoom-out + ADD TO BAG slides up
 *
 * Mobile (future spec): 2-per-swipe, handled in responsive pass.
 */

import { gsap } from 'gsap';

const AUTO_DELAY = 15000; // ms between auto-advances

document.addEventListener('DOMContentLoaded', () => {
	document
		.querySelectorAll<HTMLElement>('[data-related-products]')
		.forEach(initRelatedProducts);
});

// ─── Per-instance initialiser ────────────────────────────────────────────────

const BREAKPOINT_SMALL  = 425;
const BREAKPOINT_MOBILE = 600;
const CARDS_PER_PAGE_DESKTOP = 3;
const CARDS_PER_PAGE_MOBILE  = 2;
const CARDS_PER_PAGE_SMALL   = 1;

function initRelatedProducts(section: HTMLElement): void {
	const wrap      = section.querySelector<HTMLElement>('[data-rp-wrap]');
	const track     = section.querySelector<HTMLElement>('[data-rp-track]');
	const dotsWrap  = section.querySelector<HTMLElement>('[data-rp-dots]');

	if (!wrap || !track) return;

	// Collect every card once — we re-parent them on breakpoint changes.
	const allCards = Array.from(section.querySelectorAll<HTMLElement>('[data-rp-card]'));
	if (allCards.length === 0) return;

	let current          = 0;
	let autoTimer: ReturnType<typeof setTimeout> | null = null;
	let activeCardsPerPage = 0; // forces a rebuild on first call

	// ── Rebuild pages + dots when cards-per-page changes ─────────────────────

	function rebuildTrack(cpv: number): void {
		if (cpv === activeCardsPerPage) return;
		activeCardsPerPage = cpv;
		current = 0;

		// Re-group cards into pages.
		track!.innerHTML = '';
		for (let i = 0; i < allCards.length; i += cpv) {
			const pg = document.createElement('div');
			pg.className = 'related-products__page';
			pg.setAttribute('data-rp-page', '');
			allCards.slice(i, i + cpv).forEach((c) => pg.appendChild(c));
			track!.appendChild(pg);
		}

		// Rebuild dot navigation.
		if (dotsWrap) {
			const pageCount = track!.querySelectorAll('[data-rp-page]').length;
			dotsWrap.innerHTML = '';
			if (pageCount > 1) {
				for (let i = 0; i < pageCount; i++) {
					const btn = document.createElement('button');
					btn.className = 'related-products__dot' + (i === 0 ? ' is-active' : '');
					btn.setAttribute('data-rp-dot', String(i));
					btn.setAttribute('role', 'tab');
					btn.setAttribute('aria-label', `Slide ${i + 1}`);
					btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
					btn.addEventListener('click', () => { goTo(i); resetAuto(); });
					dotsWrap.appendChild(btn);
				}
				dotsWrap.style.display = '';
			} else {
				dotsWrap.style.display = 'none';
			}
		}
	}

	// ── Dimension setup ───────────────────────────────────────────────────────

	function applyDimensions(): void {
		const w = wrap!.offsetWidth;
		const cpv = w <= BREAKPOINT_SMALL
			? CARDS_PER_PAGE_SMALL
			: w < BREAKPOINT_MOBILE
				? CARDS_PER_PAGE_MOBILE
				: CARDS_PER_PAGE_DESKTOP;

		rebuildTrack(cpv);

		// Read the actual gap after rebuild so the value matches the current breakpoint CSS.
		const firstPage = track!.querySelector<HTMLElement>('[data-rp-page]');
		const gap = firstPage ? parseFloat( getComputedStyle( firstPage ).columnGap ) || 0 : 0;
		const cardWidth = ( w - gap * ( cpv - 1 ) ) / cpv;

		track!.querySelectorAll<HTMLElement>('[data-rp-page]').forEach((pg) => {
			pg.style.width = `${w}px`;
		});

		// Lock every card to the per-column width so partial last pages don't stretch.
		allCards.forEach((card) => {
			card.style.maxWidth = `${cardWidth}px`;
		});

		gsap.set(track, { x: -(current * w) });
	}

	applyDimensions();

	let resizeTimer: ReturnType<typeof setTimeout>;
	window.addEventListener('resize', () => {
		clearTimeout(resizeTimer);
		resizeTimer = setTimeout(() => {
			stopAuto();
			applyDimensions();
			startAuto();
		}, 120);
	});

	// ── Slide navigation ──────────────────────────────────────────────────────

	function goTo(index: number, instant = false): void {
		const livePages = track!.querySelectorAll<HTMLElement>('[data-rp-page]');
		const total     = livePages.length;
		current = ((index % total) + total) % total;

		gsap.to(track, {
			x: -(current * wrap!.offsetWidth),
			duration: instant ? 0 : 0.55,
			ease: 'power2.inOut',
		});

		dotsWrap?.querySelectorAll<HTMLButtonElement>('[data-rp-dot]').forEach((dot, i) => {
			const active = i === current;
			dot.classList.toggle('is-active', active);
			dot.setAttribute('aria-selected', String(active));
		});
	}

	// ── Auto-advance ──────────────────────────────────────────────────────────

	function startAuto(): void {
		const total = track!.querySelectorAll('[data-rp-page]').length;
		if (total <= 1) return;
		autoTimer = setTimeout(function tick() {
			goTo(current + 1);
			autoTimer = setTimeout(tick, AUTO_DELAY);
		}, AUTO_DELAY);
	}

	function stopAuto(): void {
		if (autoTimer) { clearTimeout(autoTimer); autoTimer = null; }
	}

	function resetAuto(): void { stopAuto(); startAuto(); }

	section.addEventListener('mouseenter', stopAuto);
	section.addEventListener('mouseleave', startAuto);

	// ── Swipe gestures (tablet + mobile) ─────────────────────────────────────

	let touchStartX = 0;
	let touchStartY = 0;
	let isSwiping   = false;

	wrap!.addEventListener('touchstart', (e: TouchEvent) => {
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
		isSwiping   = false;
		stopAuto();
	}, { passive: true });

	wrap!.addEventListener('touchmove', (e: TouchEvent) => {
		const dx = e.touches[0].clientX - touchStartX;
		const dy = e.touches[0].clientY - touchStartY;
		// Lock to horizontal swipe only — prevent accidental triggers on vertical scroll.
		if ( !isSwiping && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8 ) {
			isSwiping = true;
		}
	}, { passive: true });

	wrap!.addEventListener('touchend', (e: TouchEvent) => {
		if ( !isSwiping ) { resetAuto(); return; }
		const dx = e.changedTouches[0].clientX - touchStartX;
		if ( Math.abs(dx) > 40 ) {
			goTo( dx < 0 ? current + 1 : current - 1 );
		}
		resetAuto();
	}, { passive: true });

	// ── GSAP hover + AJAX cart ────────────────────────────────────────────────
	// Hover effects (image swap + ATB slide-up) only on desktop (> 1024px).

	if ( window.innerWidth > 1024 ) {
		section.querySelectorAll<HTMLElement>('[data-rp-hover]').forEach(initCardHover);
	}
	section.querySelectorAll<HTMLElement>('[data-rp-atb]').forEach(initCardAtb);

	// ── Kick off ──────────────────────────────────────────────────────────────

	startAuto();
}

// ─── Card hover (image zoom-out + ATB slide-up) ──────────────────────────────

function initCardHover(imgZone: HTMLElement): void {
	const hoverImg = imgZone.querySelector<HTMLElement>('.related-products__img--hover');
	const atbBar   = imgZone.querySelector<HTMLElement>('[data-rp-atb]');

	// Set initial states for GSAP-controlled props.
	if (hoverImg) {
		gsap.set(hoverImg, { opacity: 0, scale: 1.3, transformOrigin: 'center 20%' });
	}
	if (atbBar) {
		gsap.set(atbBar, { yPercent: 100, y: 16 });
	}

	// Bail early if there's nothing animated (e.g. no hover image, no ATB).
	if (!hoverImg && !atbBar) return;

	imgZone.addEventListener('mouseenter', () => {
		if (hoverImg) {
			gsap.to(hoverImg, {
				opacity: 1,
				scale: 1.15,
				duration: 0.5,
				ease: 'power2.out',
			});
		}
		if (atbBar) {
			gsap.to(atbBar, {
				yPercent: 0,
				y: -8,
				duration: 0.38,
				ease: 'power2.out',
			});
		}
	});

	imgZone.addEventListener('mouseleave', () => {
		if (hoverImg) {
			gsap.to(hoverImg, {
				opacity: 0,
				scale: 1.3,
				duration: 0.35,
				ease: 'power2.in',
			});
		}
		if (atbBar) {
			gsap.to(atbBar, {
				yPercent: 100,
				y: 16,
				duration: 0.3,
				ease: 'power2.in',
			});
		}
	});
}

// ─── AJAX Add to Bag ──────────────────────────────────────────────────────────

interface WcAddToCartResponse {
	error?:      boolean;
	cart_hash?:  string;
	fragments?:  Record<string, string>;
	product_url?: string;
}

declare const jQuery: ((fn: unknown) => unknown) & {
	(selector: unknown): { trigger: (event: string, args?: unknown[]) => void };
};

function applyWcFragments(fragments: Record<string, string>): void {
	Object.entries(fragments).forEach(([selector, html]) => {
		document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
			el.outerHTML = html;
		});
	});
}

function initCardAtb(atbEl: HTMLElement): void {
	const link = atbEl.querySelector<HTMLAnchorElement>('.related-products__atb-link');
	if (!link) return;

	const productId   = link.dataset.productId ?? '';
	const productType = link.dataset.productType ?? 'simple';

	// Make the entire ATB div the click target (not just the inner text link).
	atbEl.style.cursor = 'pointer';

	// Variable products need the PDP to select attributes — fall through to href.
	if (!productId || productType !== 'simple') {
		atbEl.addEventListener('click', () => { window.location.href = link.href; });
		return;
	}

	atbEl.addEventListener('click', async () => {
		if (atbEl.classList.contains('is-adding') || atbEl.classList.contains('is-added')) return;

		// ── 1. Adding state ───────────────────────────────────────────────────
		atbEl.classList.add('is-adding');
		link.textContent = 'ADDING...';

		try {
			const body = new URLSearchParams({ product_id: productId, quantity: '1' });
			const res  = await fetch('/?wc-ajax=add_to_cart', {
				method:  'POST',
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				body:    body.toString(),
			});
			const data: WcAddToCartResponse = await res.json();

			atbEl.classList.remove('is-adding');

			if (data.error) {
				link.textContent = 'ADD TO BAG';
				window.location.href = link.href;
				return;
			}

			// ── 2. Update header cart count ───────────────────────────────────
			if (data.fragments) {
				applyWcFragments(data.fragments);
				if (typeof jQuery !== 'undefined') {
					jQuery(document.body).trigger('added_to_cart', [
						data.fragments,
						data.cart_hash ?? '',
					]);
				}
			}

			// ── 3. Added state ─────────────────────────────────────────────────
			atbEl.classList.add('is-added');
			link.textContent = 'ADDED!';

			setTimeout(() => {
				atbEl.classList.remove('is-added');
				link.textContent = 'ADD TO BAG';
			}, 2500);

		} catch {
			atbEl.classList.remove('is-adding');
			link.textContent = 'ADD TO BAG';
			window.location.href = link.href;
		}
	});
}
