import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'

const Home = props => {
  console.log('Cookies GET', Cookies.get('jwtToken'))
  const changeRoute = () => {
    const {history} = props
    history.push('/jobs')
  }

  if (Cookies.get('jwtToken') === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <>
      <Header />
      <div className="home-bg">
        <h1>Find The Job That Fits Your Life</h1>
        <p>
          Millions of peopleare searching for jobs, salary, information, company
          reviews. Find the job that fits your abilites and potential.
        </p>
        <button type="button" onClick={changeRoute}>
          Find Jobs
        </button>
      </div>
    </>
  )
}

export default Home
