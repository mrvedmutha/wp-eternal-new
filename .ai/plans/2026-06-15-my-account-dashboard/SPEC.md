# My Account Dashboard — Feature Specification

**Date:** 2026-06-15
**Status:** Approved → Implementing

## Overview

Style the WooCommerce My Account logged-in dashboard to match the Eternal Labs brand. The current state is raw WooCommerce output with no layout, no visual hierarchy, and a bullet-point sidebar.

## Tabs

Dashboard · Orders · Addresses · Account Details (Downloads removed — physical products only).

## Layout

### Desktop (≥768px)
Two-column grid: 220px sidebar left + flex-1 content right, 60px gap, 80px horizontal page padding, 60px vertical padding.

- Sidebar: vertical tab list, uppercase Maison Neue, letter-spacing, dark teal `#021f1d`
- Active tab: `2px solid` underline below the text (not left border)
- Logout: visually separated at the bottom, muted color
- Content: page heading (Cormorant Garamond) showing active tab name, WooCommerce content below

### Mobile (<768px)
- Tab strip: horizontal scrollable row at top of content, `overflow-x: auto`, `-webkit-overflow-scrolling: touch`, no scrollbar visible
- Active tab: 2px underline
- Content stacks below the tab strip

## Files

| File | Action |
|---|---|
| `.ai/plans/2026-06-15-my-account-dashboard/SPEC.md` | This file |
| `inc/My_Account/Component.php` | New — removes Downloads, adds body class |
| `inc/Theme.php` | Updated — registers My_Account component |
| `woocommerce/my-account/my-account.php` | New override — layout wrapper + dynamic heading |
| `woocommerce/my-account/navigation.php` | New override — styled tab list |
| `woocommerce/my-account/dashboard.php` | New override — welcome section |
| `assets/css/src/_my-account.css` | New — full layout + tab + content styles |
| `assets/css/src/global.css` | Updated — import `_my-account.css` |
