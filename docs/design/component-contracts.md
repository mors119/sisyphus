# UI component and state contracts

This document defines behavior for Issue #3 and page work. It does not require
Issue #2 to build unused components.

## Ownership boundaries

### Reusable primitives

`apps/web/src/components/ui` owns low-level, business-neutral controls. A
shared primitive:

- does not call an API
- does not read a Zustand feature store
- does not contain word-expansion terminology
- exposes semantics, accessibility, state, and styling through props
- uses semantic tokens rather than feature literals

Existing shadcn primitives are extended instead of duplicated.

### Application composites

`apps/web/src/components/custom` currently owns reusable composed feedback and
icon controls such as Loader, EmptyState, ErrorState, and edit/delete buttons.
Issue #3 should consolidate or rename these only when an actual screen needs a
clear shared contract.

### Layout

`apps/web/src/features/layout` owns the authenticated application frame.
Future AppShell, PageLayout, PageHeader, and PageContent work extends this
location rather than introducing a parallel layout tree.

### Feature UI

`apps/web/src/features/*` owns business behavior and terminology. Components
such as WordInput, ExpansionProgress, GeneratedField, KnowledgePreview, and
CompletionPanel remain feature components and compose shared primitives.

A component moves to shared UI only after its reusable contract is clear.

## Expected shared contracts for Issue #3

Implement or refactor only what active screens require:

```text
AppShell, PageLayout, PageHeader, PageContent
Button, IconButton
TextInput, Textarea, Select, Checkbox
FormField, FieldError
Card, Badge, Divider, Tooltip, SectionHeader
Alert, ErrorNotice, EmptyState, LoadingState
ProgressStep, ProgressList
Dialog, Drawer, ResponsivePanel
```

No dependency should be added solely to obtain a simple primitive already
supported by shadcn, Radix, Tailwind, and CVA.

## Button hierarchy

Product roles remain intentionally small:

| Role | Use | Example |
| --- | --- | --- |
| primary | one dominant forward action | `확장하기`, `지식에 추가` |
| secondary | recovery or less prominent action | `다시 시도` |
| ghost | cancellation and quiet actions | `취소` |
| danger | destructive action | `삭제` |

The current shadcn variants may retain compatibility names while Issue #3 maps
them to these product roles.

Sizes:

| Size | Height | Use |
| --- | ---: | --- |
| small | `32px` | dense supporting actions |
| medium | `40px` | normal page and form actions |
| large | `48px` | central word-entry action |

Rules:

- a page or panel normally has one primary action
- loading and disabled states prevent duplicate submission
- loading copy preserves button width when practical
- icon-only buttons have an accessible name and a tooltip when the icon may be
  unfamiliar
- destructive actions require confirmation when they are not easily reversible
- action styling derives from `--sis`; danger remains a danger token

## Cards, panels, and dialogs

Do not wrap every section in a card.

A Card is an independent entity, selectable result, meaningful status unit, or
group that requires separation. Default treatment is `24px` padding, card
radius, standard border, and no shadow.

- static cards do not animate or elevate on hover
- interactive cards expose hover, focus, active, and selected states
- selection combines color with an icon, checkmark, label, or shape
- nested cards are avoided
- a Panel groups workspace controls or responsive side content
- a Dialog interrupts for a short decision; long mobile work becomes a sheet or
  full-screen panel

## Form composition

The canonical order is:

```text
Label
Optional description
Control
Field error or helper text
```

Rules:

- placeholders do not replace visible labels, except for a deliberately focused
  single-input experience with an equivalent accessible label
- required fields use one consistent visual and accessible indication
- field errors appear beside the affected control and are linked with
  `aria-describedby`
- server or page errors are not mislabeled as field validation
- user input survives recoverable failures
- Enter and button submission use the same validation path
- submitting blocks duplicate requests
- loading, disabled, read-only, success, warning, and error states remain
  visually and semantically distinct
- authentication and profile fields deliberately set `autocomplete`

On failed submission, focus moves to the first invalid field or an error
summary that links to each field.

## Async state

Ordinary asynchronous work uses:

```ts
type AsyncState = 'idle' | 'loading' | 'success' | 'error';
```

Multi-stage generation uses:

```ts
type StepState =
  | 'pending'
  | 'active'
  | 'completed'
  | 'failed'
  | 'skipped';
```

Each state has text or an icon in addition to color.

- use a spinner only when no meaningful stage is known
- use a skeleton when the final structure is known
- preserve layout between loading and content when practical
- do not block the full page when one section is loading
- expose reliable progress for multi-stage work
- partial failure offers retry, exclusion, or continuation when supported
- stale content is labeled or removed before a new success is shown
- optimistic UI is used only when rollback is clear

Meaningful status changes announce through a live region without repeatedly
interrupting the user.

## Feedback and errors

### Field error

Placed directly beneath or adjacent to its field. It identifies what is wrong
and how to correct it.

### Section error

Uses ErrorNotice inside the failed section and includes the relevant recovery
action.

### Page error

Uses a stable alert or page error state. It is not represented only by a toast.

### Toast

Supplemental confirmation only:

- saved successfully
- copied to clipboard
- background update completed

A toast is never the only presentation for authentication failure, destructive
failure, form validation, or content requiring recovery.

Error copy states:

1. what failed
2. whether user input or generated work was preserved
3. what the user can do next

Raw backend exceptions and stack traces are never shown.

## Empty, loading, and completion

An EmptyState contains a title, a short explanation, and one clear next action
when available. It never blames the user.

```text
아직 추가한 단어가 없습니다.
발견한 단어를 지식으로 확장해 보세요.
[첫 단어 추가]
```

A CompletionPanel confirms persistence and offers:

- `추가한 지식 보기`
- `새 단어 추가`

It does not leave the user on an ambiguous disabled form.

## Progress

ProgressStep and ProgressList expose:

- state icon and text
- current step using `aria-current="step"`
- concise failure or skipped reason
- retry/exclude action when supported

Progress is not represented by brand or status color alone.

## Navigation

- active navigation combines text weight, marker/icon, and semantic color
- mobile navigation is a sheet or drawer and restores focus to its trigger
- page titles and navigation labels use the same terminology
- breadcrumbs show hierarchy; they do not repeat the H1 as decoration
- edit and review back actions warn before discarding unsaved work
- closing a panel never silently discards work
- browser Back behaves predictably during staged knowledge creation
- word detail and OAuth callbacks support safe deep links
- feature completion does not move users to an unrelated route

## Dialogs and drawers

- opening moves focus to a meaningful heading or first field
- focus remains inside while modal
- Escape and close behavior are consistent
- closing restores focus to the trigger
- destructive confirmation names the affected item and consequence
- responsive conversion to a sheet preserves form and generation state
- unsaved work requires an explicit discard decision

## Authentication-specific states

Login and OAuth callback screens support:

```text
idle
submitting
redirecting
bootstrapping
authenticated
recoverable failure
```

Actions disable while pending. Failure remains visible in the narrow layout and
offers a safe retry. Credential material never appears in visible URLs, logs,
or UI copy.

## Review checklist

Before a shared component or page is complete:

- semantic token classes replace arbitrary color, radius, shadow, and duration
- keyboard operation and focus order work
- icon-only actions have accessible names
- field labels and errors are associated
- loading and errors preserve recoverable input
- important async changes are announced
- mobile touch targets and safe areas are usable
- reduced motion reaches the final state immediately
- selection and status do not rely on color alone
- one primary action is visually dominant
