import React from 'react'
import axios from 'axios'
import Auth from '../../lib/auth'

class RouteOptions extends React.Component {
  constructor() {
    super()
    this.GetJourneyAddUser = this.GetJourneyAddUser.bind(this)
  }

  GetJourneyAddUser() {
    //get route start and end from routeData
    const start = this.props.routeData.routes[0].route_parts[0].from_point_name.replace(/ /gi,'+')
    const idx = this.props.routeData.routes[0].route_parts.length - 1
    const end = this.props.routeData.routes[0].route_parts[idx].to_point_name.replace(/ /gi,'+')
    //attempt to fetch from db
    axios.get(`/api/journeys/${start}&${end}/`, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      .then(res => {
        console.log('respone in GetJourneyAddUser', res.data)
        // if found add user
        axios.patch(`api/journeys/${res.data.id}/`, {}, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
          .then(res => console.log('data from add user patch: ', res.data))
          .catch(err => console.log('err in add user patch:', err))
      })
      //if none found create it
      .catch(err => {
        console.log('err in search journey: ', err)
        //create the journey in db
        axios.post('api/journeys', { start: start, end: end }, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
          .then(res => {
            console.log('data from journey create: ', res.data)
            //then add user
            axios.patch(`api/journeys/${res.data.id}/`, {}, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
              .then(res => console.log('data from add user patch: ', res.data))
              .catch(err => console.log('err in add user patch:', err))
          })
          .catch(err => console.log('err in create journey: ', err))
      })
  }

  render() {
    console.log('data in RouteOptions: ', this.props.routeData)
    return (
      <div className='panelWrapper'>
        <button onClick={this.GetJourneyAddUser}>Like</button>
      </div>
    )
  }
}

export default RouteOptions

