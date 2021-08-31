import React, { Component } from 'react';
import './App.css';
import Posters from './Posters'
import Movie from './Movie'
import {fetchMovies, fetchSingleMovie} from './apiCalls';
import { Router } from 'react-router-dom';

class App extends Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      singleMovie: {},
      error: ''
    }
  }
  
  componentDidMount() {
    fetchMovies()
    .then(data => this.setState({movies: data.movies}))
    .catch(error => this.setState({error: error}))
  }
  
  clickPoster = (id) => {   
    fetchSingleMovie(id)
    .then(data => this.setState({singleMovie: data.movie}))
    .catch(error => this.setState({error: error}))
  }

  clickBackBtn = () => {
    this.setState({singleMovie: {}})
  }

  render() {
    const {movies, singleMovie, error} = this.state;
    
    return (
      <main className="App">
        <h1 className="App-header">Rancid Tomatillos</h1>

        {error && <h2>{error}</h2>}
        
        {!movies.length && <p>Hang Tight!</p>}

        
        <Posters posters={movies} clickPoster={this.clickPoster} />
        <Movie movie={singleMovie} clickBackBtn={this.clickBackBtn} />
      </main>
    );
  }
} 

export default App;

// {!Object.keys(this.state.singleMovie).length ?
//   <Posters posters={this.state.movies} clickPoster={this.clickPoster} /> :
//   <Movie movie={this.state.singleMovie} clickBackBtn={this.clickBackBtn} />
// }