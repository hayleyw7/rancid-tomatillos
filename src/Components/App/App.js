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
import { Route, Link } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      genres: [],
      error: '',
      page: 0,
      totalPages: 1,
      isLoadingMore: false,
      isInitialLoading: true,
      sortBy: 'popularity.desc',
      genreId: '',
      ratingFilter: 'all'
    }
  }
  
  componentDidMount = () => {
    getGenres()
      .then(genres => this.setState({ genres }))
      .catch(() => this.setState({ genres: [] }));

    this.loadMovies(1);
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

  renderPostersPage = () => {
    const { sortBy, genreId, ratingFilter, genres } = this.state;

    return (
      <>
        <MovieControls
          sortBy={sortBy}
          genreId={genreId}
          ratingFilter={ratingFilter}
          genres={genres}
          onSortChange={this.handleSortChange}
          onGenreChange={this.handleGenreChange}
          onRatingChange={this.handleRatingChange}
        />
        {this.conditionalPostersDisplay()}
      </>
    );
  }

  parseID = (match) => {
    return parseInt(match.params.id);
  }

  render = () => {

    return (
      <main className="App">
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
        
        <Route exact path='/' 
          render={() => this.renderPostersPage()}
        />

        <Route 
          exact path='/:id' 
          render={({ match }) => <Movie movieID={this.parseID(match)} />}
        />
        
      </main>
    );
  }
} 

export default App;
