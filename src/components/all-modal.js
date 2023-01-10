import React, { Component } from "react";
import $ from 'jquery';
import Helmet from "react-helmet"; 
import { Scrollbar } from "react-scrollbars-custom";

class AllModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount(){
    // $('.check-tab').on('click', function(){
    //    $(this).next().slideToggle()
    // })

    $('.check-tab').on('click', function(){
        $('.check-tab').removeClass('active');
        $(this).siblings('.content').slideUp();
        
        if($(this).next('.content').is(":visible")){
            $(this).next('.content').slideUp();
            $(this).removeClass('active');
        }else{
            $(this).next('.content').slideToggle();
            $(this).addClass('active');
        }
        
      })

  }


  render() {
   
    return (
      <>
      <Helmet>
        <title>All Modal </title>
      </Helmet>
        <button data-toggle="modal" data-target="#bulkUpload" className="btn-secondary btn">Admin bulk upload items</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#downloadReport" className="btn-secondary btn">Admin download reports</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#loanBooked" className="btn-secondary btn">Loan Booked</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#approvalConfirmation" className="btn-secondary btn">Approval Confirmation</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#approved" className="btn-secondary btn">Approved</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#decline" className="btn-secondary btn">Decline</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#email" className="btn-secondary btn">Email</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#scehdule" className="btn-secondary btn">Scehdule</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#emailCam" className="btn-secondary btn">Email Cam</button>
        <div className="mb-3"></div>
        <button data-toggle="modal" data-target="#adminSchedule" className="btn-secondary btn">Admin- Schedule Email</button>
        <div className="mb-3"></div>
        {/* <button data-toggle="modal" data-target="#emailReport" className="btn-secondary btn">Uploaded File &amp; History </button> */
        }

        <button data-toggle="modal" data-target="#emailReport" className="btn-secondary btn">Email Report</button>


        
        
        {/* Admin bulk upload items */}
        <div className="modal fade" id="bulkUpload">
        <div className="modal-dialog modal-dialog-centered bulk-upload-modal">
        <div className="modal-content">
           
            <div className="modal-body">
            
            <h3 className="mb-3 modalTitle">Disburse hundred of case together</h3>
            <div className="d-flex align-items-center justify-content-between">
                <h5 className="mb-3">Instructions-</h5>
                <button className="link">View history</button>
            </div>
                

                <ol className="list-item">
                    <li>Download the <button className="link">Bulk Upload Template here <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.23169 15.1016C8.46386 15.3339 8.73953 15.5182 9.04295 15.644C9.34637 15.7697 9.67159 15.8344 10 15.8344C10.3285 15.8344 10.6537 15.7697 10.9571 15.644C11.2605 15.5182 11.5362 15.3339 11.7684 15.1016L14.4442 12.4258C14.5877 12.2671 14.6646 12.0594 14.6591 11.8455C14.6536 11.6317 14.5661 11.4281 14.4147 11.277C14.2633 11.1259 14.0595 11.0388 13.8457 11.0338C13.6318 11.0288 13.4242 11.1062 13.2659 11.25L10.8275 13.6891L10.8334 0.833331C10.8334 0.612318 10.7456 0.400357 10.5893 0.244077C10.433 0.0877971 10.221 0 10 0V0C9.77901 0 9.56705 0.0877971 9.41077 0.244077C9.25449 0.400357 9.16669 0.612318 9.16669 0.833331L9.15919 13.6733L6.73419 11.25C6.57783 11.0937 6.36579 11.006 6.14473 11.0061C5.92367 11.0061 5.7117 11.094 5.55544 11.2504C5.39919 11.4068 5.31145 11.6188 5.31152 11.8398C5.3116 12.0609 5.39949 12.2729 5.55586 12.4291L8.23169 15.1016Z" fill="#1251F1"/>
<path d="M19.1667 13.3335C18.9457 13.3335 18.7337 13.4213 18.5774 13.5776C18.4211 13.7339 18.3333 13.9458 18.3333 14.1668V17.5002C18.3333 17.7212 18.2455 17.9331 18.0893 18.0894C17.933 18.2457 17.721 18.3335 17.5 18.3335H2.5C2.27899 18.3335 2.06702 18.2457 1.91074 18.0894C1.75446 17.9331 1.66667 17.7212 1.66667 17.5002V14.1668C1.66667 13.9458 1.57887 13.7339 1.42259 13.5776C1.26631 13.4213 1.05435 13.3335 0.833333 13.3335C0.61232 13.3335 0.400358 13.4213 0.244078 13.5776C0.0877974 13.7339 0 13.9458 0 14.1668L0 17.5002C0 18.1632 0.263392 18.7991 0.732233 19.2679C1.20107 19.7368 1.83696 20.0002 2.5 20.0002H17.5C18.163 20.0002 18.7989 19.7368 19.2678 19.2679C19.7366 18.7991 20 18.1632 20 17.5002V14.1668C20 13.9458 19.9122 13.7339 19.7559 13.5776C19.5996 13.4213 19.3877 13.3335 19.1667 13.3335Z" fill="#1251F1"/>
</svg>
</button></li>
                    <li>File in App ID, UTR No, Amount &amp; Payment Date in the template.</li>
                    <li>Upload it below for processing disbursals.</li>
                </ol>
                <div className="drag-drop-area text-center">
                    <div className="d-inline-block mb-3">
                        <img src="images/folder-icon.png" className="img-fluid"></img>
                    </div>
                    <p className="font-weight-bold">Drag or Upload the file here, or <span className="browse d-inline-block"><input type="file"/>browser</span>
                    </p>
                    <ul className="sf mb-3">
                        <li>File Supported:<span className="pl-1">.csv</span></li>
                        <li>Max File Size:<span className="pl-1">5MB</span></li>
                    </ul>
                    <button className="btn-black">
                        <img src="img/icon-upload.svg" className="img-fluid"></img> Upload
                    </button>
                </div>
                <div className="mb-4 mt-4">
                        <table className="file-upload-pro-table">
                            <tbody>
                            <tr>
                                <td>
                                    <img src="img/icon-file.svg"></img>   
                                </td>
                                <td>
                                    <div className="d-flex align-items-center justify-content-between">
                                    <p>Disbursement_Detail.pdf</p>
                                    <span style={{"color":"#1F78B4"}}>67%</span>
                                    </div>
                                    
                                    <div className="pro-bar">
                                        <div className="pro" style={{"width":"67%"}}></div>
                                    </div>
                                </td>
                                <td>
                                    <button className="file-cancel"><img src="img/icon-cross.svg" className="img-fluid"></img> </button>
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <img src="img/icon-file.svg"></img>   
                                </td>
                                <td>
                                <div className="d-flex align-items-center justify-content-between">
                                    <p>Disbursement_Detail.pdf</p>
                                    <span style={{"color":"#08B904"}}>100%</span>
                                    </div>
                                    <div className="pro-bar">
                                        <div className="complete"></div>
                                    </div>
                                </td>
                                <td>
                                    <button className="file-cancel"><img src="img/icon-cross.svg" className="img-fluid"></img> </button>
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <img src="img/icon-file.svg"></img>   
                                </td>
                                <td>
                                <div className="d-flex align-items-center justify-content-between">
                                    <p>Disbursement_Detail.pdf</p>
                                    <span style={{"color":"#F95556"}}>File size exceeds 5MB</span>
                                    </div>
                                    <div className="pro-bar">
                                        <div className="error"></div>
                                    </div>
                                </td>
                                <td>
                                    <button className="file-cancel"><img src="img/icon-cross.svg" className="img-fluid"></img> </button>
                                </td>
                                <td>
                                    
                                </td>
                            </tr>
                            </tbody>
                            
                        </table>
                    </div>
                    <div className="text-right">
                        <button className="btn-black">
                            <img src="images/running-man.svg"></img> Process File
                        </button>
                    </div>
            </div>
           
        </div>
        </div>
        </div>
         {/* Admin download reports */}
        <div className="modal fade" id="downloadReport">
        <div className="modal-dialog modal-dialog-centered dr-modal">
        <div className="modal-content">
           
            <div className="modal-body">
            
            
            <div className="d-flex align-items-center justify-content-between">
                <h3 className="mb-3 modalTitle">Download Reports</h3>
                <button className="cs-btn">Clear Selection</button>
            </div>
            <h5 className="font-weight-bold mb-3">Select Report</h5>

            <ul className="checkboxes">
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox" checked/>
                        <label htmlFor="">All Leads</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox"/>
                        <label htmlFor="">Approval Pending</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox"/>
                        <label htmlFor="">Repayments</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox"/>
                        <label htmlFor="">Disbursed</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox"/>
                        <label htmlFor="">Declined</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox"/>
                        <label htmlFor="">Disbursement Pending</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox">
                        <input type="checkbox"/>
                        <label htmlFor="">Dropped</label>
                    </div>
                </li>
            </ul>

            <h5 className="font-weight-bold mb-3">Time Range</h5>
            <ul className="checkboxes">
                <li>
                    <div className="custom_checkbox none">
                        <input type="checkbox" checked/>
                        <label htmlFor="">Today</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox none">
                        <input type="checkbox"/>
                        <label htmlFor="">Last 7 days</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox none">
                        <input type="checkbox"/>
                        <label htmlFor="">Last 30 days</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox none">
                        <input type="checkbox"/>
                        <label htmlFor="">Last quarter</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox none">
                        <input type="checkbox"/>
                        <label htmlFor="">Last Year</label>
                    </div>
                </li>
                <li>
                    <div className="custom_checkbox none">
                        <input type="checkbox"/>
                        <label htmlFor="">Custom Date</label>
                    </div>
                </li>
            </ul>
            <h5 className="mb-3">Custom Date</h5>

            <div className="row">
                <div className="col-sm-6">
                <input type="text" id="startdate" className="dateR"/>
                </div>
                <div className="col-sm-6">
                <input type="text" id="enddate" className="dateR"/>
                </div>
            </div>

            <div className="modalFooter">
                <div className="row">
                    <div className="col-sm-6"><button className="w-100 export-btn"><img src="images/pdf.svg" className="img-fluid"></img> Export PDF</button></div>
                    <div className="col-sm-6"><button className="w-100 export-btn"><img src="images/excel.svg" className="img-fluid"></img> Export CSV</button></div>
                </div>
            </div>
            </div>
           
        </div>
        </div>
        </div>
         {/* Loan Booked */}
        <div className="modal fade" id="loanBooked">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                    <div className="modal-header border-0 pb-0">
                        <button type="button" className="close ml-auto" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <img src="images/wallet.png" className="img-fluid"></img> 
                        <h4 className="success-msg mt-5">Loan Booked Succesfully !</h4> 
                    </div>
                </div>
            </div>
        </div>
         {/* Approval Confirmation */}
         <div className="modal fade" id="approvalConfirmation">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                  
                    <div className="modal-body text-center">
                        <div className="d-inline-block">
                            <div className="d-inline-block">
                                <img src="images/process-anim1.png" className="img-fluid"></img> 
                            </div>
                            
                            <h4 className="mt-5 mb-4">Are you sure you want to Approve Case ?</h4> 
                            <button className="btn-black w-100 mb-4"><h4>Approve Case</h4></button>
                            <button className="later">Later</button>
                        </div>

                        <div className="d-inline-block">
                        <div className="d-inline-block">
                            <img src="images/wallet.png" className="img-fluid"></img> 
                        </div>
                        <h4 className="mt-5 mb-4">Are you sure you want to Book Case ?</h4>
                        <button className="btn-black w-100 mb-4"><h4>Book Case</h4></button>
                        <button className="later">Later</button>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
         {/* Approved */}
         <div className="modal fade" id="approved">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                 
                    <div className="modal-body text-center">
                        <div className="d-inline-block">
                            <div className="d-inline-block">
                                <img src="images/stamp.png" className="img-fluid"></img> 
                            </div>
                            
                            <h4 className="mt-5 mb-4 success-msg">Case Approved Successfully!</h4>
                        </div>

                        <div className="d-inline-block">
                        <div className="d-inline-block">
                            <img src="images/loan-booked.png" className="img-fluid"></img> 
                        </div>
                        <h4 className="mt-5 mb-4 text-dark-green">Loans Booked Successfully!</h4>
                        
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
        
         {/* decline */}
         <div className="modal fade" id="decline">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                 
                    <div className="modal-body text-center">
                        <div className="d-inline-block">
                            <div className="d-inline-block">
                                <img src="images/decline2.png" className="img-fluid"></img> 
                            </div>
                            
                            <h4 className="mt-5 mb-4">Are you sure you want to decline the case ?</h4>
                            <div className="custom-select-style">
                                <select>
                                    <option value="0">Select decline case reason*</option>
                                    <option value="1">Reason 1</option>
                                    <option value="2">Reason 1</option>
                                    <option value="3">Reason 1</option>
                                    <option value="4">Reason 1</option>
                                    <option value="5">Reason 1</option>
                                    <option value="6">Reason 1</option>
                                </select>
                                </div>
                            <div className="pt-5">
                                <button className="btn-black w-100 mb-4"><h4>Decline Case</h4></button>
                                <button className="later">Later</button>
                            </div>
                        </div>

                        <div className="d-inline-block">
                            <div className="d-inline-block">
                                <img src="images/decline2.png" className="img-fluid"></img> 
                            </div>
                            <h4 className="mt-5 mb-4">Are you sure you want to drop the case ?</h4>
                            <div>
                                <textarea className="textarea2" placeholder="Mention the reason here *"/>
                            </div>
                            <div className="pt-5">
                                <button className="btn-black w-100 mb-4"><h4>Drop Case</h4></button>
                                <button className="later">Later</button>
                            </div>
                        </div>

                        <div className="d-inline-block">
                            <div className="d-inline-block">
                                <img src="images/decline2.png" className="img-fluid"></img> 
                            </div>
                            <h4 className="mt-5 mb-4">Are you sure you want to decline the case ?</h4>
                            <div className="custom-select-style mb-3">
                                <select>
                                    <option value="0">Select decline case reason*</option>
                                    <option value="1">Reason 1</option>
                                    <option value="2">Reason 1</option>
                                    <option value="3">Reason 1</option>
                                    <option value="4">Reason 1</option>
                                    <option value="5">Reason 1</option>
                                    <option value="6">Reason 1</option>
                                </select>
                                </div>
                            <div>
                                <textarea className="textarea2" placeholder="Mention the reason here *"/>
                            </div>
                            <div className="pt-5">
                                <button className="btn-black w-100 mb-4"><h4>Decline Case</h4></button>
                                <button className="later">Later</button>
                            </div>
                        </div>
                        
                        
                    </div>
                </div>
            </div>
        </div>
         {/* Email */}
         <div className="modal fade" id="email">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                 
                    <div className="modal-body text-center">
                        <div className="d-inline-block mt-4">
                            <div className="d-inline-block">
                                <img src="images/decline1.png" className="img-fluid"></img> 
                            </div>
                            <h4 className="mt-5 mb-4 success-msg">Email sent successfully!</h4>
                       </div>
                    </div>
                </div>
            </div>
        </div>
         {/* scehdule */}
         <div className="modal fade" id="scehdule">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                    <div className="modal-body text-center">
                        <div className="d-inline-block mt-4">
                            <div className="d-inline-block">
                                <img src="images/decline1.png" className="img-fluid"></img> 
                            </div>
                            
                            <h4 className="mt-5 mb-4 success-msg">Report Scheduled successfully!</h4>
                       
                        </div>
                    </div>
                </div>
            </div>
        </div>

         {/* Email cam */}
         <div className="modal fade" id="emailCam">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                    <div className="modal-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="mb-0 modalTitle">Email CAM</h3>
                        <button className="cs-btn"><img src="images/icons/icon-close2.png"/></button>
                    </div>
                    <div className="mb-3">
                        <input type="text" className="input-style w-100" placeholder="Add Recipient"/>
                    </div>
                    
                    
                    <div className="row mb-3">
                    <Scrollbar style={{height:100 }}>
                    <div className="px-3">
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                                <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Scrollbar> 
                    </div>


                    <h5 className="font-weight-bold mb-4">Email CAM to my groups</h5>

                    <div className="check-accordion">
                        <div className="check-tab">
                            <div className="op-checkbox">
                                <input type="checkbox"/>
                                <label>Operations</label>
                            </div>
                            <button>
                                <img src="images/icons/edit-icon.svg" className="img-fluid"/>
                            </button>
                        </div>
                        
                        <div className="content">
                            <ul>
                                <li>Shivshankar@gmail.com</li>
                                <li>Sai.iyer@gmail.com</li>
                                <li>aagam.mehta@gmail.com</li>
                                <li>anjali.verma@gmail.com</li>
                            </ul>
                        </div>
                        <div className="check-tab">
                            <div className="op-checkbox">
                                <input type="checkbox"/>
                                <label>Operations</label>
                            </div>
                            <button>
                                <img src="images/icons/edit-icon.svg" className="img-fluid"/>
                            </button>
                        </div>
                        <div className="content">
                            <ul>
                                <li>Shivshankar@gmail.com</li>
                                <li>Sai.iyer@gmail.com</li>
                                <li>aagam.mehta@gmail.com</li>
                                <li>anjali.verma@gmail.com</li>
                            </ul>
                        </div>
                        
                        <div className="check-tab">
                            <div className="op-checkbox">
                                <input type="checkbox"/>
                                <label>Operations</label>
                            </div>
                            <button>
                                <img src="images/icons/edit-icon.svg" className="img-fluid"/>
                            </button>
                        </div>
                        <div className="content">
                            <ul>
                                <li>Shivshankar@gmail.com</li>
                                <li>Sai.iyer@gmail.com</li>
                                <li>aagam.mehta@gmail.com</li>
                                <li>anjali.verma@gmail.com</li>
                            </ul>
                        </div>
                    </div>




                    <div className="modalFooter">
                        <div className="row">
                            <div className="col-sm-6"><button className="w-100 export-btn">Cancel</button></div>
                            <div className="col-sm-6"><button className="w-100 export-btn black">Email CAM</button></div>
                        </div>
                    </div>
                    </div>

                  
                </div>
            </div>
        </div>

        {/* Admin Schedule cam */}
        <div className="modal fade" id="adminSchedule">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                    <div className="modal-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="mb-0 modalTitle">Email Reports</h3>
                        <button className="cs-btn"><img src="images/icons/icon-close2.png"/></button>
                    </div>

                    <div className="mb-3">
                        <button className="export-btn black mr-3">Share via Email</button>
                        <button className="export-btn ">Schedule Send</button>
                    </div>

                  

                    <div className="mb-3">
                        <input type="text" className="input-style w-100" placeholder="Enter group name"/>
                    </div>
                    <div className="mb-3">
                        
                        <input type="text" className="input-style w-100" placeholder="Type name or email address"/>
                    </div>
                    
                    <div className="row mt-4">
                    <Scrollbar style={{height:100 }}>
                    <div className="px-3">
                        <div className="row">
                            <div className="col-sm-6 mb-3">
                                <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                                <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                            <div className="col-sm-6 mb-3">
                            <div className="email-wrap"><span>shivshankar@gmail.com</span><button>
                            <img src="images/x.svg" className="img-fluid"></img> 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </Scrollbar> 
                    </div>
                    <h5 className="font-weight-bold mt-4 mb-4">Email Report to my groups</h5>
                    <div className="row mt-4">
                        <div className="px-3">
                            <div className="row">
                            <ul className="checkboxes">
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox" checked/>
                                            <label htmlFor="">All Leads</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox"/>
                                            <label htmlFor="">Approval Pending</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox"/>
                                            <label htmlFor="">Repayments</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox"/>
                                            <label htmlFor="">Disbursed</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox"/>
                                            <label htmlFor="">Declined</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox"/>
                                            <label htmlFor="">Disbursement Pending</label>
                                        </div>
                                    </li>
                                    <li>
                                        <div className="custom_checkbox">
                                            <input type="checkbox"/>
                                            <label htmlFor="">Dropped</label>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <h5 className="font-weight-bold mt-4 mb-4">Time Range</h5>
                    <div className="row mt-4">
                        <div className="px-3">
                            <div className="row">
                            <ul className="checkboxes">
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox" checked/>
                                        <label htmlFor="">Today</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Last 7 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Last 30 days</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Last quarter</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Last Year</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Custom Date</label>
                                    </div>
                                </li>
                            </ul>
                            </div>
                        </div>
                    </div>
                    <h5 className="font-weight-bold mt-4 mb-4">Configure Schedule</h5>
                    <div>
                            <ul className="checkboxes">
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Daily</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox"/>
                                        <label htmlFor="">Weekly</label>
                                    </div>
                                </li>
                                <li>
                                    <div className="custom_checkbox none">
                                        <input type="checkbox" checked/>
                                        <label htmlFor="">Monthly</label>
                                    </div>
                                </li>
                            </ul>
                                    <div className="weekly  mt-3">
                                        <div className="date-box">M</div>
                                        <div className="date-box">T</div>
                                        <div className="date-box selected">W</div>
                                        <div className="date-box">T</div>
                                        <div className="date-box">F</div>
                                        <div className="date-box">S</div>
                                        <div className="date-box">S</div>
                                    </div>

                                    <div className="monthly mt-3">
                                        <div className="date-box">
                                            <div className="date">1</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">2</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date selected">3</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">4</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">5</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">6</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">7</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">8</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">9</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">10</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">11</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">12</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">13</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">14</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">15</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">16</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">17</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">18</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">19</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">20</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">21</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">22</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">23</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">24</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">25</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">26</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">27</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">28</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">29</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">30</div>
                                        </div>
                                        <div className="date-box">
                                            <div className="date">31</div>
                                        </div>
                                    </div>
                                </div>

                    <div className="modalFooter">
                        <div className="row">
                            <div className="col-sm-6"><button className="w-100 export-btn">Cancel</button></div>
                            <div className="col-sm-6"><button className="w-100 export-btn black">Create Group</button></div>
                        </div>
                    </div>
                    </div>

                  
                </div>
            </div>
        </div>
        {/* Email Report */}
        {/* <div className="modal fade" id="emailReport" tabIndex="-1" role="dialog">
            <div className="modal-dialog file-history-modal modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-8">
                            <div className="backicon float-left visibility-hidden"><img src="img/icon_back.svg" /></div>
                                <nav className="float-left">
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <a
                                        className="nav-item nav-link active"
                                        id="nav-appdetails-tab"
                                        data-toggle="tab"
                                        href="#nav-appdetails"
                                        role="tab"
                                        aria-controls="nav-appdetails"
                                        aria-selected="true"
                                        >
                                            Disbursement_Deta..
                                        </a>
                                        <a
                                        className="nav-item nav-link"
                                        id="nav-documents-tab"
                                        data-toggle="tab"
                                        href="#nav-documents"
                                        role="tab"
                                        aria-controls="nav-documents"
                                        aria-selected="false"
                                        >
                                            Disbursement_Deta..
                                        </a>
                                    </div>
                                </nav>
                            </div>
                        </div>
                        <div className="row pt-4">
                            <div className="col-md-9 mt-6">
                                <ul className="leads_boxinfo">
                                    <li className="col_1">
                                        <span className="title">100</span>
                                        <span className="atsize">Total Leads</span>
                                    </li>
                                    <li className="col_2">
                                        <span className="title">--</span>
                                        <span className="atsize">Booked Loans</span>
                                    </li>
                                    <li className="col_3">
                                        <span className="title">--</span>
                                        <span className="atsize">Errors</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="col-md-3 text-right tbuttons">
                                <button className="btn btn-primary btn-s1"><img src="images/download.svg"/>Download All</button>
                            </div>
                        </div>
                            
                        <div className="row">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <table className="table" cellSpacing="0" cellPadding="0">
                                        <thead>
                                            <tr>
                                                <th scope="col">No.</th>
                                                <th scope="col">Application Id</th>
                                                <th scope="col">Result</th>
                                                <th scope="col">Errors</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td scope="col">1</td>
                                                <td scope="col">A2123456666</td>
                                                <td scope="col">Processing</td>
                                                <td scope="col">-</td>
                                            </tr>
                                            <tr>
                                                <td scope="col">2</td>
                                                <td scope="col">A2123456666</td>
                                                <td scope="col">Processing</td>
                                                <td scope="col">-</td>
                                            </tr>
                                            <tr>
                                                <td>3</td>
                                                <td>A2123456666</td>
                                                <td>Processing</td>
                                                <td>-</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="modalFooter">
                        <div className="row">
                            <div className="col-sm-3"><button type="button" data-dismiss="modal" aria-label="Close" className="w-100 export-btn">Cancel</button></div>
                            <div className="col-sm-3"><button className="w-100 export-btn black">Create Group</button></div>
                        </div>
                    </div>
                    </div>
                  
                </div>
            </div>
        </div> */}

        {/* email report */}

        <div className="modal fade" id="emailReport">
            <div className="modal-dialog modal-dialog-centered dr-modal">
                <div className="modal-content">
                    <div className="modal-body">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <h3 className="mb-0 modalTitle">Email Reports</h3>
                        <button className="cs-btn"><img src="images/icons/icon-close2.png"/></button>
                    </div>

                    <div className="mb-3">
                        <button className="export-btn black mr-3">Share via Email</button>
                        <button className="export-btn ">Schedule Send</button>
                    </div>

                    <div className="row mt-4">
                    <Scrollbar style={{height:'70vh' }}>
                        <div className="px-3">
                            <h5 className="font-weight-bold mt-4 mb-4">Scheduled Email Reports </h5>
                            <div className="check-accordion">
                            <div className="check-tab justify-content-between">
                                <div>
                                <span className="d-inline-block mr-2">Options</span> 
                                    <button>
                                        <img src="images/icons/edit-icon.svg" className="img-fluid"/>
                                    </button>
                                </div>
                            
                                <div className="pr-5" style={{color:"#ABABAB"}}>
                                    <img src="images/icons/time-forward.svg"/>
                                    <span className="d-inline-block ml-2">Next email in 30 days</span>
                                </div>
                            </div>
                            <div className="content">
                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Participants</h5>
                                    <ul>
                                        <li>Shivshankar@gmail.com</li>
                                        <li>Sai.iyer@gmail.com</li>
                                        <li>aagam.mehta@gmail.com</li>
                                        <li>anjali.verma@gmail.com</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Reports</h5>
                                    <ul>
                                        <li>All Leads</li>
                                        <li>Approval Pending</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Reports Time Range</h5>
                                    <ul>
                                        <li>Last 30 days</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Configurations</h5>
                                    <ul>
                                        <li>5th of every month</li>
                                    </ul>
                                </div>
                                
                            </div>

                            <div className="check-tab justify-content-between">
                                <div>
                                <span className="d-inline-block mr-2">Credit </span> 
                                    <button>
                                        <img src="images/icons/edit-icon.svg" className="img-fluid"/>
                                    </button>
                                </div>
                            
                                <div className="pr-5" style={{color:"#ABABAB"}}>
                                    <img src="images/icons/time-forward.svg"/>
                                    <span className="d-inline-block ml-2">Next email in 15 days</span>
                                </div>
                            </div>
                            <div className="content">
                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Participants</h5>
                                    <ul>
                                        <li>Shivshankar@gmail.com</li>
                                        <li>Sai.iyer@gmail.com</li>
                                        <li>aagam.mehta@gmail.com</li>
                                        <li>anjali.verma@gmail.com</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Reports</h5>
                                    <ul>
                                        <li>All Leads</li>
                                        <li>Approval Pending</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Reports Time Range</h5>
                                    <ul>
                                        <li>Last 30 days</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Configurations</h5>
                                    <ul>
                                        <li>5th of every month</li>
                                    </ul>
                                </div>
                                
                            </div>

                            <div className="check-tab justify-content-between">
                                <div>
                                <span className="d-inline-block mr-2">Credit 2</span> 
                                    <button>
                                        <img src="images/icons/edit-icon.svg" className="img-fluid"/>
                                    </button>
                                </div>
                            
                                <div className="pr-5" style={{color:"#ABABAB"}}>
                                    <img src="images/icons/time-forward.svg"/>
                                    <span className="d-inline-block ml-2">Next email in 05 days</span>
                                </div>
                            </div>
                            <div className="content">
                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Participants</h5>
                                    <ul>
                                        <li>Shivshankar@gmail.com</li>
                                        <li>Sai.iyer@gmail.com</li>
                                        <li>aagam.mehta@gmail.com</li>
                                        <li>anjali.verma@gmail.com</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Reports</h5>
                                    <ul>
                                        <li>All Leads</li>
                                        <li>Approval Pending</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Reports Time Range</h5>
                                    <ul>
                                        <li>Last 30 days</li>
                                    </ul>
                                </div>

                                <div>
                                    <h5  className="font-weight-bold mt-4 mb-4">Configurations</h5>
                                    <ul>
                                        <li>5th of every month</li>
                                    </ul>
                                </div>
                                
                            </div>


                    </div>
                        </div>
                        
                    </Scrollbar> 
                    </div>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
  }
}

export default AllModal;
