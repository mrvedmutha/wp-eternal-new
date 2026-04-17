# Shop Page Redesign Specification

## Mission Statement

Create a dedicated Shop page that mirrors the Product Listing Page visual design but operates as a completely separate component, displaying all products across all categories (Skincare and Neutraceuticals) with aggregated filters and FAQs.

## Current State Assessment

### Current /shop Page
- **URL**: https://shreyanswings-qhcxw-studio.wp.build/shop/
- **Layout**: Default WooCommerce shop template with sidebar
- **Header**: Simple "Shop" heading with default breadcrumb
- **Filters**: None (only default WooCommerce sorting dropdown)
- **Product Grid**: Standard grid layout with equal-sized cards
- **FAQ**: No FAQ section
- **Sidebar**: Default WordPress sidebar (Recent Posts, Comments, Archives, Categories)

### Reference PLP Implementation
- **URL**: https://shreyanswings-qhcxw-studio.wp.build/product-category/skincare/
- **Layout**: Custom editorial layout with left sidebar (206px) + product grid (80%)
- **Header**: Custom breadcrumb + category title + description
- **Filters**: Dynamic filters from Eternal Filter plugin (Product Types, Skin Type, Benefits)
- **Product Grid**: Mixed 2-1-1-2 layout pattern
- **FAQ**: Category-specific FAQ from Eternal FAQ plugin

## Architectural Decision: Separate Components

**Approach**: Create a dedicated `inc/Shop/` component that:
- Mirrors PLP visual design exactly
- Operates independently from `inc/Product_Listing/`
- Has its own templates, CSS, and JavaScript
- Shares no code with PLP (intentional duplication for separation)

**Rationale**:
- Shop and PLP can evolve independently
- Clear separation of concerns
- Easier to maintain Shop-specific logic
- Avoids complex conditional logic in shared component

## Design Compliance

### Design Tokens (from PDP Design System)
- **Primary**: `#021f1d`
- **Secondary/Muted**: `#868686`
- **Image Background**: `#f5f5f5`
- **Fonts**:
  - Display: Cormorant Garamond (Light Italic, Regular)
  - Body/UI: Maison Neue (Book, Medium, Bold)
- **Divider**: 0.5px hairline
- **CTA Button**: `#021f1d` bg, white text, 46px tall, no border-radius

### Figma References
Reuse existing PLP Figma nodes:
- **Header Section**: `node-id=694-1717` (adapted for Shop context)
- **Product Grid + Sidebar**: `node-id=694-1726`
- **FAQ Section**: `node-id=694-1898` (aggregated from all categories)

### File Key: `aJ4VjKdFNahXA6Ly4jkRtJ`

## Component Structure

### New Component: `inc/Shop/`

```
inc/Shop/
├── Component.php           # Main component class
└── (no additional files needed)
```

### New Templates: `template-parts/shop/`

```
template-parts/shop/
├── header.php              # Shop-specific header
├── product-grid.php        # Product grid with mixed layout
├── filters-sidebar.php     # Filter sidebar (aggregated)
└── faq-section.php         # FAQ section (aggregated)
```

### New Assets

**CSS**: `assets/css/src/_shop.css` → `assets/css/shop.min.css`
**JS**: `assets/js/src/shop.ts` → `assets/js/shop.min.js`

## Key Features

### 1. Header Section

**Template**: `template-parts/shop/header.php`

**Content**:
```php
<h1>SHOP</h1>
<p class="shop-description">
  Explore our complete collection of Swiss-formulated skincare and nutraceuticals. 
  From hydrating face crèmes to essential oils, each product is designed to support 
  your journey to timeless beauty and wellness.
</p>
```

**Breadcrumb**: "HOME / SHOP" (custom, not using WooCommerce default)

### 2. Filter Sidebar

**Template**: `template-parts/shop/filters-sidebar.php`

**Data Source**: Theme-side aggregation
- Fetch all product categories (Skincare, Neutraceuticals)
- Get filter data from Eternal Filter plugin for each category
- Merge and deduplicate filter options in JavaScript
- Build filter UI from aggregated data

**Filter Groups**:
- Product Types: Face Creme, Body Oil, Hair & Body Serum, Essential Oil, etc.
- Skin Type: (from Skincare) + (from Neutraceuticals)
- Benefits: All benefits from both categories

**Behavior**: Page reload on filter selection (same as PLP)

### 3. Product Grid

**Template**: `template-parts/shop/product-grid.php`

**Layout**: Same mixed 2-1-1-2 pattern as PLP
```
Row 1: [316px] [316px]  (gap: 32px)
Row 2: [664px full-width]
Row 3: [664px full-width]
Row 4: [316px] [316px]  (gap: 32px)
```

**Pagination**:
- Show first 6 products
- "Load More" button for additional products
- Each load adds 6 more products

**Product Cards**: Same markup as PLP (can reference PLP templates)

**Ordering**: Default WooCommerce product ordering

### 4. FAQ Section

**Template**: `template-parts/shop/faq-section.php`

**Data Source**: Theme-side aggregation
- Query all product categories
- Fetch FAQ data from term meta (`faq_questions`)
- Show ALL FAQs from all categories (no deduplication)
- Render as accordion (first item open by default)

**JavaScript Global**: `window.eternalShopFAQ`

## User Stories

1. **As a shopper**, I want to see all products in one place so I can explore the complete Eternal collection.
2. **As a shopper**, I want to filter products across categories so I can find exactly what I need.
3. **As a shopper**, I want to see combined context for Skincare and Neutraceuticals so I understand the full product range.
4. **As a shopper**, I want access to all FAQs in one place so I can get answers without visiting multiple category pages.
5. **As an editor**, I want the Shop page to automatically reflect new products and FAQs so I don't have to manually update the shop page.
6. **As a developer**, I want Shop and PLP to be separate so I can maintain them independently.

## Success Metrics

1. **Visual Fidelity**: Matches PLP design within 5px tolerance
2. **Accessibility**:
   - Passes Lighthouse accessibility scan (90+ score)
   - Keyboard navigation works for filters and FAQ
   - ARIA labels on all interactive elements
3. **Performance**:
   - LCP < 2.5s on 4G
   - No layout shift (CLS < 0.1)
   - Efficient filter aggregation (no N+1 queries)
4. **Browser Support**: Works on Chrome, Firefox, Safari, Edge (last 2 versions)
5. **Responsive**: Mobile, tablet, desktop breakpoints match Figma
6. **E2E Tests**: No visual regressions in Playwright screenshot tests

## Technical Plan (The Contract)

### Phase 1: Scaffolding

```bash
# Create new WP Rig component for Shop
npm run create-rig-component Shop

# Create template directory
mkdir -p template-parts/shop
touch template-parts/shop/{header,product-grid,filters-sidebar,faq-section}.php
```

**Files Created**:
- `inc/Shop/Component.php` (via CLI tool)
- `template-parts/shop/*.php` (4 files)
- `assets/css/src/_shop.css`
- `assets/js/src/shop.ts`

### Phase 2: Component Registration

**File**: `inc/Shop/Component.php`

```php
<?php
namespace WP_Rig\WP_Rig\Shop;

use WP_Rig\WP_Rig\Component_Interface;
use function add_action;
use function add_filter;
use function is_shop;
use function get_theme_file_path;
use function get_theme_file_uri;
use function filemtime;
use function wp_enqueue_style;
use function wp_enqueue_script;
use function wp_localize_script;
use function get_template_part;
use function get_terms;
use function get_term_meta;

class Component implements Component_Interface {

	public function get_slug(): string {
		return 'shop';
	}

	public function initialize(): void {
		// Enqueue assets.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		// Output custom header.
		remove_action( 'woocommerce_archive_description', 'woocommerce_taxonomy_archive_description', 10 );
		add_action( 'woocommerce_archive_description', array( $this, 'output_header' ), 10 );

		// Output product grid with mixed layout.
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
		remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 30 );
		add_action( 'woocommerce_before_shop_loop', array( $this, 'output_filters_and_grid' ), 10 );

		// Output FAQ data script.
		add_action( 'wp_footer', array( $this, 'output_faq_data_script' ), 10 );
	}

	public function enqueue_assets(): void {
		if ( ! is_shop() ) {
			return;
		}

		$css_file_path = get_theme_file_path( 'assets/css/shop.min.css' );
		$js_file_path  = get_theme_file_path( 'assets/js/shop.min.js' );

		// Enqueue CSS.
		if ( file_exists( $css_file_path ) ) {
			wp_enqueue_style(
				'eternal-shop',
				get_theme_file_uri( 'assets/css/shop.min.css' ),
				array(),
				file_exists( $css_file_path ) ? filemtime( $css_file_path ) : '1.0.0'
			);
		}

		// Enqueue JS.
		if ( file_exists( $js_file_path ) ) {
			wp_enqueue_script(
				'eternal-shop',
				get_theme_file_uri( 'assets/js/shop.min.js' ),
				array(),
				file_exists( $js_file_path ) ? filemtime( $js_file_path ) : '1.0.0',
				true
			);

			// Prepare shop-specific data.
			$shop_data = $this->get_shop_data();

			// Localize script.
			wp_localize_script(
				'eternal-shop',
				'eternalShop',
				$shop_data
			);
		}
	}

	public function output_header(): void {
		if ( ! is_shop() ) {
			return;
		}

		get_template_part( 'template-parts/shop/header' );
	}

	public function output_filters_and_grid(): void {
		if ( ! is_shop() ) {
			return;
		}

		get_template_part( 'template-parts/shop/product-grid' );
	}

	public function output_faq_data_script(): void {
		if ( ! is_shop() ) {
			return;
		}

		// Get aggregated FAQ data from all categories.
		$faq_data = $this->get_aggregated_faqs();

		if ( empty( $faq_data ) || ! is_array( $faq_data ) ) {
			printf( '<script>window.eternalShopFAQ = [];</script>' );
			return;
		}

		// Output as JavaScript global.
		printf(
			'<script>window.eternalShopFAQ = %s;</script>',
			wp_json_encode( $faq_data )
		);
	}

	/**
	 * Gets shop-specific data for JavaScript.
	 */
	private function get_shop_data(): array {
		// Get all product categories for filter aggregation.
		$categories = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'hide_empty' => false,
				'exclude'    => array( get_option( 'default_product_cat' ) ), // Exclude Uncategorized
			)
		);

		$category_ids = array();
		$rest_urls    = array();

		foreach ( $categories as $category ) {
			$category_ids[]   = $category->term_id;
			$rest_urls[]      = get_rest_url( null, "eternal-filters/v1/category/{$category->term_id}/filters" );
		}

		return array(
			'categoryIds'   => $category_ids,
			'restUrls'      => $rest_urls,
			'nonce'         => wp_create_nonce( 'wp_rest' ),
			'ajaxUrl'       => admin_url( 'admin-ajax.php' ),
		);
	}

	/**
	 * Gets aggregated FAQ data from all product categories.
	 */
	private function get_aggregated_faqs(): array {
		$categories = get_terms(
			array(
				'taxonomy'   => 'product_cat',
				'hide_empty' => false,
				'exclude'    => array( get_option( 'default_product_cat' ) ),
			)
		);

		$all_faqs = array();

		foreach ( $categories as $category ) {
			$cat_faqs = get_term_meta( $category->term_id, 'faq_questions', true );

			if ( empty( $cat_faqs ) || ! is_array( $cat_faqs ) ) {
				continue;
			}

			// Add category context to each FAQ.
			foreach ( $cat_faqs as $faq ) {
				$faq['category'] = $category->name;
				$all_faqs[]       = $faq;
			}
		}

		return $all_faqs;
	}
}
```

### Phase 3: Template Implementation

#### 3.1 Header Template

**File**: `template-parts/shop/header.php`

```php
<?php
/**
 * Shop Page Header
 *
 * @package wp_rig
?>
<div class="shop-header" data-node-id="694-1717">
  <div class="shop-header__inner">
    <?php if ( function_exists( 'woocommerce_breadcrumb' ) ) : ?>
    <div class="shop-breadcrumb" data-node-id="694-1719">
      <?php
      $breadcrumbs = woocommerce_breadcrumb(
        array(
          'delimiter'   => ' / ',
          'wrap_before' => '<nav class="woocommerce-breadcrumb">',
          'wrap_after'  => '</nav>',
          'before'      => '',
          'after'       => '',
          'home'        => _x( 'HOME', 'breadcrumb', 'wp-rig' ),
        ),
        false
      );
      ?>
    </div>
    <?php endif; ?>

    <div class="shop-title-group" data-node-id="694-1721">
      <h1 class="shop-title" data-node-id="694-1722">SHOP</h1>

      <div class="shop-description" data-node-id="694-1723">
        <p>
          Explore our complete collection of Swiss-formulated skincare and nutraceuticals. 
          From hydrating face crèmes to essential oils, each product is designed to support 
          your journey to timeless beauty and wellness.
        </p>
      </div>
    </div>
  </div>
</div>
```

#### 3.2 Product Grid Template

**File**: `template-parts/shop/product-grid.php`

```php
<?php
/**
 * Shop Product Grid Section with Filters and Product Display
 *
 * @package wp_rig
 */

use function WP_Rig\WP_Rig\wp_rig;

global $wp_query;

$products       = $wp_query->posts;
$total_products = count( $products );
$has_products   = $wp_query->have_posts();
?>

<div class="shop-grid" data-node-id="694-1726">
  <div class="shop-grid__top" data-node-id="694-1727">
    <div class="shop-grid__top-row">
      <div class="shop-grid__count">
        <?php
        echo esc_html(
          sprintf(
            /* translators: %d: Number of products */
            _n( '%d PRODUCT', '%d PRODUCTS', $total_products, 'wp-rig' ),
            intval( $total_products )
          )
        );
        ?>
      </div>
    </div>
    <button class="shop-grid__filter-toggle" data-node-id="694-1728">
      <?php esc_html_e( 'Add Filter', 'wp-rig' ); ?>
    </button>
  </div>
  <div class="shop-grid__divider"></div>

  <div class="shop-grid__columns" data-node-id="694-1731">
    <!-- Filters Sidebar -->
    <?php get_template_part( 'template-parts/shop/filters-sidebar' ); ?>

    <!-- Product Grid Content -->
    <div class="shop-grid__content" data-node-id="694-1798">
      <?php if ( $has_products ) : ?>
        <?php
        // Fixed pattern: 2-up, single, single, 2-up.
        $pattern          = array( 'half', 'half', 'full', 'full', 'half', 'half' );
        $display_products = array_slice( $products, 0, 6 );

        foreach ( $display_products as $index => $product_post ) :
          $product = wc_get_product( $product_post->ID );

          if ( ! $product ) {
            continue;
          }

          $layout        = $pattern[ $index ] ?? 'half';
          $is_full       = 'full' === $layout;
          $css_class     = $is_full ? 'shop-grid__item--full' : 'shop-grid__item--half';
          $is_2up_row    = ( $index < 2 || $index >= 4 );
          $is_even_index = ( 0 === $index % 2 );

          // Open row div at start of each 2-up pair.
          if ( $is_2up_row && $is_even_index ) :
            ?>
          <div class="shop-grid__row shop-grid__row--2up">
            <?php
          endif;

          // Product data.
          $pid        = $product->get_id();
          $permalink  = get_permalink( $pid );
          $name       = $product->get_name();
          $price_html = $product->get_price_html();
          $atc_url    = $product->add_to_cart_url();

          // Product images.
          $main_img_id = $product->get_image_id();
          $main_src    = $main_img_id ? wp_get_attachment_image_src( $main_img_id, 'woocommerce_single' ) : null;
          $main_url    = $main_src ? $main_src[0] : wc_placeholder_img_src( 'woocommerce_single' );
          $main_alt    = $main_img_id ? (string) get_post_meta( $main_img_id, '_wp_attachment_image_alt', true ) : $name;

          $gallery_ids = $product->get_gallery_image_ids();
          $hover_url   = '';
          if ( ! empty( $gallery_ids ) ) {
            $hover_src = wp_get_attachment_image_src( $gallery_ids[0], 'woocommerce_single' );
            $hover_url = $hover_src ? $hover_src[0] : '';
          }

          // Product metadata.
          $meta        = wp_rig()->get_product_meta( $pid );
          $french_text = $meta['french_text'] ?? '';
          $tagline     = $meta['caption'] ?? '';
          if ( ! $tagline ) {
            $tagline = wp_strip_all_tags( $product->get_short_description() );
          }

          $buy_amount = $meta['buy_box_amount'] ?? '';
          $buy_unit   = $meta['buy_box_unit'] ?? '';
          $size_label = trim( $buy_amount . $buy_unit );

          // Variant pills: size label + non-variation product attributes.
          $pills = array();
          if ( $size_label ) {
            $pills[] = strtoupper( $size_label );
          }
          foreach ( $product->get_attributes() as $attribute ) {
            if ( $attribute->is_taxonomy() && ! $attribute->get_variation() ) {
              $terms = wc_get_product_terms( $pid, $attribute->get_name(), array( 'fields' => 'names' ) );
              foreach ( $terms as $term_name ) {
                $pills[] = strtoupper( $term_name );
              }
            }
          }
          $pills = array_unique( $pills );
          ?>

          <div class="shop-grid__item <?php echo esc_attr( $css_class ); ?>">
            <!-- Image zone -->
            <div class="shop-product__img-zone">
              <a class="shop-product__img-link"
                href="<?php echo esc_url( $permalink ); ?>"
                aria-label="<?php echo esc_attr( $name ); ?>"></a>

              <img class="shop-product__img"
                src="<?php echo esc_url( $main_url ); ?>"
                alt="<?php echo esc_attr( $main_alt ? $main_alt : $name ); ?>"
                <?php echo $is_full ? 'width="664" height="616"' : 'width="316" height="423"'; ?>
                loading="lazy" />

              <?php if ( $hover_url ) : ?>
              <img class="shop-product__img shop-product__img--hover"
                src="<?php echo esc_url( $hover_url ); ?>"
                alt=""
                <?php echo $is_full ? 'width="664" height="616"' : 'width="316" height="423"'; ?>
                loading="lazy" aria-hidden="true" />
              <?php endif; ?>

              <!-- ADD TO BAG bar -->
              <div class="shop-product__atb" data-shop-atb>
                <a class="shop-product__atb-link"
                  href="<?php echo esc_url( $atc_url ); ?>"
                  data-product-id="<?php echo esc_attr( $pid ); ?>"
                  data-product-type="<?php echo esc_attr( $product->get_type() ); ?>">
                  ADD TO BAG
                </a>
              </div>
            </div>

            <!-- Product info -->
            <div class="shop-product__info">
              <?php if ( ! empty( $pills ) ) : ?>
              <div class="shop-product__pills">
                <?php foreach ( $pills as $pill ) : ?>
                <span class="shop-product__pill"><?php echo esc_html( $pill ); ?></span>
                <?php endforeach; ?>
              </div>
              <?php endif; ?>

              <div class="shop-product__names">
                <a class="shop-product__name-link" href="<?php echo esc_url( $permalink ); ?>">
                  <p class="shop-product__name"><?php echo esc_html( strtoupper( $name ) ); ?></p>
                  <?php if ( $french_text ) : ?>
                  <p class="shop-product__name-fr"><?php echo esc_html( strtoupper( $french_text ) ); ?></p>
                  <?php endif; ?>
                </a>
              </div>

              <?php if ( $tagline ) : ?>
              <p class="shop-product__tagline"><?php echo esc_html( $tagline ); ?></p>
              <?php endif; ?>

              <div class="shop-product__price">
                <?php
                // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- WooCommerce output is already escaped.
                echo $price_html;
                ?>
              </div>
            </div><!-- .shop-product__info -->
          </div><!-- .shop-grid__item -->

          <?php
          // Close row div after the second item in each 2-up pair.
          if ( $is_2up_row && ! $is_even_index ) :
            ?>
        </div><!-- .shop-grid__row -->
          <?php
          endif;

        endforeach;

        if ( count( $products ) > 6 ) :
          ?>
          <!-- Show "Load More" button for additional products -->
          <div class="shop-grid__load-more">
            <a href="#" class="shop-grid__load-more-link" data-page="2">
              Load More Products
            </a>
          </div>
        <?php endif; ?>
      <?php else : ?>
        <!-- No products found message -->
        <div class="shop-grid__empty">
          <p class="shop-grid__empty-message">
            <?php esc_html_e( 'No products found.', 'wp-rig' ); ?>
          </p>
        </div>
      <?php endif; ?>
    </div><!-- .shop-grid__content -->
  </div><!-- .shop-grid__columns -->
</div><!-- .shop-grid -->

<?php
// Always show FAQ section, even when there are no products.
get_template_part( 'template-parts/shop/faq-section' );
?>
```

#### 3.3 Filters Sidebar Template

**File**: `template-parts/shop/filters-sidebar.php`

```php
<?php
/**
 * Shop Filter Sidebar - Aggregated from All Categories
 *
 * @package wp_rig
?>
<aside class="shop-filters" data-node-id="694-1732">
  <div class="shop-filters__inner">
    <div class="shop-filters__header">
      <a href="<?php echo esc_url( home_url( '/shop/' ) ); ?>" class="shop-filters__clear">
        Clear All
      </a>
      <div class="shop-filters__sort">
        <span>SORT BY:</span>
        <span class="shop-filters__sort-value">Popularity</span>
      </div>
    </div>

    <div class="shop-filters__groups" id="shop-filters-container">
      <!-- Filters will be populated by JavaScript from aggregated data -->
      <noscript><?php esc_html_e( 'Filters require JavaScript to display.', 'wp-rig' ); ?></noscript>
    </div>
  </div>
</aside>
```

#### 3.4 FAQ Section Template

**File**: `template-parts/shop/faq-section.php`

```php
<?php
/**
 * Shop FAQ Accordion Section
 *
 * Consumes aggregated FAQ data from all product categories.
 *
 * @package wp_rig
?>
<section class="shop-faq" data-node-id="694-1898">
  <div class="shop-faq__inner">
    <div class="shop-faq__header">
      <h2 class="shop-faq__title"><?php esc_html_e( "FAQ'S", 'wp-rig' ); ?></h2>
    </div>

    <div class="shop-faq__accordion">
      <!-- FAQ items rendered via JavaScript from aggregated data -->
      <div id="shop-faq-container">
        <noscript><?php esc_html_e( 'FAQs require JavaScript to display.', 'wp-rig' ); ?></noscript>
      </div>
    </div>
  </div>
</section><!-- .shop-faq -->
```

### Phase 4: CSS Implementation

**File**: `assets/css/src/_shop.css`

Copy PLP styles and rename classes:
- `.plp-` → `.shop-` prefix
- Keep all layout, spacing, and visual styles
- Ensure complete separation from PLP styles

### Phase 5: JavaScript Implementation

**File**: `assets/js/src/shop.ts`

```typescript
/**
 * Shop Page JavaScript
 * Handles filter aggregation and FAQ rendering
 */

interface ShopData {
  categoryIds: number[];
  restUrls: string[];
  nonce: string;
  ajaxUrl: string;
}

interface FilterData {
  product_types?: { name: string; count: number }[];
  skin_type?: { name: string; count: number }[];
  benefits?: { name: string; count: number }[];
}

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

declare global {
  interface Window {
    eternalShop?: ShopData;
    eternalShopFAQ?: FAQItem[];
  }
}

/**
 * Initialize Shop page functionality
 */
function initShop(): void {
  initFilters();
  initFAQ();
}

/**
 * Initialize aggregated filters
 */
async function initFilters(): void {
  const container = document.getElementById('shop-filters-container');
  if (!container) return;

  const shopData = window.eternalShop;
  if (!shopData || !shopData.restUrls || shopData.restUrls.length === 0) {
    container.innerHTML = '<p>No filters available.</p>';
    return;
  }

  try {
    // Fetch filters from all categories
    const requests = shopData.restUrls.map(url =>
      fetch(url, {
        headers: {
          'X-WP-Nonce': shopData.nonce
        }
      })
    );

    const responses = await Promise.all(requests);
    const filterDataArray = await Promise.all(
      responses.map(r => r.json())
    );

    // Aggregate and deduplicate filters
    const aggregatedFilters = aggregateFilters(filterDataArray);

    // Render filter UI
    renderFilters(aggregatedFilters, container);

  } catch (error) {
    console.error('Error loading shop filters:', error);
    container.innerHTML = '<p>Unable to load filters.</p>';
  }
}

/**
 * Aggregate filter data from multiple categories
 */
function aggregateFilters(filterDataArray: FilterData[]): FilterData {
  const productTypes = new Map<string, number>();
  const skinTypes = new Map<string, number>();
  const benefits = new Map<string, number>();

  filterDataArray.forEach(data => {
    // Aggregate product types
    if (data.product_types) {
      data.product_types.forEach(pt => {
        productTypes.set(pt.name, (productTypes.get(pt.name) || 0) + pt.count);
      });
    }

    // Aggregate skin types
    if (data.skin_type) {
      data.skin_type.forEach(st => {
        skinTypes.set(st.name, (skinTypes.get(st.name) || 0) + st.count);
      });
    }

    // Aggregate benefits
    if (data.benefits) {
      data.benefits.forEach(b => {
        benefits.set(b.name, (benefits.get(b.name) || 0) + b.count);
      });
    }
  });

  return {
    product_types: Array.from(productTypes.entries()).map(([name, count]) => ({ name, count })),
    skin_type: Array.from(skinTypes.entries()).map(([name, count]) => ({ name, count })),
    benefits: Array.from(benefits.entries()).map(([name, count]) => ({ name, count })),
  };
}

/**
 * Render filter UI
 */
function renderFilters(filters: FilterData, container: HTMLElement): void {
  let html = '';

  // Product Types
  if (filters.product_types && filters.product_types.length > 0) {
    html += '<div class="shop-filters__group">';
    html += '<h3 class="shop-filters__group-title">PRODUCT TYPES</h3>';
    filters.product_types.forEach(pt => {
      html += `
        <label class="shop-filters__checkbox">
          <input type="checkbox" name="product_type" value="${escapeHtml(pt.name)}" />
          <span>${escapeHtml(pt.name)}</span>
          <span class="shop-filters__count">(${pt.count})</span>
        </label>
      `;
    });
    html += '</div>';
  }

  // Skin Type
  if (filters.skin_type && filters.skin_type.length > 0) {
    html += '<div class="shop-filters__group">';
    html += '<h3 class="shop-filters__group-title">SKIN TYPE</h3>';
    filters.skin_type.forEach(st => {
      html += `
        <label class="shop-filters__checkbox">
          <input type="checkbox" name="skin_type" value="${escapeHtml(st.name)}" />
          <span>${escapeHtml(st.name)}</span>
          <span class="shop-filters__count">(${st.count})</span>
        </label>
      `;
    });
    html += '</div>';
  }

  // Benefits
  if (filters.benefits && filters.benefits.length > 0) {
    html += '<div class="shop-filters__group">';
    html += '<h3 class="shop-filters__group-title">BENEFITS</h3>';
    filters.benefits.forEach(b => {
      html += `
        <label class="shop-filters__checkbox">
          <input type="checkbox" name="benefits" value="${escapeHtml(b.name)}" />
          <span>${escapeHtml(b.name)}</span>
          <span class="shop-filters__count">(${b.count})</span>
        </label>
      `;
    });
    html += '</div>';
  }

  container.innerHTML = html;

  // Add filter change listeners (page reload behavior)
  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', handleFilterChange);
  });
}

/**
 * Handle filter checkbox changes
 */
function handleFilterChange(event: Event): void {
  const checkbox = event.target as HTMLInputElement;
  const url = new URL(window.location.href);

  // Update URL params for filter
  const filterName = checkbox.name;
  const filterValue = checkbox.value;

  // Get existing filter values
  const existingParams = url.searchParams.getAll(filterName);

  if (checkbox.checked) {
    existingParams.push(filterValue);
  } else {
    const index = existingParams.indexOf(filterValue);
    if (index > -1) {
      existingParams.splice(index, 1);
    }
  }

  // Update URL
  url.searchParams.delete(filterName);
  existingParams.forEach(value => url.searchParams.append(filterName, value));

  // Reload page
  window.location.href = url.toString();
}

/**
 * Initialize FAQ section
 */
function initFAQ(): void {
  const container = document.getElementById('shop-faq-container');
  if (!container) return;

  const faqData = window.eternalShopFAQ;

  if (!faqData || !Array.isArray(faqData) || faqData.length === 0) {
    container.innerHTML = '';
    return;
  }

  // Render FAQ items
  container.innerHTML = faqData
    .map(
      (faq, index) => `
      <details class="shop-faq__item" ${index === 0 ? 'open' : ''}>
        <summary class="shop-faq__question">
          ${escapeHtml(faq.question)}
          <span class="shop-faq__toggle">±</span>
        </summary>
        <div class="shop-faq__answer">
          ${faq.answer}
        </div>
      </details>
    `
    )
    .join('');

  // Add smooth animation
  const details = container.querySelectorAll('details');
  details.forEach((detail) => {
    detail.addEventListener('toggle', () => {
      // Animation logic if needed
    });
  });
}

/**
 * Escape HTML for safety
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', initShop);
```

### Phase 6: Build System Updates

**File**: `config/config.json`

Add shop.css and shop.ts to build configuration (if needed).

### Phase 7: Testing & Verification

**Manual Testing Checklist**:
- [ ] Shop header displays correctly with combined context
- [ ] Product grid follows 2-1-1-2 pattern
- [ ] Product cards work for products from all categories
- [ ] Filter sidebar shows aggregated filters from all categories
- [ ] Filter selection reloads page with filtered products
- [ ] FAQ section loads all FAQs from all categories
- [ ] FAQ accordion expands/collapses
- [ ] FAQ section hides gracefully when no FAQs
- [ ] "Load More" button works correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly

**E2E Tests**:
```bash
npm run test:e2e -- --grep "Shop"
```

## Dependencies & Integration Points

### Existing Components (Reference Only)
- `inc/Product_Listing/Component.php` — Visual design reference only
- `template-parts/product-listing/*.php` — Markup reference only
- `inc/Related_Products/Component.php` — Product card data logic
- `inc/Product_Detail/Component.php` — Product data patterns

### Data Sources
- **Products**: `WP_Query` on shop page (default WooCommerce query)
- **Filters**: Eternal Filter plugin (category-level endpoints)
- **FAQs**: Eternal FAQ plugin (term meta)

### Plugin Integration

**Eternal Filter Plugin**:
- **Used**: Category-specific filter endpoints
- **Integration**: Theme fetches from multiple endpoints and aggregates
- **No Plugin Changes Required** ✅

**Eternal FAQ Plugin**:
- **Used**: Term meta for FAQ storage
- **Integration**: Theme queries all categories and aggregates
- **No Plugin Changes Required** ✅

## Implementation Order

1. ✅ Specification complete
2. ⏳ Scaffolding (create Shop component and templates)
3. ⏳ Component registration
4. ⏳ Template implementation
5. ⏳ CSS implementation (copy and adapt from PLP)
6. ⏳ JavaScript implementation
7. ⏳ Build system updates
8. ⏳ Testing & refinement
9. ⏳ E2E tests & accessibility audit

## Approval Required

Before proceeding to implementation, please confirm:

- [x] Create separate Shop component (not extend Product_Listing)
- [x] Theme-side aggregation for filters and FAQs
- [x] Show all FAQs from all categories (no deduplication)
- [x] Shop header text approved
- [x] Same 2-1-1-2 grid pattern as PLP
- [x] Limit to 6 products with "Load More" button
- [x] Page reload on filter (no AJAX)
- [x] Shop filters separate from PLP (no persistence)
- [x] Default WooCommerce product ordering

---

**All approvals received** ✅

**Next Step**: Begin Phase 1 - Scaffolding
