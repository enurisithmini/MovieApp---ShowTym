import React, { useEffect, useState } from "react";
import FavoriteButton from "./FavoriteButton";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function MovieDetailsModal({
  imdbID,
  onClose,
  isFavorite,
  onToggleFavorite,
}) {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!imdbID) return;

    const controller = new AbortController();

    async function fetchMovieDetails() {
      try {
        setLoading(true);
        setError("");
        setMovie(null);

        const params = new URLSearchParams({
          i: imdbID,
          plot: "full",
          apikey: API_KEY,
        });

        const response = await fetch(`https://www.omdbapi.com/?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Could not fetch movie details.");
        }

        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);
        } else {
          setError(data.Error || "Movie details could not be found.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Movie details error:", err);
          setError("Something went wrong. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchMovieDetails();

    return () => controller.abort();
  }, [imdbID]);

  // Close the modal using the Escape key.
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const posterAvailable = movie?.Poster && movie.Poster !== "N/A";

  const imdbRating = movie?.Ratings?.find(
    (rating) => rating.Source === "Internet Movie Database",
  )?.Value;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#17171e] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Movie details"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close movie details"
          className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white transition hover:bg-red-600"
        >
          ×
        </button>

        {loading && (
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-red-500" />
              <p className="mt-4 text-gray-400">Loading movie details...</p>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-20 text-center">
            <p className="text-lg font-semibold text-red-400">{error}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2 font-semibold hover:bg-red-500"
            >
              Close
            </button>
          </div>
        )}

        {!loading && movie && (
          <>
            {/* Cinematic background */}
            <div className="relative min-h-[300px] overflow-hidden sm:min-h-[360px]">
              {posterAvailable && (
                <img
                  src={movie.Poster}
                  alt=""
                  className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-xl"
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#17171e] via-[#17171e]/70 to-black/30" />

              <div className="relative flex min-h-[300px] items-end gap-5 p-6 sm:min-h-[360px] sm:gap-8 sm:p-10">
                {/* Movie poster */}
                <div className="hidden w-40 shrink-0 overflow-hidden rounded-xl shadow-2xl sm:block md:w-48">
                  {posterAvailable ? (
                    <img
                      src={movie.Poster}
                      alt={`${movie.Title} poster`}
                      className="w-full object-cover"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] items-center justify-center bg-[#292933] text-center text-sm text-gray-400">
                      Poster unavailable
                    </div>
                  )}
                </div>

                {/* Main movie information */}
                <div className="min-w-0 pb-2">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                    Movie details
                  </p>

                  <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
                    {movie.Title}
                  </h2>

                  <p className="mt-3 text-sm text-gray-300 sm:text-base">
                    {movie.Year}
                    {movie.Rated !== "N/A" && ` • ${movie.Rated}`}
                    {movie.Runtime !== "N/A" && ` • ${movie.Runtime}`}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    {imdbRating && (
                      <span className="rounded-lg bg-yellow-500/15 px-3 py-2 text-sm font-bold text-yellow-400">
                        ⭐ IMDb {imdbRating}
                      </span>
                    )}

                    {movie.imdbVotes !== "N/A" && (
                      <span className="text-sm text-gray-400">
                        {movie.imdbVotes} votes
                      </span>
                    )}
                  </div>

                  {/* Poster on smaller screens */}
                  <div className="mt-5 flex gap-3 sm:hidden">
                    {posterAvailable && (
                      <img
                        src={movie.Poster}
                        alt={`${movie.Title} poster`}
                        className="w-24 rounded-lg shadow-xl"
                      />
                    )}
                    <div className="flex flex-col justify-end">
                      <p className="text-sm text-gray-400">{movie.Genre}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed information */}
            <div className="space-y-6 px-6 pb-8 sm:px-10">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-red-400">
                  Overview
                </p>
                <p className="text-sm leading-7 text-gray-300 sm:text-base">
                  {movie.Plot !== "N/A"
                    ? movie.Plot
                    : "No plot summary is available."}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 border-y border-white/10 py-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Genre
                  </p>
                  <p className="mt-2 text-sm text-gray-200">
                    {movie.Genre || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Director
                  </p>
                  <p className="mt-2 text-sm text-gray-200">
                    {movie.Director || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Main cast
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {movie.Actors || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    Writer
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    {movie.Writer || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <span>Released: {movie.Released}</span>
                <span>•</span>
                <span>Language: {movie.Language}</span>
                {movie.BoxOffice !== "N/A" && (
                  <>
                    <span>•</span>
                    <span>Box office: {movie.BoxOffice}</span>
                  </>
                )}
              </div>

              <div className="max-w-xs">
                <FavoriteButton
                  movie={movie}
                  isFavorite={isFavorite}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
