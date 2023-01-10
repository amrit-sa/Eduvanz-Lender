import React, { Component } from 'react';
import { openAddUser, SetSearchActive } from "../actions/model";
import { getSearchResults, getEmailReportSearch, getEmailReport, getUserProfile, getUserProfileData, manageSeachResult, globalSearch } from "../actions/users";
import $ from 'jquery'
import {connect } from 'react-redux'
class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inputValue: "",
      first_name: 'Admin',
      global_Search_Keyword:''
    }
  }

  // debounceFunction = ( mainFunction,time)

  // optimizeSearch = debounceFunction()

  componentDidMount() {
    this.setState({inputValue : this.props.global_Search_Keyword})

    // this.setState({inputValue : this.props.keyword})
    this.getProfile()

    $(document).on('click', function () {
      if ($('#collapseProfile').hasClass('show')) {
        $('#collapseProfile').removeClass('show')
      }
    })
  }


  handleOpenUser = () => {
    this.props.dispatch(openAddUser());
  }

  optimizeSearch = (func, t) => {
    let timer;
    return function () {
      if (timer) clearTimeout(timer);
      setTimeout(() => {
        func();
      }, t);
    }

  }

  componentDidUpdate=(prevState)=>{
    if(this.props.global_Search_Keyword.length>0 && prevState.global_Search_Keyword != this.props.global_Search_Keyword){
      this.setState({inputValue : this.props.global_Search_Keyword})
    }
  }

  handleSearchInput = () => {



    if (this.props.page == 'email_report') {


      if (this.state.inputValue.length == 0) {
        this.props.dispatch(getEmailReport({ lender_Sfid: localStorage.getItem('user_sfid') }))
        return;
      }
      let obj2 = {
        user_sfid: localStorage.getItem('user_sfid'),
        search_keyword: this.state.inputValue
      }
      // this.props.dispatch(getSearchResults(obj1));
      this.props.dispatch(getEmailReportSearch(obj2));

    } else {

      console.log(this.state, '?????????')
      if (this.state.inputValue.length === 0) {
        console.log("enter if");
        this.props.dispatch(SetSearchActive(false))
      } else {
        console.log("Enter else");
        this.props.dispatch(SetSearchActive(true))
        let lender_sfid = localStorage.getItem('user_sfid');
        let obj1 = {
          lender_sfid: lender_sfid,
          section: this.props.title,
          search_keyword: this.state.inputValue,
        }
        if (this.props.type == 'global') {
          obj1.section = 'All Leads'
        }
        if (this.props.isManageFilter) {
          this.props.dispatch(manageSeachResult(obj1))
        } else {
          this.props.dispatch(getSearchResults(obj1));
        }
      }
    }
  }

  handleGlobalSearch = (e) => {
    e.preventDefault();
    this.props.dispatch(globalSearch(this.state.inputValue));
    this.handleSearchInput()
    if (this.props.type == 'global') {
      this.props.history.push('/leads')
    }
  }

  getdata = (this.props.type != 'global') ? this.optimizeSearch(this.handleSearchInput, 500) : '';

  //  getdata = (e) => {
  // this.setState({inputValue:e.target.value})
  //  return this.optimizeSearch(this.handleSearchInput,1000);
  //  }

  getProfile = () => {
    let sfid = localStorage.getItem('user_sfid');
    let userData = {
      user_sfid: sfid
    }
    //this.props.dispatch(getUserProfile(userData));
    this.props.dispatch(getUserProfileData(userData)).then(response => {
      this.setState({ first_name: response.data.first_name__c })
    })

  }


  render() {
    console.log(this.state, '>>>>>>')
    const { title, isSearchEnable, isBackEnable, isAddUser } = this.props
    
    return (
      <div className={`${title && title == 'lead_details'? 'mt-0' : 'container-fluid' } leads_header lender_header`}>
        <div className="row align-items-center">
          {title && title != 'lead_details' && 
            <div className="col-md-4  mb-3 mb-md-0">
              <h1>
                {isBackEnable && (
                  <button id="sidebarToggleTop" className="d-lg-none rounded-circle mr-2">
                    <i className="fa fa-bars" />
                  </button>
                )}
                <button id="sidebarToggleTop" className="d-lg-none rounded-circle mr-2">
                  <i className="fa fa-angle-left" aria-hidden="true"></i>
                </button>{title}
                {isAddUser && (
                  <button type="button" onClick={this.handleOpenUser} className="btn btn-style_1"><img src="img/icon_adduser.svg" /> Add User</button>
                )}
              </h1>
            </div>
          }
          {isSearchEnable && (
            <div className={`${title && title == 'lead_details'? 'col-12 px-4' : 'col-md-4'}`}>
              <div className="search-form nav_search">
                <div className="form-group has-feedback">
                  <form onSubmit={this.handleGlobalSearch}>
                    <label htmlFor="search" className="sr-only">Search</label>
                    <input type="search" className="form-control" name="search" id="search" placeholder="Find Cases, Users" value={this.state.inputValue}
                      onChange={(e) => {
                        this.setState({ inputValue: e.target.value });
                        this.getdata()
                      }} />
                  </form>
                </div>
              </div>
            </div>
          )}

          {title && title != 'lead_details' &&

            <div className="nav_profile ml-auto">
              <div className="nav-link">
                <div className="txt-profile">SA</div>
                <span className="profile_name_position">
                  <b>{this.state.first_name}</b>
                </span>
                <a
                  className="profiledropdown collapsed"
                  href="#"
                  data-toggle="collapse"
                  data-target="#collapseProfile"
                  aria-expanded="true"
                  aria-controls="collapseTwo"
                  onClick={this.handle}
                >
                  <i className="fas fa-ellipsis-v fa-sm fa-fw mr-2" />
                </a>
              </div>
              <div
                id="collapseProfile"
                className="collapse"
                aria-labelledby="headingTwo"
                data-parent="#accordionSidebar"
              >
                <div className="collapse-inner">
                  <a className="dropdown-item" href="#" data-toggle="modal" data-target="#profileModal" onClick={this.getProfile}>
                    <i className="fas fa-user fa-sm fa-fw mr-3" />
                    My Profile
                  </a>
                  <a className="dropdown-item" href="/manage_role">
                    <i className="fas fa-users fa-sm fa-fw mr-3" />
                    Manage Role
                  </a>
                  <a className="dropdown-item" href="/manage_recipient">
                    <i className="fas fa-users fa-sm fa-fw mr-3" />
                    Manage Recipients
                  </a>
                  <a className="dropdown-item" href="/manage_group">
                    <i className="fas fa-users fa-sm fa-fw mr-3" />
                    Manage Group
                  </a>
                  <a className="dropdown-item" href="/email_report">
                    <i className="fas fa-users fa-sm fa-fw mr-3" />
                    Email Reports
                  </a>
                  <a className="dropdown-item cursor-point" href="/change_password" >
                    <i className="fas fa-key fa-sm fa-fw mr-3" />
                    Change Password
                  </a>
                  <a className="dropdown-item" data-toggle="modal" data-target="#feedback" href="#">
                    <i className="fas fa-comment-dots fa-sm fa-fw mr-3 " />
                    Feedbacks
                  </a>
                  <a className="dropdown-item" href="/faq">
                    <i className="fas fa-question fa-sm fa-fw mr-3 " />
                    FAQ
                  </a>
                  <a
                    className="dropdown-item"
                    href="#"
                    data-toggle="modal"
                    data-target="#logoutModal"
                  >
                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-3" />
                    Logout
                  </a>
                </div>
              </div>

            </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps=(state)=>{
  const {global_Search_Keyword} = state.user

  return {
    global_Search_Keyword
  }

}

export default connect(mapStateToProps,null)(Header);