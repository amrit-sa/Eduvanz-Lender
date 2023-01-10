import React, { Component } from "react"
import $ from 'jquery';
import { connect } from "react-redux"
import Helmet from "react-helmet"
import { mobileLogin} from "../actions/auth"

  const initial = {
    mobile:"",
    loading: false,
    isValid: true,
    errorMsg:'',
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
    this.handleChange = this.handleChange.bind(this)
    this.handleMobile = this.handleMobile.bind(this)
    this.handleMobileSubmit = this.handleMobileSubmit.bind(this)
  }

  componentDidMount(){
    $('.labelFocus input').change(function(){
      var $this = $(this);
      if($this.val())
          $this.addClass('filled')
      else
          $this.removeClass('filled')
      })
  }

  handleChange = (event) =>{
    this.setState({isValid: true, errorMsg: ''});
    this.setState({[event.target.name]: event.target.value});
  }

  handleMobile = (e) => {
    const reg = /^[0]?[6789]\d{9}$/;
    var pattern = new RegExp(/^[0-9\b]+$/);
    if(e.target.value !=='')
    {
      if (!pattern.test(e.target.value)) {
        this.setState({isValid : false, errorMsg : "Please enter only number.", mobile : ""});
      }else if(e.target.value.length === 10)
      {
        if(reg.test(e.target.value))
        {
         this.setState({isValid  : true, errorMsg : "", mobile : e.target.value});
        }else{
          this.setState({isValid : false, errorMsg : "Please enter valid mobile number.", mobile : e.target.value});
        }
      }else{
        this.setState({isValid  : true, errorMsg : "", mobile : e.target.value});
      }
    }else{
      this.setState({isValid  : false, errorMsg : "", mobile : e.target.value});
    }
  }

  handleMobileSubmit(e){
    e.preventDefault()
    const { history, dispatch } = this.props
    let data = {
      mobile_no: this.state.mobile
    }
    dispatch(mobileLogin(data)).then((response)=>{
       if(response.responseCode !=undefined && response.responseCode =="200")
       {
         this.setState({isValid: true, errorMsg: ''});
         history.push("/edForgototp");
       }else{
        this.setState({isValid: false, errorMsg: response});
       }
    }).catch((error)=>{
        this.setState({isValid: false, errorMsg: error});
    });
  }


  render() {
    const { isLoading } = this.props;
    const { isValid, mobile } = this.state
    return (
        <>
        <Helmet>
            <title> Lender - Forgot Password </title>
        </Helmet>
        {isLoading?(
              <div className="loading">Loading&#8230;</div>
        ):''}
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
            <div className="lendar_centered" >          
          
                <form onSubmit={this.handleMobileSubmit}>
                <div className="fields_bg_1">
                <div className="lendar_minh1">
                <h3>Forgot Password</h3>
                  
                <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus">
                    <input
                      type="text"
                      className="stext-111 cl2 plh3 size-116  p-r-15"
                      id="mobile"
                      placeholder=""
                      name="mobile"
                      value={this.state.mobile?this.state.mobile:''}
                      maxLength={10}
                      onChange={this.handleMobile}
                    />
                    <span>Mobile Number</span>
                    </div>
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
                    disabled={mobile && mobile.length ===10 && isValid ?false:true}
                    className="btn-full btn"
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
    const { isLoggedIn, isLoading } = state.auth;
    const { message } = state.message;
    return {
      isLoggedIn,
      message,
      isLoading
    };
  }

export default connect(mapStateToProps)(ForgotPassword);
