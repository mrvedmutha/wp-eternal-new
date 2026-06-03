# SPEC: Related Posts Block — viewScript Refactor

**Date:** 2026-06-03  
**Status:** PENDING APPROVAL

---

## Goal

Refactor the `wp-rig/related-posts` block so it:
1. Works on **any page** (not just single posts) via the Gutenberg `viewScript` mechanism
2. Shows **related content** (same category, with latest fallback) on single posts
3. Shows **latest posts** on homepage and all other non-single contexts
4. Turns "Discover More" into a **real link** pointing to an editable URL (default `/blogs`)

---

## Files Changed

| File | Change |
|------|--------|
| `assets/blocks/related-posts/block.json` | Add `viewScript`, add `discoverUrl` attribute |
| `assets/blocks/related-posts/src/view.js` | **New** — frontend AJAX logic (replaces `related-posts.min.js` for this block) |
| `assets/blocks/related-posts/src/edit.js` | Add `discoverUrl` TextControl in InspectorControls |
| `assets/blocks/related-posts/render.php` | Add `data-mode`, render Discover More as `<a>` |
| `inc/Related_Posts/Component.php` | Remove related-posts JS enqueue; update AJAX handler for mode + fallback |

---

## Detailed Changes

### 1. `block.json`

Add two fields:

```json
"viewScript": "file:./build/view.js",
"attributes": {
  "postsCount": { "type": "number", "default": 3 },
  "discoverUrl": { "type": "string", "default": "/blogs" }
}
```

### 2. `src/view.js` (new file)

Vanilla JS (no WP imports — runs as IIFE via esbuild). On `DOMContentLoaded`:

- Queries all `.related-posts[data-ajax-url]`
- Reads: `data-ajax-url`, `data-nonce`, `data-post-id`, `data-term-ids`, `data-count`, `data-mode`
- POSTs to AJAX with all values including `mode`
- On success: replaces each skeleton card with real post HTML:
  ```html
  <article class="related-posts__card">
    <div class="related-posts__thumb"><a href="{url}"><img src="{thumb}" alt="{title}" loading="lazy"></a></div>
    <div class="related-posts__body">
      <div class="related-posts__body-inner">
        <div class="related-posts__top">
          <span class="related-posts__eyebrow">{category}</span>
          <h3 class="related-posts__title"><a href="{url}">{title}</a></h3>
        </div>
        <time class="related-posts__date" datetime="{dateISO}">{date}</time>
      </div>
    </div>
  </article>
  ```
- Cards fade in via CSS `.related-posts__card--loading` → remove class after content set

### 3. `render.php`

- Detect context: `$mode = is_single() ? 'related' : 'latest';`
- Add `data-mode="<?= $mode ?>"` to the `<section>`
- Add `$discover_url = esc_url( $attributes['discoverUrl'] ?? '/blogs' );`
- Wrap Discover More in a link:
  ```php
  <a href="<?= $discover_url ?>" class="related-posts__discover">
    <span class="related-posts__discover-label">DISCOVER MORE</span>
    <span class="related-posts__discover-line" aria-hidden="true"></span>
  </a>
  ```

### 4. `src/edit.js`

Add `discoverUrl` control in InspectorControls (import `TextControl` from `@wordpress/components`):

```jsx
<TextControl
  label="Discover More URL"
  value={ discoverUrl }
  onChange={ ( val ) => setAttributes( { discoverUrl: val } ) }
  help="Link for the 'Discover More' button. Default: /blogs"
/>
```

### 5. `Component.php`

- **Remove** the `related-posts.min.js` enqueue block entirely (viewScript handles it)
- **Keep** `single-toc.js` enqueue gated to `is_single()`
- **Update** AJAX handler `ajax_get_related_posts()`:
  - Read `$mode = sanitize_text_field( $_POST['mode'] ?? 'latest' );`
  - **`related` mode**: query by `category__in` with `posts_per_page = $count`; if results < count, run a second query for latest posts (excluding current post + already fetched IDs) to fill remaining slots
  - **`latest` mode**: query latest posts by `post_date DESC`, exclude current post if `$current_id > 0`

---

## AJAX Handler Logic (mode=related fallback)

```
1. Query: category__in=$term_ids, post__not_in=[$current_id], posts_per_page=$count, orderby=rand
2. If count(results) >= $count → return results
3. Else: remaining = $count - count(results)
         fetched_ids = [$current_id, ...result IDs]
         Query: no category filter, post__not_in=$fetched_ids, posts_per_page=$remaining, orderby=date
         Return first_results + second_results
```

---

## What Does NOT Change

- CSS (`style.css`) — no changes
- Block registration, category, icon, supports
- Nonce / security flow — unchanged
- `single-toc.js` enqueue — unchanged (still `is_single()` only)
- `related-posts.min.js` in `assets/js/` — left in place (may be used elsewhere); just not enqueued by this component anymore

---

## Build Step Required

After editing `src/view.js` and `src/edit.js`:

```bash
npm run build:blocks
```

---

## Open Questions for Approval

1. Should the Discover More `<a>` tag get any additional CSS class for styling (e.g. hover state, underline)?
2. On `latest` mode, should posts be ordered by `date DESC` (newest first) or `rand`?
