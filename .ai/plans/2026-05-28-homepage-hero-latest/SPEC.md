# SPEC: homepage-hero-latest block

**Date**: 2026-05-28  
**Figma**: node 1068:2627

## Goal
New `wp-rig/homepage-hero-latest` Gutenberg block — full-viewport hero with GSAP simultaneous crossfade between slides. Replaces `homepage-hero` on the homepage.

## Attributes
- `slides` (array) — each item: `desktopImageId`, `desktopImageUrl`, `mobileImageId`, `mobileImageUrl`, `heading`, `subtext`, `ctaLabel`, `ctaUrl`
- `slideInterval` (integer, default 5000ms)

## Frontend structure
```
.hhl                              ← section, data-interval
  .hhl__slides                    ← absolute fill container
    .hhl__slide[--first]          ← position:absolute, opacity:0 (except --first)
      picture.hhl__bg             ← <source mobile> + <img desktop>
      .hhl__content               ← sticky, bottom-left
        .hhl__text
          h1.hhl__heading
          p.hhl__subtext
        a.hhl__cta
          span.hhl__cta-label
```

## CTA
White filled box (`background:#fff`, `padding:12px`), DM Sans Medium 11px, 1.98px tracking, `#021f1d` text. Matches Figma node 1068:2633.

## GSAP
- First slide: staggered entrance (heading → subtext → CTA) from `opacity:0, y:-20`
- Crossfade: `gsap.timeline().to(out,{opacity:0,duration:1},0).to(in,{opacity:1,duration:1},0)` — simultaneous
- Single slide: entrance only, no interval

## Build
Auto-registered by `Blocks/Component.php` (scans `assets/blocks/`). `viewScript:"file:./build/view.js"` in block.json. GSAP bundled by esbuild.

## Status
APPROVED
