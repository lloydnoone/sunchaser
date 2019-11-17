import React from 'react'
import { Link } from 'react-router-dom'

class Register extends React.Component {
  constructor() {
    super()
    
    this.state = {
      errors: {}
    }
  }

  render() {
    return (
      <div className='formWrapper'>
        <form className='panelWrapper' onSubmit={this.props.onSubmit}>
          <h2>Register</h2>

          <label>Username<span>*</span></label>
          <input
            name='username'
            placeholder='Username'
            onChange={this.props.onChange}
          />

          <label>Email<span>*</span></label>
          <input
            name='email'
            placeholder='name@email.com'
            onChange={this.props.onChange}
          />

          <label>Password<span>*</span></label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            onChange={this.props.onChange}
          />

          <label>Password Confirmation<span>*</span></label>
          <input
            name='password_confirmation'
            type='password'
            placeholder='Password Confirmation'
            onChange={this.props.onChange}
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