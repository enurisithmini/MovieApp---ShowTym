import React from "react";

export default function FavoriteButton({
  movie,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <button
      type="button"
      onClick={() => onToggleFavorite(movie)}
      aria-label={
        isFavorite
          ? `Remove ${movie.Title} from My List`
          : `Add ${movie.Title} to My List`
      }
      aria-pressed={isFavorite}
      className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold transition ${
        isFavorite
          ? "border-red-500/40 bg-red-500/15 text-red-300 hover:bg-red-500/25"
          : "border-white/10 bg-white/5 text-gray-300 hover:border-red-500/50 hover:text-white"
      }`}
    >
      {isFavorite ? "♥ Saved" : "♡ My List"}
    </button>
  );
}
