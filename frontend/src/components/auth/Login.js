import React from 'react'
import { Link } from 'react-router-dom'

class Login extends React.Component {
  constructor() {
    super()
    
    this.state = {
      errors: {}
    }
  }
  
  render() {
    return (
      <div className='formWrapper'>
        <form className='panelWrapper' autoComplete='off' onSubmit={this.props.onSubmit}>
          <h2>Login</h2>
          <label>Email</label>
          <input
            name='email'
            placeholder='name@email.com'
            onChange={this.props.onChange}
            autoComplete="off"
          />
          <label>Password</label>
          <input
            name='password'
            type='password'
            placeholder='Password'
            onChange={this.props.onChange}
            autoComplete='off'
          />
          <button type='submit'>Login</button>
          <Link to="/">
            <small>No account yet? Click here to register.</small>
          </Link>
        </form>
      </div>
    )
  }
}

export default Login