import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import Login from "./components/login.component";
import ChangePassword from "./components/change-password.component";
import ChgPassword from "./components/chg-password.component";
import ChgPasswordSuccess from "./components/pwd-changed-success.component";
import ForgotPassword from "./components/forgot-password.component";
import ForgotOtp from "./components/forgot-otp.component";
import Register from "./components/register.component";
import VerifyOtp from "./components/verify-otp.component";
import Dashboard from "./components/dashboard.component";
import AllLeads from "./components/leads.component";
import LeadDetails from "./components/leads-details.component";
import ApprovalPending from "./components/approval-pending.component";
import ApprovalLeadDetails from "./components/approval-lead-details.component";
import DisbursalPending from "./components/disbursal-pending.component";
import DisbursalLeadDetails from "./components/disbursal-lead-details.component";
import Disbursed from "./components/disbursed.component";
import DisbursedLeadDetails from "./components/disbursed-lead-details.component";
import Declined from "./components/declined.component";
import DeclinedLeadDetails from "./components/declined-lead-details.component";
import Dropped from "./components/dropped.component";
import DroppedLeadDetails from "./components/dropped-lead-details.component";
import Closed from "./components/closed.component";
import ClosedLeadDetails from "./components/closed-lead-details.component";
import Screen1 from "./components/screen1.component";
import Screen2 from "./components/screen2.component";
import Screen3 from "./components/screen3.component";
import ManageRole from "./components/manage-role.component";
import ManageGroup from "./components/manage-group";
import ManageRecipient from "./components/manage-recipient.component";
import EmailReportList from "./components/email-report.component";
import Screen5 from "./components/screen5.component";
import Faq from "./components/faq.component";
import AllModal from './components/all-modal';
import { history } from './helpers/history';
import EmailReport from "./common/email-report";
// require('react-datepicker/dist/react-datepicker');


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModeratorBoard: false,
      showAdminBoard: false,
      currentUser: undefined,
      selectedTab: 1,
    };
  }

  componentDidMount() {
    const user = this.props.user;
  }

  handleTab = (value) =>{
    this.setState({selectedTab: value});
  }

  render() {
    const { currentUser, showModeratorBoard, showAdminBoard } = this.state;

    return (
      <Router history={history}>
        
            <Switch>
              <Route exact path={["/", "/login"]}  render={(props)=>{return(<Login handleTab={this.handleTab} selectedTab={this.state.selectedTab} history={history}/>)}} />
              <Route exact path="/edSetPassword/:id" render={(props)=>{return(<ChangePassword id={props.match.params.id}/>)}} />
              <Route exact path="/edForgotpassword" component={ForgotPassword} />
              <Route exact path="/change_password" component={ChgPassword} />
              <Route exact path="/password_success" component={ChgPasswordSuccess} />
              <Route exact path="/edForgototp" component={ForgotOtp} />
              <Route exact path="/register" component={Register} />
              <Route exact path="/verify_otp"  render={(props)=>{return(<VerifyOtp handleTab={this.handleTab} history={history}/>)}}/>
              <Route exact path="/dashboard" component={Dashboard} />
              <Route exact path="/leads" component={AllLeads} />
              <Route exact path="/lead_details" component={LeadDetails} />
              <Route exact path="/approvalPending" component={ApprovalPending} />
              <Route exact path="/approval_lead_details" component={ApprovalLeadDetails} />
              <Route exact path="/disbursalPending" component={DisbursalPending} />
              <Route exact path="/disbursal_lead_details" component={DisbursalLeadDetails} />
              <Route exact path="/disbursed" component={Disbursed} />
              <Route exact path="/disbursed_lead_details" component={DisbursedLeadDetails} />
              <Route exact path="/declined" component={Declined} />
              <Route exact path="/declined_lead_details" component={DeclinedLeadDetails} />
              <Route exact path="/dropped" component={Dropped} />
              <Route exact path="/dropped_lead_details" component={DroppedLeadDetails} />
              <Route exact path="/closed" component={Closed} />
              <Route exact path="/closed_lead_details" component={ClosedLeadDetails} />
              <Route exact path="/manage_role" component={ManageRole} />
              <Route exact path="/manage_group" component={ManageGroup} />
              <Route exact path="/manage_recipient" component={ManageRecipient} />
              <Route exact path="/email_report" component={EmailReportList} />
              <Route exact path="/faq" component={Faq} />
              <Route exact path="/screen1" component={Screen1} />
              <Route exact path="/screen2" component={Screen2} />
              <Route exact path="/screen3" component={Screen3} />
              <Route exact path="/screen5" component={Screen5} />
              <Route exact path="/allmodal" component={AllModal} />
            </Switch>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);
