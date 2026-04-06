# SPEC: `wellness-cta` Block

**Date:** 2026-04-03  
**Status:** AWAITING APPROVAL

---

## Overview

A centered, editorial-style block with a heading, body copy, portrait image, and a mutually exclusive bottom section that is either a **CTA** (text + labeled link with underline) or a **tagline** (text only). Reusable across the site.

---

## Visual Reference

| Variant | Figma Node |
|---|---|
| CTA | `694:1603` — "Virtual Wellness Appointment" |
| Tagline | `694:4103` — "Internal & External Synergy" |

---

## Block Identity

| Field | Value |
|---|---|
| Slug | `wellness-cta` |
| Handle | `wp-rig/wellness-cta` |
| Title | `Wellness CTA` |
| Category | `widgets` |
| Type | Dynamic (server-side rendered via `render.php`) |

---

## Layout

Single centered column, max-width `558px`, centered horizontally within the section. Vertical stack with `40px` gap between:

1. **Text group** — heading + body, `24px` gap, centered
2. **Image** — portrait crop, `456px × 572px`, `#f5f5f5` background
3. **Bottom section** — CTA variant OR tagline variant (never both)

---

## Attributes

| Attribute | Type | Default | Notes |
|---|---|---|---|
| `heading` | `string` | `""` | H2 display text |
| `body` | `string` | `""` | Body copy — double newline = new paragraph |
| `mediaId` | `integer` | `0` | WP attachment ID |
| `mediaUrl` | `string` | `""` | Image URL |
| `bottomText` | `string` | `""` | Tagline text OR text above CTA label |
| `ctaLabel` | `string` | `""` | CTA label text — if non-empty, CTA variant is active |
| `ctaUrl` | `string` | `""` | CTA link URL (internal or external) |

---

## Variant Logic

```
if ctaLabel is non-empty → CTA variant
  - render bottomText (if present) above the CTA
  - render ctaLabel + underline as an <a> linking to ctaUrl

else → Tagline variant
  - render bottomText only (no link)
```

---

## Typography (from design tokens)

| Element | Font | Size | Weight | LH | LS |
|---|---|---|---|---|---|
| Heading | `var(--font-display)` | `40px` | 400 | `48px` | `-2px` |
| Body | `var(--font-body)` | `15px` | 400 | `23px` | `0.15px` |
| Bottom text | `var(--font-body)` | `17px` | 400 | `30px` | `0` |
| CTA label | `var(--font-body)` | `11px` | 500 | `14px` | `2px` |

All text uses `var(--color-primary)` (`#021f1d`).

---

## Files to Create / Modify

### Scaffold (via `npm run block:new`)
```
assets/blocks/wellness-cta/
  block.json
  src/index.js
  src/edit.js
  style.css
  editor.css
  render.php
```

### After scaffold — modify:
1. **`block.json`** — add all 7 attributes above
2. **`src/edit.js`** — InspectorControls with:
   - `PanelBody` "Image" — MediaUpload
   - `PanelBody` "Content" — TextControl (heading), TextareaControl (body)
   - `PanelBody` "Bottom Section" — TextareaControl (bottomText), TextControl (ctaLabel), TextControl (ctaUrl)
   - `ServerSideRender` preview in canvas
3. **`render.php`** — outputs semantic HTML matching the Figma layout
4. **`style.css`** — block-scoped CSS using theme CSS variables

---

## HTML Output (render.php sketch)

```html
<section class="wp-block-wp-rig-wellness-cta wellness-cta">
  <div class="wellness-cta__inner">

    <!-- Text group -->
    <div class="wellness-cta__text">
      <h2 class="wellness-cta__heading"><!-- heading --></h2>
      <div class="wellness-cta__body"><!-- paragraphs --></div>
    </div>

    <!-- Image -->
    <div class="wellness-cta__image-wrap">
      <div class="wellness-cta__image-bg">
        <img src="..." alt="" class="wellness-cta__img" />
      </div>
    </div>

    <!-- Bottom: CTA variant -->
    <div class="wellness-cta__bottom wellness-cta__bottom--cta">
      <p class="wellness-cta__bottom-text"><!-- bottomText --></p>
      <a href="..." class="wellness-cta__cta">
        <span class="wellness-cta__cta-label"><!-- ctaLabel --></span>
        <span class="wellness-cta__cta-rule"></span>
      </a>
    </div>

    <!-- Bottom: Tagline variant -->
    <div class="wellness-cta__bottom wellness-cta__bottom--tagline">
      <p class="wellness-cta__bottom-text"><!-- bottomText --></p>
    </div>

  </div>
</section>
```

---

## CSS Notes

- Block wrapper: centered section, white bg, `80px` vertical padding (`var(--space-20)`)
- Inner column: `max-width: 558px`, `margin: 0 auto`
- Image bg: `background: var(--color-bg-subtle)` (`#f5f5f5`), `overflow: hidden`
- Image: `width: 100%`, `aspect-ratio: 456 / 572` (portrait)
- CTA rule: `display: block; height: 1px; background: var(--color-primary); width: 100%`
- CTA label: `text-transform: uppercase; letter-spacing: 2px; font-size: 11px; font-weight: 500`

---

## Out of Scope

- No animation or scroll effects
- No form embed — CTA is a plain link only
- No mobile breakpoint changes to layout (column stays centered)
