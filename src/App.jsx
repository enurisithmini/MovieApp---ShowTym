import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import MovieDetailsModal from "./components/MovieDetailsModal";
import FavoriteButton from "./components/FavoriteButton";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

const HOME_SEARCHES = {
  movies: [
    "Avengers",
    "Batman",
    "Spider-Man",
    "Harry Potter",
    "Star Wars",
    "Jurassic Park",
    "Toy Story",
    "Mission Impossible",
  ],
  tv: [
    "Breaking Bad",
    "Friends",
    "Stranger Things",
    "The Office",
    "Game of Thrones",
    "Sherlock",
    "Wednesday",
    "The Last of Us",
  ],
};

function App() {
  const [homeMovies, setHomeMovies] = useState([]);
  const [homeSeries, setHomeSeries] = useState([]);
  const [allMovieData, setAllMovieData] = useState([]);

  const [activeSection, setActiveSection] = useState("movies");
  const [showMyList, setShowMyList] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const [searchMovie, setSearchMovie] = useState("");
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [homeLoading, setHomeLoading] = useState(true);
  const [error, setError] = useState("");
  const [homeError, setHomeError] = useState("");

  // Load saved favourites from localStorage.
  const [favoriteMovies, setFavoriteMovies] = useState(() => {
    try {
      const saved = localStorage.getItem("showtym-favorites");
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Could not load favourites:", err);
      return [];
    }
  });

  // Save favourites whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem("showtym-favorites", JSON.stringify(favoriteMovies));
    } catch (err) {
      console.error("Could not save favourites:", err);
    }
  }, [favoriteMovies]);

  // Add or remove a movie/series from My List.
  const toggleFavorite = useCallback((item) => {
    setFavoriteMovies((current) => {
      const alreadySaved = current.some(
        (saved) => saved.imdbID === item.imdbID,
      );

      if (alreadySaved) {
        return current.filter((saved) => saved.imdbID !== item.imdbID);
      }

      return [...current, item];
    });
  }, []);

  // Fetch homepage movies or TV series.
  const fetchHomeCollection = useCallback(async (section) => {
    try {
      setHomeLoading(true);
      setHomeError("");

      const type = section === "tv" ? "series" : "movie";

      const responses = await Promise.all(
        HOME_SEARCHES[section].map(async (title) => {
          const params = new URLSearchParams({
            s: title,
            type,
            apikey: API_KEY,
          });

          const response = await fetch(`https://www.omdbapi.com/?${params}`);

          if (!response.ok) {
            throw new Error("Failed to fetch homepage titles.");
          }

          return response.json();
        }),
      );

      const items = responses.flatMap((data) =>
        data.Response === "True" ? data.Search : [],
      );

      // Remove duplicate titles.
      const uniqueItems = Array.from(
        new Map(items.map((item) => [item.imdbID, item])).values(),
      );

      if (section === "tv") {
        setHomeSeries(uniqueItems);
      } else {
        setHomeMovies(uniqueItems);
      }

      if (uniqueItems.length === 0) {
        setHomeError("No titles could be loaded. Please try again.");
      }
    } catch (err) {
      console.error("Homepage collection error:", err);
      setHomeError("Could not load titles. Please try again.");
    } finally {
      setHomeLoading(false);
    }
  }, []);

  // Load the selected section's collection.
  useEffect(() => {
    const hasCollection =
      activeSection === "tv" ? homeSeries.length > 0 : homeMovies.length > 0;

    if (!hasCollection) {
      fetchHomeCollection(activeSection);
    } else {
      setHomeLoading(false);
      setHomeError("");
    }
  }, [
    activeSection,
    homeMovies.length,
    homeSeries.length,
    fetchHomeCollection,
  ]);

  // Search movies or TV series depending on the active section.
  const fetchMovieData = useCallback(
    async (query) => {
      if (!query.trim()) {
        setError("Enter a title to search.");
        return;
      }

      setShowMyList(false);
      setIsSearchMode(true);

      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams({
          s: query.trim(),
          type: activeSection === "tv" ? "series" : "movie",
          apikey: API_KEY,
        });

        const response = await fetch(`https://www.omdbapi.com/?${params}`);

        if (!response.ok) {
          throw new Error("Search failed.");
        }

        const data = await response.json();

        if (data.Response === "True") {
          setAllMovieData(data.Search);
        } else {
          setAllMovieData([]);
          setError(data.Error || "No results found.");
        }
      } catch (err) {
        console.error("Search error:", err);
        setAllMovieData([]);
        setError("Could not load results. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [activeSection],
  );

  // Switch between Movies and TV Shows.
  const changeSection = (section) => {
    setActiveSection(section);
    setShowMyList(false);
    setIsSearchMode(false);
    setSearchMovie("");
    setAllMovieData([]);
    setError("");
    setHomeError("");
  };

  // Return to the movie homepage.
  const showHome = () => {
    changeSection("movies");
  };

  // Open My List.
  const openMyList = () => {
    setShowMyList(true);
    setIsSearchMode(false);
    setError("");
    setHomeError("");
  };

  // Decide which titles should be displayed.
  const currentHomeCollection =
    activeSection === "tv" ? homeSeries : homeMovies;

  const displayedMovies = showMyList
    ? favoriteMovies
    : isSearchMode
      ? allMovieData
      : currentHomeCollection;

  const displayedLoading = showMyList
    ? false
    : isSearchMode
      ? loading
      : homeLoading;

  const displayedError = showMyList ? "" : isSearchMode ? error : homeError;

  // Featured title is hidden on My List.
  const featuredMovie = showMyList ? null : displayedMovies[0];

  const otherMovies = showMyList ? displayedMovies : displayedMovies.slice(1);

  const sectionTitle = activeSection === "tv" ? "TV Shows" : "Movies";

  return (
    <div className="min-h-screen bg-[#101014] text-white">
      <Navbar
        activeSection={showMyList ? "my-list" : activeSection}
        onHomeClick={showHome}
        onMoviesClick={() => changeSection("movies")}
        onTVShowsClick={() => changeSection("tv")}
        onMyListClick={openMyList}
      />

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        {/* Hero heading and search */}
        <section className="py-10 text-center sm:py-14">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-red-500">
            Your entertainment destination
          </p>

          <h2 className="text-3xl font-extrabold sm:text-5xl">
            Discover your next <span className="text-red-500">favourite.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400 sm:text-base">
            Explore movies and TV shows, discover new stories, and plan your
            next movie night.
          </p>

          {!showMyList && (
            <div className="mt-8">
              <SearchBar
                searchMovie={searchMovie}
                setSearchMovie={setSearchMovie}
                fetchMovieData={fetchMovieData}
              />
            </div>
          )}

          {(isSearchMode || showMyList) && (
            <button
              type="button"
              onClick={() => {
                if (showMyList) {
                  changeSection("movies");
                } else {
                  setIsSearchMode(false);
                  setSearchMovie("");
                  setError("");
                }
              }}
              className="mt-4 rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:border-red-500 hover:text-white"
            >
              ← Back to {showMyList ? "Movies" : sectionTitle}
            </button>
          )}
        </section>

        {/* Loading */}
        {displayedLoading && (
          <p className="py-8 text-center text-gray-400">
            {isSearchMode ? "Searching..." : "Discovering titles for you..."}
          </p>
        )}

        {/* Errors */}
        {!displayedLoading && displayedError && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-red-300"
          >
            <p>{displayedError}</p>

            <button
              type="button"
              onClick={
                isSearchMode
                  ? () => fetchMovieData(searchMovie)
                  : () => fetchHomeCollection(activeSection)
              }
              className="mt-3 font-semibold text-white underline underline-offset-4 hover:text-red-300"
            >
              Try again
            </button>
          </div>
        )}

        {/* Featured movie or TV show */}
        {!showMyList &&
          !displayedLoading &&
          !displayedError &&
          featuredMovie && (
            <section className="relative mb-14 min-h-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#202027] sm:min-h-[400px]">
              {featuredMovie.Poster && featuredMovie.Poster !== "N/A" && (
                <img
                  src={featuredMovie.Poster}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-25 blur-[2px]"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-r from-[#101014] via-[#101014]/85 to-[#101014]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101014]/80 to-transparent" />

              <div className="relative flex min-h-[320px] max-w-2xl flex-col items-start justify-center p-6 sm:min-h-[400px] sm:p-12">
                <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                  {isSearchMode
                    ? "Search highlight"
                    : activeSection === "tv"
                      ? "Featured series"
                      : "Featured movie"}
                </span>

                <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">
                  {featuredMovie.Title}
                </h2>

                <p className="mt-3 text-gray-300">{featuredMovie.Year}</p>

                <p className="mt-4 max-w-lg text-sm leading-6 text-gray-300">
                  Discover more about this{" "}
                  {activeSection === "tv" ? "series" : "movie"}.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMovieId(featuredMovie.imdbID)}
                    className="rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
                  >
                    View details
                  </button>

                  <FavoriteButton
                    movie={featuredMovie}
                    isFavorite={favoriteMovies.some(
                      (item) => item.imdbID === featuredMovie.imdbID,
                    )}
                    onToggleFavorite={toggleFavorite}
                  />
                </div>
              </div>
            </section>
          )}

        {/* Movie and TV show collections */}
        {!displayedLoading &&
          !displayedError &&
          (showMyList || displayedMovies.length > 0) && (
            <section>
              <div className="mb-6 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                    {showMyList
                      ? "Your saved favourites"
                      : isSearchMode
                        ? "Your search"
                        : activeSection === "tv"
                          ? "Explore series"
                          : "Curated for you"}
                  </p>

                  <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                    {showMyList
                      ? "My List"
                      : isSearchMode
                        ? `Results for "${searchMovie.trim()}"`
                        : activeSection === "tv"
                          ? "Discover TV Shows"
                          : "Discover Movies"}
                  </h2>
                </div>

                <span className="text-sm text-gray-500">
                  {displayedMovies.length} titles
                </span>
              </div>

              {showMyList && favoriteMovies.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#1a1a21] px-6 py-12 text-center">
                  <p className="text-4xl text-red-400">♡</p>

                  <h3 className="mt-4 text-xl font-bold">Your list is empty</h3>

                  <p className="mt-2 text-gray-400">
                    Save movies and TV shows you love, and they will appear
                    here.
                  </p>

                  <button
                    type="button"
                    onClick={showHome}
                    className="mt-5 rounded-lg bg-red-600 px-5 py-3 font-semibold transition hover:bg-red-500"
                  >
                    Explore movies
                  </button>
                </div>
              ) : (
                <MovieCard
                  allMovieData={otherMovies}
                  loading={displayedLoading}
                  onMovieClick={setSelectedMovieId}
                  favoriteMovies={favoriteMovies}
                  onToggleFavorite={toggleFavorite}
                />
              )}

              {!showMyList && otherMovies.length === 0 && (
                <p className="py-8 text-center text-gray-400">
                  This is the only result. Search for another title!
                </p>
              )}
            </section>
          )}
      </main>

      {/* Shared details modal for movies and series */}
      {selectedMovieId && (
        <MovieDetailsModal
          imdbID={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
          isFavorite={favoriteMovies.some(
            (item) => item.imdbID === selectedMovieId,
          )}
          onToggleFavorite={toggleFavorite}
        />
      )}

      <footer className="border-t border-white/10 px-4 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ShowTym. Made for movie lovers 🎬
      </footer>
    </div>
  );
}

export default App;
