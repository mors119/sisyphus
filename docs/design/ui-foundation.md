# Sisyphus Academy UI foundation

## Product direction

Sisyphus Academy is a calm, focused workspace where raw input becomes
structured knowledge. Every screen should feel:

- calm rather than decorative
- focused around one next action
- structured enough to make progress and state visible
- readable for long words, definitions, examples, and metadata
- progressive: input, generation, review, persistence, completion

Clarity has priority over gradients, glass effects, decorative motion, and
page-specific visual languages. Generated knowledge is reviewable before it is
persisted. Users must always understand whether work is idle, processing,
partially complete, failed, or saved.

## Existing architecture

This guide extends the current Tailwind v4 and shadcn architecture. It does not
create another design system.

| Responsibility | Existing location |
| --- | --- |
| Semantic CSS tokens and global behavior | `apps/web/src/styles/index.css` |
| Serialized token values required by APIs/native controls | `apps/web/src/styles/tokens.ts` |
| Reusable shadcn primitives | `apps/web/src/components/ui` |
| Existing application composites | `apps/web/src/components/custom` |
| Authenticated application frame | `apps/web/src/features/layout` |
| Feature UI and business language | `apps/web/src/features/*` |

Issue #3 should extend these locations. It must not introduce a parallel
`shared/ui` tree merely to match an example directory structure.

## Application layout contract

The current `Main.layout.tsx` is the AppShell equivalent. Future layout
refactoring should preserve this contract:

```text
AppShell
├── global navigation
└── PageLayout
    ├── PageHeader
    └── PageContent
```

### AppShell

- owns the application background and global navigation placement
- owns desktop collapse and mobile drawer transitions
- contains no feature API calls or feature-specific state
- preserves the current page when navigation opens or closes
- uses minimum height rather than fixed viewport height where mobile keyboards
  or browser resizing can change the visible area

### PageLayout

- owns page padding and the vertical gap between header and content
- uses `16px` horizontal padding on mobile, `24px` on tablet, and `32px` on
  laptop and larger screens
- uses `32px` between related sections and `48px` or `64px` between major
  regions
- does not let an individual page invent unrelated top spacing or horizontal
  gutters

### PageHeader

- normally contains one `h1`
- supports an optional description, breadcrumb, primary action, and secondary
  actions
- exposes at most one dominant primary action
- keeps the title and navigation label consistent

### PageContent

The content role, not the route, chooses the width:

| Role | Maximum width | Use |
| --- | ---: | --- |
| narrow | `640px` | authentication and compact forms |
| medium | `880px` | detail and settings |
| wide | `1200px` | lists, dashboards, knowledge workspace |
| full | `100%` | exceptional editing surfaces only |

The values are implemented as `--content-narrow`, `--content-medium`, and
`--content-wide`. Full-width surfaces still use the standard page gutters.

## Responsive behavior

The information hierarchy is stable across widths; desktop UI is not simply
scaled down.

| Range | Expected behavior |
| --- | --- |
| mobile, below `640px` | single reading column, mobile navigation sheet, full-width controls where useful |
| small tablet, `640–767px` | single column with wider gutters; short action groups may remain inline |
| large tablet, `768–1023px` | collapsible navigation; two-column regions stack when reading order matters |
| laptop, `1024–1439px` | navigation and controlled-width workspace may sit side by side |
| wide desktop, `1440px+` | content remains width-constrained; whitespace grows instead of line length |

Rules:

- ordinary content never requires horizontal scrolling
- side panels become drawers, sheets, or stacked sections before they crowd the
  primary content
- a drawer closing must not discard editing state
- sticky actions are allowed only when they do not obscure content
- bottom mobile actions account for `env(safe-area-inset-bottom)` and leave
  content visible
- touch targets are at least `44px × 44px`; dense desktop tables may use a
  `32px` visual control only when its interactive target remains at least
  `40px`
- dialogs become sheets or full-screen panels when their content cannot fit
  comfortably on mobile

## Token contract

All visual code consumes semantic roles. A feature must not add a competing
primary blue, accent yellow, arbitrary shadow, radius, or transition duration.

### Brand colors

The canonical source tokens are fixed:

```css
--sis: #1186ce;
--sisy: #ffcd49;
```

`--sis` provides navigation emphasis, focus rings, and the source for primary
actions. `--sisy` is a restrained highlight for selected markers, progress,
and small brand moments.

Filled action backgrounds use the darker, derived `--action-primary` token so
white text reaches WCAG AA. The canonical `--sis` against white is suitable for
non-text focus indicators and large emphasis, but its `3.94:1` contrast is not
enough for ordinary white-on-blue body text. `--sisy` uses
`--text-on-brand-accent` (`#111827`), which exceeds `11:1`.

Feature code uses:

- `brand-primary`, `brand-primary-hover`, `brand-primary-active`
- `brand-primary-subtle`, `brand-accent`, `brand-accent-subtle`
- `action-primary`, `action-primary-hover`, `action-primary-active`
- `on-brand-primary`, `on-brand-accent`, `focus-ring`

Brand colors never replace success, warning, danger, or information states.
Color is always paired with text, an icon, shape, or position for state and
selection.

### Semantic colors

| Role | Purpose |
| --- | --- |
| `background` | application canvas |
| `surface` | default content surface |
| `surface-muted` | quiet grouping and disabled backgrounds |
| `surface-raised` | popovers and transient overlays |
| `text-primary` | primary reading content |
| `text-secondary` | metadata and supporting copy |
| `border` / `input` | default separation and field boundaries |
| `focus-ring` | keyboard focus |
| `success` / `success-subtle` | completed or saved |
| `warning` / `warning-subtle` | attention or waiting |
| `danger` / `danger-subtle` | destructive and failed |
| `info` / `info-subtle` | neutral progress and links |

Borders are the default separation method. Shadows are reserved for raised,
interactive surfaces; static cards do not gain a heavy shadow.

### Spacing

The implemented scale is `4, 8, 12, 16, 24, 32, 48, 64px`.

| Relationship | Token intent |
| --- | --- |
| icon and label | `8px` |
| field internals | `12px` |
| related controls | `16px` |
| card content | `24px` |
| related sections | `32px` |
| major regions | `48px` or `64px` |

An exceptional value must solve a documented layout constraint and should not
be repeated across features.

### Typography

| Role | Size / line height |
| --- | --- |
| Display | `32 / 40` |
| H1 | `28 / 36` |
| H2 | `22 / 30` |
| H3 | `18 / 26` |
| Body | `16 / 24` |
| Small | `14 / 20` |
| Caption | `12 / 18` |

Use one H1 in a normal page. Card titles normally use H3. Metadata uses Small
or Caption. Weight, spacing, and semantic structure reinforce hierarchy; font
size is not the only signal. Text containers allow long English words to wrap
without clipping.

### Radius and elevation

Use role tokens: `control`, `card`, `panel`, `dialog`, and `pill`. Cards use a
border and no shadow by default. `shadow-raised` is limited to popovers,
dragged items, and interactive elevation.

### Motion

| Role | Duration |
| --- | ---: |
| fast | `140ms` |
| standard | `220ms` |
| slow | `320ms` |

Motion explains a panel transition, progress change, or loading-to-content
change. It must not delay an action or decorate inactivity. Global
`prefers-reduced-motion: reduce` handling removes meaningful animation and
transition duration while preserving final state.

## Accessibility baseline

All current and future screens meet these rules:

- every interactive control is keyboard reachable
- focus is visible and uses the shared focus-ring role
- semantic buttons, links, headings, lists, tables, and form elements are used
- icon-only controls have an accessible name; a tooltip alone is not a name
- a form label, description, control, and error are programmatically associated
- important async updates use an appropriate polite or assertive live region
- errors move focus to the summary or first invalid field when submission fails
- dialogs and drawers trap focus, focus a meaningful first element, and restore
  focus to their trigger
- completion focus moves to the confirmation heading or status
- text follows WCAG AA (`4.5:1` normal, `3:1` large); controls and focus
  indicators reach `3:1`
- status and selection never rely on color alone
- reduced-motion preferences are respected

Critical keyboard and screen-reader checks cover login, word input, expansion
progress, review editing, save completion, error recovery, and logout.

## Authentication

Authentication uses the narrow content role and the same tokens, Button,
feedback, and spacing contracts as the authenticated app. It does not create a
separate visual language.

- OAuth actions disable while pending to prevent duplicate login
- progress and failure remain visible without relying on a toast
- redirect context is preserved without placing credentials or tokens in a
  visible URL
- access and refresh tokens are never rendered as UI copy
- recoverable failures explain the next action

## Chrome extension alignment

The popup uses plain CSS and a constrained viewport, so it does not adopt web
layout primitives or shadcn components. It does align:

- `--sis` / `--sisy` brand sources
- primary action and highlight semantic aliases
- authentication, error, loading, and success terminology
- text-plus-icon status treatment

The legacy `--point-b` and `--point-y` names remain aliases while popup styles
are consolidated. Popup width, compact spacing, and the existing restrained
background treatment are allowed platform differences. A sidebar, desktop
page frame, or large dialog must not be forced into the popup.

## Visual verification

The repository has no screenshot or visual-regression service. Until one is
introduced by a dedicated issue, compare representative light and dark states
manually at mobile and desktop widths:

1. login and OAuth failure
2. home and authenticated navigation
3. populated and empty word/note list
4. detail and settings forms
5. extension authentication and error states

Confirm the same primary-blue/action and yellow-highlight hierarchy, visible
focus, readable foregrounds, text-plus-color statuses, and reduced-motion
behavior.
