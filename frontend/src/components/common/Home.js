import React from 'react'
import MapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

import Navbar from './Navbar'
import Directions from './Directions'
import UsersDisplay from './UsersDisplay'
import Comments from './Comments'

import Auth from '../../lib/auth'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      routeData: {},
      savedJourney: {},
      journeyId: null,
      viewport: {
        width: '60vw',
        height: '60vh',
        latitude: 51.5176,
        longitude: -0.1145,
        zoom: 8
      }
    }
    this.addRouteLayers = this.addRouteLayers.bind(this)
    this.saveJourney = this.saveJourney.bind(this)
  }

  initJourney() {
    axios.get('/api/closestsun')
      .then(res => {
        this.setState({ routeData: res.data })
      })
      .then(() => this.addRouteLayers())
      .then(() => this.saveJourney())
      .catch(err => console.log('err in closestsun: ', err))
  }

  addRouteLayers() {
    const map = this.reactMap.getMap()
    console.log(this.state.routeData)
    console.log(this.state.routeData.routes[0].route_parts)
    this.state.routeData.routes[0].route_parts.map((part, i) => {
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
    this.initJourney()
  }

  saveJourney() {
    //get route start and end from routeData
    const start = this.state.routeData.routes[0].route_parts[0].from_point_name.replace(/ /gi,'+')
    const idx = this.state.routeData.routes[0].route_parts.length - 1
    const end = this.state.routeData.routes[0].route_parts[idx].to_point_name.replace(/ /gi,'+')
    if (Auth.isAuthenticated()) {
      //attempt to fetch from db
      axios.get(`/api/journeys/${start}&${end}/`, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
        .then(res => {
          console.log('response in saveJourney: ', res.data)
          this.setState({ journeyId: res.data.id, savedJourney: res.data })
        })
        .catch(err => {
          console.log('err in search journey: ', err)
          //if none found create it
          axios.post('api/journeys', { start: start, end: end }, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
            .then(res => {
              console.log('data from journey create: ', res.data)
              this.setState({ journeyId: res.data.id, savedJourney: res.data })
            })
            .catch(err => console.log('err in create journey: ', err))
        })
    }
  }
  
  render() {
    return (
      <>
        <Navbar/>
        <MapGL
          ref={(reactMap) => this.reactMap = reactMap}
          mapStyle='mapbox://styles/mapbox/streets-v10'
          mapboxApiAccessToken={'pk.eyJ1IjoibGxveWRub29uZSIsImEiOiJjazJ5cDdtNDcwNnB0M2NzMGE0cnVvMzM3In0.CWXt1hTNT_ZhbbOniB4QIA'}
          {...this.state.viewport}
          onViewportChange={(viewport) => this.setState({ viewport })}
        /> 
        {this.state.journeyId && 
          <>
            <Directions routeData={this.state.routeData}/>
            {Auth.isAuthenticated() && 
              <>
                <UsersDisplay routeId={this.state.journeyId} routeData={this.state.savedJourney}/>
                <Comments savedJourney={this.state.savedJourney} comments={this.state.savedJourney.comments}/>
              </>
            }
          </>
        }
      </>
    )
  }
}

export default Home

  