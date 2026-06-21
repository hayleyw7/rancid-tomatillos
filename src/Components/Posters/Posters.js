import React, { Component } from 'react';
import './Posters.css';
import { Link } from 'react-router-dom';

class Posters extends Component {
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

  render() {
    const { posters, hasMore, isLoadingMore } = this.props;

    const moviePosters = posters.map(poster => {
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
