import React, { Component } from "react"
import { connect } from "react-redux"
import Helmet from "react-helmet"
import { changePassword } from "../actions/auth"
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

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = initial
    this.handleChangePassword = this.handleChangePassword.bind(this)
  }

  
    handleNewpassword = (elament) => {
      this.setState({ password:elament.target.value});
    if(elament.target.value.length < 6 || elament.target.value.length > 40)
    {
        this.setState({ passError: 'The password must be between 6 and 40 characters.'});
    }else{
        this.setState({ passError: ''});
    }
  };

  handleCpassword = (elament) => {
    this.setState({ cnf_password:elament.target.value});
    if(elament.target.value.length < 6 || elament.target.value.length > 40)
    {
        this.setState({ cpassError: 'The password must be between 6 and 40 characters.'});
    }else if(elament.target.value !== this.state.password)
    {
        this.setState({ cpassError: 'Passwords must be same.'});
    }else{
        this.setState({ cpassError: ''});
    }
  };

  handleChangePassword(e){
    e.preventDefault();
    const { history, dispatch } = this.props
    if(this.state.password == this.state.cnf_password)
    {
      let data = {
        newPassword: this.state.password,
        confirmPassword: this.state.cnf_password,
        id: this.state.cust_id,
      }
      dispatch(changePassword(data)).then((response)=>{
        if(response.responseCode !=undefined && response.responseCode =="200")
        {
            this.setState({isValid: true, errorMsg: ''});
            window.location.href = "/login";
        }else{
          this.setState({isValid: false, errorMsg: response.message});
        }
      }).catch((error)=>{
        this.setState({isValid: false, errorMsg: error});
      });
    }
    else
    {
      this.setState({isValid : false, errorMsg : "Passwords must be same.", password : ""});
      document.getElementById('password').value="";
      document.getElementById('cnf_password').value="";
    }
  }


  render() {
    const { isLoading, isLoggedIn, message, id, token_id } = this.props;
    if(!token_id){
      return <Redirect to="/login" />
   }
    this.state.cust_id = id;
    const { isValid, password, cnf_password } = this.state
    const btn = {background: '#e7dede', color: '#958787', borderColor: '#eceff3'}
    return (
        <>
        <Helmet>
            <title> Lender - Change Password </title>
        </Helmet>
        {isLoading?(
              <div className="loading">Loading&#8230;</div>
        ):''}
        <div className="flex-w flex-tr">
        <div className="size-50 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md primary-card">
          <div className="textpart">
              <h4 className="mtext-105 cl2 txt-left pb-1 pb-lg-5"><img src="../images/logo-stride.png" /></h4>
              <h1 className="titfnt text-white">
                  <span className="d-block">Welcome to Lender Portal</span>
                </h1>
            </div>
        </div>
          <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
            <div className="lendar_centered" >          
          
                <form onSubmit={this.handleChangePassword}>
                <div className="fields_bg_1">
                <div className="lendar_minh1">
                <h3>Set Password</h3>
                  
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Password"
                      name="password"
                      onChange={this.handleNewpassword}
                    />
                  </div>
                  {this.state.passError !=''?(
                                <div className="alert alert-danger" role="alert">
                                    {this.state.passError}
                              </div>
                            ):""}
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      id="cnf_password"
                      placeholder="Re-enter Password"
                      name="cnf_password"
                      onChange={this.handleCpassword}
                    />
                  </div>
                  {this.state.cpassError !=''?(
                                <div className="alert alert-danger" role="alert">
                                    {this.state.cpassError}!
                              </div>
                            ):""}
                  {isValid == false && this.state.errorMsg !=''?(
                      <div className="form-group">
                        <div className={"alert alert-danger" } role="alert">
                        {this.state.errorMsg}
                        </div>
                      </div>
                    ):''
                    }
                 
                  <button 
                    type="submit" 
                    disabled={password !=='' && cnf_password !==''?false:true}
                    style={password !=='' && cnf_password !==''?{}:btn}
                    className="btn btn-dark btn-full"
                    >
                     Submit
                  </button>
                  </div>
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
    const { isLoggedIn, isLoading, token_id } = state.auth;
    console.log(token_id);
    const { message } = state.message;
    return {
      isLoggedIn,
      message,
      isLoading,
      token_id
    };
  }

export default connect(mapStateToProps)(ChangePassword);
