import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import { checkOtp, mobileLogin } from "../actions/auth";

class ForgotOtp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      otp1: "",
      otp2: "",
      otp3: "",
      otp4: "",
      isSuccess: true,
      errorMsg: '',
      showResendOtp:true,
      resendOtpSuccess:'',
      showResendOtpSuccess:false,
    };
    
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value1, event) {
    this.setState({ [value1]: event.target.value, isSuccess: true, errorMsg: ''});
    if(value1 === 'otp4')
    {
      this.handleSubmit(event.target.value);
    }
  }

  inputfocus = (elmnt, getvalue) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus()
      }
    }
    else {
      const pattern = /^[0-9]$/;
      if(pattern.test(elmnt.target.value))
      {
        const next = elmnt.target.tabIndex;
        if (next < 4) {
          elmnt.target.form.elements[next].focus()
        }
      }else{
        this.setState({[getvalue]: ''});
        document.getElementById(getvalue).value = '';
      } 
    }

  }

  handleSubmit(value) {
    const { dispatch, history, log, onBording } = this.props;
    var pattern = new RegExp(/^[0-9\b]+$/);
    if(pattern.test(this.state.otp1) && pattern.test(this.state.otp3) && pattern.test(value) && pattern.test(this.state.otp2))
    {
      const givenOtp = parseInt(this.state.otp1+this.state.otp2+this.state.otp3+value);
      let data = { 
          otp: givenOtp,
          logId: parseInt(log)
        }
      dispatch(checkOtp(data))
      .then((response) => {
        if(response.status === 'success'){
          this.setState({ isSuccess: true, errorMsg: ''})
          history.push("/edSetPassword/"+response.id);
        }else{
          this.setState({ isSuccess: false, errorMsg: response.message})
        }
      });
    }
  }

  handleResendOtp =(e) => {
    e.preventDefault();
    let obj = {
      mobile_no:this.props.log_mobile,
    }
    this.props.dispatch(mobileLogin(obj)).then(res => {
      if(res.responseCode === 200){
       this.setState({resendOtpSuccess : res.message,showResendOtpSuccess:true});
      }
      setTimeout(() => {
        this.setState({resendOtpSuccess : '',showResendOtpSuccess:false});
      }, 5000);
    })
  }

  render() {
    const { log_mobile } = this.props;
    const { isSuccess, errorMsg } = this.state
    return (
      <>
      <Helmet>
        <title>Forgot Otp</title>
      </Helmet>
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
                
                <form >
                <div className="fields_bg_1">
                <div className="lendar_minh1">
                <h3>Enter Otp</h3>
                <div className="checkbox mb-3"><label>We have sent the 4 digit OTP to your registered mobile {log_mobile}</label></div>
                <div className={`otpfields d-flex justify-content-between ${isSuccess == false && errorMsg !=''?"err":""}`}>
                <input
                    className="otp"
                    name="otp1"
                    id="otp1"
                    type="text"
                    autoComplete="off"
                    value={this.state.otp1}
                    onKeyPress={this.keyPressed}
                    onChange={e => this.handleChange("otp1", e)}
                    tabIndex="1" 
                    maxLength="1" 
                    placeholder={0}
                    onKeyUp={e => this.inputfocus(e,'otp1')}
                    onFocus = {() => this.setState({showResendOtp:false})}
                />
                <input
                    className="otp"
                    name="otp2"
                    id="otp2"
                    type="text"
                    autoComplete="off"
                    value={this.state.otp2}
                    onChange={e => this.handleChange("otp2", e)}
                    tabIndex="2" 
                    maxLength="1" 
                    placeholder={0}
                    onKeyUp={e => this.inputfocus(e,'otp2')}
                />
                <input
                    className="otp"
                    name="otp3"
                    id="otp3"
                    type="text"
                    placeholder={0}
                    value={this.state.otp3}
                    onChange={e => this.handleChange("otp3", e)}
                    tabIndex="3" 
                    maxLength="1" 
                    onKeyUp={e => this.inputfocus(e, 'otp3')}
                />
                <input
                    className="otp"
                    name="otp4"
                    id="otp4"
                    type="text"
                    placeholder={0}
                    autoComplete="off"
                    value={this.state.otp4}
                    onChange={e => this.handleChange("otp4", e)}
                    tabIndex="4" 
                    maxLength="1" 
                    onKeyUp={e => this.inputfocus(e, 'otp4')}
                />
                </div>
                </div>
                {isSuccess == false && errorMsg !=''?(
                      <div style={{marginTop: 10}} className="form-group">
                        <div className={"alert alert-danger" } role="alert">
                        {errorMsg}
                        </div>
                      </div>
                ):''
                }
                {this.state.showResendOtp && (
                <div className="checkbox text-center d-block mb-3">
                    
                      Don’t receive the OTP? <button style={{color:'blue'}} onClick={(e) => this.handleResendOtp(e)}>Resend OTP</button>
                   
                  </div>
                )}
                { this.state.showResendOtpSuccess && <div className="text-success mt-3" style={{textAlign:"center"}}>{this.state.resendOtpSuccess}</div>}
                 {/*  <button type="button" className="btn btn-dark btn-full">
                     Confirm
                  </button> */}
                </div>
                </form>
            </div>
            </div>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn, log_mobile, log, user_id, token } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message,
    log_mobile,
    log,
    user_id,
    token
  };
}

export default connect(mapStateToProps)(ForgotOtp);
