# Login Form Template Override - Feature Specification

**Date:** 2026-04-15
**Status:** Implemented
**Figma Reference:** node-id 856:1778
**File:** aJ4VjKdFNahXA6Ly4jkRtJ

## Overview

Override the WooCommerce default login form template with a custom design matching the Figma specification. The template override will be used on the `/my-account` page to display a branded sign-in form when users are not logged in, while WooCommerce handles all authentication, redirects, and error handling.

## Implementation Approach

**Method:** WooCommerce Template Override
- Template: `woocommerce/my-account/form-login.php`
- This replaces WooCommerce's default login form while keeping all WooCommerce functionality
- No block needed - direct template override for cleaner integration

## User Stories

- As a **visitor**, I want to see a beautiful, branded login form on the My Account page when I'm not signed in
- As a **developer**, I want the form to use WooCommerce's native authentication system with custom styling
- As a **site owner**, I want the login experience to match our brand guidelines

## Requirements

### Functional Requirements

1. **Authentication Flow**
   - Check if user is logged in on render
   - If logged in: redirect to `/my-account` (dashboard)
   - If not logged in: display the custom login form
   - Skip redirect in block editor context

2. **Form Fields**
   - Email address input (required)
   - Password input (required, with show/hide toggle)
   - "Forgot Password?" link to `/my-account/lost-password/`
   - Sign In button (submits to WooCommerce login)
   - Footer: "New to Eternal?" with "Create an account" link to `/signup`

3. **WooCommerce Integration**
   - Use `wp_login_form()` or custom form with `wp_signon()`
   - Handle WooCommerce login errors
   - Support WooCommerce redirects after login

### Design Requirements

**Typography:**
- Heading: Cormorant Garamond, 32px, line-height 40px, color #021f1d
- Labels: Maison Neue, 11px, uppercase, letter-spacing 0.88px
- Body text: Maison Neue, 13px, line-height 20px
- "Forgot Password": 9px, uppercase, letter-spacing 1.26px

**Colors:**
- Primary (dark teal): `#021f1d`
- Input background: `#f5f5f5`
- Input border: `#bec4c4` (NEW - to be added)
- Text placeholder: `#929292`
- Button background: `#021f1d` with white text

**Spacing:**
- Form container: 360px max-width
- Input padding: 14px vertical, 16px horizontal
- Border radius: 2px
- Gap between fields: 24px
- Gap between label and input: 8px

### Technical Requirements

1. **Template Override**
   - Override `woocommerce/my-account/form-login.php`
   - Include all WooCommerce hooks for plugin compatibility
   - Inline JavaScript for password toggle (no external dependencies)

2. **CSS Variables**
   ```css
   :root {
       --login-input-border: #bec4c4;
       /* Other variables reuse existing signup form vars */
   }
   ```

3. **Responsive**
   - Desktop: 360px form width, centered
   - Mobile: Full width with 20px padding

4. **Accessibility**
   - Proper ARIA labels on password toggle
   - Focus visible states
   - WooCommerce error handling (native)
   - Keyboard navigation support

## Implementation Plan

### Phase 1: Template Override ✅
- [x] Create `woocommerce/my-account/` directory structure
- [x] Create `form-login.php` with custom markup
- [x] Include all WooCommerce hooks for compatibility
- [x] Add inline JavaScript for password toggle

### Phase 2: Styling ✅
- [x] Add `--login-input-border: #bec4c4` to `_custom-properties.css`
- [x] Create `_login-form.css` with Figma-matching styles
- [x] Import `_login-form.css` in `global.css`
- [x] Add responsive breakpoints
- [x] Add WooCommerce-specific overrides

### Phase 3: Testing ✅
- [x] Build CSS with `npm run build`
- [x] Verify template structure
- [x] Test responsive styles

### Phase 4: Integration (Testing Required)
- [ ] Test on `/my-account` page (logout first)
- [ ] Verify login flow with WooCommerce credentials
- [ ] Test redirect after successful login
- [ ] Test "Forgot Password" link functionality
- [ ] Test "Create an account" link functionality
- [ ] Validate error handling (wrong password, etc.)

## File Structure

```
wprig/
├── woocommerce/
│   └── my-account/
│       └── form-login.php (new - template override)
├── assets/
│   ├── blocks/
│   │   └── login-form/ (created but not used for template override)
│   │       ├── block.json
│   │       ├── render.php
│   │       ├── src/
│   │       │   ├── index.js
│   │       │   └── view.js
│   │       └── build/ (generated)
│   └── css/src/
│       ├── _custom-properties.css (updated)
│       ├── _login-form.css (new)
│       └── global.css (updated)
└── .ai/plans/
    └── 2026-04-15-login-form-redesign/
        └── SPEC.md (this file)
```

**Note:** The block files were created but are not used for the template override approach. They can be kept for future use or removed if desired.

## Success Criteria

- [ ] Form matches Figma design pixel-perfectly
- [ ] Login works with WooCommerce user accounts
- [ ] Password show/hide toggle functions correctly
- [ ] Forgot Password link navigates correctly
- [ ] Create account link navigates correctly
- [ ] Logged-in users are redirected to dashboard
- [ ] Form is accessible (WCAG 2.1 AA)
- [ ] Responsive on mobile and desktop
- [ ] No console errors

## Dependencies

- WooCommerce (for authentication)
- Existing signup form patterns (for consistency)
- Theme CSS variables (`--color-primary`, `--color-grey`, etc.)

## Notes

- Follow the same architectural patterns as the signup-form block
- Reuse CSS variables where possible to maintain consistency
- The form should only handle authentication; registration is handled separately at `/signup`
- Consider future enhancements: social login, "remember me" checkbox (out of scope for now)
