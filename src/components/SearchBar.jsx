import React from 'react'

export default function SearchBar({ searchMovie, setSearchMovie, fetchMovieData }) {
  return (
    <div className='main flex justify-center items-center py-4'>
        <input 
          type="text" 
          placeholder='Search for movies, TV shows...' 
          className='w-1/4 px-4 py-2 rounded-md border border-gray-400 text-gray-700 text-lg focus:outline-none focus:ring-2 focus:ring-blue-300' 
          value={searchMovie}
          onChange={(e) => setSearchMovie(e.target.value)}
        />
        <button 
          className='ml-2 px-4 py-2 bg-gray-700 text-white text-lg rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-700'
          onClick={fetchMovieData}>
          Search
        </button>
    </div>
  )
}
