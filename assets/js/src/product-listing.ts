/**
 * Product Listing Page JavaScript
 *
 * Handles:
 * - FAQ section initialization from Eternal Product Category FAQ plugin
 * - Sort dropdown behavior
 * - GSAP hover effects on product cards
 * - Mobile filter drawer (works with plugin filters)
 * - ATB click handlers
 *
 * Filter functionality is handled by Eternal Product Category Filter plugin
 *
 * @package wp_rig
 */

import { gsap } from 'gsap';

// ============================================================================
// FAQ SECTION
// ============================================================================

/**
 * Escape HTML for question text.
 */
function escapeHtml(text: string): string {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
}

/**
 * Initialize FAQ Section
 */
function initFAQSection(): void {
	const container = document.getElementById('plp-faq-container');
	if (!container) return;

	// Check if plugin has populated FAQ data
	const pluginData = (window as any).eternalCategoryFAQ;
	if (!pluginData || !Array.isArray(pluginData) || pluginData.length === 0) {
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

		// Set initial state
		if (detail.open) {
			gsap.set(answer, { height: 'auto', opacity: 1 });
		} else {
			gsap.set(answer, { height: 0, opacity: 0 });
		}

		// Listen for toggle events and animate
		detail.addEventListener('toggle', () => {
			if (detail.open) {
				gsap.fromTo(answer,
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
// MOBILE FILTER DRAWER
// ============================================================================

/**
 * Initialize Mobile Filter Sidebar
 */
function initMobileFilterSidebar(filterManager?: FilterManager | null): void {
	const filterToggle = document.querySelector('.plp-grid__filter-toggle');
	const filtersOverlay = document.querySelector('.plp-filters-overlay');
	const closeBtn = document.querySelector('.plp-filters-drawer__close');

	// Function to update drawer content from desktop filters
	const updateDrawerContent = () => {
		const overlay = document.querySelector('.plp-filters-overlay');
		const drawer = overlay?.querySelector('.plp-filters-drawer');
		const drawerContent = drawer?.querySelector('.plp-filters-drawer__content');
		const originalFilters = document.querySelector('.plp-filters');

		if (drawerContent && originalFilters) {
			drawerContent.innerHTML = originalFilters.innerHTML;

			// Re-attach event listeners for the new content
			reattachDrawerEventListeners(drawer, overlay);
		}
	};

	// Re-attach event listeners after content update
	const reattachDrawerEventListeners = (drawer: Element, overlay: Element) => {
		const newCloseBtn = drawer.querySelector('.plp-filters-drawer__close');
		if (newCloseBtn) {
			newCloseBtn.addEventListener('click', () => {
				overlay.classList.remove('is-active');
				document.body.style.overflow = '';
			});
		}

		// Re-attach accordion toggle listeners
		const drawerContent = drawer.querySelector('.plp-filters-drawer__content');
		if (drawerContent) {
			drawerContent.querySelectorAll('[data-group-toggle]').forEach(toggle => {
				toggle.addEventListener('click', () => {
					const options = toggle.nextElementSibling as HTMLElement;
					if (options) {
						options.classList.toggle('is-open');
					}
				});
			});

			// Re-attach checkbox change listeners
			drawerContent.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(checkbox => {
				checkbox.addEventListener('change', () => {
					// Sync with main filter container
					const mainContainer = document.querySelector<HTMLElement>('#plp-filters-container');
					if (mainContainer) {
						const mainCheckbox = mainContainer.querySelector<HTMLInputElement>(`input[value="${checkbox.value}"]`);
						if (mainCheckbox) {
							mainCheckbox.checked = checkbox.checked;
							// Trigger the change event on the main checkbox
							mainCheckbox.dispatchEvent(new Event('change'));
						}
					}
				});
			});

			// Re-attach sort dropdown listeners
			const sortDropdown = drawerContent.querySelector('[data-sort-dropdown]');
			const sortOptions = drawerContent.querySelector('[data-sort-options]');
			if (sortDropdown && sortOptions) {
				sortDropdown.addEventListener('click', () => {
					sortOptions.classList.toggle('is-open');
				});

				sortOptions.querySelectorAll('.plp-filters__sort-option').forEach(option => {
					option.addEventListener('click', (e) => {
						const value = (e.currentTarget as HTMLElement).dataset.value;
						if (value) {
							// Sync with main filter container
							const mainContainer = document.querySelector<HTMLElement>('#plp-filters-container');
							if (mainContainer) {
								const mainOption = mainContainer.querySelector(`.plp-filters__sort-option[data-value="${value}"]`);
								if (mainOption) {
									mainOption.dispatchEvent(new Event('click'));
								}
							}
							sortOptions.classList.remove('is-open');
						}
					});
				});
			}

			// Re-attach clear all button listener
			const clearBtn = drawerContent.querySelector('[data-action="clear"]');
			if (clearBtn) {
				clearBtn.addEventListener('click', () => {
					const mainContainer = document.querySelector<HTMLElement>('#plp-filters-container');
					if (mainContainer) {
						const mainClearBtn = mainContainer.querySelector('[data-action="clear"]');
						if (mainClearBtn) {
							mainClearBtn.dispatchEvent(new Event('click'));
						}
					}
				});
			}
		}
	};

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

		// Clone filters content into drawer initially
		updateDrawerContent();

		// Register callback to update drawer when filters finish loading
		if (filterManager) {
			filterManager.onLoaded(updateDrawerContent);
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

// ============================================================================
// PRODUCT GRID HOVER EFFECTS
// ============================================================================

/**
 * Initialize Product Grid Hover Effects (GSAP)
 */
function initProductGrid(): void {
	setTimeout(() => {
		const imgZones = document.querySelectorAll('.plp-product__img-zone');
		if (imgZones.length === 0) {
			return;
		}

		// Only enable hover effects on desktop (> 1024px)
		if (window.innerWidth <= 1024) {
			return;
		}

		imgZones.forEach((zone) => {
			const hoverImg = zone.querySelector('.plp-product__img--hover');
			const atbBar = zone.querySelector('.plp-product__atb');

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
 * Initialize ATB (Add to Bag) click handlers with AJAX cart
 */
function initATBClickHandlers(): void {
	const atbElements = document.querySelectorAll<HTMLElement>('[data-plp-atb]');

	atbElements.forEach(atbEl => {
		const link = atbEl.querySelector<HTMLAnchorElement>('.plp-product__atb-link');
		if (!link) return;

		const productId = link.dataset.productId ?? '';
		const productType = link.dataset.productType ?? 'simple';

		atbEl.style.cursor = 'pointer';

		if (!productId || productType !== 'simple') {
			atbEl.addEventListener('click', () => { window.location.href = link.href; });
			return;
		}

		atbEl.addEventListener('click', async () => {
			if (atbEl.classList.contains('is-adding') || atbEl.classList.contains('is-added')) return;

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

					if (typeof (window as any).jQuery !== 'undefined') {
						(window as any).jQuery(document.body).trigger('added_to_cart', [
							data.fragments,
							data.cart_hash ?? '',
						]);
					}
				}

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

// ============================================================================
// FILTER SYSTEM
// ============================================================================

/**
 * Types for filter data
 */
interface FilterOption {
	option_id: string;
	name: string;
	slug: string;
	order: number;
	count: number;
}

interface FilterGroup {
	group_id: string;
	group_name: string;
	slug: string;
	options: FilterOption[];
}

interface FilterData {
	category_id: number;
	category_name: string;
	category_slug: string;
	filter_groups: FilterGroup[];
}

interface PLPData {
	pluginDataUrl: string;
	filters: {
		active: boolean;
		categoryId: number;
		endpoint: string;
		nonce: string;
	};
	ajaxUrl: string;
	restUrl: string;
}

/**
 * WooCommerce sorting options
 */
const SORT_OPTIONS = [
	{ value: 'popularity', label: 'Popularity' },
	{ value: 'rating', label: 'Highest Rated' },
	{ value: 'price', label: 'Price: Low to High' },
	{ value: 'price-desc', label: 'Price: High to Low' },
	{ value: 'title', label: 'Name: A to Z' },
	{ value: 'title-desc', label: 'Name: Z to A' },
	{ value: 'date', label: 'Newest' },
];

/**
 * Category-specific fallback filters
 */
const FALLBACK_FILTERS: Record<string, FilterGroup[]> = {
	skincare: [
		{
			group_id: 'group_0',
			group_name: 'Product Types',
			slug: 'product-types',
			options: [
				{ option_id: 'opt_0_0', name: 'Face Creme', slug: 'face-creme', order: 1, count: 1 },
				{ option_id: 'opt_0_1', name: 'Body Oil', slug: 'body-oil', order: 2, count: 0 },
				{ option_id: 'opt_0_2', name: 'Hair & Body Serum', slug: 'hair-body-serum', order: 3, count: 0 },
				{ option_id: 'opt_0_3', name: 'Essential Oil', slug: 'essential-oil', order: 4, count: 0 },
			],
		},
		{
			group_id: 'group_1',
			group_name: 'Skin Type',
			slug: 'skin-type',
			options: [
				{ option_id: 'opt_1_0', name: 'All Skin Types', slug: 'all-skin-types', order: 1, count: 1 },
				{ option_id: 'opt_1_1', name: 'Dry Skin', slug: 'dry-skin', order: 2, count: 0 },
				{ option_id: 'opt_1_2', name: 'Sensitive Skin', slug: 'sensitive-skin', order: 3, count: 0 },
				{ option_id: 'opt_1_3', name: 'Hair & Scalp Care', slug: 'hair-scalp-care', order: 4, count: 0 },
			],
		},
		{
			group_id: 'group_2',
			group_name: 'Benefits',
			slug: 'benefits',
			options: [
				{ option_id: 'opt_2_0', name: 'Hydration', slug: 'hyderation', order: 1, count: 1 },
				{ option_id: 'opt_2_1', name: 'Nourishment', slug: 'nourishment', order: 2, count: 1 },
				{ option_id: 'opt_2_2', name: 'Radiance', slug: 'radiance', order: 3, count: 0 },
				{ option_id: 'opt_2_3', name: 'Firmness & Renewal', slug: 'firmness-renewal', order: 4, count: 0 },
				{ option_id: 'opt_2_4', name: 'Revitalising Care', slug: 'revitalizing-care', order: 5, count: 0 },
			],
		},
	],
	nutraceuticals: [
		{
			group_id: 'group_0',
			group_name: 'Formulations For',
			slug: 'formulations-for',
			options: [
				{ option_id: 'opt_0_0', name: 'Men', slug: 'men', order: 1, count: 0 },
				{ option_id: 'opt_0_1', name: 'Women', slug: 'women', order: 2, count: 0 },
			],
		},
		{
			group_id: 'group_1',
			group_name: 'Product Format',
			slug: 'product-format',
			options: [
				{ option_id: 'opt_1_0', name: 'Softgels', slug: 'softgels', order: 1, count: 0 },
				{ option_id: 'opt_1_1', name: 'Tablets', slug: 'tablets', order: 2, count: 0 },
			],
		},
	],
};

/**
 * Filter Manager - handles loading, rendering, and state management
 */
class FilterManager {
	private container: HTMLElement;
	private categoryId: number;
	private endpoint: string;
	private categorySlug: string;
	private selectedFilters: Set<string> = new Set();
	private urlFilters: Set<string> = new Set();
	private selectedSort: string = '';
	private isLoading = true;
	private onFiltersLoaded: (() => void)[] = [];

	constructor(container: HTMLElement, data: PLPData['filters'], categorySlug: string) {
		this.container = container;
		this.categoryId = data.categoryId;
		this.endpoint = data.endpoint;
		this.categorySlug = categorySlug;

		// Parse URL parameters for initial state
		this.parseURLParams();

		// Load and render filters
		this.init();
	}

	private parseURLParams(): void {
		const params = new URLSearchParams(window.location.search);
		const filterParam = params.get('eternal_filter');
		if (filterParam) {
			filterParam.split(',').forEach(slug => this.urlFilters.add(slug));
			this.selectedFilters = new Set(this.urlFilters);
		}

		// Parse sort parameter
		const sortParam = params.get('orderby');
		if (sortParam) {
			this.selectedSort = sortParam;
		} else {
			this.selectedSort = 'popularity'; // Default
		}
	}

	private async init(): Promise<void> {
		// Show skeleton loading
		this.renderSkeleton();

		// Try to load from REST API
		try {
			const response = await fetch(this.endpoint);
			if (!response.ok) throw new Error('Failed to load filters');

			const data: FilterData = await response.json();
			this.renderFilters(data.filter_groups);
			this.isLoading = false;
			this.notifyFiltersLoaded();
		} catch (error) {
			console.warn('Failed to load filters from API, using fallback:', error);
			// Use category-specific fallback
			const fallback = FALLBACK_FILTERS[this.categorySlug] || [];
			this.renderFilters(fallback);
			this.isLoading = false;
			this.notifyFiltersLoaded();
		}
	}

	/**
	 * Register a callback to be called when filters finish loading
	 */
	public onLoaded(callback: () => void): void {
		this.onFiltersLoaded.push(callback);
	}

	/**
	 * Notify all registered callbacks that filters have loaded
	 */
	private notifyFiltersLoaded(): void {
		this.onFiltersLoaded.forEach(callback => callback());
	}

	private renderSkeleton(): void {
		this.container.innerHTML = `
			<div class="plp-filters__skeleton">
				<!-- Sort dropdown skeleton -->
				<div class="plp-filters__skeleton-sort">
					<div class="plp-filters__skeleton-label"></div>
					<div class="plp-filters__skeleton-dropdown">
						<div class="plp-filters__skeleton-value"></div>
						<div class="plp-filters__skeleton-chevron"></div>
					</div>
				</div>

				<div class="plp-filters__skeleton-divider"></div>

				<!-- Filter group 1 skeleton -->
				<div class="plp-filters__skeleton-group">
					<div class="plp-filters__skeleton-title"></div>
					<div class="plp-filters__skeleton-options">
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
					</div>
				</div>

				<div class="plp-filters__skeleton-divider"></div>

				<!-- Filter group 2 skeleton -->
				<div class="plp-filters__skeleton-group">
					<div class="plp-filters__skeleton-title"></div>
					<div class="plp-filters__skeleton-options">
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
					</div>
				</div>

				<div class="plp-filters__skeleton-divider"></div>

				<!-- Filter group 3 skeleton -->
				<div class="plp-filters__skeleton-group">
					<div class="plp-filters__skeleton-title"></div>
					<div class="plp-filters__skeleton-options">
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
						<div class="plp-filters__skeleton-option">
							<div class="plp-filters__skeleton-checkbox"></div>
							<div class="plp-filters__skeleton-text"></div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	private renderFilters(groups: FilterGroup[]): void {
		const hasActiveFilters = this.urlFilters.size > 0;

		this.container.innerHTML = `
			${hasActiveFilters ? `
				<div class="plp-filters__clear-all">
					<button class="plp-filters__clear-btn" data-action="clear">
						CLEAR ALL
					</button>
				</div>
			` : ''}

			<div class="plp-filters__sort">
				<div class="plp-filters__sort-label">SORT BY:</div>
				<div class="plp-filters__sort-dropdown" data-sort-dropdown>
					<div class="plp-filters__sort-value">${this.getSortLabel(this.selectedSort)}</div>
					<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
						<path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="0.5"/>
					</svg>
				</div>
				<div class="plp-filters__sort-options" data-sort-options>
					${SORT_OPTIONS.map(option => `
						<div class="plp-filters__sort-option ${option.value === this.selectedSort ? 'is-selected' : ''}" data-value="${option.value}">
							${option.label}
						</div>
					`).join('')}
				</div>
			</div>

			<div class="plp-filters__divider"></div>

			${groups.map((group, index) => `
				<div class="plp-filters__group" data-group-id="${group.group_id}">
					<div class="plp-filters__group-title" data-group-toggle>
						${group.group_name.toUpperCase()}
					</div>
					<div class="plp-filters__group-options ${index === 0 ? 'is-open' : ''}">
						${group.options.map(option => this.renderOption(option)).join('')}
					</div>
				</div>
				${index < groups.length - 1 ? '<div class="plp-filters__divider"></div>' : ''}
			`).join('')}
		`;

		this.attachEventListeners();
	}

	private renderOption(option: FilterOption): string {
		const isSelected = this.selectedFilters.has(option.slug);
		const hasCount = option.count > 0;

		return `
			<label class="plp-filters__option ${isSelected ? 'is-selected' : ''} ${!hasCount ? 'is-disabled' : ''}">
				<input
					type="checkbox"
					value="${option.slug}"
					${isSelected ? 'checked' : ''}
					${!hasCount ? 'disabled' : ''}
					data-option-slug="${option.slug}"
				>
				<span class="plp-filters__checkbox"></span>
				<span class="plp-filters__option-name">${option.name}</span>
				${option.count > 0 ? `<span class="plp-filters__count"> (${option.count})</span>` : ''}
			</label>
		`;
	}

	private attachEventListeners(): void {
		// Checkbox changes
		this.container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]').forEach(checkbox => {
			checkbox.addEventListener('change', () => this.handleCheckboxChange(checkbox));
		});

		// Group toggles
		this.container.querySelectorAll('[data-group-toggle]').forEach(toggle => {
			toggle.addEventListener('click', () => {
				const options = toggle.nextElementSibling as HTMLElement;
				options.classList.toggle('is-open');
			});
		});

		// Clear all button
		const clearBtn = this.container.querySelector('[data-action="clear"]');
		if (clearBtn) {
			clearBtn.addEventListener('click', () => this.clearAllFilters());
		}

		// Sort dropdown toggle
		const sortDropdown = this.container.querySelector('[data-sort-dropdown]');
		const sortOptions = this.container.querySelector('[data-sort-options]');
		if (sortDropdown && sortOptions) {
			sortDropdown.addEventListener('click', () => {
				sortOptions.classList.toggle('is-open');
			});

			// Sort option clicks
			sortOptions.querySelectorAll('.plp-filters__sort-option').forEach(option => {
				option.addEventListener('click', (e) => {
					const value = (e.currentTarget as HTMLElement).dataset.value;
					if (value) {
						this.handleSortChange(value);
						sortOptions.classList.remove('is-open');
					}
				});
			});

			// Close dropdown when clicking outside
			document.addEventListener('click', (e) => {
				if (!sortDropdown.contains(e.target as Node)) {
					sortOptions.classList.remove('is-open');
				}
			});
		}
	}

	private getSortLabel(value: string): string {
		const option = SORT_OPTIONS.find(opt => opt.value === value);
		return option ? option.label : 'Popularity';
	}

	private handleSortChange(value: string): void {
		this.selectedSort = value;
		this.updateURL();
	}

	private handleCheckboxChange(checkbox: HTMLInputElement): void {
		const slug = checkbox.value;

		if (checkbox.checked) {
			this.selectedFilters.add(slug);
		} else {
			this.selectedFilters.delete(slug);
		}

		this.updateURL();
	}

	private updateURL(): void {
		const params = new URLSearchParams(window.location.search);

		// Update filters
		if (this.selectedFilters.size > 0) {
			params.set('eternal_filter', Array.from(this.selectedFilters).join(','));
		} else {
			params.delete('eternal_filter');
		}

		// Update sort
		if (this.selectedSort && this.selectedSort !== 'popularity') {
			params.set('orderby', this.selectedSort);
		} else {
			params.delete('orderby');
		}

		const newURL = `${window.location.pathname}?${params.toString()}`;
		window.location.href = newURL;
	}

	private clearAllFilters(): void {
		this.selectedFilters.clear();
		const params = new URLSearchParams(window.location.search);
		params.delete('eternal_filter');
		window.location.href = `${window.location.pathname}?${params.toString()}`;
	}
}

/**
 * Initialize Filter System
 */
function initFilterSystem(): FilterManager | null {
	const container = document.querySelector<HTMLElement>('#plp-filters-container');
	if (!container) return null;

	// Get PLP data from wp_localize_script
	const plpData = (window as any).eternalPLP as PLPData;
	if (!plpData || !plpData.filters) {
		console.warn('eternalPLP data not found');
		return null;
	}

	// Get current category slug
	const categorySlug = document.body.classList.contains('tax-product_cat')
		? window.location.pathname.split('/').filter(Boolean).pop() || ''
		: '';

	const filterManager = new FilterManager(container, plpData.filters, categorySlug);
	return filterManager;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all PLP functionality
 */
function initPLP(): void {
	const filterManager = initFilterSystem();
	initFAQSection();
	initMobileFilterSidebar(filterManager);
	initProductGrid();
	initATBClickHandlers();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initPLP);
} else {
	initPLP();
}
