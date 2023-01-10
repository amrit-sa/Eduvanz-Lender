import React, { Component } from "react"
import $, { map } from "jquery";
import { connect } from "react-redux"
import { Modal, Button, Form } from "react-bootstrap"
import Helmet from "react-helmet"
import Header from "../common/header";
import Sidebar from "../common/sidebar";
import { Scrollbar } from "react-scrollbars-custom";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { getLenderList, getRoleList, createUser, editUser, removeUser } from "../actions/users";
import { closeAddUser, lender_user_edit } from "../actions/model";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initial = {
  add_user_model: false,
  title: "Add User",
  selectedItem: [],
  selectedRole: '',
  selectedRole_id: '',
  fname: '',
  lname: '',
  email: '',
  mobile: '',
  lender_user_edit: false,
  selected_user_id: '',
  addUserErr: '',
  showAddUserErr: false,
  editUserErr: '',
  showEditUserErr: false,
  errorMsg: '',
  errorField: '',
  deleteUserId: null,
  deleteErr: '',
  showDeleteErr: false,
  isEmail: false,
  isEmailvalid: false,
  roles: [
    {
      id: 1,
      role_name__c: 'Admin'
    },

    {
      id: 2,
      role_name__c: 'Other users'
    },
  ],
  Departments: [
    {
      id: 1,
      name: "Credit"
    },
    {
      id: 2,
      name: "Operations"
    },
    {
      id: 3,
      name: "Collections"
    }
  ],
  selectedDep: '',
  user_list: []
};

class ManageRole extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
    this.onValueChange = this.onValueChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { dispatch, user_sfid, user_id } = this.props
    console.log('sfid', user_sfid);
    console.log('id', user_id);

    let data = {
      user_sfid: user_sfid
    }
    // let data = {
    //     user_sfid: user_id
    //  }

    dispatch(getLenderList(data)).then((response) => {
      if (response.status === 'success') {

        this.setState({ user_list: response.data })
      }


    });
    dispatch(getRoleList());
    $('#sidebarToggleTop').on('click', function () {
      $('.sidebar-wrapper').toggleClass('toggled');
    })
    $('.sidbar-close').on('click', function () {
      $('.sidebar-wrapper').removeClass('toggled');
    })
  }

  handleCloseAddUser = () => {
    // document.getElementById('flexCheckChecked').checked = false;
    // document.getElementById('flexCheckDefault').checked = false;
    this.setState(initial);
    this.props.dispatch(closeAddUser());
  }



  handleSubmit = (e) => {
    e.preventDefault();
    const { dispatch, user_sfid } = this.props
    let data = {
      name: this.state.fname + " " + this.state.lname,
      user_sfid: user_sfid,
      email: this.state.email,
      mobile: this.state.mobile,
      department: this.state.selectedDep,
      role: this.state.selectedRole,
    }
    dispatch(createUser(data)).then((response) => {
      if (response && response.status && response.status === "success") {
        let obj = {
          user_sfid: user_sfid
        }
        dispatch(getLenderList(obj));
        this.handleCloseAddUser();
        this.setState(initial);
        // window.swal('success')
        toast.success("User created successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        })
      } else {
        if (response && response.status && response.fieldname && response.status === "error") {
          this.setState({ errorMsg: response.message, errorField: response.fieldname })
        }
        if (response && response.status && !response.fieldname && response.status === "error")
          this.setState({ addUserErr: response.message, showAddUserErr: true });
      }
    });
  }

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   const { dispatch, user_sfid } = this.props
  //   let data = {
  //     first_name: this.state.fname,
  //     last_name: this.state.lname,
  //     user_sfid: user_sfid,
  //     email: this.state.email,
  //     mobile: this.state.mobile,
  //     role_id: this.state.selectedRole_id,
  //     permissions: this.state.selectedItem,
  //   }
  //   dispatch(createUser(data)).then((response) => {
  //     if (response && response.status && response.status === "success") {
  //       let obj = {
  //         user_sfid: user_sfid
  //       }
  //       dispatch(getLenderList(obj));
  //       this.handleCloseAddUser();
  //       this.setState(initial);
  //     } else {
  //       if (response && response.status && response.status === "error") {
  //         this.setState({ errorMsg: response.message, errorField: response.fieldname })
  //       }
  //     }
  //   });
  // }

  handleEditUser = (value) => {
    const { dispatch, user_sfid, lenders } = this.props
    console.log("here at Edit User", value);
    this.setState({ lender_user_edit: true })
    dispatch(lender_user_edit());
    this.setState({ id: value, title: "Edit User" })

    const selected_user = lenders.find((user) => {
      return user.id === value;
    })
    console.log(selected_user)
    const { name__c, last_name__c, email__c, mobile__c, select_user__c, role_id, id, sfid, department__c } = selected_user;

    this.setState({
      fname: name__c,
      // lname: last_name__c,
      email: email__c,
      mobile: mobile__c,
      selectedRole: select_user__c,
      selectedDep: department__c,
      selected_user_id: id,
      isEmail: true,
      isEmailvalid: true
    })
  }
  // "lender_user_id": 186,
  // "role": 7

  handleEditSubmit = (e) => {
    e.preventDefault();
    const { dispatch, user_sfid } = this.props
    let data = {
      name: this.state.fname,
      mobile: this.state.mobile,
      email: this.state.email,
      lender_sfid: user_sfid,
      lender_user_id: this.state.selected_user_id,
      department: this.state.selectedDep,
      role: this.state.selectedRole,
    }
    dispatch(editUser(data)).then((response) => {
      let obj = {
        user_sfid: user_sfid
      }
      this.setState(initial);
      dispatch(getLenderList(obj));
    }).catch((err) => {

      this.setState({ errorMsg: err })

    })
    this.handleCloseEditUser();

  }

  handleCloseEditUser = () => {
    // document.getElementById('flexCheckChecked').checked = false;
    // document.getElementById('flexCheckDefault').checked = false;
    this.setState(initial);
    this.setState({ lender_user_edit: false })
  }
  /*handleEditUser = (id) => {
     const { dispatch, user_sfid } = this.props
     let obj = {
       user_id: id,
   }

   email__c: "sajan.singh@eduvanz.com"
first_name__c: "Sachin"
id: 267
last_name__c: "Patil"
name: null
phone: "8554087726"
roles: "Credit"
sfid: null

  }*/

  handleDeleteUser = (id) => {
    const { dispatch, user_sfid } = this.props
    let obj = {
      user_id: id,
    }


    dispatch(removeUser(obj)).then((response) => {
      if (response && response.status && response.status === "success") {
        let lobj = {
          user_sfid: user_sfid
        }
        document.getElementById('closedelet').click();
        dispatch(getLenderList(lobj));
        this.setState({ showDeleteErr: false, deleteErr: '', deleteUserId: null })
      } else {
        if (response && response.status && response.status === "error") {
          this.setState({ showDeleteErr: true, deleteErr: response.message })

        }
      }
    });
  }



  onValueChange = (e) => {
    console.log(e.target.value, "aaaaaaaaaaa")
    // this.setState({ selectedRole_id: e.target.value });
    this.setState({ selectedRole: e.target.value });

  }

  onDepChange = (e) => {
    this.setState({ selectedDep: e.target.value });

  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleEmailSearch = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let str = event.target.value
    if (str && str.length > 2) {
      this.setState({ isEmail: true })
      this.ValidateEmail(str)
    } else {
      this.setState({ isEmail: false })
    }
  }

  ValidateEmail(mail) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mail.match(mailformat)) {
      this.setState({ isEmailvalid: true })
      return true;
    }
    else {
      this.setState({ isEmailvalid: false })
      return false;
    }
  }

  onSelectClick = async (value) => {
    let modifiedRow;
    let modifiedItem;
    const getData = this.state.selectedItem;
    const checked = getData.includes(value);
    if (!checked) {
      modifiedItem = [...this.state.selectedItem, value];
    } else {
      modifiedItem = this.state.selectedItem.filter(s => s !== value);
    }
    this.setState({ selected: modifiedRow, selectedItem: modifiedItem });
  };




  render() {
    const { lenders, open_add_user, isLoading, searchActive, searchArr } = this.props
    const { title, roles, mobile, email, fname, lname, selectedRole, selectedItem, selectedRole_id, lender_user_edit } = this.state
    const button = fname && lname && email && mobile && selectedRole_id && selectedItem.length > 0 ? false : true;
    const tabledata = searchActive ? searchArr : lenders

    return (
      <>
        <Helmet>
          <title> Manage Role </title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}
        <div id="wrapper">
          {/* Sidebar */}
          <Sidebar />
          <div id="content-wrapper" className="d-flex flex-column">
            <Header
              title={'Manage Role'}
              isSearchEnable={true}
              isBackEnable={true}
              isAddUser={true}
              dispatch={this.props.dispatch}
              isManageFilter={true}
            />
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover={false}
            />
            <div id="content">

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
                            <th>User Name</th>
                            <th>Contact details</th>
                            <th>Assigned Roles</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tabledata && tabledata.length > 0 ? tabledata.map((item, index) =>
                            <tr key={`item-user-${index}`} className="shown">
                              <td>
                                {index + 1}
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="pr_img">
                                    <img
                                      className="img-profile rounded-circle"
                                      src="img/undraw_profile.svg"
                                    />
                                  </div>
                                  <div className="pr_texts">
                                    <b className="d-block">{item.name__c && item.name__c} </b>
                                    
                                  </div>
                                  <OverlayTrigger 
                                                                        key={'right'}
                                                                        placement={'right'}
                                                                        overlay={
                                                                            <Tooltip >
                                                                                {item.select_user__c}
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <img src="images/icons/info.png" className="pl-3" />
                                                                    </OverlayTrigger>
  
                                </div>
                               
                               </td>

                              <td>
                                <b className="d-block">
                                  {item.email__c}
                                </b>
                                <span className="date">{item.phone}</span>
                              </td>

                              <td><b>{item.select_user__c}</b></td>

                              <td>
                                <div className="btn_actions">
                                  {/* <button type="button"  onClick={() => this.handleEditUser(item.id)}><img src="img/icon_edit.svg" /></button> */}
                                  <a href="#" onClick={() => this.handleEditUser(item.id)}>  <img src="img/icon_edit.svg" /> </a>

                                  {/* <a href="#" onClick={() => this.handleDeleteUser(item.id)} data-toggle="modal" data-target="#openDeletePopup">  <img src="img/icon_delete.svg" /> </a> */}
                                  <a href="#" onClick={() => this.setState({ deleteUserId: item.id })} data-toggle="modal" data-target="#openDeletePopup">  <img src="img/icon_delete.svg" /> </a>
                                  {/* <a href="#" >      <img src="img\edit_20.png" /></a> */}

                                </div>
                              </td>
                            </tr>
                          )
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
        {/* Add User modal */}

        <Modal show={open_add_user} className="modal right fade myModal" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="d-flex align-items-center justify-content-between" style={{ margin: "15px 30px" }}>
                <h3 className="font-weight-bold">{title}</h3>
                <button type="button" className="cs-btn" onClick={this.handleCloseAddUser}><img src="images/icons/icon-close2.png"></img></button>
              </div>
              <Scrollbar style={{ height: "88vh" }}>
                <form onSubmit={this.handleSubmit}>

                  <div className="modal-body">

                    <div className='mt-2'>
                      <div className='input-style2 mb-2'>
                        <label>Name</label>
                        <input type="text" onChange={this.handleChange} name="fname" value={fname ? fname : ''} placeholder='' />
                      </div>
                      {this.state.errorField == 'first_name' ? <div className="form-group">
                        <div className={"alert alert-danger"} role="alert">
                          {this.state.errorMsg}
                        </div>
                      </div> : ""}

                      {/* <div className='input-style2 mb-2'>
                        <label>Last Name</label>
                        <input type="text" onChange={this.handleChange} name="lname" value={lname ? lname : ''} placeholder='' />
                      </div>
                      {this.state.errorField == 'last_name' ? <div className="form-group">
                        <div className={"alert alert-danger"} role="alert">
                          {this.state.errorMsg}
                        </div>
                      </div> : ""} */}
                      <h5 className='mt-2 mb-2 font-weight-bold'>Contact Details</h5>
                      <div className='input-style2 mb-2'>
                        <label>Email Address</label>
                        <input type="email" onChange={this.handleEmailSearch} name="email" value={email ? email : ''} placeholder='' />
                      </div>
                      {this.state.isEmail && !this.state.isEmailvalid ? <div className="form-group">
                        <div className={"alert alert-danger"} role="alert">
                          Invalid email ! Please enter a valid email address.
                        </div>
                      </div> : ""}
                      <div className='input-style2 mb-2'>
                        <label>Mobile Number</label>
                        <input type="text" onChange={this.handleChange} name="mobile" value={mobile ? mobile : ''} placeholder='' maxLength={10} />
                      </div>
                      {this.state.errorField == 'mobile' ? <div className="form-group">
                        <div className={"alert alert-danger"} role="alert">
                          {this.state.errorMsg}
                        </div>
                      </div> : ""}
                      <h5 className='mt-2 mb-2 font-weight-bold'>Assign Roles</h5>
                      <p>Select User Type</p>
                      {this.state.roles && this.state.roles.length > 0 && this.state.roles.map((items, index) =>
                        <div key={`role-items-${index}`} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={items.role_name__c}
                            onChange={this.onValueChange}
                            name="flexRadioDefault"
                            id={`role-id-${index}`}
                          />
                          <label className="form-check-label" htmlFor={`role-id-${index}`}>
                            {items.role_name__c}
                          </label>
                        </div>
                      )}
                      <h5 className='mt-2 mb-2 font-weight-bold'>Admin Controls</h5>
                      {this.state.Departments && this.state.Departments.length > 0 && this.state.Departments.map((items, index) =>
                        <div key={`role-items-${index}`} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={items.name}
                            onChange={this.onDepChange}
                            name="depRadioDefault"
                            id={`dep-id-${index}`}
                          />
                          <label className="form-check-label" htmlFor={`dep-id-${index}`}>
                            {items.name}
                          </label>
                        </div>
                      )}

                    </div>

                  </div>
                  {this.state.showAddUserErr && <div className="px-4 py-2 text-danger">{this.state.addUserErr}</div>}
                  <div className='px-4 py-2'>
                    <div className='row'>
                      <div className='col-6'><button type="button" onClick={this.handleCloseAddUser} className='btn-white w-100'>Cancel</button></div>
                      <div className='col-6'>
                        <button
                          type="submit"
                          className={`${fname && this.state.isEmail && this.state.isEmailvalid && mobile && selectedRole.length > 0 && this.state.selectedDep.length > 0 ? 'btn-black' : ''} w-100`}
                          disabled={fname && this.state.isEmail && this.state.isEmailvalid && mobile && selectedRole.length > 0 && this.state.selectedDep.length > 0 ? false : true}
                        >Save</button>
                      </div>
                    </div>
                  </div>
                </form>
              </Scrollbar>
            </div>
          </div>
        </Modal>
        {<Modal show={lender_user_edit} className="modal right fade myModal" >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="d-flex align-items-center justify-content-between" style={{ margin: "15px 30px" }}>
                <h3 className="font-weight-bold">{title}</h3>
                <button type="button" className="cs-btn" onClick={this.handleCloseEditUser}><img src="images/icons/icon-close2.png"></img></button>
              </div>
              <Scrollbar style={{ height: "88vh" }}>
                <form onSubmit={this.handleEditSubmit}>

                  <div className="modal-body">

                    {/* <div className='mt-2'> */}
                    <div>
                      <div className='input-style2 mb-2'>
                        <label>Name</label>
                        <input type="text" onChange={this.handleChange} name="fname" value={fname ? fname : ''} placeholder='' />
                      </div>
                      {/* <div className='input-style2 mb-2'>
                        <label>Last Name</label>
                        <input type="text" onChange={this.handleChange} name="lname" value={lname ? lname : ''} placeholder='' />
                      </div> */}
                      <h5 className='mt-2 mb-2 font-weight-bold'>Contact Details</h5>
                      <div className='input-style2 mb-2'>
                        <label>Email Address</label>
                        <input type="email" onChange={this.handleEmailSearch} name="email" value={email ? email : ''} placeholder='' />
                      </div>
                      {this.state.isEmail && !this.state.isEmailvalid ? <div className="form-group">
                        <div className={"alert alert-danger"} role="alert">
                          Invalid email ! Please enter a valid email address.
                        </div>
                      </div> : ""}
                      <div className='input-style2 mb-2'>
                        <label>Mobile Number</label>
                        <input type="text" onChange={this.handleChange} name="mobile" value={mobile ? mobile : ''} placeholder='' />
                      </div>
                      <h5 className='mt-2 mb-2 font-weight-bold'>Assign Roles</h5>
                      <p>Select User Type</p>
                      {this.state.roles && this.state.roles.length > 0 && this.state.roles.map((items, index) =>
                        <div key={`role-items-${index}`} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={items.role_name__c}
                            defaultChecked={selectedRole === items.role_name__c}
                            onChange={this.onValueChange}
                            name="flexRadioDefault"
                            id={`item-id-${index}`}
                          />
                          <label className="form-check-label" htmlFor={`item-id-${index}`}>
                            {items.role_name__c}
                          </label>
                        </div>
                      )}
                      <h5 className='mt-2 mb-2 font-weight-bold'>Admin Controls</h5>

                      {this.state.Departments && this.state.Departments.length > 0 && this.state.Departments.map((items, index) =>
                        <div key={`role-items-${index}`} className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            value={items.name}
                            defaultChecked={this.state.selectedDep === items.name}
                            onChange={this.onDepChange}
                            name="depRadioDefault"
                            id={`dep-id-${index}`}
                          />
                          <label className="form-check-label" htmlFor={`dep-id-${index}`}>
                            {items.name}
                          </label>
                        </div>
                      )}

                      {/* <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue="1"
                          onClick={() => this.onSelectClick('1')}
                          defaultChecked={selectedItem.includes('1')}
                          id="flexCheckDefault"
                        />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          Add/Edit User
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue="2"
                          id="flexCheckChecked"
                          onClick={() => this.onSelectClick('2')}
                          defaultChecked={selectedItem.includes('2')}
                        />
                        <label className="form-check-label" htmlFor="flexCheckChecked">
                          Delete User
                        </label>
                      </div> */}
                    </div>

                  </div>
                  {this.state.showEditUserErr && <div className="px-4 py-2 text-danger">{this.state.editUserErr}</div>}
                  <div className='px-4 py-2'>
                    <div className='row'>
                      <div className='col-6'><button type="button" onClick={this.handleCloseEditUser} className='btn-white w-100'>Cancel</button></div>
                      <div className='col-6'>
                        <button
                          type="submit"
                          className={`${fname && this.state.isEmail && this.state.isEmailvalid && mobile && selectedRole.length > 0 && this.state.selectedDep.length > 0 ? 'btn-black' : ''} w-100`}
                          disabled={fname && this.state.isEmail && this.state.isEmailvalid && mobile && selectedRole.length > 0 && this.state.selectedDep.length > 0 ? false : true}
                        >Save</button>
                      </div>
                    </div>
                  </div>
                </form>
              </Scrollbar>
            </div>
          </div>
        </Modal>}

        {/* delete user popup start */}

        <div className="modal" tabindex="-1" role="dialog" id='openDeletePopup'>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-body pt-5">
                <h5>Do you want to delete this user?</h5>
                {this.state.showDeleteErr && <p className="text-danger mt-5">{this.state.deleteErr}</p>}

              </div>
              <div className="modal-footer">
                <button type="button" id='closedelet' className="btn btn-white" data-dismiss="modal" onClick={() => this.setState({ showDeleteErr: false, deleteErr: '', deleteUserId: null })}>Cancel</button>
                <button type="button" className="btn btn-dark" onClick={() => this.handleDeleteUser(this.state.deleteUserId)}>Delete</button>
              </div>
            </div>
          </div>
        </div>





        {/* delete user popup end */}

      </>

    );
  }
}

function mapStateToProps(state) {
  const { user_sfid, isLoading, user_id } = state.auth;
  const { lenders, searchArr, roles } = state.user;
  const { open_add_user, searchActive, lender_user_edit } = state.model;
  return {
    lender_user_edit,
    open_add_user,
    isLoading,
    lenders,
    user_sfid,
    roles,
    user_id,
    searchArr,
    searchActive
  };
}

export default connect(mapStateToProps)(ManageRole);