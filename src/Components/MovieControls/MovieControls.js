import React from 'react';
import './MovieControls.css';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' }
];

const RATING_OPTIONS = [
  { value: 'all', label: 'All Ratings' },
  { value: 'fresh', label: 'Fresh (7+)' },
  { value: 'mixed', label: 'Mixed (5–6.9)' },
  { value: 'rotten', label: 'Rotten (<5)' }
];

const MovieControls = ({ sortBy, genreId, ratingFilter, genres, onSortChange, onGenreChange, onRatingChange }) => {
  return (
    <section className='movie-controls' aria-label='Movie filters and sorting'>
      <div className='movie-controls__group'>
        <label className='movie-controls__label' htmlFor='sort-by'>Sort by</label>
        <select
          id='sort-by'
          className='movie-controls__select'
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      <div className='movie-controls__group'>
        <label className='movie-controls__label' htmlFor='genre-filter'>Genre</label>
        <select
          id='genre-filter'
          className='movie-controls__select'
          value={genreId}
          onChange={(event) => onGenreChange(event.target.value)}
        >
          <option value=''>All Genres</option>
          {genres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
      </div>

      <div className='movie-controls__group'>
        <label className='movie-controls__label' htmlFor='rating-filter'>Rating</label>
        <select
          id='rating-filter'
          className='movie-controls__select'
          value={ratingFilter}
          onChange={(event) => onRatingChange(event.target.value)}
        >
          {RATING_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    </section>
  );
};

export default MovieControls;
