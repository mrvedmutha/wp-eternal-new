/**
 * Product Listing Page JavaScript
 *
 * Handles:
 * - FAQ section initialization from Eternal Product Category FAQ plugin
 * - Filter interactions
 * - Sort dropdown behavior
 * - GSAP hover effects on product cards (matches Related Products)
 *
 * @package wp_rig
 */
import { gsap } from 'gsap';
/**
 * Escape HTML for question text.
 * Answers come pre-sanitized from the plugin.
 */
function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}
/**
 * Initialize FAQ Section
 * Reads from window.eternalCategoryFAQ set by Eternal Product Category FAQ plugin
 * Uses GSAP for smooth accordion animations
 */
function initFAQSection(): void {
	const container = document.getElementById('plp-faq-container');
	if (!container) return;
	// Check if plugin has populated FAQ data
	const pluginData = (window as any).eternalCategoryFAQ;
	if (!pluginData || !Array.isArray(pluginData) || pluginData.length === 0) {
		// Show message if no FAQs
		container.innerHTML = '<p class="plp-faq__empty">No FAQs available for this category.</p>';
		return;
	}
	// Render FAQ items from plugin data
	container.innerHTML = pluginData.map((faq: {question: string, answer: string}, index: number) => `
		<div class="plp-faq__item">
			<details class="plp-faq__details" ${index === 0 ? 'open' : ''}>
				<summary class="plp-faq__question">
					<span class="plp-faq__question-text">${escapeHtml(faq.question)}</span>
					<span class="plp-faq__toggle"></span>
				</summary>
				<div class="plp-faq__answer">
					${faq.answer}
				</div>
			</details>
		</div>
	`).join('');
	// Initialize GSAP animations for each FAQ item
	const detailsElements = container.querySelectorAll('.plp-faq__details');
	detailsElements.forEach((detail: HTMLDetailsElement) => {
		const answer = detail.querySelector('.plp-faq__answer');
		if (!answer) return;
		// Set initial state based on whether details is open or closed
		if (detail.open) {
			gsap.set(answer, {
				height: 'auto',
				opacity: 1
			});
		} else {
			gsap.set(answer, {
				height: 0,
				opacity: 0
			});
		}
		// Listen for toggle events and animate
		detail.addEventListener('toggle', () => {
			if (detail.open) {
				// Opening: expand answer with smooth animation
				gsap.fromTo(answer,
					{ height: 0, opacity: 0 },
					{ height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
				);
			} else {
				// Closing: collapse answer
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
/**
 * Initialize Filter Sidebar
 */
function initFilterSidebar(): void {
	const clearAllLink = document.querySelector('.plp-filters__clear a');
	if (clearAllLink) {
		clearAllLink.addEventListener('click', (e) => {
			// Uncheck all checkboxes
			const checkboxes = document.querySelectorAll('.plp-filters__checkbox input[type="checkbox"]');
			checkboxes.forEach(cb => {
				(cb as HTMLInputElement).checked = false;
			});
		});
	}
		// Checkbox state management
		const checkboxes = document.querySelectorAll('.plp-filters__checkbox input[type="checkbox"]');
		checkboxes.forEach(checkbox => {
			checkbox.addEventListener('change', () => {
				const wrapper = checkbox.closest('.plp-filters__checkbox');
				if (wrapper) {
					if ((checkbox as HTMLInputElement).checked) {
						wrapper.classList.add('plp-filters__checkbox--checked');
					} else {
						wrapper.classList.remove('plp-filters__checkbox--checked');
					}
				}
			});
		});
}
/**
 * Initialize Mobile Filter Sidebar
 * Handles the full-screen filter overlay for mobile/tablet
 */
function initMobileFilterSidebar(): void {
	const filterToggle = document.querySelector('.plp-grid__filter-toggle');
	const filtersOverlay = document.querySelector('.plp-filters-overlay');
	const closeBtn = document.querySelector('.plp-filters-drawer__close');
	// Create overlay and drawer if they don't exist
	if (!filtersOverlay) {
		const overlay = document.createElement('div');
		overlay.className = 'plp-filters-overlay';
		overlay.setAttribute('data-node-id', '694-1729');
		const drawer = document.createElement('div');
		drawer.className = 'plp-filters-drawer';
		drawer.innerHTML = `
			<button class="plp-filters-drawer__close" aria-label="Close filters">&times;</button>
			<h2 class="plp-filters-drawer__title">Filters</h2>
			<div class="plp-filters-drawer__content"></div>
		`;
		overlay.appendChild(drawer);
		document.body.appendChild(overlay);
		// Clone filters content into drawer
		const originalFilters = document.querySelector('.plp-filters');
		const drawerContent = drawer.querySelector('.plp-filters-drawer__content');
		if (originalFilters && drawerContent) {
			drawerContent.innerHTML = originalFilters.innerHTML;
		}
		// Setup event listeners
		const newCloseBtn = drawer.querySelector('.plp-filters-drawer__close');
		const newFilterToggle = document.querySelector('.plp-grid__filter-toggle');
		if (newFilterToggle) {
			newFilterToggle.addEventListener('click', () => {
				overlay.classList.add('is-active');
				document.body.style.overflow = 'hidden';
			});
		}
		if (newCloseBtn) {
			newCloseBtn.addEventListener('click', () => {
				overlay.classList.remove('is-active');
				document.body.style.overflow = '';
			});
		}
		// Close when clicking outside
		overlay.addEventListener('click', (e) => {
			if (e.target === overlay) {
				overlay.classList.remove('is-active');
				document.body.style.overflow = '';
			}
		});
	}
}
/**
 * Initialize Product Grid Hover Effects (GSAP)
 * Matches Related Products animations:
 * - Hover image: zooms out from 1.3 to 1.15 scale while fading in
 * - ATB bar: slides up from below with smooth easing
 */
function initProductGrid(): void {
	// Wait a bit for products to potentially load via AJAX
	setTimeout(() => {
		const imgZones = document.querySelectorAll('.plp-product__img-zone');
		if (imgZones.length === 0) {
			return;
		}

		// Only enable hover effects on desktop (> 1024px)
		if (window.innerWidth <= 1024) {
			return;
		}
	imgZones.forEach((zone, index) => {
		const hoverImg = zone.querySelector('.plp-product__img--hover');
		const atbBar = zone.querySelector('.plp-product__atb');
		// Set initial states for GSAP-controlled props
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
		// Bail early if there's nothing animated
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
	}, 500); // Wait 500ms for products to load
}
/**
 * Initialize ATB (Add to Bag) click handlers with AJAX cart
 * Matches Related Products behavior for simple products
 */
function initATBClickHandlers(): void {
	const atbElements = document.querySelectorAll<HTMLElement>('[data-plp-atb]');
	atbElements.forEach(atbEl => {
		const link = atbEl.querySelector<HTMLAnchorElement>('.plp-product__atb-link');
		if (!link) return;
		const productId = link.dataset.productId ?? '';
		const productType = link.dataset.productType ?? 'simple';
		// Make the entire ATB div clickable
		atbEl.style.cursor = 'pointer';
		// Variable products need PDP - fall through to href
		if (!productId || productType !== 'simple') {
			atbEl.addEventListener('click', () => { window.location.href = link.href; });
			return;
		}
		atbEl.addEventListener('click', async () => {
			if (atbEl.classList.contains('is-adding') || atbEl.classList.contains('is-added')) return;
			// Adding state
			atbEl.classList.add('is-adding');
			link.textContent = 'ADDING...';
			try {
				const body = new URLSearchParams({ product_id: productId, quantity: '1' });
				const res = await fetch('/?wc-ajax=add_to_cart', {
					method: 'POST',
					headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
					body: body.toString(),
				});
				const data = await res.json();
				atbEl.classList.remove('is-adding');
				if (data.error) {
					link.textContent = 'ADD TO BAG';
					window.location.href = link.href;
					return;
				}
				// Update cart fragments
				if (data.fragments) {
					Object.entries(data.fragments).forEach(([selector, html]) => {
						document.querySelectorAll<HTMLElement>(selector).forEach((el) => {
							el.outerHTML = html as string;
						});
					});
					// Trigger WooCommerce event
					if (typeof (window as any).jQuery !== 'undefined') {
						(window as any).jQuery(document.body).trigger('added_to_cart', [
							data.fragments,
							data.cart_hash ?? '',
						]);
					}
				}
				// Added state
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
	});
}
/**
 * Initialize all PLP functionality
 */
function initPLP(): void {
	initFAQSection();
	initFilterSidebar();
	initMobileFilterSidebar();
	initProductGrid();
	initATBClickHandlers();
}
// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initPLP);
} else {
	initPLP();
}
