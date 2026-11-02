
import React from 'react'

export default function SearchBar({
  searchMovie,
  setSearchMovie,
  fetchMovieData
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    fetchMovieData(searchMovie)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-2xl gap-3 px-4"
    >
      <input
        type="text"
        placeholder="Search movies..."
        aria-label="Search movies"
        value={searchMovie}
        onChange={(e) => setSearchMovie(e.target.value)}
        className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#202027] px-4 py-3 text-white outline-none placeholder:text-gray-500 transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
      />

      <button
        type="submit"
        className="rounded-xl bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-500 active:scale-95"
      >
        Search
      </button>
    </form>
  )
}
