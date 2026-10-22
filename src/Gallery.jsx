import { useState, useReducer, useEffect, useCallback, useMemo } from 'react';
import useFetchPhotos from './useFetchPhotos';

const STORAGE_KEY = 'photo_gallery_favourites';

// Action types for favourites reducer
const ACTIONS = {
  TOGGLE_FAVOURITE: 'TOGGLE_FAVOURITE',
};

/**
 * Favourites reducer to manage favourited photo IDs.
 * Separates complex state transitions from the UI.
 */
function favouritesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.TOGGLE_FAVOURITE: {
      const photoId = action.payload;
      if (state.includes(photoId)) {
        // Remove from favourites
        return state.filter((id) => id !== photoId);
      } else {
        // Add to favourites
        return [...state, photoId];
      }
    }
    default:
      return state;
  }
}

/**
 * Lazy initializer for useReducer:
 * Reads saved favourites array from localStorage on initial render only.
 */
function initFavourites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load favourites from localStorage:', error);
    return [];
  }
}

export function Gallery() {
  // Requirement 6: Use custom hook to fetch photos
  const { photos, loading, error } = useFetchPhotos();

  // Search input state
  const [searchTerm, setSearchTerm] = useState('');

  // Requirement 5: Manage favourites using useReducer (persisted in localStorage)
  const [favourites, dispatch] = useReducer(favouritesReducer, [], initFavourites);

  // Sync favourites to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch (err) {
      console.error('Failed to save favourites to localStorage:', err);
    }
  }, [favourites]);

  // Requirement 7: useCallback on search filter handler to prevent unnecessary function recreation
  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Requirement 7: useMemo to compute filtered photos list without recomputing on unrelated re-renders
  const filteredPhotos = useMemo(() => {
    if (!searchTerm.trim()) {
      return photos;
    }
    const lowerQuery = searchTerm.toLowerCase();
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(lowerQuery)
    );
  }, [photos, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Photo Gallery
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Discover photos by talented creators. Search by author and save your favourites.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            <svg
              className="w-4 h-4 fill-rose-500 text-rose-500"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>
              {favourites.length} {favourites.length === 1 ? 'Favourite' : 'Favourites'}
            </span>
          </div>
        </header>

        {/* Requirement 4: Search Filter */}
        <div className="mb-8 max-w-xl mx-auto sm:mx-0">
          <div className="relative rounded-lg shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-slate-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by author name..."
              className="block w-full rounded-lg border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm transition"
            />
          </div>
        </div>

        {/* Requirement 2: Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
            <p className="mt-4 text-sm font-medium text-slate-600">Loading photos...</p>
          </div>
        )}

        {/* Requirement 2: Error State */}
        {!loading && error && (
          <div className="max-w-lg mx-auto my-12 rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-6 w-6 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3 className="mt-3 text-base font-semibold text-red-800">Failed to load photos</h3>
            <p className="mt-1 text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Empty Search Results */}
        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm p-8">
            <svg
              className="mx-auto h-12 w-12 text-slate-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-3 text-base font-semibold text-slate-800">No photos found</h3>
            <p className="mt-1 text-sm text-slate-500">
              No results found matching &quot;{searchTerm}&quot;. Try typing a different author name.
            </p>
          </div>
        )}

        {/* Requirement 3: Responsive Grid (desktop: 4 columns, tablet: 2 columns, mobile: 1 column) */}
        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => {
              const isFavourite = favourites.includes(photo.id);

              return (
                <div
                  key={photo.id}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-md transition duration-200 border border-slate-200/80"
                >
                  {/* Photo Image */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
                    <img
                      src={photo.download_url}
                      alt={`Captured by ${photo.author}`}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Card Footer: Author Name & Heart Button */}
                  <div className="flex items-center justify-between p-4 bg-white">
                    <div className="min-w-0 pr-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Author
                      </p>
                      <p
                        className="truncate text-sm font-semibold text-slate-800"
                        title={photo.author}
                      >
                        {photo.author}
                      </p>
                    </div>

                    {/* Requirement 5: Heart Icon Button toggles favourite */}
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: ACTIONS.TOGGLE_FAVOURITE,
                          payload: photo.id,
                        })
                      }
                      aria-label={
                        isFavourite
                          ? `Remove ${photo.author}'s photo from favourites`
                          : `Add ${photo.author}'s photo to favourites`
                      }
                      aria-pressed={isFavourite}
                      className={`inline-flex items-center justify-center p-2 rounded-full transition cursor-pointer ${
                        isFavourite
                          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                          : 'bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform duration-150 active:scale-125 ${
                          isFavourite ? 'fill-rose-500 stroke-rose-500' : 'fill-none stroke-current'
                        }`}
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;
