# SPEC: WooCommerce Lost Password Form Block

**Date:** 2026-04-15
**Status:** DRAFT - Pending Approval
**Related:** Figma Design (node-id: 694:2864), WooCommerce Lost Password Flow

---

## Mission Statement

Create a Gutenberg block for WooCommerce's lost password functionality that:
1. Matches the provided Figma design for Stage 1 (request reset link)
2. Provides styled override for Stage 2 (reset password form)
3. Integrates with WooCommerce's native lost password flow
4. Includes 301 redirect from `/my-account/lost-password/` to `/lost-password/` for SEO

---

## Design Compliance

### Figma Design Reference
- **Node ID:** 694:2864
- **File:** [Eternal-labs-x-Wings--Wings-Copy-](https://www.figma.com/design/aJ4VjKdFNahXA6Ly4jkRtJ/Eternal-labs-x-Wings--Wings-Copy-?node-id=694-2864)

### Design Tokens (from Figma)
| Element | Value |
|---------|-------|
| Primary Color | `#021f1d` (variable: `--primary`) |
| Grey (Input BG) | `#f5f5f5` |
| Secondary Text | `#868686` (variable: `--secondary`) |
| Border Radius | `2px` |
| Input Padding | `14px` vertical, `16px` horizontal |
| Form Max Width | `360px |
| Font (Headings) | Cormorant Garamond (32px) |
| Font (Body) | Maison Neue Book (11-17px) |
| Letter Spacing (Labels) | `0.88px` |
| Form Padding | `32px` vertical, `24px` horizontal |
| Container Padding | `80px` vertical, `60px` horizontal |

### Style Guide References
- **Typography:** Maison Neue (body), Cormorant Garamond (display)
- **Spacing:** 8px base unit, 24px section gaps
- **Colors:** Eternal Labs brand palette
- **Forms:** Grey background inputs, square corners (2px radius)

> **Note:** This feature will require a new `_lost-password-form.css` partial to be added to the style guide.

---

## Architectural Fit

### WP Rig Components
1. **Gutenberg Blocks System** (`inc/Blocks/Component.php`)
   - Auto-registers blocks from `assets/blocks/*/block.json`
   - Will auto-load `render.php` for dynamic rendering

2. **CSS Build System** (`assets/css/src/`)
   - New partial: `_lost-password-form.css`
   - Imported via `assets/css/src/components/_index.css`

3. **JavaScript Build** (`assets/blocks/lost-password-form/`)
   - Editor script: `src/index.js`, `src/edit.js`
   - Frontend script: `src/view.js` (form submission logic)

### WooCommerce Integration
- **Stage 1:** Uses WooCommerce's `lost_password` form action
- **Stage 2:** Uses WooCommerce's `reset_password` form action
- **Form POST:** Native WooCommerce form handling (not AJAX)
- **Messages:** Displayed below CTA button using WooCommerce notices

### WordPress Hooks/Filters
- **template_redirect:** Hook for 301 redirect from `/my-account/lost-password/`
- **woocommerce_locate_template:** Optional override for lost password templates

---

## User Stories

1. **As a site visitor**, I want to request a password reset with a clean, branded form that matches the Eternal Labs design aesthetic.

2. **As a site visitor**, I want to reset my password using a styled form that maintains brand consistency.

3. **As a content editor**, I want to use the lost password form on any page via Gutenberg.

4. **As a logged-in user**, I should be redirected to my account if I accidentally visit the lost password page.

5. **As an SEO specialist**, I want the old `/my-account/lost-password/` URL to 301 redirect to `/lost-password/` to preserve search rankings.

6. **As a developer**, I want the form to use WooCommerce's native password reset logic without duplicating functionality.

---

## Success Metrics

- [ ] Visual match to Figma design for Stage 1 (verified via screenshot comparison)
- [ ] Stage 2 (reset password) form uses brand styling
- [ ] Block appears in Gutenberg editor under "Widgets" category
- [ ] Form successfully submits to WooCommerce endpoints
- [ ] Success/error messages display correctly below CTA button
- [ ] Logged-in users are redirected to `/my-account/`
- [ ] 301 redirect from `/my-account/lost-password/` to `/lost-password/` works
- [ ] Back to Sign In link navigates correctly
- [ ] Both Stage 1 and Stage 2 forms are functional
- [ ] Form is accessible (keyboard navigation, ARIA labels, focus states)
- [ ] Passes Lighthouse accessibility audit (90+ score)
- [ ] No visual regressions in E2E tests

---

## Technical Plan (The Contract)

### Phase 1: Scaffolding

```bash
# Create the block skeleton
npm run block:new -- lost-password-form --title="Lost Password Form" --dynamic
```

This creates:
```
assets/blocks/lost-password-form/
├── block.json          # Block metadata and attributes
├── src/
│   ├── index.js        # Editor entry point
│   └── edit.js         # Block edit component
├── style.css           # Frontend styles (placeholder)
├── editor.css          # Editor-only styles (placeholder)
├── render.php          # Dynamic server-side render
└── build/              # Compiled output (auto-generated)
```

### Phase 2: File Creation & Modifications

#### 2.1 Block Metadata
**File:** `assets/blocks/lost-password-form/block.json`

```json
{
  "name": "wp-rig/lost-password-form",
  "apiVersion": 2,
  "title": "Lost Password Form",
  "category": "widgets",
  "icon": "admin-network",
  "description": "WooCommerce lost password form with custom styling matching Figma design.",
  "textdomain": "wp-rig",
  "editorScript": "file:./build/index.js",
  "style": "file:./build/style.css",
  "editorStyle": "file:./build/editor.css",
  "render": "file:./render.php",
  "viewScript": "file:./build/view.js",
  "attributes": {},
  "supports": {
    "align": ["full", "wide"],
    "html": false
  }
}
```

#### 2.2 Dynamic Render (Server-Side)
**File:** `assets/blocks/lost-password-form/render.php`

Form detection logic:
```php
<?php
// Check if user is logged in - redirect if so
if (is_user_logged_in() && ! (is_admin() || (defined('REST_REQUEST') && REST_REQUEST))) {
    $my_account_url = function_exists('wc_get_page_permalink') ? wc_get_page_permalink('myaccount') : home_url('/my-account/');
    wp_safe_redirect($my_account_url);
    exit;
}

// Determine which stage of the lost password flow we're in
// Stage 1: Request reset link (default)
// Stage 2: Reset password (when user clicks link in email)
$is_reset_stage = isset($_GET['show-reset-form']) && isset($_GET['key']) && isset($_GET['login']);

// Build URLs
$login_url = home_url('/login/');
$lost_password_url = wc_lost_password_url();

// Output appropriate form based on stage
?>
```

**Stage 1 Form Structure (Request Reset Link):**
- Title: "FORGOT YOUR PASSWORD?" / "ACCOUNT RECOVERY"
- Description text
- Email input field
- "SEND RESET LINK" button
- "← Back to Sign In" link

**Stage 2 Form Structure (Reset Password):**
- Title: "SET NEW PASSWORD"
- Password field (with visibility toggle)
- Confirm password field
- "SAVE NEW PASSWORD" button
- "← Back to Sign In" link

#### 2.3 Block Editor Component
**File:** `assets/blocks/lost-password-form/src/edit.js`

- Import `InspectorControls`, `PanelBody` from `@wordpress/components`
- Create form preview (static HTML matching Figma Stage 1)
- No block attributes needed (all text is static per design)

#### 2.4 Block Save Function
**File:** `assets/blocks/lost-password-form/src/index.js`

- Return `null` (dynamic block, rendered server-side)

#### 2.5 Form Submission JavaScript
**File:** `assets/blocks/lost-password-form/src/view.js`

Form submission logic:
```javascript
// 1. Listen for form submit
// 2. Show loading state on button
// 3. Submit form via native POST (WooCommerce handles this)
// 4. Handle response:
//    - Success: Show WooCommerce notice/messages
//    - Error: Show WooCommerce error messages
// 5. Password toggle for Stage 2 (if applicable)
```

#### 2.6 CSS Styles (Figma Match)
**File:** `assets/css/src/components/_lost-password-form.css`

```css
/* CSS Variables for theme colors */
:root {
  --lost-password-primary: #021f1d;
  --lost-password-grey: #f5f5f5;
  --lost-password-secondary: #868686;
  --lost-password-border-radius: 2px;
  --lost-password-input-padding-y: 14px;
  --lost-password-input-padding-x: 16px;
  --lost-password-form-max-width: 360px;
  --lost-password-font-heading: "Cormorant Garamond", serif;
  --lost-password-font-body: "Maison Neue", -apple-system, sans-serif;
}

/* Remove sidebar grid layout for lost password page */
body.has-sidebar .site:has(.lost-password-form-wrapper) {
  grid-template-columns: unset !important;
  /* ... same pattern as login/signup */
}

/* Stage 1: Request Reset Link - exact Figma match */
.lost-password-form-wrapper {
  display: flex !important;
  justify-content: center;
  align-items: center;
  padding: 80px 60px !important;
  background-color: #fff;
}

/* Form container with exact Figma spacing */
.lost-password-form__form {
  padding: 32px 24px;
  max-width: 360px;
  /* ... */
}

/* Stage 2: Reset Password - brand styling override */
/* Override WooCommerce default form styles */
```

Import the new partial in `assets/css/src/components/_index.css`:
```css
@import '_lost-password-form.css';
```

#### 2.7 301 Redirect Implementation
**File:** `inc/Lost_Password_Redirect.php` (NEW)

```php
<?php
/**
 * 301 Redirect: /my-account/lost-password/ -> /lost-password/
 *
 * @package wp_rig
 */

add_action('template_redirect', 'wp_rig_lost_password_redirect');

function wp_rig_lost_password_redirect() {
  // Only redirect on the lost password page
  if (!function_exists('wc_get_page_permalink')) {
    return;
  }

  $lost_password_url = wc_get_page_permalink('lostpassword');
  $request_uri = $_SERVER['REQUEST_URI'] ?? '';

  // Check if we're on /my-account/lost-password/
  if (strpos($request_uri, '/my-account/lost-password/') !== false) {
    $new_url = home_url('/lost-password/');
    wp_safe_redirect($new_url, 301); // Permanent redirect
    exit;
  }
}
```

Register this component in `functions.php` or via `inc/Theme.php`.

#### 2.8 Update Login Form Block
**File:** `assets/blocks/login-form/render.php`

Update the lost password URL to point to our new page:
```php
// Change from:
$lost_password_url = function_exists('wc_lost_password_url') ? wc_lost_password_url() : home_url('/my-account/lost-password/');

// To:
$lost_password_url = home_url('/lost-password/');
```

### Phase 3: Build & Verification

```bash
# Compile block assets
npm run build

# Or for development with hot reload
npm run dev
```

**Verification Steps:**
1. Create new Page in WordPress: "/lost-password"
2. Add "Lost Password Form" block via Gutenberg
3. Test Stage 1 form:
   - Enter email and submit
   - Check for success message
   - Check for error message with invalid email
4. Click link in email to test Stage 2 form:
   - Enter new passwords
   - Submit and verify login with new password
5. Test 301 redirect:
   - Visit `/my-account/lost-password/`
   - Verify redirect to `/lost-password/` (check status code is 301)
6. Test "Back to Sign In" link navigates to `/login/`
7. Test while logged in (should redirect to my-account)
8. Run E2E accessibility test
9. Run visual regression

### Phase 4: Documentation Updates

**File:** `.ai/STYLE-GUIDE.md` (if exists)

Add section for "Lost Password Form" with:
- Component description
- Usage guidelines
- Two-stage flow explanation
- Accessibility notes

**File:** `.ai/plans/2026-04-15-lost-password-block/IMPLEMENTATION.md` (NEW)

Track implementation progress with checklist.

---

## Open Questions / Risks

1. **WooCommerce Template Override:** Need to ensure our block doesn't conflict with WooCommerce's default lost password templates.

2. **Email Link Format:** WooCommerce generates reset links with `/my-account/lost-password/`. Need to verify these work with our new block at `/lost-password/`.

3. **Stage 2 Form:** No Figma design for reset password form. Using basic brand-consistent styling is acceptable per user confirmation.

4. **Message Display:** WooCommerce displays notices in different locations. Need to ensure they appear below our CTA button.

---

## Dependencies

- ✅ WooCommerce 7.0+
- ✅ WordPress 6.0+
- ✅ WP Rig theme with blocks enabled
- ✅ Login form block (for back link)

---

## Next Steps (Upon Approval)

1. Run scaffolding command: `npm run block:new -- lost-password-form --title="Lost Password Form" --dynamic`
2. Create/modify files per Phase 2
3. Build and test locally
4. Create E2E test spec
5. Document in style guide
6. Deploy to staging for final review

---

## Approval Signature

**Developer:** _______________________ **Date:** __________

**Designer:** _______________________ **Date:** __________

**Product Owner:** _______________________ **Date:** __________
