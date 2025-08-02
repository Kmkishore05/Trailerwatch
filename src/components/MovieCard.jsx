import React, { useState } from 'react';
import './MovieCard.css';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie, onClick }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="movie-card" onClick={onClick}>
      <img
        src={movie.poster_path ? IMG_BASE + movie.poster_path : 'https://via.placeholder.com/150'}
        alt={movie.title}
      />
      <h3>{movie.title}</h3>
      <p>⭐ TMDb: {movie.vote_average}</p>
      <div className="stars">
        {[1, 2, 3, 4, 5].map((i) => (
          <span
            key={i}
            onClick={(e) => {
              e.stopPropagation(); // Prevent trailer from opening
              setRating(i);
            }}
            className={i <= rating ? 'star filled' : 'star'}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
};

export default MovieCard;
