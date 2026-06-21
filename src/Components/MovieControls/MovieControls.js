import React from 'react';
import CustomSelect from './CustomSelect';
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
  const genreOptions = [
    { value: '', label: 'All Genres' },
    ...genres.map(genre => ({ value: String(genre.id), label: genre.name }))
  ];

  return (
    <section className='movie-controls sub-bar' aria-label='Movie filters and sorting'>
      <div className='movie-controls__filters'>
        <div className='movie-controls__group'>
          <span className='movie-controls__label' id='sort-by-label'>Sort by</span>
          <CustomSelect
            id='sort-by'
            labelId='sort-by-label'
            value={sortBy}
            options={SORT_OPTIONS}
            onChange={onSortChange}
          />
        </div>

        <div className='movie-controls__group'>
          <span className='movie-controls__label' id='genre-filter-label'>Genre</span>
          <CustomSelect
            id='genre-filter'
            labelId='genre-filter-label'
            value={genreId}
            options={genreOptions}
            onChange={onGenreChange}
          />
        </div>

        <div className='movie-controls__group'>
          <span className='movie-controls__label' id='rating-filter-label'>Rating</span>
          <CustomSelect
            id='rating-filter'
            labelId='rating-filter-label'
            value={ratingFilter}
            options={RATING_OPTIONS}
            onChange={onRatingChange}
          />
        </div>
      </div>
    </section>
  );
};

export default MovieControls;
