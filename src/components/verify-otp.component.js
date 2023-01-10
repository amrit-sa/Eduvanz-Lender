import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { checkOtp, salesForceLogin, mobileLogin } from "../actions/auth";
import { setMobileNo } from "../actions/users";

const style = {
  backgroundImage: "url(" + "images/background.png" + ")",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  minHeight: 500
}

class VerifyOtp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      isSuccess: true,
      errorMsg: '',
      timer: '00:30',
      viewResend: false,
      showResendOtp: true,
      resendOtpSuccess: '',
      showResendOtpSuccess: false,
    };
    this.textInput1 = React.createRef();
    this.textInput2 = React.createRef();
    this.textInput3 = React.createRef();
    this.textInput4 = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.startTimer = this.startTimer.bind(this);
  }

  switchTab=(val)=>{
    this.props.handleTab(val)
    this.props.history.push("/login")
  }
  componentDidMount() {
    this.startTimer();
    this.handleClearMeaage();
  }

  handleClearMeaage = () => {
    // this.props.dispatch(clearMessage());
  }

  startTimer() {
    var presentTime = this.state.timer;
    var timeArray = presentTime.split(/[:]+/);
    var m = timeArray[0];
    var s = this.checkSecond((timeArray[1] - 1));
    if (s == 59) { m = m - 1 }
    if (m < 0) {
      return
    }
    if (m === '00' && s === '00') {
      this.setState({ viewResend: true });
    }
    this.setState({ timer: m + ":" + s });
    setTimeout(this.startTimer, 1000);
  }

  checkSecond(sec) {
    if (sec < 10 && sec >= 0) { sec = "0" + sec };
    if (sec < 0) { sec = "59" };
    return sec;
  }

  handleChange(value1, event) {
    this.setState({ [value1]: event.target.value, isSuccess: true, errorMsg: '' });
    if (value1 === 'otp4') {
      this.handleSubmit(event.target.value);
    }
  }

  inputfocus = (elmnt, getvalue) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      //const next = elmnt.target.tabIndex - 2;
      const next = elmnt.target.tabIndex;
      this.backwardFocus(next);
      /* if (next > -1) {
        
        elmnt.target.form.elements[next].focus()
      } */
    }
    else {
      const pattern = /^[0-9]$/;
      if (pattern.test(elmnt.target.value)) {
        const next = elmnt.target.tabIndex;
        if (next < 5) {
          this.forwardFocus(next);
          //  elmnt.target.form.elements[next].focus()
        }
      } else {
        this.setState({ [getvalue]: '' });
        document.getElementById(getvalue).value = '';
      }
    }

  }

  handleSubmit(value) {
    const { dispatch, history, log, onBording } = this.props;
    var pattern = new RegExp(/^[0-9\b]+$/);
    if (pattern.test(this.state.otp1) && pattern.test(this.state.otp3) && pattern.test(value) && pattern.test(this.state.otp2)) {
      const givenOtp = parseInt(this.state.otp1 + this.state.otp2 + this.state.otp3 + value);
      let data = {
        otp: givenOtp,
        logId: parseInt(log)
      }
      dispatch(checkOtp(data))
        .then((response) => {
          if (response.status === 'success') {
            let obj = { id: this.props.user_id, token: this.props.token_id }
            this.setState({ isSuccess: true, errorMsg: '' })
            dispatch(salesForceLogin(obj));
            if (response.setPassword === true) {
              history.push("/dashboard");
            }
            else {
              history.push("/edSetPassword/" + response.id);
            }
          } else {
            this.setState({ isSuccess: false, errorMsg: response.message })
          }
        });
    }
  }

  handleSignup = () => {
    const { history } = this.props;
    history.push("/editmobile");
  }

  forwardFocus = (value) => {
    if (value === 1) {
      this.textInput2.current.focus();
    } else if (value === 2) {
      this.textInput3.current.focus();
    } else if (value === 3) {
      this.textInput4.current.focus();
    }
  }

  backwardFocus = (value) => {
    if (value === 4) {
      this.textInput3.current.focus();
    } else if (value === 3) {
      this.textInput2.current.focus();
    } else if (value === 2) {
      this.textInput1.current.focus();
    }
  }

  handleEditMobile = (mobile_no) => {
    this.props.dispatch(setMobileNo(mobile_no));
    this.props.history.push('/login')
  }

  handleResendOtp = (e) => {
    e.preventDefault();
    let obj = {
      mobile_no: this.props.log_mobile,
    }
    this.props.dispatch(mobileLogin(obj)).then(res => {
      if (res.responseCode === 200) {
        this.setState({ resendOtpSuccess: res.message, showResendOtpSuccess: true });
      }
      setTimeout(() => {
        this.setState({ resendOtpSuccess: '', showResendOtpSuccess: false });
      }, 5000);
    })
  }

  render() {
    const { isLoading, log_mobile, isLoggedIn, message, user_id, token } = this.props;
    console.log(this.props.log_mobile);
    const { isSuccess, errorMsg } = this.state

    return (
      <>
        <Helmet>
          <title>Verify Otp</title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}
        <div className="flex-w flex-tr">

          <div className="size-50 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md primary-card">
            <div className="textpart">
              <h4 className="mtext-105 cl2 txt-left pb-1 pb-lg-5"><img src="images/logo-stride.png" /></h4>
              <h1 className="titfnt text-white">
                <span className="d-block">Welcome to Lender Portal</span>
              </h1>
            </div>
          </div>

          <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
            <div className="lendar_centered">
               <ul className="nav nav-pills nav-fill c_nav_2 justify-content-center">
                  <li className={`nav-link ico_mobile selected`}>
                    <a style={{cursor:'pointer'}} href={void(0)} >Mobile</a>
                  </li>
                  <li className={` nav-link ico_email`}>
                    <a style={{cursor:'pointer'}} href={void(0)} onClick={()=>this.switchTab(1)}>Email</a>
                  </li>
                </ul>
              <form >
                <div className="fields_bg_1">
                  <div className="lendar_minh1">
                    <h3>Sign in</h3>
                    <div className="checkbox mb-3">
                      <label>We have sent the 4 digit OTP to your registered mobile {log_mobile} <button type="button" onClick={() => this.handleEditMobile(log_mobile)} className="ml-2"><img src="images/icons/edit.svg" /></button></label>

                    </div>

                    <div className={`otpfields d-flex justify-content-between ${isSuccess == false && errorMsg != '' ? "err" : ""}`}>
                      <input
                        className="otp"
                        name="otp1"
                        id="otp1"
                        type="text"
                        autoComplete="off"
                        value={this.state.otp1 ? this.state.otp1 : ''}
                        onKeyPress={this.keyPressed}
                        onChange={e => this.handleChange("otp1", e)}
                        tabIndex="1"
                        maxLength="1"
                        placeholder={0}
                        ref={this.textInput1}
                        onKeyUp={e => this.inputfocus(e, 'otp1')}
                        onFocus={() => this.setState({ showResendOtp: false })}
                      />
                      <input
                        className="otp"
                        name="otp2"
                        id="otp2"
                        type="text"
                        autoComplete="off"
                        value={this.state.otp2 ? this.state.otp2 : ''}
                        onKeyPress={this.keyPressed}
                        onChange={e => this.handleChange("otp2", e)}
                        tabIndex="2"
                        maxLength="1"
                        placeholder={0}
                        ref={this.textInput2}
                        onKeyUp={e => this.inputfocus(e, 'otp2')}
                      />
                      <input
                        className="otp"
                        name="otp3"
                        id="otp3"
                        type="text"
                        placeholder={0}
                        value={this.state.otp3 ? this.state.otp3 : ''}
                        onKeyPress={this.keyPressed}
                        onChange={e => this.handleChange("otp3", e)}
                        tabIndex="3"
                        maxLength="1"
                        ref={this.textInput3}
                        onKeyUp={e => this.inputfocus(e, 'otp3')}
                      />
                      <input
                        className="otp"
                        name="otp4"
                        id="otp4"
                        type="text"
                        placeholder={0}
                        autoComplete="off"
                        value={this.state.otp4 ? this.state.otp4 : ''}
                        onKeyPress={this.keyPressed}
                        onChange={e => this.handleChange("otp4", e)}
                        tabIndex="4"
                        maxLength="1"
                        ref={this.textInput4}
                        onKeyUp={e => this.inputfocus(e, 'otp4')}
                      />
                    </div>
                  </div>
                  {isSuccess == false && errorMsg != '' ? (
                    <p className="text-center mt-3 error">{errorMsg}</p>
                  ) : ''
                  }
                  {!this.state.viewResend && this.state.showResendOtp === false && (
                    <div className="text-center mr-btn-sty">
                      <img src="images/icons/icon-ind.png" /> Verification code valid for next
                      {' ' + this.state.timer} min
                    </div>
                  )}
                  {this.state.showResendOtp && (
                    <div className="checkbox text-center d-block mb-3">

                      Don’t receive the OTP? <button style={{ color: 'blue' }} onClick={(e) => this.handleResendOtp(e)}>Resend OTP</button>

                    </div>
                  )}
                  <button type="submit" className="btn btn-dark btn-full">
                    Confirm
                  </button>
                  {this.state.showResendOtpSuccess && <div className="text-success mt-2">{this.state.resendOtpSuccess}</div>}
                </div>
              </form>
            </div>

          </div>

        </div>

        {/* <div className="lendar_page">
        <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 lendar_left d-flex align-items-center justify-content-center">
            <div className="lendar_logo">Eduvanz.</div>
            <div className="lendar_welcome">Welcome to Lender Portal</div>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
          
            </div>
          </div>
        </div>
      </div> */}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, log_mobile, log, user_id, token_id, isLoading } = state.auth;
  const { message } = state.message;
  return {
    log_mobile,
    isLoggedIn,
    isLoading,
    token_id,
    message,
    user_id,
    log
  };
}

export default connect(mapStateToProps)(VerifyOtp);
