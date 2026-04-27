/**
 * Cart page JS.
 *
 * Manages the related-products section visibility on the cart page.
 * When WooCommerce React hydrates the cart block and shows the filled-cart
 * block (i.e. cart has items), the related-products section is hidden.
 */

document.addEventListener('DOMContentLoaded', () => {
	initEmptyCartRelated();
	initRelatedProductsDimensions();
});

/**
 * The related-products JS runs at DOMContentLoaded before WooCommerce React
 * finishes hydrating, so it measures wrong slider dimensions. Fire a synthetic
 * resize event after the page fully loads so the slider re-measures correctly.
 */
function initRelatedProductsDimensions(): void {
	if (!document.querySelector('[data-rp-wrap]')) return;

	const trigger = () => window.dispatchEvent(new Event('resize'));

	// After WC React hydration (fires once all scripts/resources are done).
	window.addEventListener('load', trigger, { once: true });

	// Fallback in case load already fired.
	setTimeout(trigger, 300);
}

/**
 * Watches the WooCommerce cart block and keeps the related-products section
 * in sync with the empty/filled cart state.
 */
function initEmptyCartRelated(): void {
	const cartWrap = document.querySelector<HTMLElement>('.wp-block-woocommerce-cart');
	if (!cartWrap) return;

	const related = cartWrap.querySelector<HTMLElement>('.related-products');
	if (!related) return;

	function syncVisibility(): void {
		const filled = cartWrap!.querySelector<HTMLElement>('.wp-block-woocommerce-filled-cart-block');
		const hasItems = filled !== null && window.getComputedStyle(filled).display !== 'none';
		related!.style.display = hasItems ? 'none' : '';
	}

	syncVisibility();

	new MutationObserver(syncVisibility).observe(cartWrap, {
		childList:       true,
		subtree:         true,
		attributes:      true,
		attributeFilter: ['style', 'class', 'hidden'],
	});
}
