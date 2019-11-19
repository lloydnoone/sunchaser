import React from 'react'

class Directions extends React.Component {
  constructor() {
    super()

    this.state = {
      direction: ''
    }

  }

  directionString(part) {
    let direction = null
    if (part.mode === 'foot') {
      direction = `Walk to ${part.to_point_name}`
    } else {
      direction = `Take the ${part.mode} to ${part.to_point_name}`
    }
    return direction
  }

  render() {
    return (
      <>
        {this.props.routeData.routes[0] &&
        <div className='directionsWrapper'>
          <div className='panelWrapper'>
            <h2>Directions</h2>
            {this.props.routeData.routes[0].route_parts.map((part, i) => (        
              <div className='routePart' key={i}>
                <p>{this.directionString(part)}</p>
              </div>
            ))}
          </div>
        </div>
        }
      </>
    )
  }
}

export default Directions

