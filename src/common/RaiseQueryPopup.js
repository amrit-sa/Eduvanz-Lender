import React from "react";
import { Modal, Button } from "react-bootstrap"
import { closeRaiseQuery } from "../actions/model";
import { RaiseQueryCall } from "../actions/users";


class RaiseQueryPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
             selectValue:'',
             optionalDiscription:'',
             errmsg:'',
             showerr:false,
        }
    }

    componentDidMount() {

    }
    componentDidUpdate(prevProps, prevState) {

    }

    closeModel = () => {
        this.props.dispatch(closeRaiseQuery());
    }
    SubmitRaiseQuery = () => {
     let obj = {
            user_sfid: localStorage.getItem('user_sfid'),
            subject: this.state.selectValue,
            description: this.state.optionalDiscription,
            //user_sfid, subject, description
        }

        this.props.dispatch(RaiseQueryCall(obj)).then(res => {
            console.log(res);
            if(res.status === 'success'){
                this.setState({errmsg:'',showerr:false,optionalDiscription:'',selectValue:''});
                this.props.dispatch(closeRaiseQuery());
                alert("Your query has been raised successfully.");
            }else{
                this.setState({errmsg:'Unable to raise the query due to technical issue. please try after some time.',showerr:true});
                
            }
        })
    }

    handleSelect = (e) => {
        this.setState({selectValue:e.target.value});
    }

    render() {
        let a = (this.state.selectValue === '' && this.state.optionalDiscription.length === 0) ? "btn btn-secondary" : "btn btn-secondary bgblack";
        // console.log(a ,this.state.selectValue === '' && this.state.optionalDiscription.length === 0);
        console.log((this.state.selectValue === '' && this.state.optionalDiscription.length === 0) ? true : false);
        const {open_raise_query} =this.props
        // console.log('checkingggggggggggg111',open_raise_query)
        return (
            <Modal show={open_raise_query} className="adduser" >

                        <div class="modal-content"><div class="modal-dialog">
                            <form class="f_height"><div class="modal-content">
                                <div class="modal-header row justify-content-center">
                                    <div class="col-sm-11 px-3 d-flex justify-content-between">
                                        <h5 class="modal-title fz24">Raise Query</h5>
                                <button type="button" onClick={e=>this.closeModel()} className="cs-btn"><img src="images/icons/icon-close2.png" /></button>
                                    </div>
                                </div>
                                <div id="" class="modal-body pt-0 px-0">
                                    <div class="px-4">
                                        <div class="row justify-content-center mb-2">
                                            <div class="col-sm-11">
                                                <div class="v-scroll">
                                                    <div class="row justify-content-center mb-2">
                                                        <div class="col-sm-12 form-group">
                                                            <label for="query_type" class="form-label">Query Type*</label>
                                                            <select name="query_type" id="query_type" class="form-control" onChange={this.handleSelect}>
                                                                <option value="">Select Any</option>
                                                                <option value="Loan Approval">Loan Approval</option>
                                                                <option value="Document Upload">Document Upload</option>
                                                                <option value="Communication with Customer">Communication with Customer</option>
                                                                <option value="Applicaiton Process">Applicaiton Process</option>
                                                                <option value="NACH Mandate">NACH Mandate</option>
                                                                <option value="Agreement">Agreement</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="row justify-content-center">
                                                        <div class="col-sm-12 form-group">
                                                            <label class="form-label mb-3">Description</label>
                                                            <textarea class="form-control border" name="quer_description" id="exampleFormControlTextarea1" rows="3" placeholder="Start typing..." onChange={(e) => this.setState({optionalDiscription:e.target.value})}></textarea>
                                                        </div>
                                                    </div>
                                                    <div className="text-danger">{this.state.errmsg}</div>
                                                </div>
                                                <div class="row justify-content-end mb-2 mt-4">
                                                    <button type="button" className={(this.state.selectValue === '' || this.state.optionalDiscription.length === 0) ? "btn btn-secondary" : "btn btn-secondary bgblack"}  disabled={(this.state.selectValue === '' || this.state.optionalDiscription.length === 0) ? true : false} onClick= {this.SubmitRaiseQuery}>Submit</button>
                                                    {/* <button type="button" className="btn btn-secondary" disabled={(this.state.selectValue === '' || this.state.optionalDiscription.length === 0) ? true : false} onClick= {this.SubmitRaiseQuery}>Submit</button> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            </form>
                        </div>
                        </div>
                    



            </Modal>
        );
    }
}

export default RaiseQueryPopup;