import React, { Component } from "react"
import $ from "jquery";
import { connect } from "react-redux"
import Helmet from "react-helmet"
import Sidebar from "../common/sidebar";
import { Scrollbar } from "react-scrollbars-custom";
import { removeEmailReport, getEmailReport } from "../actions/users";
import Header from "../common/header";

  const initial = {
    add_user_model: false,
    title: "Add User",
    group_name:'',
    mail_search:'',
    selected: [],
    selectedItem: [],
  };

class EmailReportList extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
  }

  componentDidMount(){
    this.groupList();
    $('#sidebarToggleTop').on('click', function () {
      $('.sidebar-wrapper').toggleClass('toggled');
    })
    $('.sidbar-close').on('click', function () {
      $('.sidebar-wrapper').removeClass('toggled');
    })

    //

    $('.labelFocus input').change(function(){
      var $this = $(this);
      if($this.val())
          $this.addClass('filled')
      else
          $this.removeClass('filled')
      })
  }

  handleAddUser = (value) =>{
    this.setState({add_user_model: value,  title: "Add User"})
  }

  handleEditUser = (value) =>{
    this.setState({add_user_model: value, title: "Edit User" })
  }

  groupList = () =>{
      let data = {
        lender_Sfid: this.props.user_sfid
      }
    this.props.dispatch(getEmailReport(data))
  }

  handleRemoveReport = (id) =>{
    const { dispatch } = this.props
    let obj = {
        report_id: id,
    }
    dispatch(removeEmailReport(obj)).then((response)=>{
      if(response && response.status && response.status === "success")
      {   
          this.groupList();
      }
    });
  }

  render() {
    const { mail_search, group_name, selected } = this.state
    const {  isLoading, email_report_list } = this.props
    return (
        <>
        <Helmet>
            <title> Email Report </title>
        </Helmet>
        {isLoading?(
              <div className="loading">Loading&#8230;</div>
        ):''}
        <div id="wrapper">
    {/* Sidebar */}
    <Sidebar />
            <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Header
                title={'Email Report'}
                isSearchEnable={true}
                dispatch= {this.props.dispatch}
                page={"email_report"}
              />
            <div className="container-fluid">
            </div>
            <div className="container-fluid">
            <div className="row">
            <div className="col-md-12 pt-2">
                <div className="table-responsive dark_header">
                    <table className="table" id="dataTable" width="100%" cellSpacing={0}>
                        <thead>
                        <tr>
                            <th>
                            #
                            </th>
                            <th>Group Name</th>
                            <th>Participants</th>
                            <th>Reports</th>
                            <th>Reports Time Range</th>
                            <th>Configurations</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {email_report_list && email_report_list.length >0 && email_report_list.map((item,index)=>(
                        <tr key={`group-list-${index}`} className="shown">
                            <td>
                            {index+1}
                            </td>
                            <td>
                                <div className="d-flex align-items-center">
                                    <div className="pr_texts">
                                     <b className="d-block">{item.group_name}</b>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <b className="d-block">
                                    {item.email && item.email.length > 0 && (
                                    <ul>
                                        {item.email.map((item, index)=>(
                                            <li key={`email-list-${index}`}>{item.email}</li>
                                        ))}
                                    </ul>
                                    )}
                                </b>
                            </td>
                            <td>
                                <b className="d-block">
                                    {item.select_report}
                                </b>
                            </td>
                            <td>
                                <b className="d-block">
                                    {item.time_range}
                                </b>
                            </td>
                            <td>
                                <b className="d-block">
                                    {item.time_range}
                                </b>
                            </td>
                            <td>
                                <div className="btn_actions">
                                    <img className="cursor-point" onClick={() => this.handleRemoveReport(item.id)} src="img/icon_delete.svg" />
                                </div>
                            </td>
                        </tr>
                            ))}
                        </tbody>
                    </table>
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
    const { isLoading, user_id, user_sfid } = state.auth;
    const { email_report_list } = state.user
    return {
      email_report_list,
      isLoading,
      user_id,
      user_sfid
    };
}

export default connect(mapStateToProps)(EmailReportList);
