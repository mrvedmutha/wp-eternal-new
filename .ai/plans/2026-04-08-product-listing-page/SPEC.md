# Product Listing Page (PLP) Redesign Specification

## Mission Statement

Redesign the WooCommerce product category archive page to match the Eternal Labs brand design system, featuring an editorial header, mixed-layout product grid, filter sidebar, and FAQ section.

## Design Compliance

### Design Tokens (from PDP Design System memory)
- **Primary**: `#021f1d`
- **Secondary/Muted**: `#868686`
- **Image Background**: `#f5f5f5`
- **Fonts**:
  - Display: Cormorant Garamond (Light Italic, Regular)
  - Body/UI: Maison Neue (Book, Medium, Bold)
- **Divider**: 0.5px hairline
- **CTA Button**: `#021f1d` bg, white text, 46px tall, no border-radius

### Style Guide Status
⚠️ `.ai/STYLE-GUIDE.md` does not exist yet. This feature will establish PLP patterns that should later be documented in a centralized style guide.

### Figma References
**File Key**: `aJ4VjKdFNahXA6Ly4jkRtJ`
- Header Section: `node-id=694-1717`
- Product Grid + Sidebar: `node-id=694-1726`
- FAQ Section: `node-id=694-1898`

## Architectural Fit

### Components to Create
1. **`inc/Product_Listing/Component.php`** — Main PLP component
   - Registers templates and enqueues assets
   - Hooks into WooCommerce archive pages
   - Follows WP Rig `Component_Interface` pattern

2. **`inc/Product_Listing/Template_Loader.php`** (optional) — Custom template loader
   - Overrides `woocommerce.php` or `archive-product.php`
   - Loads custom PLP template parts

3. **`template-parts/product-listing/`** — Template partials
   - `header.php` — Category header section
   - `product-grid.php` — Product grid with mixed layout
   - `filters-sidebar.php` — Filter sidebar template
   - `faq-section.php` — FAQ accordion section

### Hooks & Filters to Use
- `woocommerce_archive_description` — For custom header output
- `woocommerce_before_shop_loop` — For product count and filters
- `woocommerce_product_query` — For custom filtering (future)
- `wp_enqueue_scripts` — For PLP-specific CSS/JS

### Asset Pipeline
- **CSS**: `assets/css/src/_product-listing.css` → compiled via existing build
- **JS**: `assets/js/src/product-listing.ts` → compiled via TypeScript build
- Filter toggles, FAQ accordion, product grid interactions

## User Stories

1. **As a shopper**, I want to see an editorial category header with brand story so I understand the category's philosophy.
2. **As a shopper**, I want to browse products in a visually interesting mixed grid layout so the page feels curated and premium.
3. **As a shopper**, I want to filter products by type, skin type, and benefits so I can find products relevant to my needs.
4. **As a shopper**, I want quick access to FAQs on the category page so I can make informed decisions without leaving the page.
5. **As an editor**, I want to manage category descriptions via WordPress admin so I can control the brand narrative.
6. **As an editor**, I want to manage FAQs via the Eternal Product Category FAQ plugin so I can address common questions directly on category pages.
7. **As a developer**, I want the PLP to use existing product data logic so I don't duplicate code from PDP components.

## Success Metrics

1. **Visual Fidelity**: Matches Figma design within 5px tolerance for spacing/sizing
2. **Accessibility**:
   - Passes Lighthouse accessibility scan (90+ score)
   - Keyboard navigation works for filters and FAQ
   - ARIA labels on all interactive elements
3. **Performance**:
   - LCP < 2.5s on 4G
   - No layout shift (CLS < 0.1)
4. **Browser Support**: Works on Chrome, Firefox, Safari, Edge (last 2 versions)
5. **Responsive**: Mobile, tablet, desktop breakpoints match Figma
6. **E2E Tests**: No visual regressions in Playwright screenshot tests

## Technical Plan (The Contract)

### Phase 1: Scaffolding

```bash
# Create new WP Rig component
npm run create-rig-component Product_Listing

# Create template directory
mkdir -p template-parts/product-listing
touch template-parts/product-listing/{header,product-grid,filters-sidebar,faq-section}.php
```

**Files Created**:
- `inc/Product_Listing/Component.php` (via CLI tool)
- `inc/Product_Listing/Template_Loader.php`
- `template-parts/product-listing/*.php` (4 files)
- `assets/css/src/_product-listing.css`
- `assets/js/src/product-listing.ts`

### Phase 2: Header Section

**Figma Node**: `694-1717`

**Data Source**:
- Breadcrumb: WooCommerce `woocommerce_breadcrumb()` or custom from `get_queried_object()->name`
- Title: Category name from `get_queried_object()->name`
- Description: `get_queried_object()->description` (native WC category field)

**Template**: `template-parts/product-listing/header.php`

```php
<?php
/**
 * Product Listing Header
 * Displays breadcrumb, category title, and description
 *
 * @hooked woocommerce_archive_description - 10
 */
?>
<div class="plp-header" data-node-id="694-1717">
  <?php // Breadcrumb, title, description ?>
</div>
```

**CSS Structure**:
- `.plp-header` — container with `pt-[204px] pb-[40px] pl-[40px]`
- `.plp-breadcrumb` — Maison Neue 9px, tracking 1.26px
- `.plp-title` — Cormorant Garamond Light Italic 52px
- `.plp-description` — Maison Neue Book 13px, max-width 365px

### Phase 3: Product Grid with Mixed Layout

**Figma Node**: `694-1726`

**Data Source**: Reuse existing `Related_Products` product card logic
- Product data: `WC_Product` object
- Badges: Product attributes (already implemented)
- English/French names: Already implemented in PDP
- Price: `$product->get_price()`

**Layout Pattern**: Fixed 2-1-1-2 pattern
```
Row 1: [316px] [316px]  (gap: 32px)
Row 2: [664px full-width]
Row 3: [664px full-width]
Row 4: [316px] [316px]  (gap: 32px)
```

**Template**: `template-parts/product-listing/product-grid.php`

```php
<?php
/**
 * Product Grid with Fixed Layout Pattern
 *
 * @hooked woocommerce_before_shop_loop - 20
 */
global $wp_query;
$products = $wp_query->posts;

// Fixed pattern: 2-up, single, single, 2-up
$pattern = ['half', 'half', 'full', 'full', 'half', 'half'];
?>
<div class="plp-grid" data-node-id="694-1726">
  <?php foreach (array_slice($products, 0, 6) as $index => $product): ?>
    <?php
    $layout = $pattern[$index] ?? 'half';
    $css_class = $layout === 'full' ? 'plp-grid__item--full' : 'plp-grid__item--half';
    ?>
    <div class="plp-grid__item <?php echo esc_attr($css_class); ?>">
      <?php // Load product card template ?>
    </div>
  <?php endforeach; ?>
</div>
```

**CSS Structure**:
- `.plp-grid` — Flex column, gap 40px
- `.plp-grid__item--half` — 316px width (fixed per Figma)
- `.plp-grid__item--full` — 664px width (fixed per Figma)
- `.plp-grid__row--split` — Flex row, gap 32px (for 2-up rows)
- Product card styles reused from `Related_Products` component

### Phase 4: Filter Sidebar (UI Template Only)

**Figma Node**: `694-1726` (left sidebar, 206px width)

**Current Status**: ⚠️ Implementation deferred pending filter data source decision
- **Build**: UI template only
- **No**: Actual filtering logic (Phase 5)

**Template**: `template-parts/product-listing/filters-sidebar.php`

```php
<?php
/**
 * Filter Sidebar - UI Template Only
 *
 * @hooked woocommerce_before_shop_loop - 10
 */
?>
<aside class="plp-filters" data-node-id="694-1732">
  <?php // Clear All link ?>
  <?php // Sort dropdown ?>
  <?php // Filter groups: Product Types, Skin Type, Benefits ?>
  <?php // All filters hardcoded/static for now ?>
</aside>
```

**CSS Structure**:
- `.plp-filters` — Sticky, 206px width, h-[1224px] per Figma
- `.plp-filters__clear` — Underlined link
- `.plp-filters__sort` — Border dropdown with arrow
- `.plp-filters__group` — Filter category sections
- `.plp-filters__checkbox` — Custom checkbox styling

**JavaScript**:
- Filter toggle state management (for future AJAX filtering)
- Sort dropdown interaction

### Phase 5: FAQ Section

**Figma Node**: `694-1898`

**Data Source**: Eternal Product Category FAQ Plugin
- Plugin stores Q&A data in product category taxonomy
- Data is output to global JavaScript object on category pages
- Structure: `[{ question: "...", answer: "..." }]`
- Available on frontend at `/product-category/[category-id]`

**Integration Approach**: Consumer Pattern (Theme consumes plugin data)
- Plugin handles data storage and admin UI
- Theme renders FAQ section using plugin's JavaScript output
- No category meta fields needed in theme

**Template**: `template-parts/product-listing/faq-section.php`

```php
<?php
/**
 * FAQ Accordion Section
 *
 * @hooked woocommerce_after_shop_loop - 10
 *
 * Consumes FAQ data from Eternal Product Category FAQ plugin
 * Plugin outputs data to: window.eternalCategoryFAQ
 */
// Check if we're on a product category page
if (!is_product_category()) {
  return;
}

// Output container - will be populated by JS from plugin data
?>
<section class="plp-faq" data-node-id="694-1898">
  <div class="plp-faq__title">FAQ'S</div>
  <div class="plp-faq__accordion" id="plp-faq-container">
    <!-- FAQ items rendered via JavaScript from plugin data -->
    <noscript><?php esc_html_e('FAQs require JavaScript to display.', 'wprig'); ?></noscript>
  </div>
</section>
```

**CSS Structure**:
- `.plp-faq` — `px-[40px] py-[80px]`
- `.plp-faq__title` — Cormorant Light Italic 52px
- `.plp-faq__item` — Border dividers between items
- `.plp-faq__question` — Maison Neue Book 17px, with toggle
- `.plp-faq__toggle` — Circle with +/- (10.564px)
- `.plp-faq__answer` — Maison Neue Book 13px, muted color

**JavaScript** (`assets/js/src/product-listing.ts`):

```typescript
/**
 * FAQ Section - Consume plugin data
 * Reads from window.eternalCategoryFAQ set by Eternal Product Category FAQ plugin
 */
function initFAQSection(): void {
  const container = document.getElementById('plp-faq-container');
  if (!container) return;

  // Check if plugin has populated FAQ data
  const pluginData = (window as any).eternalCategoryFAQ;

  if (!pluginData || !Array.isArray(pluginData) || pluginData.length === 0) {
    container.innerHTML = ''; // Hide section if no FAQs
    return;
  }

  // Render FAQ items from plugin data
  container.innerHTML = pluginData.map((faq: {question: string, answer: string}, index: number) => `
    <details class="plp-faq__item" ${index === 0 ? 'open' : ''}>
      <summary class="plp-faq__question">
        ${escapeHtml(faq.question)}
        <span class="plp-faq__toggle">±</span>
      </summary>
      <div class="plp-faq__answer">
        ${faq.answer} // Plugin handles sanitization
      </div>
    </details>
  `).join('');

  // Add smooth animation (optional)
  const details = container.querySelectorAll('details');
  details.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      // Animation logic if needed
    });
  });
}

// Escape HTML for question text (answers come pre-sanitized from plugin)
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initFAQSection);
```

### Phase 6: Component Registration

**File**: `inc/Product_Listing/Component.php`

```php
<?php
namespace WP_Rig\WP_Rig\Product_Listing;

use WP_Rig\WP_Rig\Component_Interface;

class Component implements Component_Interface {
  public function get_slug(): string {
    return 'product-listing';
  }

  public function initialize(): void {
    // Enqueue assets
    add_action('wp_enqueue_scripts', [$this, 'enqueue_assets']);

    // Override WC templates
    add_filter('woocommerce_template_loader_files', [$this, 'override_templates']);

    // FAQ data handled by Eternal Product Category FAQ plugin
    // Theme consumes plugin's global JavaScript output
  }

  public function enqueue_assets(): void {
    if (!is_product_category()) {
      return;
    }

    // CSS
    wp_enqueue_style(
      'eternal-product-listing',
      get_theme_file_uri('/assets/css/product-listing.min.css'),
      [],
      filemtime(get_theme_file_path('/assets/css/product-listing.min.css'))
    );

    // JS
    wp_enqueue_script(
      'eternal-product-listing',
      get_theme_file_uri('/assets/js/product-listing.min.js'),
      [],
      filemtime(get_theme_file_path('/assets/js/product-listing.min.js')),
      true
    );

    // Localize script for plugin integration
    wp_localize_script('eternal-product-listing', 'eternalPLP', [
      'pluginDataUrl' => home_url('/product-category/'),
    ]);
  }

  public function override_templates(array $templates): array {
    if (is_product_category()) {
      // Override WC archive template
    }
    return $templates;
  }
}
```

**Key Changes**:
- No category meta field hooks (handled by plugin)
- Added `wp_localize_script` for plugin integration data
- Simplified initialization - just enqueue and template overrides

### Phase 7: Testing & Verification

**Accessibility Audit**:
```bash
npm run test:a11y
```

**Visual Regression Tests**:
```bash
npm run test:e2e -- --grep "PLP"
```

**Manual Testing Checklist**:
- [ ] Header displays correctly on all categories
- [ ] Product grid follows 2-1-1-2 pattern
- [ ] Product cards use existing PDP data logic
- [ ] Filter sidebar UI matches Figma
- [ ] FAQ section loads data from Eternal Product Category FAQ plugin
- [ ] FAQ accordion expands/collapses
- [ ] FAQ section hides gracefully when plugin inactive or no FAQs
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly

## Dependencies & Integration Points

### Existing Components to Reference
- `inc/Related_Products/Component.php` — Product card data logic
- `inc/Product_Detail/Component.php` — Product data patterns

### Data Sources
- WooCommerce `product_cat` taxonomy
- `get_queried_object()->description` — Category description
- **Eternal Product Category FAQ plugin** — FAQ data via `window.eternalCategoryFAQ`

### Plugin Integration Contract

**Eternal Product Category FAQ Plugin** → **Theme Communication**

The plugin outputs FAQ data to a global JavaScript object on product category pages:

```javascript
// Available on /product-category/[category-id] pages
window.eternalCategoryFAQ = [
  {
    question: "WHAT MAKES ETERNAL LABS SKINCARE DIFFERENT?",
    answer: "Eternal Labs skincare combines..."
  },
  {
    question: "ARE ETERNAL LABS SKINCARE FORMULATIONS SUITABLE FOR SENSITIVE SKIN?",
    answer: "Answer Number two"
  }
];
```

**Theme Responsibilities**:
1. Check if `window.eternalCategoryFAQ` exists on category pages
2. Render FAQ items using the plugin's data
3. Hide FAQ section if no data present
4. Handle accordion toggle interactions

**Plugin Responsibilities**:
1. Store Q&A pairs in product category taxonomy
2. Output data to `window.eternalCategoryFAQ` on category pages
3. Handle admin UI for managing FAQs
4. Sanitize answer content before output

**Error Handling**:
- If plugin is inactive: Hide FAQ section gracefully
- If no FAQs for category: Don't render section
- If data format changes: Log error, hide section

### Build System Integration
- Update `config/config.json` if new export paths needed
- CSS compiles via existing `npm run build:css`
- JS compiles via existing TypeScript build

## Open Questions & Future Scope

### Deferred to Phase 2
1. **Filter Implementation**:
   - Data source: WC attributes vs custom taxonomy?
   - AJAX filtering vs page reload?
   - URL state management?

2. **Pagination**:
   - Load more button?
   - Infinite scroll?
   - Traditional pagination?

3. **Mobile Layout**:
   - Filter sidebar behavior (drawer, modal, accordion?)
   - Product grid stacking order

### Resolved ✅
1. **FAQ Data Source**: Eternal Product Category FAQ plugin
   - Theme consumes plugin's global JavaScript output
   - No theme-side meta fields needed

## Implementation Order

1. ✅ Clarification questions (asked & answered)
2. ⏳ SPEC.md approval (**YOU ARE HERE**)
3. ⏳ Scaffolding (`npm run create-rig-component`)
4. ⏳ Header section
5. ⏳ Product grid with mixed layout
6. ⏳ Filter sidebar (UI only)
7. ⏳ FAQ section (consume plugin data via JS)
8. ⏳ Testing & refinement

## Approval Required

Before proceeding to implementation, please confirm:

- [ ] The 2-1-1-2 fixed grid pattern is correct for all categories
- [ ] FAQ section should consume data from Eternal Product Category FAQ plugin
- [ ] Filter sidebar should be UI-only for this phase
- [ ] Design tokens from PDP memory are current and accurate
- [ ] No other PLP sections or features are missing from this spec

---

**Next Step**: Upon approval, run `npm run create-rig-component Product_Listing` to begin Phase 1 scaffolding.
