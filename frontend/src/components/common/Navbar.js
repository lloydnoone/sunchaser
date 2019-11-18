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
    this.toggleFormDisplay = this.toggleFormDisplay.bind(this)
    this.handleLoginChange = this.handleLoginChange.bind(this)
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
    this.handleRegisterChange = this.handleRegisterChange.bind(this)
    this.handleRegisterSubmit = this.handleRegisterSubmit.bind(this)
  }

  handleLogout() {
    Auth.logout()
    this.setState({ loggedIn: false })
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
        this.toggleFormDisplay()
      })
      .catch(err => console.log('error in login: ', err))
    
  }

  handleRegisterChange(e) {
    const registerData = { ...this.state.registerData, [e.target.name]: e.target.value }
    const errors = { ...this.state.errors, [e.target.name]: '' }
    this.setState({ registerData, errors })
  }

  handleRegisterSubmit(e, formType) {
    console.log('formType: ', formType)
    e.preventDefault()
    axios.post('/api/register', this.state.registerData)
      .then((res) => {
        Auth.setToken(res.data.token)
        this.toggleFormDisplay(formType)
      })
      .catch(err => console.log('errors in register:', err))
    
  }

  toggleFormDisplay(formType) {
    console.log('formType: ', formType)
    console.log('regDisplay: ', this.state.regDisplay)
    formType === 'register' && !this.state.regDisplay ? this.setState({ regDisplay: true, loginDisplay: false }).then() : this.setState({ regDisplay: false, loginDisplay: false })
    formType === 'login' && !this.state.loginDisplay ? this.setState({ loginDisplay: true, regDisplay: false }) : this.setState({ regDisplay: false, loginDisplay: false })
  }

  render() {
    console.log('regDisplay in render: ', this.state.regDisplay)
    return (
      <>
        <nav className={`${this.state.burgerOpen ? 'burgerOpen' : ''}`}>
          <div>
            <Link to="/">Home</Link>
            {!Auth.isAuthenticated() && <a onClick={() => this.toggleFormDisplay('register')}>Register</a>}
            {!Auth.isAuthenticated() && <a onClick={() => this.toggleFormDisplay('login')}>Sign in</a>}
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
        {this.state.regDisplay && <Register onChange={this.handleRegisterChange} onSubmit={(e) => this.handleRegisterSubmit(e, 'register')}/>}
        {this.state.loginDisplay && <Login onChange={this.handleLoginChange} onSubmit={this.handleLoginSubmit}/>}
      </>
    )
  }
}

export default withRouter(Navbar)
