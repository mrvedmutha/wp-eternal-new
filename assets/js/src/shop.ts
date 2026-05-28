/**
 * Shop Page JavaScript
 *
 * Handles:
 * - FAQ section with aggregated FAQs from all categories
 * - Sort dropdown behavior (page reload based)
 * - GSAP hover effects on product cards
 * - ATB click handlers
 * - Load more functionality
 *
 * @package wp_rig
 */

import { gsap } from 'gsap';

// ============================================================================
// TYPES
// ============================================================================

interface FAQItem {
	question: string;
	answer: string;
	category: string;
}

declare global {
	interface Window {
		eternalShopFAQ?: FAQItem[];
		eternalShop?: {
			ajaxUrl: string;
			shopUrl: string;
			productsEndpoint: string;
		};
	}
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * WooCommerce sorting options
 */
const SORT_OPTIONS = [
	{ value: 'popularity', label: 'Popularity' },
	{ value: 'rating', label: 'Highest Rated' },
	{ value: 'price', label: 'Price: Low to High' },
	{ value: 'price-desc', label: 'Price: High to Low' },
	{ value: 'date', label: 'Newest' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Escape HTML for safety
 */
function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

// ============================================================================
// FAQ SECTION
// ============================================================================

/**
 * Initialize Shop FAQ Section
 */
function initFAQSection(): void {
	const container = document.getElementById('shop-faq-container');
	if (!container) return;

	const faqData = window.eternalShopFAQ;
	if (!faqData || !Array.isArray(faqData) || faqData.length === 0) {
		container.innerHTML = '<p class="shop-faq__empty">No FAQs available.</p>';
		return;
	}

	// Render FAQ items from aggregated data
	container.innerHTML = faqData
		.map((faq, index) => `
			<div class="shop-faq__item">
				<details class="shop-faq__details" ${index === 0 ? 'open' : ''}>
					<summary class="shop-faq__question">
						<span class="shop-faq__question-text">${escapeHtml(faq.question)}</span>
						<span class="shop-faq__toggle"></span>
					</summary>
					<div class="shop-faq__answer">
						${faq.answer}
					</div>
				</details>
			</div>
		`)
		.join('');

	// Initialize GSAP animations for each FAQ item
	const detailsElements = container.querySelectorAll('.shop-faq__details');
	detailsElements.forEach((detail: HTMLDetailsElement) => {
		const answer = detail.querySelector('.shop-faq__answer');
		if (!answer) return;

		// Set initial state
		if (detail.open) {
			gsap.set(answer, { height: 'auto', opacity: 1 });
		} else {
			gsap.set(answer, { height: 0, opacity: 0 });
		}

		// Listen for toggle events and animate
		detail.addEventListener('toggle', () => {
			if (detail.open) {
				gsap.fromTo(
					answer,
					{ height: 0, opacity: 0 },
					{ height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
				);
			} else {
				gsap.to(answer, {
					height: 0,
					opacity: 0,
					duration: 0.3,
					ease: 'power2.in'
				});
			}
		});
	});
}

// ============================================================================
// PRODUCT GRID HOVER EFFECTS
// ============================================================================

/**
 * Initialize Product Grid Hover Effects (GSAP)
 */
function initProductGrid(): void {
	setTimeout(() => {
		const imgZones = document.querySelectorAll('.shop-product__img-zone');
		if (imgZones.length === 0) {
			return;
		}

		// Only enable hover effects on desktop (> 1024px)
		if (window.innerWidth <= 1024) {
			return;
		}

		imgZones.forEach((zone) => {
			const hoverImg = zone.querySelector('.shop-product__img--hover');
			const atbBar = zone.querySelector('.shop-product__atb');

			// Set initial states
			if (hoverImg) {
				gsap.set(hoverImg, {
					opacity: 0,
					scale: 1.3,
					transformOrigin: 'center 20%'
				});
			}

			if (atbBar) {
				gsap.set(atbBar, {
					opacity: 0,
					yPercent: 100,
					y: 16
				});
			}

			if (!hoverImg && !atbBar) return;

			zone.addEventListener('mouseenter', () => {
				if (hoverImg) {
					gsap.to(hoverImg, {
						opacity: 1,
						scale: 1.15,
						duration: 0.5,
						ease: 'power2.out'
					});
				}
				if (atbBar) {
					gsap.to(atbBar, {
						opacity: 1,
						yPercent: 0,
						y: -8,
						duration: 0.38,
						ease: 'power2.out'
					});
				}
			});

			zone.addEventListener('mouseleave', () => {
				if (hoverImg) {
					gsap.to(hoverImg, {
						opacity: 0,
						scale: 1.3,
						duration: 0.35,
						ease: 'power2.in'
					});
				}
				if (atbBar) {
					gsap.to(atbBar, {
						opacity: 0,
						yPercent: 100,
						y: 16,
						duration: 0.3,
						ease: 'power2.in'
					});
				}
			});
		});
	}, 500);
}

// ============================================================================
// ATB CLICK HANDLERS
// ============================================================================

/**
 * Initialize ATB (Add to Bag) click handlers
 * Uses default WooCommerce behavior (redirect to cart)
 */
function initATBClickHandlers(): void {
	// Let WooCommerce handle ATB clicks natively
	// No custom behavior needed
}

// ============================================================================
// SORT DRAWER TOGGLE (MOBILE)
// ============================================================================

/**
 * Initialize Sort Drawer Toggle for mobile/tablet
 */
function initSortDrawer(): void {
	const toggleBtn = document.querySelector<HTMLButtonElement>('.shop-grid__filter-toggle');
	const overlay = document.querySelector<HTMLElement>('.shop-filters-overlay');
	const closeBtn = document.querySelector<HTMLButtonElement>('.shop-filters-drawer__close');

	if (!toggleBtn || !overlay) return;

	// Open drawer
	toggleBtn.addEventListener('click', () => {
		overlay.classList.add('is-active');
		toggleBtn.setAttribute('aria-expanded', 'true');
		document.body.style.overflow = 'hidden';
	});

	// Close drawer functions
	const closeDrawer = () => {
		overlay.classList.remove('is-active');
		toggleBtn.setAttribute('aria-expanded', 'false');
		document.body.style.overflow = '';
	};

	// Close on close button click
	if (closeBtn) {
		closeBtn.addEventListener('click', closeDrawer);
	}

	// Close on overlay click
	overlay.addEventListener('click', (e) => {
		if (e.target === overlay) {
			closeDrawer();
		}
	});

	// Close on sort option click
	const sortOptions = overlay.querySelectorAll<HTMLAnchorElement>('.shop-filters__sort-option');
	sortOptions.forEach(option => {
		option.addEventListener('click', () => {
			closeDrawer();
		});
	});
}

// ============================================================================
// LOAD MORE FUNCTIONALITY
// ============================================================================

/**
 * Initialize Load More button functionality.
 * Fetches the next page from the eternal/v1/shop-products REST endpoint
 * and appends rendered HTML into the grid.
 */
function initLoadMore(): void {
	const loadMoreBtn = document.querySelector<HTMLAnchorElement>('.shop-grid__load-more-link');
	if (!loadMoreBtn) return;

	loadMoreBtn.addEventListener('click', async (e) => {
		e.preventDefault();

		const endpoint = window.eternalShop?.productsEndpoint;
		if (!endpoint) return;

		const page = parseInt(loadMoreBtn.dataset.page || '2', 10);
		const loadMoreContainer = loadMoreBtn.closest<HTMLElement>('.shop-grid__load-more');
		const gridContent = document.querySelector<HTMLElement>('.shop-grid__content');
		if (!gridContent) return;

		loadMoreBtn.textContent = 'Loading...';
		loadMoreBtn.style.pointerEvents = 'none';

		try {
			const url = new URL(endpoint);
			url.searchParams.set('page', page.toString());

			const res = await fetch(url.toString());
			if (!res.ok) throw new Error(`HTTP ${res.status}`);

			const data = await res.json() as { html: string; has_more: boolean; next_page: number | null };

			if (data.html) {
				// Insert new product rows before the load-more container
				const temp = document.createElement('div');
				temp.innerHTML = data.html;
				while (temp.firstChild) {
					gridContent.insertBefore(temp.firstChild, loadMoreContainer ?? null);
				}

				// Re-run hover effects on the newly inserted cards
				initProductGrid();
			}

			if (data.has_more && data.next_page) {
				loadMoreBtn.dataset.page = data.next_page.toString();
				loadMoreBtn.textContent = 'Load More Products';
				loadMoreBtn.style.pointerEvents = '';
			} else {
				loadMoreContainer?.remove();
			}
		} catch (err) {
			console.error('Load more failed:', err);
			loadMoreBtn.textContent = 'Load More Products';
			loadMoreBtn.style.pointerEvents = '';
		}
	});
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all Shop page functionality
 */
function initShop(): void {
	initFAQSection();
	initProductGrid();
	initATBClickHandlers();
	initLoadMore();
	initSortDrawer();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initShop);
} else {
	initShop();
}
