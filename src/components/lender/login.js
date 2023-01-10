import React, { Component } from "react"
import { connect } from "react-redux"
import Helmet from "react-helmet"

const style= { 
    backgroundImage: "url(" + "images/background.png" + ")",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: 500
  }

class LenderLogin extends Component {
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
            <title> Lender - Login </title>
        </Helmet>
        <div className="lendar_page">
        <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 lendar_left d-flex align-items-center justify-content-center">
          	<div className="lendar_logo">Eduvanz.</div>
           	<div className="lendar_welcome">Welcome to Lender Portal</div>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            <div className="lendar_centered" >
           		
              <ul className="nav nav-pills nav-fill c_nav_2 justify-content-center">
              <li className={`nav-link ico_mobile ${selectedTab ===2?"selected":""}`}>
                  <a style={{cursor:'pointer'}} onClick={() => this.handleTab(2)} href={void(0)} >Mobile</a>
                </li>
                <li className={` nav-link ico_email ${selectedTab ===1?"selected":""}`}>
                  <a style={{cursor:'pointer'}} onClick={() => this.handleTab(1)} href={void(0)}>Email</a>
                </li>
              </ul>
            
            {selectedTab ===1?(
                <form action="/action_page.php">
                <div className="fields_bg_1">
                <div className="lendar_minh1">
                <h3>Sign in</h3>
                  <div className="form-group">
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Email Address"
                      name="email"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="pwd"
                      placeholder="Password"
                      name="pwd"
                    />
                  </div>
                  </div>
                  <div className="checkbox">
                    <label>
                      <input type="checkbox" name="remember" /> Remember me 
                    </label>
                  </div>
                  <button type="submit" className="btn btn-dark btn-full">
                     Login
                  </button>
                  </div>
                </form>
            ):(
              <form action="/action_page.php">
              <div className="fields_bg_1">
              <div className="lendar_minh1">
              <h3>Sign in</h3>
              
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="mobile"
                      placeholder="Mobile Number"
                      name="mobile"
                      maxLength={10}
                    />
                    </div>
                  </div>
                  <div className="checkbox text-center d-block">
                    <label>
                      You will receive an OTP on this number
                    </label>
                  </div>
                  <button type="submit" className="btn btn-dark btn-full">
                     Login
                  </button>
                  </div>
                </form>
            )}
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

export default connect(mapStateToProps)(LenderLogin);
