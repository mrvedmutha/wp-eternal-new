# Product Grid Refactor & Load More - Specification

**Feature**: Product Grid CSS Grid Migration + AJAX Load More
**Date**: 2026-04-16
**Status**: Draft
**Priority**: High

## Overview

Refactor the product grid from a fixed 6-product pattern to a flexible CSS Grid layout that adapts to any number of products. Implement AJAX Load More functionality to display additional products without page reload.

## Problem Statement

### Current Desktop Grid Issues

**Fixed Pattern Limitations** (lines 53-56 in `product-grid.php`):
```php
$pattern          = array('half', 'half', 'full', 'full', 'half', 'half');
$display_products = array_slice($products, 0, 6); // Only first 6!
```

**Problems**:
1. ❌ **Hardcoded 6-product limit** - Only displays first 6 products
2. ❌ **Fixed pattern** - Always applies 2-1-1-2 layout regardless of count
3. ❌ **No adaptability** - Cannot handle 1, 3, 5, 7+ products correctly
4. ❌ **Manual row management** - Requires opening/closing row divs

### Load More Status

- UI exists but non-functional
- No AJAX implementation
- No progressive loading

## Goals

### Functional Requirements

#### Grid Refactor
- [ ] Migrate desktop grid to CSS Grid
- [ ] Support any number of products (1, 2, 5, 10, 100+)
- [ ] Maintain 2-1-1-2 visual pattern when 6+ products exist
- [ ] Flow naturally based on product count (1 product = 1 half card, not expanded)
- [ ] Preserve existing visual design and spacing
- [ ] Maintain responsive behavior (desktop/tablet/mobile)

#### Load More Functionality
- [ ] Implement AJAX endpoint for loading additional products
- [ ] Append products to existing grid (no page reload)
- [ ] Update product count display
- [ ] Hide "Load More" button when all products loaded
- [ ] Show loading state during fetch
- [ ] Handle errors gracefully

### Non-Functional Requirements
- [ ] No visual regression (design must match current)
- [ ] Smooth animations when products load
- [ ] No console errors
- [ ] Performance: <500ms for AJAX response
- [ ] Accessibility: ARIA live regions for dynamic content

## Architecture

### Data Flow

```
Initial Page Load
    ↓
Query returns N products
    ↓
Display first 6 (or all if < 6)
    ↓
User clicks "Load More"
    ↓
AJAX request for next batch
    ↓
Append products to grid
    ↓
Repeat until all products loaded
```

### CSS Grid Strategy

#### Desktop Layout (preserve 2-1-1-2 pattern)

```css
.plp-grid__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
    gap: 32px;
    width: 664px;
}

/* Items 3 & 4 span both columns (full-width) */
.plp-grid__item:nth-child(3),
.plp-grid__item:nth-child(4) {
    grid-column: span 2;
}

/* Pattern repeats every 6 items */
.plp-grid__item:nth-child(6n+3),
.plp-grid__item:nth-child(6n+4) {
    grid-column: span 2;
}
```

#### Natural Flow Examples

| Product Count | Layout Pattern | Visual Result |
|--------------|----------------|---------------|
| 1 | [half] | Single card |
| 2 | [half, half] | 2 cards in row |
| 3 | [half, half, full] | 2 up, 1 full |
| 4 | [half, half, full, full] | 2 up, 2 full |
| 5 | [half, half, full, full, half] | 2-1-1-2 with 1 half |
| 6 | [half, half, full, full, half, half] | Complete 2-1-1-2 pattern |
| 7+ | Pattern repeats | Continue pattern |

## Technical Specifications

### File Modifications

#### 1. `template-parts/product-listing/product-grid.php`

**Current State**: Fixed 6-product pattern with manual row management

**Changes**:
- Remove `array_slice($products, 0, 6)` - display all products
- Remove manual row opening/closing logic
- Remove hardcoded pattern array
- Add data attributes for AJAX loading
- Simplify to single loop over all products

**Before**:
```php
$pattern = array('half', 'half', 'full', 'full', 'half', 'half');
$display_products = array_slice($products, 0, 6);
foreach ($display_products as $index => $product_post) {
    // Manual row div management...
}
```

**After**:
```php
$display_products = $products; // All products
$initial_count = 6;
$has_more = count($products) > $initial_count;
$remaining = count($products) - $initial_count;

foreach (array_slice($display_products, 0, $initial_count) as $index => $product_post) {
    // Simple loop, no row management
}
```

#### 2. `assets/css/src/_product-listing.css`

**Current State**: Fixed widths with manual row flexbox

**Changes**:
- Replace `.plp-grid__row` with CSS Grid
- Add responsive grid rules
- Add nth-child selectors for 2-1-1-2 pattern
- Update spacing for grid gap

**Key CSS Changes**:
```css
/* Desktop Grid */
.plp-grid__content {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
}

/* Full-width items */
.plp-grid__item--full {
    grid-column: span 2;
}

/* Pattern: items 3,4,9,10,15,16... span both columns */
.plp-grid__item:nth-child(6n+3),
.plp-grid__item:nth-child(6n+4) {
    grid-column: span 2;
}
```

#### 3. `assets/js/src/product-listing.ts`

**New Class**: `ProductGridLoader`

**Responsibilities**:
- Handle Load More button clicks
- Fetch additional products via AJAX
- Append products to grid
- Update product count
- Handle loading/error states

**Key Methods**:
```typescript
class ProductGridLoader {
    private currentPage: number = 1;
    private totalPages: number;
    private remainingProducts: number;

    constructor(loadMoreButton: HTMLElement);
    init(): void;
    loadMore(): Promise<void>;
    appendProducts(products: Product[]): void;
    updateCount(): void;
    hideButton(): void;
    showLoading(): void;
    hideLoading(): void;
    showError(): void;
}
```

### AJAX Endpoint

#### REST API Route

**Route**: `/wp-json/wprig/v1/products/load-more`

**Method**: POST

**Request Body**:
```json
{
    "category_id": 123,
    "page": 2,
    "per_page": 6,
    "filters": ["face-creme", "dry-skin"]
}
```

**Response**:
```json
{
    "products": [
        {
            "id": 456,
            "name": "Product Name",
            "price": "$29.99",
            "image": "URL",
            "hover_image": "URL",
            "permalink": "URL",
            "tagline": "Product tagline",
            "pills": ["50ML", "SKINCARE"]
        }
    ],
    "total": 24,
    "page": 2,
    "per_page": 6,
    "has_more": true
}
```

### Data Structures

#### Product Object (AJAX Response)
```typescript
interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
    hover_image: string;
    permalink: string;
    tagline: string;
    pills: string[];
}
```

#### Load More Response
```typescript
interface LoadMoreResponse {
    products: Product[];
    total: number;
    page: number;
    per_page: number;
    has_more: boolean;
}
```

## Implementation Plan

### Phase 1: CSS Grid Refactor
1. Update `_product-listing.css` with CSS Grid rules
2. Test with various product counts (1-20)
3. Verify 2-1-1-2 pattern maintains
4. Test responsive breakpoints
5. Visual QA against current design

### Phase 2: Template Simplification
1. Remove `array_slice` from `product-grid.php`
2. Remove manual row management
3. Add data attributes for AJAX
4. Test with different product counts

### Phase 3: AJAX Endpoint
1. Register REST API route in `Component.php`
2. Query products with current filters
3. Format product data for JSON response
4. Test with various filter combinations

### Phase 4: JavaScript Loader
1. Create `ProductGridLoader` class
2. Implement AJAX fetch
3. Append products to grid
4. Update product count
5. Handle edge cases (no products, error, etc.)

### Phase 5: Integration
1. Initialize loader on DOM ready
2. Integrate with filter plugin
3. Test filtered results + load more
4. Mobile testing

## Testing Strategy

### Test Scenarios

#### Scenario 1: Single Product
**Given**: Category has 1 product
**When**: Page loads
**Then**:
- Single half-width card displays
- No empty grid cells
- No "Load More" button

#### Scenario 2: Pattern Maintenance (6 Products)
**Given**: Category has 6 products
**When**: Page loads
**Then**:
- 2-1-1-2 pattern displays correctly
- Half, Half, Full, Full, Half, Half
- Spacing matches original design

#### Scenario 3: Pattern Repetition (12 Products)
**Given**: Category has 12 products
**When**: Page loads
**Then**:
- Pattern repeats: 2-1-1-2, 2-1-1-2
- Items 9,10 span full width
- Visual consistency maintained

#### Scenario 4: Load More - Initial Load
**Given**: Category has 15 products
**When**: Page loads
**Then**:
- First 6 products display
- "Load More" button visible
- Product count: "6 PRODUCTS"
- Remaining: 9

#### Scenario 5: Load More - After Click
**Given**: 15 products, 6 displayed
**When**: User clicks "Load More"
**Then**:
- Loading state displays
- AJAX request fires
- Next 6 products append to grid
- Product count updates: "12 PRODUCTS"
- Pattern continues: 2-1-1-2, 2-1-1-2

#### Scenario 6: Load More - Final Batch
**Given**: 15 products, 12 displayed
**When**: User clicks "Load More"
**Then**:
- Final 3 products append
- Pattern: [half, half, full]
- "Load More" button hides
- Product count: "15 PRODUCTS"

#### Scenario 7: Filtered Results + Load More
**Given**: Filter returns 8 products
**When**: User clicks "Load More"
**Then**:
- First 6 display
- Remaining 2 load on click
- Final layout: [half, half, full, full, half, half, half, half]

#### Scenario 8: Mobile Responsive
**Given**: Tablet/mobile viewport
**When**: Any number of products load
**Then**:
- Grid adapts to 3-column (tablet) or 2-column (mobile)
- Pattern rules don't apply on mobile
- All products display correctly

## Dependencies

### External Dependencies
- WooCommerce (7.0+)
- WordPress (6.0+)
- Eternal Product Category Filter plugin (for filter integration)

### Internal Dependencies
- Existing product card HTML structure
- Existing responsive breakpoints
- Filter plugin integration (Task 1)

## Risks & Mitigations

### Risk 1: Visual Regression
**Mitigation**: Comprehensive visual QA, pixel-perfect comparison with current design

### Risk 2: CSS Grid Browser Support
**Mitigation**: CSS Grid has 95%+ browser support, graceful fallback to flexbox

### Risk 3: Pattern Breaking with Dynamic Loads
**Mitigation**: Use nth-child formula (6n+3, 6n+4) for infinite pattern

### Risk 4: AJAX Performance
**Mitigation**: Server-side caching, lazy loading images, optimize queries

### Risk 5: Filter + Load More Conflicts
**Mitigation**: Pass filter parameters to AJAX endpoint, reset on filter change

## Rollout Plan

### Pre-Deployment
1. Visual QA testing on staging
2. Cross-browser testing (Chrome, Safari, Firefox, Edge)
3. Performance testing (AJAX response times)
4. Mobile device testing
5. Test with various product counts (1-100)

### Deployment Steps
1. Deploy CSS changes
2. Deploy template changes
3. Deploy AJAX endpoint
4. Deploy JavaScript changes
5. Test in production

### Post-Deployment
1. Monitor AJAX error rates
2. Check Load More click-through rates
3. Verify product count accuracy
4. Performance monitoring

## Success Criteria

### Must Have
- ✅ Grid adapts to any product count (1-100+)
- ✅ 2-1-1-2 pattern maintains for 6+ products
- ✅ Load More loads additional products via AJAX
- ✅ Product count updates correctly
- ✅ No visual regression
- ✅ Mobile responsive maintained

### Should Have
- ✅ Loading state displays during fetch
- ✅ Error handling for failed requests
- ✅ Smooth animations when products append
- ✅ Integration with filter plugin

### Could Have
- ⚪ Infinite scroll (instead of button)
- ⚪ Lazy loading images
- ⚪ Skeleton loading states

## Open Questions

1. **Products Per Batch**: Should we load 6, 9, or 12 products per batch?
   - **Decision**: 6 products (matches initial pattern)

2. **Animation**: Should we animate products when they're loaded?
   - **Decision**: Yes, simple fade-in (200ms)

3. **Error Handling**: What should happen if AJAX fails?
   - **Decision**: Show error message, retry button

## References

- **Current Implementation**: `template-parts/product-listing/product-grid.php`
- **Current Styles**: `assets/css/src/_product-listing.css`
- **Figma Design**: [Link to Figma file]
- **Filter Integration Spec**: `/.ai/plans/2026-04-16-filter-plugin-integration/SPEC.md`

## Appendix: Code Snippets

### CSS Grid Pattern Formula
```css
/* 2-1-1-2 Pattern: Items 3,4,9,10,15,16... span 2 columns */
.plp-grid__item:nth-child(6n+3),
.plp-grid__item:nth-child(6n+4) {
    grid-column: span 2;
}
```

### AJAX Endpoint Registration
```php
add_action('rest_api_init', function () {
    register_rest_route('wprig/v1', '/products/load-more', [
        'methods' => 'POST',
        'callback' => 'wprig_load_more_products',
        'permission_callback' => '__return_true'
    ]);
});
```

### Load More JavaScript (Skeleton)
```typescript
class ProductGridLoader {
    async loadMore(): Promise<void> {
        this.showLoading();

        try {
            const response = await fetch('/wp-json/wprig/v1/products/load-more', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    category_id: this.categoryId,
                    page: this.currentPage + 1,
                    per_page: 6,
                    filters: this.getActiveFilters()
                })
            });

            const data = await response.json();

            if (data.products.length > 0) {
                this.appendProducts(data.products);
                this.currentPage++;
                this.updateCount(data.total);

                if (!data.has_more) {
                    this.hideButton();
                }
            }
        } catch (error) {
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    appendProducts(products: Product[]): void {
        products.forEach(product => {
            const html = this.renderProductCard(product);
            this.gridContainer.insertAdjacentHTML('beforeend', html);
        });

        // Re-initialize GSAP animations for new cards
        this.initAnimations();
    }
}
```

### Template Data Attributes
```php
<div class="plp-grid__content"
     data-category-id="<?php echo esc_attr($category_id); ?>"
     data-total-products="<?php echo esc_attr($total_products); ?>"
     data-remaining="<?php echo esc_attr(max(0, $total_products - 6)); ?>">
```

---

**Document Version**: 1.0
**Last Updated**: 2026-04-16
**Author**: Claude AI Agent
**Reviewers**: [To be assigned]
**Approval Status**: Pending
