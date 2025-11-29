# Mini Audit Trail Generator

A micro web app that automatically generates a change-history audit trail every time text is modified.

## Features

- **Text Editor**: Edit content in a text area
- **Version Tracking**: Save versions and track changes
- **Smart Diff Detection**: Automatically detects added and removed words
- **Audit History**: View complete version history with timestamps

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. Type or paste content into the editor
2. Click "Save Version" to create a snapshot
3. View the version history showing:
   - Timestamp
   - Added words (highlighted in green)
   - Removed words (highlighted in red)
   - Character count changes

## Technology Stack

- **Frontend**: React with Next.js
- **Backend**: Next.js API Routes
- **Storage**: JSON file-based storage
- **Language**: TypeScript

## API Endpoints

- `POST /api/save-version` - Save a new version
- `GET /api/versions` - Retrieve all versions

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/          # Backend API routes
│   │   ├── page.tsx      # Main UI page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   ├── lib/             # Utility functions
│   └── types/           # TypeScript types
└── package.json
```
