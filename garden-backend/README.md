# Community Garden Backend

This is the backend for the Community Gardening Management System, built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the root of `garden-backend`:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-uri
   OPENAI_API_KEY=your-openai-key
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```

## Features
- RESTful API for gardens, tasks, users, and more
- JWT authentication
- CORS enabled
- MongoDB integration

## Endpoints
- `/api/gardens` - Gardens CRUD
- `/api/tasks` - Tasks CRUD
- `/api/dashboard/stats` - Dashboard stats
- ...and more

## Requirements
- Node.js
- MongoDB

## Troubleshooting
- Ensure `.env` is set up with the correct values.
- Ensure MongoDB is running and accessible.

---
