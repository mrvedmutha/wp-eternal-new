# SPEC: Philosophy Tabs Block

**Date:** 2026-04-03
**Block slug:** `wp-rig/philosophy-tabs`
**Block directory:** `assets/blocks/philosophy-tabs/`

---

## 1. Purpose

A tabbed content section with a full-width image that swaps per tab, a row of tab buttons, a section heading, and body copy. Used across multiple pages (not standalone). Supports 1–5 tabs.

---

## 2. Visual Design (from Figma node 694:1539)

```
┌─────────────────────────────────────────────────┐
│              Full-width image (16:9)             │  ← changes per tab
└─────────────────────────────────────────────────┘
[ TAB 1 ] [ TAB 2 ] [ TAB 3 ] [ TAB 4 ] [ TAB 5 ]
──────────────────────────────────────────────────
Heading (H3 italic)          Body copy paragraph
```

- Background: `#f5f5f5`
- Primary colour: `#021f1d`
- Tab labels: uppercase, 0.5px border, inactive = 50% opacity
- Divider: 1px rule between tabs and content
- Heading font: Cormorant Garamond Light Italic, 32px/42px
- Tab label font: Maison Neue Medium, 9px, tracking 1.26px
- Body font: Maison Neue Book, 15px/23px, tracking 0.15px

---

## 3. Responsive Breakpoints

| Range       | Image ratio | Layout                                        |
|-------------|-------------|-----------------------------------------------|
| ≥ 1024px    | 16:9        | Landscape image → tab row → 2-col (head/body) |
| 700–1023px  | 16:9        | Same as above; tabs wrap if needed            |
| < 700px     | 5:4         | Image → tabs (wrap) → heading → body (stacked)|

CSS custom property set on `:root` or `<html>`:
```css
--pt-breakpoint-mobile: 700px;
```

---

## 4. Block Architecture

### Block type
Single server-side-rendered block (`render.php`). No inner blocks.

### Attributes (stored in `block.json`)

```json
{
  "tabs": {
    "type": "array",
    "default": [],
    "items": {
      "type": "object",
      "properties": {
        "label":     { "type": "string" },
        "imageId":   { "type": "integer" },
        "imageUrl":  { "type": "string" },
        "imageAlt":  { "type": "string" },
        "heading":   { "type": "string" },
        "body":      { "type": "string" }
      }
    }
  },
  "activeTab": {
    "type": "integer",
    "default": 0
  }
}
```

Max 5 tabs enforced in the editor (Add Tab button disabled at 5).

### Editor UI (`src/edit.js`)
- `InspectorControls` panel: list of tabs with "Add Tab" / "Remove Tab" buttons (max 5)
- Canvas shows the currently selected tab's image (via `<img>` with the stored URL), tab buttons (read-only row), heading, and body — all editable inline via `RichText`
- Switching active tab in the editor is done via tab button click (updates `activeTab` attribute — editor-only, not serialised to the DB, just local state via `useState`)
- `MediaUpload` for each tab's image

### Frontend render (`render.php`)
- Outputs semantic HTML with `data-*` attributes needed by JS
- All tab panels rendered in DOM (not just active) — JS controls visibility

---

## 5. File Structure

```
assets/blocks/philosophy-tabs/
├── block.json
├── editor.css
├── style.css
├── render.php
└── src/
    ├── index.js      ← registerBlockType + Edit import
    ├── edit.js       ← Editor component
    └── view.js       ← GSAP tab switching (frontend only)
```

Build output goes to `assets/blocks/philosophy-tabs/build/`.

---

## 6. Animation Spec (GSAP — `view.js`)

### Image wipe

Each tab image is absolutely positioned and stacked. Only the active image is visible.

On tab change from index `prev` → `next`:
- **Forward** (`next > prev`): new image enters from **bottom**, clips upward (bottom-to-top reveal)
- **Backward** (`next < prev`): new image enters from **top**, clips downward (top-to-bottom reveal)

Implementation: `clip-path` on the incoming image:
- Forward: `inset(100% 0 0 0)` → `inset(0% 0 0 0)`
- Backward: `inset(0 0 100% 0)` → `inset(0 0 0% 0)`

Duration: ~0.7s, ease: `power2.inOut`

Old image: no animation, simply hidden after new image fully covers it.

### Text transition

- Outgoing text panel: `opacity: 1` → `opacity: 0`, duration 0.4s, ease `power1.out` (starts immediately)
- Incoming text panel: `opacity: 0` → `opacity: 1`, duration 0.15s (near-instant), starts after a 0.05s delay
- No direction reversal for text — always the same fade sequence regardless of tab direction

### State management

`data-pt-active="true"` attribute on the active `.pt-tab-btn` and active `.pt-panel`.
JS attaches `click` listeners on `.pt-tab-btn` elements.

---

## 7. HTML Structure (render.php output)

```html
<section class="philosophy-tabs" data-pt-block>
  <div class="philosophy-tabs__images">
    <div class="pt-image pt-image--0 is-active" data-pt-image="0">
      <img src="…" alt="…" />
    </div>
    <div class="pt-image pt-image--1" data-pt-image="1">
      <img src="…" alt="…" />
    </div>
    <!-- … up to 5 -->
  </div>

  <div class="philosophy-tabs__controls">
    <div class="pt-tab-nav">
      <button class="pt-tab-btn is-active" data-pt-tab="0">ANTI-INFLAMMATORY BALANCE</button>
      <button class="pt-tab-btn" data-pt-tab="1">CELLULAR VITALITY</button>
      <!-- … -->
    </div>
    <hr class="pt-divider" />
  </div>

  <div class="philosophy-tabs__content">
    <div class="pt-panel is-active" data-pt-panel="0">
      <h3 class="pt-panel__heading">Anti-Inflammatory Balance</h3>
      <div class="pt-panel__body"><p>…</p></div>
    </div>
    <div class="pt-panel" data-pt-panel="1">
      <h3 class="pt-panel__heading">Cellular Vitality</h3>
      <div class="pt-panel__body"><p>…</p></div>
    </div>
    <!-- … -->
  </div>
</section>
```

---

## 8. CSS Notes (`style.css`)

- `.philosophy-tabs__images` is `position: relative`, each `.pt-image` is `position: absolute; inset: 0`
- Active image has `z-index: 1`, inactive `z-index: 0`
- `.pt-panel` defaults to `opacity: 0; pointer-events: none` and `.pt-panel.is-active` to `opacity: 1; pointer-events: auto` (JS overrides via GSAP)
- All inactive `.pt-tab-btn` have `opacity: 0.5`

---

## 9. Scaffold Command

```bash
npm run block:new -- --name=philosophy-tabs
```

Then manually add the `tabs` repeater attribute and editor UI (scaffold gives the skeleton only).

---

## 10. Pre-flight

After implementation: `npm run ai:check`

---

## Approval Checklist

- [ ] Block attribute schema approved
- [ ] Animation spec (wipe direction + text fade) approved
- [ ] Responsive breakpoints approved
- [ ] HTML structure approved
