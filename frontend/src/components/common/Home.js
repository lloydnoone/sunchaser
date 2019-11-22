import React from 'react'
import MapGL from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import axios from 'axios'

import Navbar from './Navbar'
import Directions from './Directions'
import UsersDisplay from './UsersDisplay'
import Comments from './Comments'
import LandingMessage from './LandingMessage'
import LoadingScreen from './LoadingScreen'

import Auth from '../../lib/auth'

class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      routeData: {},
      savedJourney: {},
      journeyId: null,
      logout: true,
      viewport: {
        width: '100vw',
        height: '90vh',
        latitude: 51.5176,
        longitude: -0.1145,
        zoom: 8
      }
    }
    this.addRouteLayers = this.addRouteLayers.bind(this)
    this.saveJourney = this.saveJourney.bind(this)
    this.resizeMap = this.resizeMap.bind(this)
    this.setLogoutFlag = this.setLogoutFlag.bind(this)
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
    const modeColor = {
      foot: '#fa7d5e',
      bus: 'rgba(243, 120, 4, 0.663)',
      train: '#f37703',
      tube: '#e2d523',
      Bakerloo: '#996633',
      Central: '#CC3333',
      Circle: '#FFCC00',
      District: '#006633',
      HammersmithAndCity: '#CC9999',
      Jubilee: '#868F98',
      Metropolitan: '#660066',
      Northern: '#000000',
      Piccadilly: '#000099',
      Victoria: '#0099CC',
      WaterlooAndCity: '#66CCCC',
      DLR: '#009999',
      Overground: '#FF6600',
      Tramlink: '#66CC00',
      CableCar: '#E21836',
      Crossrail: '#7156A'
    }
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
            'line-color': modeColor[part.mode],
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
    const start = this.state.routeData.routes[0].route_parts[0].from_point_name.replace(/[ |(|)|/&-]/gi,'')
    const idx = this.state.routeData.routes[0].route_parts.length - 1
    const end = this.state.routeData.routes[0].route_parts[idx].to_point_name.replace(/[ |(|)|/&-]/gi,'')
    if (Auth.isAuthenticated()) { // dont save or create journeys if not logged in
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

  resizeMap() {
    if (this.reactMap) console.log('map should resize. ')
  }

  setLogoutFlag() {
    this.setState({ logout: !this.state.logout })
  }
  
  render() {
    return (
      <>
        <Navbar saveJourney={this.saveJourney} setLogoutFlag={this.setLogoutFlag}/>
        <div className='mapWrapper'>
          <MapGL
            ref={(reactMap) => this.reactMap = reactMap}
            mapStyle='mapbox://styles/lloydnoone/ck369hbrp0m6q1cscaf67emiu'
            mapboxApiAccessToken={'pk.eyJ1IjoibGxveWRub29uZSIsImEiOiJjazJ5cDdtNDcwNnB0M2NzMGE0cnVvMzM3In0.CWXt1hTNT_ZhbbOniB4QIA'}
            {...this.state.viewport}
            onViewportChange={(viewport) => this.setState({ viewport })}
            mapContainer='mapWrapper'
            onResize={this.resizeMap}
          /> 
        </div>  
        <div className={'infoOverlay'}>
          {!this.state.routeData.routes && <LoadingScreen/>}
          {this.state.routeData.routes && 
            <>
              <Directions routeData={this.state.routeData} />
              {!Auth.isAuthenticated() && <LandingMessage/>}
            </>
          }
          {this.state.journeyId &&
            <>
              {Auth.isAuthenticated() &&
                <div className='options'>
                  <UsersDisplay routeId={this.state.journeyId} routeData={this.state.savedJourney} />
                  <Comments savedJourney={this.state.savedJourney} comments={this.state.savedJourney.comments} />
                </div>
              }
            </>
          }
        </div>
      </>
    )
  }
}

export default Home

  