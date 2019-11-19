import React from 'react'
import axios from 'axios'
import Auth from '../../lib/auth'

class UsersDisplay extends React.Component {
  constructor() {
    super()

    this.state = {
      users: []
    }
    this.addUser = this.addUser.bind(this)
  }

  componentDidMount() {
    const usersArr = [...this.props.routeData.users]
    this.setState({ users: usersArr })
  }

  addUser() {
    // if found add user
    axios.patch(`api/journeys/${this.props.routeData.id}/`, {}, { headers: { Authorization: `Bearer ${Auth.getToken()}` } })
      .then(res => {
        console.log('data from add user patch: ', res.data)
        const usersArr = [...res.data.users]
        this.setState({ users: usersArr })
      })
      .catch(err => console.log('err in add user patch:', err))
    
  }

  render() {
    console.log('users in UsersDisplay: ', this.state.users)
    return (
      <>
        <div className='usersDisplayWrapper'>
          <div className='panelWrapper'>
            <h2><span>{this.state.users.length}</span> users interested in this journey</h2>
            {this.props.routeData &&
              this.state.users.map((user, i) => (
                <div className='userInfo' key={i}>
                  <p>{user.username}</p>
                </div>
              ))
            }
            <button onClick={this.addUser}>Follow</button>
          </div>
        </div>
      </>
    )
  }
}

export default UsersDisplay
