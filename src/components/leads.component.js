import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Pagination from '@material-ui/lab/Pagination';
import { Redirect } from "react-router-dom";
import { getLeads, getLeadsCount, getProducts, openLeadProfileModel, getlenderCount, getSearchResults } from "../actions/users";
import { salesForceLogin } from "../actions/auth";
import Headers from "../common/header";
import Sidebar from "../common/sidebar";
import { Scrollbar } from "react-scrollbars-custom";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { CSVLink } from "react-csv"
import TimeRange from 'react-time-range';
import EmailReport from "../common/email-report";
import DownloadReport from "../common/download-report";
import { openeMailReport, openeDownloadReport } from "../actions/model";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';





class AllLeads extends Component {

  selectDate = (e) => {
    console.log(e, 'eeee')
    this.setState({ date: e })
    var date = new Date(e);
    var year = date.toLocaleString("default", { year: "numeric" });
    var month = date.toLocaleString("default", { month: "2-digit" });
    var day = date.toLocaleString("default", { day: "2-digit" });

    // var formattedDate = day + "-" + month + "-" + year;
    var formattedDate = year + "-" + month + "-" + day;

    // console.log(formattedDate,'fuck')

    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid
    }

    let data2 = {
      lender_sfid: user_sfid,
      section: 'All Leads',
      date_range: formattedDate
      // date_range: this.props.leads[0].created_at
    }

    // this.props.dispatch(getNewestcase(data2)).then((response) => {
    //   console.log('newest case', response)
    //   if (response.status === "success") {
    //     this.setState({
    //       newCase: response.newestCase
    //     })
    //   }
    // });

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
      selectedTab: 1,
      approval_pending: 0,
      disbursal_pending: 0,
      disbursed_loans: 0,
      closed_loans: 0,
      page: 1,
      pageCount: 0,
      shrp: false,
      schedule_send: false,
      newCase: {},
      allRecordsSelected: false,
      perPage: 10,
      currentPage: 1,
      totalAllLeads: 0,
      selectedCase: "newest",
      selectionRanges: [{ 'startDate': addDays(new Date(), -10), 'endDate': new Date(), 'key': 'selection' }],
      showTimeRange: false,
      all_opp_ids: [],
      global_keyword: ''

    };
  }

  async componentDidMount() {


    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid
    }
    let pagination_obj = { "page": this.state.currentPage, "limit": this.state.perPage }
    let dateRangeObj = { 'from_date_time': '', 'to_date_time': '' }
    await this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        // const approval = contDet.approval ? contDet.approval : null;
        const approvalPendingLead = contDet.approvalPendingLead ? contDet.approvalPendingLead : null;

        // const closed = contDet.closed ? contDet.closed : null;
        const closedLead = contDet.closedLead ? contDet.closedLead : null;
        const disbursedLead = contDet.disbursedLead ? contDet.disbursedLead : null;
        const readyToDisburseLead = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        let opp_ids = []
        if (response.proDet && response.proDet.length > 0) {
          response.proDet.forEach((obj) => {
            opp_ids.push(obj.opp_sfid)
          })
        }
        this.setState({
          approval_pending: response.approvalPendingLeadCount ? response.approvalPendingLeadCount : 0,
          disbursal_pending: response.readyToDisburseLeadCount ? response.readyToDisburseLeadCount : 0,
          disbursed_loans: response.disbursedLeadCount ? response.disbursedLeadCount : 0,
          closed_loans: response.closedLeadCount ? response.closedLeadCount : 0,
          all_opp_ids: opp_ids
        });
        let allLeads = contDet.allLead;
        this.setState({ totalAllLeads: response.allLeadCount })
        localStorage.setItem("all_lead_ids", opp_ids)
        this.setState({ global_keyword: this.props.global_Search_Keyword })
      }
    });

    await this.props.dispatch(getProducts());
    // await this.props.dispatch(getLeadsCount());
    let obj = { id: this.props.user_id, token: this.props.token_id }
    await this.props.dispatch(salesForceLogin(obj));
    /* let countUrl = "stage=all";
    await this.props.dispatch(getlenderCount(countUrl)).then((response)=>{
        if(response && response.status && response.status ==="success")
        {
          const getData = response.data?response.data:null;
          this.setState({ 
            approval_pending: getData && getData.approval_pending?getData.approval_pending:0,
            disbursal_pending: getData && getData.disbursal_pending?getData.disbursal_pending:0,
            disbursed_loans: getData && getData.disbursed_loans?getData.disbursed_loans:0,
            closed_loans: getData && getData.closed_loans?getData.closed_loans:0,
           });
        }
    }); */
    // let obj1 = {
    //     lender_sfid:"00171000008djwjAAA",
    //     section:"All Leads",
    //     search_keyword:25000
    //   }
    // this.props.dispatch(getSearchResults(obj1)).then(res => {
    //   this.setState({searchArr:res.searchResult});
    // })

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
    history.push('/lead_details');
  }

  generatePDF = () => {
    var doc = new jsPDF('p', 'pt');
    doc.text(20, 20, 'All Leads')
    doc.addFont('helvetica', 'normal')
    doc.autoTable({ html: '#dataTables' })

    doc.save('all_leads.pdf')
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

  openDownload = () => {
    this.props.dispatch(openeDownloadReport());
  }

  handleSchedule = () => {
    this.setState({ schedule_send: true });

  }
  handleTab = (value) => {
    this.setState({ selectedTab: value });
  }

  shrp = () => {
    this.setState({ shrp: !this.state.shrp })
  }

  serialNumber = (index) => {
    const { pageCount } = this.state
    let line = index + 1;
    return (pageCount + line);
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
      if (tabledata.length !== totalChecked.length) {
        document.getElementById(`all_check`).checked = false
      }
    }
  }
  handlepPerPageChange = async (given_number) => {
    this.setState({ perPage: given_number, currentPage: 1 })
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid
    }
    let pagination_obj = { "page": 1, "limit": given_number }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    await this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        // const approval = contDet.approval ? contDet.approval : null;
        const approvalPendingLead = contDet.approvalPendingLead ? contDet.approvalPendingLead : null;
        // const closed = contDet.closed ? contDet.closed : null;
        const closedLead = contDet.closedLead ? contDet.closedLead : null;
        const disbursedLead = contDet.disbursedLead ? contDet.disbursedLead : null;
        const readyToDisburseLead = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({
          approval_pending: response.approvalPendingLeadCount ? response.approvalPendingLeadCount : 0,
          disbursal_pending: response.readyToDisburseLeadCount ? response.readyToDisburseLeadCount : 0,
          disbursed_loans: response.disbursedLeadCount ? response.disbursedLeadCount : 0,
          closed_loans: response.closedLeadCount ? response.closedLeadCount : 0
        });
      }
    });

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
      lender_sfid: user_sfid
    }
    let pagination_obj = { "page": requiredPage, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    await this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        console.log('next response', response)
        const contDet = response.contDet ? response.contDet : null;
        // const approval = contDet.approval ? contDet.approval : null;
        const approvalPendingLead = contDet.approvalPendingLead ? contDet.approvalPendingLead : null;
        // const closed = contDet.closed ? contDet.closed : null;
        const closedLead = contDet.closedLead ? contDet.closedLead : null;
        const disbursedLead = contDet.disbursedLead ? contDet.disbursedLead : null;
        const readyToDisburseLead = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        // this.setState({
        //   approval_pending: approvalPendingLead,
        //   disbursal_pending: readyToDisburseLead,
        //   disbursed_loans: disbursedLead,
        //   closed_loans: closedLead,
        // });
        this.setState({
          approval_pending: response.approvalPendingLeadCount ? response.approvalPendingLeadCount : 0,
          disbursal_pending: response.readyToDisburseLeadCount ? response.readyToDisburseLeadCount : 0,
          disbursed_loans: response.disbursedLeadCount ? response.disbursedLeadCount : 0,
          closed_loans: response.closedLeadCount ? response.closedLeadCount : 0
        });
      }
    });

  }
  //case type change

  showLeadsCase = async (selected_case) => {
   
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid
    }
    let pagination_obj = { "page": 1, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    await this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, selected_case)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        // const approval = contDet.approval ? contDet.approval : null;
        const approvalPendingLead = contDet.approvalPendingLead ? contDet.approvalPendingLead : null;
        // const closed = contDet.closed ? contDet.closed : null;
        const closedLead = contDet.closedLead ? contDet.closedLead : null;
        const disbursedLead = contDet.disbursedLead ? contDet.disbursedLead : null;
        const readyToDisburseLead = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({
          approval_pending: response.approvalPendingLeadCount ? response.approvalPendingLeadCount : 0,
          disbursal_pending: response.readyToDisburseLeadCount ? response.readyToDisburseLeadCount : 0,
          disbursed_loans: response.disbursedLeadCount ? response.disbursedLeadCount : 0,
          closed_loans: response.closedLeadCount ? response.closedLeadCount : 0
        });
      }
    });
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
  dateSet = async () => {
    this.shrp();
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid
    }
    let pagination_obj = { "page": this.state.currentPage, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    await this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        // const approval = contDet.approval ? contDet.approval : null;
        const approvalPendingLead = contDet.approvalPendingLead ? contDet.approvalPendingLead : null;
        // const closed = contDet.closed ? contDet.closed : null;
        const closedLead = contDet.closedLead ? contDet.closedLead : null;
        const disbursedLead = contDet.disbursedLead ? contDet.disbursedLead : null;
        const readyToDisburseLead = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({
          approval_pending: response.approvalPendingLeadCount ? response.approvalPendingLeadCount : 0,
          disbursal_pending: response.readyToDisburseLeadCount ? response.readyToDisburseLeadCount : 0,
          disbursed_loans: response.disbursedLeadCount ? response.disbursedLeadCount : 0,
          closed_loans: response.closedLeadCount ? response.closedLeadCount : 0
        });
      }
    });



  }



  render() {
    const { report_count, isLoggedIn, message, leads, leadsCount, user_id, token_id, isLoading, searchArr, searchActive, Loading } = this.props;
    const { selectedTab, closed_loans, approval_pending, disbursal_pending, disbursed_loans, totalAllLeads, perPage, newCase } = this.state;

    const apprpvalDet = report_count && report_count.approval ? report_count.approval : null;
    const approvalCount = apprpvalDet && apprpvalDet.length > 0 ? apprpvalDet[0] : null;
    //console.log("fj", this.props.leads[0].created_at)
    //console.log("case",this.state.newCase);
    let tabledata = searchActive ? searchArr : leads
    if (!user_id) {
      return <Redirect to="/login" />
    }
    //const totalPages = Math.ceil(leadsCount / 10);
    //const totalPages = Math.ceil(tabledata.length / 2);
    const totalPages = Math.ceil(totalAllLeads / perPage);


    return (
      <>
        <Helmet>
          <title>All Leads</title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}
        {Loading ? (
          <div className="loading">Loading&#8230;</div>) : ''}
        <div id="wrapper">
          <Sidebar />
          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* Main Content */}
            <div id="content">
              {/* Topbar */}
              <Headers
                title={'All Leads'}
                isSearchEnable={true}
                dispatch={this.props.dispatch}
                keyword={this.state.global_keyword}
              />

              <div className="container-fluid leads_header">
                <div className="row align-items-center">
                  <div className="col-md-12">
                    <ul className="leads_boxinfo">
                      <li className="col_1">

                        <div className="inner  d-flex">
                          <div className="w-50">
                            <img src="images/apr_pending2.svg" />
                            <span className="atsize">Approval Pending</span>
                          </div>
                          <div className="w-50">
                            <div className="d-flex align-items-center justify-content-end">
                              <span className="title d-inline-block mr-1">{approval_pending}</span>
                            </div>
                          </div>
                        </div>


                        {/* <span className="title"><img src="images/apr_pending.svg" /> {approval_pending}</span>
                  <span className="atsize">Approval Pending</span> */}
                      </li>
                      <li className="col_1">
                        <div className="inner  d-flex">
                          <div className="w-50">
                            <img src="images/Disbursalpending_icon.svg" />
                            <span className="atsize">Disbursal Pending</span>
                          </div>
                          <div className="w-50">
                            <div className="d-flex align-items-center justify-content-end">
                              {/* <i className="fa fa-inr d-inline-block mr-1" aria-hidden="true"></i> */}
                              <span className="title d-inline-block mr-1">{disbursal_pending}</span>
                              {/* <span className="title">Cr</span> */}
                            </div>
                            {/* <div className="text-right"><span className="title d-inline-block mr-1">{disbursal_pending && disbursal_pending.total ? disbursal_pending.total : 0}</span></div> */}
                          </div>
                        </div>

                        {/* <span className="title"><img src="images/dis_pending.svg" /> {disbursal_pending} </span>
                  <span className="atsize">Disbursal Pending</span> */}
                      </li>
                      <li className="col_1">
                        <div className="inner  d-flex">
                          <div className="w-50">
                            <img src="images/Disbured_icon.svg" />
                            <span className="atsize">Disbursed Loans</span>
                          </div>
                          <div className="w-50">
                            <div className="d-flex align-items-center justify-content-end">
                              {/* <i className="fa fa-inr d-inline-block mr-1" aria-hidden="true"></i> */}
                              <span className="title d-inline-block mr-1">{disbursed_loans}</span>
                              {/* <span className="title">Cr</span> */}
                            </div>
                            {/* <div className="text-right"><span className="title d-inline-block mr-1">{disbursed_loans && disbursed_loans.total ? disbursed_loans.total : 0}</span></div> */}
                          </div>
                        </div>

                        {/* <span className="title"><img src="images/dis_loans.svg" /> {disbursed_loans} </span>
                  <span className="atsize">Disbursed Loans</span> */}
                      </li>
                      <li className="col_1">
                        <div className="inner  d-flex">
                          <div className="w-50">
                            <img src="images/Close_icon.svg" />
                            <span className="atsize">Closed &nbsp; Loans</span>
                          </div>
                          <div className="w-50">
                            <div className="d-flex align-items-center justify-content-end">
                              {/* <i className="fa fa-inr d-inline-block mr-1" aria-hidden="true"></i> */}
                              <span className="title d-inline-block mr-1">{closed_loans}</span>
                              {/* <span className="title">Cr</span> */}
                            </div>
                            {/* <div className="text-right"><span className="title d-inline-block mr-1">{closed_loans && closed_loans.total ? closed_loans.total : 0}</span></div> */}
                          </div>
                        </div>

                        {/* <span className="title"><img src="images/clo_loans.svg" /> {closed_loans} </span>
                  <span className="atsize">Closed Loans</span> */}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* <div className="container-fluid leads_header">
          <div className="row align-items-center">
            <div className="col-md-12">
              <ul className="leads_boxinfo">
                <li className="col_1">
                  <div className="inner  d-flex">
                    <div className="w-50">
                      <img src="images/apr_pending2.svg" />
                      <span className="atsize">Approval Pending</span>
                    </div>
                    <div className="w-50">
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="title d-inline-block mr-1">{approval_pending}</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="col_1">
                  <div className="inner  d-flex">
                    <div className="w-50">
                      <img src="images/apr_pending2.svg" />
                      <span className="atsize">Disbursal Pending</span>
                    </div>
                    <div className="w-50">
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="title d-inline-block mr-1">{disbursal_pending}</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="col_1">
                  <div className="inner  d-flex">
                    <div className="w-50">
                      <img src="images/apr_pending2.svg" />
                      <span className="atsize">Disbursed Loans</span>
                    </div>
                    <div className="w-50">
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="title d-inline-block mr-1">{disbursed_loans}</span>
                      </div>
                    </div>
                  </div>
                </li>
                <li className="col_1">
                  <div className="inner  d-flex">
                    <div className="w-50">
                      <img src="images/apr_pending2.svg" />
                      <span className="atsize">Closed Loans</span>
                    </div>
                    <div className="w-50">
                      <div className="d-flex align-items-center justify-content-end">
                        <span className="title d-inline-block mr-1">{closed_loans} </span>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div> */}

              <div className="container-fluid leads_header d-flex">
                <a href={void (0)} ><button onClick={this.openDownload} className="icon-button border-0"><img src="images/icons/download.svg" /> Download All Cases</button></a>
                <div className="ml-auto d-flex align-items-center">

                  {/* <div>
                   <button className="icon-button mr-2" onClick={this.shrp}><img src="images/icons/fi-rr-calendar.svg" /> Time Range</button>

                    {this.state.shrp ? <div className="show-hide-range-picker">
                      <TimeRange
                        startMoment={this.state.startTime}
                        endMoment={this.state.endTime}
                        onChange={this.returnFunction}
                      />
                    </div> : 'No range'}



                  </div> */}
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
                  <a href={void (0)} className="cursor-point" onClick={this.openEmailReport}><button className="icon-button mr-2 "><img src="images/icons/email.svg" /> Email Report</button></a>

                  <div className="icon-button mr-2 cursor-point p-1">
                    <select className="form-control form-control-sm border-none p-0 border-bottom-0 pl-2 pr-2" id="caseType" onChange={this.setCaseType} style={{ fontWeight: "600px", fontSize: "16px", color: "black", height: '30px' }}>
                      <option>Newest Case</option>
                      <option>Oldest Case</option>
                    </select>
                  </div>

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
                        id="dataTable"
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
                            <th>Product</th>
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
                                <tr className="shown " key={index}>
                                  <td>
                                    <div className="d-flex">
                                      <div className="single_check">
                                        <input type="checkbox" className="" id={`checked_${index}`} onClick={(e) => this.handleChecked(e)} />
                                        <label></label>
                                      </div>
                                      <div>
                                        <div className="new_ribbon">{this.serialNumber(index)} </div>
                                      </div>
                                    </div>

                                  </td>
                                  <td>
                                    <b className="underline d-block cursor-point "   ><a href={void (0)} onClick={() => this.openLeads(item.opp_id)}>{item.opp_id}</a></b>
                                    <span className="date"> <p className="d-block text-dark">{item.created_at} </p> </span>
                                  </td>
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
                                    {item.stage ? item.stage : '-'}
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
                        <div className="d-flex justify-content-end pb-4">
                          <div className="p-3">
                            {this.state.currentPage}-{totalPages} of {this.state.totalAllLeads}
                          </div>
                          <div className="p-3">
                            Cases/page

                          </div>
                          <div className="p-2">

                            <div className="dropdown">
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
                            <button className="btn bg-light shadow-lg" type="button" onClick={() => this.handleNextPrevPage("prev")} disabled={this.state.currentPage == 1 ? true : false}> <i className="fa fa-long-arrow-left"></i> Previous Page </button>
                            <button className="btn bg-light ml-2 shadow-lg" type="button" onClick={() => this.handleNextPrevPage("next")} disabled={this.state.perPage > tabledata.length || this.state.perPage == totalAllLeads ? true : false}> Next Page <i className="fa fa-long-arrow-right"></i></button>
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
        {/* Admin download reports */}
        <DownloadReport
          open_download_report={this.props.open_download_report}
          dispatch={this.props.dispatch}
        />
        {/* End Admin Reports*/}

        {/* email report */}

        <div className="modal fade" id="emailReport">
          <div className="modal-dialog modal-dialog-centered dr-modal">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h3 className="mb-0 modalTitle">Email Reports</h3>
                  <button className="cs-btn"><img src="images/icons/icon-close2.png" /></button>
                </div>

                <div className="mb-3">
                  <button className="export-btn black mr-3">Share via Email</button>
                  <button className="export-btn ">Schedule Send</button>
                </div>

                <div className="row mt-4">
                  <Scrollbar style={{ height: '70vh' }}>
                    <div className="px-3">
                      <h5 className="font-weight-bold mt-4 mb-4">Scheduled Email Reports </h5>
                      <div className="check-accordion">
                        <div className="check-tab justify-content-between">
                          <div>
                            <span className="d-inline-block mr-2">Options</span>
                            <button>
                              <img src="images/icons/edit-icon.svg" className="img-fluid" />
                            </button>
                          </div>

                          <div className="pr-5" style={{ color: "#ABABAB" }}>
                            <img src="images/icons/time-forward.svg" />
                            <span className="d-inline-block ml-2">Next email in 30 days</span>
                          </div>
                        </div>
                        <div className="content">
                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Participants</h5>
                            <ul>
                              <li>Shivshankar@gmail.com</li>
                              <li>Sai.iyer@gmail.com</li>
                              <li>aagam.mehta@gmail.com</li>
                              <li>anjali.verma@gmail.com</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Reports</h5>
                            <ul>
                              <li>All Leads</li>
                              <li>Approval Pending</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Reports Time Range</h5>
                            <ul>
                              <li>Last 30 days</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Configurations</h5>
                            <ul>
                              <li>5th of every month</li>
                            </ul>
                          </div>

                        </div>

                        <div className="check-tab justify-content-between">
                          <div>
                            <span className="d-inline-block mr-2">Credit </span>
                            <button>
                              <img src="images/icons/edit-icon.svg" className="img-fluid" />
                            </button>
                          </div>

                          <div className="pr-5" style={{ color: "#ABABAB" }}>
                            <img src="images/icons/time-forward.svg" />
                            <span className="d-inline-block ml-2">Next email in 15 days</span>
                          </div>
                        </div>
                        <div className="content">
                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Participants</h5>
                            <ul>
                              <li>Shivshankar@gmail.com</li>
                              <li>Sai.iyer@gmail.com</li>
                              <li>aagam.mehta@gmail.com</li>
                              <li>anjali.verma@gmail.com</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Reports</h5>
                            <ul>
                              <li>All Leads</li>
                              <li>Approval Pending</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Reports Time Range</h5>
                            <ul>
                              <li>Last 30 days</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Configurations</h5>
                            <ul>
                              <li>5th of every month</li>
                            </ul>
                          </div>

                        </div>

                        <div className="check-tab justify-content-between">
                          <div>
                            <span className="d-inline-block mr-2">Credit 2</span>
                            <button>
                              <img src="images/icons/edit-icon.svg" className="img-fluid" />
                            </button>
                          </div>

                          <div className="pr-5" style={{ color: "#ABABAB" }}>
                            <img src="images/icons/time-forward.svg" />
                            <span className="d-inline-block ml-2">Next email in 05 days</span>
                          </div>
                        </div>
                        <div className="content">
                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Participants</h5>
                            <ul>
                              <li>Shivshankar@gmail.com</li>
                              <li>Sai.iyer@gmail.com</li>
                              <li>aagam.mehta@gmail.com</li>
                              <li>anjali.verma@gmail.com</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Reports</h5>
                            <ul>
                              <li>All Leads</li>
                              <li>Approval Pending</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Reports Time Range</h5>
                            <ul>
                              <li>Last 30 days</li>
                            </ul>
                          </div>

                          <div>
                            <h5 className="font-weight-bold mt-4 mb-4">Configurations</h5>
                            <ul>
                              <li>5th of every month</li>
                            </ul>
                          </div>

                        </div>


                      </div>
                    </div>

                  </Scrollbar>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* End email report*/}

        {/* Email cam */}
        <div className="modal fade" id="emailCam">
          <div className="modal-dialog modal-dialog-centered dr-modal">
            <div className="modal-content">
              <div className="modal-body">
                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="mb-3 modalTitle">Email CAM</h3>
                  <button className="cs-btn">Clear Selection</button>
                </div>
                <div className="mb-3">
                  <input type="text" className="input-style w-100" placeholder="Add Recipient" />
                </div>
                <h5 className="font-weight-bold mb-4">Email Report to my groups</h5>

                <div className="row">
                  <Scrollbar style={{ height: 100 }}>
                    <div className="px-3">
                      <div className="row">
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                        <div className="col-sm-6 mb-3">
                          <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img>
                          </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Scrollbar>
                </div>

                <div className=".check-accordion">
                  <input className="check-tab" type="checkbox" />
                  <div className="content">cvcvc</div>
                  <input className="check-tab" type="checkbox" />
                  <div className="content">vcvcvc</div>
                  <input className="check-tab" type="checkbox" />
                  <div className="content">hghghtyu</div>
                </div>




                <div className="modalFooter">
                  <div className="row">
                    <div className="col-sm-6"><button className="w-100 export-btn">Cancel</button></div>
                    <div className="col-sm-6"><button className="w-100 export-btn black">Email CAM</button></div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>

        {/* End email cam*/}


        {/* Admin Schedule cam */}
        <EmailReport
          user_sfid={this.props.user_sfid}
          open_email_report={this.props.open_email_report}
          group_recipient={this.props.group_recipient}
          group_list={this.props.group_list}
          dispatch={this.props.dispatch}
          stage={'All Leads'}
        />
        {/* Schedule email end */}

        {/* Download */}
        <div className="table-responsive dark_header" style={{ display: "none" }}>
          <table
            className="table"
            id="dataTables"
            width="100%"
            cellSpacing={0}
          >
            <thead>
              <tr>
                <th><input type="checkbox" />#</th>
                <th>Application ID</th>
                <th>Customer Details  </th>
                <th>Product</th>
                <th>Loan Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads && leads.length > 0 &&
                (
                  leads.map((item, index) => (
                    <tr className="shown" key={index}>
                      <td><input type="checkbox" />{this.serialNumber(index)}</td>
                      <td>
                        <b className="underline d-block"><a href="/lead_details">{item.opp_id}</a></b>
                        <span className="date"> {item.created_at}</span>
                      </td>
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
                      <td><b>₹ {item.product_mrp ? item.product_mrp : '0'}</b></td>
                      <td className="has_btn">
                        {item.status ? item.status : ''}
                      </td>
                    </tr>
                  ))
                )
              }
            </tbody>
          </table>

        </div>

      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoading, isLoggedIn, user_id, token_id, user_sfid } = state.auth;
  const { leads, leadsCount, report_count, group_list, group_recipient, searchArr, Loading, global_Search_Keyword } = state.user;
  const { open_email_report, open_download_report, searchActive } = state.model;
  const { message } = state.message;
  return {
    open_download_report,
    open_email_report,
    group_recipient,
    report_count,
    group_list,
    isLoggedIn,
    leadsCount,
    isLoading,
    user_sfid,
    token_id,
    user_id,
    message,
    leads,
    searchArr,
    searchActive,
    Loading,
    global_Search_Keyword
  };
}

export default connect(mapStateToProps)(AllLeads);
