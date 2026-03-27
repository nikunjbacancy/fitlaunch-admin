# KMVMT Admin Portal — UI Guidelines

> **These are non-negotiable design rules.**
> Every component, modal, form, and page Claude creates or modifies must follow these exactly.
> Do not deviate without explicit instruction from the user.

---

## 1. Color Palette

The admin portal uses the **KMVMT brand palette** exclusively. All Tailwind utilities are available via the `kmvmt-*` color tokens defined in `src/index.css`.

### Brand Tokens

| Token      | Tailwind Class     | Hex       | Role                                                      |
| ---------- | ------------------ | --------- | --------------------------------------------------------- |
| Navy       | `kmvmt-navy`       | `#192640` | Primary text, headings, nav background, primary buttons   |
| Light Blue | `kmvmt-blue-light` | `#7CA3D1` | Accents, highlights, sidebar icons, nav active indicators |
| Red Dark   | `kmvmt-red-dark`   | `#911D29` | Destructive actions, error states, gradient start         |
| Red Light  | `kmvmt-red-light`  | `#D44D5C` | Destructive hover states, gradient end                    |
| Burgundy   | `kmvmt-burgundy`   | `#9A292C` | Secondary accent, suspended status badge                  |
| Background | `kmvmt-bg`         | `#F3F3F3` | Page background, table headers, muted surfaces            |
| White      | `kmvmt-white`      | `#FFFFFF` | Cards, modals, inputs, topbar                             |

### UI Role → Token Mapping

| UI Role                   | Class                                                                        |
| ------------------------- | ---------------------------------------------------------------------------- |
| Page background           | `bg-kmvmt-bg`                                                                |
| Card / modal background   | `bg-kmvmt-white`                                                             |
| Topbar background         | `bg-kmvmt-white`                                                             |
| Sidebar background        | `bg-kmvmt-navy`                                                              |
| Primary text / headings   | `text-kmvmt-navy`                                                            |
| Secondary / muted text    | `text-kmvmt-navy/60`                                                         |
| Hint / placeholder text   | `text-kmvmt-navy/40`                                                         |
| Input border              | `border-zinc-200`                                                            |
| Input focus ring          | `focus-visible:ring-kmvmt-navy`                                              |
| Primary button            | `bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80`                      |
| Destructive button        | `bg-kmvmt-red-dark text-white hover:bg-kmvmt-red-light`                      |
| Cancel / secondary button | `bg-kmvmt-white border border-zinc-300 text-kmvmt-navy hover:bg-kmvmt-bg`    |
| Table header background   | `bg-kmvmt-bg text-kmvmt-navy`                                                |
| Error surface             | `rounded-md border border-kmvmt-red-dark/20 bg-kmvmt-red-dark/5 px-3 py-2.5` |

### Gradient Rules

- **Blue gradient** (`#192640 → #7CA3D1`): Use for nav/header feature surfaces — `bg-gradient-to-r from-kmvmt-navy to-kmvmt-blue-light`
- **Red gradient** (`#911D29 → #D44D5C`): Destructive / alert surfaces only — `bg-gradient-to-r from-kmvmt-red-dark to-kmvmt-red-light`

**Never use:**

- Hardcoded hex colors in component code — use `kmvmt-*` Tailwind classes only.
- `bg-primary`, `bg-card`, `bg-background` CSS variables in new component code — they are theme-variable and cause transparency issues in this app's dark shell. Use explicit `bg-kmvmt-navy` / `bg-kmvmt-white` / `bg-kmvmt-bg` instead.
- Tailwind `blue-*`, `indigo-*`, `purple-*` for UI chrome. Those are reserved for **status badges only**.
- `bg-zinc-900`, `text-zinc-900` for primary actions — use `kmvmt-navy` tokens instead.

---

## 2. Typography Scale

| Use                          | Classes                                                             |
| ---------------------------- | ------------------------------------------------------------------- |
| Section micro-label          | `text-[11px] font-semibold uppercase tracking-widest text-zinc-400` |
| Form field label             | `text-xs font-medium text-zinc-700`                                 |
| Modal / dialog title         | `text-sm font-semibold text-zinc-900`                               |
| Modal subtitle / description | `text-xs text-zinc-500`                                             |
| Body / helper text           | `text-xs text-zinc-400`                                             |
| Large heading (page, step)   | `text-xl font-bold text-zinc-900`                                   |
| Table cell primary           | `text-sm font-medium text-zinc-900`                                 |
| Table cell secondary         | `text-xs text-zinc-500`                                             |

---

## 3. Form Inputs

All inputs must use this exact class set — no exceptions:

```tsx
className =
  'border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900'
```

### With a leading icon

Wrap in a `relative` div. Icon: `h-3.5 w-3.5 text-zinc-400 pointer-events-none absolute left-3 top-1/2 -translate-y-1/2`. Input gets `pl-8`.

```tsx
<div className="relative">
  <Mail className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
  <Input
    className="border-zinc-200 bg-white pl-8 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900"
    {...field}
  />
</div>
```

### Field labels

Always use `htmlFor`. Always `text-xs font-medium text-zinc-700`.

### Helper / hint text

`text-[11px] text-zinc-400` placed below the input, above `<FormMessage />`.

---

## 4. Buttons

| Variant                       | Classes                                                                   |
| ----------------------------- | ------------------------------------------------------------------------- |
| Primary (submit, CTA)         | `bg-kmvmt-navy text-white hover:bg-kmvmt-blue-light/80`                   |
| Destructive (delete, suspend) | `bg-kmvmt-red-dark text-white hover:bg-kmvmt-red-light`                   |
| Secondary / Cancel            | `bg-kmvmt-white border border-zinc-300 text-kmvmt-navy hover:bg-kmvmt-bg` |
| Ghost / destructive inline    | Use shadcn `variant="ghost"` or `variant="destructive"` — do not restyle  |

- Button text: `text-sm`
- Full-width pairs: both buttons get `flex-1` inside a `flex gap-2.5` footer
- Loading state: replace label text with `'Saving…'` / `'Creating…'` — no spinner inside button unless explicitly requested

---

## 5. Modals & Dialogs

```tsx
<DialogContent className="gap-0 overflow-hidden bg-kmvmt-white p-0 text-kmvmt-navy sm:max-w-lg [&>button]:hidden">
```

- Always `bg-kmvmt-white p-0 gap-0 overflow-hidden` — never rely on shadcn's default padding
- Always hide shadcn's built-in close button with `[&>button]:hidden` and render your own `X` icon button
- Header: `border-b border-zinc-200 px-6 py-5` — icon box + title + subtitle + close button
- Body: `px-6 py-5`
- Footer: `border-t border-zinc-200 bg-kmvmt-bg px-6 py-4` — Cancel + Submit pair

### Icon box in modal header

```tsx
<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-kmvmt-bg">
  <SomeIcon className="h-4 w-4 text-kmvmt-navy" />
</div>
```

### Sections inside a modal

Separate with `divide-y divide-zinc-100`. Each section has a micro-label at top:

```tsx
<p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">Section Name</p>
```

---

## 6. Cards & Surfaces

| Use case                              | Classes                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------- |
| Standard card                         | `rounded-xl border border-zinc-200 bg-white p-5`                              |
| Stat / summary card                   | `rounded-lg border border-zinc-200 bg-white px-4 py-3`                        |
| Dark highlight card (estimate, total) | `rounded-lg border border-zinc-900 bg-zinc-900 px-4 py-3` — white text inside |
| Muted / info surface                  | `rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3`                      |
| Error surface                         | `rounded-md border border-red-200 bg-red-50 px-3 py-2.5`                      |

---

## 7. Tables

- Table container: `rounded-md border border-zinc-200 overflow-hidden`
- `TableHead`: `text-xs font-semibold text-kmvmt-navy bg-kmvmt-bg`
- `TableCell` primary value: `text-sm font-medium text-kmvmt-navy`
- `TableCell` secondary value: `text-xs text-kmvmt-navy/60`
- Row hover: shadcn default is fine — do not override

---

## 8. Section / Page Layout

- Page background: let the shell handle it — components do not set page background
- `PageHeader` component: always use the shared `<PageHeader>` — never write custom `h1/p` pairs on pages
- Spacing between major sections: `space-y-6`
- Spacing inside a form section: `space-y-4`
- Max content width on setup/wizard pages: `max-w-3xl mx-auto`

---

## 9. Status Badges

Status and onboarding-step badges are the **only** place in the UI where non-zinc colors appear.
Use the pre-defined maps from `constants.ts`:

```ts
ONBOARDING_STEP_BADGE_CLASSES // invited=yellow, password_set=blue, active=green …
PLAN_BADGE_CLASSES // starter=slate, growth=blue, pro=purple …
```

Never invent new badge colors outside those maps.

---

## 10. Spacing & Sizing Cheatsheet

| Element                              | Value                    |
| ------------------------------------ | ------------------------ |
| Modal max-width (standard)           | `sm:max-w-lg`            |
| Modal max-width (wide / two-section) | `sm:max-w-xl`            |
| Input icon size                      | `h-3.5 w-3.5`            |
| Header icon box                      | `h-9 w-9`                |
| Button gap in footer                 | `gap-2.5`                |
| Section padding                      | `px-6 py-5`              |
| Footer padding                       | `px-6 py-4`              |
| Form field vertical gap              | `space-y-4`              |
| Grid gap (two columns)               | `grid grid-cols-2 gap-3` |

---

## 11. Copy / Text Strings

All user-visible text must live in a `constants.ts` (or `*.constants.ts`) file co-located with the feature. **Never hardcode strings directly in JSX.**

```ts
// ✅ Good — strings in constants.ts
export const TENANT_COPY = {
  ADD_COMPLEX_TITLE: 'Add New Complex',
  ADD_COMPLEX_SUBMIT: 'Create Complex',
  CANCEL_LABEL: 'Cancel',
} as const

// ❌ Bad — string hardcoded in JSX
<h2>Add New Complex</h2>
<Button>Create Complex</Button>
```

### Rules

- Every label, title, subtitle, button text, placeholder, hint, toast message, and empty-state message must be a named constant.
- Constants object must be typed `as const` so values are literal types.
- Name keys in `SCREAMING_SNAKE_CASE` grouped under a feature-prefixed object (e.g. `TENANT_COPY`, `SETUP_COPY`, `AUTH_COPY`).
- Dynamic parts (e.g. counts, names) use a placeholder token: `'Imported {n} units'` — replace at render time with `.replace('{n}', String(n))`.
- One `*_COPY` object per feature folder. Do not scatter constants across multiple files.

---

## 12. What Claude Must Never Do (UI-specific)

- Never use `bg-primary`, `bg-card`, `bg-background`, `bg-muted` in new component backgrounds — they are unreliable in this shell and cause transparency.
- Never use hardcoded color classes (`indigo-*`, `blue-*`, `purple-*`) for UI chrome — only for status badges.
- Never use `bg-zinc-900`, `text-zinc-900` as primary brand colors — use `bg-kmvmt-navy`, `text-kmvmt-navy` instead.
- Never apply a gradient background to a modal or card header.
- Never create a two-panel colored layout for a modal without explicit user request.
- Never use `inline-style` for colors (e.g. `style={{ backgroundColor: '#192640' }}`).
- Never ship a modal without an explicit `bg-kmvmt-white` on `DialogContent`.
- Never hardcode any user-visible string in JSX — every piece of copy must come from the feature's `constants.ts`.
- Never guess a design — if unsure about a pattern, use the closest example from these guidelines.
