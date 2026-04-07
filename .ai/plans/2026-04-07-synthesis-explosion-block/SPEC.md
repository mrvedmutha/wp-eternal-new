# SPEC: Synthesis Explosion Block

**Date:** 2026-04-07
**Feature Branch:** `feature/synthesis-explosion-block`
**Block Name:** `wp-rig/synthesis-explosion`
**Scaffold Command:** `npm run block:new`

---

## 1. Visual Reference

Figma node `694:4430` — file `aJ4VjKdFNahXA6Ly4jkRtJ`

---

## 2. Layout

### Desktop (> 700px)

```
┌────────────────────────────────────────────────┐
│  [bg: #f5f5f5]  pt-80px                        │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  px-40px pt-40px                         │  │
│  │  Synthesis Explosion        ← H3 Italic  │  │
│  │                                          │  │
│  │  Body paragraph (max 460px)              │  │
│  │                                          │  │
│  │  SMALL CAPS CAPTION (max 460px)          │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Full-bleed image (h: 549px)             │  │
│  │                                          │  │
│  │  [  MARQUEE TEXT SCROLLING LEFT  ——>   ] │  │
│  │  ← centered vertically over image       │  │
│  └──────────────────────────────────────────┘  │
└────────────────────────────────────────────────┘
```

### Mobile (≤ 700px)

```
┌──────────────────────────┐
│  Image — 5:4 aspect ratio │
│  [  MARQUEE centered     ] │
│   ← vertically centered  │
└──────────────────────────┘
┌──────────────────────────┐
│  Heading (H3 Italic)      │
│  Body paragraph           │
│  Small caps caption       │
└──────────────────────────┘
```

---

## 3. Block Attributes

| Attribute      | Type    | Description                                              |
|----------------|---------|----------------------------------------------------------|
| `heading`      | string  | Section heading ("Synthesis Explosion")                  |
| `body`         | string  | Main editorial paragraph                                 |
| `caption`      | string  | Small all-caps supporting text                           |
| `marqueeText`  | string  | Comma-separated labels e.g. `IMMUNITY, REGENERATION, DETOX` |
| `mediaId`      | integer | WordPress media library image ID                         |
| `mediaUrl`     | string  | Resolved image URL                                       |
| `mediaAlt`     | string  | Image alt text (from media library)                      |

---

## 4. Marquee Behaviour

- Items are split from `marqueeText` on `,` and trimmed.
- The item list is **duplicated twice** in the DOM (original + clone) so the CSS animation loops seamlessly with no gap.
- Animation: CSS `@keyframes marquee` translates `X` from `0` to `-50%` (since content is doubled), looping infinitely.
- Speed: ~`40s` linear infinite (adjustable via CSS custom property `--marquee-duration`).
- Items separated by a spacer (e.g. `·` or `/`) with padding.
- No JS required — pure CSS animation.

---

## 5. Typography (matching Figma tokens)

| Element       | Font                          | Size | Weight | Line-height | Tracking |
|---------------|-------------------------------|------|--------|-------------|----------|
| Heading       | Cormorant Garamond Light Italic | 32px | 300    | 42px        | 0        |
| Body          | Maison Neue Book              | 15px | 400    | 23px        | 0.15px   |
| Caption       | Maison Neue Book              | 13px | 400    | 20px        | 0.13px   |
| Marquee text  | Maison Neue Book              | 24px | 400    | normal      | 0        |

---

## 6. Colours

- Page background: `var(--wp--preset--color--background, #f5f5f5)`
- Text: `var(--wp--preset--color--primary, #021f1d)`
- Marquee text (over image): `#ffffff`

---

## 7. Files to Create

```
assets/blocks/synthesis-explosion/
  block.json
  src/
    index.js        ← block registration + Edit component
    edit.js         ← Gutenberg editor UI
    view.js         ← frontend (empty — no JS needed, pure CSS marquee)
  render.php        ← server-side rendered HTML
  style.css         ← frontend styles (marquee animation, layout, typography)
  editor.css        ← editor-only overrides
```

---

## 8. Scaffolding Steps

1. Run `npm run block:new` → name: `synthesis-explosion`
2. Replace generated `block.json` with attributes defined in §3.
3. Build `edit.js` with:
   - `InspectorControls` panel: MediaUpload for image, TextControl for marqueeText
   - Editable fields (RichText) for heading, body, caption in canvas
4. Build `render.php` matching the layout in §2.
5. Write `style.css` with marquee keyframes, responsive breakpoint at 700px.

---

## 9. Responsive Breakpoint

```css
/* Desktop default: text top, image bottom */
/* Mobile ≤ 700px: image (5:4) on top, text below */
@media (max-width: 700px) {
  .synthesis-explosion__image-wrap {
    aspect-ratio: 5 / 4;
    height: auto;
  }
  .synthesis-explosion {
    flex-direction: column-reverse; /* image first */
  }
}
```

---

## Status: AWAITING APPROVAL
