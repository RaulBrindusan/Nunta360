# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (port 8080)
- `npm run build` - Production build
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint linter
- `npm run preview` - Preview production build locally

## Project Architecture

**Nunta360** is a Romanian wedding planning application built with React, TypeScript, Vite, and Tailwind CSS. The application uses self-hosted Supabase for authentication and data management.

### Core Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom wedding brand colors
- **Authentication**: Supabase Auth
- **State Management**: React Context + TanStack Query
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Internationalization**: i18next (Romanian/English)

### Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components (generated)
│   └── dashboard/       # Dashboard-specific components
├── contexts/            # React contexts
│   ├── AuthContext.tsx  # Authentication state management
│   └── LanguageContext.tsx # i18n with embedded translations
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── supabase.ts      # Supabase client configuration
│   └── utils.ts         # Utility functions
├── pages/               # Page components
├── utils/supabase/      # Supabase utilities
└── App.tsx              # Main app with routing
```

### Authentication Architecture

The app uses a context-based authentication pattern:
- `AuthContext` provides global auth state (`user`, `loading`)
- `ProtectedRoute` component wraps dashboard routes
- Supabase client configured with environment variables
- Self-hosted Supabase instance on `localhost:54321`

### Routing Structure

- `/` - Landing page
- `/login` - Authentication
- `/signup` - User registration  
- `/dashboard/*` - Protected dashboard routes:
  - `/dashboard` - Overview with stats and tasks
  - `/dashboard/timeline` - Wedding timeline/calendar
  - `/dashboard/guests` - Guest management
  - `/dashboard/budget` - Budget tracking
  - `/dashboard/settings` - User settings

### Internationalization

The app supports Romanian (default) and English via a custom i18next setup:
- Translations embedded in `LanguageContext.tsx`
- Use `t('key')` function from `useLanguage()` hook
- Translation keys follow dot notation (e.g., `'dashboard.overview'`)

### Styling System

Custom Tailwind configuration with wedding-themed colors:
- Primary colors: `blush`, `dustyRose`, `sage`, `ivory`, `charcoal`
- Font families: Inter (sans), Playfair Display (serif)
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
- Vite for fast development builds
- Component auto-tagging in development (Lovable integration)
- Supports both npm and potentially Bun package managers