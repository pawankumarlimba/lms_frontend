# LMS Frontend
project link = https://lms-frontend-r6xd.vercel.app
Next.js (App Router) + TypeScript + Tailwind CSS borrower portal and operations dashboard.

## Design system - "Ledger"

The visual language is built for a lending product: a navy/ink "chrome" (sidebar, navbar, auth
screens) around warm paper content surfaces, with a single brass/gold accent spent deliberately
(primary CTAs, key monetary figures). Money figures use a monospace font with tabular numerals and
a brass underline (`.ledger-figure` in `globals.css`) - a small recurring motif that reads like a
ruled total on a paper ledger.

- **Display font:** Fraunces (serif, headings only)
- **Body font:** Inter
- **Numeric/mono font:** IBM Plex Mono (amounts, UTR numbers, IDs)

Every color, font size, radius and shadow is a token in `tailwind.config.ts` (backed by CSS
variables in `src/app/globals.css`) - components never hardcode a hex value or raw pixel size.
Layouts use Tailwind's responsive prefixes (`sm:`, `md:`, `lg:`) throughout; the dashboard sidebar
collapses below `md`, tables scroll horizontally on narrow screens, and grids reflow from 1 to 3
columns.

## Architecture

```
src/
  app/                     App Router pages (route groups: (auth), (borrower), (dashboard))
  components/
    ui/                    Button, Input, Select, Card, Badge, Slider, Alert, Feedback
    layout/                Navbar, Sidebar, DashboardShell, RoleGuard
    borrower/               StepIndicator, BreChecklist, FileDropzone, LoanConfigurator
    dashboard/              StatusBadge, StatCard, LoanTable, RecordPaymentForm
  lib/
    api/
      HttpClient.ts        Abstract base class - every *Api class extends this
      auth.api.ts / borrower.api.ts / sales.api.ts / sanction.api.ts /
      disbursement.api.ts / collection.api.ts / admin.api.ts
    auth/AuthContext.tsx   React context wrapping the current user + login/signup/logout
    utils/                 currency, date, interest (mirrors backend SI calc), bre-mirror
    constants/              roles.ts (role -> home route), loanStatus.ts (badge tone/label)
  types/                   user.ts, loan.ts, api.ts (mirror backend DTOs/models)
  middleware.ts            Coarse cookie-presence redirect (UX only, NOT the security boundary)
```

### Why these design decisions

**`HttpClient` abstract base class.** Every domain API (`AuthApi`, `BorrowerApi`, `SalesApi`, ...)
extends one class that owns the shared axios instance, `withCredentials: true` (required for the
httpOnly auth cookie), and uniform error normalisation into `ApiClientError`. Adding a new backend
module means adding one new subclass with its own endpoints - no fetch boilerplate repeated.

**Server BRE is authoritative; the client only mirrors it.** `lib/utils/bre-mirror.ts` runs the
same 4 checks as the backend purely so the personal-details form can show instant pass/fail
feedback as the user types. The actual eligibility decision is made by the backend BRE on submit;
the client mirror is explicitly documented as non-authoritative and can never block/allow on its
own.

**Auth uses `Authorization: Bearer <token>`, not just the cookie.** The backend also sets an
httpOnly cookie on login, which works great when frontend and backend share a real top-level
domain. But two separate `*.vercel.app` projects are different *sites* to the browser (`vercel.app`
is on the public suffix list), making that cookie third-party - exactly the kind of cookie modern
Chrome/Safari restrict or block by default. To avoid depending on browser cookie policy, the JWT
returned on login/signup is also stored via `TokenStore` (a thin class wrapping `localStorage`) and
attached as an `Authorization` header by an axios interceptor in `HttpClient` on every request.
There is intentionally no `middleware.ts` anymore - middleware runs on the server/edge and can't
read `localStorage`, so the only protected-route gate is the client-side `RoleGuard` (backed by
`AuthContext`, which reads `TokenStore`) plus the backend's own `authorize()` RBAC middleware,
which remains the real, unbypassable enforcement boundary either way.

**RBAC is enforced by the backend; the frontend only improves UX.** `RoleGuard` redirects users
away from screens they can't use so nothing flashes incorrectly, but the actual gate is the
backend's `authorize()` middleware. Every dashboard API call still goes through the backend's role
check regardless of what the frontend renders.

**No hardcoded styling.** Every visual property used in a component (`text-display-md`,
`bg-navy-700`, `rounded-lg`, `shadow-card`, ...) is a Tailwind utility resolving to a token defined
once in `tailwind.config.ts` / `globals.css`. Changing the brand color or type scale is a one-file
change.

## Setup

```bash
npm install
npm run dev                   # http://localhost:3000
```

Build for production: `npm run build && npm start`.

> Fonts (Fraunces/Inter/IBM Plex Mono) are loaded via `next/font/google`, which self-hosts them at
> build time. `npm run build` needs outbound internet access the first time (to fetch the font
> files from Google Fonts) - this is standard for any `next/font/google` project and not specific
> to this app.

## Pages

| Route                              | Audience            | Purpose |
|-------------------------------------|----------------------|---------|
| `/login`, `/signup`                | public               | Auth |
| `/apply/personal-details`          | Borrower             | Step 2 + live BRE preview |
| `/apply/loan-config`               | Borrower             | Step 3+4: upload slip, configure sliders, apply |
| `/applications`, `/applications/:id` | Borrower           | Track my applications |
| `/sales`                           | Sales, Admin         | Leads (registered, not yet applied) |
| `/sanction`                        | Sanction, Admin      | Approve/reject applied loans |
| `/disbursement`                    | Disbursement, Admin  | Release funds for sanctioned loans |
| `/collection`, `/collection/:id`   | Collection, Admin    | Record payments, view outstanding balance |
| `/admin`                           | Admin                | Cross-module overview |

> Note: the spec lists "Upload Salary Slip" and "Loan Configuration & Apply" as separate steps,
> but the backend exposes one endpoint (`POST /borrower/apply`) that accepts the file and the
> loan configuration together (file + slider values are both required to compute and persist the
> application atomically). The frontend therefore combines them into a single screen
> (`/apply/loan-config`) while still showing both as distinct steps in the stepper for clarity.
