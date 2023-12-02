import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {Component} from 'react'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onSuccess = data => {
    const {history} = this.props
    Cookies.set('jwtToken', data.jwt_token)
    history.replace('/')
  }

  onFailure = data => {
    this.setState({errorMsg: `*${data.error_msg}`, username: '', password: ''})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log('login data', data)
    if (response.ok === true) {
      this.onSuccess(data)
    } else {
      this.onFailure(data)
    }
  }

  usernameChange = event => {
    this.setState({username: event.target.value})
  }

  usernameRender = () => {
    const {username} = this.state
    if (Cookies.get('jwtToken') !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="input-div">
        <label htmlFor="user">USERNAME</label>
        <input
          type="text"
          onChange={this.usernameChange}
          id="user"
          placeholder=" "
          value={username}
        />
      </div>
    )
  }

  passwordChange = event => {
    this.setState({password: event.target.value})
  }

  passwordRender = () => {
    const {password} = this.state
    return (
      <div className="input-div">
        <label htmlFor="password">PASSWORD</label>
        <input
          type="password"
          onChange={this.passwordChange}
          id="password"
          placeholder=" "
          value={password}
        />
      </div>
    )
  }

  render() {
    const {errorMsg, username, password} = this.state
    console.log('Change in Login', errorMsg, username, password)
    return (
      <div className="login-bg">
        <form onSubmit={this.onSubmit} className="login-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
          {this.usernameRender()}
          {this.passwordRender()}
          <div className="error-submit">
            <button type="submit" onClick={this.onSubmit}>
              Login
            </button>
            <p>{`${errorMsg}`}</p>
          </div>
        </form>
      </div>
    )
  }
}

export default Login
