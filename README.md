
# Revify Analytics Dashboard

A clean, modern analytics dashboard for Revify SaaS platform built with React and Tailwind CSS.

## Component Structure

- **Layout Components**
  - `DashboardSidebar.tsx`: Main navigation sidebar with collapsible functionality
  - `TopBar.tsx`: Top navigation bar with search, notifications, and user profile
  - `DashboardLayout.tsx`: Page wrapper component combining sidebar and main content area

- **Dashboard Components**
  - `DashboardBanner.tsx`: Welcome message with quick action links and analytics overview
  - `ProgressOverview.tsx`: Visual representation of user progress
  - `AnalyticsOverview.tsx`: Charts and statistics showing key metrics
  - `OnboardingChecklist.tsx`: Interactive checklist for user onboarding
  - `QuickActions.tsx`: Quick action buttons for common tasks

- **UI Components**
  - `Tag.tsx`: Status indicator tag (success, warning, error, etc.)
  - `UploadIcon.tsx`: Reusable upload icon component
  - Various shadcn/ui components for consistent design system

## Required Libraries

- **UI Framework**: React
- **Styling**: Tailwind CSS
- **Icons**: Lucide React (already included)
- **Charts**: Recharts (already included)
- **Component Primitives**: Radix UI (via shadcn/ui)

## Color System

The dashboard uses a custom color system based on:
- **Primary Brand**: Revify Green (#7EC242)
- **UI Accent**: Tech Blue (#1e3a8a)
- **Header Background**: Deep Navy (#0f172a)
- **Text Dark**: Jet Black (#1a1a1a)
- **Text Light**: White (#ffffff)

These colors are configured in the `tailwind.config.ts` file and accessible through Tailwind classes. Custom color variants (light, hover, etc.) are also available.

## Installation & Usage

1. Clone the repository
2. Install dependencies with `npm install`
3. Run the development server with `npm run dev`

The components can be easily integrated into any React project with Tailwind CSS support.

## Responsiveness

All components are fully responsive and adapt to various screen sizes:
- Sidebar collapses on mobile screens
- Card layouts reflow from multi-column to single column
- Font sizes and spacing adjust appropriately
- Charts resize to fit available space

## Accessibility

The dashboard components use Radix UI primitives to ensure proper accessibility support, including:
- Keyboard navigation
- ARIA attributes
- Focus management
- Screen reader compatibility
