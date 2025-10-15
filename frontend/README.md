# Smart Agriculture Exchange - Frontend

This is the frontend application for the Smart Agriculture Exchange platform, built with React, TypeScript, and Tailwind CSS.

## Features

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for responsive styling
- **React Router** for client-side routing
- **Multi-language Support** (English, Hindi, Tamil, Telugu)
- **Progressive Web App (PWA)** capabilities
- **Mobile-first Design** optimized for farmers

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Development

The frontend runs on `http://localhost:5173` by default and connects to the backend API at `http://localhost:3001`.

## Project Structure

- `src/pages/` - Main application pages
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/services/` - API service functions
- `src/utils/` - Utility functions

## Environment Variables

Copy `env.example` to `.env` and configure:

```env
VITE_API_URL=http://localhost:3001/api
```