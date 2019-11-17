import React from 'react'

class UsersDisplay extends React.Component {
  constructor() {
    super()

    this.state = {
      
    }

  }

  render() {
    return (
      <>
        {this.props.routeData.routes[0] &&
          <div className='panelWrapper'>
            <h2>Directions</h2>
            {this.props.routeData.routes[0].route_parts.map((part, i) => (        
              <div className='routePart' key={i}>
                <p>{this.directionString(part)}</p>
              </div>
            ))}
          </div>
        }
      </>
    )
  }
}

export default UsersDisplay