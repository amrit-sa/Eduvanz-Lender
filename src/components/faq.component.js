import React, { Component } from "react"
import $ from "jquery";
import { connect } from "react-redux"
import { Accordion } from "react-bootstrap"
import Helmet from "react-helmet"
import Sidebar from "../common/sidebar";

class Faq extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {
        //Resource Areas
        // $('.content-panel').hide();
        $('.faq-accordion .faq-content').eq(0).children('.answer').show();
        $('.faq-accordion .faq-content').eq(0).children('.question').addClass('active');

        $('.question').click(function(){
        $(this).parent('.faq-content').siblings('.faq-content').children('.answer').slideUp();
        $(this).parent('.faq-content').siblings('.faq-content').children('.question').removeClass('active');
        $(this).toggleClass('active');
        $(this).next('.answer').slideToggle();
        });

        $('#sidebarToggleTop').on('click', function () {
            $('.sidebar-wrapper').toggleClass('toggled');
          })
          $('.sidbar-close').on('click', function () {
            $('.sidebar-wrapper').removeClass('toggled');
          })
          //
          $('.inner-accordion h3').on('click', function(){
            $(this).siblings('.answer').slideUp();
            
            if($(this).next('.answer').is(":visible")){
                $(this).next('.answer').slideUp();
            }else{
                $(this).next('.answer').slideToggle();
            }
            
          })
  }

  render() {
    return (
        <>
        <Helmet>
            <title> Eduvanz Faq </title>
        </Helmet>
        <div id="wrapper">
        {/* Sidebar */}
        <Sidebar />
            <div id="content-wrapper" className="d-flex flex-column">
                <div className="container-fluid lead_details_header">
                    <div className="row align-items-center">
                        <div className="col-md-4 col-6  mb-3 mb-md-0">
                            <h1>
                                {/* <button id="sidebarToggleTop" className="d-lg-none rounded-circle mr-3">
                                    <i className="fa fa-bars" />
                                </button> */}
                                <div className="backicon"><a href="/closed"> <img src="img/icon_back.svg" /></a></div> Frequently Asked Questions
                                </h1>
                            <p style={{margin:"10px 0px 0px 45px",color:"#969696"}}>What do you need help with ?</p>
                        </div>
                        <div className="col-md-4">
                            <form action="" className="search-form nav_search">
                            <div className="form-group has-feedback">
                                <label htmlFor="search" className="sr-only">
                                Search
                                </label>
                                <input
                                type="text"
                                className="form-control"
                                name="search"
                                id="search"
                                placeholder="Find FAQ"
                                />
                            </div>
                            </form>
                        </div>
                        <div className="nav_profile ml-auto">
                  <div className="nav-link">
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
                  </div>
                  <div
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
                  </div>
                  
            </div>
                    </div>
                </div>
                <div id="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="faq-accordion">
                                    <div className="faq-content">
                                        <h2 className="question">Payments</h2>
                                        <div className="answer">
                                            <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  className="faq-content">
                                        <h2 className="question">Disbursement Pending</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  className="faq-content">
                                        <h2 className="question">Declined Case</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  className="faq-content">
                                        <h2 className="question">Dropped Case</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                            <div className="faq-accordion">
                                    <div  className="faq-content">
                                        <h2 className="question">Payments</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  className="faq-content">
                                        <h2 className="question">Disbursement Pending</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  className="faq-content">
                                        <h2 className="question">Declined Case</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div  className="faq-content">
                                        <h2 className="question">Dropped Case</h2>
                                        <div className="answer">
                                        <div className="inner-accordion">
                                                <h3>How to download CAM?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to configure Email?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                                <h3>How to add user?</h3>
                                                <div className="answer">
                                                    <p>To Download CAM the loan should be approved by lender then only download CAM button is enabled</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div>
        </div> 

        </>
    );
  }
}

export default Faq;
