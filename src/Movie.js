import React from 'react';
import './Movie.css';

const Movie = ({ movie, clickBackBtn }) => {

  let {id, title, backdrop_path, average_rating, tagline, overview, genres, runtime, budget, release_date, revenue} = movie;

  return (
    <section className='movie-background' style={{ backgroundImage: `url(${backdrop_path})` }}>
      <section className='movie-card'>
        <h2>{title}</h2>
        <p>★ {average_rating}</p>
        <p>{tagline}</p>
        <p>{overview}</p>
        <p>{genres}</p>
        <p>{runtime}</p>
        <p>{budget}</p>
        <p>{release_date}</p>
        <p>{revenue}</p>
        <button
          className='back-button'
          onClick={() => clickBackBtn()}
        >BACK</button>
      </section>
    </section>
  )
}

export default Movie;
