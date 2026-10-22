# Photo Gallery Web App

A responsive React + Vite photo gallery application built with Tailwind CSS. The app fetches photos from the Picsum Photos API, displays them in a responsive grid, allows real-time search filtering by author, and supports saving favourites with persistent storage.

Built strictly according to all 7 pre-screening assignment requirements with a minimal, clean codebase.

---

## 🚀 Features & Technical Highlights

1. **React + Vite + Tailwind CSS**: Built with functional components and modern React hooks. Zero external UI component libraries (pure Tailwind CSS).
2. **Data Fetching via Picsum API**: Fetches 30 photos on initial load (`https://picsum.photos/v2/list?limit=30`) with animated loading spinner and error handling.
3. **Responsive Grid Layout**:
   - **Desktop**: 4 columns (`lg:grid-cols-4`)
   - **Tablet**: 2 columns (`md:grid-cols-2`)
   - **Mobile**: 1 column (`grid-cols-1`)
   - Each card displays the photo image, the author's name, and a favourite heart toggle button.
4. **Real-time Search Filter**: Instant client-side search by author name with no page reload and no redundant API calls.
5. **Favourites with `useReducer` & `localStorage`**:
   - Manages favourited photo IDs using `useReducer` instead of `useState`.
   - Persists state across page refreshes via `localStorage` lazy initialization and synchronization effect.
6. **Custom Hook (`useFetchPhotos`)**:
   - Encapsulates API fetch logic, loading status, and error catching.
   - Returns `{ photos, loading, error }`.
   - Includes `AbortController` cleanup to prevent memory leaks and state updates on unmount.
7. **Performance Optimization (`useCallback` + `useMemo`)**:
   - `useCallback` wraps the search filter event handler to maintain a stable function reference.
   - `useMemo` computes the filtered photo array so filtering calculations only execute when `photos` or `searchTerm` changes.

---

## 📁 File Structure

The project maintains a minimal file structure with only essential files:

```
Gallery_Project/
├── public/
├── src/
│   ├── App.jsx           # Root application component rendering Gallery
│   ├── Gallery.jsx       # Main gallery view (grid, search, useReducer, useCallback, useMemo)
│   ├── useFetchPhotos.js # Custom hook extracting Picsum API fetch logic
│   ├── index.css         # Tailwind CSS styling imports
│   └── main.jsx          # React DOM entry point
├── index.html            # HTML template with responsive viewport
├── package.json          # Dependencies and npm scripts
├── vite.config.js        # Vite build configuration with Tailwind plugin
└── README.md             # Project documentation & presentation guide
```

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation & Running Locally

1. Clone or navigate to the repository directory:
   ```bash
   cd Gallery_Project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Open the browser at `http://localhost:5173/` (or the URL displayed in the terminal).

5. To build for production:
   ```bash
   npm run build
   ```

---

## 🎥 5-Minute Screen Recording Cheat Sheet

Here is a quick guide for the 5-minute video recording requirements:

### 1. Show the App Working
- **Loading**: Refresh the page to demonstrate the loading spinner while photos are fetched from Picsum API.
- **Grid Responsiveness**: Resize the browser window to showcase 4 columns (desktop), 2 columns (tablet), and 1 column (mobile).
- **Search Filter**: Type an author's name (e.g., "Alejandro") into the search input. Show how the grid filters in real-time without reloading or triggering new API requests.
- **Favourites & Persistence**: Click the heart icon on 2–3 photo cards to mark them as favourites (counter increments and heart turns red). Then refresh the page (`F5`) to show that favourited photos persist seamlessly.

### 2. Open `useFetchPhotos.js`
- **What it returns**: Returns `{ photos, loading, error }`.
- **What happens if the API fails**: If the network fails or the server returns an HTTP error (`!response.ok`), the `catch` block catches the error, sets `error` to the error message, sets `loading` to `false`, and leaves `photos` as an empty array. The Gallery component then renders an error alert banner to the user.

### 3. Open `useReducer` Code (in `Gallery.jsx`)
- **What actions it handles**:
  - `TOGGLE_FAVOURITE`: Toggles a photo ID. If the ID is already in the favourites array, it filters it out; if not, it appends it.
- **Why `useReducer` instead of `useState`**:
  - **Separation of Concerns**: State update logic is separated from UI rendering logic, making it predictable and testable.
  - **Predictable State Transitions**: Dispatches explicit actions (`{ type: 'TOGGLE_FAVOURITE', payload: photo.id }`) rather than passing arbitrary setter callbacks down the tree.
  - **Extensibility**: Easily allows adding future actions (such as `CLEAR_ALL` or batch updates) without altering component structure.

### 4. Open `useCallback` & `useMemo` (in `Gallery.jsx`)
- **`useCallback` (on `handleSearchChange`)**:
  - *Problem solved*: Memoizes the search handler function reference across re-renders.
  - *What would break/degrade*: Every time any state in `Gallery` updates (such as clicking a favourite heart), a brand new function instance would be created in memory.
- **`useMemo` (on `filteredPhotos`)**:
  - *Problem solved*: Caches the filtered photo array and only recomputes when `photos` or `searchTerm` changes.
  - *What would break/degrade*: Without `useMemo`, clicking a favourite heart would trigger a re-render of `Gallery`, causing the entire 30-item array to be filtered and iterated over again, even though neither the photos nor the search term changed.

### 5. Show One Thing That Was Difficult
- **Example challenge to discuss**:
  - *Challenge*: Synchronizing `useReducer` with `localStorage` properly without breaking React pure component rules.
  - *Solution*: Reducers must remain pure functions without side effects. Instead of performing `localStorage.setItem` directly inside the reducer, we used `useReducer`'s 3rd argument (the lazy initializer `initFavourites`) to read stored data on mount once, and used a `useEffect` hook listening to `[favourites]` to write changes to `localStorage` safely.
