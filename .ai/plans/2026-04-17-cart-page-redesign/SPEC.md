# Cart Page Redesign Specification

**Date**: 2026-04-17
**Status**: Draft
**Feature**: Cart Page Styling & Layout Enhancement

## Overview

Redesign the WooCommerce cart page to match the Eternal theme design system, including proper page header, spacing, and consistent button styling.

## Current State Analysis

### Current Structure
- Uses WooCommerce Cart Block (`wp-block-woocommerce-cart`)
- Default layout with no custom header/heading
- "Proceed to Checkout" button uses default WooCommerce styles
- Content is not centered properly
- Lacks breathing space and visual hierarchy

### Current Block Classes
```html
<div data-block-name="woocommerce/cart" class="wp-block-woocommerce-cart alignwide">
  <div class="wc-block-components-sidebar-layout">
    <div class="wc-block-cart__main"> <!-- Cart items table -->
    <div class="wc-block-cart__sidebar"> <!-- Totals & checkout button -->
  </div>
</div>
```

## Design Requirements

### 1. Page Header
- Add page heading "Cart" at top
- Use 128px top padding (consistent with Shop page: `.shop-header`)
- Center content with max-width: 1440px
- Horizontal padding: 40px on desktop, 20px on mobile

### 2. Content Layout
- Center the cart block content
- Max-width: 1440px for main container
- Proper spacing between cart items and totals
- Responsive two-column layout on desktop

### 3. Button Styling
Match PDP "Add to Bag" button (`.pdp-cta`):
```css
.wc-block-components-button.wp-block-cart__submit-button {
    height: 46px;
    background: var(--color-primary); /* #021f1d */
    color: var(--color-white);
    font-family: var(--font-body); /* Maison Neue */
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    border: none;
    border-radius: 0;
    cursor: pointer;
    transition: opacity 0.15s ease;
}

.wc-block-components-button.wp-block-cart__submit-button:hover {
    opacity: 0.85;
}
```

### 4. Typography & Spacing
- Heading "Cart": Use display font (Cormorant Garamond), 52px, italic
- Sub-headings: Body font (Maison Neue), uppercase, 10px, 1.26px letter-spacing
- Product names: 15px, regular weight
- Prices: 17px for totals, 24px for final amount

### 5. Color Scheme
- Primary: #021f1d (dark green)
- Muted/Secondary: #868686
- Borders: 0.5px solid #000 or #777
- Sale badges: Consistent with PDP discount styling

## Implementation Plan

### Files to Create/Modify

1. **Create**: `assets/css/src/_cart.css`
   - Cart page specific styles
   - Block overrides for WooCommerce cart

2. **Modify**: `assets/css/src/global.css` or import cart styles
   - Import _cart.css in the build process

3. **CSS Classes to Target**:
   ```css
   /* Page body selector */
   body.woocommerce-cart

   /* Cart block wrapper */
   .wp-block-woocommerce-cart

   /* Main layout */
   .wc-block-components-sidebar-layout

   /* Cart items section */
   .wc-block-cart__main

   /* Sidebar/totals section */
   .wc-block-cart__sidebar

   /* Checkout button */
   .wc-block-cart__submit-button
   .wc-block-components-button
   ```

### CSS Structure

```css
/**
 * Cart Page Styles
 *
 * Based on Eternal theme design system
 * Matches Shop page header spacing and PDP button styling
 */

/* ==========================================================================
   PAGE LAYOUT & HEADER
   ========================================================================== */

/* Cart page shell - match shop page pattern */
body.woocommerce-cart .site {
    display: flex !important;
    flex-direction: column;
}

body.woocommerce-cart .site-main {
    width: 100%;
    max-width: 100%;
    flex: 1;
}

/* Cart Header */
.cart-page-header {
    padding: 128px 40px 40px;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 1440px;
    margin: 0 auto;
}

.cart-page-header__title {
    font-family: "Cormorant Garamond", serif;
    font-weight: 300;
    font-style: italic;
    font-size: 52px;
    line-height: 58px;
    letter-spacing: -1px;
    color: #021f1d;
    margin: 0;
}

/* ==========================================================================
   CART BLOCK LAYOUT
   ========================================================================== */

/* Center the cart block */
.wp-block-woocommerce-cart {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 40px 80px;
}

/* Two-column layout enhancement */
.wc-block-components-sidebar-layout {
    display: flex;
    gap: 60px;
    align-items: flex-start;
}

.wc-block-cart__main {
    flex: 1;
    min-width: 0;
}

.wc-block-cart__sidebar {
    width: 400px;
    flex: 0 0 auto;
}

/* ==========================================================================
   CART ITEMS TABLE
   ========================================================================== */

/* Table header styling */
.wc-block-cart-items__header th {
    font-family: "Maison Neue", sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.26px;
    text-transform: uppercase;
    color: #868686;
    padding: 16px 0;
    border-bottom: 0.5px solid #000;
}

/* Product row styling */
.wc-block-cart-items__row {
    border-bottom: 0.5px solid #e5e5e5;
}

.wc-block-cart-item__product {
    padding: 24px 0;
}

/* Product name link */
.wc-block-components-product-name {
    font-family: "Maison Neue", sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #021f1d;
    text-decoration: none;
}

.wc-block-components-product-name:hover {
    color: #021f1d;
    text-decoration: underline;
}

/* Product description */
.wc-block-components-product-metadata__description {
    font-family: "Maison Neue", sans-serif;
    font-size: 13px;
    color: #868686;
    margin: 8px 0 0;
}

/* Quantity selector */
.wc-block-components-quantity-selector__input {
    font-family: "Maison Neue", sans-serif;
    font-size: 13px;
}

/* Remove link */
.wc-block-cart-item__remove-link {
    font-family: "Maison Neue", sans-serif;
    font-size: 11px;
    color: #868686;
    text-decoration: none;
}

/* ==========================================================================
   CART TOTALS SIDEBAR
   ========================================================================== */

/* Cart totals heading */
.wc-block-cart__totals-title {
    font-family: "Maison Neue", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.26px;
    text-transform: uppercase;
    color: #021f1d;
    margin: 0 0 24px;
}

/* Total item labels */
.wc-block-components-totals-item__label {
    font-family: "Maison Neue", sans-serif;
    font-size: 13px;
    font-weight: 400;
    color: #868686;
}

.wc-block-components-totals-footer-item .wc-block-components-totals-item__label {
    font-size: 15px;
    font-weight: 500;
    color: #021f1d;
}

/* Total values */
.wc-block-components-totals-item__value {
    font-family: "Maison Neue", sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #021f1d;
}

.wc-block-components-totals-footer-item .wc-block-components-totals-item__value {
    font-size: 24px;
}

/* Coupon toggle */
.wc-block-components-panel__button {
    font-family: "Maison Neue", sans-serif;
    font-size: 13px;
    color: #021f1d;
}

/* ==========================================================================
   CHECKOUT BUTTON - MATCH PDP CTA
   ========================================================================== */

.wc-block-cart__submit-button,
.wc-block-components-button.contained {
    height: 46px;
    background: #021f1d !important;
    color: #fff !important;
    font-family: "Maison Neue", sans-serif;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    border: none !important;
    border-radius: 0 !important;
    cursor: pointer;
    transition: opacity 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
}

.wc-block-cart__submit-button:hover,
.wc-block-components-button.contained:hover {
    opacity: 0.85;
}

/* Button text wrapper */
.wc-block-components-button__text {
    color: #fff;
}

/* ==========================================================================
   RESPONSIVE BREAKPOINTS
   ========================================================================== */

/* Tablet (max-width: 1024px) */
@media (max-width: 1024px) {
    .wp-block-woocommerce-cart {
        padding: 0 20px 60px;
    }

    .wc-block-components-sidebar-layout {
        flex-direction: column;
        gap: 40px;
    }

    .wc-block-cart__sidebar {
        width: 100%;
    }
}

/* Mobile (max-width: 768px) */
@media (max-width: 768px) {
    .cart-page-header {
        padding-top: 100px;
        padding-left: 20px;
        padding-right: 20px;
    }

    .cart-page-header__title {
        font-size: 36px;
        line-height: 40px;
    }

    .wp-block-woocommerce-cart {
        padding: 0 20px 60px;
    }
}
```

### JavaScript Requirements

**None** - This is a CSS-only enhancement. The cart functionality is handled by WooCommerce blocks.

## Acceptance Criteria

1. ✅ Cart page displays "Cart" heading at top
2. ✅ Page has 128px top padding (desktop), 100px (mobile)
3. ✅ Content is centered with max-width 1440px
4. ✅ "Proceed to Checkout" button matches PDP "Add to Bag" button style
5. ✅ Cart items and totals layout is responsive (2-column desktop, 1-column mobile)
6. ✅ Typography matches Eternal theme (Maison Neue body, Cormorant Garamond display)
7. ✅ Colors match theme (#021f1d primary, #868686 muted)
8. ✅ Proper spacing and visual hierarchy

## Testing Checklist

- [ ] Cart page with items displays correctly
- [ ] Cart page when empty displays appropriate message
- [ ] "Proceed to Checkout" button hover state works
- [ ] Quantity selectors work properly
- [ ] Remove item links work
- [ ] Coupon form toggles correctly
- [ ] Responsive layout on tablet (768px - 1024px)
- [ ] Responsive layout on mobile (< 768px)
- [ ] Checkout button navigates to checkout page

## Dependencies

- WooCommerce Blocks plugin
- Eternal theme CSS variables and fonts
- No additional JavaScript dependencies

## Notes

- The cart uses WooCommerce Blocks, which have their own class structure
- Some WooCommerce styles may need `!important` to override plugin defaults
- Consider moving header injection to PHP template if content injection is needed
- Test with various cart states (empty, single item, multiple items)

## References

- PDP Styles: `/assets/css/src/_product-detail.css` (lines 667-690 for `.pdp-cta`)
- Shop Page: `/assets/css/src/_shop.css` (lines 144-156 for `.shop-header`)
- Theme CSS Variables: Check `_custom-properties.css` for color/spacing tokens
