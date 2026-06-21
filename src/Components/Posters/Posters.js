import React, { Component } from 'react';
import './Posters.css';
import { Link } from 'react-router-dom';

class Posters extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hiddenPosterIds: []
    };
  }

  componentDidUpdate(prevProps) {
    const listWasReset = this.props.posters.length < prevProps.posters.length
      || (prevProps.posters.length > 0 && this.props.posters[0]?.id !== prevProps.posters[0]?.id);

    if (listWasReset && this.state.hiddenPosterIds.length) {
      this.setState({ hiddenPosterIds: [] });
    }
  }

  componentWillUnmount() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  setSentinelRef = (node) => {
    if (this.observer && this.sentinel) {
      this.observer.unobserve(this.sentinel);
    }

    this.sentinel = node;

    if (!this.observer) {
      this.observer = new IntersectionObserver(this.handleIntersect, { rootMargin: '200px' });
    }

    if (node) {
      this.observer.observe(node);
    }
  }

  handleIntersect = (entries) => {
    const { onLoadMore, hasMore, isLoadingMore } = this.props;

    if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }

  handleImageError = (id) => {
    this.setState(prevState => {
      if (prevState.hiddenPosterIds.includes(id)) {
        return null;
      }

      return { hiddenPosterIds: [...prevState.hiddenPosterIds, id] };
    });
  }

  render() {
    const { posters, hasMore, isLoadingMore } = this.props;
    const { hiddenPosterIds } = this.state;

    const visiblePosters = posters.filter(poster => !hiddenPosterIds.includes(poster.id));

    const moviePosters = visiblePosters.map(poster => {
      const { id, poster_path, title } = poster;

      return (
        <Link
          to={`/${id}`}
          key={id}
        >
          <img
            src={poster_path}
            className='poster-icon'
            alt={`${title} Movie Poster and Button`}
            id={id}
            onError={() => this.handleImageError(id)}
          />
        </Link>
      )
    })

    return (
      <section className='posters-container'>
        {moviePosters}
        {hasMore && <div ref={this.setSentinelRef} className='scroll-sentinel' aria-hidden='true' />}
        {isLoadingMore && <p className='loading-more'>Loading more movies...</p>}
      </section>
    )
  }
}

export default Posters;
