import React from "react";

export default function Navbar({
  activeSection,
  onHomeClick,
  onMoviesClick,
  onTVShowsClick,
  onMyListClick,
}) {
  const navClass = (section) =>
    `transition hover:text-red-400 ${
      activeSection === section ? "font-semibold text-red-400" : "text-gray-300"
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#101014]/95 text-white backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 lg:px-10">
        {/* Logo */}
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-xl shadow-lg shadow-red-900/30">
            🎬
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Show<span className="text-red-500">Tym</span>
          </h1>
        </button>

        {/* Navigation */}
        <ul className="flex flex-wrap items-center gap-4 text-sm font-medium sm:gap-7">
          <li>
            <button
              type="button"
              onClick={onHomeClick}
              className={navClass("movies")}
            >
              Home
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={onMoviesClick}
              className={navClass("movies")}
            >
              Movies
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={onTVShowsClick}
              className={navClass("tv")}
            >
              TV Shows
            </button>
          </li>

          <li>
            <button
              type="button"
              onClick={onMyListClick}
              aria-pressed={activeSection === "my-list"}
              className={navClass("my-list")}
            >
              ♥ My List
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
