import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet"; 

class LeadDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { isLoggedIn, message } = this.props;
    const { selectedTab } = this.state
    return (
      <>
      <Helmet>
      <title>Lead - Details </title>
      </Helmet>
      <div id="wrapper">
    {/* Sidebar */}
    <div className='sidebar-wrapper'>
              <button className='btn btn-link d-lg-none mr-2 sidbar-close'><img src="images/icons/icon-close.png" /></button>
    <ul
    className="navbar-nav sidebar sidebar-dark accordion"
    id="accordionSidebar"
    >
    <li className="nav-item">
  {/* Sidebar - Brand */}
  <a
  className="sidebar-brand d-flex align-items-center justify-content-center admin-name-w-75"
  href="/dashboard"
  >
  <div className="sidebar-brand-text"><img src="images/adityabirla-logo.png" /></div>
  </a>
  </li>
{/* Nav Item - Dashboard */}
<li className="nav-item icon_dashboard">
<a className="nav-link" href="/dashboard">
<span>Dashboard</span>
</a>
</li>
<li className="nav-item icon_allleads active">
<a className="nav-link" href="/leads">
<span>All Leads <b>99+</b></span>
</a>
</li>
<li className="nav-item icon_approvalpending">
<a className="nav-link" href="#">
<span>Approval Pending</span>
</a>
</li>
<li className="nav-item icon_disbursalpending">
<a className="nav-link" href="#">
<span>Disbursal Pending</span>
</a>
</li>
<li className="nav-item icon_disbursed">
<a className="nav-link" href="#">
<span>Disbursed</span>
</a>
</li>
<li className="nav-item icon_declined">
<a className="nav-link" href="#">
<span>Declined</span>
</a>
</li>
<li className="nav-item icon_dropped">
<a className="nav-link" href="#">
<span>Dropped</span>
</a>
</li>
<li className="nav-item icon_closed">
<a className="nav-link" href="#">
<span>Closed</span>
</a>
</li>
{/* Sidebar Toggler (Sidebar) */}
<div className="nav_profile">
          <div className="nav-link">
          {/* <img
              className="img-profile rounded-circle"
              src="img/undraw_profile.svg"
            /> */}
            <div className="txt-profile">SA</div>
            <span className="profile_name_position">
            <b>Ramesh</b>Admin
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
            <a className="dropdown-item" href="#">
            <i className="fas fa-user fa-sm fa-fw mr-3" />
            Profile
            </a>
            <a className="dropdown-item" href="#">
            <i className="fas fa-cogs fa-sm fa-fw mr-3 " />
            Settings
            </a>
            <a className="dropdown-item" href="#">
            <i className="fas fa-list fa-sm fa-fw mr-3" />
            Activity Log
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
                <div className="sidebar-brand-text">
                      <img src="images/logo-stride.png" />
                  </div>
            </div>
    </ul>
    </div>



            <div id="content-wrapper" className="d-flex flex-column">

            <div className="container-fluid lead_details_header">
            <div className="row align-items-center">
            <div className="col-md-8">
            <div className="backicon float-left"><img src="img/icon_back.svg" /></div>
            <div className="d-flex">
            <div className="pr_img">
            <img className="img-profile rounded-circle" src="img/undraw_profile.svg" />
            </div>
            <div className="pr_texts">
            <h5 className="d-block">A2656236423 <span>Disbursal Pending</span></h5>
            <p>Shivshankar Pandarge <span className="mailid"><img src="img/icon_mail.svg" /> pankaj.mestry@gmail.com</span><span className="contactnum"><img src="img/icon_call.svg" /> 9890079566</span></p>
            </div>
            </div>
            </div>
            <div className="col-md-2">
            <form action="" className="search-form nav_search">
            <div className="form-group has-feedback">
            <label for="search" className="sr-only">Search</label>
            <input type="text" className="form-control" name="search" id="search" placeholder="Find Cases, Users" onclick="myFunction()" />
            </div>
            </form>
            </div>
            <div className="col-md-2 text-right">
            <ul className="topicon_lists">
            <li>
            <a href="#">
            <img src="images/calendar.svg" />
            </a>
            </li>
            <li>
            <a href="#">
            <img src="images/messages.svg" />
            </a>
            </li>
            <li>
            <a href="#">
            <img src="images/download.svg" />
            </a>
            </li>
            </ul>
            </div>
            <div className="col-md-12">
            <div className="row mt-3 align-items-center">
            <div className="col-md-6">
            <div className="backicon float-left visibility-hidden"><img src="img/icon_back.svg" /></div>
            <nav className="float-left">
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
            className="nav-item nav-link active"
            id="nav-loandetails-tab"
            data-toggle="tab"
            href="#nav-loandetails"
            role="tab"
            aria-controls="nav-loandetails"
            aria-selected="true"
            >
            Loan Details
            </a>
            <a
            className="nav-item nav-link"
            id="nav-documents-tab"
            data-toggle="tab"
            href="#nav-documents"
            role="tab"
            aria-controls="nav-documents"
            aria-selected="false"
            >
            Documents
            </a>
            <a
            className="nav-item nav-link"
            id="nav-documents-tab"
            data-toggle="tab"
            href="#nav-repayments"
            role="tab"
            aria-controls="nav-repayments"
            aria-selected="false"
            >
            Repayments
            </a>
            </div>
            </nav>
            </div>
            <div className="col-md-6 text-right tbuttons">
            <button className="btn btn-primary csy1 mr-4"><img src="img/icon_tick.svg" /><b> Approved by: Parth Upadhyay<span className="d-block">On 12 Dec 2021 11:10 AM</span></b>  
            </button>
            <button className="btn btn-primary csy1"><img src="img/icon_tick.svg" /><b> Disbursed by: Aagam Mehta<span className="d-block">On 12 Dec 2021 11:10 AM</span></b>  
            </button>
            </div>
            </div>

            </div>
            </div>
            </div>
            <div id="content">

            <div className="container-fluid">
            <div className="row">
            <div className="col-md-12 pt-2">
            <div className="card">
            <div className="card-body">
            <div className="tab-content" id="nav-tabContent">     
            <div
            className="tab-pane fade active show"
            id="nav-loandetails"
            role="tabpanel"
            aria-labelledby="nav-loandetails-tab"
            >
            <div className="row">  
            <div className="col-md-3">
            <div className="whiteboxed">
            <h6>Financial Borrower Details </h6>
            <h4>Shivshankar Pandarge</h4>
            <div className="personinfo">Male <span className="dob"> 19 Nov 96</span><span className="maritalstatus">Married</span></div>
            <ul className="prooflist">
            <li className="card">
            PAN Number
            <a href="#">AYDPM5548H</a>
            </li>
            <li className="aadhaar">
            Aadhar Number
            <a href="#">XXXXXXXX7859</a>
            </li>
            <li className="card">
            PAN Driving License
            <a href="#">-</a>
            </li>
            </ul>
            <h4>Income Details</h4>
            <div className="personinfo">Salaried <span className="profession"> Private Sector</span><span className="companydetails">Eduvanz Pvt Ltd</span></div>
            <ul className="prooflist">
            <li className="wallet">
            Monthly Income
            <span>₹ 60,000</span>
            </li>
            <li className="stmt">
            Bank Statement
            <a href="#">6 Months</a>
            </li>
            <li className="doc">
            Salary Slips
            <a href="#">6 Months</a>
            </li>
            </ul>
            </div>
            </div>
            <div className="col-md-5">
            <div className="whiteboxed">
            <h6>Product Plan Details</h6>
            <div className="row">
            <div className="col-md-7">
            <h4>Post Graduation in Business Management <span>(Tenure- 10 Months)</span></h4>
            </div>
            <div className="col-md-5">
            <div className="d-flex">
            <div className="col-md-6 pl-0 pr-0">
            <h5 className="s1">FOIR post 
            Eduvanz EMI</h5></div>
            <div className="">Progress Bar</div>
            </div>
            </div>
            </div>
            <div className="table-responsive">
            <table className="billed" cellspacing="0" cellpadding="0">
            <tbody>
            <tr>
            <td><img src="img/icon_bank.svg" /></td>
            <td>Loan Amount</td>
            <td className="text-right"><b>₹ 70,000</b></td>
            </tr>
            <tr>
            <td></td>
            <td><span>Upfront Amount</span><img src="img/icon_iicon.svg" /></td>
            <td className="text-right">₹ 7,000</td>
            </tr>
            <tr>
            <td></td>
            <td><span>Monthly Amount </span><span className="d-block">( from 5-01-2021 )</span></td>
            <td className="text-right">₹ 7,000</td>
            </tr>
            <tr>
            <td><img src="img/icon_money.svg" /></td>
            <td>Total Payable <span>(APR 2%)</span> <img src="img/icon_iicon.svg" /> </td>
            <td className="text-right"><b>₹ 70,000</b></td>
            </tr>
            </tbody>
            </table>
            </div>
            <div className="d-block full_border"></div>
            <h4>Principal Moratorium <span>( 2 months )</span></h4>
            <ul className="timeliner">
            <li className="started w40"><span>Nov 21</span>₹ 500 <label>per month</label></li>
            <li className="inProgress w60"><span>Jan 21</span>₹ 17,000 <label>per month</label></li>
            <li className="completed"><span>May 21</span></li>
            </ul>
            </div>
            </div>
            <div className="col-md-4">
            <div className="whiteboxed">
            <h6>Residential Stability</h6>
            <h4>Addresses</h4>
            <ul className="Addresses mt-3">
            <li>
            <h5>Permanent Address</h5>
            <p>1206, Jainam elysuim, LBS Road, Bhandup - West, Mumbai - 400078, Maharashtra</p>
            <button className="btn btn-small">Owned</button>
            </li>
            <li>
            <h5>Permanent Address</h5>
            <h6>Same as Permanent</h6>
            <p>1206, Jainam elysuim, LBS Road, Bhandup - West, Mumbai - 400078, Maharashtra</p>
            <button className="btn btn-small">Owned</button>
            </li>
            </ul>
            </div>
            </div>
            </div>
            <div className="row mt-5 mb-2">  
            <div className="col-md-12">
            <div className="whiteboxed">
            <div className="row">
            <div className="col-md-2">
            <h6>Credit Factors</h6>
            <h4>Bureau Details</h4>

            </div>
            <div className="col-md-10">
            <nav className="float-left">
            <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a
            className="nav-item nav-link active"
            id="nav-bureau-tab"
            data-toggle="tab"
            href="#nav-bureau"
            role="tab"
            aria-controls="nav-bureau"
            aria-selected="true"
            >
            Bureau Analysis
            </a>
            <a
            className="nav-item nav-link"
            id="nav-liabilities-tab"
            data-toggle="tab"
            href="#nav-liabilities"
            role="tab"
            aria-controls="nav-liabilities"
            aria-selected="false"
            >
            Bureau Liabilities
            </a>
            </div>
            </nav>
            </div>
            </div>

            <div className="row">
            <div className="col-md-12 pt-2">
            <div className="card">
            <div className="card-body">
            <div className="tab-content" id="nav-tabContent-1">     
            <div
            className="tab-pane fade active show"
            id="nav-bureau"
            role="tabpanel"
            aria-labelledby="nav-bureau-tab"
            >
            <div className="row">
            <div className="col-md-2">
            <div className="">Add crdit score js</div>
            <ul className="listhwithcounts">
            <li>Bank Accounts<span>05</span></li>
            <li>Overdues<span>01</span></li>
            <li>0 Balance Ac<span>01</span></li>
            </ul>
            </div>
            <div className="col-md-10">
            <h5 className="s2">Hard Pull Experian <a href="#">View Report</a></h5>
            <h6 className="s1">Borrower's Bureau Analysis <span>Refreshed on: 12th Dec 2021, 11AM</span></h6>
            <div className="row">
            <div className="col-md-6">
            <ul className="listhwithcounts right_border">
            <li>No. of Tradelines with 30+ DPD in last 3 months<span>0</span></li>
            <li>No. of Tradelines with 0+ DPD in last 12 months<span>8</span></li>
            <li>No. of Tradelines with Overdue Amount > 0<span>8</span></li>
            <li>No. of tradelines with Wilful Default/Settlement/Suit Filed/SMA/LSS/DBT Accounts <span>8</span></li>
            </ul>
            </div>
            <div className="col-md-6">
            <ul className="listhwithcounts">
            <li>No. of Tradelines with 90+ DPD in last 12 months <span>0</span></li>
            <li>No. of Tradelines with 0+ DPD in last 3 months <span>0</span></li>
            <li>No. of Tradelines with Overdue Amount > 5000 <span>0</span></li>
            <li>Age in bureau (in months) <span>0</span></li>
            </ul>
            </div>
            </div>
            </div>
            </div>
            </div>
            <div
            className="tab-pane fade"
            id="nav-liabilities"
            role="tabpanel"
            aria-labelledby="nav-liabilities-tab"
            >
            <div className="table-responsive">
            <table className="liabilities" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
            <th>Active Tradelines</th>
            <th>Tradelines</th>
            <th>O/s Balance</th>
            <th>EMI in Bureau</th>
            <th>Imputed EMI</th>
            <th>Obligated EMI</th>
            </tr>
            </thead>
            <tbody>
            <tr>
            <td>Gold Loan</td>
            <td>1</td>
            <td>₹ 45 000</td>
            <td>₹ 5 000</td>
            <td>₹ 5 000</td>
            <td>₹ 5 000</td>
            </tr>
            <tr>
            <td>Education Loan</td>
            <td>3</td>
            <td>₹ 35 000</td>
            <td>₹ 7 000</td>
            <td>₹ 7 000</td>
            <td>₹ 7 000</td>
            </tr>
            <tr>
            <th>Total</th>
            <th>4</th>
            <th>₹ 70 000</th>
            <th>₹ 12 000</th>
            <th>₹ 12 000</th>
            <th>₹ 12 000</th>
            </tr>
            </tbody>
            </table>
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
            <div
            className="tab-pane fade"
            id="nav-documents"
            role="tabpanel"
            aria-labelledby="nav-documents-tab"
            >
            <div className="d-block pt-3 pb-2 pr-3 pl-3">
            <div className="row">
            <div className="col-md-3"> 
            <ul className="nav nav-tabs" id="verticaltab" role="tablist">
            <li className="nav-item">
            <a
            className="nav-link active"
            data-toggle="tab"
            href="#loandocuments"
            role="tab"
            aria-controls="loandocuments"
            >
            Loan Documents (02) <img src="images/download.svg"/>
            </a>
            </li>
            <li className="nav-item">
            <a
            className="nav-link"
            data-toggle="tab"
            href="#kyc"
            role="tab"
            aria-controls="kyc"
            >
            KYC Documents (05) <img src="images/download.svg"/>
            </a>
            </li>
            <li className="nav-item">
            <a
            className="nav-link"
            data-toggle="tab"
            href="#bdocument"
            role="tab"
            aria-controls="bdocument"
            >
            Bureau Document (01) <img src="images/download.svg"/>
            </a>
            </li>
            <li className="nav-item">
            <a
            className="nav-link"
            data-toggle="tab"
            href="#fstatements"
            role="tab"
            aria-controls="fstatements"
            >
            Financial Statements (02) <img src="images/download.svg"/>
            </a>
            </li>
            <li className="nav-item">
            <a
            className="nav-link"
            data-toggle="tab"
            href="#aproofs"
            role="tab"
            aria-controls="aproofs"
            >
            Address Proofs (01) <img src="images/download.svg"/>
            </a>
            </li>
            <li className="nav-item">
            <a
            className="nav-link"
            data-toggle="tab"
            href="#odocuments"
            role="tab"
            aria-controls="odocuments"
            >
            Other Documents (01) <img src="images/download.svg"/>
            </a>
            </li>
            </ul>
            <div className="row">
            <div class="col-md-12 text-right tbuttons">
            <button className="btn btn-primary btn-s1"><img src="images/download.svg"/>Download All</button>
            </div>
            </div>
            </div>
            <div className="col-md-9"> 
            <div className="tab-content">
            <div className="tab-pane active" id="loandocuments" role="tabpanel">
            <h3 className="mb-3">Loan Documents</h3>
            <div className="row">
            <div className="col-md-12 isdownload">
            <h6>Loan Agreement <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/14.jpg"/>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-12 isdownload">
            <h6>Physical Nach <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/15.jpg"/>
            <img src="images/16.jpg"/>
            </div>
            </div>
            </div>
            </div>
            <div className="tab-pane" id="kyc" role="tabpanel">
            <h3 className="mb-3">KYC Documents</h3>
            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>Pan Card <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/pancard.jpg"/>
            </div>
            </div>
            <div className="col-md-6 isdownload">
            <h6>Photo <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/photo.jpg"/>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>Aadhar Card <img src="images/download.svg"/><span>Front View</span></h6>
            <div className="docimgs">
            <img src="images/7.jpg"/>
            </div>
            </div>
            <div className="col-md-6 isdownload">
            <h6><span>Back View</span></h6>
            <div className="docimgs">
            <img src="images/8.jpg"/>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>Driving Licence <img src="images/download.svg"/><span>Front View</span></h6>
            <div className="docimgs">
            <img src="images/1.jpg"/>
            </div>
            </div>
            <div className="col-md-6 isdownload">
            <h6><span>Back View</span></h6>
            <div className="docimgs">
            <img src="images/2.jpg"/>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>Passport <img src="images/download.svg"/><span>Front View</span></h6>
            <div className="docimgs">
            <img src="images/3.jpg"/>
            </div>
            </div>
            <div className="col-md-6 isdownload">
            <h6><span>Back View</span></h6>
            <div className="docimgs">
            <img src="images/4.jpg"/>
            </div>
            </div>
            </div>

            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>Voter id <img src="images/download.svg"/><span>Front View</span></h6>
            <div className="docimgs">
            <img src="images/5.jpg"/>
            </div>
            </div>
            <div className="col-md-6 isdownload">
            <h6><span>Back View</span></h6>
            <div className="docimgs">
            <img src="images/6.jpg"/>
            </div>
            </div>
            </div>
            </div>
            <div className="tab-pane" id="bdocument" role="tabpanel">

            <h3 className="mb-3">Bureau Document</h3>
            <div className="row">
            <div className="col-md-12 isdownload">
            <h6>Bureau Report <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/9.jpg"/>
            </div>
            </div>
            </div>

            </div>
            <div className="tab-pane" id="fstatements" role="tabpanel">

            <h3 className="mb-3">Financial Statements</h3>
            <div className="row">
            <div className="col-md-12 isdownload">
            <h6>Bank Statements <img src="images/download.svg"/><nav className="float-right">
            <div className="nav nav-tabs" id="nav-tab-4" role="tablist">
            <a
            className="nav-item nav-link active"
            id="nav-bankstmt1-tab"
            data-toggle="tab"
            href="#nav-bankstmt1"
            role="tab"
            aria-controls="nav-bankstmt1"
            aria-selected="true"
            >
            Jul-Aug 21
            </a>
            <a
            className="nav-item nav-link"
            id="nav-documents-tab"
            data-toggle="tab"
            href="#nav-bankstmt2"
            role="tab"
            aria-controls="nav-bankstmt2"
            aria-selected="false"
            >
            Sep-Nov 21
            </a>
            </div>
            </nav></h6>
            <div className="card">
            <div className="card-body">
            <div className="tab-content" id="nav-tabContent"> 

            <div
            className="tab-pane fade active show"
            id="nav-bankstmt1"
            role="tabpanel"
            aria-labelledby="nav-bankstmt1-tab"
            >
            <div className="docimgs">
            <img src="images/10.jpg"/>
            </div>
            </div>

            <div
            className="tab-pane fade"
            id="nav-bankstmt2"
            role="tabpanel"
            aria-labelledby="nav-bankstmt2-tab"
            >
            <div className="docimgs">
            <img src="images/11.jpg"/>
            </div>

            </div>

            </div>
            </div>
            </div>
            </div>
            <div className="col-md-12 isdownload">
            <h6>Salary Slips <img src="images/download.svg"/><nav className="float-right">
            <div className="nav nav-tabs" id="nav-tab-3" role="tablist">
            <a
            className="nav-item nav-link active"
            id="nav-bankstmt1-tab"
            data-toggle="tab"
            href="#nav-salaryslip1"
            role="tab"
            aria-controls="nav-salaryslip1"
            aria-selected="true"
            >
            Jul-Aug 21
            </a>
            <a
            className="nav-item nav-link"
            id="nav-documents-tab"
            data-toggle="tab"
            href="#nav-salaryslip2"
            role="tab"
            aria-controls="nav-salaryslip2"
            aria-selected="false"
            >
            Sep-Nov 21
            </a>
            </div>
            </nav></h6>
            <div className="card">
            <div className="card-body">
            <div className="tab-content" id="nav-tabContent"> 

            <div
            className="tab-pane fade active show"
            id="nav-salaryslip1"
            role="tabpanel"
            aria-labelledby="nav-salaryslip1-tab"
            >
            <div className="docimgs">
            <img src="images/11.jpg"/>
            </div>
            </div>

            <div
            className="tab-pane fade"
            id="nav-salaryslip2"
            role="tabpanel"
            aria-labelledby="nav-salaryslip2-tab"
            >
            <div className="docimgs">
            <img src="images/10.jpg"/>
            </div>

            </div>

            </div>
            </div>
            </div>
            </div>
            </div>

            </div>
            <div className="tab-pane" id="aproofs" role="tabpanel">

            <h3 className="mb-3">Address Proofs</h3>
            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>Ration Card <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/12.jpg"/>
            </div>
            </div>
            </div>

            </div>
            <div className="tab-pane" id="odocuments" role="tabpanel">

            <h3 className="mb-3">Other Documents</h3>
            <div className="row">
            <div className="col-md-6 isdownload">
            <h6>CAM Report <img src="images/download.svg"/></h6>
            <div className="docimgs">
            <img src="images/13.jpg"/>
            </div>
            </div>
            </div>

            </div>
            </div>

            </div>
            </div>
            </div>

            
            </div>
            
            <div
            className="tab-pane fade"
            id="nav-repayments"
            role="tabpanel"
            aria-labelledby="nav-repayments-tab"
            >
                <div className="table-responsive repay_table dark_header hscroll mt-3 mb-3">
                        <table
                          className="table"
                          id="dataTable"
                          width="100%"
                          cellSpacing={0}
                        >
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>EMI</th>
                              <th>Due Date</th>
                              <th>Payment Received</th>
                              <th>Payment Date</th>
                              <th>Mode of Payment</th>
                              <th>UTR NO.</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="shown">
                              <td>1</td>
                              <td className="bold">₹ 5,000</td>
                              <td>30-12-2021</td>
                              <td className="bold">₹ 5,000</td>
                              <td>31-12-2021</td>
                              <td className="payment"><img src="images/e-nach.svg"/> E-Nach</td>
                              <td>AG98900765</td>
                              <td className="bold">Paid</td>                              
                            </tr>
                            <tr className="shown">
                              <td>2</td>
                              <td className="bold">₹ 4,000</td>
                              <td>30-12-2021</td>
                              <td className="bold">₹ 4,000</td>
                              <td>31-12-2021</td>
                              <td className="payment"><img src="images/bank.svg"/> Bank</td>
                              <td>AG98900765</td>
                              <td className="bold">Paid</td>                              
                            </tr>
                            <tr className="shown">
                              <td>3</td>
                              <td className="bold">₹ 7,000</td>
                              <td>30-12-2021</td>
                              <td className="bold">₹ 7,000</td>
                              <td>31-12-2021</td>
                              <td className="payment"><img src="images/online.svg"/> Online</td>
                              <td>AG98900765</td>
                              <td className="bold">Paid</td>                              
                            </tr>
                            <tr className="shown">
                              <td>4</td>
                              <td className="bold">₹ 12,000</td>
                              <td>30-12-2021</td>
                              <td className="bold">₹ 12,000</td>
                              <td>31-12-2021</td>
                              <td className="payment"><img src="images/cash.svg"/> Cash</td>
                              <td>Bill#1920</td>
                              <td className="bold">Paid</td>                              
                            </tr>
                            <tr className="shown">
                              <td>5</td>
                              <td className="bold">₹ 10,000</td>
                              <td>30-12-2021</td>
                              <td>-</td>
                              <td>-</td>
                              <td className="payment">-</td>
                              <td>-</td>
                              <td className="bold">Overdue</td>                              
                            </tr>
                            <tr className="shown">
                              <td>6</td>
                              <td className="bold">₹ 11,000</td>
                              <td>30-12-2021</td>
                              <td>-</td>
                              <td>-</td>
                              <td className="payment">-</td>
                              <td>-</td>
                              <td className="bold">Pending</td>                         
                            </tr>
                            <tr className="shown">
                              <td>7</td>
                              <td className="bold">₹ 15,000</td>
                              <td>30-12-2021</td>
                              <td>-</td>
                              <td>-</td>
                              <td className="payment">-</td>
                              <td>-</td>
                              <td className="bold">Pending</td>                               
                            </tr>
                          </tbody>
                        </table>
                      </div>
            </div>
            </div>
            </div>
            </div>
            <div className="row">
            <div className="col-md-12 text-right tbuttons pt-3 pb-3">
            <button className="btn btn-primary mr-4"><img src="img/icon_pcase.svg" /> Previous Case</button>
            <button className="btn btn-primary">Next Case <img className="alignedright" src="img/icon_ncase.svg" /></button>
            </div>
            </div>
            </div>
            </div>
            </div>
          {/* /.container-fluid */}
          </div>
        {/* End of Main Content */}
        </div>
      {/* End of Content Wrapper */}
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

export default connect(mapStateToProps)(LeadDetails);
