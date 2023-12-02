import {Component} from 'react'
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
    apiStatusJobs: apiStatusContainerJobs.initial,
  }

  render() {
    return (
      <>
        <Header />
        <div className="lg-jobs-bg">
          <div className="lg-left">
            <div className="profile">
              <img />
              <h1></h1>
              <p></p>
            </div>
            <hr />
            <div className="type">
              <h1></h1>
              <ul className="types-list"></ul>
            </div>
            <hr />
            <div className="type">
              <h1></h1>
              <ul className="types-list"></ul>
            </div>
          </div>
          <div className="lg-right">
            <div className="input-div">
              <input type="search" placeholder="Search" />
              <button type="button" data-testid="searchButton">
                <BsSearch className="search-icon" />
              </button>
            </div>
            <ul></ul>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
