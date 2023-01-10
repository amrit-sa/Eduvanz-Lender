import React, { Component } from 'react';
import { connect } from "react-redux";
import { getUserProfile, setMobileNo, setProfile, getUserProfileData, submitFeedback } from "../actions/users";

class Sidebar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      path: '',
      sidemenu: '',
      first_name: '',
      ispasswordShown: false,
      ispasswordShown2: false,
      mobile: '',
      mobileErr: '',
      feedbackmsg: "",
      given_user_id: null,
      email: "",
      staticProfile: {},
      mobile_number: "",
      role: "",
      errormsg: '',
      closeFeedback: false,
      firstNameError: "",
      lastNameError: "",
      mobileError: "",
      emailError: "",
      otherError: ""
    }
  }

  componentDidMount() {
    const pathArray = window.location.pathname.split("/");
    const segment_1 = pathArray[1];
    this.setState({ path: segment_1 });
    this.state.sidemenu = segment_1;
    console.log(pathArray);
    console.log(segment_1);
    console.log(this.state.sidemenu);
    const { user_id, lead_count, lead_data } = this.props;
    let sfid = localStorage.getItem('user_sfid');
    let userData = {
      user_sfid: sfid
    }
    //this.props.dispatch(getUserProfile(userData));
  }

  //
  togglePassVisibility = () => {
    const { ispasswordShown } = this.state;
    this.setState({ ispasswordShown: !ispasswordShown })
  }

  togglePassVisibility2 = () => {
    const { ispasswordShown2 } = this.state;
    this.setState({ ispasswordShown2: !ispasswordShown2 })
  }


  handleLogOut = () => {
    localStorage.clear();
    this.props.dispatch(setMobileNo(''));
    window.location.href = "/login";
  }


  clearAll = () => {
    let sfid = localStorage.getItem('user_sfid');
    let userData = {
      user_sfid: sfid
    }
    this.props.dispatch(getUserProfileData(userData))
      .then((response) => {
        if (response.status === "success") {
          let user_role = ''
          let role_data = response.roleDets && Object.keys(response.roleDets).length !== 0 ? response.roleDets : '';
          if (role_data != '') {
            user_role = role_data.role_name
          }
          let response_new = response.data;
          this.setState({ first_name: response_new.first_name__c !== null ? response_new.first_name__c : '' });
          this.setState({ last_name: response_new.last_name__c !== null ? response_new.last_name__ : '' });
          this.setState({ email: response_new.email__c !== null ? response_new.email__c : '' });
          this.setState({ mobile_number: response_new.phone != null ? response_new.phone : '' });
          this.setState({ given_user_id: response_new.id !== null ? response_new.id : '' });
          this.setState({ role: user_role });
          this.setState({ errormsg: '' });
        }
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.lead_data !== this.props.lead_data) {
      let user_role = ''
      if (this.props.lead_data != null) {
        let role_data = this.props.lead_data.roleDets && Object.keys(this.props.lead_data.roleDets).length !== 0 ? this.props.lead_data.roleDets : '';
        if (role_data != '') {
          user_role = role_data.role_name
        }
        let response = this.props.lead_data.data;
        {
          this.setState({ first_name: response.first_name__c !== null ? response.first_name__c : '' });
          this.setState({ last_name: response.last_name__c !== null ? response.last_name__c : '' });
          this.setState({ email: response.email__c !== null ? response.email__c : '' });
          this.setState({ mobile_number: response.phone != null ? response.phone : '' });
          this.setState({ given_user_id: response.id !== null ? response.id : '' });
          this.setState({ errormsg: '' });
          this.setState({ role: user_role });
        }
      }
    }
  }
  saveProfile = async () => {
    let sfid = localStorage.getItem('user_sfid');
    let data = {
      "first_name": this.state.first_name,
      "last_name": this.state.last_name,
      "email": this.state.email,
      "mobile": this.state.mobile_number,
      "lender_sfid": sfid,
      "lender_user_id": this.state.given_user_id
    }
    this.props.dispatch(setProfile(data)).then((response) => {
      if (response.status == "success") {
        document.getElementById("closeProfileModal").click();
        alert('Profile updated successfully')
        this.setState({ firstNameError: '', lastNameError: '', emailError: '', mobileError: '', otherError: '' })

      }
      if (response.status == "error") {
        if (response.fieldname == "first_name") {
          this.setState({ firstNameError: response.message, lastNameError: '', emailError: '', mobileError: '', otherError: '' })
        }
        if (response.fieldname == "last_name") {
          this.setState({ firstNameError: '', lastNameError: response.message, emailError: '', mobileError: '', otherError: '' })
        }
        if (response.fieldname == "email") {
          this.setState({ firstNameError: '', lastNameError: '', emailError: response.message, mobileError: '', otherError: '' })
        }
        if (response.fieldname == "mobile") {
          this.setState({ firstNameError: '', lastNameError: '', emailError: '', mobileError: response.message, otherError: '' })
        }
        if (response.fieldname !== "first_name" && response.fieldname !== "last_name" && response.fieldname !== "email" && response.fieldname !== "mobile") {
          this.setState({ firstNameError: '', lastNameError: '', emailError: '', mobileError: '', otherError: response.message })
        }

      }
    })


  }


  submitFeedback = () => {
    if (this.state.feedbackmsg.length < 5) {
      this.setState({ feedbackerr: "Please enter atleast 5 charactor", showerr: true });
    }
    if (this.state.feedbackmsg && this.state.feedbackmsg.length >= 5) {
      const obj = {
        user_sfid: localStorage.getItem('user_sfid'),
        comments: this.state.feedbackmsg,
      }
      this.props.dispatch(submitFeedback(obj)).then(res => {
        if (res.status === 'success') {
          this.setState({ feedbackmsg: "", feedbackerr: '', closeFeedback: true, closeFeedback: true, showerr: false });
          document.getElementById("close-btn").click();
          this.setState({ closeFeedback: false, feedbackerr: '', showerr: false })
          alert(res.message);
        } else {
          this.setState({ feedbackmsg: this.state.feedbackmsg, feedbackerr: res.message, closeFeedback: true, closeFeedback: false, showerr: true });
        }
      })
    }
  }

  validateFeedback = (e) => {
    this.setState({ feedbackmsg: e.target.value })
    if (Number(e.target.value.length) < 5) {
      this.setState({ feedbackerr: "Please enter atleast 5 charactor", showerr: true })
    } else {
      this.setState({ feedbackerr: "Please enter atleast 5 charactor", showerr: false })
    }
  }

  handleBlurName = (field) => {
    if (field == 'name') {
      let chckNo = this.containsNumber(this.state.name)
      if (chckNo) {
        this.setState({ nameError: "Name doesn't contains Numeric Number" })
      }
      if (this.state.name.length > 100) {
        this.setState({ nameError: "Name should not be smaller than 100 characters" })
      }
      if (!chckNo && this.state.name.length < 100) {
        this.setState({ nameError: "" })

      }
    }
  }
  handleBlurEmail = (field) => {
    if (field == 'email') {
      var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      if (!validRegex.test(this.state.email)) {
        this.setState({ emailError: "Invalid Email Address" })
      } else {
        this.setState({ emailError: "" })

      }
    }
  }
  handleBlurPhone = (field) => {
    if (field == 'mobile') {
      alert(this.state.mobile)
      if (this.state.mobile.length != 10) {
        this.setState({ phoneError: "Mobile No must be of 10 digits" })
      }
      if (!this.state.mobile.startsWith('6') && !this.state.mobile.startsWith('7') && !this.state.mobile.startsWith('8') && !this.state.mobile.startsWith('9')) {
        this.setState({ phoneError: "Mobile No starts with 6,7,8,9" })
      } else {
        this.setState({ phoneError: "" })
      }
    }
  }
  containsNumber = (str) => {
    return /\d/.test(str);
  }
  validateMobile = (e) => {
    let reg = /[0-9]/;
    if (e.target.value === '') {
      this.setState({ mobileErr: '', mobile_number: '' });
    } else {
      if (reg.test(e.target.value.slice(-1))) {
        this.setState({ mobile_number: e.target.value })
      }
    }



  }
  render() {

    const { lead_count } = this.props
    const { ispasswordShown, ispasswordShown2 } = this.state;
    console.log(this.state.showerr);
    return (
      <>
        {/* Sidebar */}
        <div className='sidebar-wrapper'>
          <button className='btn btn-link d-lg-none mr-2 sidbar-close'><img src="images/icons/icon-close.png" /></button>
          <ul
            className="navbar-nav sidebar sidebar-dark accordion"
            id="accordionSidebar"
          >
            <li className="nav-item">
              <a
                className="sidebar-brand d-flex align-items-center justify-content-center admin-name-w-75"
                href="/dashboard"
              >
                <div className="sidebar-brand-text"><img src="images/adityabirla-logo.png" /></div>
              </a>
            </li>
            <li className={`nav-item icon_dashboard ${this.state.path == 'dashboard' ? 'active' : ''}`}>
              <a className="nav-link" href="/dashboard">
                <span>Dashboard</span>
              </a>
            </li>
            <li className={`nav-item icon_allleads ${this.state.path == 'leads' ? 'active' : ''}`}>
              <a className="nav-link" href="/leads">
                <span>All Leads <b>{lead_count ? `${lead_count > 99 ? '99+' : lead_count}` : ''}</b></span>
              </a>
            </li>
            <li className={`nav-item icon_approvalpending  ${this.state.path == 'approvalPending' ? 'active' : ''}`}>
              <a className="nav-link" href="/approvalPending">
                <span>Approval Pending</span>
              </a>
            </li>
            <li className={`nav-item icon_disbursalpending ${this.state.path == 'disbursalPending' ? 'active' : ''}`}>
              <a className="nav-link" href="/disbursalPending">
                <span>Disbursal Pending</span>
              </a>
            </li>
            <li className={`nav-item icon_disbursed ${this.state.path == 'disbursed' ? 'active' : ''}`}>
              <a className="nav-link" href="/disbursed">
                <span>Disbursed</span>
              </a>
            </li>
            <li className={`nav-item icon_declined ${this.state.path == 'declined' ? 'active' : ''}`}>
              <a className="nav-link" href="/declined">
                <span>Declined</span>
              </a>
            </li>
            <li className={`nav-item icon_dropped ${this.state.path == 'dropped' ? 'active' : ''}`}>
              <a className="nav-link" href="/dropped">
                <span>Dropped</span>
              </a>
            </li>
            <li className={`nav-item icon_closed ${this.state.path == 'closed' ? 'active' : ''}`}>
              <a className="nav-link" href="/closed">
                <span>Closed</span>
              </a>
            </li>
            {/* Sidebar Toggler (Sidebar) */}
            <div className="nav_profile">
              {/* <div className="nav-link">
                   <div className="txt-profile">SA</div>
                    <span className="profile_name_position">
                      <b>{this.state.first_name}</b>Admin
                    </span>
                    <a
                      className="profiledropdown collapsed"
                      href="#"
                      data-toggle="collapse"
                      data-target="#collapseProfile"
                      aria-expanded="true"
                      aria-controls="collapseTwo"
                    >
                      <i className="fas fa-ellipsis-v fa-sm fa-fw mr-2" />
                    </a>
                  </div> */}
              {/* <div
                    id="collapseProfile"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionSidebar"
                  >
                    <div className="collapse-inner">
                    <a className="dropdown-item" href="/manage_role">
                        <i className="fas fa-users fa-sm fa-fw mr-3" />
                        Manage Role
                      </a>
                      <a className="dropdown-item" href="#" data-toggle="modal" data-target="#profileModal">
                        <i className="fas fa-user fa-sm fa-fw mr-3" />
                        My Profile
                      </a>
                      <a className="dropdown-item" data-toggle="modal" data-target="#feedback"  href="#">
                        <i className="fas fa-comment-dots fa-sm fa-fw mr-3 " />
                        Feedback
                      </a>
                      <a className="dropdown-item" href="/faq">
                        <i className="fas fa-question fa-sm fa-fw mr-3 " />
                        FAQ
                      </a>
                      <a className="dropdown-item" href="/change_password" data-toggle="modal" data-target="#changePassword">
                        <i className="fas fa-key fa-sm fa-fw mr-3" />
                        Change Password
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
                  </div> */}
              <div className="sidebar-brand-text">
                <img src="images/logo-eduvan-title.png" />
              </div>

            </div>
          </ul>
          {/* Logout Modal*/}
          <div
            className="modal fade"
            id="logoutModal"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Ready to Leave?
                  </h5>
                  <button
                    className="close"
                    type="button"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  Are you sure to Logout?
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    data-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button onClick={this.handleLogOut} className="btn btn-primary">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Modal */}
          <div className="modal fade" id="feedback">
            <div className="modal-dialog modal-dialog-centered dr-modal">
              <div className="modal-content">
                <div className="modal-header border-0 pb-0">
                  <h4 className="">Anything that can be improved?</h4>
                  <button type="button" className="close ml-auto" data-dismiss="modal" aria-label="Close" onClick={() => { this.setState({ feedbackmsg: "" }) }}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <textarea className="textarea2 mb-1" placeholder="Your feedback" value={this.state.feedbackmsg} onChange={this.validateFeedback} />
                  {this.state.showerr && <span style={{ color: 'red' }}>{this.state.feedbackerr}</span>}
                  <button className="btn-black" id='close-btn' style={{ marginLeft: '20rem' }} data-dismiss={this.state.closeFeedback ? 'modal' : ''} aria-label="Close" onClick={this.submitFeedback}><h4>Submit</h4></button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Logout Modal*/}

        {/* Feedback Modal */}
        <div className="modal fade" id="feedback">
          <div className="modal-dialog modal-dialog-centered dr-modal">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h4 className="">Anything that can be improved?</h4>
                <button type="button" className="close ml-auto" data-dismiss="modal" aria-label="Close" onClick={() => { this.setState({ feedbackmsg: "" }) }}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body text-center">
                <textarea className="textarea2 mb-3" placeholder="Your feedback" value={this.state.feedbackmsg} onChange={(e) => this.setState({ feedbackmsg: e.target.value })} />
                <button className="btn-black" style={{ marginLeft: '20rem' }} data-dismiss="modal" aria-label="Close" onClick={this.submitFeedback}><h4>Submit</h4></button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile modal */}

        <div className="modal right fade myModal" id="profileModal">
          <div className="modal-dialog profile-modal">
            <div className="modal-content">
              <div className="mb-3 modal-header border-0 pb-0">
                <div className='d-flex justify-content-between align-items-center w-100'>
                <h3 className="font-weight-bold">Profile</h3>
                <button type="button" data-dismiss="modal" data-toggle="modal" onClick={e=>this.closeModel()} className="cs-btn"><img src="images/icons/icon-close2.png" /></button>
                </div>
              </div>
              <div className="modal-body">
                <div className='profile-pic-wrap'>
                  <div className='profile-pic'>
                    {/* <img src="images/photo.jpg" className="img-fluid"></img> */}
                    <img className="img-profile rounded-circle" src="img/undraw_profile.svg" />


                  </div>
                  {/* <button className='change-pic'>
                              <img src="images/icons/camera1.svg" className="img-fluid"></img> 
                            </button> Aagam Mehta ,agam.mehta@gmail.com,7040557698,Admin,Admin6758*/}
                </div>

                <div className='mt-5'>
                  <div className='input-style2 mb-2'>
                    <label>Name</label>
                    <input type="text" value={this.state.first_name} placeholder='' onChange={(e) => this.setState({ first_name: e.target.value })} />
                    <p style={{ color: "red" }} className="ml-2 pt-1">{this.state.firstNameError != '' ? this.state.firstNameError : ''}</p>
                  </div>
                  <div className='input-style2 mb-2'>
                    <label>Last Name</label>
                    <input type="text" value={this.state.last_name} placeholder='' onChange={(e) => this.setState({ last_name: e.target.value })} />
                    <p style={{ color: "red" }} className="ml-2 pt-1">{this.state.lastNameError != '' ? this.state.lastNameError : ''}</p>

                  </div>
                  <div className='input-style2 mb-2'>
                    <label>Email Address</label>
                    <input type="text" value={this.state.email} placeholder='' onChange={(e) => this.setState({ email: e.target.value })} />
                    <p style={{ color: "red" }} className="ml-2 pt-1">{this.state.emailError != '' ? this.state.emailError : ''}</p>

                  </div>
                  <div className='input-style2 mb-2'>
                    <label>Mobile Number</label>
                    <input type="text" maxLength='10' value={this.state.mobile_number} onChange={this.validateMobile} placeholder='' />
                    {/* {this.state.mobileErr && <p className='text-danger pr-2'>{this.state.mobileErr}</p>} */}
                    <p style={{ color: "red" }} className="ml-2 pt-1">{this.state.mobileError != '' ? this.state.mobileError : ''}</p>

                  </div>
                  <div className='input-style2 mb-2 pt-1'>
                    <label>Role</label>
                    <input type="text" placeholder='' value={this.state.role} onChange={(e) => this.setState({ role: e.target.value })} disabled />
                    <p></p>
                  </div>
                  <div className='input-style2 mb-2 pt-1'>
                    <label>User ID</label>
                    <input type="text" value={this.state.given_user_id} placeholder='' onChange={(e) => this.setState({ given_user_id: e.target.value })} disabled />
                    <p></p>
                  </div>
                </div>
                <hr className='my-4 border-line'></hr>

                <ul>
                  <a href="change_password"><li className='mb-4'><button className='changepassword'>
                    <img src="images/icons/key.svg" className="img-fluid"></img> Change Password</button></li></a>
                  <li>
                    <button className='logout' data-dismiss="modal" data-toggle="modal" data-target="#logoutModal"><img src="images/icons/sign-out-alt.svg" className="img-fluid"></img> Logout</button>
                  </li>
                  <li>
                    <div style={{ color: "red" }} className="mt-3">{this.state.otherError != '' ? this.state.otherError : ''}</div>

                    {/* <div style={{color:"red"}} className="">{this.state.errormsg}</div> */}
                  </li>
                </ul>


              </div>
              <div className='p-4'>
                <div className='row'>
                  {/* <div className='col-6'><button data-dismiss="modal" className='btn-white w-100'>Clear</button></div> */}
                  <div className='col-6'><button className='btn-white w-100' onClick={this.clearAll}>Clear</button></div>

                  <div className='col-6'><button className='btn-black w-100' onClick={this.saveProfile}>Save Profile</button></div>
                  <button data-dismiss="modal" className='btn-white w-100 d-none' id="closeProfileModal">Cancel</button>

                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Profile modal */}
        <div className="modal fade" id="changePassword">
          <div className="modal-dialog modal-dialog-centered changePassword">
            <div className="modal-content">
              <div className="modal-body">
                <div className='row'>
                  <div className='col-lg-6'>
                    <img src="images/cpi.png" className='img-fluid' />
                  </div>
                  <div className='col-lg-6 d-flex flex-column'>
                    <div className='mb-4'>
                      <h4 className='mb-3 font-weight-semibold'>Change Password</h4>
                      <div className='mb-3'>
                        <div className='position-relative'>
                          <input
                            type={(ispasswordShown) ? "text" : "password"}
                            placeholder='New Password'
                            className="input-style3"
                          />
                          <span className='success-msg'>Strong Password</span>
                          <div className='eyes'>
                            <button onClick={this.togglePassVisibility}><i className={(ispasswordShown) ? "fa fa-eye-slash" : "fa fa-eye"} ></i></button>
                          </div>
                        </div>

                      </div>
                      <div className='mb-3'>
                        <div className='position-relative'>
                          <input
                            type={(ispasswordShown2) ? "text" : "password"}
                            placeholder='Confirm New Password'
                            className="input-style3"
                          />
                          <span className='error-msg'>Password does not match</span>
                          <div className='eyes'>
                            <button onClick={this.togglePassVisibility2}><i className={(ispasswordShown2) ? "fa fa-eye-slash" : "fa fa-eye"} ></i></button>
                          </div>
                        </div>
                      </div>
                    </div>


                    <div className='row'>
                      <div className='col-6'><button data-dismiss="modal" className='btn-white w-100'>Cancel</button></div>
                      <div className='col-6'><button className='btn-black w-100'>Submit</button></div>
                    </div>
                  </div>
                </div>


                <div className='row justify-content-center'>
                  <div className='col-lg-6 text-center'>
                    <h4 valuemb-4="true">Password Changed Successfully !</h4>
                    <img src="images/cps.png" className='img-fluid' />
                    <button data-dismiss="modal" className='btn-black w-50'>Go to Lender Portal</button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

      </>
    )
  }
}

function mapStateToProps(state) {
  const { user_id } = state.auth;
  const { lead_count, lead_data } = state.user;
  return {
    lead_count,
    user_id,
    lead_data
  };
}

export default connect(mapStateToProps)(Sidebar);