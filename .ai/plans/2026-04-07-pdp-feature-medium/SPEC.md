# SPEC: pdp-feature-medium

**Plan directory:** `.ai/plans/2026-04-07-pdp-feature-medium/`
**Date:** 2026-04-07
**Status:** DRAFT — awaiting user approval

---

## 1. Mission Statement

Scaffold and implement a new dynamic Gutenberg block `wp-rig/pdp-feature-medium` that renders a two-column editorial section: a sticky left text column with a repeating eyebrow + N heading/body items, and a right media panel (autoplay video or image) fixed at 720×880px within a 1440px max-width container — matching the Figma design node `694:4394`.

---

## 2. Design Compliance

**Figma source:** `aJ4VjKdFNahXA6Ly4jkRtJ` node `694:4394`

| Element | Spec |
|---|---|
| Max-width | 1440px, centered |
| Left column | 440px wide, `position: sticky; top: 0`, 40px top padding |
| Right panel | 720×880px, `overflow: hidden` |
| Eyebrow | Maison Neue Medium 11px, 2px letter-spacing, `var(--primary, #021f1d)` |
| Item heading | Cormorant Garamond Medium 24px / 31px line-height, `var(--primary, #021f1d)` |
| Item body | Maison Neue Book 15px / 23px, `#767676` |
| Item gap | 32px between items, 8px between heading and body |
| Left padding | 40px on the outer container |

---

## 3. Architectural Fit

- **Block type:** Dynamic (server-side rendered via `render.php`)
- **Scaffolded via:** `npm run block:new -- pdp-feature-medium --title="PDP Feature Medium" --dynamic`
- **Registration:** Auto-discovered by `inc/Blocks/Component.php` — no manual PHP changes needed
- **CSS partial:** `assets/css/src/_pdp-feature-medium.css` registered via the theme build
- **Namespace:** `wp-rig/pdp-feature-medium`
- **Follows patterns from:** `assets/blocks/pdp-feature-advance/`

---

## 4. Block Attributes

```json
{
  "eyebrow":   { "type": "string",  "default": "The 5 Essential Pillars" },
  "mediaType": { "type": "string",  "default": "video" },
  "mediaId":   { "type": "integer", "default": 0 },
  "mediaUrl":  { "type": "string",  "default": "" },
  "mediaAlt":  { "type": "string",  "default": "" },
  "items": {
    "type": "array",
    "default": [{ "heading": "", "body": "" }],
    "items": {
      "type": "object",
      "properties": {
        "heading": { "type": "string" },
        "body":    { "type": "string" }
      }
    }
  }
}
```

---

## 5. User Stories

- As an editor, I can upload a video that autoplays silently on loop in the right panel.
- As an editor, I can upload an image instead and it displays statically in the right panel.
- As an editor, I can set a global eyebrow label for the section.
- As an editor, I can add, edit, and remove N heading/body items in the left column (max 10).
- As a visitor, the left column stays sticky while I scroll past the right media panel.
- As a visitor, the layout is constrained to 1440px and the right panel is exactly 720×880px.

---

## 6. Frontend Behavior

| Concern | Implementation |
|---|---|
| Video | `<video autoplay muted loop playsinline>` — no controls |
| Image fallback | `wp_get_attachment_image()` if `mediaType === 'image'` |
| Sticky left | CSS `position: sticky; top: 0` on `.pfm-block__left` |
| Max-width | `.pfm-block__inner { max-width: 1440px; margin-inline: auto; }` |
| Right panel size | Fixed `width: 720px; height: 880px; overflow: hidden` |
| Media fills panel | `object-fit: cover; width: 100%; height: 100%` on `<video>` / `<img>` |

---

## 7. File Plan

```
assets/blocks/pdp-feature-medium/
  block.json          ← metadata + attributes
  src/
    index.js          ← block registration
    edit.js           ← Gutenberg editor UI
  render.php          ← server-side frontend output
  style.css           ← frontend styles (imports CSS partial)
  editor.css          ← editor-only styles
  build/              ← compiled (generated)

assets/css/src/
  _pdp-feature-medium.css   ← CSS partial (sticky layout, typography)
```

---

## 8. Implementation Steps

1. `npm run block:new -- pdp-feature-medium --title="PDP Feature Medium" --dynamic`
2. Overwrite `block.json` with attributes schema above
3. Implement `src/edit.js` — sidebar controls for media upload (video/image) + eyebrow + N items (heading/body), canvas preview
4. Implement `render.php` — sticky left column + media right panel
5. Write `assets/css/src/_pdp-feature-medium.css` — layout, typography, sticky, video fill
6. Import CSS partial into theme stylesheet
7. Run `npm run build` and verify

---

## 9. Success Metrics

- Left column is sticky, right panel is exactly 720×880px at desktop
- Video autoplays muted on loop; image displays correctly as fallback
- N items (1–10) can be added/removed in the editor
- Max-width 1440px is respected
- Passes `npm run ai:check`
- No visual regressions vs Figma node `694:4394`
