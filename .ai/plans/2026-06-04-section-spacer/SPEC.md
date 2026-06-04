# SPEC: Section Spacer Block

**Date:** 2026-06-04  
**Feature Slug:** `section-spacer`  
**Status:** AWAITING APPROVAL

---

## 1. Mission Statement

Create a `wp-rig/section-spacer` Gutenberg block that inserts a full-width, configurable vertical gap between page sections. Height is specified in pixels with three independent responsive tiers (desktop / tablet / mobile) controllable from the block inspector.

---

## 2. Design Compliance

- No typography or color — pure layout utility.
- Uses the theme's two primary breakpoints: `≤1024px` (tablet) and `≤768px` (mobile), consistent with all other CSS partials.
- No style guide update required — this is infrastructure, not a design pattern.

---

## 3. Architectural Fit

| Concern | Decision |
|---|---|
| Block type | **Dynamic** (`render.php`) — so the responsive CSS custom properties are emitted server-side without a JS bundle on the frontend. |
| Namespace | `wp-rig/section-spacer` |
| Scaffolding | `npm run block:new` |
| Auto-registration | `inc/Blocks/Component.php` scans `assets/blocks/*/block.json` automatically — no PHP changes needed. |
| Styles | `style.css` inside the block directory; registered via `block.json`. |

---

## 4. Attributes

| Attribute | Type | Default | Description |
|---|---|---|---|
| `spacingDesktop` | `integer` | `80` | Height in px at ≥1025px viewport |
| `spacingTablet` | `integer` | `60` | Height in px at 769px–1024px |
| `spacingMobile` | `integer` | `40` | Height in px at ≤768px |

---

## 5. Output Contract

### HTML (render.php)
```html
<div class="section-spacer"
     style="--sp-d: 80px; --sp-t: 60px; --sp-m: 40px;"
     aria-hidden="true">
</div>
```

### CSS (style.css)
```css
.section-spacer {
  display: block;
  width: 100%;
  height: var(--sp-d, 80px);
}
@media (max-width: 1024px) {
  .section-spacer { height: var(--sp-t, 60px); }
}
@media (max-width: 768px) {
  .section-spacer { height: var(--sp-m, 40px); }
}
```

Inline CSS custom properties carry the per-block values; the stylesheet maps them to `height`. No inline `height` is written — the custom property is the only inline style.

---

## 6. Editor UX (edit.js)

- Inspector panel → **"Spacing"** panel group.
- Three `__experimentalUnitControl` or `NumberControl` inputs labelled **Desktop (px)**, **Tablet (px)**, **Mobile (px)**.
- Editor preview: a shaded `<div>` showing the desktop height so content creators can judge the gap visually.

---

## 7. User Stories

- As an editor, I can drop a Section Spacer between two blocks to add breathing room between page sections.
- As an editor, I can tune the gap for each breakpoint independently from the block sidebar.
- As a developer, the block emits zero JS on the frontend — it is purely CSS-driven.

---

## 8. Success Metrics

- Block appears in inserter under the "Layout" or "Widgets" category.
- Correct height renders at each of the three breakpoint tiers (verified in browser).
- `npm run ai:check` passes with no warnings.

---

## 9. Technical Plan (The Contract)

### Step 1 — Scaffold
```bash
npm run block:new -- section-spacer --title="Section Spacer" --dynamic --category="layout"
```

### Step 2 — `block.json`
- Add `spacingDesktop`, `spacingTablet`, `spacingMobile` integer attributes with defaults 80 / 60 / 40.
- Add `"supports": { "html": false, "align": ["full", "wide"] }`.

### Step 3 — `src/edit.js`
- Import `InspectorControls`, `PanelBody`, `__experimentalNumberControl`.
- Render a visual spacer preview (`<div style={{ height: spacingDesktop }}>`) in the editor.
- Wire three number inputs to the three attributes.

### Step 4 — `render.php`
- Read `$attributes['spacingDesktop']`, `spacingTablet`, `spacingMobile`.
- Sanitize with `absint()`.
- Output inline custom properties `--sp-d`, `--sp-t`, `--sp-m` and `aria-hidden="true"`.

### Step 5 — `style.css`
- Write the three-tier height rules using the custom properties.

### Step 6 — `editor.css`
- Style the editor preview with a light background so editors can see the space.

### Step 7 — Verify
- `npm run build` (or `npm run dev`).
- Insert block in editor, change values, confirm preview updates.
- Resize browser to tablet/mobile and confirm heights change.
