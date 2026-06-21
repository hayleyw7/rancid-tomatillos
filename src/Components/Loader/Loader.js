import React from 'react'
import './Loader.css';

const Loader = ({ item }) => {
  return (
    <div className='loader-container'>
      <h2 className='loader-heading'>Hang tight!</h2>
      <p>The {item} loading.</p>
      <div
        className='loader-icon'
        role='status'
        aria-label='Loading'
      />
    </div>
  )
}

export default Loader;
