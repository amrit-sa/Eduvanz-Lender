import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Pagination from '@material-ui/lab/Pagination';
import { Redirect } from "react-router-dom";
import { getLeads, getLeadsCount, getProducts, createBulkLeads, openLeadProfileModel, getBulkHistory } from "../actions/users";
import { salesForceLogin } from "../actions/auth";
import Sidebar from "../common/sidebar";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { CSVLink } from "react-csv"
import TimeRange from 'react-time-range';
import moment from 'moment';
import Header from "../common/header";
import EmailReport from "../common/email-report";
import DownloadReport from "../common/download-report";
import { openeMailReport, openeDownloadReport } from "../actions/model";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import readXlsxFile from 'read-excel-file'
import fileDownload from 'js-file-download'
import axios from 'axios'
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';


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
      upload_status: '',
      username: "",
      password: "",
      loading: false,
      selectedTab: 1,
      pageCount: 0,
      page: 1,
      shrp: false,
      disbursal_pending: true,
      perPage: 10,
      currentPage: 1,
      totalDisPending: 0,
      files_uploaded: [],
      setError: '',
      file: '',
      data: [],

      isFrontUploading: false,
      isBackUploading: false,
      isSuccess: '',
      successMsg: '',
      leads: '',
      selected: '',
      bulkFiles: [],
      selectedCase: "newest",
      selectionRanges: [{ 'startDate': addDays(new Date(), -7), 'endDate': new Date(), 'key': 'selection' }],
      showTimeRange: false,
      bulkData: [],
      bulk_status: [],
      bulk_upload_msg: '',
      bulk_response_totalCount: 0,
      isError: false,
      errorMsg: '',
      start_progress: false,
      uploadHistory: []
    };
  }


  handleBackFileSelect = (event) => {
    const files = event.target.files;
    readXlsxFile(files[0]).then((rows) => {
      this.setState({ leads: rows, isSuccess: '', start_progress: false, successMsg: '', selected: files[0].name });
      // this.uploadLeads()
      const { bulkFiles } = this.state;
      let oldArr = bulkFiles;

      let obj = {
        file_name: files[0].name,
        file_data: rows
      }

      oldArr.push(obj)
      this.setState({ bulkFiles: oldArr })




    });
  }

  removeFile = (index) => {
    let new_arr = this.state.bulkFiles.filter((obj, i) => {
      return index != i
    })
    this.setState({ bulkFiles: new_arr, leads: '' })
    this.setState({ isDragg: false, isFileDrag: false });
    document.getElementById('input-file').value = null;

  }

  uploadLeads = () => {
    this.setState({ upload_status: '', start_progress: true, isError: false, errorMsg: '' })
    document.getElementById('progressBar').classList.remove('redPro_line')
    document.getElementById('progressBar').classList.remove('greenPro_line')

    let line = document.getElementById('progressBar')
    let wth = 0;
    let int_id = setInterval(() => {
      if (wth == 60) {
        clearInterval(int_id)
        this.finalUpload()
      }

      line.style.width = wth + '%'
      wth += 1
    }, 50)

  }

  finalUpload = () => {
    const { dispatch, user_id, user_sfid } = this.props
    // console.log(this.props, "Props")
    let data = {
      lead: this.state.leads,
      id: parseInt(user_id),
      loggedin_user:user_sfid,
      file:this.state.selected
    }
    dispatch(createBulkLeads(data)).then((response) => {
      if (response.status !== undefined && response.status === "success") {
        console.log(response, "response")


        let line = document.getElementById('progressBar')
        let wth = 61
        let int_id_2 = setInterval(() => {
          if (wth >= 100) {
            clearInterval(int_id_2)
            line.classList.add('greenPro_line')
            this.setState({ upload_status: 'success' })

            setTimeout(() => {
              this.setState({ bulkData: response.proData })
              this.setState({ bulk_status: response.statusCount })
              this.setState({ bulk_response_totalCount: response.totalCount })
            }, 1000)
          }

          line.style.width = wth + '%'
          wth += 2
        }, 50)


        this.setState({ isSuccess: 1, successMsg: response.message, selected: '' });
        // setInterval(dispatch(getLeads('stage=Pre Approval', sfid)), 5000);
      } else {
        this.setState({ bulk_upload_msg: response.message })
        let line = document.getElementById('progressBar')
        let wth = 61
        let int_id_2 = setInterval(() => {
          if (wth >= 100) {
            clearInterval(int_id_2)
            line.classList.add('redPro_line')
            this.setState({ upload_status: 'failed', isError: true, errorMsg: response.message, start_progress: false })
          }

          line.style.width = wth + '%'
          wth += 1
        }, 50)
        this.setState({ isSuccess: 0, successMsg: response.message, selected: '' });
      }
    });
  }

  getHistory = () => {
    const { user_sfid } = this.props
    const payload = {
      user_sfid: user_sfid
    }
    this.props.dispatch(getBulkHistory(payload)).then((response) => {
      if (response.status !== undefined && response.status === "success") {
        this.setState({ uploadHistory: response.uploadHistory })
      }
    })
  }


  handleDownload = (url) => {
    const d = new Date()
    const time = d.getTime()
    let filename = 'Bulk-leads-' + time + '.xlsx';
    axios.get(url, {
      responseType: 'blob',
    })
      .then((res) => {
        fileDownload(res.data, filename)
      })
  }






  componentDidMount() {
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      stage: 'Ready to disburse'
    }
    // this.props.dispatch(getLeads({lender_sfid:user_sfid}))
    let pagination_obj = { "page": this.state.currentPage, "limit": this.state.perPage }
    let dateRangeObj = { 'from_date_time': '', 'to_date_time': '' }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const disbursal_pending = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({ disbursal_pending: disbursal_pending, totalDisPending: disbursal_pending.total });
      }
    });
    this.props.dispatch(getProducts());
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
    history.push('/disbursal_lead_details');
  }

  generatePDF = () => {
    var doc = new jsPDF('p', 'pt');
    doc.text(20, 20, 'Disbursal Pending Leads')
    doc.addFont('helvetica', 'normal')
    doc.autoTable({ html: '#dataTables' })

    doc.save('disbursal_pending.pdf')
  }

  handleChangePage = (event, value) => {
    let data = `page=${value}`;
    let count = 10 * (value - 1);
    this.setState({ page: value, pageCount: count });
    this.props.dispatch(getLeads(data));
  }

  handleTab = (value) => {
    this.setState({ selectedTab: value });
  }


  handleSchedule = () => {
    this.setState({ schedule_send: true });

  }

  shrp = () => {
    this.setState({ shrp: !this.state.shrp })
  }

  openDownload = () => {
    this.props.dispatch(openeDownloadReport());
  }

  serialNumber = (index) => {
    const { pageCount } = this.state
    let line = index + 1;
    return (pageCount + line);
  }

  handlepPerPageChange = async (given_number) => {
    this.setState({ perPage: given_number, currentPage: 1 })
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      stage: 'Ready to disburse'
    }
    let pagination_obj = { "page": 1, "limit": given_number }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const disbursal_pending = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({ disbursal_pending: disbursal_pending, totalDisPending: disbursal_pending.total });
      }
    });
    this.props.dispatch(getProducts());
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));

  }


  openEmailReport = () => {
    this.props.dispatch(openeMailReport());
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
      stage: 'Ready to disburse'
    }
    let pagination_obj = { "page": requiredPage, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const disbursal_pending = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({ disbursal_pending: disbursal_pending, totalDisPending: disbursal_pending.total });
      }
    });
    this.props.dispatch(getProducts());
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));
  }


  //case type change

  showLeadsCase = async (selected_case) => {

    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      stage: 'Ready to disburse'
    }
    let pagination_obj = { "page": 1, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, selected_case)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const disbursal_pending = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({ disbursal_pending: disbursal_pending, totalDisPending: disbursal_pending.total });
      }
    });
    this.props.dispatch(getProducts());
    let obj = { id: this.props.user_id, token: this.props.token_id }
    this.props.dispatch(salesForceLogin(obj));

    // console.log('selected val', given_case)

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
    return final_date_time
  }
  dateSet = () => {
    this.shrp();
    const { user_sfid } = this.props
    let leadObj = {
      lender_sfid: user_sfid,
      stage: 'Ready to disburse'
    }
    let pagination_obj = { "page": 1, "limit": this.state.perPage }
    let given_time_date = this.state.selectionRanges
    let startDateTimeselected = this.returnDateTimeFormat(given_time_date[0].startDate)
    let endDateTimeselected = this.returnDateTimeFormat(given_time_date[0].endDate)
    let dateRangeObj = { 'from_date_time': startDateTimeselected, 'to_date_time': endDateTimeselected }
    this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, this.state.selectedCase)).then((response) => {
      if (response && response.status && response.status === "success") {
        const contDet = response.contDet ? response.contDet : null;
        const disbursal_pending = contDet.disbursal_pending ? contDet.disbursal_pending : null;
        this.setState({ disbursal_pending: disbursal_pending, totalDisPending: disbursal_pending.total });
      }
    });
    this.props.dispatch(getProducts());
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



  dragOver = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    this.setState({ isDragg: true });
  }
  dragEnter = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    this.setState({ isDragg: true });
  }
  dragLeave = (e) => {
    e.preventDefault();
    this.setState({ isDragg: false });
  }

  handleclose_BulkModal = () => {
    this.handleClear_all();
  }

  handleClear_all = () => {
    this.setState({ bulkData: [], bulkFiles: [], bulk_status: [], errorMsg: '', file: '', files_uploaded: [], isError: false, isSuccess: '', upload_status: '', leads: '' })
    document.getElementById('input-file').value = null;

  }

  fileDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    let type = files[0].type;
    // this.setState({ isDragg: false, isFileDrag: false });

    // const files = event.target.files;
    readXlsxFile(files[0]).then((rows) => {
      this.setState({ leads: rows, isSuccess: '', successMsg: '', selected: files[0].name });
      // this.uploadLeads()
      const { bulkFiles } = this.state;
      let oldArr = bulkFiles;

      let obj = {
        file_name: files[0].name,
        file_data: rows
      }

      oldArr.push(obj)
      this.setState({ bulkFiles: oldArr })




    });



    // var reader = new FileReader();
    // var url = reader.readAsDataURL(files[0]);
    // let sizeError = 0;
    // let fileError = 0;
    // let fileSize = files[0].size / 1024 / 1024;
    // let fname = files[0].name;
    // var re = /(\.jpg|\.jpeg|\.png)$/i;
    // if (fileSize > 5) {
    //     sizeError = 1;
    // }
    // if (!re.exec(fname)) {
    //     fileError = 1;
    // }
    // if (fileError === 1 || sizeError === 1) {
    //     if (fileError === 1) {
    //         this.setState({ isFileDrag: false, validPic: false, errorMsg: "File extension not supported!" });
    //     } else if (sizeError === 1) {
    //         this.setState({ isFileDrag: false, validPic: false, errorMsg: "File size is more than 5 MB" });
    //     }
    // } 
    // else {
    //     this.checkLiveness(files[0]);
    //     reader.onloadend = function (e) {
    //         this.setState({
    //             fileSrc: [reader.result],
    //             file: [reader.result],
    //             isSaved: true,
    //             isFileDrag: false,
    //             fileType: type,
    //             fileTypeSrc: type,
    //             validPic: true,
    //             errorMsg: ''
    //         })
    //     }.bind(this);
    // }

  }



  render() {
    const { isLoading, isLoggedIn, message, leads, leadsCount, user_id, token_id, searchArr, searchActive } = this.props;
    const { selectedTab, disbursal_pending, perPage, totalDisPending, uploadHistory } = this.state;
    if (!user_id) {
      return <Redirect to="/login" />
    }
    let inputRef;
    let tabledata = searchActive ? searchArr : leads;
    const totalPages = Math.ceil(totalDisPending / perPage);
    return (
      <>
        <Helmet>
          <title>Disbursal Pending</title>
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
              {/* Topbar */}
              <Header
                title={'Disbursal Pending'}
                isSearchEnable={true}
                dispatch={this.props.dispatch}
              />

              {/* <div className="container-fluid leads_header">
          <div className="row align-items-center">
            <div className="col-md-12">
              <ul className="leads_boxinfo">
                <li className="col_2">
                  <span className="title"><img src="images/dis_pending.svg" /> 35</span>
                  <span className="atsize">Disbursal Pending</span>
                </li>
                <li className="col_2">
                  <span className="title"><img src="images/dis_pending.svg" /> 35</span>
                  <span className="atsize">Awaiting Disbursal</span>
                </li>
              </ul>
            </div>
          </div>
        </div> */}


              <div className="container-fluid leads_header">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <ul className="leads_boxinfo">
                      <li className="col_1">
                        <div className="inner  d-flex">
                          <div className="w-50">
                            <img src="images/Disbursalpending_icon.svg" />
                            <span className="atsize">Disbursal Pending</span>
                          </div>
                          <div className="w-50">
                            <div className="d-flex align-items-center justify-content-end">
                              <i className="fa fa-inr d-inline-block mr-1" aria-hidden="true"></i>
                              <span className="title d-inline-block mr-1">{disbursal_pending && disbursal_pending.amount ? disbursal_pending.amount : 0}</span>
                              {/* <span className="title">Cr</span> */}
                            </div>
                            <div className="text-right"><span className="title d-inline-block mr-1">{disbursal_pending && disbursal_pending.total ? disbursal_pending.total : 0}</span></div>
                          </div>
                        </div>
                      </li>
                      {/* <li className="col_1">
                  <div className="inner  d-flex">
                    <div className="w-50">
                      <img src="images/apr_pending2.svg" />
                      <span className="atsize">Awaiting Disbursal</span>
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

                  <div className="col-md-6 align-items-baseline">

                    <button type="button" class="icon-button mr-2 float-right" data-toggle="modal" data-target="#historyModal"
                      onClick={this.getHistory}
                    >
                      <img src="images/icons/copy_black.png" /> Upload History
                    </button>
                    <button type="button" class="btn-dark icon-button mr-2 float-right" data-toggle="modal" data-target="#exampleModal">
                      <img src="images/icons/copy_white.png" /> Bulk Upload
                    </button>
                  </div>
                </div>
              </div>

              <div className="container-fluid leads_header d-md-flex">
                <a href={void (0)} ><button onClick={this.openDownload} className="icon-button border-0"><img src="images/icons/download.svg" /> Download All Cases</button></a>
                {/* <a href="#" data-toggle="modal" data-target="#downloadReport"><button className="icon-button border-0 mb-3 mb-md-0"><img src="images/icons/download.svg" /> Download All Cases</button></a> */}
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


                  {/* <div className="trw">
                <button className="icon-button mr-2" onClick={this.shrp}><img src="images/icons/fi-rr-calendar.svg" />Time Range</button>
                  {this.state.shrp ? <div className="show-hide-range-picker">
                  <TimeRange
                    startMoment={this.state.startTime}
                    endMoment={this.state.endTime}
                    onChange={this.returnFunction}
                  />
                </div> : ''}
              </div> */}

                  {/* <div className="erb">
    <button className="icon-button mr-md-2"><img src="images/icons/email.svg" /> Email Report</button>
  </div> */}




                  <a href={void (0)} className="cursor-point" onClick={this.openEmailReport}><button className="icon-button mr-2"><img src="images/icons/email.svg" /> Email Report</button></a>

                  <div className="icon-button mr-2 cursor-point p-1">
                    <select className="form-control form-control-sm border-none p-0 border-bottom-0 pl-2 pr-2" id="caseType" style={{ fontWeight: "600px", fontSize: "16px", color: "black", height: '30px' }} onChange={this.setCaseType}>
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
                            <th>Customer Details </th>
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
                                <tr className="shown" key={index}>
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
                        <div className="d-flex justify-content-end pb-4">
                          <div className="p-3">
                            {this.state.currentPage}-{totalPages} of {this.state.totalDisPending}
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
                            <button className="btn bg-light shadow-lg" type="button" onClick={() => this.handleNextPrevPage("prev")} disabled={this.state.currentPage == 1 ? true : false}> <i className="fa fa-long-arrow-left"></i> Previous Page </button>
                            <button className="btn bg-light ml-2 shadow-lg" type="button" onClick={() => this.handleNextPrevPage("next")} disabled={this.state.perPage > tabledata.length || this.state.perPage == totalDisPending ? true : false}> Next Page <i className="fa fa-long-arrow-right"></i></button>
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


        <EmailReport
          user_sfid={this.props.user_sfid}
          open_email_report={this.props.open_email_report}
          group_recipient={this.props.group_recipient}
          group_list={this.props.group_list}
          dispatch={this.props.dispatch}
          stage={'All Leads'}
        />
        {/* Admin download reports */}
        <div className="modal fade" id="downloadReport_1">
          <div className="modal-dialog modal-dialog-centered dr-modal">
            <div className="modal-content">

              <div className="modal-body">


                <div className="d-flex align-items-center justify-content-between">
                  <h3 className="mb-3 modalTitle">Download Reports</h3>
                  {/* <button className="cs-btn">Clear Selection</button> */}
                  <button type="button" className="close closereport" data-dismiss="modal">
                    ×
                  </button>
                </div>
                <h5 className="font-weight-bold mb-3">Select Report</h5>

                <ul className="checkboxes">
                  <li>
                    <div className="custom_checkbox">
                      {/* <input type="checkbox" defaultChecked={true}/> */}
                      <label htmlFor="">All Leads</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox">
                      {/* <input type="checkbox"/> */}
                      <label htmlFor="">Approval Pending</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox">
                      {/* <input type="checkbox"/> */}
                      <label htmlFor="">Repayments</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox">
                      {/* <input type="checkbox" /> */}
                      <label htmlFor="">Disbursed</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox">
                      {/* <input type="checkbox" /> */}
                      <label htmlFor="">Declined</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox">
                      <input type="checkbox" defaultChecked={true} />
                      <label htmlFor="">Disbursement Pending</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox">
                      {/* <input type="checkbox" /> */}
                      <label htmlFor="">Dropped</label>
                    </div>
                  </li>
                </ul>

                <h5 className="font-weight-bold mb-3">Time Range</h5>
                <ul className="checkboxes">
                  <li>
                    <div className="custom_checkbox none">
                      <input type="checkbox" defaultChecked={true} />
                      <label htmlFor="">Today</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox none">
                      <input type="checkbox" />
                      <label htmlFor="">Last 7 days</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox none">
                      <input type="checkbox" />
                      <label htmlFor="">Last 30 days</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox none">
                      <input type="checkbox" />
                      <label htmlFor="">Last quarter</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox none">
                      <input type="checkbox" />
                      <label htmlFor="">Last Year</label>
                    </div>
                  </li>
                  <li>
                    <div className="custom_checkbox none">
                      <input type="checkbox" />
                      <label htmlFor="">Custom Date</label>
                    </div>
                  </li>
                </ul>
                <h5 className="mb-3">Custom Date</h5>

                <div className="row">
                  <div className="col-sm-6">
                    <input type="text" id="startdate" className="dateR" />
                  </div>
                  <div className="col-sm-6">
                    <input type="text" id="enddate" className="dateR" />
                  </div>
                </div>

                <div className="modalFooter">
                  <div className="row">
                    <div className="col-sm-6"><button onClick={this.generatePDF} className="w-100 export-btn"><img src="images/pdf.svg" className="img-fluid"></img> Export PDF</button></div>
                    <div className="col-sm-6"><CSVLink data={leads}><button className="w-100 export-btn"><img src="images/excel.svg" className="img-fluid"></img> Export CSV</button>
                    </CSVLink></div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        {/* End Admin Reports*/}



        <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className={`modal-dialog bulkBox  
            ${this.state.bulkData.length > 0 ? 'modal-lg w-100' : ''}
          `} role="document">
            <div class="modal-content">

              {this.state.bulkData.length > 0 ?

                <>
                  <div class="modal-header">
                    <h4 class="modal-title">{this.state.bulkFiles[0]["file_name"]}</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleclose_BulkModal}>
                      <img src="images/icons/icon-close2.png" />
                    </button>
                  </div>

                  <div class="modal-body">

                    <div className="container p-4">
                      <div className="row">

                        <div className="col-md-8 d-flex mb-2" style={{ gap: "1rem" }}>
                          <div className="box3 gray">
                            <h6 className="font-weight-bold">Total Leads</h6>
                            <h1>{this.state.bulk_response_totalCount}</h1>
                          </div>

                          <div className="box3 green">
                            <h6 className="font-weight-bold">Booked Loans</h6>
                            <h1>{this.state.bulk_status.length > 0 && this.state.bulk_status[0]["count"]}</h1>
                          </div>

                          <div className="box3 red">
                            <h6 className="font-weight-bold">Errors</h6>
                            <h1>00</h1>
                          </div>
                        </div>

                        <div className="col-md-4">
                          <button type="button" class="icon-button mr-2 float-right" >
                            <img src="images/icons/download.svg" /> Download Summary
                          </button>
                        </div>
                      </div>
                      <table className="table history_table">
                        <thead>
                          <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Application Id</th>
                            <th scope="col">Result</th>
                            <th scope="col">Errors</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.bulkData.map((item, index) =>
                            <tr>
                              <td scope="row">{index + 1}</td>
                              <td>{item.opp_id}</td>
                              <td>
                                {(item.status === 'success') ?
                                  <>
                                    <span className="close_Icon">
                                      <img src="images/icons/green_right.png" />  Loan Booked
                                    </span>

                                  </>

                                  :
                                  <>
                                    <span className="close_Icon">
                                      <img src="images/icons/close_ICON.png" />  Loan Not Booked
                                    </span>
                                  </>
                                }

                              </td>
                              <td>
                                {(item.status === 'success') ?

                                  <p>-</p>

                                  :
                                  <>
                                    <p>{this.state.bulk_upload_msg}</p>
                                  </>
                                }


                              </td>
                            </tr>
                          )}

                        </tbody>
                      </table>

                    </div>
                  </div>

                </>

                :
                <>
                  <div class="modal-header">
                    <h4 class="modal-title">Disburse hundreds of case together</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.handleclose_BulkModal}>
                      <img src="images/icons/icon-close2.png" />
                    </button>
                  </div>

                  <div class="bulkPopup p-4"
                    onDragOver={this.dragOver}
                    onDragEnter={this.dragEnter}
                    onDragLeave={this.dragLeave}
                    onDrop={this.fileDrop}
                  >

                    <h6 class="instru">Instructions- <a href="#" onClick={this.getHistory} data-toggle="modal" data-target="#historyModal" >View history</a></h6>

                    <ul>
                      <li>Download the <a href="sample/Sample.xlsx">Bulk Upload Template here <img src="images/icons/upload-icon_blue.svg" /></a></li>
                      <li>Fill in App ID, UTR No, Amount & Payment Date in the template.</li>
                      <li>Upload it below for processing disbursals.</li>
                    </ul>

                    <div className="uplaod_file"


                    >

                      <img src="images/icons/uploadFile_icon.svg" />
                      {/* {!this.state.isDragg && */}
                      <>
                        {this.state.leads == '' &&
                          <h6 >Drag or Upload the file here, or<a href="#" onClick={() => inputRef.click()}> browse</a></h6>
                        }
                        <ol>
                          <li>File Supported: .csv   </li>
                          <li>Max File Size: 5MB </li>
                        </ol>

                        <div class='file file--upload'>
                          {this.state.leads == '' &&
                            <label for='input-file'>
                              <img src="images/icons/upload_icon_w.svg" /> Upload File
                            </label>
                          }
                          <input id='input-file' type='file'
                            // onChange={this.handleInputFiles} 
                            // accept=".xlsx, .xls, .csv"
                            ref={refParam => inputRef = refParam}
                            onChange={this.handleBackFileSelect}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                          />
                        </div>
                      </>
                      {/* } */}

                    </div>

                    {
                      this.state.bulkFiles.map((obj, index) => {
                        return (
                          <div className="processBox" key={index}>
                            <div className="csv">
                              <img src="images/icons/csv_icon.svg" />
                            </div>

                            <div className="progrcessColl">
                              <a href="#"> {obj.file_name}
                                {/* <b>64%</b> */}
                              </a>

                              <span className="progrcessLine">

                                <small className="bluePro_line" style={{ width: "0%" }} id='progressBar'></small>
                              </span>
                            </div>

                            {this.state.upload_status === 'success' ?
                              <>

                                <div className="close_Icon">
                                  <img src="images/icons/green_right.png" />
                                </div>

                                {/* <div className="close_Icon">
                              <a href="#"><img src="images/icons/deleteIcon.svg" /></a>
                            </div> */}
                              </>
                              :
                              (this.state.upload_status === 'failed') ?
                                <>
                                  <div className="close_Icon">
                                    <img src="images/icons/miss_icon.png" />
                                  </div>

                                  <div className="close_Icon" onClick={this.uploadLeads}>
                                    <a href="#"><img src="images/icons/restore_icon.svg" /></a>
                                  </div>
                                </>
                                :
                                <>
                                  {
                                    !this.state.start_progress &&
                                    <div className="close_Icon cursor-point" onClick={() => this.removeFile(index)}>
                                      <img src="images/icons/close_ICON.png" />
                                    </div>
                                  }
                                </>
                            }
                          </div>

                        )
                      })
                    }
                    {this.state.isError == true &&
                      <div className="alert alert-danger py-2">{this.state.errorMsg}</div>
                    }
                    {!this.state.start_progress &&
                      <button className="ProcessButton" onClick={this.uploadLeads}>
                        <img src="images/icons/running_icon.svg" /> Process File
                      </button>
                    }
                  </div>
                </>
              }

            </div>
          </div>
        </div>




        <div class="modal fade bd-example-modal-lg" id="historyModal" tabindex="-1" role="dialog" aria-labelledby="historyModalLabel" aria-hidden="true">
          <div class="modal-dialog modal-xl bulkBox w-100" role="document">
            <div class="modal-content">

              <div class="modal-header">
                <h4 class="modal-title">Bulk upload history</h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <img src="images/icons/icon-close2.png" />
                </button>
              </div>

              <div class="modal-body">

                <div className="container p-4">

                  <table className="table history_table">
                    <thead>
                      <tr>
                        <th scope="col">No.</th>
                        <th scope="col">File Name</th>
                        <th scope='col'>Upload Date</th>
                        <th scope='col'>Uploaded Cases(#) </th>
                        <th scope='col'>Booked Cases</th>
                        <th scope="col">Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadHistory.length > 0 &&
                        uploadHistory.map((item, index) => {
                          <tr key={index}>
                            <td>{index+1}</td>
                            <td scope="row"><a href="#" className="link" >{item.file_name__c}</a></td>
                            <td>{item.upload_date__c}</td>
                            <td>{item.total_cases__c}</td>
                            <td>{item.total_successful__c}</td>
                            <td><a href={item.file_link__c}><img src="images/icons/download.svg" /></a></td>
                          </tr>
                        })
                      }

                    </tbody>
                  </table>

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
  const { isLoading, isLoggedIn, user_id, token_id, user_sfid } = state.auth;
  const { leads, leadsCount, searchArr } = state.user;
  const { searchActive, open_email_report } = state.model;
  const { message } = state.message;
  return {
    isLoggedIn,
    isLoading,
    message,
    leads,
    leadsCount,
    user_id,
    token_id,
    user_sfid,
    searchActive,
    searchArr,
    open_email_report
  };
}

export default connect(mapStateToProps)(AllLeads);
