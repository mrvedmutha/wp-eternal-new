# Filter Plugin Integration - Testing Checklist

**Date**: 2026-04-16
**Status**: Ready for Testing
**Environment**: [Staging/Local]

---

## Pre-Testing Setup

### Plugin Requirements
- [ ] Eternal Product Category Filter plugin installed and activated
- [ ] At least one product category has filter groups configured
- [ ] Sample products have filter values assigned
- [ ] REST API endpoint accessible: `/wp-json/eternal-filters/v1/category/{id}/filters`

### Test Categories
- [ ] **Skincare** (Product Types, Skin Type, Benefits) - 3 filter groups
- [ ] **Nutraceuticals** (Formulations For, Product Format) - 2 filter groups

### Browser Testing
- [ ] Chrome (latest)
- [ ] Safari (latest)
- [ ] Firefox (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Functional Testing Scenarios

### Scenario 1: Initial Page Load (No Filters)

**Given**: Plugin active, Skincare category has 3 filter groups
**When**: User visits Skincare category page
**Then**:
- [ ] Filters load dynamically from REST API
- [ ] 3 filter groups display: "Product Types", "Skin Type", "Benefits"
- [ ] Each option shows product count in parentheses
- [ ] Button displays "Apply" (disabled, grayed out)
- [ ] All checkboxes unchecked
- [ ] First filter group accordion is open by default
- [ ] Visual design matches existing theme

**Expected URL**: `/product-category/skincare/`
**Expected Console**: No errors

---

### Scenario 2: Select Filter (Button Enables)

**Given**: User on Skincare category page, button = "Apply" (disabled)
**When**: User checks "Face Creme" option
**Then**:
- [ ] Button changes to "Apply" (enabled, active state)
- [ ] Button becomes clickable with primary color background (#021f1d)
- [ ] Checkbox shows checked state with black dot
- [ ] Checkbox label text changes to dark color
- [ ] URL unchanged (no update yet)
- [ ] Products unchanged
- [ ] No page reload

**Expected State**: Selection State
**Expected Console**: No errors

---

### Scenario 3: Apply Filter

**Given**: User has selected "Face Creme", button = "Apply" (enabled)
**When**: User clicks "Apply" button
**Then**:
- [ ] URL updates to `?eternal_filter=face-creme`
- [ ] Page reloads
- [ ] Products filtered to show only Face Creme products
- [ ] "Face Creme" checkbox remains checked
- [ ] Button changes to "Clear" (enabled)
- [ ] Product count updates to match filtered results
- [ ] URL parameter persists in address bar

**Expected URL**: `/product-category/skincare/?eternal_filter=face-creme`
**Expected Result**: Only Face Creme products displayed
**Expected Console**: No errors

---

### Scenario 4: Clear Filter

**Given**: User has applied "Face Creme" filter, button = "Clear" (enabled)
**When**: User clicks "Clear" button
**Then**:
- [ ] URL removes `eternal_filter` parameter
- [ ] Page reloads
- [ ] All products display (unfiltered)
- [ ] All checkboxes unchecked
- [ ] Button changes to "Apply" (disabled)
- [ ] Product count resets to total products
- [ ] URL returns to clean state

**Expected URL**: `/product-category/skincare/`
**Expected Result**: All products displayed
**Expected Console**: No errors

---

### Scenario 5: Multiple Filters Selection

**Given**: User on Skincare category page
**When**: User checks "Face Creme" + "Dry Skin"
**Then**:
- [ ] Button displays "Apply" (enabled)
- [ ] Both checkboxes show checked state
- [ ] URL unchanged (waiting for apply)
- [ ] No page reload yet

**Expected State**: Selection State with 2 filters
**Expected Console**: No errors

---

### Scenario 6: Multiple Filters Applied

**Given**: User has selected "Face Creme" + "Dry Skin", button = "Apply" (enabled)
**When**: User clicks "Apply" button
**Then**:
- [ ] URL updates to `?eternal_filter=face-creme,dry-skin`
- [ ] Products filtered by both selections (AND logic)
- [ ] Both checkboxes remain checked
- [ ] Button changes to "Clear" (enabled)
- [ ] Product count matches filtered results

**Expected URL**: `/product-category/skincare/?eternal_filter=face-creme,dry-skin`
**Expected Result**: Products matching BOTH filters
**Expected Console**: No errors

---

### Scenario 7: Page Load with Active Filters (URL has params)

**Given**: User visits URL with `?eternal_filter=face-creme,dry-skin`
**When**: Page loads
**Then**:
- [ ] Filters load from REST API
- [ ] "Face Creme" and "Dry Skin" checkboxes pre-checked
- [ ] Button displays "Clear" (enabled)
- [ ] Products show filtered results
- [ ] Visual state matches URL parameters
- [ ] No flicker or layout shift

**Expected State**: Active State (Clear button)
**Expected Console**: No errors

---

### Scenario 8: Browser Back Button (State Restoration)

**Given**: User has applied filters (button = "Clear")
**When**: User clicks browser back button
**Then**:
- [ ] URL updates to previous state
- [ ] Page reloads with previous filter state
- [ ] Button state matches URL (Apply/Clear)
- [ ] Checkboxes match URL state
- [ ] Products update accordingly
- [ ] No console errors

**Expected Behavior**: Proper state restoration
**Expected Console**: No errors

---

### Scenario 9: Uncheck All Selected Filters

**Given**: User has "Face Creme" selected, button = "Apply" (enabled)
**When**: User unchecks "Face Creme"
**Then**:
- [ ] If URL has active filters: Button = "Clear" (enabled)
- [ ] If URL has no active filters: Button = "Apply" (disabled)
- [ ] Checkbox unchecked
- [ ] URL unchanged
- [ ] No page reload

**Expected State**: Correct button state based on URL
**Expected Console**: No errors

---

### Scenario 10: Plugin Inactive

**Given**: Plugin deactivated
**When**: User visits category page
**Then**:
- [ ] Page loads without errors
- [ ] No filter container displays
- [ ] No button displays
- [ ] Products display normally
- [ ] Sort dropdown still works
- [ ] No console errors

**Expected Result**: Clean page without filters
**Expected Console**: No errors (maybe warning about missing plugin)

---

### Scenario 11: Mobile Filter Drawer

**Given**: User on mobile device (< 1024px)
**When**: User taps "Add Filter" button
**Then**:
- [ ] Drawer opens from right with slide animation
- [ ] Dynamic filters load in drawer
- [ ] Apply/Clear button displays in drawer
- [ ] Filter selection works
- [ ] Apply button updates URL and closes drawer
- [ ] Clear button resets filters and closes drawer
- [ ] Close button (×) works
- [ ] Clicking outside drawer closes it
- [ ] Body scroll locked when drawer open

**Expected Behavior**: Smooth mobile UX
**Expected Console**: No errors

---

### Scenario 12: Accordion Functionality

**Given**: Filter groups displayed
**When**: User clicks filter group title
**Then**:
- [ ] Group toggles open/closed
- [ ] First group open by default on load
- [ ] Smooth transition (200ms per spec)
- [ ] Click works on both desktop and mobile
- [ ] Cursor indicates clickable
- [ ] Multiple groups can be open simultaneously

**Expected Behavior**: Smooth accordion
**Expected Console**: No errors

---

### Scenario 13: Category with No Filters

**Given**: Category exists but has no filter groups configured
**When**: User visits category page
**Then**:
- [ ] Page loads normally
- [ ] No filter sidebar displays
- [ ] Products display normally
- [ ] No console errors

**Expected Result**: Clean page without filters
**Expected Console**: No errors

---

## Visual Regression Testing

### Desktop (> 1024px)
- [ ] Filter sidebar width: 206px
- [ ] Button padding: 10px 20px
- [ ] Button border: 0.5px solid #021f1d
- [ ] Active button background: #021f1d with white text
- [ ] Disabled button: grayed out, opacity 0.4
- [ ] Filter group titles: 13px font, uppercase
- [ ] Checkbox spacing: 6px gap
- [ ] Overall spacing matches existing design

### Tablet (769px - 1024px)
- [ ] Filter sidebar hidden
- [ ] "Add Filter" button visible
- [ ] 3 products per row in grid
- [ ] All filter functionality works in drawer

### Mobile (< 700px)
- [ ] Filter sidebar hidden
- [ ] "Add Filter" button visible
- [ ] 2 products per row in grid
- [ ] Drawer width: 100% (max 400px)
- [ ] Touch targets large enough (44px min)

---

## Performance Testing

- [ ] REST API response time < 200ms (with caching)
- [ ] Page reload time < 1s
- [ ] No layout shift during filter load
- [ ] Smooth animations (60fps)
- [ ] No memory leaks on repeated filter changes

---

## Accessibility Testing

- [ ] Keyboard navigation works (Tab, Enter, Space)
- [ ] ARIA labels present on buttons
- [ ] Screen reader announces filter changes
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Touch targets adequate (44px minimum)

---

## Cross-Browser Testing

### Chrome (latest)
- [ ] All scenarios pass
- [ ] Console clean
- [ ] Visuals match design

### Safari (latest)
- [ ] All scenarios pass
- [ ] Console clean
- [ ] Back button works (Safari-specific issue)
- [ ] Animations smooth

### Firefox (latest)
- [ ] All scenarios pass
- [ ] Console clean
- [ ] Visuals match design

---

## Edge Cases & Error Handling

### Error Case 1: REST API Timeout
**When**: REST API request times out
**Then**:
- [ ] Graceful error handling
- [ ] Console warning logged
- [ ] Page remains functional
- [ ] No JavaScript crashes

### Error Case 2: Invalid Category ID
**When**: Category ID doesn't exist
**Then**:
- [ ] Graceful error handling
- [ ] No filters displayed
- [ ] Products display normally

### Error Case 3: Malformed URL Parameters
**When**: URL has invalid filter slugs
**Then**:
- [ ] Invalid filters ignored
- [ ] Valid filters still applied
- [ ] No console errors

### Error Case 4: Plugin Data Missing
**When**: Plugin active but returns no data
**Then**:
- [ ] No filters displayed
- [ ] No console errors
- [ ] Page remains functional

---

## Success Criteria

### Must Have (All Pass)
- ✅ Filters load dynamically from REST API
- ✅ URL parameters persist filter state
- ✅ Browser back/forward works correctly
- ✅ Apply/Clear button state management works
- ✅ Mobile drawer integration functional
- ✅ No console errors
- ✅ Visual match with existing design

### Should Have (At Least 80% Pass)
- ✅ Graceful degradation when plugin inactive
- ✅ Product counts display correctly
- ✅ Smooth accordion animations
- ✅ Cross-browser compatibility

### Could Have (Nice to Have)
- ⚪ Loading spinner during filter fetch
- ⚪ Skeleton loading states
- ⚪ Advanced analytics tracking

---

## Test Results Summary

**Date**: [Fill in testing date]
**Tester**: [Fill in tester name]
**Environment**: [Staging/Production]

| Scenario | Status | Notes |
|----------|--------|-------|
| Scenario 1 | ⬜ Pass/Fail | |
| Scenario 2 | ⬜ Pass/Fail | |
| Scenario 3 | ⬜ Pass/Fail | |
| Scenario 4 | ⬜ Pass/Fail | |
| Scenario 5 | ⬜ Pass/Fail | |
| Scenario 6 | ⬜ Pass/Fail | |
| Scenario 7 | ⬜ Pass/Fail | |
| Scenario 8 | ⬜ Pass/Fail | |
| Scenario 9 | ⬜ Pass/Fail | |
| Scenario 10 | ⬜ Pass/Fail | |
| Scenario 11 | ⬜ Pass/Fail | |
| Scenario 12 | ⬜ Pass/Fail | |
| Scenario 13 | ⬜ Pass/Fail | |

**Overall Status**: ⬜ Pass / Fail

**Blocking Issues**: [List any blocking issues found]

**Non-Blocking Issues**: [List any non-blocking issues found]

**Recommendations**: [Any recommendations for improvements]

---

**Document Version**: 1.0
**Last Updated**: 2026-04-16
**Author**: Claude AI Agent
