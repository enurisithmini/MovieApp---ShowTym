import React from "react";
import FavoriteButton from "./FavoriteButton";

export default function MovieCard({
  allMovieData = [],
  loading = false,
  onMovieClick,
  favoriteMovies = [],
  onToggleFavorite,
}) {
  if (loading) {
    return <p className="py-8 text-center text-gray-400">Loading movies...</p>;
  }

  if (allMovieData.length === 0) {
    return (
      <p className="py-8 text-center text-gray-400">No movies to display.</p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
      {allMovieData.map((item) => {
        const isFavorite = favoriteMovies.some(
          (movie) => movie.imdbID === item.imdbID,
        );

        return (
          <article
            key={item.imdbID}
            className="group overflow-hidden rounded-xl border border-white/10 bg-[#1a1a21] shadow-lg transition duration-300 hover:-translate-y-1 hover:border-red-500/50"
          >
            <button
              type="button"
              onClick={() => onMovieClick(item.imdbID)}
              className="block w-full text-left"
              aria-label={`View details for ${item.Title}`}
            >
              <div className="aspect-[2/3] overflow-hidden bg-[#25252d]">
                {item.Poster && item.Poster !== "N/A" ? (
                  <img
                    src={item.Poster}
                    alt={`${item.Title} poster`}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center px-3 text-center text-sm text-gray-500">
                    Poster unavailable
                  </div>
                )}
              </div>

              <div className="p-3 pb-1 sm:p-4 sm:pb-1">
                <h3 className="line-clamp-2 font-bold text-white transition group-hover:text-red-400">
                  {item.Title}
                </h3>

                <p className="mt-2 text-sm text-gray-400">{item.Year}</p>

                <p className="mt-3 text-sm font-semibold text-red-400">
                  View details →
                </p>
              </div>
            </button>

            <div className="px-3 pb-4 pt-3 sm:px-4">
              <FavoriteButton
                movie={item}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
