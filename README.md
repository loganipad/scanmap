<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# ScanMap

ScanMap is a React + Vite app for planning and tracking offline flyer campaigns.

## Stack

- Frontend: React, React Router, Tailwind, Leaflet
- Backend runtime: Express + Vite middleware
- Auth + database: Supabase

## Prerequisites

- Node.js 20+
- A Supabase project

## Local setup

1. Install dependencies:
   `npm install`
2. Create a local env file:
   `cp .env.example .env.local`
3. Set these required variables in `.env.local`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. (Optional) set `GEMINI_API_KEY` only if you add Gemini features.
5. Start the app:
   `npm run dev`

## Supabase database setup

1. Open Supabase SQL Editor.
2. Run [supabase/schema.sql](supabase/schema.sql).
3. In Authentication, enable providers you need:
   - Email
   - Google (for OAuth login)
4. For Google OAuth redirect, add:
   - `http://localhost:3000/dashboard`
   - Your production dashboard URL when deploying

## Notes

- Campaign data now lives in the `campaigns` Postgres table.
- Row-level security is enabled and restricted to `auth.uid() = user_id`.
