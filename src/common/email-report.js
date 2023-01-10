import React from "react";
import $ from 'jquery'
import { Modal, Button } from "react-bootstrap"
import { Scrollbar } from "react-scrollbars-custom";
import { connect } from "react-redux"
import { closeMailReport } from "../actions/model";
import { getGroupList, getGroupRecipient, clearGroupRecipient, createEmailReport, lender_lead_through_email_scheduler, lender_lead_through_email, groupEmailSearch, clearEmailSearch, createEmailGroup } from "../actions/users";

class EmailReport extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 1,
            timeRange: '',
            schedule: '',
            selected: [],
            mail_search: "",
            selectedGroup: null,
            selectedReport: [],
            group_name: "",
            selectedEmail: [],
            selectedWeek: null,
            selectedMonth: null,
            email_search: "",
            selectedItem: [],
            endDate: '',
            startDate: '',
            group_id_list: [],
            isError: false,
            errormsg: '',
            isInvalidDate: false,
            isValidDate: false,
        }
        this.handleGroup = this.handleGroup.bind(this);
    }

    componentDidMount() {
        let data = {
            lender_sfid: this.props.user_sfid
        }
        this.props.dispatch(getGroupList(data))
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevProps.email_search != this.props.email_search) {
            this.setState({ email_search: this.props.email_search })
        }
    }

    closeModel = () => {
        this.props.dispatch(closeMailReport());
    }

    onSelectTab = (value) => {
        $('#clear_btn').trigger('click')
        this.setState({ tab: value });
    }

    handleChangeTimeRange = (value) => {
        this.setState({ timeRange: value });
    }
    handleGroupSelect = (value) => {
        this.setState({ group_id: value }, () => {
        });
    }

    handleSchedule = (value) => {
        this.setState({ schedule: value, selectedMonth: '', selectedWeek: '' });
    }

    handleSelectWeek = (value) => {
        this.setState({ selectedWeek: value });
    }

    handleSelectMonth = (value) => {
        this.setState({ selectedMonth: value });
    }

    handleGroup = (event) => {
        console.log('eventevent', event)
        let selectedGrp = event.target.value;
        this.setState({ selectedGroup: selectedGrp });
        if (selectedGrp) {
            let obj = {
                group_id: selectedGrp
            }
            this.props.dispatch(getGroupRecipient(obj))
        } else {
            this.props.dispatch(clearGroupRecipient());
        }
    }

    handleSelectedReport = async (checked, report, id) => {
        let modifiedRow;
        let modifiedItem;
        if (checked) {
            modifiedRow = [...this.state.selected, id];
            modifiedItem = [...this.state.selectedReport, report];
        } else {
            modifiedRow = this.state.selected.filter(s => s !== id);
            modifiedItem = this.state.selectedReport.filter(s => s !== report);
        }
        this.setState({ selected: modifiedRow, selectedReport: modifiedItem });
    }

    onSelectClick = async (e, report, id) => {
        const selected = this.state.selected;
        const checked = e.target.checked;
        const isAllExist = selected.includes(1);
        if ((id == 1) || isAllExist) {
            const selected = this.state.selected;
            await Promise.all(selected.map((elament) => {
                let ref = 'ref_' + elament;
                this.refs[ref].checked = !this.refs[ref].checked;
            }));
            this.setState({ selected: [], selectedReport: [] }, () => {
                this.handleSelectedReport(checked, report, id);
            });
        } else {
            this.handleSelectedReport(checked, report, id);
        }

    };

    createGroup = (e) => {
        e.preventDefault()
        const { dispatch, user_sfid } = this.props
        let obj = {
            title: this.state.group_name,
            email: this.state.selectedItem,
            user_sfid: user_sfid,
        }

        const time_range = this.state.timeRange;

        let new_time_range = '';

        if (time_range == "Today") {
            new_time_range = "Daily"
        } else if (time_range == "Last 7 days") {
            new_time_range = "Weekly"
        } else if (time_range == "Last 30 days") {
            new_time_range = "Monthly"
        } else if (time_range == "Last quarter") {
            new_time_range = "Quarter"
        } else if (time_range == "Last Year") {
            new_time_range = "Yearly"
        } else if (time_range == "Custom Date") {
            new_time_range = "Custom"
        }

        dispatch(createEmailGroup(obj)).then((response) => {
            if (response && response.status && response.status === "success") {
                let new_groupId = response.rowData.group_id;
                this.setState({ isError: false, errormsg: '' })
                let report_obj = {
                    group_id: new_groupId,
                    email_recipient: this.state.selectedItem,
                    lender_sfid: this.props.user_sfid,
                    select_report: this.state.selectedReport.join(),
                    time_range: this.state.timeRange,
                    week_day: this.state.selectedWeek,
                    month_date: this.state.selectedMonth,
                    report_section: "Schedule Send"
                }

                this.props.dispatch(createEmailReport(report_obj)).then((response) => {
                    if (response && response.status == "success") {

                        // this.setState({selectedItem:[repsponse.rowData.group_id]})
                        this.setState({ isError: false, errormsg: '' })
                        if (this.state.selectedReport[0] == 'All Leads') {
                            let data = {};
                            data = {
                                "time_range": new_time_range,
                                "stage": 'All Leads',
                                "lender_sfid": localStorage.getItem('user_sfid'),
                                "groupId": new_groupId
                            }

                            this.props.dispatch(lender_lead_through_email_scheduler(data)).then((response) => {
                                if (response && response.status == "success") {
                                    this.setState({ isError: false, errormsg: '' })
                                    $('#clear_btn').trigger('click')
                                    this.closeModel();
                                }
                                else {
                                    this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                                }
                            }).catch(err => {
                                this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                            })
                        }
                        else {
                            let data = {};

                            data = {
                                "time_range": new_time_range,
                                "stage": this.state.selectedReport,
                                "lender_sfid": localStorage.getItem('user_sfid'),
                                "groupId": new_groupId
                            }

                            this.props.dispatch(lender_lead_through_email_scheduler(data)).then((response) => {
                                if (response && response.status == "success") {
                                    this.setState({ isError: false, errormsg: '' })
                                    $('#clear_btn').trigger('click')
                                    this.closeModel();
                                } else {
                                    this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                                }
                            }).catch(err => {
                                this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                            })
                        }
                    } else {
                        this.setState({ isError: true, errormsg: response.message })
                    }
                });
            } else {
                this.setState({ isError: true, errormsg: response.message })
            }
        });
    }
    handleClear = (e) => {
        e.preventDefault()
        this.setState({ selected: [], schedule: "", timeRange: "", group_id: "", email_search: [], selectedEmail: [], mail_search: "", group_name: "", selectedReport: [] }, () => {
            // this.closeModel()
        })

    }
    handlesubmit = async () => {
        let selectedRep = this.state.selectedReport;
        let obj = {
            email_recipient: this.state.selectedItem,
            lender_sfid: this.props.user_sfid,
            select_report: selectedRep.join(),
            time_range: this.state.timeRange,
            week_day: this.state.selectedWeek,
            month_date: this.state.selectedMonth,
            report_section: "Share Email"
        }

        const time_range = this.state.timeRange;

        let new_time_range = '';

        if (time_range == "Today") {
            new_time_range = "Daily"
        } else if (time_range == "Last 7 days") {
            new_time_range = "Weekly"
        } else if (time_range == "Last 30 days") {
            new_time_range = "Monthly"
        } else if (time_range == "Last quarter") {
            new_time_range = "Quarter"
        } else if (time_range == "Last Year") {
            new_time_range = "Yearly"
        } else if (time_range == "Custom Date") {
            new_time_range = "Custom"
        }


        this.props.dispatch(createEmailReport(obj)).then((response) => {
            if (response && response.status == "success") {
                this.setState({ isError: false, errormsg: '' })
                if (this.state.selectedReport.length > 0) {

                    if (this.state.selectedReport[0] == 'All Leads') {
                        let data = {};
                        if (this.state.timeRange == "Custom Date") {
                            data = {
                                "time_range": new_time_range,
                                "start_date": this.state.startDate,
                                "end_date": this.state.endDate,
                                "stage": 'All Leads',
                                "lender_sfid": localStorage.getItem('user_sfid'),
                                "email_recipient": this.state.selectedItem
                            }
                        } else {
                            data = {
                                "time_range": new_time_range,
                                "stage": 'All Leads',
                                "lender_sfid": localStorage.getItem('user_sfid'),
                                "email_recipient": this.state.selectedItem
                            }
                        }
                        this.props.dispatch(lender_lead_through_email(data)).then((response) => {
                            if (response && response.status == "success") {
                                this.setState({ isError: false, errormsg: '' })
                                $('#clear_btn').trigger('click');
                                this.closeModel();
                            } else {
                                this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                            }
                        }).catch(err => {
                            this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                        })
                    }
                    else {
                        let data = {};
                        let grpp = this.state.selectedItem.join(',')
                        if (this.state.timeRange == "Custom Date") {
                            data = {
                                "time_range": new_time_range,
                                "start_date": this.state.startDate,
                                "end_date": this.state.endDate,
                                "stage": this.state.selectedReport,
                                "lender_sfid": localStorage.getItem('user_sfid'),
                                "email_recipient": this.state.selectedItem
                            }
                        } else {
                            data = {
                                "time_range": new_time_range,
                                "stage": this.state.selectedReport,
                                "lender_sfid": localStorage.getItem('user_sfid'),
                                "email_recipient": this.state.selectedItem
                            }
                        }
                        this.props.dispatch(lender_lead_through_email(data)).then((response) => {
                            if (response && response.status == "success") {
                                this.setState({ isError: false, errormsg: '' })
                                $('#clear_btn').trigger('click');
                                this.closeModel();
                            } else {
                                this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                            }
                        }).catch(err => {
                            this.setState({ isError: true, errormsg: 'There was some error while sending email report' })
                        })
                    }
                }


            } else {
                this.setState({ isError: true, errormsg: response.message })
            }
        });
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    renderSearch = (getData) => {
        console.log('getDatagetData', getData)
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
                        <li className={className} key={`search-item${index}`} onClick={() => this.onSelectEmail(item)} >
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

    handleEmailSearch = (event) => {
        this.setState({ [event.target.name]: event.target.value });
        let str = event.target.value
        if (str && str.length > 2) {
            this.setState({ isEmail: true })
            if (this.ValidateEmail(str)) {
                let data = { search_name: str }
                this.props.dispatch(groupEmailSearch(data));
            }
        } else {
            this.setState({ isEmail: false })
            this.props.dispatch(clearEmailSearch());
        }
    }
    onSelectEmail = async (row) => {
        let modifiedRow;
        let modifiedItem;
        const getData = this.state.selectedItem;
        const checked = getData.includes(row.recipient_id);
        console.log("checked------>", checked);
        if (!checked) {
            modifiedRow = [...this.state.selectedEmail, row];
            modifiedItem = [...this.state.selectedItem, row.recipient_id];
        } else {
            modifiedRow = this.state.selectedEmail.filter(s => s !== row);
            modifiedItem = this.state.selectedItem.filter(s => s !== row.recipient_id);
        }
        this.setState({ selectedEmail: modifiedRow, selectedItem: modifiedItem , mail_search :'' , email_search:[]});
    };



    render() {
        const { open_email_report, group_list, group_recipient } = this.props

        const { tab, timeRange, schedule, selected, selectedEmail, email_search, selectedGroup, isValidDate, isInvalidDate, selectedWeek, selectedMonth, selectedReport, mail_search, group_name, selectedItem } = this.state
        // console.log('checkingggggggggggg', open_email_report)
        return (
            <Modal show={open_email_report} className="adduser modal right fade myModal" >
                <div className="modal-dialog" style={{ width: "90%" }}>
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="d-flex align-items-center justify-content-between mb-3">
                                <h3 className="mb-0 modalTitle ml-n3">Email Reports</h3>
                                <button type="button" onClick={this.closeModel} className="cs-btn"><img src="images/icons/icon-close2.png" /></button>
                            </div>
                            <div className="mb-3 ml-n3">
                                <button type="button" onClick={() => this.onSelectTab(1)} className={`export-btn mr-3 ${tab === 1 ? "black" : ""}`}>Share via Email</button>
                                <button type="button" onClick={() => this.onSelectTab(2)} className={`export-btn mr-3 ${tab === 2 ? "black" : ""}`}>Schedule Send</button>
                            </div>
                            <div className="ml-n3">
                                <div className={`input-group col-md-12 ml-n2 pb-2 ${this.state.tab == 2 ? '' : 'd-none'}`}>
                                    <input className="form-control py-2  border pl-5" type="text" id="example-search-input" name="group_name"
                                        value={group_name ? group_name : ''}
                                        onChange={this.handleChange} placeholder=" Enter group name" style={{ height: "46px", borderRadius: "10px 10px 10px 10px", outline: 0, boxShadow: "none" }} />
                                </div>
                                <div className="input-group col-md-12 ml-n2" style={{ width: "100%" }}>
                                    <span className="input-group-append">
                                        <button className="btn btn-outline-secondary border-right-0 border" type="button" style={{ height: "46px", borderRadius: "10px 0px 0px 10px" }}>
                                            <i className="fa fa-search"></i>
                                        </button>
                                    </span>
                                    <input className="form-control py-2 border-left-0 border " name="mail_search" value={mail_search ? mail_search : ''} onChange={this.handleEmailSearch} type="text" id="example-search-input" placeholder="Type name or email address" style={{ height: "46px", borderRadius: "0px 10px 10px 0px", outline: 0, boxShadow: "none" }} />
                                    {this.state.isEmail && !this.state.isEmailvalid && <div className="alert alert-danger w-100 py-1 px-4 mt-1">Invalid email ! Please try again with a valid email address.  </div>}

                                    {this.renderSearch(email_search)}
                                    <div className="row w-100 mt-2">

                                        {selectedEmail && selectedEmail.length > 0 && selectedEmail.map((item, index) => (
                                            <div key={`searc-email-${index}`} className="mb-1 col-12">
                                                {/* <Scrollbar style={{ height: 60, width: "100%" }}> */}
                                                {/* <div className="d-flex flex-wrap w-100"> */}
                                                {/* <div className="col-6"> */}
                                                    <div className="email-wrap mr-3 mb-2">
                                                        <span>{item.email}</span>
                                                        <button type="button" onClick={() => this.onSelectEmail(item)}>
                                                            <img src="images/x.svg" className="img-fluid"></img>
                                                        </button>
                                                    </div>
                                                {/* </div> */}
                                                {/* </div> */}
                                                {/* </Scrollbar> */}
                                            </div>
                                        ))}
                                    </div>
                                    {/* {selectedEmail && selectedEmail.length > 0 && group_name && (
                            <button type="submit" className="btn-black mb-4">
                                Submit
                            </button>
                        )} */}
                                </div>
                                {/* adding place holder*/}

                                {/* <div className="mb-3">
                                <select aria-label="Default select example" value={selectedGroup ? selectedGroup : ''} onChange={this.handleGroup} >
                                    <option value={''} selected="">Select Groups</option>
                                    {group_list && group_list.length > 0 && group_list.map((item, index) =>
                                        <option key={`group-${index}`} value={item.id}>{item.title}</option>
                                    )}
                                </select> */}
                            </div>
                            {/* <div className="mt-4">
                                <Scrollbar style={{ height: 100 }}>
                                    <div className="px-0">
                                        <div className="row pl-3 pr-1 ml-n3">
                                            {group_recipient && group_recipient.length > 0 && group_recipient.map((item, index) =>
                                                <div key={`email-${index}`} className="">
                                                    <div className="email-wrap pr-1"><span>{item.email}</span></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Scrollbar>
                            </div> */}
                            {/* 
                            <h5 className="font-weight-bold mt-4 mb-4 ml-n3">Select Group</h5>
                            <div className="row mt-4">
                                <div className="px-3">
                                    <div className="row">
                                        <ul className="checkboxes">
                                            {group_list && group_list.length > 0 && group_list.map((item, index) => (<li>
                                                <div className="custom_checkbox none">
                                                    <input type="radio" name="group" id="last_7" value={item.id} onClick={() => this.handleGroupSelect(item.id)} checked={this.state.group_id == item.id ? true : false} />
                                                    <label htmlFor="last_7">{item.title}</label>
                                                </div>
                                            </li>))}

                                        </ul>
                                    </div>
                                </div>
                            </div> */}


                            <h5 className="font-weight-bold mt-4 mb-4 ml-n3">Select Report</h5>
                            <div className="row mt-4">
                                <div className="px-3">
                                    <div className="row">
                                        <ul className="checkboxes">
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_1`} id="all_rep" checked={selected.includes(1)} onChange={e => this.onSelectClick(e, 'All Leads', 1)} />
                                                    <label htmlFor="all_rep">All Leads</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_2`} id="appro_pen" checked={selected.includes(2)} onChange={e => this.onSelectClick(e, 'Approval Pending', 2)} />
                                                    <label htmlFor="appro_pen">Approval Pending</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_3`} id="repayments" checked={selected.includes(3)} onChange={e => this.onSelectClick(e, 'Repayments', 3)} />
                                                    <label htmlFor="repayments">Repayments</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_4`} id="disbursed" checked={selected.includes(4)} onChange={e => this.onSelectClick(e, 'Disbursed', 4)} />
                                                    <label htmlFor="disbursed">Disbursed</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_5`} id="declined" checked={selected.includes(5)} onChange={e => this.onSelectClick(e, 'Declined', 5)} />
                                                    <label htmlFor="declined">Declined</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_6`} id="dispersal_pending" checked={selected.includes(6)} onChange={e => this.onSelectClick(e, 'Disbursement Pending', 6)} />
                                                    <label htmlFor="dispersal_pending">Disbursement Pending</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox">
                                                    <input type="checkbox" ref={`ref_7`} id="dropped" checked={selected.includes(7)} onChange={e => this.onSelectClick(e, 'Dropped', 7)} />
                                                    <label htmlFor="dropped">Dropped</label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <h5 className="font-weight-bold mt-4 mb-4 ml-n3">Time Range</h5>
                            <div className="row mt-4">
                                <div className="px-3">
                                    <div className="row">
                                        <ul className="checkboxes">
                                            <li>
                                                <div className="custom_checkbox none">
                                                    <input type="radio" name="timeRange" id="Today" value="Today" onClick={() => this.handleChangeTimeRange("Today")} checked={timeRange == "Today" ? true : false} />
                                                    <label htmlFor="Today">Today</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox none">
                                                    <input type="radio" name="timeRange" id="last_7" value="Last 7 days" onClick={() => this.handleChangeTimeRange("Last 7 days")} checked={timeRange == "Last 7 days" ? true : false} />
                                                    <label htmlFor="last_7">Last 7 days</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox none">
                                                    <input type="radio" name="timeRange" id="last_30" value="Last 30 days" onClick={() => this.handleChangeTimeRange("Last 30 days")} checked={timeRange == "Last 30 days" ? true : false} />
                                                    <label htmlFor="last_30">Last 30 days</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox none">
                                                    <input type="radio" name="timeRange" id="Last_quarter" value="Last quarter" onClick={() => this.handleChangeTimeRange("Last quarter")} checked={timeRange == "Last quarter" ? true : false} />
                                                    <label htmlFor="Last_quarter">Last quarter</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox none">
                                                    <input type="radio" name="timeRange" id="last_year" value="Last Year" onClick={() => this.handleChangeTimeRange("Last Year")} checked={timeRange == "Last Year" ? true : false} />
                                                    <label htmlFor="last_year">Last Year</label>
                                                </div>
                                            </li>
                                            <li>
                                                {/* <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="cust_date" value="Custom Date" onClick={()=>this.handleChangeTimeRange("Custom Date")} checked={timeRange=="Custom Date"?true:false}/>
                                        <label htmlFor="cust_date">Custom Date</label>
                                    </div> */}

                                                <div className={`custom_checkbox none ${this.state.tab == 2 ? 'd-none' : ''}`} >
                                                    <input type="radio" name="timeRange" id="cust_date" value="Custom Date" onClick={() => this.handleChangeTimeRange("Custom Date")} checked={timeRange == "Custom Date" ? true : false} />
                                                    <label htmlFor="cust_date">Custom Date</label>
                                                </div>
                                            </li>
                                        </ul>

                                        {timeRange == "Custom Date" && this.state.tab != 2 && (
                                            <>
                                                <h5 className="mb-3  ml-n1">Custom Date</h5>
                                                <div className="d-flex justify-content-start w-100">
                                                    <div className="col-sm-6">
                                                        <input type="date" id="startdate" placeholder="Start Date" className="dateR" onChange={(date) => {
                                                            this.setState({ startDate: date.target.value });
                                                            if (this.state.endDate != '') {

                                                                var stdt = Date.parse(date.target.value);
                                                                var edt = Date.parse(this.state.endDate);
                                                                if (new Date(stdt) > new Date(edt)) {
                                                                    this.setState({ isInvalidDate: true })
                                                                    this.setState({ isValidDate: false })
                                                                }
                                                                else {
                                                                    this.setState({ isInvalidDate: false })
                                                                    this.setState({ isValidDate: true })
                                                                }
                                                            }
                                                        }} />

                                                    </div>
                                                    <div className="col-sm-6">
                                                        <input type="date" id="enddate" placeholder="End Date" className="dateR" onChange={(date) => {
                                                            this.setState({ endDate: date.target.value });
                                                            if (this.state.startDate != '') {

                                                                var edt = Date.parse(date.target.value);
                                                                var stdt = Date.parse(this.state.startDate);
                                                                if (new Date(stdt) > new Date(edt)) {
                                                                    this.setState({ isInvalidDate: true })
                                                                    this.setState({ isValidDate: false })
                                                                } else {
                                                                    this.setState({ isInvalidDate: false })
                                                                    this.setState({ isValidDate: true })
                                                                }
                                                            }
                                                        }} />
                                                    </div>
                                                </div>
                                            </>)}
                                        {this.state.isInvalidDate &&
                                            <div className="alert alert-danger mt-1 py-1 w-100 mx-3">Invalid date selected !</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {tab === 2 && (
                                <>
                                    <h5 className="font-weight-bold mt-4 mb-4 ml-n3">Configure Schedule</h5>
                                    <div>
                                        <ul className="checkboxes">
                                            <li>
                                                <div className="custom_checkbox cursor-point none">
                                                    <input type="radio" value={'Daily'} name="schedule" onClick={() => this.handleSchedule('Daily')} checked={schedule == "Daily" ? true : false} />
                                                    <label htmlFor="">Daily</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox cursor-point none">
                                                    <input type="radio" value={'Weekly'} name="schedule" onClick={() => this.handleSchedule('Weekly')} checked={schedule == "Weekly" ? true : false} />
                                                    <label htmlFor="">Weekly</label>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="custom_checkbox cursor-point none">
                                                    <input type="radio" value={'Monthly'} name="schedule" onClick={() => this.handleSchedule('Monthly')} checked={schedule == "Monthly" ? true : false} />
                                                    <label htmlFor="">Monthly</label>
                                                </div>
                                            </li>
                                        </ul>
                                        {schedule == "Weekly" && (
                                            <div className="weekly  mt-3">
                                                <div onClick={() => this.handleSelectWeek('Mon')} className={`date-box ${selectedWeek == "Mon" ? "selected" : ""}`}>M</div>
                                                <div onClick={() => this.handleSelectWeek('Tue')} className={`date-box ${selectedWeek == "Tue" ? "selected" : ""}`}>T</div>
                                                <div onClick={() => this.handleSelectWeek('Wed')} className={`date-box ${selectedWeek == "Wed" ? "selected" : ""}`}>W</div>
                                                <div onClick={() => this.handleSelectWeek('The')} className={`date-box ${selectedWeek == "The" ? "selected" : ""}`}>T</div>
                                                <div onClick={() => this.handleSelectWeek('Fri')} className={`date-box ${selectedWeek == "Fri" ? "selected" : ""}`}>F</div>
                                                <div onClick={() => this.handleSelectWeek('Sat')} className={`date-box ${selectedWeek == "Sat" ? "selected" : ""}`}>S</div>
                                                <div onClick={() => this.handleSelectWeek('Sun')} className={`date-box ${selectedWeek == "Sun" ? "selected" : ""}`}>S</div>
                                            </div>
                                        )}

                                        {schedule == "Monthly" && (
                                            <div className="monthly mt-3">
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(1)} className={`date ${selectedMonth == 1 ? "selected" : ""}`} >1</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(2)} className={`date ${selectedMonth == 2 ? "selected" : ""}`}>2</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(3)} className={`date ${selectedMonth == 3 ? "selected" : ""}`}>3</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(4)} className={`date ${selectedMonth == 4 ? "selected" : ""}`}>4</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(5)} className={`date ${selectedMonth == 5 ? "selected" : ""}`}>5</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(6)} className={`date ${selectedMonth == 6 ? "selected" : ""}`}>6</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(7)} className={`date ${selectedMonth == 7 ? "selected" : ""}`}>7</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(8)} className={`date ${selectedMonth == 8 ? "selected" : ""}`}>8</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(9)} className={`date ${selectedMonth == 9 ? "selected" : ""}`}>9</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(10)} className={`date ${selectedMonth == 10 ? "selected" : ""}`}>10</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(11)} className={`date ${selectedMonth == 11 ? "selected" : ""}`}>11</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(12)} className={`date ${selectedMonth == 12 ? "selected" : ""}`}>12</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(13)} className={`date ${selectedMonth == 13 ? "selected" : ""}`}>13</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(14)} className={`date ${selectedMonth == 14 ? "selected" : ""}`}>14</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(15)} className={`date ${selectedMonth == 15 ? "selected" : ""}`}>15</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(16)} className={`date ${selectedMonth == 16 ? "selected" : ""}`}>16</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(17)} className={`date ${selectedMonth == 17 ? "selected" : ""}`}>17</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(18)} className={`date ${selectedMonth == 18 ? "selected" : ""}`}>18</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(10)} className={`date ${selectedMonth == 19 ? "selected" : ""}`}>19</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(20)} className={`date ${selectedMonth == 20 ? "selected" : ""}`}>20</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(21)} className={`date ${selectedMonth == 21 ? "selected" : ""}`}>21</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(22)} className={`date ${selectedMonth == 22 ? "selected" : ""}`}>22</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(23)} className={`date ${selectedMonth == 23 ? "selected" : ""}`}>23</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(24)} className={`date ${selectedMonth == 24 ? "selected" : ""}`}>24</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(25)} className={`date ${selectedMonth == 25 ? "selected" : ""}`}>25</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(26)} className={`date ${selectedMonth == 26 ? "selected" : ""}`}>26</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(27)} className={`date ${selectedMonth == 27 ? "selected" : ""}`}>27</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(28)} className={`date ${selectedMonth == 28 ? "selected" : ""}`}>28</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(29)} className={`date ${selectedMonth == 29 ? "selected" : ""}`}>29</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(30)} className={`date ${selectedMonth == 30 ? "selected" : ""}`}>30</div>
                                                </div>
                                                <div className="date-box">
                                                    <div onClick={() => this.handleSelectMonth(31)} className={`date ${selectedMonth == 31 ? "selected" : ""}`}>31</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="modalFooter">
                                {this.state.isError && <>
                                    <div className="alert alert-danger mt-1 py-1 w-100">{this.state.errormsg}</div>
                                </>}
                                <div className="row">
                                    <div className="col-sm-6"><button type="button" id="clear_btn" onClick={this.handleClear} className="w-100 export-btn">Clear</button></div>
                                    <div className="col-sm-6">
                                        <button type="button"

                                            disabled={timeRange && timeRange.length > 0 && selectedItem && selectedItem.length > 0 && selectedReport && selectedReport.length > 0 ?
                                                (timeRange === "Custom Date") ?
                                                    isValidDate ?
                                                        false : true
                                                    : tab == 2 ?
                                                        schedule.length > 0 && group_name.length > 0 ? false : true
                                                        : false
                                                : true}
                                            className={`w-100 export-btn 
                                                ${timeRange && timeRange.length > 0 && selectedItem && selectedItem.length > 0 && selectedReport && selectedReport.length > 0 ?
                                                    (timeRange === "Custom Date") ?
                                                        isValidDate ?
                                                            "black btn-dark" : "bg-secondary text-white"
                                                        : tab == 2 ?
                                                            schedule.length > 0 && group_name.length > 0 ? "black btn-dark" : "bg-secondary text-white"
                                                            : "black btn-dark"
                                                    : "bg-secondary text-white"}`}

                                            onClick={tab === 2 ? this.createGroup : this.handlesubmit}
                                        >{tab === 2 ? "Create Group" : "Send Email"}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
function mapStateToProps(state) {
    const { email_search, group_list } = state.user
    return {
        email_search,
        group_list

    };
}
export default connect(mapStateToProps)(EmailReport);