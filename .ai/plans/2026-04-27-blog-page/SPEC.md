# SPEC: Blog Page — `/blog` + Category Archives

**Date:** 2026-04-27
**Feature slug:** blog-page
**Status:** Approved ✓

---

## Mission Statement

Build the branded "Eternal Journal" blog experience as three Gutenberg blocks — Blog Hero, Blog Posts Grid, and Ingredient Spotlight — rendered on the WordPress Posts Page (`/blog`). Category archive pages share the same visual layout, with tab navigation handled via page routing and pagination handled via AJAX. All editorial content is editable in the Gutenberg block editor with no hardcoded copy.

---

## Figma Source Nodes

| Section | Node | Description |
|---|---|---|
| Blog Hero | `694:2321` | Full-width editorial hero with image, heading, subtitle, CTA |
| Blog Posts Grid | `694:2431` | Category tabs + 3-col card grid + pagination |
| Ingredient Spotlight | `694:2592` | Black-bg featured article section |

---

## Design Compliance

### Typography (from Figma design tokens)

| Token | Family | Style | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| H1 | Cormorant Garamond | Light | 52px | 58px | -1px |
| H2 | Cormorant Garamond | Regular | 40px | 48px | -2px |
| H3 Italic | Cormorant Garamond | Light Italic | 32px | 42px | 0 |
| Eyebrow | Maison Neue | Medium | 11px | 14px | 2px |
| Body Base | Maison Neue | Book | 15px | 23px | 0.15px |
| Body Small | Maison Neue | Book | 13px | 20px | 0.13px |
| CTA | DM Sans | Medium | 11px | normal | 1.98px |

### Colours

| Role | Value |
|---|---|
| Primary (dark teal) | `#021f1d` |
| Secondary (muted) | `#868686` |
| Hero background fallback | `#fbc3b6` |
| Heading dark | `#202727` |
| Spotlight background | `#000000` |
| Hero / Spotlight text | `#ffffff` |

### Responsive Breakpoints

| Breakpoint | Columns |
|---|---|
| Desktop (≥1024px) | 3 |
| Tablet (768px – 1023px) | 3 (adjusted spacing) |
| Mobile medium (480px – 767px) | 2 |
| Mobile small (<480px) | 1 |

### Custom Image Size to Register

`blog-card-thumb`: 200 × 276px, hard crop — used for every blog card thumbnail.

---

## Architectural Fit

### New Gutenberg Blocks (`assets/blocks/`)

| Block slug | Title | Purpose |
|---|---|---|
| `blog-hero` | Blog Hero | Full-width editorial hero; all copy + image editable |
| `blog-posts-grid` | Blog Posts Grid | Category tabs, AJAX card grid, pagination |
| `ingredient-spotlight` | Ingredient Spotlight | Black-bg editorial footer; editable once on `/blog` |

Each block follows the existing WP Rig structure:
```
assets/blocks/{slug}/
├── block.json        # apiVersion 2, render: file:./render.php
├── render.php        # Server-side render
├── style.css         # Frontend styles (auto-enqueued by WP)
├── editor.css        # Editor-only styles
└── src/
    └── index.js      # Editor script (block registration)
```

### New PHP Components (`inc/`)

| Component | File | Responsibility |
|---|---|---|
| Blog_Hero | `inc/Blog_Hero/Component.php` | Placeholder; block registered via Blocks component |
| Blog_Posts_Grid | `inc/Blog_Posts_Grid/Component.php` | Image size registration, AJAX handler, JS localisation |
| Ingredient_Spotlight | `inc/Ingredient_Spotlight/Component.php` | Placeholder; block registered via Blocks component |

All three must be added to `inc/Theme.php → get_default_components()`.

### New Root Templates

| File | WP Template Hierarchy Role |
|---|---|
| `home.php` | Rendered when the Posts Page is set in Reading Settings. Gets the blog page post object, calls `do_blocks()` on its content to render all three blocks. |
| `category.php` | Rendered for all WP category archives. Selectively renders Blog Hero + category-filtered posts section + Ingredient Spotlight, all sourced from the `/blog` page post object. |

### New CSS (`assets/css/src/`)

| File | Imported in |
|---|---|
| `_blog-hero.css` | `global.css` |
| `_blog-posts-grid.css` | `global.css` |
| `_ingredient-spotlight.css` | `global.css` |

### New JS (`assets/js/src/`)

| File | Purpose |
|---|---|
| `blog-posts-grid.ts` | AJAX tab switching + pagination + skeleton + `pushState` |

Enqueued only on blog-related pages via `is_home() || is_category()` check inside `Blog_Posts_Grid/Component.php`.

### Hooks Used

| Hook | Purpose |
|---|---|
| `init` | Register `blog-card-thumb` image size (200×276 hard crop) |
| `wp_enqueue_scripts` | Enqueue `blog-posts-grid.js` + `wp_localize_script` with AJAX URL + nonce |
| `wp_ajax_wp_rig_blog_posts` | Authenticated AJAX handler |
| `wp_ajax_nopriv_wp_rig_blog_posts` | Non-authenticated AJAX handler |

---

## Block Attribute Contracts

### `wp-rig/blog-hero`

| Attribute | Type | Default | Editor control |
|---|---|---|---|
| `heading` | string | "The Eternal Journal" | Rich text |
| `subtitle` | string | "Insights on skincare science…" | Plain text area |
| `ctaText` | string | "SHOP NOW" | Plain text |
| `ctaUrl` | string | `""` | URL input |
| `backgroundImage` | object `{id, url, alt}` | `{}` | MediaUpload |

### `wp-rig/blog-posts-grid`

| Attribute | Type | Default | Editor control |
|---|---|---|---|
| `sectionHeading` | string | "Latest from the Eternal" | Rich text |
| `postsPerPage` | number | 12 | Number input (sidebar panel) |

Categories, cards, and pagination are all runtime-computed in `render.php` — not attributes.

### `wp-rig/ingredient-spotlight`

| Attribute | Type | Default | Editor control |
|---|---|---|---|
| `sectionHeading` | string | "Ingredient Spotlight" | Plain text |
| `image` | object `{id, url, alt}` | `{}` | MediaUpload |
| `articleTitle` | string | "Niacinamide: The Multitasking Skin Vitamin" | Rich text (italic) |
| `bodyText` | string | "A closer look at how niacinamide…" | Plain text area |

---

## User Stories

1. **As an editor**, I open the `/blog` page in Gutenberg and add the Blog Hero block. I upload a background image, type the heading, subtitle, and CTA text/URL in the sidebar, and publish — the hero appears exactly as designed, no code changes needed.
2. **As an editor**, I add the Blog Posts Grid block. It auto-populates from live WordPress posts and category terms. I can change the section heading and posts-per-page from the sidebar.
3. **As an editor**, I add the Ingredient Spotlight block, upload an editorial image, set the heading, italic article title, and body copy. This same spotlight appears unchanged on all category archive pages.
4. **As a visitor on `/blog`**, all posts appear in a 3-column grid under the "All" tab. I click "Skincare Science" — a skeleton card grid appears immediately, then resolves to category posts. The URL updates to `?tab=skincare-science` without a page reload.
5. **As a visitor on `/blog`**, I click page 2 — skeleton appears, then page 2 posts load via AJAX.
6. **As a visitor on `/blog`**, I use the browser back button — the previous tab and page are restored from history state.
7. **As a visitor on `/blog/skincare-science`** (category archive), I see the Skincare Science tab pre-highlighted and only those posts shown. If I click another tab, the page navigates (standard routing). Pagination is still AJAX.
8. **As a visitor on `/blog/skincare-science`**, the Ingredient Spotlight at the bottom shows the same content configured on the `/blog` page.
9. **As a visitor on a small mobile device**, I see 1 card per row; on medium mobile 2; on tablet and desktop 3.

---

## Technical Plan (The Contract)

### Step 0: WordPress Setup (manual, one-time)

1. In **Settings → Permalinks**, verify a custom permalink structure is active (e.g. `/%postname%/`).
2. If category archives should live at `/blog/skincare-science` rather than `/category/skincare-science`, set **Category base** to `blog` in Settings → Permalinks. Confirm with user before doing this — it changes all existing category URLs.
3. Confirm the Posts Page is set to the `/blog` page in **Settings → Reading**.

### Step 1: PHP Components

Create `inc/Blog_Hero/Component.php`, `inc/Blog_Posts_Grid/Component.php`, `inc/Ingredient_Spotlight/Component.php` using the standard `Component_Interface` pattern.

`Blog_Posts_Grid/Component.php` implements:
- `add_image_size('blog-card-thumb', 200, 276, true)` on `init`
- `wp_enqueue_scripts` enqueue + `wp_localize_script` with `{ ajaxUrl, nonce }` on `is_home() || is_category()`
- `ajax_get_blog_posts()` AJAX handler: validates nonce, runs `WP_Query`, renders card HTML via a template partial, returns `wp_send_json_success({ html, maxPages })`

Register all three in `inc/Theme.php → get_default_components()`.

### Step 2: Scaffold Block Assets

For each of the three blocks, create the directory structure under `assets/blocks/`.

**`blog-hero/block.json`** — attributes: heading, subtitle, ctaText, ctaUrl, backgroundImage.
**`blog-posts-grid/block.json`** — attributes: sectionHeading, postsPerPage.
**`ingredient-spotlight/block.json`** — attributes: sectionHeading, image, articleTitle, bodyText.

`src/index.js` for each block registers it in the editor with controls matching the attribute contract above. Use `@wordpress/block-editor` `MediaUpload`, `RichText`, `TextControl`, `InspectorControls`.

### Step 3: `render.php` for Each Block

**`blog-hero/render.php`:**
```
<section class="blog-hero" style="--hero-bg-image: url('{$bg_url}')">
  <div class="blog-hero__content">
    <h1 class="blog-hero__heading">{heading}</h1>
    <p class="blog-hero__subtitle">{subtitle}</p>
    <a class="blog-hero__cta" href="{ctaUrl}">{ctaText}<span aria-hidden="true"></span></a>
  </div>
</section>
```

**`blog-posts-grid/render.php`:**
- Get all categories: `get_categories(['hide_empty' => false])`
- Build tabs markup: All tab first, then each category
- Run WP_Query for posts (respects `$paged` from query vars)
- Output cards via `template-parts/content/blog-card.php`
- Output pagination (AJAX-aware: `data-max-pages` attribute)
- Output `data-ajax-nonce` on the grid wrapper

**`ingredient-spotlight/render.php`:**
```
<section class="ingredient-spotlight">
  <div class="ingredient-spotlight__divider" aria-hidden="true"></div>
  <h2 class="ingredient-spotlight__label">{sectionHeading}</h2>
  <div class="ingredient-spotlight__image-wrap">
    <img src="{imageUrl}" alt="{imageAlt}" />
  </div>
  <div class="ingredient-spotlight__text">
    <p class="ingredient-spotlight__title">{articleTitle}</p>
    <p class="ingredient-spotlight__body">{bodyText}</p>
  </div>
</section>
```

### Step 4: New Template Partial

Create `template-parts/content/blog-card.php` — renders a single card (used by both `render.php` and the AJAX handler):
```
<article class="blog-card">
  <a class="blog-card__thumb-link" href="{permalink}">
    {get_the_post_thumbnail(post, 'blog-card-thumb')}
  </a>
  <div class="blog-card__body">
    <span class="blog-card__eyebrow">{primary category name}</span>
    <h3 class="blog-card__title"><a href="{permalink}">{title}</a></h3>
    <time class="blog-card__date">{DD.MM.YYYY}</time>
  </div>
</article>
```

### Step 5: Root Templates

**`home.php`:**
```php
get_header();
$blog_page = get_post( get_option( 'page_for_posts' ) );
if ( $blog_page ) {
    echo do_blocks( $blog_page->post_content );
}
get_footer();
```

**`category.php`:**
```php
get_header();
$blog_page   = get_post( get_option( 'page_for_posts' ) );
$all_blocks  = $blog_page ? parse_blocks( $blog_page->post_content ) : [];

// 1. Render Blog Hero block from blog page
foreach ( $all_blocks as $block ) {
    if ( 'wp-rig/blog-hero' === $block['blockName'] ) {
        echo render_block( $block );
        break;
    }
}

// 2. Render posts grid (category-aware, current $wp_query already set by WP)
get_template_part( 'template-parts/content/blog-posts-section' );

// 3. Render Ingredient Spotlight from blog page
foreach ( $all_blocks as $block ) {
    if ( 'wp-rig/ingredient-spotlight' === $block['blockName'] ) {
        echo render_block( $block );
        break;
    }
}
get_footer();
```

Create `template-parts/content/blog-posts-section.php` — shared partial for the tabs + grid + pagination, used by both `blog-posts-grid/render.php` (on `/blog`) and `category.php` (on archives). Receives context via a `$context` variable passed by `get_template_part()` (WP 5.5+ argument).

### Step 6: JavaScript (`blog-posts-grid.ts`)

```
On DOMContentLoaded:
  - Identify context: is_blog_home (body has class `blog`) or is_category (body has class `category-*`)
  - Parse initial tab from URL query param ?tab= or from the active tab DOM element
  - Bind tab clicks:
      if is_blog_home → AJAX fetch → skeleton → replace grid → pushState URL
      if is_category → allow default link navigation
  - Bind pagination clicks (both contexts): AJAX fetch → skeleton → replace grid → pushState page param
  - Bind popstate: re-fetch based on history.state { tab, paged }
  
AJAX fetch:
  POST /wp-admin/admin-ajax.php
  action=wp_rig_blog_posts
  nonce={nonce from data attribute}
  category={slug or empty}
  paged={number}

  On pending: inject skeleton cards HTML (n=postsPerPage empty cards with CSS animation)
  On success: replace grid + pagination HTML, remove skeleton
  On error: remove skeleton, show no-results message
```

### Step 7: CSS

Three CSS files implementing the Figma designs:

**`_blog-hero.css`:** Full-viewport-height section, `background-image` via CSS custom property `--hero-bg-image`, dark overlay (`rgba(0,0,0,0.3)`), bottom-left content positioning, white typography.

**`_blog-posts-grid.css`:**
- Section heading styles (H2 token)
- Tab row: flex, no-wrap, overflow-x auto on mobile
- Active tab: full opacity + border; inactive: 50% opacity
- Card grid: CSS Grid, `grid-template-columns: repeat(3, 1fr)` → responsive via media queries
- Card: image clip + text column with space-between
- Skeleton card: `background: linear-gradient(90deg, #e8e8e8, #f4f4f4, #e8e8e8)` animated shimmer
- Pagination: flex row, active page in black circle

**`_ingredient-spotlight.css`:** Black background, white type, full-width editorial image (overflow hidden), H3 italic title, body copy constrained to 440px.

### Verification Checklist

- [ ] `npm run build` — zero errors/warnings
- [ ] `/blog` renders hero → grid → spotlight with correct Figma design
- [ ] All tab: 12 posts shown; click "Skincare Science" → skeleton → filtered posts
- [ ] URL updates to `?tab=skincare-science` on tab click (no reload)
- [ ] Browser back restores previous tab/page
- [ ] Pagination page 2 loads via AJAX with skeleton
- [ ] `/blog/skincare-science` — Skincare Science tab active, correct posts, spotlight matches `/blog`
- [ ] Mobile small (<480px): 1 column
- [ ] Mobile medium (480–767px): 2 columns
- [ ] Tablet (768–1023px): 3 columns
- [ ] `npm run ai:check` — passes

---

## Open Questions / Risks

1. **Category base URL**: ✓ Resolved — using WordPress default `/category/skincare-science`. No permalink changes needed.
2. **"SHOP NOW" CTA**: The Figma hero has "SHOP NOW" as the CTA. The block attribute defaults to this but the editor can change it freely.
3. **Category population**: The 6 tab categories (Skincare Science, Ingredients Guide, Skin Concerns, Rituals & Routines, Dermatology Insights, Product Education) must be created in WordPress → Posts → Categories before they appear as tabs. The grid auto-populates them at runtime.
