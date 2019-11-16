import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import Auth from '../../lib/auth'
import Register from '../auth/Register'
import Login from '../auth/Login'

class Navbar extends React.Component {
  constructor() {
    super()
    this.state = {
      burgerOpen: false
    }
    this.handleLogout = this.handleLogout.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this)
  }

  handleLogout() {
    Auth.logout()
    //this.props.history.push('/vegetables')
  }

  toggleNavbar() {
    this.setState({ burgerOpen: !this.state.burgerOpen })
  }

  render() {
    return (
      <>
        <nav className={`${this.state.burgerOpen ? 'burgerOpen' : ''}`}>
          <div>
            <Link to="/">Home</Link>
            {!Auth.isAuthenticated() && <Link to="/">Register</Link>}
            {!Auth.isAuthenticated() && <Link to="/">Sign in</Link>}
            {Auth.isAuthenticated() && <a onClick={this.handleLogout}>Logout</a>}
          </div>
          <a 
            className="burgerMenu"
            onClick={this.toggleNavbar}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </nav>
        <Register/>
        <Login/>
      </>
    )
  }
}

export default withRouter(Navbar)

/* <Link to="/">Home</Link>
          <Link to="/vegetables">Veg on offer</Link>
          {Auth.isAuthenticated() && <Link to="/vegetables/new">Post your veg</Link>}

          {!Auth.isAuthenticated() && <Link to="/register">Register</Link>}
          {!Auth.isAuthenticated() && <Link to="/login">Sign in</Link>}
          {Auth.isAuthenticated() && <Link to="/dashboard">Dashboard</Link>}
          {Auth.isAuthenticated() && <a onClick={this.handleLogout}>Logout</a>} */
