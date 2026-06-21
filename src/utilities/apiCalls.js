const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original';
const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;

export const getData = (url) => {
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json()
      } else if (response.status === 404) {
        throw Error('404 error ("We looked but did not find anything in that spot") - Head back, and try again.')
      } else if (response.status === 500) {
        throw Error('500 error ("It\'s not you; it\'s me") -  Please try again soon.')
      } else {
        throw Error('Other error - Something miscellaneous went wrong.')
      }
    })
}

const buildImageUrl = (path) => {
  if (!path) {
    return '';
  }

  return `${TMDB_IMAGE_BASE_URL}${path}`;
}

const tmdbFetch = (endpoint, params = {}) => {
  if (!TMDB_API_KEY) {
    return Promise.reject(
      Error('Missing TMDB API key - add REACT_APP_TMDB_API_KEY to your .env file (local) or GitHub repo secrets (deploy).')
    );
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    ...params
  });

  return getData(`${TMDB_BASE_URL}${endpoint}?${searchParams}`);
}

const formatMovieSummary = (movie) => ({
  id: movie.id,
  poster_path: buildImageUrl(movie.poster_path),
  backdrop_path: buildImageUrl(movie.backdrop_path),
  title: movie.title,
  average_rating: movie.vote_average,
  release_date: movie.release_date
});

export const getMovies = (page = 1) => {
  return tmdbFetch('/movie/popular', { page })
    .then(data => ({
      movies: data.results.map(formatMovieSummary),
      page: data.page,
      totalPages: data.total_pages
    }));
}

export const getMovieById = (movieID) => {
  return tmdbFetch(`/movie/${movieID}`)
    .then(data => ({
      movie: {
        id: data.id,
        title: data.title,
        poster_path: buildImageUrl(data.poster_path),
        backdrop_path: buildImageUrl(data.backdrop_path),
        release_date: data.release_date,
        overview: data.overview,
        genres: data.genres.map(genre => genre.name),
        runtime: data.runtime,
        tagline: data.tagline,
        average_rating: data.vote_average
      }
    }));
}
