# Community Garden Frontend

This is the frontend for the Community Gardening Management System, built with Next.js and React.

## Setup

1. Install dependencies:
   ```sh
   pnpm install
   ```
2. Create a `.env` file in the root of `community-garden-frontend`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
3. Start the development server:
   ```sh
   pnpm dev
   ```

## Features
- Garden listing and management
- Task board for garden tasks
- Dashboard with stats
- Authentication (token-based)
- Real API integration with backend

## API Integration
All API calls use the `src/api.js` abstraction and require the backend to be running at the URL specified in `.env`.

## Requirements
- Node.js
- pnpm
- Backend server running (see backend README)

## Troubleshooting
- Ensure `.env` is set up with the correct backend URL.
- Ensure backend CORS allows requests from the frontend.

---
