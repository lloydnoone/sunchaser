import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import axios from 'axios'
import Auth from '../../lib/auth'
import Register from '../auth/Register'
import Login from '../auth/Login'

class Navbar extends React.Component {
  constructor() {
    super()
    this.state = {
      loginData: {},
      registerData: {},
      burgerOpen: false,
      loggedIn: false,
      regDisplay: false,
      loginDisplay: false
    }
    this.handleLogout = this.handleLogout.bind(this)
    this.toggleNavbar = this.toggleNavbar.bind(this)
    this.toggleRegDisplay = this.toggleRegDisplay.bind(this)
    this.toggleLoginDisplay = this.toggleLoginDisplay.bind(this)
    this.handleLoginChange = this.handleLoginChange.bind(this)
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
    this.handleRegisterChange = this.handleRegisterChange.bind(this)
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
  }

  handleLogout() {
    Auth.logout()
    this.setState({ loggedIn: false })
    //this.props.history.push('/vegetables')
  }

  toggleNavbar() {
    this.setState({ burgerOpen: !this.state.burgerOpen })
  }

  handleLoginChange(e) {
    const loginData = { ...this.state.loginData, [e.target.name]: e.target.value }
    console.log('data in login change: ', loginData)
    const errors = { ...this.state.errors, [e.target.name]: '' }
    this.setState({ loginData, errors })
  }

  handleLoginSubmit(e) {
    e.preventDefault()
    axios.post('/api/login', this.state.loginData )
      .then(res => {
        Auth.setToken(res.data.token)
        this.toggleLoginDisplay()
      })
      .catch(err => console.log('error in login: ', err))
    
  }

  handleRegisterChange(e) {
    const registerData = { ...this.state.registerData, [e.target.name]: e.target.value }
    const errors = { ...this.state.errors, [e.target.name]: '' }
    this.setState({ registerData, errors })
  }

  handleRegisterSubmit(e) {
    e.preventDefault()
    axios.post('/api/register', this.state.registerData)
      .then((res) => {
        Auth.setToken(res.data.token)
        this.toggleRegDisplay()
      })
      .catch(err => console.log('errors in register:', err))
    
  }

  toggleLoginDisplay() {
    this.setState({ loginDisplay: !this.state.loginDisplay })
  }

  toggleRegDisplay() {
    this.setState({ regDisplay: !this.state.regDisplay })
  }

  render() {
    return (
      <>
        <nav className={`${this.state.burgerOpen ? 'burgerOpen' : ''}`}>
          <div>
            <Link to="/">Home</Link>
            {!Auth.isAuthenticated() && <a onClick={this.toggleRegDisplay}>Register</a>}
            {!Auth.isAuthenticated() && <a onClick={this.toggleLoginDisplay}>Sign in</a>}
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
        {this.state.regDisplay && <Register onChange={this.handleRegisterChange} onSubmit={this.handleRegisterSubmit}/>}
        {this.state.loginDisplay && <Login onChange={this.handleLoginChange} onSubmit={this.handleLoginSubmit}/>}
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
