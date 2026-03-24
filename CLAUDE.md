# FitLaunch Admin Portal — CLAUDE.md

## Project Context

This is the **FitLaunch Admin Portal** — a React.js SPA for the FitLaunch white-label fitness platform.

- **Mobile app** and **API backend** are in separate repos (already built).
- This repo builds the web admin portal only, hosted on AWS S3 + CloudFront.
- The portal serves three distinct roles: **Super Admin**, **Property Manager**, and **Trainer**.
- All features branch on `tenant_type` ('apartment' | 'trainer') from the JWT payload.

## Tech Stack

| Layer            | Technology                                     |
| ---------------- | ---------------------------------------------- |
| Framework        | React.js (Vite)                                |
| Language         | TypeScript (strict mode)                       |
| Routing          | React Router v6                                |
| State Management | Zustand (global) + React Query (server state)  |
| HTTP Client      | Axios (centralized instance with interceptors) |
| Charts           | Recharts                                       |
| Forms            | React Hook Form + Zod                          |
| Styling          | Tailwind CSS                                   |
| UI Components    | shadcn/ui                                      |
| Payments         | Stripe.js                                      |
| Email            | SendGrid (via API)                             |
| Linting          | ESLint + Prettier                              |
| Testing          | Vitest + React Testing Library                 |
| CI/CD            | GitHub Actions → AWS S3 + CloudFront           |

---

## Mandatory Code Quality Standards

These rules are **non-negotiable** and must be followed before every implementation.

### 1. TypeScript — Strict Mode Always

- `strict: true` in `tsconfig.json` — no exceptions.
- **Never use `any`**. Use `unknown` and narrow the type, or define a proper interface.
- Every API response must have a typed interface in `src/types/`.
- Every component prop must be explicitly typed (no implicit prop types).
- Enums for all fixed-value sets (roles, statuses, tenant types).

```ts
// ❌ Bad
const handleData = (data: any) => { ... }

// ✅ Good
const handleData = (data: TenantListResponse) => { ... }
```

### 2. No Direct API Calls in Components

All API calls must go through `src/services/`. Components call hooks, hooks call services.

```
Component → Custom Hook (useXxx) → Service (xxxService.ts) → Axios instance
```

```ts
// ❌ Bad — axios directly in component
const { data } = await axios.get('/api/v1/tenants')

// ✅ Good — via service
const tenants = await tenantService.getAll()
```

### 3. Centralized Axios Instance — No Raw axios Anywhere

Only one Axios instance exists: `src/lib/axios.ts`.

- JWT access token attached via request interceptor.
- 401 → token refresh → retry original request via response interceptor.
- All error normalization happens in the interceptor, not in components.
- Never import `axios` directly outside of `src/lib/axios.ts`.

### 4. Role-Based Access — Never Check Roles in JSX

Role checking must be centralized in route guards and dedicated hooks. Never write
`if (user.role === 'super_admin')` inside JSX render logic.

```ts
// ❌ Bad
{user.role === 'super_admin' && <SuspendButton />}

// ✅ Good
const { can } = usePermissions()
{can('suspend_tenant') && <SuspendButton />}
```

Permissions map lives in `src/lib/permissions.ts`. One place, one truth.

### 5. Every Async UI Must Handle Three States

Every component that fetches data must explicitly handle:

1. **Loading** — skeleton or spinner
2. **Error** — error message with retry option
3. **Empty** — empty state with helpful message

No component may render `undefined` or crash silently.

### 6. Environment Variables — Never Hardcode

All URLs, keys, and config values come from `.env`. Never hardcode in source.

```ts
// ❌ Bad
const API_URL = 'https://api.fitlaunch.com/api/v1'

// ✅ Good
const API_URL = import.meta.env.VITE_API_BASE_URL
```

- `.env.example` must be kept up to date with all required keys.
- Never commit `.env`, `.env.local`, `.env.production`.
- Prefix all Vite env vars with `VITE_`.

### 7. Form Validation — Always Zod + React Hook Form

Every form must use React Hook Form with a Zod schema. No manual validation logic.

```ts
const schema = z.object({
  email: z.string().email('Invalid email'),
  plan: z.enum(['starter', 'growth', 'pro']),
})
```

### 8. No console.log in Production Code

Use a centralized logger utility (`src/lib/logger.ts`) that suppresses output in production.
ESLint rule `no-console` is set to `error`. Pre-commit hook will block commits with `console.log`.

### 9. Component Size Limit — Max 200 Lines

If a component exceeds 200 lines, it must be split. Extract:

- Sub-components to the same feature folder
- Logic to a custom hook (`useXxx.ts`)
- Constants to a `constants.ts` file

### 10. Folder-by-Feature Structure — No Flat Components Folder

```
src/
├── features/
│   ├── super-admin/
│   │   ├── tenants/
│   │   │   ├── TenantList.tsx
│   │   │   ├── TenantDetail.tsx
│   │   │   ├── useTenants.ts
│   │   │   ├── tenantService.ts
│   │   │   └── tenant.types.ts
│   │   ├── analytics/
│   │   ├── billing/
│   │   ├── feature-flags/
│   │   └── support/
│   ├── property-manager/
│   └── trainer/
├── components/        # Shared, reusable UI components only
├── layouts/           # Page layout wrappers
├── lib/               # axios, permissions, logger, queryClient
├── hooks/             # Global shared hooks only
├── types/             # Global shared TypeScript types
├── routes/            # Route definitions + guards
├── store/             # Zustand stores
└── pages/             # Top-level page components (thin — just compose features)
```

### 11. Named Exports Only — No Default Exports (except pages)

```ts
// ❌ Bad
export default function TenantList() { ... }

// ✅ Good
export function TenantList() { ... }
```

Exception: page-level components (in `src/pages/`) may use default exports for lazy loading.

### 12. No Magic Numbers or Strings

All constants must be named and placed in a `constants.ts` file.

```ts
// ❌ Bad
if (clients.length > 30) { ... }

// ✅ Good
// constants.ts
export const PLAN_LIMITS = { starter: 10, growth: 30, pro: Infinity }
```

### 13. API Error Handling — Always User-Facing

Every API error must result in a visible, human-readable message to the user (toast or inline).
Silent failures are not acceptable.

```ts
// ✅ Good
try {
  await tenantService.suspend(id)
  toast.success('Tenant suspended successfully')
} catch (err) {
  toast.error(getErrorMessage(err)) // centralized error extractor
}
```

`getErrorMessage()` lives in `src/lib/errors.ts` and handles Axios error shapes.

### 14. Sensitive Data — Never in localStorage

- JWT access token: memory only (Zustand store, lost on page refresh).
- JWT refresh token: `httpOnly` cookie (set by API, not accessible via JS).
- Never store tokens, user PII, or role data in `localStorage` or `sessionStorage`.

### 15. 2FA Must Be Enforced in Route Guard

The Super Admin route guard must verify:

1. Valid JWT
2. Role is `super_admin`
3. 2FA has been completed in this session (flag in auth store)

If any check fails → redirect to appropriate auth screen.

---

## Git Workflow

- Branch naming: `feature/sa-tenant-management`, `fix/sa-analytics-chart`, `chore/setup-eslint`
- Prefix: `feature/` | `fix/` | `chore/` | `refactor/`
- Use `sa-` prefix for Super Admin features, `pm-` for Property Manager, `tr-` for Trainer
- PRs must pass lint + type check + tests before merge
- No direct commits to `main`
- Squash merge only

## Commit Message Format (Conventional Commits)

```
feat(super-admin): add tenant suspension with confirmation modal
fix(auth): handle 2FA token expiry edge case
chore(deps): upgrade recharts to v2.12
refactor(permissions): centralize role checks in usePermissions hook
```

---

## File Naming Conventions

| Type             | Convention                                                    | Example                  |
| ---------------- | ------------------------------------------------------------- | ------------------------ |
| Components       | PascalCase                                                    | `TenantList.tsx`         |
| Hooks            | camelCase with `use` prefix                                   | `useTenants.ts`          |
| Services         | camelCase with `Service` suffix                               | `tenantService.ts`       |
| Types/Interfaces | PascalCase, prefix `T` for types, `I` optional for interfaces | `tenant.types.ts`        |
| Constants        | SCREAMING_SNAKE_CASE for values                               | `PLAN_LIMITS`            |
| Zustand stores   | camelCase with `Store` suffix                                 | `authStore.ts`           |
| Route files      | kebab-case                                                    | `super-admin.routes.tsx` |

---

## Component Patterns

### Always use React Query for server state

```ts
// ✅ Good
export function useTenants(filters: TenantFilters) {
  return useQuery({
    queryKey: ['tenants', filters],
    queryFn: () => tenantService.getAll(filters),
    staleTime: 30_000,
  })
}
```

### Always use Zod for runtime validation on API responses

Critical API responses (auth, permissions) must be validated at runtime with Zod,
not just typed with TypeScript.

### Skeleton Loading — not spinners for table/list views

Use skeleton placeholders for list and table views. Reserve spinners for inline actions
(button loading states).

---

## Security Rules

- All admin routes must be behind the `<ProtectedRoute>` guard — no exceptions.
- Never expose the Super Admin console URL publicly (no link from the marketing landing page).
- All destructive actions (suspend tenant, remove resident, delete promo code) must have a **confirmation modal** before executing.
- Stripe keys: only publishable key on the frontend. Secret key stays in the API repo.
- Content Security Policy headers must be set via CloudFront response headers policy.

---

## Performance Rules

- Use `React.lazy` + `Suspense` for all feature-level routes (code splitting by route).
- Recharts components must be wrapped in `ResponsiveContainer`.
- Large tables must use pagination — never render more than 50 rows at once.
- React Query `staleTime` must be set per query — never rely on the default of 0.
- Images (logos, branding uploads) must be served from CloudFront, never from the API.

---

## Accessibility (a11y)

- All form inputs must have associated `<label>` elements.
- All icon-only buttons must have `aria-label`.
- Color alone must never be the only indicator of status — always pair with text or icon.
- Modals must trap focus and close on `Escape`.
- Minimum contrast ratio: 4.5:1 for normal text (WCAG AA).

---

## What Claude Must Never Do

- Never generate or guess API endpoint URLs — use only endpoints confirmed from the API repo or explicitly provided.
- Never add features beyond what is specified in the SOW without explicit instruction.
- Never use `any` in TypeScript — always ask for the correct type if unknown.
- Never add `console.log` statements to committed code.
- Never bypass the centralized Axios instance to make direct fetch/axios calls.
- Never implement client-side role logic outside `src/lib/permissions.ts`.
- Never store auth tokens in localStorage.
- Never commit without running lint and type-check.
- Never create duplicate components — check `src/components/` before creating anything new.
- Never write inline styles — use Tailwind classes only.
