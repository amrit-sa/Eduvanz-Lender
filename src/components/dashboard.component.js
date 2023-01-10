import React, { Component } from "react";
import $ from "jquery";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Sidebar from "../common/sidebar";
import { Redirect } from "react-router-dom";
import { getDashboardCount, getDisbursalHistory, getRepaymentHistory, getDisHisChartData, getReHisChartData } from "../actions/leads";
import { getDashboardSummary,getLeads } from "../actions/users";
// import { Chart } from 'react-charts'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,  
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Header from "../common/header";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,  
  Title,
  Tooltip,
  Legend,
);

const MONTHLY = "Monthly";
const QUATERLY = "Quarterly";
const YEARLY = "Yearly"
const TODAY = "Today";
const THIS_WEEK = "This week";
const THIS_MONTH = 'This month'
const SIX_MONTH = "6 months"

export const options = {
  responsive: true,
  scales:{
    x : {
      grid: {
        display: false
      }
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top',
    },
    title: {
      display: true,
      text: '',
    },
    tooltip: {
      backgroundColor: 'rgba(132, 177, 209, 1)',
    },
  },     
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',];
const labelsQa = ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'];

export const data = {
  labels,
  datasets: [
    {
      label: 'Amount',
      fill: false,
      lineTension: 0.5,
      backgroundColor: '#1F78B4',
      borderColor: '#1F78B4',
      borderWidth: 3.5,
      data: [500000, 650000, 750000, 850000, 900000, 1000000, 1150000, 1200000, 1300000, 1400000, 1550000, 1600000]
    }
  ]
};

export const data2 = {
  labels,
  datasets: [
    {
      label: 'Amount',
      fill: false,
      lineTension: 0.5,
      backgroundColor: '#1F78B4',
      borderColor: '#1F78B4',
      borderWidth: 3.5,
      data: [500000, 650000, 750000, 850000, 900000, 1000000, 1150000, 1200000, 1300000, 1400000, 1550000, 1600000]
    }
  ]
};


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.getDisGraph = this.getDisGraph.bind(this);
    this.getReGraph = this.getReGraph.bind(this);
    this.optionClick = this.optionClick.bind(this);
    this.state = {
      username: "",
      password: "",
      loading: false,
      selectedTab: 1,
      disbursalChartHide: false,
      repaymentChartHide: false,
      disDur: MONTHLY,
      reDur: MONTHLY,
      disGraphDataIs: data,
      disTableDataIs: null,
      reGraphDataIs: data2,
      reTableDataIs: null,
      disOpt: 1,
      reOpt: 1,
      duration:TODAY,
      dash_summary_data : {},
      
    };
  }

  componentDidMount() {
    const { dispatch, user_sfid } = this.props
    let data = { "duration": "today", lender_sfid: user_sfid }
    let obj = {
      lender_sfid: user_sfid
    }
    let obj1 = {
      lender_sfid: user_sfid,
      duration:TODAY,
    }
    this.props.dispatch(getLeads(obj));
    this.props.dispatch(getDashboardSummary(obj1)).then(res => {
      let datafilter  = {
        disbursal : res.disbursedSummary && res.disbursedSummary.length > 0 ? res.disbursedSummary[0] : {},
        repayment : res.repaymentSummary && res.repaymentSummary.length > 0 ? res.repaymentSummary[0] : {},
        pendingApro : res.approvalPendingSummary && res.approvalPendingSummary.length > 0 ? res.approvalPendingSummary[0] : {},
        pendingDisb : res.disbursalPendingSummary && res.disbursalPendingSummary.length > 0 ? res.disbursalPendingSummary[0] : {},
        rejectedDecl : res.declinedSummary && res.declinedSummary.length > 0 ? res.declinedSummary[0] : {},  
        rejectedDrop : res.droppedSummary && res.droppedSummary.length > 0 ? res.droppedSummary[0] : {},  
       }
       this.setState({dash_summary_data:datafilter});
      });
    dispatch(getDashboardCount(obj));
    // dispatch(getDisbursalHistory(data));
    // dispatch(getRepaymentHistory(data));
    this.getDisGraph();
    this.getReGraph();

    $('#sidebarToggleTop').on('click', function () {
      $('.sidebar-wrapper').toggleClass('toggled');
    })
    $('.sidbar-close').on('click', function () {
      $('.sidebar-wrapper').removeClass('toggled');
    })
  }

  handleTab = (value) => {
    this.setState({ selectedTab: value });
  }

  toggleDisbursalChart = () => {
    const { disbursalChartHide } = this.state;
    this.setState({ disbursalChartHide: !disbursalChartHide })
  }

  toggleRepaymentChart = () => {
    const { repaymentChartHide } = this.state;
    this.setState({ repaymentChartHide: !repaymentChartHide })
  }

  getDisGraph = () => {
    const { user_sfid } = this.props
    const dataObj = { 'duration': this.state.disDur, lender_sfid: user_sfid }
    this.props.dispatch(getDisHisChartData(dataObj)).then(response => {
      if (response.status == "success") {
        if(this.state.disDur == MONTHLY){
          this.drawDisGraphMon(response.disburseDataMonthly)
        }else if(this.state.disDur == QUATERLY){
          this.drawDisGraphQua(response.disburseDataQuarterly)
        }else if(this.state.disDur == YEARLY){
          this.drawDisGraphYear(response.disburseDataYearly)
        }
      }
    })
      .catch(error => {
        console.log(error, 'error is')
      })

  }

  drawDisGraphYear = (data) => {
    let arrayData = [];
    let tableData = [];
    for (let index = 0; index < data.length; index++) {
      const disDataIs = data[index];
      tableData.push({ "dur": 'Year'+disDataIs.year, "count": disDataIs.count, 'amt': disDataIs.amount })
      arrayData.push(disDataIs.amount)
    }    
    let dataObjIs = {
      labels : ['Year 2022'],
      datasets: [
        {
          label: 'Amount',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#1F78B4',
          borderColor: '#1F78B4',
          borderWidth: 3.5,
          data: arrayData,
        }
      ]
    };
    this.setState({
      disTableDataIs: tableData,
      disGraphDataIs: dataObjIs,
    })
  }

  drawDisGraphQua = (data) => {
    let arrayData = [0, 0, 0, 0];
    let tableData = [];
    for (let index = 0; index < data.length; index++) {
      const disDataIs = data[index];
      tableData.push({ "dur": 'Quarter'+disDataIs.quarter + ' ' + disDataIs.year, "count": disDataIs.count, 'amt': disDataIs.amount })
      switch (disDataIs.quarter) {
        case 1:
          arrayData[0] = disDataIs.amount
          break;
        case 2:
          arrayData[1] = disDataIs.amount
          break;
        case 3:
          arrayData[2] = disDataIs.amount
          break;
        case 4:
          arrayData[3] = disDataIs.amount
          break;                
        default:
          break;
      }
    }
    let dataObjIs = {
      labels : ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
      datasets: [
        {
          label: 'Amount',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#1F78B4',
          borderColor: '#1F78B4',
          borderWidth: 3.5,
          data: arrayData,
        }
      ]
    };
    this.setState({
      disTableDataIs: tableData,
      disGraphDataIs: dataObjIs,
    })
  }

  drawDisGraphMon = (data) => {
    let arrayData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let tableData = [];
    for (let index = 0; index < data.length; index++) {
      const disDataIs = data[index];
      tableData.push({ "dur": disDataIs.month + ' ' + disDataIs.year, "count": disDataIs.count, 'amt': disDataIs.amount })
      switch (disDataIs.month) {
        case "January":
          arrayData[0] = disDataIs.amount
          break;
        case "February":
          arrayData[1] = disDataIs.amount
          break;
        case "March":
          arrayData[2] = disDataIs.amount
          break;
        case "April":
          arrayData[3] = disDataIs.amount
          break;
        case "May":
          arrayData[4] = disDataIs.amount
          break;
        case "June":
          arrayData[5] = disDataIs.amount
          break;
        case "July":
          arrayData[6] = disDataIs.amount
          break;
        case "August":
          arrayData[7] = disDataIs.amount
          break;
        case "September":
          arrayData[8] = disDataIs.amount
          break;
        case "October":
          arrayData[9] = disDataIs.amount
          break;
        case "November":
          arrayData[10] = disDataIs.amount
          break;
        case "December":
          arrayData[11] = disDataIs.amount
          break;
        default:
          break;
      }
    }
    let dataObjIs = {
      labels,
      datasets: [
        {
          label: 'Amount',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#1F78B4',
          borderColor: '#1F78B4',
          borderWidth: 3.5,
          data: arrayData,
        }
      ]
    };
    this.setState({
      disTableDataIs: tableData,
      disGraphDataIs: dataObjIs,
    })
  }

  getReGraph = () => {
    const { user_sfid } = this.props
    const dataObj = { 'duration': this.state.reDur, lender_sfid: user_sfid }
    this.props.dispatch(getReHisChartData(dataObj)).then(response => {
      if (response.status == "success") {
        if(this.state.reDur == MONTHLY){
          this.drawReGraphMon(response.repayDataMonthly)
        }else if(this.state.reDur == QUATERLY){
          this.drawReGraphQua(response.repayDataQuarterly)
        }else if(this.state.reDur == YEARLY){
          this.drawReGraphYear(response.repayDataYearly)
        }
      }
    })
      .catch(error => {
        console.log(error, 'error is')
      })

  }

  drawReGraphYear = (data) => {
    let arrayData = [];
    let tableData = [];
    for (let index = 0; index < data.length; index++) {
      const disDataIs = data[index];
      tableData.push({ "dur": 'Year'+disDataIs.year, "count": disDataIs.count, 'amt': disDataIs.amount })
      arrayData.push(disDataIs.amount)
    }    
    let dataObjIs = {
      labels : ['Year 2022'],
      datasets: [
        {
          label: 'Amount',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#1F78B4',
          borderColor: '#1F78B4',
          borderWidth: 3.5,
          data: arrayData,
        }
      ]
    };
    this.setState({
      reTableDataIs: tableData,
      reGraphDataIs: dataObjIs,
    })
  }

  drawReGraphQua = (data) => {
    let arrayData = [0, 0, 0, 0];
    let tableData = [];
    for (let index = 0; index < data.length; index++) {
      const disDataIs = data[index];
      tableData.push({ "dur": 'Quarter'+disDataIs.quarter + ' ' + disDataIs.year, "count": disDataIs.count, 'amt': disDataIs.amount })
      switch (disDataIs.quarter) {
        case 1:
          arrayData[0] = disDataIs.amount
          break;
        case 2:
          arrayData[1] = disDataIs.amount
          break;
        case 3:
          arrayData[2] = disDataIs.amount
          break;
        case 4:
          arrayData[3] = disDataIs.amount
          break;                
        default:
          break;
      }
    }
    let dataObjIs = {
      labels : ['Quarter 1', 'Quarter 2', 'Quarter 3', 'Quarter 4'],
      datasets: [
        {
          label: 'Amount',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#1F78B4',
          borderColor: '#1F78B4',
          borderWidth: 3.5,
          data: arrayData,
        }
      ]
    };
    this.setState({
      reTableDataIs: tableData,
      reGraphDataIs: dataObjIs,
    })
  }

  drawReGraphMon = (data) => {
    let arrayData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let tableData = [];
    for (let index = 0; index < data.length; index++) {
      const disDataIs = data[index];
      tableData.push({ "dur": disDataIs.month + ' ' + disDataIs.year, "count": disDataIs.count, 'amt': disDataIs.amount })
      switch (disDataIs.month) {
        case "January":
          arrayData[0] = disDataIs.amount
          break;
        case "February":
          arrayData[1] = disDataIs.amount
          break;
        case "March":
          arrayData[2] = disDataIs.amount
          break;
        case "April":
          arrayData[3] = disDataIs.amount
          break;
        case "May":
          arrayData[4] = disDataIs.amount
          break;
        case "June":
          arrayData[5] = disDataIs.amount
          break;
        case "July":
          arrayData[6] = disDataIs.amount
          break;
        case "August":
          arrayData[7] = disDataIs.amount
          break;
        case "September":
          arrayData[8] = disDataIs.amount
          break;
        case "October":
          arrayData[9] = disDataIs.amount
          break;
        case "November":
          arrayData[10] = disDataIs.amount
          break;
        case "December":
          arrayData[11] = disDataIs.amount
          break;
        default:
          break;
      }
    }
    let dataObjIs = {
      labels,
      datasets: [
        {
          label: 'Amount',
          fill: false,
          lineTension: 0.5,
          backgroundColor: '#1F78B4',
          borderColor: '#1F78B4',
          borderWidth: 3.5,
          data: arrayData,
        }
      ]
    };
    this.setState({
      reTableDataIs: tableData,
      reGraphDataIs: dataObjIs,
    })
  }

  optionClick = (e) => {

  }

  handleDashboardSummary = (value) => {
    this.setState({duration:value})
    const { user_sfid } = this.props
  let  obj = {
    lender_sfid : user_sfid,
    duration:value,
   }
   this.props.dispatch(getDashboardSummary(obj)).then(res => {
    let datafilter  = {
      disbursal : res.disbursedSummary && res.disbursedSummary.length > 0 ? res.disbursedSummary[0] : {},
        repayment : res.repaymentSummary && res.repaymentSummary.length > 0 ? res.repaymentSummary[0] : {},
        pendingApro : res.approvalPendingSummary && res.approvalPendingSummary.length > 0 ? res.approvalPendingSummary[0] : {},
        pendingDisb : res.disbursalPendingSummary && res.disbursalPendingSummary.length > 0 ? res.disbursalPendingSummary[0] : {},
        rejectedDecl : res.declinedSummary && res.declinedSummary.length > 0 ? res.declinedSummary[0] : {},  
        rejectedDrop : res.droppedSummary && res.droppedSummary.length > 0 ? res.droppedSummary[0] : {},  
       }
    this.setState({dash_summary_data:datafilter});
   });
   
  }

  render() {
    const { isLoading, user_id, disbursal_history, dashboard_disbursal, dashboard_repayments, dashboard_rejected, dashboard_pending, repayment_history, } = this.props;
    const { disbursalChartHide, repaymentChartHide, dash_summary_data } = this.state;
    const {disbursal, repayment, pendingApro,pendingDisb, rejectedDrop, rejectedDecl} = dash_summary_data;
    console.log(dash_summary_data);
    if (!user_id) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Helmet>
          <title>Lender - Dashboard </title>
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
                title={'Dashboard'}
                isSearchEnable={true}
                dispatch={this.props.dispatch}
                type={"global"}
                history={this.props.history}
              />
              <div className="container-fluid leads_header">
                <div className="row align-items-center">
                  <div className="col-md-3"></div>
                  <div className="col-md-9 text-right">
                    <ul className="btn_lists">
                      <li>
                        <a href="#" className={this.state.duration === TODAY ? "active" : ''} onClick={() => this.handleDashboardSummary(TODAY)}>
                          Today
                  </a>
                      </li>
                      <li>
                        <a href="#" className={this.state.duration === THIS_WEEK ? "active" : ''} onClick={() => this.handleDashboardSummary(THIS_WEEK)}>
                          This week
                  </a>
                      </li>
                      <li>
                        <a href="#" className={this.state.duration === THIS_MONTH ? "active" : ''} onClick={() => this.handleDashboardSummary(THIS_MONTH)}>
                          This month
                  </a>
                      </li>
                      <li>
                        <a href="#" className={this.state.duration === SIX_MONTH ? "active" : ''} onClick={() => this.handleDashboardSummary(SIX_MONTH)}>
                          6 months
                  </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="container-fluid leads_header">
                <div className="row align-items-center">
                  <div className="col-md-12">
                    <ul className="leads_short_info">
                      <li>
                        <div className="inner">
                          <span className="title">Disbursal</span>
                          <div className="centeredin">
                            <span className="amt">
                              ₹ {disbursal && disbursal.amount ? disbursal.amount : '0'} <span className="innerinr" style={{ color: '#000' }}>Amount</span>
                            </span>
                            <span className="cases">
                              {disbursal && disbursal.count ? disbursal.count : '0'} <span className="innerinr">Cases</span>
                            </span>
                          </div>
                          <span className="atsize">Average Ticket Size <span className="inneratsize">{disbursal && disbursal.average_ticket_size ?`₹ ${(disbursal.average_ticket_size).toLocaleString("en-US")}` : '₹ 0'}</span></span>
                        </div>
                      </li>
                      <li>
                        <div className="inner">
                          <span className="title">Repayments</span>
                          <div className="centeredin">
                            <span className="amt">
                              ₹{repayment && repayment.amount ? repayment.amount : '0'}<span className="innerinr" style={{ color: '#000' }} >Amount</span>
                            </span>
                            <span className="cases">
                              {repayment && repayment.count ? repayment.count : '0'} <span className="innerinr">Cases</span>
                            </span>
                          </div>
                          <span className="atsize">Interest Earnings <span className="inneratsize">{repayment && repayment.interest_earnings ?`₹ ${repayment.interest_earnings.toLocaleString("en-US")}` : '₹ 0'}</span></span>
                        </div>
                      </li>
                      <li>
                        <div className="inner">
                          <span className="title">Pending</span>
                          {/* <div className="centeredin bx_approved"> */}
                          <div className="centeredin bx_rejected" style={{ backgroundColor: '#f2a5aa' }}>
                            <span className="amt">
                              {pendingApro && pendingApro.count ? pendingApro.count : '0'}<span className="innerinr">Approval</span>
                            </span>
                            <span className="cases" style={{ backgroundColor: '#f2a5aa' }}>
                              {pendingDisb && pendingDisb.count ? pendingDisb.count : '0'} <span className="innerinr" >Disbursal</span>
                            </span>
                          </div>
                          <span className="atsize">Pending Amount<span className="inneratsize" style={{ color: 'red' }}>₹ {pendingApro && pendingApro.amount ? pendingApro.amount.toLocaleString("en-US") : '0'}</span></span>
                        </div>
                      </li>
                      <li>
                        <div className="inner">
                          <span className="title">Rejected</span>
                          {/* <div className="centeredin bx_rejected"> */}
                          <div className="centeredin bx_approved">
                            <span className="amt">
                              {rejectedDecl && rejectedDecl.count ? rejectedDecl.count : '0'}<span className="innerinr">Declined</span>
                            </span>
                            <span className="cases">
                              {rejectedDrop && rejectedDrop.count ? rejectedDrop.count : '0'} <span className="innerinr">Dropped</span>
                            </span>
                          </div>
                          <span className="atsize">Rejected Amount <span className="inneratsize">₹ {rejectedDecl && rejectedDecl.amount ? rejectedDecl.amount.toLocaleString("en-US")  : '0'}</span></span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              {/* End of Topbar */}
              {/* Begin Page Content */}
              <div className="container-fluid">
                <div className="row">
                  <div className="col-12 text-right">
                    <ul className="btn_lists">
                      <li>
                        <a href="#" className={`disOpt ${this.state.disOpt == 1 ? 'active' : ''}`} onClick={(e) => {
                          this.setState({
                            disOpt: 1,
                            disDur: MONTHLY
                          }, () => { this.getDisGraph() })
                        }}>
                          Monthly
                        </a>
                      </li>
                      <li>
                        <a href="#" className={`disOpt ${this.state.disOpt == 2 ? 'active' : ''}`} onClick={(e) => {
                          this.setState({
                            disOpt: 2,
                            disDur: QUATERLY,
                          }, () => { this.getDisGraph() })
                        }}>
                          Quarterly
                        </a>
                      </li>
                      <li>
                        <a href="#" className={`disOpt ${this.state.disOpt == 3 ? 'active' : ''}`} onClick={(e) => {
                          this.setState({
                            disOpt: 3,
                            disDur: YEARLY
                          }, () => { this.getDisGraph() })
                        }}>
                          Yearly
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 pt-2">
                    <div className="boxed">
                      <div className="row">
                        <div className="col-12 d-flex justify-content-between">
                          <h5>Disbursal History</h5>
                          <div className="text-right">
                            <button className="s-h" onClick={this.toggleDisbursalChart}>{(!disbursalChartHide) ? "Hide Table" : "View Table"}</button>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className={(!disbursalChartHide) ? "col-lg-7" : "col-lg-12"}>
                          <Line options={options} data={this.state.disGraphDataIs} />
                        </div>
                        {(!disbursalChartHide) ?
                          <div className="col-lg-5">
                            <table className="w-100 month-table">
                              <thead>
                                <tr>
                                  <th>Months</th>
                                  <th>Disbursals (#)</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.disTableDataIs && this.state.disTableDataIs.map((item, index) => (
                                  <tr key={`disbursel-${index}`}>
                                    <td>{item.dur ? item.dur : '-'}</td>
                                    <td>{item.count ? item.count : '-'}</td>
                                    <td>₹ {item.amt ? item.amt.toLocaleString("en-US") : '-'}</td>
                                  </tr>
                                ))}
                              </tbody>

                            </table>
                          </div>
                          : ''
                        }
                      </div>

                    </div>
                    <div className="row">
                      <div className="col-12 text-right">
                        <ul className="btn_lists">
                          <li>
                            <a href="#" className={`disOpt ${this.state.reOpt == 1 ? 'active' : ''}`} onClick={(e) => {
                              this.setState({
                                reOpt: 1,
                                reDur: MONTHLY
                              }, () => { this.getReGraph() })
                            }}>
                              Monthly
                        </a>
                          </li>
                          <li>
                            <a href="#" className={`disOpt ${this.state.reOpt == 2 ? 'active' : ''}`} onClick={(e) => {
                              this.setState({
                                reOpt: 2,
                                reDur: QUATERLY,
                              }, () => { this.getReGraph() })
                            }}>
                              Quarterly
                        </a>
                          </li>
                          <li>
                            <a href="#" className={`disOpt ${this.state.reOpt == 3 ? 'active' : ''}`} onClick={(e) => {
                              this.setState({
                                reOpt: 3,
                                reDur: YEARLY
                              }, () => { this.getReGraph() })
                            }}>
                              Yearly
                        </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="boxed" style={{marginTop : "10px"}}>

                      <div className="row">
                        <div className="col-12 d-flex justify-content-between">
                          <h5>Repayment History</h5>
                          <div className="text-right">
                            <button className="s-h" onClick={this.toggleRepaymentChart}>{(!repaymentChartHide) ? "Hide Table" : "View Table"}</button>
                          </div>
                        </div>
                      </div>


                      <div className="row">
                        <div className={(!repaymentChartHide) ? "col-lg-7" : "col-lg-12"}>
                          <Line options={options} data={this.state.reGraphDataIs} />
                        </div>
                        {(!repaymentChartHide) ?
                          <div className="col-lg-5">
                            <table className="w-100 month-table">
                              <thead>
                                <tr>
                                  <th>Months</th>
                                  <th>Repayments (#)</th>
                                  <th>Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {this.state.reTableDataIs && this.state.reTableDataIs.map((item, index) => (
                                  <tr key={`repayment-${index}`}>
                                    <td>{item.dur ? item.dur : '-'}</td>
                                    <td>{item.count ? item.count : '-'}</td>
                                    <td>₹ {item.amt ? item.amt : '-'}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          : ''}
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
  const { isLoading, isLoggedIn, user_id, user_sfid } = state.auth;
  const { disbursal_history, dashboard_disbursal, dashboard_repayments, dashboard_pending, dashboard_rejected, repayment_history } = state.leads;
  const { message } = state.message;
  return {
    dashboard_disbursal,
    dashboard_repayments,
    dashboard_rejected,
    dashboard_pending,
    disbursal_history,
    repayment_history,
    isLoggedIn,
    isLoading,
    user_sfid,
    message,
    user_id
  };
}

export default connect(mapStateToProps)(Dashboard);
