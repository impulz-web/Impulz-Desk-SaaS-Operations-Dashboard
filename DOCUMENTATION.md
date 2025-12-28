# Impulz Desk - Product Documentation

## 📌 Overview
**Impulz Desk** is a professional B2B SaaS operational dashboard designed for startups and small businesses. It consolidates task management, financial tracking, and team oversight into a single, high-performance interface.

## 🛠 Tech Stack
- **Frontend**: React (ES6 Modules)
- **Styling**: Tailwind CSS (Utility-first CSS)
- **Icons**: Lucide React
- **Charts**: Recharts (SVG-based data visualization)
- **Backend/Auth**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Conceptually designed for modern edge-hosting (Vercel/Netlify).

## 🚀 Key Features

### 1. Dashboard Overview
- **KPI Tracking**: Real-time stats for Revenue, Tasks, Efficiency, and Growth.
- **Revenue Overview**: Interactive area charts visualizing financial trends.
- **Task Distribution**: Pie charts showing team workload balance.
- **Recent Activity**: Quick-view list of the latest financial transactions.

### 2. Task Management
- **Full CRUD**: Create, edit, and delete tasks.
- **Status Workflows**: Move tasks through `Todo`, `In Progress`, `Review`, and `Done`.
- **Prioritization**: High, Medium, and Low priority flags with visual indicators.
- **Assignment**: Admin-controlled task distribution across the team.

### 3. Financial Analytics
- **Centralized Ledger**: A unified "Finance Log" that drives all charts in the app.
- **Revenue vs. Expense**: Comparative bar charts for profitability analysis.
- **Efficiency Metrics**: Line charts tracking productivity against target benchmarks.
- **Dynamic Summaries**: Instant calculation of Net Profit and Total Revenue.

### 4. User & Access Control
- **Role-Based Access (RBAC)**: Supports `Admin`, `Manager`, `Staff`, and `Guest`.
- **User Management**: Admins can invite team members and manage statuses (`Active`, `Pending`, `Inactive`).
- **Profile Customization**: Individual settings for profile info, security (2FA placeholders), and notifications.

## 📂 Project Structure

- `App.tsx`: The "Brain" of the app. Manages global state (Tasks, Finance, Auth) and routing.
- `types.ts`: Centralized TypeScript interfaces for data consistency.
- `constants.tsx`: Mock data, color palettes, and configuration objects.
- `components/`:
    - `Layout.tsx`: Sidebar navigation and header logic.
    - `TaskModal.tsx`, `UserModal.tsx`, `FinanceModal.tsx`: Form-driven interaction layers.
    - `StatCard.tsx`, `EmptyState.tsx`: Reusable UI atoms.
- `pages/`: Individual screen implementations.
- `lib/supabase.ts`: Configuration for the optional Supabase backend.

## 🔄 Data Synchronization Logic
The application uses a **Hybrid State Strategy**:
1. **Supabase Mode**: If environment variables are present, the app connects to a live PostgreSQL DB using Supabase JS. It listens to real-time changes using Postgres Channels.
2. **Mock Mode**: If no backend is detected, the app seamlessly falls back to local state management initialized with constants from `constants.tsx`.

## 🎨 Design Principles
- **Progressive Disclosure**: Detailed info is kept in modals/drawers until needed.
- **Visual Hierarchy**: Heavy use of typography weights and whitespace to reduce cognitive load.
- **Brand Consistency**: A primary Indigo-600 palette with semantic color coding (Emerald for success, Red for errors).

## 📝 Setup for Developers
1. Ensure `index.html` imports the required libraries via `esm.sh`.
2. Configure `SUPABASE_URL` and `SUPABASE_ANON_KEY` in your environment for live data.
3. The app starts at the **Login** screen; use any credentials in "Mock Mode" to bypass authentication.
