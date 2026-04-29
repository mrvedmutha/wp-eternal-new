# SPEC: Blog Single Post Page

**Date:** 2026-04-29
**Feature slug:** blog-single-post
**Status:** Approved ✓

---

## Mission Statement

Build the branded single-post experience: image hero, sticky TOC + body content column, auto-queried related posts (skeleton-loaded), and the global ingredient spotlight — all assembled in `single.php` following WP Rig conventions. One new Gutenberg block (`wp-rig/related-posts`) is created so the section is portable and can be dropped into any page via the block editor.

---

## Figma Source Nodes (file: aJ4VjKdFNahXA6Ly4jkRtJ)

| Section | Node | Description |
|---|---|---|
| Image Hero | `694:5002` | Pink-tinted hero; featured image, category eyebrow, date, post title |
| Blog Content + TOC | `694:5007` | Left sticky TOC list + right post body; H2 section headings |
| Related Topics | `694:5040` | Grey bg; 3-card row auto-queried by category; skeleton on load |
| Ingredient Spotlight | `694:5078` | Existing `wp-rig/ingredient-spotlight` block; sourced from blog page |
| Whole Page | `694:4940` | Full reference |

---

## Design Compliance

### Colours used on single post

| Role | Token | Value |
|---|---|---|
| Primary text | `--color-primary` | `#021f1d` |
| Muted/inactive | `--color-muted` | `#868686` |
| Section bg | `--color-grey` | `#f5f5f5` |
| Black bg | `--color-black` | `#000` |
| White | `--color-white` | `#fff` |
| Hero bg fallback | — | `#fbc3b6` |

### Typography

| Role | Family | Style | Size | Line Height |
|---|---|---|---|---|
| Post title | Cormorant Garamond | Regular | 40px | 48px |
| Category eyebrow | Maison Neue | Medium | 9px | 12px |
| Section heading (H2) | Maison Neue | Book | 24px | normal |
| Body | Maison Neue | Book | 15px | 23px |
| TOC links | Maison Neue | Book | 15px | 23px + letter-spacing: 0.01em expanded |

### TOC states

| State | Color |
|---|---|
| Active | `--color-primary` (`#021f1d`) |
| Inactive | `--color-muted` (`#868686`) |

---

## Architectural Fit

### New files

| File | Purpose |
|---|---|
| `single.php` | Root template for all single posts |
| `template-parts/content/entry_hero.php` | Post hero (featured image + category + date + title) |
| `template-parts/content/entry_single_content.php` | Two-column layout: sticky TOC + `the_content()` |
| `assets/blocks/related-posts/` | New dynamic Gutenberg block |
| `assets/css/src/_single-post.css` | Hero, content layout, TOC CSS |
| `assets/js/src/single-toc.js` | JS TOC: heading detection, smooth scroll, IntersectionObserver active state |
| `inc/Related_Posts/Component.php` | AJAX handler + JS enqueue on single posts |

### Changes to existing files

| File | Change |
|---|---|
| `inc/Theme.php` | Add `use` + register `Related_Posts\Component` |

### Ingredient Spotlight

Sourced from the `/blog` page's block attributes (same pattern as `category.php`). No custom fields needed.

### Related Posts block

- `render.php` outputs 3 skeleton cards and stores `data-post-id` + `data-term-ids` attributes on the wrapper
- `src/view.js` (block view script) fetches from AJAX endpoint on load, replaces skeleton with real cards
- `inc/Related_Posts/Component.php` registers `wp_ajax_wp_rig_related_posts` handler; returns 3 random posts from the same categories, excluding current post

---

## Technical Plan (The Contract)

### Scaffolding

```bash
cd wp-content/themes/wprig
npm run block:new -- related-posts --title="Related Posts" --dynamic --view
```

### Implementation Order

1. Create `SPEC.md` (this file)
2. Scaffold `related-posts` block
3. Write `single.php`
4. Write `template-parts/content/entry_hero.php`
5. Write `template-parts/content/entry_single_content.php`
6. Write `assets/blocks/related-posts/block.json` (update scaffolded)
7. Write `assets/blocks/related-posts/render.php` (skeleton markup)
8. Write `assets/blocks/related-posts/src/edit.js`
9. Write `assets/blocks/related-posts/src/index.js`
10. Write `assets/blocks/related-posts/src/view.js` (AJAX + DOM replace)
11. Write `assets/blocks/related-posts/style.css`
12. Write `assets/css/src/_single-post.css`
13. Write `assets/js/src/single-toc.js`
14. Write `inc/Related_Posts/Component.php`
15. Update `inc/Theme.php`

### Verification

- `npm run dev` — build JS/CSS
- Navigate to any single post in browser; verify hero, TOC, content, skeletons → posts, spotlight
- Click TOC link: smooth scroll + active state update
- Scroll through headings: active TOC link updates automatically
