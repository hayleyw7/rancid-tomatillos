import React, { Component } from 'react';
import './App.css';
import Error from '../Error/Error';
import Loader from '../Loader/Loader';
import Posters from '../Posters/Posters';
import Movie from '../Movie/Movie';
import MovieControls from '../MovieControls/MovieControls';
import '../MovieControls/MovieControls.css';
import { getGenres, getMovies } from '../../utilities/apiCalls';
import { cleanPosterData } from '../../utilities/dataCleaning';
import { Route, Link, withRouter } from 'react-router-dom';

const BROWSE_SESSION_KEY = 'rancid-browse-session';
const DEFAULT_FILTERS = {
  sortBy: 'popularity.desc',
  genreId: '',
  ratingFilter: 'all'
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      genres: [],
      error: '',
      page: 0,
      totalPages: 1,
      isLoadingMore: false,
      isInitialLoading: true,
      ...DEFAULT_FILTERS
    };
    this.previousPathname = '/';
  }
  
  componentDidMount = () => {
    const { pathname } = this.props.location;
    this.previousPathname = pathname;

    getGenres()
      .then(genres => this.setState({ genres }))
      .catch(() => this.setState({ genres: [] }));

    if (pathname === '/') {
      sessionStorage.removeItem(BROWSE_SESSION_KEY);
      this.loadMovies(1);
    } else if (this.isMoviePath(pathname)) {
      this.restoreMoviesFromSession();
    }

    this.unlisten = this.props.history.listen(this.handleNavigation);
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten();
    }
  }

  isMoviePath = (pathname) => {
    return /^\/\d+$/.test(pathname);
  }

  saveBrowseSession = () => {
    const { sortBy, genreId, ratingFilter, movies, page, totalPages } = this.state;

    sessionStorage.setItem(BROWSE_SESSION_KEY, JSON.stringify({
      sortBy,
      genreId,
      ratingFilter,
      movies,
      page,
      totalPages,
      scrollY: window.scrollY
    }));
  }

  restoreBrowseSession = () => {
    const saved = sessionStorage.getItem(BROWSE_SESSION_KEY);

    if (!saved) {
      if (!this.state.movies.length) {
        this.loadMovies(1);
      }

      return;
    }

    const data = JSON.parse(saved);

    this.setState({
      sortBy: data.sortBy,
      genreId: data.genreId,
      ratingFilter: data.ratingFilter,
      movies: data.movies,
      page: data.page,
      totalPages: data.totalPages,
      isInitialLoading: false,
      isLoadingMore: false,
      error: ''
    }, () => {
      window.scrollTo(0, data.scrollY || 0);
    });
  }

  handleNavigation = (location) => {
    const nextPath = location.pathname;
    const prevPath = this.previousPathname;

    if (nextPath === '/' && this.isMoviePath(prevPath)) {
      this.restoreBrowseSession();
    }

    if (prevPath === '/' && this.isMoviePath(nextPath)) {
      this.saveBrowseSession();
    }

    if (this.isMoviePath(nextPath) && !this.state.movies.length) {
      this.restoreMoviesFromSession();
    }

    this.previousPathname = nextPath;
  }

  restoreMoviesFromSession = () => {
    const saved = sessionStorage.getItem(BROWSE_SESSION_KEY);

    if (!saved) {
      return;
    }

    const data = JSON.parse(saved);

    this.setState({
      sortBy: data.sortBy,
      genreId: data.genreId,
      ratingFilter: data.ratingFilter,
      movies: data.movies,
      page: data.page,
      totalPages: data.totalPages
    });
  }

  loadMovies = (page) => {
    const isInitialLoad = page === 1;
    const { sortBy, genreId, ratingFilter, isLoadingMore, page: currentPage, totalPages } = this.state;

    if (!isInitialLoad) {
      if (isLoadingMore || currentPage >= totalPages) {
        return;
      }

      this.setState({ isLoadingMore: true });
    } else {
      this.setState({ isInitialLoading: true, error: '' });
    }

    getMovies(page, { sortBy, genreId, ratingFilter })
      .then(data => ({
        movies: cleanPosterData(data),
        page: data.page,
        totalPages: data.totalPages
      }))
      .then(data => {
        this.setState(prevState => ({
          movies: isInitialLoad ? data.movies : [...prevState.movies, ...data.movies],
          page: data.page,
          totalPages: data.totalPages,
          isLoadingMore: false,
          isInitialLoading: false
        }));
      })
      .catch(error => {
        if (isInitialLoad) {
          this.setState({ error: error.message, isLoadingMore: false, isInitialLoading: false });
        } else {
          this.setState({ isLoadingMore: false });
        }
      });
  }

  loadNextPage = () => {
    this.loadMovies(this.state.page + 1);
  }

  handleFilterChange = (updates) => {
    this.setState({
      ...updates,
      movies: [],
      page: 0,
      totalPages: 1,
      isLoadingMore: false,
      error: ''
    }, () => this.loadMovies(1));
  }

  handleSortChange = (sortBy) => {
    this.handleFilterChange({ sortBy });
  }

  handleGenreChange = (genreId) => {
    this.handleFilterChange({ genreId });
  }

  handleRatingChange = (ratingFilter) => {
    this.handleFilterChange({ ratingFilter });
  }

  conditionalPostersDisplay = () => {
    const { movies, error, page, totalPages, isLoadingMore, isInitialLoading } = this.state;

    if (error) {
      return <Error message={error} page='movies' />;
    }

    if (isInitialLoading) {
      return <Loader item='movie posters are' />;
    }

    if (!movies.length) {
      return <p className='no-results'>No movies match those filters. Try loosening them up.</p>;
    }

    return (
      <Posters
        posters={movies}
        onLoadMore={this.loadNextPage}
        isLoadingMore={isLoadingMore}
        hasMore={page < totalPages}
      />
    );
  }

  renderMovieControls = () => {
    const { sortBy, genreId, ratingFilter, genres } = this.state;

    return (
      <MovieControls
        sortBy={sortBy}
        genreId={genreId}
        ratingFilter={ratingFilter}
        genres={genres}
        onSortChange={this.handleSortChange}
        onGenreChange={this.handleGenreChange}
        onRatingChange={this.handleRatingChange}
      />
    );
  }

  getNextMovie = (currentId) => {
    const { movies } = this.state;
    const currentIndex = movies.findIndex(movie => Number(movie.id) === Number(currentId));

    if (currentIndex === -1 || currentIndex >= movies.length - 1) {
      return null;
    }

    return movies[currentIndex + 1];
  }

  parseID = (match) => {
    return parseInt(match.params.id);
  }

  render = () => {

    return (
      <main className="App">
        <div className="site-top">
          <header className="App-header">
            <Link to="/" className="App-brand">
              <span className="App-logo" aria-hidden="true">
                <span className="App-logo__fresh" />
                <span className="App-logo__rotten" />
              </span>
              <div className="App-brand-text">
                <h1 className="App-title">Rancid Tomatillos</h1>
                <p className="App-tagline">Fresh picks &amp; rotten flops</p>
              </div>
            </Link>
          </header>

          <Route exact path='/' render={this.renderMovieControls} />
        </div>

        <Route exact path='/' render={() => this.conditionalPostersDisplay()} />

        <Route 
          exact path='/:id' 
          render={({ match }) => {
            const movieID = this.parseID(match);
            return (
              <Movie
                movieID={movieID}
                nextMovie={this.getNextMovie(movieID)}
              />
            );
          }}
        />
      </main>
    );
  }
} 

export default withRouter(App);
