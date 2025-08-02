// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import Footer from './components/Footer';

const API_KEY = '4baa4acd4485fef0d85d661cf5577e1f'; 
function App() {
  const [movies, setMovies] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedMovieTitle, setSelectedMovieTitle] = useState('');

  const imageBase = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    fetchMovies();
    fetchGenres();
  }, []);

  const fetchMovies = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}`);
    setMovies(res.data.results);
  };

  const fetchGenres = async () => {
    const res = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`);
    setGenres(res.data.genres);
  };

  const searchMovies = async () => {
    if (!searchTerm.trim()) {
      fetchMovies();
      return;
    }
    const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${searchTerm}`);
    setMovies(res.data.results);
  };

  const filterByGenre = async (genreId) => {
    setSelectedGenre(genreId);
    const res = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`);
    setMovies(res.data.results);
  };

  const fetchTrailer = async (movieId, movieTitle) => {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}`);
      const trailer = res.data.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      if (trailer) {
        setTrailerKey(trailer.key);
        setSelectedMovieTitle(movieTitle);
        setTimeout(() => {
          document.querySelector('.trailer')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        alert('Trailer not available');
      }
    } catch (err) {
      alert('Error fetching trailer');
    }
  };

  return (
    <div className="app">
      <h1>Trailer Watcher</h1>
<div className="stars">
  {[...Array(300)].map((_, i) => {
    const size = Math.random() * 3 + 1; // 1px to 4px
    return (
      <div
        key={i}
        className="star"
        style={{
          left: `${Math.random() * 100}vw`,
          top: `${Math.random() * 100 + 100}vh`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${Math.random() * 8 + 4}s`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      ></div>
    );
  })}
</div>


      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>

        <select onChange={(e) => filterByGenre(e.target.value)} value={selectedGenre}>
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      <div className="movie-grid">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card" onClick={() => fetchTrailer(movie.id, movie.title)}>
            <img src={`${imageBase}${movie.poster_path}`} alt={movie.title} />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>

      {trailerKey && (
        <div className="trailer">
          <h2>{selectedMovieTitle} - Trailer</h2>
          <iframe
            width="100%"
            height="450"
            src={`https://www.youtube.com/embed/${trailerKey}`}
            allowFullScreen
          ></iframe>
          <button onClick={() => setTrailerKey(null)}>Close Trailer</button>
        </div>
      )}
    <Footer/>
    </div>
  );
}

export default App;
