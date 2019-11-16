import React from 'react'
import axios from 'axios'

import Auth from '../../lib/auth'
import { Link } from 'react-router-dom'

class Register extends React.Component {
  constructor() {
    super()
    
    this.state = {
      data: {},
      errors: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(e) {
    const data = { ...this.state.data, [e.target.name]: e.target.value }
    const errors = { ...this.state.errors, [e.target.name]: '' }
    this.setState({ data, errors })
  }

  handleSubmit(e) {
    e.preventDefault()
    axios.post('/api/register', this.state.data)
      .then((res) => {
        Auth.setToken(res.data.token)
        this.props.history.goBack()
      })
      .catch(err => this.setState({ errors: err.response.data.errors }))
  }

  render() {
    console.log('render state Register', this.state)
    console.log('render errors', this.state.errors)
    const { errors } = this.state
    return (
      <div className='formWrapper'>
        <form className='panelWrapper' onSubmit={this.handleSubmit}>
          <h2>Register</h2>

          <label>Username<span>*</span></label>
          <input
            name='username'
            placeholder={errors.username ? 'This field is required.' : 'Username'}
            onChange={this.handleChange}
          />

          <label>Email<span>*</span></label>
          <input
            name='email'
            placeholder={errors.email ? 'This field is required.' : 'name@email.com'}
            onChange={this.handleChange}
          />

          <label>Password<span>*</span></label>
          <input
            name='password'
            type='password'
            placeholder={errors.password ? 'This field is required.' : 'Password'}
            onChange={this.handleChange}
          />

          <label>Password Confirmation<span>*</span></label>
          <input
            name='passwordConfirmation'
            type='password'
            placeholder={errors.password ? 'This field is required.' : 'Password Confirmation'}
            onChange={this.handleChange}
          />

          <button type='submit'>Register</button>
          <Link to="/">
            <small>Already have an account? Click here to login.</small>
          </Link>
        </form>
      </div>
    )
  }
}

export default Register