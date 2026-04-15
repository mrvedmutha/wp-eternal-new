# SPEC: WooCommerce Signup Form Block

**Date:** 2026-04-13
**Status:** DRAFT - Pending Approval
**Related:** Figma Design (node-id: 694:2730), Plugin: `woocommerce-register-page`

---

## Mission Statement

Create a customizable Gutenberg block for WooCommerce customer registration that matches the provided Figma design, integrates with the existing `woocommerce-register-page` plugin's REST API, and provides content editors with full control over legal/consent text via block settings.

---

## Design Compliance

### Figma Design Reference
- **Node ID:** 694:2730
- **File:** [Eternal-labs-x-Wings--Wings-Copy-](https://www.figma.com/design/aJ4VjKdFNahXA6Ly4jkRtJ/Eternal-labs-x-Wings--Wings-Copy-?node-id=694-2730)

### Design Tokens (from Figma)
| Element | Value |
|---------|-------|
| Primary Color | `#021f1d` (variable: `--primary`) |
| Grey (Input BG) | `#f5f5f5` (variable: `--grey`) |
| Secondary Text | `#868686` (variable: `--secondary`) |
| Border Radius | `2px` |
| Input Padding | `14px` vertical, `16px` horizontal |
| Form Max Width | `360px` |
| Font (Headings) | Cormorant Garamond (32px) |
| Font (Body) | Maison Neue Book (11-17px) |
| Letter Spacing (Labels) | `0.88px` |

### Style Guide References
- **Typography:** Maison Neue (body), Cormorant Garamond (display)
- **Spacing:** 8px base unit, 24px section gaps
- **Colors:** Eternal Labs brand palette
- **Forms:** Grey background inputs, square corners (2px radius)

> **Note:** This feature will require a new `_signup-form.css` partial to be added to the style guide.

---

## Architectural Fit

### WP Rig Components
1. **Gutenberg Blocks System** (`inc/Blocks/Component.php`)
   - Auto-registers blocks from `assets/blocks/*/block.json`
   - Will auto-load `render.php` for dynamic rendering

2. **CSS Build System** (`assets/css/src/`)
   - New partial: `_signup-form.css`
   - Imported via `assets/css/src/components/_index.css`

3. **JavaScript Build** (`assets/blocks/signup-form/`)
   - Editor script: `src/index.js`, `src/edit.js`
   - Frontend script: `src/view.js` (form submission logic)

### External Dependencies
- **Plugin:** `woocommerce-register-page` (must be active)
- **REST API Endpoint:** `/wp-json/wc-register/v1/signup`
- **WooCommerce:** For customer creation and redirects

### WordPress Hooks/Filters
- No new hooks required (uses block system)
- Plugin provides: `wcCustomRegister` global object

---

## User Stories

1. **As a site visitor**, I want to create an account with a clean, branded form that matches the Eternal Labs design aesthetic.

2. **As a content editor**, I want to customize the marketing consent text and legal page links without touching code.

3. **As a logged-in user**, I should be redirected to my account if I accidentally visit the signup page.

4. **As a developer**, I want to reuse this signup form on multiple pages (landing pages, modals) using Gutenberg.

5. **As a site administrator**, I want form validation and security handled server-side via the existing plugin.

---

## Success Metrics

- [ ] Visual match to Figma design (verified via screenshot comparison)
- [ ] Block appears in Gutenberg editor under "Widgets" category
- [ ] All block settings are editable and persist on save
- [ ] Form successfully submits to plugin REST API
- [ ] Logged-in users are redirected to `/my-account/`
- [ ] Password toggle visibility works
- [ ] Error messages display correctly for duplicate email, password mismatch
- [ ] Success message displays and redirects appropriately
- [ ] Terms & Privacy links are configurable via block settings
- [ ] Marketing consent text is fully customizable
- [ ] Form is accessible (keyboard navigation, ARIA labels, focus states)
- [ ] Passes Lighthouse accessibility audit (90+ score)
- [ ] No visual regressions in E2E tests

---

## Technical Plan (The Contract)

### Phase 1: Scaffolding

```bash
# Create the block skeleton
npm run block:new -- signup-form --title="Signup Form" --dynamic
```

This creates:
```
assets/blocks/signup-form/
├── block.json          # Block metadata and attributes
├── src/
│   ├── index.js        # Editor entry point
│   └── edit.js         # Block edit component
├── style.css           # Frontend styles (placeholder)
├── editor.css          # Editor-only styles (placeholder)
├── render.php          # Dynamic server-side render
└── build/              # Compiled output (auto-generated)
```

### Phase 2: Block Attributes Configuration

**File:** `assets/blocks/signup-form/block.json`

```json
{
  "attributes": {
    "termsUrl": {
      "type": "string",
      "default": "/terms/"
    },
    "privacyUrl": {
      "type": "string", 
      "default": "/privacy-policy/"
    },
    "marketingTitle": {
      "type": "string",
      "default": "Sign me up to hear more from Eternal Labs."
    },
    "marketingDescription": {
      "type": "string",
      "default": "By checking this box, you agree to receive marketing emails and other communications from Eternal Labs. To learn more, view our PRIVACY POLICY."
    },
    "termsAgreementText": {
      "type": "string",
      "default": "By clicking Create Account button I agree to ETERNAL-LABS TERMS & CONDITIONS and PRIVACY POLICY."
    }
  }
}
```

### Phase 3: File Creation & Modifications

#### 3.1 Block Editor Component
**File:** `assets/blocks/signup-form/src/edit.js`

- Import `InspectorControls`, `PanelBody`, `TextControl`, `TextareaControl` from `@wordpress/components`
- Create form preview (static HTML matching Figma)
- Add settings sidebar with:
  - URL input for Terms page
  - URL input for Privacy Policy page
  - Text input for Marketing Title
  - Textarea for Marketing Description
  - Textarea for Terms Agreement Text

#### 3.2 Block Save Function
**File:** `assets/blocks/signup-form/src/index.js`

- Return `null` (dynamic block, rendered server-side)

#### 3.3 Dynamic Render (Server-Side)
**File:** `assets/blocks/signup-form/render.php`

Form structure:
```php
<?php
// Check if user is logged in - redirect if so
if (is_user_logged_in()) {
    wp_safe_redirect(wc_get_page_permalink('myaccount'));
    exit;
}

// Get block attributes
$terms_url = $attributes['termsUrl'] ?? '/terms/';
$privacy_url = $attributes['privacyUrl'] ?? '/privacy-policy/';
// ... etc

// Output form with:
// 1. WordPress nonce: wp_nonce_field('wp_rest', 'wc_signup_nonce')
// 2. All form fields with proper ARIA labels
// 3. CAPTCHA placeholder (conditional on plugin config)
// 4. "Sign in" link to /my-account/
?>
```

#### 3.4 Form Submission JavaScript
**File:** `assets/blocks/signup-form/src/view.js`

Form submission logic:
```javascript
// 1. Listen for form submit
// 2. Collect form data
// 3. Get nonce from hidden field
// 4. Show loading state
// 5. POST to /wp-json/wc-register/v1/signup
// 6. Handle response:
//    - Success: Show message, redirect after 1.5s
//    - Error: Show specific error message
// 7. Password toggle: Switch input type password/text
```

#### 3.5 CSS Styles (Figma Match)
**File:** `assets/css/src/components/_signup-form.css`

```css
/* CSS Variables for theme colors */
/* Form container: centered, max-width 360px */
/* Input styling: grey background, 2px radius, specific padding */
/* Typography: Cormorant Garamond headings, Maison Neue body */
/* Button: primary color, full width */
/* Checkbox: custom styling to match Figma */
/* Eye icon: password toggle */
/* Responsive: full width on mobile */
/* States: focus, error, disabled, loading */
```

Import the new partial in `assets/css/src/components/_index.css`:
```css
@import '_signup-form.css';
```

#### 3.6 Page Template (Optional Enhancement)
**File:** `templates/page-signup.php` (NEW)

```php
<?php
/**
 * Template Name: Signup Page
 */

if (is_user_logged_in()) {
    wp_safe_redirect(wc_get_page_permalink('myaccount'));
    exit;
}

// Render the signup-form block if it exists
// Otherwise provide fallback HTML
```

### Phase 4: Build & Verification

```bash
# Compile block assets
npm run build

# Or for development with hot reload
npm run dev
```

**Verification Steps:**
1. Create new Page in WordPress: "/signup"
2. Add "Signup Form" block via Gutenberg
3. Test block settings panel (all fields editable)
4. Fill form and submit (check Network tab for API call)
5. Test with existing email (should show error)
6. Test password mismatch (should show error)
7. Test successful signup (should redirect)
8. Test while logged in (should redirect to my-account)
9. Run E2E accessibility test: `npm run test:e2e --spec=signup-form`
10. Run visual regression: `npm run test:e2e:screenshot --SCREENSHOT_SELECTOR=".wp-block-wp-rig-signup-form"`

### Phase 5: Documentation Updates

**File:** `.ai/STYLE-GUIDE.md` (if exists)

Add section for "Signup Form" with:
- Component description
- Usage guidelines
- Customization options
- Accessibility notes

---

## Open Questions / Risks

1. **CAPTCHA Integration:** Plugin supports Turnstile/reCAPTCHA but may not be configured. Need placeholder that works without JS errors if not enabled.

2. **Terms Pages:** User confirmed pages don't exist yet but will be created. Block settings allow URLs to be configured later.

3. **Password Toggle Icon:** Figma uses custom eye-slash icon. Need SVG asset or use WordPress dashicon.

4. **Accessibility:** Ensure all form fields have proper labels, error associations, and keyboard navigation.

---

## Dependencies

- ✅ `woocommerce-register-page` plugin installed and active
- ✅ WooCommerce 7.0+
- ✅ WordPress 6.0+
- ✅ WP Rig theme with blocks enabled

---

## Next Steps (Upon Approval)

1. Run scaffolding command
2. Create/modify files per Phase 3
3. Build and test locally
4. Create E2E test spec
5. Document in style guide
6. Deploy to staging for final review

---

## Approval Signature

**Developer:** _______________________ **Date:** __________

**Designer:** _______________________ **Date:** __________

**Product Owner:** _______________________ **Date:** __________
