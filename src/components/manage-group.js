import React, { Component } from "react"
import $ from "jquery";
import { connect } from "react-redux"
import Helmet from "react-helmet"
import Sidebar from "../common/sidebar";
import { Scrollbar } from "react-scrollbars-custom";
import { removeEmailGroup, groupEmailSearch, clearEmailSearch, createEmailGroup, getGroupList } from "../actions/users";
import Header from "../common/header";

const initial = {
  add_user_model: false,
  title: "Add User",
  group_name: '',
  mail_search: '',
  selected: [],
  selectedItem: [],
  email_search: '',
};

class ManageGroup extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
    this.handleChange = this.handleChange.bind(this);
    this.handleEmailSearch = this.handleEmailSearch.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
  }


  componentDidUpdate(prevProps, prevState) {
    if (prevProps.email_search != this.props.email_search) {
      this.setState({ email_search: this.props.email_search })
    }
  }

  componentDidMount() {
    this.groupList();
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

  groupList = () => {
    let data = {
      lender_sfid: this.props.user_sfid
    }
    this.props.dispatch(getGroupList(data))
  }

  onSelectClick = async (row) => {
    let modifiedRow;
    let modifiedItem;
    const getData = this.state.selectedItem;
    const checked = getData.includes(row.recipient_id);
    console.log("checked------>", checked);
    if (!checked) {
      modifiedRow = [...this.state.selected, row];
      modifiedItem = [...this.state.selectedItem, row.recipient_id];
    } else {
      modifiedRow = this.state.selected.filter(s => s !== row);
      modifiedItem = this.state.selectedItem.filter(s => s !== row.recipient_id);
    }
    this.setState({ selected: modifiedRow, selectedItem: modifiedItem, mail_search: '', email_search: [] });
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
      title: this.state.group_name,
      email: this.state.selectedItem,
      user_sfid: user_sfid
    }
    dispatch(createEmailGroup(obj)).then((response) => {
      if (response && response.status && response.status === "success") {
        this.groupList();
      }
    });
  }

  handleRemoveGroup = (id) => {
    const { dispatch } = this.props
    let obj = {
      group_id: id,
    }
    dispatch(removeEmailGroup(obj)).then((response) => {
      if (response && response.status && response.status === "success") {
        this.groupList();
      }
    });
  }

  renderSearch = (getData) => {
    return getData && getData.length ? (
      <ul className="suggestions cursor-point">
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
    const { mail_search, group_name, selected, email_search } = this.state
    const { group_list, searchActive, searchArr } = this.props
    const tabledata = searchActive ? searchArr : group_list
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
                title={'Manage Group'}
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
                      Add Group
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
                              id="groupname"
                              placeholder=""
                              name="group_name"
                              value={group_name ? group_name : ''}
                              onChange={this.handleChange}
                            />
                            <span>Enter group name</span>
                          </div>
                          <div className="bor8 m-b-20 how-pos4-parent input-group labelFocus"
                          // onMouseLeave={this.handleSearchOut}
                          >
                            <input
                              type="text"
                              className="stext-111 cl2 plh3 size-116  p-r-15"
                              placeholder=""
                              name="mail_search"
                              value={mail_search ? mail_search : ''}
                              autoComplete={'off'}
                              onChange={this.handleEmailSearch}
                            />
                            <span>Search Email</span>
                          </div>
                          {this.renderSearch(email_search)}
                          <div className="row w-100 mt-2">

                            {selected && selected.length > 0 && selected.map((item, index) => (
                              <div key={`searc-email-${index}`} className="mb-1 col-12">
                                {/* <Scrollbar style={{height:60, width:"100%" }}>
                                        <div className="d-flex flex-wrap w-100"> */}
                                <div className="email-wrap mr-3 mb-2">
                                  <span>{item.email}</span>
                                  <button type="button" onClick={() => this.onSelectClick(item)}>
                                    <img src="images/x.svg" className="img-fluid"></img>
                                  </button>
                                </div>
                                {/* </div>
                                        </Scrollbar> */}
                              </div>
                            ))}
                          </div>
                          {selected && selected.length > 0 && group_name && (
                            <button type="submit" className="btn-black mb-4">
                              Submit
                            </button>
                          )}
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row align-items-center">
                  <div className="col-md-9">
                    <h1 className="table-title mb-3">
                      Group List
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
                            <th>Group Name</th>
                            <th>Emails</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabledata && tabledata.length > 0 ? tabledata.map((item, index) => (
                            <tr key={`group-list-${index}`} className="shown">
                              <td>
                                {index + 1}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="pr_texts">
                                    <b className="d-block">{item.title}</b>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <b className="d-block">
                                  {item && item.email &&
                                  
                                    item.email.length > 0 && (
                                      <ul>
                                        {item.email.map((item, index) => (
                                          <li key={`email-list-${index}`}>{item && item.email}</li>
                                        ))}
                                      </ul>
                                    )
                                  
                                  }
                                </b>
                              </td>
                              <td>
                                <div className="btn_actions">
                                  {/* <button type="button" className="mr-2 cursor-point" onClick={() => this.handleRemoveGroup(item.id)}><img src="img/icon_edit.svg" /></button> */}
                                  <img className="cursor-point" onClick={() => this.handleRemoveGroup(item.id)} src="img/icon_delete.svg" />
                                </div>
                              </td>
                            </tr>
                          ))
                            : <p style={{ marginTop: "15px" }}>No record found</p>
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
  const { email_search, group_list, searchArr } = state.user
  const { searchActive } = state.model;
  return {
    email_search,
    group_list,
    user_id,
    user_sfid,
    searchArr,
    searchActive
  };
}

export default connect(mapStateToProps)(ManageGroup);
