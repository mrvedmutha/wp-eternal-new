# SPEC: Editorial Wide Text Section — `heading-body-left` Variant

**Date:** 2026-04-07
**Feature:** Add a 4th variant to `wp-rig/editorial-wide-text-section`
**Status:** PENDING APPROVAL

---

## Overview

Add a left-aligned heading + body variant to the existing Editorial Wide Text Section block. Reference: Figma node `694:4506`.

---

## Files to Change

| File | Change |
|------|--------|
| `assets/blocks/editorial-wide-text-section/block.json` | Add `"heading-body-left"` to the `variant` enum |
| `assets/blocks/editorial-wide-text-section/src/edit.js` | Add option to `VARIANT_OPTIONS`; show heading + body controls for new variant |
| `assets/blocks/editorial-wide-text-section/render.php` | Render heading + body for `heading-body-left`; update comment header |
| `assets/css/src/_editorial-wide-text-section.css` | Add styles for `.ewts--heading-body-left` variant |

---

## Design Spec (from Figma node 694:4506)

### Layout
- Vertical padding: `80px` (matches `heading-body`)
- Inner container: `flex-direction: column`, `align-items: flex-start`, `gap: 24px`
- Max-width container: `1440px`, `padding-inline: 40px`

### Heading (`.ewts__heading`)
- Reuses existing `.ewts__heading` typography (Cormorant Garamond, 400, 40px/48px, -0.02em)
- Text align: **left** (overrides the centered default)

### Body (`.ewts__body--left`)
- Reuses existing body typography (Maison Neue, 400, 15px/23px, 0.01em)
- Text align: **left**
- Max-width: **463px** (matching Figma's 462.821px)
- `margin-top: 0` (gap is handled by the flex container)

### Mobile (`max-width: 768px`)
- Heading and body stay **left-aligned** (no center override)
- `padding-block: 56px` (matches `heading-body` mobile)
- `padding-inline: 24px` (matches existing inner override)

---

## CSS Strategy

Add a new modifier class `.ewts--heading-body-left` that:
1. Sets `padding-block: 80px` on the section
2. Makes `.ewts__inner` use `align-items: flex-start`
3. Overrides `.ewts__heading` text-align to `left`
4. Introduces `.ewts__body--left` for the narrower, left-aligned body (max-width 463px)

The `render.php` will output `ewts__body--left` (instead of `ewts__body`) for this variant to avoid altering the centered body style used by `heading-body`.

---

## Render PHP Logic

```
heading-body-left → same as heading-body branch but adds ewts--heading-body-left modifier class
                    body paragraph gets class ewts__body ewts__body--left
```

---

## Editor JS

- Add `{ label: 'Heading + Body (Left)', value: 'heading-body-left' }` to `VARIANT_OPTIONS`
- Reuse existing heading and body `TextareaControl` blocks by extending the condition:
  `variant === 'heading-body' || variant === 'heading-body-left'`

---

## Out of Scope

- No new block attributes needed — reuses `headingText` and `bodyText`
- No changes to `inc/Editorial_Wide_Text_Section/Component.php`
- No new block registered — this is a variant of the existing block
