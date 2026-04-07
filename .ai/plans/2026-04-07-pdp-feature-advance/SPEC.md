# SPEC: `pdp-feature-advance` Block

**Date:** 2026-04-07
**Author:** AI Agent
**Status:** AWAITING APPROVAL

---

## 1. Overview

A new Gutenberg block (`eternal/pdp-feature-advance`) that renders a full-width split-screen section with a **sticky left panel** and a **right image column**. The left panel contains an eyebrow, and a list of up to 10 value items. Each item has a title and body. As the user scrolls, a GSAP ScrollTrigger drives a progress-bar divider beneath the active item; once the bar fills to 100%, the item collapses and the next opens. After all items complete, the sticky is released.

Visually and architecturally inspired by `template-parts/product/part-pdp-feature.php` but implemented as a standalone block with scroll-driven interactivity.

---

## 2. Block Identity

| Field        | Value                          |
|-------------|-------------------------------|
| Block name   | `eternal/pdp-feature-advance` |
| Directory    | `blocks/pdp-feature-advance/` |
| Scaffold cmd | `npm run block:new`           |
| Category     | `eternal`                     |
| Keywords     | values, accordion, sticky     |

---

## 3. Block Attributes

```json
{
  "eyebrow":  { "type": "string",  "default": "Our Values" },
  "imageId":  { "type": "integer", "default": 0 },
  "imageUrl": { "type": "string",  "default": "" },
  "imageAlt": { "type": "string",  "default": "" },
  "items": {
    "type": "array",
    "default": [],
    "items": {
      "type": "object",
      "properties": {
        "title": { "type": "string" },
        "body":  { "type": "string" }
      }
    }
  }
}
```

**Constraints:** `items` array capped at **10 entries** in the editor UI.

---

## 4. Editor UI (block.json + edit.js)

- **Inspector Panel** (right sidebar):
  - `MediaUpload` control → sets `imageId`, `imageUrl`, `imageAlt`
- **Canvas** (edit area):
  - `RichText` for `eyebrow`
  - Repeater of items (add/remove buttons, max 10):
    - `RichText` → `title`
    - `RichText` → `body`
  - Live preview of the right image thumbnail

---

## 5. PHP Render Template

File: `blocks/pdp-feature-advance/template.php`

```
.pdp-feature-adv                         ← root wrapper, data-block attr
  .pdp-feature-adv__inner                ← flex row, full-width
    .pdp-feature-adv__left               ← sticky left panel
      .pdp-feature-adv__eyebrow          ← "OUR VALUES"
      .pdp-feature-adv__items            ← list
        .pdp-feature-adv__item           ← one per item, [data-index="0"]
          .pdp-feature-adv__item-title   ← h3
          .pdp-feature-adv__item-divider ← progress bar wrapper
            .pdp-feature-adv__item-progress  ← the filling bar (width driven by GSAP)
          .pdp-feature-adv__item-body    ← body text, hidden when collapsed
    .pdp-feature-adv__right              ← image column
      img.pdp-feature-adv__img
```

PHP resolves `imageId` → `wp_get_attachment_image()`, falls back to raw `imageUrl`.
Body text passed through `wp_rig()->parse_markdown_light()` + `wp_kses_post()`.

---

## 6. CSS (`blocks/pdp-feature-advance/style.css`)

- Two-column flex layout, left ~440px, right fills remaining width
- Left panel: `position: sticky; top: 0`
- Eyebrow: `Maison Neue Medium`, 11px, 2px letter-spacing
- Title: `Cormorant Garamond Regular`, 40px/48px, -2px tracking
- Body: `Maison Neue Book`, 15px/23px, +0.15px tracking
- Divider: grey baseline (`var(--color-border)`) with an inner `::before` or child `<span>` that is the black progress fill; width driven by a CSS custom property `--progress` (0–100%)
- Item body: `max-height` transition for collapse/expand (CSS handles the animation, GSAP sets the trigger timing)
- Collapsed state class: `.is-collapsed` on `.pdp-feature-adv__item`
- Active state class: `.is-active`

---

## 7. JavaScript (`blocks/pdp-feature-advance/view.js`)

Uses **GSAP + ScrollTrigger** (already available in the theme, imported directly).

### Strategy

1. **Pin** the `.pdp-feature-adv__left` for the full scroll distance required by all items combined.
2. For **each item** create a ScrollTrigger scrub that:
   - Drives `--progress` CSS custom property on the item's divider from `0` to `100`
   - On `onLeave` (progress = 100%):
     - Adds `.is-collapsed` to the current item (collapses body)
     - Adds `.is-active` to the next item (expands body)
3. After the **last item** completes, unpin the left panel and let the section scroll away normally.

### Scroll distance

Each item occupies `1 × viewport height` of scroll distance (configurable via a data attribute `data-scroll-height` on the root, default `100vh` per item).

### Import

```js
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);
```

---

## 8. Files to Create

| Path | Purpose |
|------|---------|
| `blocks/pdp-feature-advance/block.json` | Block registration |
| `blocks/pdp-feature-advance/edit.js` | Editor component |
| `blocks/pdp-feature-advance/index.js` | Block entry point |
| `blocks/pdp-feature-advance/template.php` | PHP render |
| `blocks/pdp-feature-advance/style.css` | Front-end + editor styles |
| `blocks/pdp-feature-advance/view.js` | GSAP scroll logic |

No changes to existing files expected (block auto-registered via theme's block loader).

---

## 9. Pre-flight

- [ ] `npm run ai:check` passes
- [ ] Block appears in inserter under `eternal` category
- [ ] Up to 10 items addable, 11th "Add Item" button disabled
- [ ] Progress bar animates on scroll
- [ ] Graceful no-JS fallback: first item expanded, rest collapsed statically

---

## 10. Out of Scope

- Per-item images (single shared image only)
- CTA links per item
- Mobile-specific layout (can be addressed in a follow-up)

---

**APPROVAL REQUIRED** — Reply "approved" to proceed to implementation.
