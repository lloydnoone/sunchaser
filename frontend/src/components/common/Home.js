import React from 'react'
import MapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

// fetch('/api/closestsun')
//   .then(res => res.json())
//   .then(res => console.log(res))
//   .catch(err => console.log(err))

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      data: {},
      viewport: {
        width: '100vw',
        height: '100vh',
        latitude: 51.5176,
        longitude: -0.1145,
        zoom: 8
      }
    }
    this.addRouteLayers = this.addRouteLayers.bind(this)
  }

  getAndSetLayerData() {
    axios.get('/api/closestsun')
      .then(res => {
        this.setState({ data: res.data })
      })
      .then(() => this.addRouteLayers())
      .catch(err => this.setState({ errors: err.response.data.errors }))
  }

  addRouteLayers() {
    console.log('Data inside addRouteLayers(): ', this.state.data)
    const map = this.reactMap.getMap()
    //map.on('load', () => {
    //add the GeoJSON layer here
    this.state.data.routes[0].route_parts.map((part, i) => {
      return (
        map.addLayer({
          'id': `${i}`,
          'type': 'line',
          'source': {
            'type': 'geojson',
            'data': {
              'type': 'Feature',
              'properties': {},
              'geometry': {
                'type': 'LineString',
                'coordinates': part.coordinates
              }
            }
          },
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          },
          'paint': {
            'line-color': '#888',
            'line-width': 8
          }
        })
      )
    })
  }

  componentDidMount() {
    this.getAndSetLayerData()
  }
  
  render() {
    return (
      <MapGL
        ref={(reactMap) => this.reactMap = reactMap}
        mapStyle='mapbox://styles/mapbox/streets-v10'
        mapboxApiAccessToken={'pk.eyJ1IjoibGxveWRub29uZSIsImEiOiJjazJ5cDdtNDcwNnB0M2NzMGE0cnVvMzM3In0.CWXt1hTNT_ZhbbOniB4QIA'}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({ viewport })}
      />
    )
  }
}

export default Home