# Filter Plugin Integration - Specification

**Feature**: Eternal Product Category Filter Plugin Integration
**Date**: 2026-04-16
**Status**: Draft
**Priority**: High

## Overview

Integrate the standalone Eternal Product Category Filter plugin with the WPRig theme to replace the static filter sidebar with dynamic, category-specific filters loaded from the REST API.

## Problem Statement

The current product listing page uses hardcoded static filter HTML in `filters-sidebar.php`. This requires:
- Manual code updates to add/remove filters
- No category-specific filtering logic
- Duplicate filter configurations across categories
- No dynamic product count updates

The Eternal Product Category Filter plugin solves these issues by providing:
- REST API endpoint for dynamic filter data
- Category-specific filter groups
- Product counts per filter option
- Centralized filter management

## Goals

### Functional Requirements
- [ ] Load filter data dynamically from REST API (`/wp-json/eternal-filters/v1/category/{id}/filters`)
- [ ] Display category-specific filters (different filters per category)
- [ ] **Smart Apply/Clear button** with dual-state management
- [ ] Persist filter selections in URL parameters (`?eternal_filter=slug1,slug2`)
- [ ] Update product grid on filter application via page reload
- [ ] Maintain existing visual design and styling
- [ ] Provide fallback to static filters if plugin is inactive
- [ ] Support browser back/forward navigation with filter state
- [ ] Integrate with existing mobile filter drawer

### Non-Functional Requirements
- [ ] Preserve existing filter UI design (accordions, spacing, colors)
- [ ] Maintain responsive behavior on mobile/tablet/desktop
- [ ] Ensure accessibility (keyboard navigation, ARIA labels)
- [ ] No console errors
- [ ] Graceful degradation when plugin inactive

## Architecture

### Data Flow

```
User visits category page
    ↓
Theme checks for plugin + filter data
    ↓
If plugin active: Fetch from REST API
    ↓
Render dynamic filters (existing UI classes)
    ↓
Check URL for active filters → Set button state
    ↓
┌───────────────────────────────────┐
│ URL has filters?                  │
├───────────────────────────────────┤
│ YES → Button = "Clear" (enabled)  │
│      Checkboxes match URL         │
│                                    │
│ NO  → Button = "Apply" (disabled) │
│      All checkboxes unchecked     │
└───────────────────────────────────┘
    ↓
User checks/unchecks filter option
    ↓
Button state updates (Apply = enabled if selections exist)
    ↓
User clicks "Apply" button
    ↓
Update URL params → Page reload
    ↓
WooCommerce query updated via plugin hook
    ↓
Filtered products displayed
    ↓
Button = "Clear" (enabled)
    ↓
User clicks "Clear" button
    ↓
Remove URL params → Page reload
    ↓
All products displayed
    ↓
Button = "Apply" (disabled)
```

### Filter Button State Management

**Button Behavior**: Single button that toggles between "Apply" and "Clear" based on filter state

#### State Definitions

1. **Initial State (No Active Filters)**
   - Button text: "Apply" (or "Apply Filters")
   - Button state: Disabled (no filters selected yet)
   - Button appearance: Grayed out / Muted

2. **Selection State (Filters Selected, Not Applied)**
   - Button text: "Apply"
   - Button state: Active / Enabled
   - Button appearance: Primary color, clickable
   - Trigger: User checks one or more filter checkboxes

3. **Active State (Filters Applied)**
   - Button text: "Clear"
   - Button state: Active / Enabled
   - Button appearance: Primary color, clickable
   - URL contains: `?eternal_filter=slug1,slug2`
   - Checkboxes: Match URL state (selected filters checked)

4. **Clear Action (Reset)**
   - Button text: "Apply" (reverts to Initial State)
   - Button state: Disabled
   - URL: Filter params removed
   - Checkboxes: All unchecked
   - Page: Reloads with all products

#### State Transition Flow

```
Page Load
    ↓
Check URL for eternal_filter param
    ↓
┌─────────────────────────────┐
│ URL has filters?            │
├─────────────────────────────┤
│ YES → Button = "Clear"      │ → Active State
│      Checkboxes = Checked   │
│                             │
│ NO  → Button = "Apply"      │ → Initial State
│      Checkboxes = Unchecked │
└─────────────────────────────┘
    ↓
User checks/unchecks filter
    ↓
┌─────────────────────────────┐
│ Any filters selected?       │
├─────────────────────────────┤
│ YES → Button = "Apply"      │ → Selection State (enabled)
│                             │
│ NO  → Button = "Apply"      │ → Initial State (disabled)
└─────────────────────────────┘
    ↓
User clicks button
    ↓
┌─────────────────────────────┐
│ Current button state?       │
├─────────────────────────────┤
│ "Apply" → Update URL        │ → Reload page
│           → Navigate to     │ → Active State
│           filtered view     │
│                             │
│ "Clear" → Remove URL params │ → Reload page
│           → Navigate to     │ → Initial State
│           unfiltered view   │
└─────────────────────────────┘
```

#### Button State Logic

```typescript
interface FilterButtonState {
    text: 'Apply' | 'Clear';
    disabled: boolean;
    selectedFilters: string[];
    appliedFilters: string[];
}

class FilterButtonManager {
    private state: FilterButtonState;

    constructor() {
        this.state = {
            text: 'Apply',
            disabled: true,
            selectedFilters: [],
            appliedFilters: []
        };
    }

    // Determine initial state from URL
    initializeFromURL(): void {
        const urlParams = new URLSearchParams(window.location.search);
        const appliedFilters = urlParams.get('eternal_filter');

        if (appliedFilters) {
            // Active State: filters already applied
            this.state = {
                text: 'Clear',
                disabled: false,
                selectedFilters: appliedFilters.split(','),
                appliedFilters: appliedFilters.split(',')
            };
        } else {
            // Initial State: no filters
            this.state = {
                text: 'Apply',
                disabled: true,
                selectedFilters: [],
                appliedFilters: []
            };
        }

        this.updateButton();
    }

    // User checked/unchecked a filter
    onFilterChange(filterSlug: string, isChecked: boolean): void {
        if (isChecked) {
            this.state.selectedFilters.push(filterSlug);
        } else {
            this.state.selectedFilters = this.state.selectedFilters.filter(
                f => f !== filterSlug
            );
        }

        // Update button state
        if (this.state.selectedFilters.length > 0) {
            this.state.text = 'Apply';
            this.state.disabled = false;
        } else {
            // No filters selected, but if there are applied filters,
            // button should be "Clear"
            if (this.state.appliedFilters.length > 0) {
                this.state.text = 'Clear';
                this.state.disabled = false;
            } else {
                this.state.text = 'Apply';
                this.state.disabled = true;
            }
        }

        this.updateButton();
    }

    // User clicked the button
    onButtonClick(): void {
        if (this.state.text === 'Apply') {
            this.applyFilters();
        } else {
            this.clearFilters();
        }
    }

    private applyFilters(): void {
        // Update URL and reload
        const url = new URL(window.location.href);
        url.searchParams.set('eternal_filter', this.state.selectedFilters.join(','));
        window.location.href = url.toString();
    }

    private clearFilters(): void {
        // Remove URL params and reload
        const url = new URL(window.location.href);
        url.searchParams.delete('eternal_filter');
        window.location.href = url.toString();
    }

    private updateButton(): void {
        const button = document.querySelector('[data-filter-action-button]');
        if (!button) return;

        button.textContent = this.state.text;
        button.disabled = this.state.disabled;

        // Toggle visual state
        if (this.state.disabled) {
            button.classList.add('is-disabled');
            button.classList.remove('is-active');
        } else {
            button.classList.remove('is-disabled');
            button.classList.add('is-active');
        }
    }
}
```

#### Button HTML Structure

```html
<div class="plp-filters__actions">
    <button type="button" 
            class="plp-filters__action-btn"
            data-filter-action-button
            disabled>
        Apply
    </button>
</div>
```

#### Button CSS States

```css
.plp-filters__action-btn {
    /* Base styles */
    padding: 10px 20px;
    font-family: "Maison Neue", sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: 0.5px solid #021f1d;
    background: transparent;
    color: #021f1d;
    cursor: pointer;
    transition: all 0.2s ease;
}

.plp-filters__action-btn.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #f5f5f5;
    color: #868686;
    border-color: #868686;
}

.plp-filters__action-btn.is-active {
    background: #021f1d;
    color: #fff;
    border-color: #021f1d;
}

.plp-filters__action-btn.is-active:hover {
    background: #033335;
    border-color: #033335;
}

.plp-filters__action-btn.is-active:active {
    transform: scale(0.98);
}
```

---

### Components

#### 1. Template Layer (`filters-sidebar.php`)
**Responsibility**: Check plugin availability and render appropriate filters

```php
// Pseudo-code
if (plugin_active && category_has_filters) {
    // Render dynamic filters container
    // JavaScript will fetch and populate
} else {
    // Fallback to static HTML (removed per user request)
}
```

#### 2. JavaScript Layer (`product-listing.ts`)
**Responsibility**: Fetch filters, render UI, handle interactions, manage button state

```typescript
// Pseudo-code
class FilterManager {
    detectPlugin() // Check if plugin active
    fetchFilters() // GET /wp-json/eternal-filters/v1/category/{id}/filters
    renderFilters() // Create DOM elements with existing classes
    handleFilterChange() // Update button state (no URL update yet)
    onButtonClick() // Apply or Clear based on current state
    restoreFromURL() // Check URL params on load, set button state
}

class FilterButtonManager {
    initializeFromURL() // Set initial button state
    onFilterChange() // Update button when checkboxes change
    onButtonClick() // Handle Apply or Clear action
    applyFilters() // Update URL and reload
    clearFilters() // Remove URL params and reload
    updateButton() // Update button text and visual state
}
```

#### 3. Component Layer (`Component.php`)
**Responsibility**: Localize plugin data for JavaScript

```php
// Pseudo-code
wp_localize_script('wprig-product-listing', 'eternalFiltersData', [
    'endpoint' => rest_url('eternal-filters/v1/category/'),
    'categoryId' => get_queried_object_id()
]);
```

## Technical Specifications

### File Modifications

#### 1. `template-parts/product-listing/filters-sidebar.php`

**Current State**: Static HTML with hardcoded filter groups

**Changes**:
- Remove static filter HTML
- Add plugin detection logic
- Render empty container for dynamic filters
- (Optional) Keep fallback for plugin inactive

**Expected Output**:
```html
<div class="plp-filters" id="dynamic-filters-container">
    <!-- Filters will be populated by JavaScript -->
</div>
```

#### 2. `assets/js/src/product-listing.ts`

**Current State**: Static filter handling

**Changes**:
- Add plugin detection
- Implement REST API fetch
- Add dynamic filter rendering
- Implement URL parameter management
- Add browser history handling

**Key Functions**:
```typescript
detectPlugin(): boolean
fetchFilters(categoryId: number): Promise<FilterData>
renderFilters(filterGroups: FilterGroup[]): void
handleFilterChange(selectedFilters: string[]): void
updateURLParams(filters: string[]): void
restoreFromURL(): void
```

#### 3. `inc/Product_Listing/Component.php`

**Current State**: Basic component initialization

**Changes**:
- Add plugin data localization
- Add body class when plugin active
- Enqueue scripts only on product category pages

### Data Structures

#### REST API Response Format
```typescript
interface FilterGroup {
    group_id: string;
    group_name: string;
    slug: string;
    options: FilterOption[];
}

interface FilterOption {
    option_id: string;
    name: string;
    slug: string;
    count: number;
}

interface FilterResponse {
    category_id: number;
    filter_groups: FilterGroup[];
}
```

### CSS Classes (Existing - Preserve)

The plugin output must use these existing theme classes:
- `.plp-filters` - Main container
- `.plp-filters__group` - Filter group
- `.plp-filters__group-title` - Group header
- `.plp-filters__checkbox` - Checkbox label
- `.plp-filters__checkbox--checked` - Selected state

### URL Parameter Format

```
?eternal_filter=face-creme,dry-skin
```

Multiple filters: comma-separated values

## Implementation Plan

### Phase 1: Template Integration
1. Update `filters-sidebar.php` to remove static HTML
2. Add plugin detection logic
3. Render container for dynamic filters

### Phase 2: Component Integration
1. Update `Component.php` to localize plugin data
2. Add body class for CSS targeting
3. Conditionally enqueue scripts

### Phase 3: JavaScript Integration
1. Add plugin detection logic
2. Implement REST API fetch
3. Render filters with existing classes
4. Implement filter change handlers
5. Add URL parameter management
6. Add browser history handling

### Phase 4: Mobile Integration
1. Integrate with existing mobile drawer
2. Ensure filters load in drawer on mobile
3. Test mobile responsive behavior

## Testing Strategy

### Test Scenarios

#### Scenario 1: Initial Page Load (No Filters)
**Given**: Plugin active, Skincare category has 3 filter groups
**When**: User visits Skincare category page
**Then**:
- Filters load dynamically from REST API
- 3 filter groups display: "Product Types", "Skin Type", "Benefits"
- Each option shows product count
- Button displays "Apply" (disabled, grayed out)
- All checkboxes unchecked
- Accordion functionality works
- Visual design matches existing theme

#### Scenario 2: Select Filter (Button Enables)
**Given**: User on Skincare category page, button = "Apply" (disabled)
**When**: User checks "Face Creme" option
**Then**:
- Button changes to "Apply" (enabled, active state)
- Button becomes clickable with primary color
- Checkbox shows checked state
- URL unchanged (no update yet)
- Products unchanged

#### Scenario 3: Apply Filter
**Given**: User has selected "Face Creme", button = "Apply" (enabled)
**When**: User clicks "Apply" button
**Then**:
- URL updates to `?eternal_filter=face-creme`
- Page reloads
- Products filtered by plugin's WooCommerce query hook
- "Face Creme" checkbox remains checked
- Button changes to "Clear" (enabled)
- Product count updates

#### Scenario 4: Clear Filter
**Given**: User has applied "Face Creme" filter, button = "Clear" (enabled)
**When**: User clicks "Clear" button
**Then**:
- URL removes `eternal_filter` parameter
- Page reloads
- All products display (unfiltered)
- All checkboxes unchecked
- Button changes to "Apply" (disabled)
- Product count resets to total

#### Scenario 5: Multiple Filters Selection
**Given**: User on Skincare category page
**When**: User checks "Face Creme" + "Dry Skin"
**Then**:
- Button displays "Apply" (enabled)
- Both checkboxes show checked state
- URL unchanged (waiting for apply)

#### Scenario 6: Multiple Filters Applied
**Given**: User has selected "Face Creme" + "Dry Skin", button = "Apply" (enabled)
**When**: User clicks "Apply" button
**Then**:
- URL updates to `?eternal_filter=face-creme,dry-skin`
- Products filtered by both selections
- Both checkboxes remain checked
- Button changes to "Clear" (enabled)

#### Scenario 7: Page Load with Active Filters (URL has params)
**Given**: User visits URL with `?eternal_filter=face-creme,dry-skin`
**When**: Page loads
**Then**:
- Filters load from REST API
- "Face Creme" and "Dry Skin" checkboxes pre-checked
- Button displays "Clear" (enabled)
- Products show filtered results
- Visual state matches URL parameters

#### Scenario 8: Browser Back Button (State Restoration)
**Given**: User has applied filters (button = "Clear")
**When**: User clicks browser back button
**Then**:
- URL updates to previous state
- Page reloads with previous filter state
- Button state matches URL (Apply/Clear)
- Checkboxes match URL state
- Products update accordingly

#### Scenario 9: Uncheck All Selected Filters
**Given**: User has "Face Creme" selected, button = "Apply" (enabled)
**When**: User unchecks "Face Creme"
**Then**:
- If URL has active filters: Button = "Clear" (enabled)
- If URL has no active filters: Button = "Apply" (disabled)
- Checkbox unchecked
- URL unchanged

#### Scenario 10: Plugin Inactive
**Given**: Plugin deactivated
**When**: User visits category page
**Then**:
- Page loads without errors
- No filter container displays
- No button displays
- Products display normally

#### Scenario 11: Mobile Filter Drawer
**Given**: User on mobile device
**When**: User taps "Add Filter" button
**Then**:
- Drawer opens from right
- Dynamic filters load in drawer
- Apply/Clear button displays in drawer
- Filter selection works
- Apply button updates URL and closes drawer
- Clear button resets filters and closes drawer

### Test Categories
- **Skincare**: Product Types, Skin Type, Benefits (3 groups)
- **Nutraceuticals**: Formulations For, Product Format (2 groups)

## Dependencies

### External Dependencies
- Eternal Product Category Filter plugin (v1.0.0+)
- WooCommerce (7.0+)
- WordPress (6.0+)

### Internal Dependencies
- Existing filter CSS in `_product-listing.css`
- Existing mobile drawer UI
- `wp_rig()->get_product_meta()` helper

## Risks & Mitigations

### Risk 1: REST API Unavailable
**Mitigation**: Graceful fallback to no filters display, console warning

### Risk 2: Visual Regression
**Mitigation**: Use existing CSS classes, visual QA testing

### Risk 3: Mobile Drawer Conflicts
**Mitigation**: Test on actual devices, check z-index stacking

### Risk 4: URL Parameter Conflicts
**Mitigation**: Use unique parameter name `eternal_filter`

## Rollout Plan

### Pre-Deployment
1. Test on staging environment
2. Visual QA against Figma design
3. Cross-browser testing (Chrome, Safari, Firefox)
4. Mobile device testing (iOS, Android)

### Deployment Steps
1. Deploy theme changes
2. Verify plugin active
3. Test on Skincare category
4. Monitor browser console for errors

### Post-Deployment
1. Monitor filter usage analytics
2. Check for JavaScript errors
3. Verify mobile functionality

## Success Criteria

### Must Have
- ✅ Filters load dynamically from REST API
- ✅ URL parameters persist filter state
- ✅ Browser back/forward works
- ✅ Mobile drawer integration functional
- ✅ No console errors
- ✅ Visual match with existing design

### Should Have
- ✅ Graceful degradation when plugin inactive
- ✅ Product counts display correctly
- ✅ Smooth accordion animations

### Could Have
- AJAX product grid updates (future enhancement)
- Filter search functionality
- Recently used filters

## Open Questions

**All questions answered. Decisions documented:**

### Resolved Questions

1. ✅ **Fallback Behavior**: Hide filters entirely when plugin inactive (no message)

2. ✅ **Loading State**: No loading spinner (fetch is fast enough with caching)

3. ✅ **Empty State**: Hide filter sidebar if no filter groups returned

4. ✅ **Filter Application**: Use Apply/Clear button pattern (not immediate URL update)

5. ✅ **Button State**: Single button toggles between "Apply" and "Clear" based on state

### Design Decisions

**Button Behavior**:
- Initial state: "Apply" (disabled, no filters selected)
- Selection state: "Apply" (enabled, filters selected but not applied)
- Active state: "Clear" (enabled, filters applied and showing in results)
- Clear action: Removes URL params, reloads page, resets to initial state

**User Experience**:
- Prevents accidental page reloads on every checkbox change
- Clear visual feedback for filter state
- Single button reduces UI clutter
- Matches e-commerce best practices (Amazon, Shopify patterns)

## References

- **Plugin Documentation**: `/Users/wingsdino/Studio/eternal/wp-content/plugins/eternal-product-category-filter/README.md`
- **Integration Plan**: `/Users/wingsdino/Studio/eternal/wp-content/themes/wprig/assets/docs/THEME-INTEGRATION-PLAN.md`
- **Figma Design**: [Link to Figma file]
- **REST API Endpoint**: `/wp-json/eternal-filters/v1/category/{id}/filters`

## Appendix: Code Snippets

### Plugin Detection (PHP)
```php
function has_eternal_filters() {
    return class_exists('Eternal_Product_Category_Filter')
        && function_exists('rest_url');
}
```

### Plugin Detection (TypeScript)
```typescript
detectPlugin(): boolean {
    return typeof window.eternalFiltersData !== 'undefined';
}
```

### URL Parameter Update
```typescript
updateURLParams(filters: string[]): void {
    const url = new URL(window.location.href);
    if (filters.length > 0) {
        url.searchParams.set('eternal_filter', filters.join(','));
    } else {
        url.searchParams.delete('eternal_filter');
    }
    window.history.pushState({}, '', url.toString());
    window.location.reload();
}
```

---

**Document Version**: 1.0
**Last Updated**: 2026-04-16
**Author**: Claude AI Agent
**Reviewers**: [To be assigned]
**Approval Status**: Pending
