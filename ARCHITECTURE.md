# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    Frontend (React)                    │  │
│  │                                                         │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐ │  │
│  │  │   Editor    │  │ Save Button  │  │   Version    │ │  │
│  │  │  TextArea   │  │              │  │   History    │ │  │
│  │  └─────────────┘  └──────────────┘  └──────────────┘ │  │
│  │         │                │                   ▲         │  │
│  │         └────────────────┴───────────────────┘         │  │
│  │                          │                              │  │
│  │                     State Management                    │  │
│  │                    (useState/useEffect)                 │  │
│  └─────────────────────────┬───────────────────────────────┘  │
└────────────────────────────┼──────────────────────────────────┘
                             │
                        HTTP Requests
                     (fetch API calls)
                             │
┌────────────────────────────┼──────────────────────────────────┐
│                      Next.js Server                           │
│  ┌──────────────────────────────────────────────────────┐    │
│  │                   API Routes                          │    │
│  │                                                        │    │
│  │  POST /api/save-version   │   GET /api/versions      │    │
│  │           │                │            │             │    │
│  │           ▼                │            ▼             │    │
│  │  ┌─────────────────┐      │   ┌─────────────────┐   │    │
│  │  │ Calculate Diff  │      │   │  Retrieve All   │   │    │
│  │  │  (textDiff.ts)  │      │   │    Versions     │   │    │
│  │  └─────────────────┘      │   └─────────────────┘   │    │
│  │           │                │            │             │    │
│  │           ▼                │            ▼             │    │
│  │  ┌─────────────────┐      │   ┌─────────────────┐   │    │
│  │  │  Save Version   │      │   │   Read from     │   │    │
│  │  │  (storage.ts)   │      │   │   Storage       │   │    │
│  │  └─────────────────┘      │   └─────────────────┘   │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────────┬──────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   data.json     │
                    │  File Storage   │
                    └─────────────────┘
```

## Data Flow: Saving a Version

```
1. User types text in editor
          │
          ▼
2. User clicks "Save Version"
          │
          ▼
3. Frontend calls POST /api/save-version
          │
          ▼
4. Backend retrieves last version from storage
          │
          ▼
5. Calculate diff (textDiff.ts):
   ┌────────────────────────────┐
   │ Tokenize old text → words  │
   │ Tokenize new text → words  │
   │ Create frequency maps      │
   │ Compare frequencies        │
   │ Identify added words       │
   │ Identify removed words     │
   └────────────────────────────┘
          │
          ▼
6. Create version object:
   {
     id: "uuid",
     timestamp: "2025-11-29 14:30",
     addedWords: [...],
     removedWords: [...],
     oldLength: 43,
     newLength: 51,
     content: "..."
   }
          │
          ▼
7. Save to data.json (storage.ts)
          │
          ▼
8. Return version to frontend
          │
          ▼
9. Frontend updates state
          │
          ▼
10. Version history re-renders
```

## Component Hierarchy

```
App (page.tsx)
│
├── Header
│   ├── Title
│   └── Subtitle
│
├── Message (success/error notifications)
│
├── Layout (2-column grid)
│   │
│   ├── Editor Section
│   │   ├── Editor Header
│   │   │   ├── Title
│   │   │   └── Character Count
│   │   │
│   │   ├── Content TextArea
│   │   │
│   │   └── Editor Actions
│   │       ├── Save Button
│   │       └── Help Text
│   │
│   └── History Section
│       └── VersionHistory Component
│           ├── History Header
│           └── Version List
│               └── Version Card (for each version)
│                   ├── Version Header
│                   │   ├── Version Number
│                   │   └── Time Ago
│                   │
│                   ├── Timestamp
│                   │
│                   ├── Statistics
│                   │   └── Character Changes
│                   │
│                   ├── Added Words (green tags)
│                   │
│                   └── Removed Words (red tags)
│
└── Footer
```

## File Responsibilities

### Frontend Files

**`src/app/page.tsx`** (Main UI)
- Manages editor content state
- Handles save button clicks
- Fetches and displays version history
- Shows loading/error states
- User interaction handling

**`src/components/VersionHistory.tsx`**
- Receives versions array as props
- Renders each version card
- Formats timestamps with "time ago"
- Displays added/removed words
- Shows character count changes

### Backend Files

**`src/app/api/save-version/route.ts`**
- Receives POST requests with content
- Retrieves previous version
- Calls diff calculation
- Creates new version object
- Saves to storage
- Returns success response

**`src/app/api/versions/route.ts`**
- Handles GET requests
- Retrieves all versions from storage
- Returns versions array
- Error handling

### Library Files

**`src/lib/textDiff.ts`** (Core Algorithm)
- `tokenizeWords()` - Extracts words from text
- `calculateTextDiff()` - Compares two texts
  - Creates word frequency maps
  - Identifies added words
  - Identifies removed words
  - Calculates length changes
- `formatTimestamp()` - Creates timestamp strings
- `getTimeAgo()` - Formats relative time

**`src/lib/storage.ts`** (Data Persistence)
- `initStorage()` - Creates data.json if missing
- `getAllVersions()` - Reads all versions
- `saveVersion()` - Appends new version
- `getLatestVersion()` - Gets most recent version

### Type Files

**`src/types/index.ts`**
- `Version` - Version object structure
- `SaveVersionRequest` - API request type
- `SaveVersionResponse` - API response type
- `GetVersionsResponse` - API response type

## Algorithm: Text Diff Calculation

```
Input: oldText, newText

Step 1: Tokenize
  oldWords = tokenizeWords(oldText)
  newWords = tokenizeWords(newText)
  
  Example:
    oldText = "The quick brown fox"
    oldWords = ["the", "quick", "brown", "fox"]

Step 2: Create Frequency Maps
  oldFreq = { "the": 1, "quick": 1, "brown": 1, "fox": 1 }
  newFreq = { "the": 1, "brown": 1, "fox": 1, "jumps": 1 }

Step 3: Find Added Words
  For each word in newFreq:
    if count(new) > count(old):
      added.push(word)
  
  Result: ["jumps"]

Step 4: Find Removed Words
  For each word in oldFreq:
    if count(old) > count(new):
      removed.push(word)
  
  Result: ["quick"]

Step 5: Calculate Lengths
  oldLength = oldText.length
  newLength = newText.length

Output: {
  addedWords: ["jumps"],
  removedWords: ["quick"],
  oldLength: 19,
  newLength: 18
}
```

## State Management Flow

```
Component Mount
      │
      ▼
useEffect() triggers
      │
      ▼
loadVersions() called
      │
      ▼
Fetch GET /api/versions
      │
      ▼
Set versions state
      │
      ▼
Load latest content into editor
      │
      ▼
Component renders

User Interaction:
      │
      ▼
User edits text
      │
      ▼
setContent() updates state
      │
      ▼
Character count updates
      │
      ▼
User clicks Save
      │
      ▼
handleSaveVersion() called
      │
      ▼
setIsSaving(true)
      │
      ▼
Fetch POST /api/save-version
      │
      ▼
Receive new version
      │
      ▼
Update versions state
      │
      ▼
setIsSaving(false)
      │
      ▼
Show success message
      │
      ▼
Component re-renders
```

## Technology Stack Details

```
┌─────────────────────────────────────────┐
│          Technology Stack                │
├─────────────────────────────────────────┤
│ Frontend Framework: React 18             │
│ Build Tool: Next.js 14                   │
│ Language: TypeScript 5                   │
│ Styling: CSS3 (Custom)                   │
│ State Management: React Hooks            │
│ HTTP Client: Fetch API                   │
├─────────────────────────────────────────┤
│ Backend: Next.js API Routes              │
│ Runtime: Node.js                         │
│ Storage: JSON File System                │
│ ID Generation: UUID v4                   │
├─────────────────────────────────────────┤
│ No External Libraries for:               │
│ - Text diffing (custom algorithm)        │
│ - State management (React hooks only)    │
│ - UI components (no component library)   │
└─────────────────────────────────────────┘
```

## Key Design Decisions

### 1. Why Next.js?
- Built-in API routes (no separate backend setup)
- TypeScript support out of the box
- Fast development experience
- Easy deployment

### 2. Why JSON File Storage?
- Simple for 2-hour task
- No database setup required
- Easy to inspect and debug
- Sufficient for prototype

### 3. Why Custom Diff Algorithm?
- Tests candidate's problem-solving skills
- Can't be copied from online
- Demonstrates algorithmic thinking
- Core requirement of the task

### 4. Why Frequency Maps?
- Efficient word comparison
- Handles repeated words correctly
- O(n) time complexity
- Clear logic flow

### 5. Why Component Separation?
- Reusable VersionHistory component
- Easier to test and maintain
- Clear separation of concerns
- Professional code structure
