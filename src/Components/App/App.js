import React, { Component } from 'react';
import './App.css';
import Error from '../Error/Error';
import Loader from '../Loader/Loader';
import Posters from '../Posters/Posters';
import Movie from '../Movie/Movie';
import { getMovies } from '../../utilities/apiCalls';
import { cleanPosterData } from '../../utilities/dataCleaning';
import { Route, Link } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      error: '',
      page: 0,
      totalPages: 1,
      isLoadingMore: false
    }
  }
  
  componentDidMount = () => {
    this.loadMovies(1);
  }

  loadMovies = (page) => {
    const isInitialLoad = page === 1;

    if (!isInitialLoad) {
      if (this.state.isLoadingMore || this.state.page >= this.state.totalPages) {
        return;
      }

      this.setState({ isLoadingMore: true });
    }

    getMovies(page)
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
          isLoadingMore: false
        }));
      })
      .catch(error => {
        if (isInitialLoad) {
          this.setState({ error: error.message, isLoadingMore: false });
        } else {
          this.setState({ isLoadingMore: false });
        }
      });
  }

  loadNextPage = () => {
    this.loadMovies(this.state.page + 1);
  }

  conditionalPostersDisplay = () => {
    const { movies, error, page, totalPages, isLoadingMore } = this.state;

    return error ? <Error message={error} page='movies' /> 
      : !movies.length ? <Loader item='movie posters are' />
      : <Posters
          posters={movies}
          onLoadMore={this.loadNextPage}
          isLoadingMore={isLoadingMore}
          hasMore={page < totalPages}
        />
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
              <h1 className="App-title">
                <span className="App-title-rancid">Rancid</span>
                <span className="App-title-tomatillos">Tomatillos</span>
              </h1>
              <p className="App-tagline">Fresh picks &amp; rotten flops</p>
            </div>
          </Link>
        </header>
        
        <Route exact path='/' 
          render={() => this.conditionalPostersDisplay()}
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
