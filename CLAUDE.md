# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linter

## Project Architecture

**Nunta360** is a Romanian wedding planning application built with Next.js, React, TypeScript, and Tailwind CSS. The application uses self-hosted Supabase for authentication and data management.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19 + TypeScript
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom wedding brand colors
- **Authentication**: Supabase Auth with SSR
- **State Management**: React Context + TanStack Query
- **Canvas Graphics**: Konva.js for venue editor
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next (Romanian/English)

### Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Protected dashboard routes
│   │   ├── budget/page.tsx
│   │   ├── guests/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── settings/page.tsx
│   │   ├── venue/page.tsx    # Venue editor with Konva
│   │   └── layout.tsx        # Dashboard layout
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Landing page
│   └── providers.tsx    # Client-side context providers
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components (generated)
│   └── dashboard/      # Dashboard-specific components
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state management
│   └── LanguageContext.tsx # i18n with embedded translations
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── utils/supabase/     # Supabase SSR utilities
└── middleware.ts       # Next.js middleware for auth
```

### Authentication Architecture

The app uses Next.js middleware + context authentication:
- `middleware.ts` handles route protection and redirects
- `AuthContext` provides global auth state (`user`, `loading`)
- Dashboard routes protected at layout level
- Supabase SSR client for server-side authentication
- Self-hosted Supabase instance

### Routing Structure

- `/` - Landing page
- `/login` - Authentication
- `/signup` - User registration  
- `/dashboard/*` - Protected dashboard routes:
  - `/dashboard` - Overview with stats and tasks
  - `/dashboard/timeline` - Wedding timeline/calendar
  - `/dashboard/guests` - Guest management
  - `/dashboard/budget` - Budget tracking
  - `/dashboard/venue` - Venue layout editor (Konva.js)
  - `/dashboard/settings` - User settings

### Internationalization

The app supports Romanian (default) and English via a custom i18next setup:
- Translations embedded in `LanguageContext.tsx`
- Use `t('key')` function from `useLanguage()` hook
- Translation keys follow dot notation (e.g., `'dashboard.overview'`)

### Styling System

Custom Tailwind configuration with wedding-themed colors:
- Primary colors: `blush`, `dustyRose`, `sage`, `ivory`, `charcoal`
- Font families: Inter (sans), Playfair Display (serif), Great Vibes (script), Cormorant Garamond (serif)
- Uses CSS variables for theming
- shadcn/ui components styled with custom color palette

### Supabase Configuration

Environment variables for self-hosted setup:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase instance URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anonymous access key
- Additional backend keys in `.env` for server setup

### Component Patterns

- Components use TypeScript interfaces for props
- Extensive use of shadcn/ui components
- Custom hooks for common functionality (`useAuth`, `useSupabase`)
- Canvas-based components using Konva.js for venue editing
- Responsive design with mobile-first approach
- Icon system using `lucide-react`

### Data Management

- TanStack Query for server state management
- React Context for global app state
- Supabase client for database operations
- Form validation with React Hook Form + Zod schemas

### Development Notes

- ESLint configured with React hooks rules
- TypeScript with strict configuration
- Next.js for optimized production builds
- Server-side rendering and static generation support
- Supports both npm and potentially Bun package managers