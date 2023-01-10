import React, { Component } from "react"
import $ from 'jquery';
import { connect } from "react-redux"
import Helmet from "react-helmet"
import { Redirect } from "react-router-dom";
import { login, mobileLogin, salesForceLogin } from "../actions/auth"

const style = {
  backgroundImage: "url(" + "images/background.png" + ")",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  minHeight: 500
}

const initial = {
  username: "",
  password: "",
  email: "",
  mobile: '',
  loading: false,
  selectedTab: 1,
  isValid: true,
  errorMsg: '',
  passwordType: 'password',
  passwordHide: true,
  isValidEmailId: false,
};

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
}

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
    this.handleChange = this.handleChange.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
    this.handleMobileSubmit = this.handleMobileSubmit.bind(this)
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this)
  }

  componentDidMount() {
    $('.labelFocus input').change(function () {
      var $this = $(this);
      if ($this.val())
        $this.addClass('filled')
      else
        $this.removeClass('filled')
    })

    if (this.props.Mobile_NO) {
      this.setState({ mobile: this.props.Mobile_NO });
    }
  }

  // handleTab = (value) => {
  //   let mystate = initial;
  //   mystate.selectedTab = value;
  //   this.setState(mystate);
  // }

  switchTab=(val)=>{
    this.props.handleTab(val)
  }

  handleChange = (event) => {
    console.log("==", event.target.value.length)
    if (event.target.name == "email") {
      if (!isValidEmail(event.target.value)) {
        this.setState({
          isValidEmailId: true,
        })
      }
      else {
        this.setState({
          isValidEmailId: false,
        })
      }
    if (event.target.value=="") {
        this.setState({
          isValidEmailId: false,
        })

      }
    }
    this.setState({ isValid: true, errorMsg: '' });
    this.setState({ [event.target.name]: event.target.value });
  }

  handleMobile = (e) => {
    const reg = /^[0]?[6789]\d{9}$/;
    var pattern = new RegExp(/^[0-9\b]+$/);
    if (e.target.value !== '') {
      if (!pattern.test(e.target.value)) {
        this.setState({ isValid: false, errorMsg: "Please enter only number.", mobile: "" });
        document.getElementById('mobile').value = "";
      } else if (e.target.value.length === 10) {
        if (reg.test(e.target.value)) {
          this.setState({ isValid: true, errorMsg: "", mobile: e.target.value });
        } else {
          this.setState({ isValid: false, errorMsg: "Please enter valid mobile number.", mobile: e.target.value });
        }
      } else {
        this.setState({ isValid: true, errorMsg: "", mobile: e.target.value });
      }
    } else {
      this.setState({ isValid: false, errorMsg: "", mobile: e.target.value });
    }
  }

  handleMobileSubmit(e) {
    e.preventDefault()
    const { history, dispatch } = this.props
    let data = {
      mobile_no: this.state.mobile
    }
    dispatch(mobileLogin(data)).then((response) => {
      if (response.responseCode != undefined && response.responseCode == "200") {
        this.setState({ isValid: true, errorMsg: '' });
        history.push("/verify_otp");
      } else {
        this.setState({ isValid: false, errorMsg: response });
      }
    }).catch((error) => {
      this.setState({ isValid: false, errorMsg: error });
    });
  }

  handleLoginSubmit(e) {
    e.preventDefault()
    const { history, dispatch } = this.props
    let data = {
      email: this.state.email,
      password: this.state.password
    }
    dispatch(login(data)).then((response) => {
      if (response.responseCode != undefined && response.responseCode == "200") {
        let obj = { id: this.props.user_id, token: this.props.token_id }
        this.setState({ isValid: true, errorMsg: '' })
        dispatch(salesForceLogin(obj));
        history.push("/dashboard");
      } else {
        this.setState({ isValid: false, errorMsg: response });
      }
    }).catch((error) => {
      this.setState({ isValid: false, errorMsg: error });
    });
  }

  handlePassword = () => {
    if (this.state.passwordHide === true) {
      this.setState({ passwordHide: false, passwordType: 'text' });
    } else {
      this.setState({ passwordHide: true, passwordType: 'password' });
    }
  }


  render() {
    const { isLoading, user_id , selectedTab } = this.props;
    const {  mobile, isValid, email, password } = this.state
    if (user_id) {
      return <Redirect to="/dashboard" />
    }
    return (
      <>
        <Helmet>
          <title> Lender - Login </title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}
        <div className="flex-w flex-tr">

          <div className="size-50 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md primary-card">
            <div className="textpart">
              <h4 className="mtext-105 cl2 txt-left pb-1 pb-lg-5"><img src="images/logo-eduvan-title.png" /></h4>
              <h1 className="titfnt text-white">
                <span className="d-block">Welcome to Lender Portal</span>
              </h1>
            </div>
          </div>

          <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
            <div className="lendar_centered" >

              <ul className="nav nav-pills nav-fill c_nav_2 justify-content-center">
                <li className={`nav-link ico_mobile ${selectedTab === 2 ? "selected" : ""}`} style={{ cursor: 'pointer' }} onClick={() => this.switchTab(2)}>
                  <a href={void (0)} >Mobile</a>
                </li>
                <li className={` nav-link ico_email ${selectedTab === 1 ? "selected" : ""}`} style={{ cursor: 'pointer' }} onClick={() => this.switchTab(1)}>
                  <a href={void (0)}>Email</a>
                </li>
              </ul>

              {selectedTab === 1 ? (
                <form onSubmit={this.handleLoginSubmit}>
                  <div className="fields_bg_1">
                    <div className="lendar_minh1">
                      <h3>Sign in</h3>
                      <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus">
                        <span>Email ID</span>
                        <input
                          type="email"
                          className="stext-111 cl2 plh3 size-116  p-r-15"
                          id="email"
                          placeholder="Email ID"
                          name="email"
                          onChange={this.handleChange}
                          autoComplete="off"
                        />
                      </div>
                      {
                        this.state.isValidEmailId &&
                        <p style={{ fontSize: "12px", color: "red" }}>Enter valid email address</p>
                      }
                      <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus">
                        <span>Password</span>
                        <input
                          type={this.state.passwordType}
                          className="stext-111 cl2 plh3 size-116  p-r-15"
                          id="password"
                          placeholder="Password"
                          name="password"
                          onChange={this.handleChange}
                          autoComplete="off"
                        />
                        {
                          this.state.password &&
                          <div className="input-group-addon input-group-addon-sty eye-position" onClick={() => this.handlePassword()}>
                            {
                              this.state.passwordHide ? (
                                <i style={{ fontSize: '20px' }} className="fa fa-eye" aria-hidden="true" />
                              ) : (<i style={{ fontSize: '20px' }} className="fa fa-eye-slash" aria-hidden="true" />)
                            }
                          </div>
                        }
                      </div>
                      {isValid == false && this.state.errorMsg != '' ? (
                        <div className="form-group">
                          <div className={"alert alert-danger"} role="alert">
                            {this.state.errorMsg}
                          </div>
                        </div>

                      ) : ''
                      }
                    </div>
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" name="remember" /> Remember me
                        </label>
                      </div>
                      <a className="link" href="/edForgotpassword">
                        <span>Forgot Password?</span>
                      </a>
                    </div>
                    <button
                      type="submit"
                      disabled={email !== '' && password !== '' ? false : true}
                      // style={email !=='' && password !==''?{}:btn}
                      className="btn-full btn"
                    >
                      Login
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={this.handleMobileSubmit}>
                  <div className="fields_bg_1">
                    <div className="lendar_minh1">
                      <h3>Sign in</h3>
                      <div className="">
                        <label>
                          You will receive an OTP on this number
                        </label>
                      </div>

                      <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus d-flex flex-column">
                        <span>Mobile Number</span>
                        <div className="d-flex justify-content-between align-items-center">
                          <input
                            type="text"
                            className="stext-111 cl2 plh3 size-116  p-r-15"
                            id="mobile"
                            // placeholder="Mobile Number"
                            name="mobile"
                            value={mobile ? mobile : ''}
                            maxLength={10}
                            onChange={this.handleMobile}
                            autoComplete="off"
                          />
                          {mobile && mobile.length === 10 && isValid && <i class="fa fa-check" aria-hidden="true" style={{ color: 'green' }}></i>}
                        </div>


                      </div>
                      {isValid == false && this.state.errorMsg != '' ? (
                        <div className="form-group">
                          <div className={"alert alert-danger"} role="alert">
                            {this.state.errorMsg}
                          </div>
                        </div>
                      ) : ''
                      }
                    </div>

                    <button
                      disabled={mobile.length === 10 && isValid === true ? false : true}
                      type="submit"
                      className={`btn-full btn`}
                    // style={mobile.length ===10 && isValid === true?{}:btn}
                    >
                      Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, isLoading, user_id, token_id } = state.auth;
  const { message } = state.message;
  const { Mobile_NO } = state.user;
  return {
    isLoggedIn,
    message,
    isLoading,
    user_id,
    token_id,
    Mobile_NO,
  };
}

export default connect(mapStateToProps)(Login);
