# SPEC: wp-rig/image-editorial

**Date:** 2026-04-06
**Figma Reference:** node 694:4246 — "Nature Provides. Science Empowers"
**Status:** AWAITING APPROVAL

---

## 1. Mission Statement

New Gutenberg block (`wp-rig/image-editorial`) — a full-width editorial section with a full-bleed landscape background image, a large display headline, and three body paragraphs overlaid top-left. All text and image are editable via the Gutenberg block sidebar.

---

## 2. Design Compliance

**From Figma node 694:4246:**

| Zone      | Family             | Weight | Size | Line Height | Tracking |
|-----------|--------------------|--------|------|-------------|----------|
| Headline  | Cormorant Garamond | 400    | 40px | 48px        | -2px     |
| Body      | Maison Neue        | Book (400) | 15px | 23px    | 0.15px   |

- Section background: `#92aba7` (sage teal — shows behind image if no image is set)
- Section height: `600px` desktop
- Text color: white
- Content padding: `48px` top, `40px` left
- Content max-width container: `1440px` centred
- Body text max-width: `472px` (from Figma: `471.707px`)
- Headline + body gap: `24px`
- No sticky, no parallax

---

## 3. Responsive Behaviour

| Breakpoint     | Layout                                                              |
|----------------|---------------------------------------------------------------------|
| Desktop        | Image absolute full-bleed, text overlaid top-left                  |
| Tablet ≤1024px | Same as desktop, content padding reduced                           |
| Mobile ≤768px  | Stacked — image on top (16/9 landscape), content below on sage bg |
| Mobile ≤450px  | Headline drops to 28px / 36px line-height                         |

Mobile stacking pattern matches `category-split` — image becomes static flow with `aspect-ratio: 16 / 9`, content sits below.

---

## 4. Block Attributes

```json
{
  "imageId":       { "type": "integer", "default": 0 },
  "imageUrl":      { "type": "string",  "default": "" },
  "imageAlt":      { "type": "string",  "default": "" },
  "headlineText":  { "type": "string",  "default": "Nature Provides. Science Empowers" },
  "bodyParagraph1":{ "type": "string",  "default": "Eternal sources ingredients from diverse ecosystems — including Amazonian botanicals, Kashmiri plant actives and marine-derived compounds." },
  "bodyParagraph2":{ "type": "string",  "default": "Many of these ingredients have long-standing historical associations with vitality and regenerative wellbeing." },
  "bodyParagraph3":{ "type": "string",  "default": "Modern formulation science allows these traditions to be structured with greater precision, stability and absorption efficiency." }
}
```

---

## 5. HTML Structure (render.php)

```html
<section class="image-editorial">
  <figure class="image-editorial__image-wrap" aria-hidden="true">
    <img class="image-editorial__image" src="..." alt="" decoding="async" loading="lazy">
  </figure>
  <div class="image-editorial__content">
    <div class="image-editorial__inner">
      <h2 class="image-editorial__headline">...</h2>
      <div class="image-editorial__body">
        <p class="image-editorial__body-p">...</p>
        <p class="image-editorial__body-p">...</p>
        <p class="image-editorial__body-p">...</p>
      </div>
    </div>
  </div>
</section>
```

---

## 6. Animation (view.js)

Word-by-word opacity reveal on scroll entry — matches Homepage Hero pattern.

- Words start: `opacity: 0`, `y: 8px`
- Words end: `opacity: 1`, `y: 0`
- Trigger: section enters viewport bottom (`top bottom`)
- Zones animate sequentially: headline words → body paragraph words
- One-shot (plays once, no reverse)
- GSAP + ScrollTrigger (bundled via esbuild, same as other blocks)
- Reduced-motion: animation skipped entirely

---

## 7. Editor UI (edit.js)

InspectorControls sidebar with:
- `MediaUpload` for background image (with replace/remove)
- `TextareaControl` — Headline
- `TextareaControl` — Body paragraph 1
- `TextareaControl` — Body paragraph 2
- `TextareaControl` — Body paragraph 3

Canvas uses `ServerSideRender` (same pattern as `category-split`).

---

## 8. New Files

```
assets/blocks/image-editorial/         ← scaffolded via npm run block:new
  block.json
  render.php
  editor.css
  style.css
  src/
    index.js
    edit.js
    view.js
  build/                               ← generated

inc/Image_Editorial/
  Component.php                        ← placeholder, JS auto-loaded via viewScript

assets/css/src/
  _image-editorial.css                 ← all frontend styles
```

## 9. Modified Files

| File                            | Change                                          |
|---------------------------------|-------------------------------------------------|
| `inc/Theme.php`                 | Add `new Image_Editorial\Component()`           |
| `assets/css/src/global.css`     | Add `@import '_image-editorial.css'`            |

---

## 10. Implementation Order

1. `npm run block:new -- wp-rig/image-editorial --title "Image Editorial" --dynamic --view`
2. Update `block.json` attributes
3. Write `render.php`
4. Write `src/edit.js` (MediaUpload + ServerSideRender)
5. Write `src/view.js` (GSAP word reveal)
6. Write `assets/css/src/_image-editorial.css`
7. Write `editor.css`
8. Write `inc/Image_Editorial/Component.php`
9. Register in `inc/Theme.php`
10. Import in `assets/css/src/global.css`
11. `npm run build:blocks`
12. `npm run ai:check`
