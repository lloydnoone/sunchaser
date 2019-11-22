import React from 'react'

class LoadingScreen extends React.Component {
  constructor() {
    super()

  }

  render() {
    return (
      <>
        <div className='loadingScreen'>
          <div className='rotatingSun'></div>
          <h1>Calculating route to clear skies...</h1>
        </div>
      </>
    )
  }
}

export default LoadingScreen