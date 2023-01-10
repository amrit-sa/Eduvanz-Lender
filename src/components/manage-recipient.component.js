import React, { Component } from "react"
import $ from "jquery";
import { connect } from "react-redux"
import Helmet from "react-helmet"
import Sidebar from "../common/sidebar";
import { Scrollbar } from "react-scrollbars-custom";
import { removeEmailRecipient, groupEmailSearch, clearEmailSearch, addEmailRecipient, getRecipientList } from "../actions/users";
import Header from "../common/header";

const initial = {
  add_user_model: false,
  title: "Add User",
  email: '',
  mail_search: '',
  selected: [],
  selectedItem: [],
  mail_err: '',
};

class ManageRecipient extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
    this.handleChange = this.handleChange.bind(this);
    this.handleEmailSearch = this.handleEmailSearch.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }

  componentDidMount() {
    this.emailList();
    $('#sidebarToggleTop').on('click', function () {
      $('.sidebar-wrapper').toggleClass('toggled');
    })
    $('.sidbar-close').on('click', function () {
      $('.sidebar-wrapper').removeClass('toggled');
    })

    //

    $('.labelFocus input').change(function () {
      var $this = $(this);
      if ($this.val())
        $this.addClass('filled')
      else
        $this.removeClass('filled')
    })

  }

  handleAddUser = (value) => {
    this.setState({ add_user_model: value, title: "Add User" })
  }

  handleEditUser = (value) => {
    this.setState({ add_user_model: value, title: "Edit User" })
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  emailList = () => {
    let data = {
      user_sfid: this.props.user_sfid
    }
    this.props.dispatch(getRecipientList(data))
  }

  onSelectClick = async (row) => {
    let modifiedRow;
    let modifiedItem;
    const getData = this.state.selectedItem;
    const checked = getData.includes(row.email);
    console.log("checked------>", checked);
    if (!checked) {
      modifiedRow = [...this.state.selected, row];
      modifiedItem = [...this.state.selectedItem, row.email];
    } else {
      modifiedRow = this.state.selected.filter(s => s !== row);
      modifiedItem = this.state.selectedItem.filter(s => s !== row.email);
    }
    this.setState({ selected: modifiedRow, selectedItem: modifiedItem });
  };

  handleEmailSearch = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let str = event.target.value
    if (str && str.length > 2) {
      let data = { search_name: str }
      this.props.dispatch(groupEmailSearch(data));
    } else {
      this.props.dispatch(clearEmailSearch());
    }
  }

  handleSearchOut = () => {
    this.props.dispatch(clearEmailSearch());
  }

  handleLoginSubmit = (e) => {
    e.preventDefault()
    const { dispatch, user_sfid } = this.props
    let obj = {
      email: this.state.email,
      user_sfid: user_sfid
    }
    dispatch(addEmailRecipient(obj)).then((response) => {
      if (response && response.status && response.status === "success") {
        this.setState({ email: "", mail_err: "" });
        this.emailList();
      }
      else {
        this.setState({ mail_err: response.message });
      }
    });
  }

  handleRemoveEmail = (id) => {
    const { dispatch } = this.props
    let obj = {
      recipient_id: id,
    }
    dispatch(removeEmailRecipient(obj)).then((response) => {
      if (response && response.status && response.status === "success") {
        this.emailList();
      }
    });
  }

  renderSearch = (getData) => {
    return getData && getData.length ? (
      <ul className="suggestions">
        {getData.map((item, index) => {
          let className;
          const getData = this.state.selectedItem;
          const isExist = getData.includes(item.email);
          // Flag the active suggestion with a class
          if (isExist) {
            className = "suggestion-active";
          }
          return (
            <li className={className} key={`search-item${index}`} onClick={() => this.onSelectClick(item)} >
              {item.email}
            </li>
          );
        })}
      </ul>
    ) : ('');
    {/* <div className="no-suggestions">
        <em>Search not found</em>
      </div> */}
  };

  render() {
    const { mail_search, email, selected } = this.state
    const { email_search, email_list,searchActive, searchArr } = this.props
    const tabledata = searchActive ? searchArr : email_list
    return (
      <>
        <Helmet>
          <title> Manage Group </title>
        </Helmet>
        <div id="wrapper">
          {/* Sidebar */}
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <div id="content">
              <Header
                title={'Manage Recipient'}
                isSearchEnable={true}
                dispatch={this.props.dispatch}
                isManageFilter={true}
              />
              <div className="container-fluid leads_header">
                <div className="row align-items-center">
                  <div className="col-md-9">
                    <h1>
                      <button id="sidebarToggleTop" className="d-lg-none rounded-circle mr-3">
                        <i className="fa fa-bars" />
                      </button>
                      Add Recipient
                    </h1>
                  </div>
                </div>
              </div>
              <div className="container-fluid">

                <div className="row">
                  <div className="col-12">
                    <div className="bor10 flex-w flex-col-m p-lr-93 p-tb-30 p-lr-15-lg w-full-md login-form-img">
                      <div className="lendar_centered">
                        <form onSubmit={this.handleLoginSubmit} >
                          <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus">
                            {/* <label htmlFor="groupname">Group Name:</label> */}
                            <input
                              type="text"
                              className="stext-111 cl2 plh3 size-116  p-r-15"
                              id="email"
                              placeholder=""
                              name="email"
                              value={email ? email : ''}
                              onChange={this.handleChange}
                            />
                            <span>Enter Email</span>
                          </div>
                          <span style={{ color: "red" }}>{this.state.mail_err}</span>
                          {/* <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus" 
                                onMouseLeave={this.handleSearchOut}>
                            <input
                                type="text"
                                className="stext-111 cl2 plh3 size-116  p-r-15"
                                placeholder=""
                                name="mail_search"
                                value={mail_search?mail_search:''}
                                autoComplete={'off'}
                                onChange={this.handleEmailSearch}
                            />
                            <span>Search Email</span>
                            {this.renderSearch(email_search)}
                            
                            {selected && selected.length > 0 && selected.map((item,index)=>(
                                    <div key={`searc-email-${index}`} className="mb-3 w-100">
                                      <Scrollbar style={{height:60, width:"100%" }}>
                                        <div className="d-flex flex-wrap w-100">
                                          <div className="email-wrap mr-3 mb-2">
                                              <span>{item.email}</span>
                                              <button type="button" onClick={()=>this.onSelectClick(item)}>
                                                  <img src="images/x.svg" className="img-fluid"></img> 
                                              </button>
                                          </div>
                                        </div>
                                        </Scrollbar>
                                    </div>
                                    ))}
                        </div> */}
                          <div>
                            {email && (
                              <button type="submit" className="btn-black mb-4">
                                Submit
                              </button>
                            )}
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-md-9">
                    <h1 className="table-title mb-3">
                      Recipient List
                    </h1>
                  </div>
                </div>

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
                            <th>Email</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabledata && tabledata.length > 0 ? tabledata.map((item, index) => (
                            <tr key={`email-list-${index}`} className="shown">
                              <td>
                                {index + 1}
                              </td>

                              <td>
                                <b className="d-block">
                                  {item.email}
                                </b>
                              </td>
                              <td>
                                <div className="btn_actions">
                                  {/* <button type="button" className="mr-2 cursor-point" onClick={() => this.handleRemoveGroup(item.id)}><img src="img/icon_edit.svg" /></button> */}
                                  <img className="cursor-point" onClick={() => this.handleRemoveEmail(item.recipient_id)} src="img/icon_delete.svg" />
                                  {/* <span>  <img className="cursor-point"  src="img\edit_20.png" /></span> */}
                                </div>

                              </td>
                             
                            </tr>
                          ))
                          : <p style={{marginTop:"15px"}}>No record found</p>
                        }
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
  const { user_id, user_sfid } = state.auth;
  const { email_search, email_list, searchArr } = state.user
  const { searchActive } = state.model;
  return {
    email_search,
    email_list,
    user_id,
    user_sfid,
    searchArr,
    searchActive
  };
}

export default connect(mapStateToProps)(ManageRecipient);
