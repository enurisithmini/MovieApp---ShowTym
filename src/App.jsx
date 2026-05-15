import React, { useState, useImperativeHandle, useTransition } from 'react'
import Navbar from './components/Navbar'
import SearchBar from './components/SearchBar'
import MovieCard from './components/MovieCard'

function App() {
  const [allMovieData, setAllMovieData] = useState([]);
  const [searchMovie, setSearchMovie] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://omdbapi.com/?s=${searchMovie}&apikey=268ac102`);
      const data = await response.json();
      setAllMovieData(data.Search);
      console.log(data.Search);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching movie data:', error);
    } 
  };

  return (
    <div>
      <Navbar />
      <div className="bg">
        <SearchBar searchMovie={searchMovie} setSearchMovie={setSearchMovie} fetchMovieData={fetchMovieData} />
        <MovieCard allMovieData={allMovieData} loading={loading} />
      </div>
    </div>
  )
}

export default App
