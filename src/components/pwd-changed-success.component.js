import React, { Component } from "react"
import { connect } from "react-redux"
import Helmet from "react-helmet"
import { Redirect } from "react-router-dom";

const style= { 
    backgroundImage: "url(" + "images/background.png" + ")",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    minHeight: 500
  }

  const initial = {
    password: "",
    cnf_password: "",
    cust_id: "",
    passError:'',
    cpassError:'',
    loading: false,
    isValid: true,
    errorMsg:''
};

class ChgPasswordSuccess extends Component {
  constructor(props) {
    super(props);
    this.state = initial
  }

 

  render() {
    const { isLoading, isLoggedIn, message, user_id } = this.props;
    console.log(user_id);
    if(!user_id){
      return <Redirect to="/login" />
   }
    this.state.cust_id = user_id;
    const { isValid, password, cnf_password } = this.state
    const btn = {background: '#e7dede', color: '#958787', borderColor: '#eceff3'}
    return (
        <>
        <Helmet>
            <title> Lender - Change Password Success</title>
        </Helmet>
        {isLoading?(
              <div className="loading">Loading&#8230;</div>
        ):''}

<div className="flex-w flex-tr">
        <div className="size-50 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md primary-card">
          <div className="textpart">
              <h4 className="mtext-105 cl2 txt-left pb-1 pb-lg-5"><img src="../images/logo-stride.png" /></h4>
              <h1 className="titfnt text-white">
                  <span className="d-block">Change Password</span>
                </h1>
            </div>
        </div>



          <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
            <div className="lendar_centered" >  

                <div className="fields_bg_1 text-center">
                  <div className="icon_lock">
                    <img src="images/3d_password.png" className="img-fluid"/>
                  </div>   
                  <h2 className="font-weight-bold congratulations-text mb-3">Congratulations!</h2>      
                  <p className="success-text mb-4">You have changed password successfully!</p>
                  <a href="/dashboard" className="btn-full">Go to Lender Portal</a>
                </div>

        
          
          </div>
          </div>
      </div>

    </>
    );
  }
}

function mapStateToProps(state) {
    const { isLoggedIn, isLoading, user_id } = state.auth;
    const { message } = state.message;
    return {
      isLoggedIn,
      message,
      isLoading,
      user_id
    };
  }

export default connect(mapStateToProps)(ChgPasswordSuccess);
