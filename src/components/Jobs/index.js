import {Component} from 'react'
// import {FaStar} from 'react-icons/fa'
import {MdLocationOn, MdStar} from 'react-icons/md'
import {BsSearch, BsBriefcase} from 'react-icons/bs'
import {Link, Redirect} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusContainerProfile = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADER',
  initial: 'INITIAL',
}

const apiStatusContainerJobs = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADER',
  initial: 'INITIAL',
}

class Jobs extends Component {
  state = {
    apiStatusProfile: apiStatusContainerProfile.initial,
    dataProfile: null,
    dataJobs: null,
    apiStatusJobs: apiStatusContainerJobs.initial,
    employmentType: [],
    minimumPackage: '',
    search: '',
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobApi()
  }

  // Jobs Section

  getJobApi = async () => {
    this.setState({apiStatusJobs: apiStatusContainerJobs.inProgress})

    const {employmentType, minimumPackage, search} = this.state
    console.log(
      'API call after updation of type,salary',
      employmentType,
      minimumPackage,
      search,
    )
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType.join()}&minimum_package=${minimumPackage}&search=${search}`
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log('Jobs Items', data)
      const updatedData = {
        jobs: data.jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          packagePerAnnum: each.package_per_annum,
          rating: each.rating,
          title: each.title,
        })),
        total: data.total,
      }
      console.log('Update JObs', updatedData)
      this.setState({
        dataJobs: updatedData,
        apiStatusJobs: apiStatusContainerJobs.success,
      })
    } else {
      this.setState({apiStatusJobs: apiStatusContainerJobs.failure})
    }
  }

  getJobsSuccess = () => {
    const {dataJobs} = this.state
    const {total, jobs} = dataJobs
    // const {
    //   companyLogoUrl,
    //   employmentType,
    //   id,
    //   jobDescription,
    //   location,
    //   packagePerAnnum,
    //   rating,
    //   title,
    // } = jobs
    console.log('inside success', {total, jobs})
    if (jobs.length === 0) {
      return (
        <div className="no-jobs-bg">
          <img
            className="no-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />
          <h1 className="no-job-head">No Jobs Found</h1>
          <p className="no-job-para">
            We could not find any jobs. Try other filters
          </p>
        </div>
      )
    }
    return (
      <ul className="sm-jobs-list lg-jobs-list">
        {jobs.map(each => (
          <li key={each.id}>
            <Link to={`/jobs/${each.id}`} className="jobItem">
              <div className="top">
                <img src={each.companyLogoUrl} alt="company logo" />
                <div className="title-div">
                  <h1>{each.title}</h1>
                  <div className="rating-div">
                    <MdStar className="rating-icon" />
                    <p>{each.rating}</p>
                  </div>
                </div>
              </div>
              <div className="middle">
                <div className="m-start">
                  <div className="location">
                    <MdLocationOn className="l-icon" />
                    <p>{each.location}</p>
                  </div>
                  <div className="location">
                    <BsBriefcase className="l-icon" />
                    <p>{each.employmentType}</p>
                  </div>
                </div>
                <p className="package">{each.packagePerAnnum}</p>
              </div>
              <div className="bottom">
                <h1>Description</h1>
                <p>{each.jobDescription}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  getJobsLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobRetry = () => {
    this.getJobApi()
  }

  getJobsFailure = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button className="retry-btn" onClick={this.getJobRetry} type="button">
        Retry
      </button>
    </div>
  )

  getJobs = () => {
    const {apiStatusJobs} = this.state
    switch (apiStatusJobs) {
      case apiStatusContainerJobs.success:
        return this.getJobsSuccess()
      case apiStatusContainerJobs.failure:
        return this.getJobsFailure()
      case apiStatusContainerJobs.inProgress:
        return this.getJobsLoader()
      default:
        return null
    }
  }
  // Profile Section

  getProfileApi = async () => {
    this.setState({apiStatusProfile: apiStatusContainerProfile.inProgress})
    const url = 'https://apis.ccbp.in/profile'
    const jwt = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        dataProfile: updatedData,
        apiStatusProfile: apiStatusContainerProfile.success,
      })
    } else {
      this.setState({apiStatusProfile: apiStatusContainerProfile.failure})
    }
  }

  getProfile = () => {
    const {apiStatusProfile} = this.state
    switch (apiStatusProfile) {
      case apiStatusContainerProfile.success:
        return this.getProfileSuccess()
      case apiStatusContainerProfile.failure:
        return this.getProfileFailure()
      case apiStatusContainerProfile.inProgress:
        return this.getProfileLoader()
      default:
        return null
    }
  }

  getProfileLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getProfileSuccess = () => {
    const {dataProfile} = this.state
    const {profileImageUrl, shortBio} = dataProfile
    return (
      <div className="profile">
        <img src={profileImageUrl} alt="profile" />
        <h1>Hussain Sharif</h1>
        <p>{shortBio}</p>
      </div>
    )
  }

  getProfileRetry = () => {
    this.getProfileApi()
  }

  getProfileFailure = () => (
    <button className="retry-btn" onClick={this.getProfileRetry} type="button">
      Retry
    </button>
  )

  typeChange = event => {
    console.log('typeChange==>', event.target.value)
    console.log('typeChange==>', event.target.checked)
    this.setState(prev => {
      const {employmentType} = prev
      let updatedList
      if (event.target.checked === true) {
        updatedList = [...employmentType, event.target.value]
      } else {
        updatedList = employmentType.filter(each => each !== event.target.value)
      }
      return {employmentType: updatedList}
    }, this.getJobApi)
  }

  salaryChange = event => {
    console.log('salaryChange==>', event.target.value)
    console.log('salaryChange==>', event)
    this.setState({minimumPackage: event.target.value}, this.getJobApi)
  }

  searchChange = event => {
    console.log('searchChange==>', event.target.value)
    console.log('searchChange==>', event)
    this.setState({search: event.target.value})
  }

  onSearch = () => {
    this.getJobApi()
  }

  renderInputSearchJsx = () => {
    const {search} = this.state
    return (
      <div className="input-div">
        <input
          onChange={this.searchChange}
          type="search"
          value={search}
          placeholder="Search"
        />
        <button
          onClick={this.onSearch}
          type="button"
          data-testid="searchButton"
        >
          {' '}
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  render() {
    if (Cookies.get('jwt_token') === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="main-bg">
        <Header />
        <div className="lg-jobs-bg">
          <div className="lg-left">
            <div className="profile-bg">{this.getProfile()}</div>
            <div className="sm-input-div">{this.renderInputSearchJsx()}</div>
            <hr className="hr" />
            <div className="type">
              <h1>Type of Employment</h1>
              <ul className="types-list">
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId} className="type-item">
                    <input
                      onChange={this.typeChange}
                      type="checkbox"
                      value={each.employmentTypeId}
                      id={each.employmentTypeId}
                    />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="hr" />
            <div className="type">
              <h1>Salary Range</h1>
              <ul className="types-list">
                {salaryRangesList.map(each => (
                  <li key={each.salaryRangeId} className="type-item">
                    <input
                      onChange={this.salaryChange}
                      type="radio"
                      id={each.salaryRangeId}
                      value={each.salaryRangeId}
                      name="salary"
                    />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="sm-jobs-list">{this.getJobs()}</ul>
          </div>
          <div className="lg-right">
            <div className="lg-input-div">{this.renderInputSearchJsx()}</div>
            {this.getJobs()}
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
