import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Pagination from '@material-ui/lab/Pagination';
import { Redirect } from "react-router-dom";
import { getLeads, getLeadsCount, getProducts, openLeadProfileModel } from "../actions/users";
import { salesForceLogin } from "../actions/auth";
import Sidebar from "../common/sidebar";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { CSVLink } from "react-csv"
import TimeRange from 'react-time-range';
import moment from 'moment';
import Header from "../common/header";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import EmailReport from "../common/email-report";
import { openeMailReport, openeDownloadReport } from "../actions/model";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import DownloadReport from "../common/download-report";




class AllLeads extends Component {

  selectDate = (e) => {
    this.setState({ date: e })
  }
  constructor(props) {
    super(props);


    this.state = ({
      date: ''
    })



    this.state = {
      username: "",
      password: "",
      loading: false,
      pageCount: 0,
      selectedTab: 1,
      approval_pending: null,
      page: 1,
      shrp: false,
      perPage: 10,
      currentPage: 1,
      totalApproval: 0,
      startTime: 0,
      endTime: 0,
      selectedCase: "newest",
      selectionRanges: [{ 'startDate': addDays(new Date(), -7), 'endDate': new Date(), 'key': 'selection' }],
      showTimeRange: false

    };
  }

  componentDidMount() {
    const url = `Approval Pending`;
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      // stage: 'Approval Pending'
      stage: 'DRF required',
      drf_status: "Completed"

    }
    let dateRangeObj = { 'from_date_time': '', 'to_date_time': '' }
    console.log('intial date', dateRangeObj)
    // this.props.dispatch(getLeads({ lender_sfid: user_sfid },dateRangeObj,this.state.selectedCase))
    let pagination_obj = { "page": this.state.currentPage, "limit": this.state.perPage }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const approval = contDet.approval ? contDet.approval : null;
        this.setState({ approval_pending: approval });
        //let approval_data=approval.contDet.approval
        // console.log('ok===', approval_data.total)
        console.log('ok===', approval.total)
        this.setState({ totalApproval: approval.total })

      }
    });
    this.props.dispatch(getProducts());
    // this.props.dispatch(getLeadsCount(leadObj));
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));
    $('#sidebarToggleTop').on('click', function () {
      $('.sidebar-wrapper').toggleClass('toggled');
    })
    $('.sidbar-close').on('click', function () {
      $('.sidebar-wrapper').removeClass('toggled');
    })
  }

  openLeads = (id) => {
    const { history } = this.props;
    this.props.dispatch(openLeadProfileModel(id));
    history.push('/approval_lead_details');
  }

  generatePDF = () => {
    var doc = new jsPDF('p', 'pt');
    doc.text(20, 20, 'Approval Pending Leads')
    doc.addFont('helvetica', 'normal')
    doc.autoTable({ html: '#dataTables' })

    doc.save('approval_pending.pdf')
  }

  serialNumber = (index) => {
    const { pageCount } = this.state
    let line = index + 1;
    return (pageCount + line);
  }

  handleChangePage = (event, value) => {
    let count = 10 * (value - 1);
    let data = `page=${value}`;
    this.setState({ page: value, pageCount: count });
    this.props.dispatch(getLeads(data));
  }

  openEmailReport = () => {
    this.props.dispatch(openeMailReport());
  }


  handleTab = (value) => {
    this.setState({ selectedTab: value });
  }

  openDownload = () => {
    this.props.dispatch(openeDownloadReport());
  }
  shrp = () => {
    this.setState({ shrp: !this.state.shrp })
  }
  handlepPerPageChange = async (given_number) => {
    console.log('date changed', this.state.selectionRanges)
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    console.log('dateRangeObj', dateRangeObj)
    this.setState({ perPage: given_number })
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      // stage: 'Approval Pending'
      stage: 'DRF required',
      drf_status: "Completed"

    }
    console.log('case type ok', this.state.selectedCase)
    let pagination_obj = { "page": this.state.currentPage, "limit": given_number }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const approval = contDet.approval ? contDet.approval : null;
        this.setState({ approval_pending: approval });
      }
    });
    this.props.dispatch(getProducts());
    // this.props.dispatch(getLeadsCount(leadObj));
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));

  }

  handleNextPrevPage = async (given_req_type) => {
    let requiredPage = 1
    if (given_req_type == "prev") {
      if (this.state.currentPage != 1) {
        this.setState({ currentPage: this.state.currentPage - 1 })
        requiredPage = this.state.currentPage - 1
      }
    }
    if (given_req_type == "next") {
      this.setState({ currentPage: this.state.currentPage + 1 })
      requiredPage = this.state.currentPage + 1

    }
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      // stage: 'Approval Pending'
      stage: 'DRF required',
      drf_status: "Completed"
    }
    let pagination_obj = { "page": requiredPage, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const approval = contDet.approval ? contDet.approval : null;
        this.setState({ approval_pending: approval });
      }
    });
    this.props.dispatch(getProducts());
    // this.props.dispatch(getLeadsCount(leadObj));
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));
  }

  showLeadsCase = async (selected_case) => {

    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      // stage: 'Approval Pending'
      stage: 'DRF required',
      drf_status: "Completed"
    }
    let pagination_obj = { "page": 1, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, selected_case)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const approval = contDet.approval ? contDet.approval : null;
        this.setState({ approval_pending: approval });
      }
    });
    this.props.dispatch(getProducts());
    // this.props.dispatch(getLeadsCount(leadObj));
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));

  }

  setCaseType = () => {
    let given_case = document.getElementById('caseType').value;
    let selected_case = 'newest'
    if (given_case == "Oldest Case") {
      this.setState({ selectedCase: "oldest" })
      selected_case = 'oldest'
    }
    else {
      this.setState({ selectedCase: "newest" })
      selected_case = 'newest'
    }

    this.showLeadsCase(selected_case)
  }


  returnDateTimeFormat = (given_time) => {
    let text = String(given_time)
    const myArray = text.split("(India");
    let dateObj = new Date(myArray[0]);
    let month = dateObj.getUTCMonth() + 1;
    let day = dateObj.getUTCDate() + 1;
    let year = dateObj.getUTCFullYear();
    console.log('day', typeof (day))
    if (day > 30) {
      day = 30
    }
    let newdate = year + "-" + month + "-" + day;
    let final_date_time = `${newdate} 00:00:00`
    console.log('final is', final_date_time)
    return final_date_time
  }

  dateSet = () => {
    this.shrp();
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      stage: 'DRF required',
      drf_status: "Completed"
    }
    let pagination_obj = { "page": 1, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const approval = contDet.approval ? contDet.approval : null;
        this.setState({ approval_pending: approval });
      }
    });
    this.props.dispatch(getProducts());
    // this.props.dispatch(getLeadsCount(leadObj));
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));
  }

  handleChecked = (e) => {
    const { searchArr, searchActive, leads } = this.props;
    let tabledata = searchActive ? searchArr : leads
    if (e.target.checked == false) {
      document.getElementById(`all_check`).checked = false
    }
    else {
      let totalChecked = []
      for (let i = 0; i < tabledata.length; i++) {
        if (document.getElementById(`checked_${i}`).checked == true) {
          totalChecked.push(true);
        }
      }
      if (tabledata.length == totalChecked.length) {
        document.getElementById(`all_check`).checked = true
      }

    }
  }
  changeSelectedStatus = (e) => {
    const { searchArr, searchActive, leads } = this.props;
    let tabledata = searchActive ? searchArr : leads
    if (tabledata.length > 0) {
      let status = false;
      if (e.target.checked == true) {
        status = true
      }
      else {
        status = false
      }
      for (let i = 0; i < tabledata.length; i++) {
        document.getElementById(`checked_${i}`).checked = status;
      }
    }
    this.setState({ allRecordsSelected: e.target.checked })

  }
  render() {
    const { isLoading, isLoggedIn, message, leads, leadsCount, user_id, token_id, searchArr, searchActive } = this.props;
    const { approval_pending, totalApproval, perPage } = this.state
    console.log("lll", leads);
    const { selectedTab } = this.state;
    if (!user_id) {
      return <Redirect to="/login" />
    }
    let tabledata = searchActive ? searchArr : leads;
    const totalPages = Math.ceil(totalApproval / perPage);

    return (
      <>
        <Helmet>
          <title>Approval Pending</title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}
        <div id="wrapper">
          <Sidebar />
          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* Main Content */}
            <div id="content">
              <Header
                title={'Approval Pending'}
                isSearchEnable={true}
                dispatch={this.props.dispatch}
              />
              {/* Topbar */}

              <div className="container-fluid leads_header">
                <div className="row align-items-center">
                  <div className="col-md-12">
                    <ul className="leads_boxinfo">
                      <li className="col_1">
                        <div className="inner  d-flex">
                          <div className="w-50">
                            <img src="images/apr_pending2.svg" />
                            <span className="atsize">Cases Pending</span>
                          </div>
                          <div className="w-50">
                            <div className="d-flex align-items-center justify-content-end">
                              <i className="fa fa-inr d-inline-block mr-1" aria-hidden="true"></i>
                              <span className="title d-inline-block mr-1">{approval_pending && approval_pending.amount ? approval_pending.amount : 0}</span>
                              {/* <span className="title">Cr</span> */}
                            </div>
                            <div className="text-right"><span className="title d-inline-block mr-1">{approval_pending && approval_pending.total ? approval_pending.total : 0}</span></div>
                          </div>
                        </div>
                      </li>
                      {/*  <li className="col_1">
                  <div className="inner d-flex">
                    <div className="w-50">
                      <img src="images/apr_pending2.svg" />
                      <span className="atsize">Cases Pending</span>
                    </div>
                    <div className="w-50">
                      <div className="d-flex align-items-center justify-content-end">
                        <i className="fa fa-inr d-inline-block mr-1" aria-hidden="true"></i>
                        <span className="title d-inline-block mr-1">20</span>
                        <span className="title">Cr</span>
                      </div>
                      <div className="text-right"><span className="title d-inline-block mr-1">20</span></div>
                    </div>
                  </div>
                </li> */}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="container-fluid leads_header d-md-flex">
                <a href={void (0)} ><button onClick={this.openDownload} className="icon-button border-0"><img src="images/icons/download.svg" /> Download All Cases</button></a>




                <div className="ml-auto d-flex flex-wrap align-items-center">

                  <div className="trw">
                    <div style={{ position: "relative" }}>
                      <button className="icon-button mr-2" onClick={this.shrp}><img src="images/icons/fi-rr-calendar.svg" /> Time Range</button>
                      <div className={`border bg-white dateRange ${this.state.shrp ? '' : 'd-none'}`} style={{ position: "absolute", zIndex: 1, right: 0, top: '40px' }}>
                        <DateRangePicker
                          ranges={this.state.selectionRanges}
                          onChange={item => this.setState({ selectionRanges: [item.selection] })}
                        />
                        <div className="d-flex justify-content-end pb-2">
                          <div className="btn-group mt-1 mr-3" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-white" onClick={this.shrp}>Cancel</button>
                            <button type="button" className="btn btn-dark ml-2" onClick={this.dateSet}>Set Date</button>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                  {/* {this.state.shrp ? <div className="show-hide-range-picker">
                      <TimeRange
                        startMoment={this.state.startTime}
                        endMoment={this.state.endTime}
                        //onChange={this.returnFunction}
                        onStartTimeChange={(e) => this.setState({ startTime: e.startTime })}
                        onEndTimeChange={(e) => this.setState({ endTime: e.endTime })}
                      />
                    </div> : ''} */}


                  {/* email report */}
                  {/* <div className="erb">
                <button className="icon-button mr-md-2"><img src="images/icons/email.svg" /> Email Report</button>
              </div> */}
                  <a href={void (0)} className="cursor-point" onClick={this.openEmailReport}><button className="icon-button mr-2"><img src="images/icons/email.svg" /> Email Report</button></a>

                  <EmailReport
                    user_sfid={this.props.user_sfid}
                    open_email_report={this.props.open_email_report}
                    group_recipient={this.props.group_recipient}
                    group_list={this.props.group_list}
                    dispatch={this.props.dispatch}
                    stage={'Approvl Pending'}
                  />

                  {/* email report */}

                  {/* <DatePicker placeholderText="Newest Case here" selected={this.state.date} dateFormat="dd-MMM-yyyy"
                      onChange={this.selectDate}></DatePicker> */}
                  {/* <select>
                  <option>
                    Newest Case
                  </option>
                </select>  */}
                </div>
                <div className="icon-button mr-2 cursor-point p-1">
                  <select className="form-control form-control-sm border-none p-0 border-bottom-0 pl-2 pr-2" id="caseType" onChange={this.setCaseType} style={{ fontWeight: "600px", fontSize: "16px", color: "black", height: '30px' }}>
                    <option>Newest Case</option>
                    <option>Oldest Case</option>
                  </select>
                </div>
              </div>

              {/* End of Topbar */}
              {/* Begin Page Content */}
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 pt-2">
                    {/* <div className="img_text">
                <img src="images/download.svg" /> Download Cases
              </div> */}
                    <div className="table-responsive dark_header">
                      <table
                        className="table"
                        id="dataTables"
                        width="100%"
                        cellSpacing={0}
                      >
                        <thead>
                          <tr>
                            <th>
                              <div className="single_check">
                                <input type="checkbox" className="" id="all_check" onClick={(e) => this.changeSelectedStatus(e)} />
                                <label>#</label>
                              </div>
                            </th>
                            <th>Application ID</th>
                            <th>Customer Details</th>
                            <th>Product </th>
                            <th>
                              <div className="d-flex align-items-center"> Loan Amount
                                <div className="d-flex ml-2 " style={{ flexDirection: "column" }} >
                                  <i className="fa fa-caret-up cursor-point" onClick={() => this.showLeadsCase('high')} style={{ color: 'white' }}></i>
                                  <i className="fa fa-caret-down cursor-point" onClick={() => this.showLeadsCase('low')} style={{ color: 'white' }}></i>
                                </div>
                              </div>
                            </th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabledata && tabledata.length ?
                            (
                              tabledata.map((item, index) => (
                                <tr className="shown" key={index}>
                                  <td>
                                    <div className="d-flex">
                                      <div className="single_check">
                                        <input type="checkbox" className="" id={`checked_${index}`} onClick={(e) => this.handleChecked(e)} />
                                        <label></label>
                                      </div>
                                      <div>
                                        <div className="new_ribbon">{index + 1} </div>
                                      </div>
                                    </div></td>
                                  <td>
                                    <b className="underline d-block cursor-point" ><a href={void (0)} onClick={() => this.openLeads(item.opp_id)}>{item.opp_id}</a></b>
                                    <span className="date"> <p className="d-block text-dark">{item.created_at} </p> </span>                              </td>
                                  <td>
                                    <div className="d-flex">
                                      <div className="pr_img">
                                        <img className="img-profile rounded-circle" src="img/undraw_profile.svg" />
                                      </div>
                                      <div className="pr_texts">
                                        <b className="d-block">{item.name ? item.name : ""}</b>
                                        {item.mobile ? item.mobile : ''}
                                      </div>
                                    </div>
                                  </td>
                                  <td>{item.product_name ? item.product_name : ''}</td>
                                  <td><b>₹ {item.amount ? item.amount : '0'}</b></td>
                                  <td className="has_btn">
                                    {item.stage ? item.stage : ''}
                                    <span style={{ cursor: 'pointer' }} className="actionable" onClick={() => this.openLeads(item.opp_id)}>&nbsp;</span>
                                  </td>
                                </tr>
                              ))
                            ) : (<div className="mt-2">No data available</div>)
                          }
                        </tbody>
                      </table>
                      {/* pgination code new*/}
                      <div >
                        <div className="d-flex justify-content-end">
                          <div className="p-3">
                            {this.state.currentPage}-{totalPages} of {this.state.totalApproval}

                          </div>
                          <div className="p-3">
                            Cases/page

                          </div>
                          <div className="p-2">

                            <div class="dropdown">
                              <button className="btn btn-sm bg-light dropdown-toggle shadow-lg" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                {this.state.perPage}
                              </button>
                              <div className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button className="dropdown-item" type="button" onClick={() => this.handlepPerPageChange(10)}>10</button>
                                <button className="dropdown-item" type="button" onClick={() => this.handlepPerPageChange(20)}>20</button>
                                <button className="dropdown-item" type="button" onClick={() => this.handlepPerPageChange(30)}>30</button>
                                <button className="dropdown-item" type="button" onClick={() => this.handlepPerPageChange(40)}>40</button>
                              </div>
                            </div>

                          </div>
                          <div className="p-2">
                            <button className="btn bg-light shadow-lg" type="button" onClick={() => this.handleNextPrevPage("prev")} disabled={this.state.currentPage == 1 ? true : false}><i className="fa fa-long-arrow-left"></i> Previous Page </button>
                            <button className="btn bg-light ml-2 shadow-lg" type="button" onClick={() => this.handleNextPrevPage("next")} disabled={this.state.perPage > tabledata.length || this.state.perPage == totalApproval ? true : false}> Next Page <i className="fa fa-long-arrow-right"></i></button>
                          </div>

                        </div>
                      </div>
                      {/* pgination code new end*/}

                      {/* <div style={{ display: 'block', padding: 30 }}>
                                    <Pagination count={totalPages} page={this.state.page} onChange={this.handleChangePage} />
                        </div> */}
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



        <DownloadReport
          open_download_report={this.props.open_download_report}
          dispatch={this.props.dispatch}
        />



        {/* Admin download reports */}

        {/* End Admin Reports*/}
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading, isLoggedIn, user_id, token_id, user_sfid, } = state.auth;
  const { leads, leadsCount, group_recipient, group_list, searchArr } = state.user;
  const { open_email_report, open_download_report, searchActive } = state.model;
  const { message } = state.message;
  return {
    open_download_report,
    open_email_report,
    group_recipient,
    isLoggedIn,
    group_list,
    isLoading,
    message,
    leads,
    leadsCount,
    user_id,
    token_id,
    user_sfid,
    searchArr,
    searchActive,
  };
}

export default connect(mapStateToProps)(AllLeads);
