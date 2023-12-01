import Cookies from 'js-cookie'
import './index.css'

const Home = () => {
  console.log('Cookies GET', Cookies.get('jwtToken'))
}

export default Home
