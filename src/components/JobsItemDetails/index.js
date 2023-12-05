import {Component} from 'react'
import Cookies from 'js-cookie'
import {FaExternalLinkAlt, FaStar} from 'react-icons/fa'
import {Redirect} from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'
import {BsBriefcase} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Header from '../Header'
import './index.css'

const apiStatusJob = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'LOADER',
  initial: 'INITIAL',
}

class JobsItemDetails extends Component {
  state = {
    data: null,
    apiStatus: apiStatusJob.initial,
  }

  componentDidMount() {
    this.getApi()
  }

  getApi = async () => {
    this.setState({apiStatus: apiStatusJob.inProgress})
    const jwt = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/:${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      console.log('Fetched Data of Item', data)
      const updatedData = {
        jobDetails: {
          companyLogoUrl: data.job_details.company_logo_url,
          companyWebsiteUrl: data.job_details.company_website_url,
          employmentType: data.job_details.employment_type,
          id: data.job_details.id,
          jobDescription: data.job_details.job_description,
          skills: data.job_details.skills.map(each => ({
            imageUrl: each.image_url,
            name: each.name,
          })),
          lifeAtCompany: {
            description: data.job_details.life_at_company.description,
            imageUrl: data.job_details.life_at_company.image_url,
          },
          location: data.job_details.location,
          packagePerAnnum: data.job_details.package_per_annum,
          rating: data.job_details.rating,
          title: data.job_details.title,
        },
        similarJobs: data.similar_jobs.map(each => ({
          companyLogoUrl: each.company_logo_url,
          employmentType: each.employment_type,
          id: each.id,
          jobDescription: each.job_description,
          location: each.location,
          rating: each.rating,
          title: each.title,
        })),
      }
      this.setState({data: updatedData, apiStatus: apiStatusJob.success})
    } else {
      this.setState({apiStatus: apiStatusJob.failure})
    }
  }

  getSuccess = () => {
    const {data} = this.state
    const {jobDetails, similarJobs} = data
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompany,
    } = jobDetails
    return (
      <div className="job-bg">
        <div className="jobItem">
          <div className="top">
            <img src={companyLogoUrl} alt="job details company logo" />
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
                <MdLocationOn className="l-icon" />
                <p>{location}</p>
              </div>
              <div className="location">
                <BsBriefcase className="l-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p className="package">{packagePerAnnum}</p>
          </div>
          <div className="bottom">
            <h1>Description</h1>
            <a href={companyWebsiteUrl} target="__blank">
              Visit
            </a>
            <FaExternalLinkAlt />
            <p>{jobDescription}</p>
          </div>
          <div className="skills">
            <h1>Skills</h1>
            {skills.map(each => (
              <li>
                <img src={each.imageUrl} alt={each.name} />
              </li>
            ))}
          </div>
          <div>
            <h1>Life at Company</h1>
            <p>{lifeAtCompany.description}</p>
            <img src={lifeAtCompany.imageUrl} alt="life at company" />
          </div>
        </div>
        <div className="sim-card">
          <h1>Similar Jobs</h1>
          <ul>
            {similarJobs.map(each => (
              <li>
                <li className="jobItem">
                  <div className="top">
                    <img
                      src={each.companyLogoUrl}
                      alt="similar job company logo"
                    />
                    <div className="title-div">
                      <h1>{each.title}</h1>
                      <div className="rating-div">
                        <FaStar className="rating-i" />
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
                </li>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  getFailure = () => (
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

  getLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobRetry = () => {
    this.getJobApi()
  }

  getRender = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusJob.success:
        return this.getSuccess()
      case apiStatusJob.failure:
        return this.getFailure()
      case apiStatusJob.inProgress:
        return this.getLoader()
      default:
        return null
    }
  }

  render() {
    if (Cookies.get('jwt_token') === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="bg">{this.getRender()}</div>
      </>
    )
  }
}

export default JobsItemDetails
