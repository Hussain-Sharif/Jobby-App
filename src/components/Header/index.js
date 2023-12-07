import {AiFillHome} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import Cookies from 'js-cookie'
import './index.css'
import {withRouter, Link} from 'react-router-dom'

const Header = props => {
  const toLogOut = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-bg">
      <div className="set-1">
        <ul className="route-div">
          <li>
            <Link to="/">
              <img
                className="logo"
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
              />
            </Link>
          </li>

          <li className="routes">
            <Link className="link l1" to="/">
              <h1>Home</h1>
            </Link>
            <Link className="link l2" to="/jobs">
              <h1>Jobs</h1>
            </Link>
          </li>
          <li>
            <button className="logout-btn" type="button" onClick={toLogOut}>
              Logout
            </button>
          </li>
        </ul>
      </div>
      <div className="set-2">
        <Link to="/">
          <img
            className="logo"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <Link to="/">
          <AiFillHome className="i1" />
        </Link>
        <Link to="/jobs">
          <BsBriefcase className="i1" />
        </Link>
        <button className="logout-btn" type="button" onClick={toLogOut}>
          <FiLogOut className="i1" />{' '}
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
