import {Component} from 'react'
import Cookies from 'js-cookie'
import {MdStar, MdLocationOn} from 'react-icons/md'
import {FaExternalLinkAlt} from 'react-icons/fa'

import {Redirect} from 'react-router-dom'
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

  renderImage = url => (
    <img className="company-img" src={url} alt="life at company" />
  )

  getApi = async () => {
    this.setState({apiStatus: apiStatusJob.inProgress})
    const jwt = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log('id:', id)
    console.log('JWT', jwt)
    const url = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
    const response = await fetch(url, options)
    console.log(response)
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
    console.log('LPA', similarJobs)
    return (
      <li className="job-bg">
        <div className="jobItem">
          <div className="top">
            <img src={companyLogoUrl} alt="job details company logo" />
            <div className="title-div">
              <h1>{title}</h1>
              <div className="rating-div">
                <MdStar className="rating-i" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="middle m-change">
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
          <div className="details-bottom">
            <div className="des-div">
              <h1>Description</h1>
              <a
                className="hyper-link"
                href={companyWebsiteUrl}
                target="__blank"
              >
                Visit <FaExternalLinkAlt className="hyper-link" />
              </a>
            </div>

            <p>{jobDescription}</p>
          </div>
          <div className="skills">
            <h1>Skills</h1>
            <ul className="skills-list">
              {skills.map(each => (
                <li key={each.name} className="skill-item">
                  <img src={each.imageUrl} alt={each.name} />
                  <p>{each.name}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="about ">
            <div className="about-div">
              <h1>Life at Company</h1>
              <div className="sm-logo">
                {this.renderImage(lifeAtCompany.imageUrl)}
              </div>
              <p className="about-text">{lifeAtCompany.description}</p>
            </div>
            <div className="lg-logo">
              {this.renderImage(lifeAtCompany.imageUrl)}
            </div>
          </div>
        </div>
        <div className="sim-card">
          <h1>Similar Jobs</h1>
          <ul className="sim-list">
            {similarJobs.map(each => (
              <li key={each.id} className="jobItem sim-item">
                <div className="top">
                  <img
                    src={each.companyLogoUrl}
                    alt="similar job company logo"
                  />
                  <div className="title-div">
                    <h1>{each.title}</h1>
                    <div className="rating-div">
                      <MdStar className="rating-i" />
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
            ))}
          </ul>
        </div>
      </li>
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
    <div className="loader-container-details" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getJobRetry = () => {
    this.getApi()
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
        <ul className="details-bg">{this.getRender()}</ul>
      </>
    )
  }
}

export default JobsItemDetails
