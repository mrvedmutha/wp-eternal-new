# Legal Page Block - Specification

## Mission Statement
Create a Gutenberg block that enables content editors to build and maintain legal/informational pages (Accessibility Statement, Shipping Policy, Privacy Policy, Terms of Service, etc.) with a consistent design pattern matching Figma specifications.

## Design Compliance

### Figma References
- File Key: `aJ4VjKdFNahXA6Ly4jkRtJ`
- Hero Section: `694:3524`, `694:3325`
- Content Section: `694:3528`, `694:3329`

### Design Tokens (from PDP Design System memory)
- **Primary color:** `#021f1d`
- **Secondary / muted:** `#868686` (and `#8c8782`, `#dcd7cd` for dividers)
- **Fonts:**
  - Cormorant Garamond (Light, Regular, Medium) — display headings
  - Maison Neue (Book, Bold) — body and UI text
- **Spacing:** 80px vertical padding on sections
- **Max-width content:** 760px

### Typography Scale
- Hero label: 15px, Maison Neue Book, tracking 0.15px
- Hero heading: 52px, Cormorant Garamond Light, tracking -1px, leading 58px
- Hero date: 15px, Maison Neue Book
- Content section heading: 32px, Cormorant Garamond Regular, leading 40px
- Subsection heading: 24px, Cormorant Garamond Medium, leading 31px
- Body text: 15px, Maison Neue Book, leading 23px, tracking 0.15px

### Layout Pattern
- **Hero:** Centered, 80px top/bottom padding
- **Content:** Centered with 760px max-width, white background
- **Subsection structure:**
  1. Subsection heading (24px Cormorant Medium)
  2. Divider line (0.5px, `#8c8782` or `#dcd7cd`)
  3. Content (paragraphs, lists, inline formatting)
  4. 32px bottom margin

## Architectural Fit

### WP Rig Components
- **New Block:** `assets/blocks/legal-page-content/`
- **Block Type:** Dynamic (server-rendered for security and consistent markup)
- **Category:** `widgets` (or consider `wprig-content` if exists)

### File Structure
```
assets/blocks/legal-page-content/
├── block.json           # Metadata + attributes
├── src/
│   ├── index.js        # Block registration
│   └── edit.js         # Editor UI (React component)
├── render.php          # Server-side rendering
├── style.css           # Frontend styles
└── editor.css          # Editor-only styles
```

### Hooks & Filters
- **Block registration:** Handled automatically by `inc/Blocks/Component.php`
- **Style loading:** Handled by build system via `block.json`

## User Stories

### As a content editor, I want to:
- Add a legal page to any page with a single block
- Edit the hero section (label, heading, last updated date) inline
- Add, remove, and reorder content subsections freely
- Use native Gutenberg blocks (headings, paragraphs, lists, links) within the content area
- Maintain consistent styling without manual CSS classes

### As a developer, I want to:
- Reuse the same block across multiple legal pages
- Ensure the design matches Figma specifications exactly
- Maintain the block within WP Rig's build system
- Keep the content editor-friendly (no HTML/CSS knowledge needed)

### As a site visitor, I want to:
- Read legal content with consistent, accessible formatting
- Navigate structured content easily with clear visual hierarchy

## Success Metrics
- ✅ Block appears in Gutenberg inserter under "Widgets" category
- ✅ Hero section attributes are editable in sidebar/inspector
- ✅ InnerBlocks content area accepts headings (H2, H3), paragraphs, lists, links, and inline formatting
- ✅ Frontend output matches Figma design (visual regression test passes)
- ✅ Block passes accessibility audit (contrast, semantic headings, ARIA labels)
- ✅ Editor preview accurately represents frontend output
- ✅ Multiple pages can use the same block with different content

## Technical Plan (The Contract)

### Phase 1: Scaffolding
```bash
# Create the block with dynamic rendering
npm run block:new -- legal-page-content --title="Legal Page Content" --dynamic
```

### Phase 2: Implementation Steps

#### Step 1: Define Block Attributes (`block.json`)
```json
{
  "attributes": {
    "heroLabel": {
      "type": "string",
      "default": "LEGAL"
    },
    "heroHeading": {
      "type": "string",
      "default": "Page Title"
    },
    "heroLastUpdated": {
      "type": "string",
      "default": ""
    }
  }
}
```

#### Step 2: Build Editor UI (`src/edit.js`)
- Panel/Inspector controls for hero attributes
- Live preview of hero section
- InnerBlocks wrapper with allowed blocks:
  - `core/heading` (H2, H3)
  - `core/paragraph`
  - `core/list`
  - `core/buttons` (for contact links)
- Template lock: `contentOnly` or `insert` (free content addition)

#### Step 3: Server Rendering (`render.php`)
- Output hero section with proper markup
- Output InnerBlocks content with wrapper div
- Apply proper escaping and allowed HTML
- Use `wp_rig()->block_wrapper_attributes()` for consistent class naming

#### Step 4: Styling (`style.css`, `editor.css`)
- Implement hero section styles (centered, spacing, typography)
- Implement content wrapper (760px max-width, padding)
- Implement subsection pattern (heading + divider + spacing)
- Ensure editor preview matches frontend

### Phase 3: Verification

#### Testing Commands
```bash
# Build the block
npm run build

# Start dev server for live testing
npm run dev

# E2E test (if applicable)
npm run test:e2e -- legal-page-block
```

#### Manual Testing Checklist
- [ ] Block inserts into page editor
- [ ] Hero attributes save and restore correctly
- [ ] InnerBlocks accept and render core blocks
- [ ] Frontend output matches Figma design
- [ ] Responsive behavior (mobile breakpoint)
- [ ] Accessibility: heading hierarchy, color contrast, ARIA
- [ ] Multiple pages can use the block independently

## Design Questions for Implementation

1. **Template Lock Strategy:** Should we use `contentOnly` (removes wrapper, encourages subsection pattern via default template) or `insert` (allows adding blocks freely but loses structural guidance)?

2. **Default InnerBlocks Template:** Should we provide a default template (e.g., one subsection pre-populated) or start blank?

3. **Company Info Block:** The Accessibility Statement has an optional company info section above the main content heading. Should this be:
   - A separate block attribute
   - Part of the InnerBlocks content (editor adds manually)
   - A separate optional block variant

4. **Divider Color Variation:** The Figma shows two divider colors (`#8c8782` and `#dcd7cd`). Should this be:
   - A block setting (dropdown choice)
   - Automatically determined by context
   - Fixed to one color
