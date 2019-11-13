import React from 'react'

fetch('/api/weather')
  .then(res => res.json())
  .then(res => console.log(res))
  .catch(err => console.log(err))

const Home = () => (
  <div className='homeWrapper'>
    <main className='hero'>
      <h1>Home Page</h1>
    </main>
  </div>
)

export default Home