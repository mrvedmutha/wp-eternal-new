# SPEC: Simple Rich Text Block

**Date:** 2026-04-03
**Figma Node:** `694:1532` — "The Science of Vitality" Text Content Block
**Block slug:** `wp-rig/simple-rich-text`
**Status:** AWAITING APPROVAL

---

## 1. What We're Building

A reusable full-width editorial text section for Eternal Labs. Drop it anywhere on any page. It contains:

- An **H2 heading** in Cormorant Garamond
- **Two body paragraphs** in Maison Neue (both support inline bold/italic via RichText)
- A **GSAP word-by-word scroll reveal**: all words start muted grey, then animate to `#021f1d` in staggered sequence — heading first, then paragraph 1, then paragraph 2
- Inspiration for animation pattern: `homepage-brand-statement` (`view.js` one-shot word reveal)

---

## 2. Block Architecture

**Block name:** `wp-rig/simple-rich-text`
**Title:** Simple Rich Text

### Attributes (all RichText so inline bold/italic works in editor)

| Attribute     | Type   | Default                          |
|---------------|--------|----------------------------------|
| `heading`     | string | "The Science of Vitality"        |
| `bodyPrimary` | string | "Manufactured in Switzerland…"   |
| `bodySecondary` | string | "Our goal is simple: <strong>to help people feel stronger…</strong>" |

### No InnerBlocks — purely attribute-driven.

---

## 3. Files to Create / Modify

| File | Action | Purpose |
|------|--------|---------|
| `assets/blocks/simple-rich-text/block.json` | **Create** | Block registration, attributes |
| `assets/blocks/simple-rich-text/render.php` | **Create** | Frontend HTML output |
| `assets/blocks/simple-rich-text/src/edit.js` | **Create** | Editor UI with RichText controls |
| `assets/blocks/simple-rich-text/src/index.js` | **Create** | Block registration entry |
| `assets/blocks/simple-rich-text/src/view.js` | **Create** | GSAP word reveal animation |
| `assets/blocks/simple-rich-text/editor.css` | **Create** | Editor-only styles |
| `assets/blocks/simple-rich-text/style.css` | **Create** | Pointer to theme CSS partial |
| `assets/css/src/_simple-rich-text.css` | **Create** | All frontend styles |
| `inc/Simple_Rich_Text/Component.php` | **Create** | Component stub (auto-enqueue via viewScript) |
| `inc/Theme_Support/Component.php` | **Modify** | Register new component class |

---

## 4. CSS Architecture

```
.simple-rich-text                   → full-width, padding: 80px 40px
.simple-rich-text__heading          → Cormorant Garamond 400, 40px, lh 48px, ls -2px
                                       color: #021f1d (muted initially via GSAP)
.simple-rich-text__body             → Maison Neue Book, 15px, lh 23px, ls 0.15px
                                       color: #021f1d (muted initially via GSAP)
                                       max-width: ~462px (narrow column, left-aligned)
.srt-word                           → inline span, GSAP-controlled color
```

### Responsive breakpoints

| Breakpoint | Change |
|---|---|
| `≤ 600px` (--bp-mobile or custom) | padding-left/right → `20px` |
| `≤ 450px` (--bp-mobile-sm) | heading font-size → `28px`, lh `36px`, ls `0` |

Body columns inherit naturally at narrow widths (no fixed max-width below 600px).

---

## 5. JS / GSAP Animation

```
Library:       GSAP + ScrollTrigger (already installed)
Trigger:       section enters viewport (start: "top bottom")
Mode:          One-shot (toggleActions: "play none none none") — same as homepage-brand-statement
Effect:        color #a8a8a8 → #021f1d, one-shot stagger
Sequence:      heading words → bodyPrimary words → bodySecondary words (continuous stagger)
Word split:    JS at runtime — wrap each word in <span class="srt-word">
RichText note: word split runs on textContent — inline <strong> tags are preserved
               by splitting on the span boundaries, not re-wrapping strong contents
```

### Animation caveat for inline bold

`bodySecondary` may contain `<strong>` tags. The word split will wrap `<span>` around
text nodes only (splitting on rendered `textContent` per element preserving markup).
Simpler approach: split on `innerText`, rebuild spans, accept that bold formatting is
retained at the element level but individual bold words animate as part of the word stagger.

---

## 6. Editor Experience

- `edit.js` renders all 3 fields as inline `RichText` components (not sidebar controls) so
  editors see the live layout while typing — same visual hierarchy as the frontend.
- Heading uses `tagName="h2"`, body fields use `tagName="p"`.
- `allowedFormats` for heading: none (pure heading text).
- `allowedFormats` for body fields: `["core/bold", "core/italic"]`.

---

## 7. Out of Scope

- More than 3 text fields (heading + 2 body) — fixed structure for now
- Background color controls
- Alignment controls beyond full-width
- Any image or media slots

---

## APPROVAL REQUIRED

Please confirm before implementation begins.
