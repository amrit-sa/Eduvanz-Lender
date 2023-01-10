import React, { Component } from "react"
import $ from 'jquery';
import { connect } from "react-redux"
import Helmet from "react-helmet"
import { changePassword } from "../actions/auth"
import { Redirect } from "react-router-dom";

const initial = {
  password: "",
  cnf_password: "",
  cust_id: "",
  passError: '',
  cpassError: '',
  loading: false,
  isValid: true,
  errorMsg: '',
  cpassMsg: '',
  passwordType: 'password',
  cpasswordType: 'password',
  isValidPass: false,
  isValidCpass: null,
  isChangePass: false,
};

class ChgPassword extends Component {
  constructor(props) {
    super(props);
    this.state = initial
    this.handleChangePassword = this.handleChangePassword.bind(this)
  }

  componentDidMount() {
    $('.labelFocus input').change(function () {
      var $this = $(this);
      if ($this.val())
        $this.addClass('filled')
      else
        $this.removeClass('filled')
    })
  }


  handleNewpassword = (elament) => {
    // alert(elament.target.value.length)
    this.setState({ password: elament.target.value });
    if (elament.target.value === "") {
      this.setState({ passError: '', isValidPass: false, isValidCpass: false });
    }
    else if (elament.target.value.search(/[0-9]/) < 0) {
      this.setState({ passError: 'Your password must contain at least one number', isValidPass: false })
    }
    else if (elament.target.value.search(/[!@#$%^&*]/) < 0) {
      this.setState({ passError: 'Your password must contain at least one special charactor', isValidPass: false })
    }
    else if (elament.target.value.length < 8 || elament.target.value.length > 40) {
      console.log('111111111')
      this.setState({ passError: 'The password must be between 8 and 40 characters.', isValidPass: false });
    } else {
      this.setState({ passError: '' ,isValidPass: true });
    }

    if (this.state.cnf_password.length > 0) {
      if (elament.target.value !== this.state.cnf_password) {
        this.setState({ cpassError: 'Password does not match', isValidCpass: false });
      } else {
        this.setState({ cpassError: '', isValidCpass: true });
      }
    }
  };

  handleCpassword = (elament) => {
    this.setState({ cnf_password: elament.target.value });
    if(elament.target.value.length === 0){
      this.setState({ cpassError: '', isValidCpass: false });
      return
    }
    if (elament.target.value !== this.state.password) {
      this.setState({ cpassError: 'Password does not match', isValidCpass: false });
    } else {
      this.setState({ cpassError: '', isValidCpass: true });
    }
  };

  handleChangePassword(e) {
    e.preventDefault();
    const { dispatch } = this.props
    if (this.state.password == this.state.cnf_password) {
      let data = {
        newPassword: this.state.password,
        confirmPassword: this.state.cnf_password,
        id: this.state.cust_id,
      }
      dispatch(changePassword(data)).then((response) => {
        if (response.responseCode != undefined && response.responseCode == "200") {
          this.setState({ isValid: true, errorMsg: '', isChangePass: true });
          // window.location.href = "/password_success";
        } else {
          this.setState({ isValid: false, errorMsg: response.message });
        }
      }).catch((error) => {
        this.setState({ isValid: false, errorMsg: error });
      });
    }
    else {
      this.setState({ isValid: false, errorMsg: "Passwords does not match", password: "" });
      document.getElementById('password').value = "";
      document.getElementById('cnf_password').value = "";
    }
  }

  handleCpasswordType = () => {
    if (this.state.cpasswordType === "password") {
      this.setState({ cpasswordType: 'text' });
    } else {
      this.setState({ cpasswordType: 'password' });
    }
  }

  handlePasswordType = () => {
    if (this.state.passwordType === "password") {
      this.setState({ passwordType: 'text' });
    } else {
      this.setState({ passwordType: 'password' });
    }
  }


  render() {
    const { isLoading, user_id } = this.props;
    this.state.cust_id = user_id;
    const { passwordType, cpasswordType, isValid, password, cnf_password, isValidPass, isValidCpass, isChangePass } = this.state
    if (!user_id) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Helmet>
          <title> Lender - Change Password </title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}


        <div className="flex-w flex-tr">

          <div className="size-50 bor10 p-lr-70 p-t-55 p-b-70 p-lr-15-lg w-full-md primary-card">
            <div className="textpart">
              <h4 className="mtext-105 cl2 txt-left pb-1 pb-lg-5"><img src="images/logo-stride.png" /></h4>
              <h1 className="titfnt text-white">
                <span className="d-block">Change Password</span>
              </h1>
            </div>
          </div>

          {!isChangePass ? (
            <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
              <div className="lendar_centered" >

                <form onSubmit={this.handleChangePassword}>
                  <div className="fields_bg_1">
                    <div className="lendar_minh1">
                      <h3>Create New Password</h3>

                      {/* <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus">
                          <input
                              className="stext-111 cl2 plh3 size-116  p-r-15"
                              type="text"
                              name="acc_no"
                              value={this.state.acc_no}
                              onChange={this.numberOnly}
                          />
                          <span>Account Number</span>
                        </div> */}

                      <div className="bor8 m-b-35 how-pos4-parent input-group labelFocus">
                        <input
                          type={passwordType ? passwordType : 'password'}
                          className="stext-111 cl2 plh3 size-116  p-r-15"
                          id="password"
                          placeholder=""
                          name="password"
                          onChange={this.handleNewpassword}
                        />
                        <span>New Password</span>
                        <div className="input-group-addon input-group-addon-sty eye-position" onClick={() => this.handlePasswordType()}>
                          {
                            this.state.passwordType == "text" ? (
                              <i style={{ fontSize: '20px' }} className="fa fa-eye-slash" aria-hidden="true" />
                            ) : (<i style={{ fontSize: '20px' }} className="fa fa-eye" aria-hidden="true" />)
                          }
                        </div>
                        {this.state.passError != '' && isValidPass === false ? (
                          <div className="error pos">{this.state.passError}</div>
                        ) : ""}

                        {
                          this.state.isValidPass === true && <div className="success pos">Strong Password</div>
                        }

                      </div>
                      <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus">
                        <input
                          type={cpasswordType ? cpasswordType : 'password'}
                          className="stext-111 cl2 plh3 size-116  p-r-15"
                          id="cnf_password"
                          placeholder=""
                          name="cnf_password"
                          onChange={this.handleCpassword}
                          disabled={!this.state.isValidPass}
                        />

                        <span>Confirm New Password</span>

                        <div className="input-group-addon input-group-addon-sty eye-position" onClick={() => this.handleCpasswordType()}>
                          {
                            this.state.cpasswordType == "text" ? (
                              <i style={{ fontSize: '20px' }} className="fa fa-eye-slash" aria-hidden="true" />
                            ) : (<i style={{ fontSize: '20px' }} className="fa fa-eye" aria-hidden="true" />)
                          }
                        </div>
                        {this.state.cpassError && (
                          <div className="error pos">{this.state.cpassError}</div>

                        )}

                        {isValid == false && this.state.errorMsg && (
                          <div className="error pos">{this.state.errorMsg}!</div>
                        )}
                        {isValidCpass && (
                          <div className="success pos">Password Matched</div>
                        )}
                        {/* <div className="error pos">Password does not match</div> */}
                        {/* <div className="success pos">Password Matched</div> */}
                      </div>
                      <div className="row mt-5 pt-5">
                        <div className="col-sm-6">
                          <a href="/dashboard"> <button
                            type="button"
                            className="btn-full white btn"
                          >
                            Back
                          </button>
                          </a>
                        </div>
                        <div className="col-sm-6">
                          <button type="submit" disabled={password && cnf_password && isValidPass && isValidCpass && password === cnf_password ? false : true} className="btn-full btn" >
                            Submit
                          </button>
                        </div>
                      </div>


                    </div>
                  </div>
                </form>

              </div>

            </div>
          ) : (
            <div className="size-210 bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
              <div className="lendar_centered" >
                <div className="fields_bg_1">
                  <div className="lendar_minh1">
                    <div className="m-b-20 how-pos4-parent input-group labelFocus">
                      <img src="images/3d_password.png" />
                      <h2 className="text-center w-100 pr-5 font-weight-bold">Congratulations!</h2>
                      <div className="success pos ml-5" style={{ fontSize: '18px', fontWeight: 500 }}>You have changed password successfully!</div>
                    </div>
                    <div className="row pt-5">
                      <button type="button" onClick={() => this.props.history.push('/dashboard')} className="btn-full btn" >
                        Go to Lender Portal
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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

export default connect(mapStateToProps)(ChgPassword);
