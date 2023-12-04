import {Component} from 'react'
import {FaStar} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {BsSearch, BsBriefcase} from 'react-icons/bs'
import {Link} from 'react-router-dom'
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
    employmentType: '',
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
    const url = `https://apis.ccbp.in/jobs?employment_type=${employmentType}&minimum_package=${minimumPackage}&search=${search}`
    const jwt = Cookies.get('jwtToken')
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
    const {
      companyLogoUrl,
      employmentType,
      id,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobs
    console.log({total, jobs})
    return (
      <>
        {jobs.map(each => (
          <Link key={each.id} to={`/jobs/:${id}`}>
            <li className="jobItem">
              <div className="top">
                <img src={companyLogoUrl} alt="company logo" />
                <div className="title-div">
                  <h1>{title}</h1>
                  <div className="rating-div">
                    <FaStar className="rating-i" />
                    <p>{rating}</p>
                  </div>
                </div>
              </div>
              <div className="middle">
                <div className="m-start">
                  <div className="location">
                    <MdLocationOn />
                    <p>{location}</p>
                  </div>
                  <div className="employmentType">
                    <BsBriefcase />
                    <p>{employmentType}</p>
                  </div>
                </div>
                <p>{packagePerAnnum}</p>
              </div>
              <div className="bottom">
                <h1>Description</h1>
                <p>{jobDescription}</p>
              </div>
            </li>
          </Link>
        ))}
      </>
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
    const jwt = Cookies.get('jwtToken')
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
    const {name, profileImageUrl, shortBio} = dataProfile
    return (
      <>
        <img src={profileImageUrl} alt="profile" />
        <h1>{name}</h1>
        <p>{shortBio}</p>
      </>
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

  render() {
    return (
      <>
        <Header />
        <div className="lg-jobs-bg">
          <div className="lg-left">
            <div className="sm-input-div">
              <input type="search" placeholder="Search" />
              <button type="button" data-testid="searchButton">
                {' '}
                <BsSearch className="search-icon" />
              </button>
            </div>
            <div className="profile">{this.getProfile()}</div>
            <hr />
            <div className="type">
              <h1>Type of Employment</h1>
              <ul className="types-list">
                {employmentTypesList.map(each => (
                  <li key={each.employmentTypeId} className="type-item">
                    <input type="checkbox" id={each.employmentTypeId} />
                    <label htmlFor={each.employmentTypeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div className="type">
              <h1>Salary Range</h1>
              <ul className="types-list">
                {salaryRangesList.map(each => (
                  <li>
                    <input type="radio" id={each.salaryRangeId} />
                    <label htmlFor={each.salaryRangeId}>{each.label}</label>
                  </li>
                ))}
              </ul>
            </div>
            <ul className="sm-jobs-list">{this.getJobs()}</ul>
          </div>
          <div className="lg-right">
            <div className="lg-input-div">
              <input type="search" placeholder="Search" />
              <button type="button" data-testid="searchButton">
                {' '}
                <BsSearch className="search-icon" />
              </button>
            </div>
            <ul className="lg-jobs-list">{this.getJobs()}</ul>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
