import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";

const style= { 
  backgroundImage: "url(" + "images/background.png" + ")",
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  minHeight: 500
} 

class LenderVerifyOtp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false,
      selectedTab: 1,
    };
  }

  handleTab = (value) =>{
    this.setState({selectedTab: value});
  }

  render() {
    const { isLoggedIn, message } = this.props;
    const { selectedTab } = this.state
    return (
      <>
      <Helmet>
        <title>Verify Otp</title>
      </Helmet>
      <div className="lendar_page">
        <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 lendar_left d-flex align-items-center justify-content-center">
            <div className="lendar_logo">Eduvanz.</div>
            <div className="lendar_welcome">Welcome to Lender Portal</div>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
          <div className="lendar_centered">
          <ul className="nav nav-pills nav-fill c_nav_2 justify-content-center">
              <li className={`nav-link ico_mobile selected`}>
                  <a style={{cursor:'pointer'}} onClick={() => this.handleTab(2)} href={void(0)} >Mobile</a>
                </li>
                <li className={` nav-link ico_email`}>
                  <a style={{cursor:'pointer'}} onClick={() => this.handleTab(1)} href={void(0)}>Email</a>
                </li>
              </ul>
                <form action="/action_page.php">
                <div className="fields_bg_1">
                <div className="lendar_minh1">
                <h3>Sign in</h3>
                <div className="checkbox"><label>We have sent the 4 digit OTP to your registered mobile 7040557698</label></div>
                <div className="otpfields d-flex">
                <input
                    className="otp"
                    name="otp1"
                    id="otp1"
                    type="text"
                    autoComplete="off"
                    tabIndex="1" 
                    maxLength="1" 
                    placeholder={0}
                />
                <input
                    className="otp"
                    name="otp2"
                    id="otp2"
                    type="text"
                    autoComplete="off"
                    tabIndex="2" 
                    maxLength="1" 
                    placeholder={0}
                />
                <input
                    className="otp"
                    name="otp3"
                    id="otp3"
                    type="text"
                    autoComplete="off"
                    tabIndex="3" 
                    maxLength="1" 
                    placeholder={0}
                />
                <input
                    className="otp"
                    name="otp4"
                    id="otp4"
                    type="text"
                    autoComplete="off"
                    tabIndex="4" 
                    maxLength="1" 
                    placeholder={0}
                />
                </div>
                </div>
                <div className="checkbox text-center d-block">
                    <label>
                      Don’t receive the OTP?
                    </label>
                  </div>
                  <button type="submit" className="btn btn-dark btn-full">
                     Confirm
                  </button>
                </div>
                </form>
            </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(LenderVerifyOtp);
