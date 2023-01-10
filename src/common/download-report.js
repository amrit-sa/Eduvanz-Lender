import React, { Component } from 'react'
import { Modal, Button } from "react-bootstrap"
import { closeDownloadReport } from '../actions/model'
import jsPDF from 'jspdf'
import { CSVLink } from "react-csv"
import { connect } from "react-redux";
import moment from 'moment';
import { getLeads } from '../actions/users'
import "jspdf-autotable";

const initaiaState = {
    selected: [],
    selectedReport: [],
    timeRange: '',
    download_leads: [],
    validtime: null
}

class DownloadReport extends Component {
    csvLink = React.createRef()
    constructor(props) {
        super(props);
        this.state = initaiaState;

    }

    clearstate = () => {
        this.setState({
            selected: [],
            selectedReport: [],
            timeRange: '',
            download_leads: [],
            validtime: null
        })
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







    closeModel = () => {
        this.clearstate()
        this.props.dispatch(closeDownloadReport());
    }

    handleChangeTimeRange = (value) => {
        this.setState({ timeRange: value });

        if (value != 'Custom Date') {
            this.setState({ validtime: true })
            this.setState({ isValidDate: true })
        } else {
            this.setState({ validtime: false })
            this.setState({ isValidDate: false })
        }


        switch (value) {
            case "Today":
                this.setState({ startDate: moment().format('YYYY-MM-DD') })
                return;
            case "Last 7 days":
                this.setState({ startDate: moment().subtract(7, 'd').format('YYYY-MM-DD') })
                this.setState({ endDate: moment().format('YYYY-MM-DD') })
                return;

            case "Last 30 days":
                this.setState({ startDate: moment().subtract(30, 'd').format('YYYY-MM-DD') })
                this.setState({ endDate: moment().format('YYYY-MM-DD') })
                return;

            case "Last quarter":
                this.setState({ startDate: moment().month(moment().quarter()).startOf('month').format('YYYY-MM-DD') })
                this.setState({ endDate: moment().month(moment().quarter()).endOf('month').format('YYYY-MM-DD') })
                return;

            case "Last Year":
                this.setState({ startDate: moment().startOf('year').format('YYYY-MM-DD') })
                this.setState({ endDate: moment().format('YYYY-MM-DD') })
                return;
            default:
                this.setState({ startDate: '' })
                this.setState({ endDate: '' })
                return;

        }



    }


    generatePDF = async () => {

        await this.fetchData();

        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = "Lead Report";
        const headers = [["Application ID", "Customer Details", "Product", "Loan Amount", "Status"]];

        const data = this.state.download_leads.map(elt => [elt.opp_id, elt.name, elt.product_name, elt.amount, elt.stage]);

        let content = {
            startY: 50,
            head: headers,
            body: data
        };

        doc.text(title, marginLeft, 40);
        doc.autoTable(content);
        doc.save("Leads Report.pdf")
        this.setState({ download_leads: [] })
    }


    csvExport = async () => {
        await this.fetchData();
        this.csvLink.current.link.click()
        this.setState({ download_leads: [] })
    }

    fetchData = async () => {
        this.setState({ download_leads: [] })
        const { selectedReport, download_leads } = this.state;
        for (let i = 0; i < selectedReport.length; i++) {

            let leadObj = {
                lender_sfid: this.props.user_sfid
            }
            if((selectedReport[i] == "All Leads")){

            }
            else if (selectedReport[i] == "Approval Pending") {
                leadObj.stage = 'DRF required';
                leadObj.drf_status = "Completed"
            } else {
                leadObj.stage = selectedReport[i];
            }

            let pagination_obj = { "page": 1, "limit": 10000 }
            let dateRangeObj = { 'from_date_time': this.state.startDate, 'to_date_time': this.state.endDate ? this.state.endDate : moment().format("YYYY-MM-DD") }
            await this.props.dispatch(getLeads(leadObj, pagination_obj, dateRangeObj, "newest")).then((response) => {

                this.setState({ download_leads: [...download_leads, ...response.data] }, () => {
                    // click the CSVLink component to trigger the CSV download
                })

            })
        }
    }


    render() {
        const { open_download_report, leads } = this.props
        const { selected, timeRange } = this.state
        return (
            <Modal show={open_download_report} className="modal" id="downloadReport">
                <div className="modal-dialog modal-dialog-centered dr-modal">
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <h3 className="mb-3 modalTitle">Download Reports</h3>
                                {/* <button type='button' onClick={this.closeModel} className="cs-btn">Clear Selection</button> */}
                                <button type="button" onClick={this.closeModel} className="cs-btn"><img src="images/icons/icon-close2.png" /></button>

                            </div>
                            <h5 className="font-weight-bold mb-3">Select Report</h5>

                            <ul className="checkboxes">
                                <li>
                                    <div className="custom_checkbox">
                                        <input type="checkbox" ref={`ref_1`} id="all_rep" defaultChecked={selected.includes(1)} onChange={e => this.onSelectClick(e, 'All Leads', 1)} />
                                        <label htmlFor="all_rep">All Leads</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox">
                                        <input type="checkbox" ref={`ref_2`} id="appro_pen" defaultChecked={selected.includes(2)} onChange={e => this.onSelectClick(e, 'Approval Pending', 2)} />
                                        <label htmlFor="appro_pen">Approval Pending</label>
                                    </div>
                                </li>
                                {/* <li>
                    <div className="custom_checkbox">
                        <input type="checkbox" ref={`ref_3`} id="repayments" defaultChecked={selected.includes(3)} onChange={ e =>this.onSelectClick(e, 'Repayments', 3)} />
                        <label htmlFor="repayments">Repayments</label>
                    </div>
                </li> */}
                                <li>
                                    <div className="custom_checkbox">
                                        <input type="checkbox" ref={`ref_4`} id="disbursed" defaultChecked={selected.includes(4)} onChange={e => this.onSelectClick(e, 'Loan Disbursed', 4)} />
                                        <label htmlFor="disbursed">Disbursed</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox">
                                        <input type="checkbox" ref={`ref_5`} id="declined" defaultChecked={selected.includes(5)} onChange={e => this.onSelectClick(e, 'Loan Declined', 5)} />
                                        <label htmlFor="declined">Declined</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox">
                                        <input type="checkbox" ref={`ref_6`} id="dispersal_pending" defaultChecked={selected.includes(6)} onChange={e => this.onSelectClick(e, 'Ready to disburse', 6)} />
                                        <label htmlFor="dispersal_pending">Disbursement Pending</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox">
                                        <input type="checkbox" ref={`ref_7`} id="dropped" defaultChecked={selected.includes(7)} onChange={e => this.onSelectClick(e, 'Dropped', 7)} />
                                        <label htmlFor="dropped">Dropped</label>
                                    </div>
                                </li>
                            </ul>

                            <h5 className="font-weight-bold mb-3">Time Range</h5>
                            <ul className="checkboxes">
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="Today" value="Today" onClick={() => this.handleChangeTimeRange("Today")} defaultChecked={timeRange == "Today" ? true : false} />
                                        <label htmlFor="">Today</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="last_7" value="Last 7 days" onClick={() => this.handleChangeTimeRange("Last 7 days")} defaultChecked={timeRange == "Last 7 days" ? true : false} />
                                        <label htmlFor="">Last 7 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="last_30" value="Last 30 days" onClick={() => this.handleChangeTimeRange("Last 30 days")} defaultChecked={timeRange == "Last 30 days" ? true : false} />
                                        <label htmlFor="">Last 30 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="Last_quarter" value="Last quarter" onClick={() => this.handleChangeTimeRange("Last quarter")} defaultChecked={timeRange == "Last quarter" ? true : false} />
                                        <label htmlFor="">Last quarter</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="last_year" value="Last Year" onClick={() => this.handleChangeTimeRange("Last Year")} defaultChecked={timeRange == "Last Year" ? true : false} />
                                        <label htmlFor="">Last Year</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="radio" name="timeRange" id="cust_date" value="Custom Date" onClick={() => this.handleChangeTimeRange("Custom Date")} defaultChecked={timeRange == "Custom Date" ? true : false} />
                                        <label htmlFor="">Custom Date</label>
                                    </div>
                                </li>
                            </ul>
                            {timeRange == "Custom Date" && (
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
                                </>
                            )}
                            {this.state.isInvalidDate &&
                                <div className="alert alert-danger mt-1 py-1 w-100 ">Invalid date selected !</div>
                            }
                            <div className="modalFooter">
                                <div className="row">
                                    {/* <div className="col-sm-6"><button type='button' className="w-100 export-btn"><img src="images/excel.svg" className="img-fluid"></img> Export CSV</button></div> */}
                                    {/* <div className="col-sm-6">
                                        <CSVLink data={leads}
                                        ><button className="w-100 export-btn"><img src="images/excel.svg" className="img-fluid"></img> Export CSV</button>
                                        </CSVLink>
                                    </div> */}

                                    <div className="col-sm-6">
                                        <button type='button'
                                            onClick={this.generatePDF}
                                            className={`w-100 export-btn ${(this.state.selectedReport.length > 0 && this.state.isValidDate) ? '' : 'export-btn-disabled'} `}
                                            disabled={(this.state.selectedReport.length > 0 && this.state.isValidDate) ? false : true}
                                        >
                                            <img src="images/pdf.svg" className="img-fluid"></img>
                                            Export PDF
                                        </button>
                                    </div>

                                    <div className="col-sm-6">
                                        <button
                                            className={`w-100 export-btn ${(this.state.selectedReport.length > 0 && this.state.isValidDate) ? '' : 'export-btn-disabled'} `}
                                            onClick={this.csvExport}
                                            disabled={(this.state.selectedReport.length > 0 && this.state.isValidDate) ? false : true}
                                        >

                                            <img src="images/excel.svg" className="img-fluid"></img>
                                            Export CSV
                                        </button>

                                        <CSVLink
                                            data={this.state.download_leads}
                                            filename="data.csv"
                                            className="hidden"
                                            ref={this.csvLink}
                                            target="_blank"
                                        />
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
    const { isLoading, isLoggedIn, user_id, token_id, user_sfid } = state.auth;
    const { leads, leadsCount, group_recipient, group_list } = state.user;
    const { open_email_report, open_download_report } = state.model;
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
        user_sfid
    };
}

export default connect(mapStateToProps)(DownloadReport);