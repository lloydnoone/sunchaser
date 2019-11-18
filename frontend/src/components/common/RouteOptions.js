import React from 'react'

class RouteOptions extends React.Component {
  constructor() {
    super()
  }

  render() {
    return (
      <div className='panelWrapper'>
        <button onClick={this.props.onClick}>Like</button>
      </div>
    )
  }
}

export default RouteOptions

