# Bike Catalogue + Admin Panel

Modern full-stack Next.js app with a public bike parts catalogue and a protected admin panel for inventory + request management.

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- shadcn-style UI primitives (Radix UI where needed)
- Framer Motion (animations)
- Lucide React (icons)
- next-themes (dark/light mode)
- sonner (toast notifications)
- React Hook Form + Zod (forms + validation)
- TanStack Query (client-side API state)
- Zustand (lightweight UI state)
- ESLint + Prettier + `prettier-plugin-tailwindcss`
 - PDF receipts via `jspdf`

## Installation

```bash
npm install
```

## Admin Login

The admin panel is protected by a session cookie and uses hardcoded demo credentials:

- Username: `Asad`
- Password: `admin`
- Role: `admin`

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Build

```bash
npm run build
npm run start
```

## Formatting

```bash
npm run format
```

## Folder Structure

```txt
src/
  app/
    api/
      health/route.ts
      auth/
        login/route.ts
        logout/route.ts
        me/route.ts
      bikes/route.ts
      bikes/[bikeId]/route.ts
      checkout/route.ts
      admin/
        bikes/route.ts
        parts/route.ts
        requests/route.ts
        requests/[requestId]/route.ts
    admin/
      login/page.tsx
      bikes/page.tsx
      requests/page.tsx
      settings/page.tsx
      page.tsx
    bikes/[bikeId]/page.tsx
    globals.css
    layout.tsx
    page.tsx
    providers.tsx

  components/
    ui/
    layout/
      navbar.tsx
      sidebar.tsx
      app-shell.tsx
    shared/
      theme-toggle.tsx
      loading-spinner.tsx
      empty-state.tsx

  lib/
    auth.ts
    catalog-store.ts
    receipt.ts
    utils.ts
    validations/
      catalog.schema.ts

  hooks/
    use-admin.ts
    use-bikes.ts

  store/
    app-store.ts

  types/
    index.ts
```
