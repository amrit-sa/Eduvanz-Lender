import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Sidebar from "../common/sidebar";
import { Redirect } from "react-router-dom";
import { openLeadProfileModel, getDocByType, getGroupList, getBankDocuemnt, getAddressProof, groupEmailSearch, clearEmailSearch, getAddressProofDoc, getLenderLeadDetails, getLeadProfile, getAddress, getLeadOtherDocuemnt, getLeadPanDocuemnt, getLeadProfileDocuemnt, getDocumentCount, geBbureau, geBbureauHardpull, getRepayment, sendEmailCAM } from "../actions/users";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import html2canvas from 'html2canvas';
import dateFormat from 'dateformat';
import RaiseQueryPopup from "../common/RaiseQueryPopup";
import { openRaiseQuery, openeDownloadReport } from "../actions/model";
import HtmlIframe from "./htmlIframe";
import Header from "../common/header";

const percentage = 60
const APP = 1
const DOC = 2
const PRO = "PRO"
const NODOC = "NODOC"
const FAIL = "FAIL"
class ClosedLeadDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankSrc: '',
      maxRequestLength: "5242880",
      company_name: '',
      monthly_income: '',
      gmapsLoaded: false,
      isValidPan: true,
      errorMsg: '',
      onBoarding: 0,
      rent_amount: '',
      house: 0,
      isBackUploading: false,
      isSuccess: '',
      successMsg: '',
      isProfileSuccess: '',
      profileSuccessMsg: '',
      pan: null, // "ABCTY1234D",
      firstname: '',
      lastname: '',
      userstatus: 'PENDING',
      sfid: '',
      product: '',
      email: '',
      mobile: '',
      card: '',
      loan_amount: '',
      profileId: null,
      panId: null,
      frontId: null,
      backId: null,
      limit: 0,
      dob: '', //new Date
      gender: '',
      pincode: '',
      address_pin: '',
      address: '',
      state: '',
      city: '',
      addressList: [],
      addressProof: [],
      camReport: '',
      selectedAddress: '',
      current_address: 0,
      selectedLeadAddress: '',
      profession: '',
      selectedTab: 1,
      defaultTab: 0,
      profileType: '',
      profileBase: '',
      panType: '',
      panBase: '',
      frontProofType: '',
      frontAadharProofBase: '',
      backAadharProofBase: '',
      frontDrivingProofBase: '',
      backDrivingProofBase: '',
      frontVoterProofBase: '',
      backVoterProofBase: '',
      frontPassportProofBase: '',
      backPassportProofBase: '',
      backProofType: '',
      bankDocument: [],
      selectedPlan: '',
      frontFileType: 0,
      backFileType: 0,
      panFileType: 0,
      ifsc: '',
      acc_name: '',
      acc_no: '',
      bank: '',
      resident_type: '',
      showDocument: '',
      modalTitle: '',
      net_tenure: '',
      loan_amount: '',
      upfront_amount: '',
      emi_amount: '',
      loan_startdate: '',
      interest_rate: '',
      moratorium_type: '',
      moratorium_duration: '',
      moratorium_amount: '',
      aadhar_number: '',
      statementBase: null,
      statementType: null,
      nextDet: null,
      prevDet: null,
      current_status: 'Closed',
      bank_data: [],
      alldoccount: '',
      bureaurs: [],
      harddata: {},
      martialstatus: '',
      sector: '',
      occupation: '',
      Bankstatement: '',
      slip: '',
      driving_dl: '',
      datarrr: [],
      foiremi: '',
      otherDocData: [],
      email_search: [],
      selected: [],
      selectedItem: [],
      selectGroup: [],
      bureaurData: [],
      html_code: '',
      bank_statement_list: [],
      salary_slip_list: [],
      show_docType: '',
      currentAddress: {}


    };
    this.getDocDetails = this.getDocDetails.bind(this);
  }

  componentDidMount() {
    const { lead_id } = this.props
    this.props.dispatch(getGroupList({ "lender_sfid": localStorage.getItem('user_sfid') })).then(res => {
      if (res.status == "success") {
        this.setState({ groupData: res.data })
      }
    })
    this.getLeadDetails(lead_id);
    let datar = {
      opp_sfid: lead_id
    }
    this.props.dispatch(getRepayment(datar)).then((response) => {
      console.log('RRR', response)
      if (response.status === "success") {
        this.setState({
          datarrr: response.repaySchedule

        })
      }
    });
  }

  getDocDetails = (type, finType) => {
    this.setState({
      imageObj: null,
    })
    let dataObj = {
      sfid: this.state.userId,
      doc_type: type
    }
    this.props.dispatch(getDocByType(dataObj)).then(response => {
      if (response.status == "success") {
        let imageDetails = response.imageData
        let imgArr = []
        let imgType = ""
        for (let i = 0; i < imageDetails.length; i++) {
          const singImg = imageDetails[i];
          if (type == "Financial") {
            if (finType == singImg.document_type) {
              imgArr.push('data:application/pdf;base64,' + singImg.base64.base64)
              imgType = singImg.filetype
            }
          } else {
            imgType = singImg.filetype
            imgArr.push('data:image/jpg;base64,' + singImg.base64.base64)
          }
        }
        if (imgArr.length == 0) {
          this.setState({ apiCall: NODOC })
        }
        this.setState({
          imageObj: imgArr,
          imageTypeis: imgType
        })
      } else {
        this.setState({ apiCall: FAIL })
      }
    })
      .catch(error => {
        console.log("error")
        this.setState({ apiCall: FAIL })
      })
  }

  getLeadDetails = (lead_id) => {
    let opp_data = {
      opportunity_sfid: lead_id,
      current_status: this.state.current_status
    }
    this.props.dispatch(getLenderLeadDetails(opp_data)).then((response) => {
      if (response.status === "success") {
        let getData = response.data;
        let planData = response.data.plan;
        let prodData = response.data.product_details;
        let gender = getData && getData.gender__c ? getData.gender__c : '';
        this.setState({
          userId: getData && getData.sfid,
          firstname: getData && getData.first_name__c ? getData.first_name__c : '',
          lastname: getData && getData.last_name__c ? getData.last_name__c : '',
          aadhar_number: getData && getData.aadhar_number__c ? getData.aadhar_number__c : null,
          userstatus: getData && getData.account_status__c ? getData.account_status__c : 'PENDING',
          sfid: getData && getData.opp_sfid ? getData.opp_sfid : '02398123',
          email: getData && getData.email__c ? getData.email__c : '',
          mobile: getData && getData.phone ? getData.phone : '',
          pan: getData && getData.pan_number__c ? getData.pan_number__c : null,
          card: 'XXXXXXX76A',
          dob: getData && getData.date_of_birth_applicant__c ? getData.date_of_birth_applicant__c : '',
          pincode: getData && getData.pin_code__c ? getData.pin_code__c : '',
          gender: gender,
          selectedAddress: getData && getData ? getData.current_address : 0,
          rent_amount: getData && getData.rent_amount__c ? getData.rent_amount__c : '',
          house: getData && getData.rent_amount__c ? 2 : 1,
          profession: getData && getData.employer_type__c ? getData.employer_type__c : '',
          resident_type: getData && getData.resident_type__c ? getData.resident_type__c : '',
          monthly_income: getData && getData.monthly_income__c ? getData.monthly_income__c : null,
          company_name: getData && getData.employer_name__c ? getData.employer_name__c : '',
          product: prodData && prodData.name ? prodData.name : '',
          loan_amount: planData && planData.loan_amount__c ? planData.loan_amount__c : '0',
          net_tenure: planData && planData.net_tenure__c ? planData.net_tenure__c : '',
          upfront_amount: planData && planData.down_payment__c ? planData.down_payment__c : '0',
          emi_amount: planData && planData.emi_amount__c ? planData.emi_amount__c : '0',
          loan_startdate: planData && planData.first_emi_date__c ? planData.first_emi_date__c : '',
          interest_rate: planData && planData.fixed_rate__c ? planData.fixed_rate__c : '',
          currentAddress: getData && getData.current_address ? getData.current_address : {},
          moratorium_type: planData && planData.moratorium_type__c ? planData.moratorium_type__c : '',
          moratorium_duration: planData && planData.moratorium_duration__c ? planData.moratorium_duration__c : '',
          moratorium_amount: planData && planData.moratorium_amount__c ? planData.moratorium_amount__c : '0',
          nextDet: getData && getData.nextDet ? getData.nextDet : null,
          prevDet: getData && getData.prevDet ? getData.prevDet : null,
          martialstatus: getData && getData.marital_status__c ? getData.marital_status__c : '-',
          occupation: getData && getData.occupation__c ? getData.occupation__c : '-',
          Bankstatement: getData && getData.bank_statement ? getData.bank_statement : null,
          opp_status: getData && getData.opp_status ? getData.opp_status : '-',
          slip: getData && getData.salary_slip ? getData.salary_slip : null,
          driving_dl: getData && getData.driving_license__c ? getData.driving_license__c : null,
          sector: getData && getData.industry ? getData.industry : '-',
          foiremi: getData && getData.foir ? getData.foir : '0',
          title_satge: getData && getData.stage ? getData.stage : 'N/A',

        })
        this.getLeadProfile(getData.sfid);
      }
    });
  }

  openLeads = async (id) => {
    await this.props.dispatch(openLeadProfileModel(id));
    this.getLeadDetails(id);
  }

  setDocument = (value, mtitle) => {
    this.setState({ showDocument: value });
    this.setState({ modalTitle: mtitle });
  }

  base64toBlob = (data) => {
    let url = "data:application/pdf;base64," + data;
    return url;
  }
  openRaiseQuery = () => {
    this.props.dispatch(openRaiseQuery());
  }
  generatePDF = async () => {
    const pdfData = document.getElementById('content');
    const canvas = await html2canvas(pdfData);
    const data = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight =
      (imgProperties.height * pdfWidth) / imgProperties.width;

    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('print.pdf');
  }

  getLeadProfile = (user_sfid) => {
    let data = {
      user_sfid: user_sfid
    }
    // this.props.dispatch(getLeadProfile(data)).then((response)=>{
    //     if(response.status ==="success")
    //     {
    //         let getData = response.data;
    //         let account_profile = getData.account_profile?getData.account_profile:'';
    //         let gender = getData.gender__c?getData.gender__c.toLowerCase():'';
    //         this.setState({
    //             firstname: getData.first_name__c,
    //             lastname: getData.last_name__c,
    //             userstatus: getData.account_status__c?getData.account_status__c:'PENDING',
    //             sfid: getData.id?getData.id:'02398123',
    //             product: 'Macbook Pro 2021 Silver Notebook',
    //             email: getData.email__c,
    //             mobile: getData.phone,
    //             pan: getData.pan_number__c,
    //             card: 'XXXXXXX76A',
    //             dob: getData.date_of_birth_applicant__c,
    //             loan_amount: '56,000',
    //             pincode: getData.pin_code__c,
    //             gender: gender,
    //             selectedAddress: account_profile?account_profile.current_address:0,
    //             rent_amount: getData.rent_amount__c,
    //             house: getData.rent_amount__c?2:1,
    //             profession: getData.employer_type__c,
    //             resident_type: getData.resident_type__c,
    //             monthly_income: getData.monthly_income__c?getData.monthly_income__c:'',
    //             company_name: getData.employer_name__c?getData.employer_name__c:''
    //         })
    //     }
    // });
    this.props.dispatch(getAddress(data)).then((response) => {
      if (response.status === "success") {
        let getData = response.data;
        this.setState({
          addressList: getData,
          // currentAddress: response.current_address
        })
      }
    });

    this.props.dispatch(getAddressProofDoc({ sfid: user_sfid, doc_type: "Address" })).then((response) => {
      if (response.status === "success") {
        let getData = response.imageData;
        this.setState({
          addressProof: getData,
        })
      }
    });
    this.props.dispatch(getAddressProofDoc({ sfid: user_sfid, doc_type: "Photo" })).then((response) => {
      if (response.status === "success") {
        let getData = response.imageData;
        if (getData && getData.length > 0) {
          this.setState({
            profileBase: getData && getData[0] && getData[0].base64 && getData[0].base64.base64 ? "data:image/jpg;base64," + getData[0].base64.base64 : "",
          })
        }
      }
    });
    let proData = {
      sfid: user_sfid,
      token: this.props.salesForceToken
    }

    let data3 = {
      user_sfid: user_sfid
    }
    this.props.dispatch(getDocumentCount(data3)).then((response) => {
      console.log('ffffff', response)
      if (response.status === "success") {
        this.setState({
          alldoccount: response.docCount[0]
        })
      }
    });

    let data1 = {
      user_sfid: user_sfid
      // user_sfid: '00171000008GxnVAAS'
    }


    this.props.dispatch(geBbureau(data1)).then((response) => {
      //console.log('qqqq', response)
      if (response.status === "success") {
        this.setState({
          bureaurs: response.bureauDet,
        })
      }
    });
    this.props.dispatch(getAddressProofDoc({ sfid: user_sfid, doc_type: "Bureau" })).then((response) => {
      //console.log('qqqq', response)
      if (response.status === "success") {
        if (response.imageData.StatusCode && response.imageData.StatusCode == 200) {
          this.setState({
            bureaurData: response.imageData.base64,
          })
        }
      }
    });
    let data2 = {
      id: user_sfid
      //id: '00171000008Gwt6AAC'
    }

    this.props.dispatch(geBbureauHardpull(data2)).then((response) => {
      console.log('zzzz', response)
      if (response.status === "success") {
        this.setState({
          harddata: response.data.result.listBureauLiabs[0]
        })
      }
    });
    let kycDocJSON = {
      sfid: user_sfid,
      // sfid: '001C40000030qhjIAA',
      doc_type: "KYC"
    }
    this.props.dispatch(getAddressProofDoc(kycDocJSON)).then((response) => {
      if (response.status === "success") {
        let getData = response.imageData;
        this.setState({ kycDoc: getData, })
        if (getData.base64 !== undefined && getData.base64 !== "") {
          this.setState({
            profileBase: "data:image/jpg;base64," + getData.base64.base64,
            profileType: "image/jpg",
            // profileId: getData.id
          });
        }
      }
    });
    let financialDocJSON = {
      sfid: user_sfid,
      // sfid: '001C40000030qhjIAA',
      doc_type: "Financial"
    }
    this.props.dispatch(getAddressProofDoc(financialDocJSON)).then((response) => {
      console.log('zzzzzqqq', response)
      if (response.status === "success") {
        let getData = response.imageData;
        if (getData !== undefined && getData !== "") {

          this.setState({
            bank_data: getData
          });

          let bank_statement_list = getData.filter((obj) => {
            return obj.base64["Document Type"].includes("Bank Statement")
          })


          let salary_slip_list = getData.filter((obj) => {
            return obj.base64["Document Type"].includes("Salary Slip")
          })

          this.setState({ bank_statement_list: bank_statement_list, salary_slip_list: salary_slip_list })

        }
      }
    });


    this.props.dispatch(getLeadPanDocuemnt(proData)).then((response) => {
      if (response.status === "success") {
        let getData = response.data;
        if (getData.base64 !== undefined && getData.base64 !== "") {
          let resData = getData.base64;
          let type = 0;
          let DocBase = ""
          // if(resData.formate !==null )
          // {
          //     if(resData.formate ==="application/pdf")
          //     {
          //         type=2;
          //         DocBase = "data:application/pdf;base64,"+resData.base64.base64;
          //     }else{
          //         type=1;
          //         DocBase = "data:image/jpg;base64,"+resData.base64.base64;
          //     }

          // }
          DocBase = "data:image/jpg;base64," + resData.base64;
          this.setState({
            //panFileType: type,
            panBase: DocBase,
            //panType: resData.formate,
            //panId: resData.id
          });
        }
      }
    });

    let otherDocJSON = {
      sfid: user_sfid,
      // sfid: '001C40000030qhjIAA',
      doc_type: "All"
    }
    this.props.dispatch(getAddressProofDoc(otherDocJSON)).then((response) => {
      if (response.status === "success") {
        this.setState({ otherDocData: response.imageData })
        let getData = response;
        // if (getData.aadharfrontdata !== undefined && getData.aadharfrontdata !== "") {
        //   let resData = getData.aadharfrontdata.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     frontFileType: type,
        //     frontAadharProofBase: DocBase,
        //     selectedTab: 1,
        //     defaultTab: 1,
        //     //frontProofType: resData.formate?resData.formate:'',
        //     //frontId: resData.id
        //   });
        // }
        // if (getData.driving !== undefined && getData.driving !== "") {
        //   let resData = getData.driving.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     frontFileType: type,
        //     frontDrivingProofBase: DocBase,
        //     selectedTab: 2,
        //     defaultTab: 2,
        //     //frontProofType: resData.formate?resData.formate:'',
        //     //frontId: resData.id
        //   });
        // }
        // if (getData.voterfrontdata !== undefined && getData.voterfrontdata !== "") {
        //   let resData = getData.voterfrontdata.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }

        //   this.setState({
        //     frontFileType: type,
        //     frontVoterProofBase: DocBase,
        //     selectedTab: 3,
        //     defaultTab: 3,
        //     //frontProofType: resData.formate?resData.formate:'',
        //     //frontId: resData.id
        //   });
        // }
        // if (getData.passport !== undefined && getData.passport !== "") {
        //   let resData = getData.passport.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     frontFileType: type,
        //     frontPassportProofBase: DocBase,
        //     selectedTab: 4,
        //     defaultTab: 4,
        //     //frontProofType: resData.formate?resData.formate:'',
        //     //frontId: resData.id
        //   });
        // }

        // if (getData.aadharbackdata !== undefined && getData.aadharbackdata !== "") {
        //   let resData = getData.aadharbackdata.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     backFileType: type,
        //     backAadharProofBase: DocBase,
        //     selectedTab: 1,
        //     defaultTab: 1,
        //     // backProofType: resData.formate?resData.formate:'',
        //     //backId: resData.id
        //   });
        // }
        // if (getData.driving !== undefined && getData.driving !== "") {
        //   let resData = getData.driving.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     backDrivingProofBase: DocBase,
        //     backFileType: type,
        //     selectedTab: 2,
        //     defaultTab: 2,
        //     //backProofType: resData.formate?resData.formate:'',
        //     //backId: resData.id
        //   });
        // }
        // if (getData.voterbackdata !== undefined && getData.voterbackdata !== "") {
        //   let resData = getData.voterbackdata.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     backFileType: type,
        //     backVoterProofBase: DocBase,
        //     selectedTab: 3,
        //     defaultTab: 3,
        //     // backProofType: resData.formate?resData.formate:'',
        //     // backId: resData.id
        //   });
        // }
        // if (getData.passport !== undefined && getData.passport !== "") {
        //   let resData = getData.passport.base64;
        //   let type = 0;
        //   let DocBase = ""
        //   if (resData) {
        //     // if(resData.formate ==="application/pdf")
        //     // {
        //     //     type=2;
        //     //     DocBase = "data:application/pdf;base64,"+resData.base;
        //     // }else{
        //     //     type=1;
        //     //     DocBase = "data:image/jpg;base64,"+resData.base;
        //     // }
        //     DocBase = "data:image/jpg;base64," + resData.base64;
        //   }
        //   this.setState({
        //     backFileType: type,
        //     backPassportProofBase: DocBase,
        //     selectedTab: 4,
        //     defaultTab: 4,
        //     //backProofType: resData.formate?resData.formate:'',
        //     //backId: resData.id
        //   });
        // }
      }
    });

  }

  kycDocumentsDownload = () => {
    if (this.state.panBase) {
      this.downloadKyc(this.state.panBase);
    }
    if (this.state.profileBase) {
      this.downloadKyc(this.state.profileBase);
    }
    if (this.state.frontAadharProofBase) {
      this.downloadKyc(this.state.frontAadharProofBase);
    }
    if (this.state.backAadharProofBase) {
      this.downloadKyc(this.state.backAadharProofBase);
    }
    if (this.state.frontDrivingProofBase) {
      this.downloadKyc(this.state.frontDrivingProofBase);
    }
    if (this.state.backDrivingProofBase) {
      this.downloadKyc(this.state.backDrivingProofBase);
    }
    if (this.state.frontPassportProofBase) {
      this.downloadKyc(this.state.frontPassportProofBase);
    }
    if (this.state.backPassportProofBase) {
      this.downloadKyc(this.state.backPassportProofBase);
    }
    if (this.state.frontVoterProofBase) {
      this.downloadKyc(this.state.frontVoterProofBase);
    }
    if (this.state.backVoterProofBase) {
      this.downloadKyc(this.state.backVoterProofBase);
    }
  }

  financialDocumentsDownload = () => {
    let proData = {
      sfid: this.state.sfid,
      token: this.props.salesForceToken
    }
    this.props.dispatch(getBankDocuemnt(proData)).then((response) => {
      if (response.status === "success") {
        let getData = response.data;
        if (getData !== undefined && getData !== "") {
          getData.map(function (object) {
            let url = "data:application/pdf;base64," + object.base64.base64;
            const linkSource = `${url}`;
            const downloadLink = document.createElement("a");
            const fileName = "stmt.pdf";
            downloadLink.href = linkSource;
            downloadLink.download = fileName;
            downloadLink.click();

          });
        }
      }
    });

  }

  downloadKyc(imgSrc) {
    const linkSource = `${imgSrc}`;
    const downloadLink = document.createElement("a");
    const fileName = "image.jpeg";
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  handleDownloadAll = () => {
    this.kycDocumentsDownload();
    this.financialDocumentsDownload();
  }
  handleEmailSearch = (event) => {
    this.setState({ [event.target.name]: event.target.value });
    let str = event.target.value
    if (str && str.length > 2) {
      let data = { search_name: str }
      this.props.dispatch(groupEmailSearch(data)).then(res => {
        if (res && res.length > 0) {
          this.setState({ email_search: res })
        }
      });
    } else {
      this.props.dispatch(clearEmailSearch());
    }
  }
  selectGroup = (item) => {
    let groupSelected = this.state.selectGroup
    let groupIdExist = groupSelected.includes(item.id)
    if (!groupIdExist) {
      groupSelected.push(item.id)
      this.setState({ selectGroup: groupSelected })
    } else {
      let index = this.state.selectGroup && this.state.selectGroup.findIndex(ele => ele == item.id)
      this.state.selectGroup && this.state.selectGroup.splice(index, 1)
      this.setState({ selectGroup: this.state.selectGroup })
    }

  }
  onSelectClick = async (row) => {
    if (this.state.selected < 0) {
      let selectEmail = []
      selectEmail.push(row)
      this.setState({ selected: selectEmail }, () => {
        this.setState({
          email_search: "",
          email_cam: ""
        })
      })
    } else {
      let findEmail = this.state.selected && this.state.selected.find(ele => ele.email == row.email)
      if (!findEmail) {
        this.state.selected && this.state.selected.push(row)
        this.setState({ selected: this.state.selected }, () => {
          this.setState({
            email_search: "",
            email_cam: ""
          })
        })
      } else {
        this.setState({
          email_search: "",
          // email_cam : ""
        })
      }
    }
  };
  renderSearch = (getData) => {
    return getData && getData.length ? (
      <ul className="suggestions">
        {getData.map((item, index) => {
          let className;
          const getData = this.state.selectedItem;
          const isExist = getData.find(ele => ele.email == item.email);
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
  removeEmail = (item) => {
    let index = this.state.selected && this.state.selected.findIndex(ele => ele.email == item)
    this.state.selected && this.state.selected.splice(index, 1)
    this.setState({ selected: this.state.selected })
  }
  sendEmailCAM = async () => {
    let emailRecId = []
    this.state.selected && this.state.selected.map(ele => {
      emailRecId.push(ele.recipient_id)
    })
    let pdfData = document.getElementById('content');
    let canvas = await html2canvas(pdfData);
    let data = canvas.toDataURL('image/png');
    let base64 = data.split(',')
    let emailObj = {
      email_recipient: emailRecId,
      group_id: this.state.selectGroup,
      file: base64 && base64.length > 0 ? base64[1] : data
    }
    this.props.dispatch(sendEmailCAM(emailObj)).then(res => {
      if (res.status == 'success') {
        this.setState({
          selected: [],
          selectGroup: [],
          email_search: [],
          email_cam: "",
          errorMsg: ""
        })
      }
    })
    console.log('emailObjemailObj', JSON.stringify(emailObj))
  }
  render() {
    const { isLoading, isLoggedIn, message, lead_id, lead_profile, salesForceToken, user_id } = this.props;
    if (!user_id) {
      return <Redirect to="/login" />
    }
    const { selectedTab, addressList, bank_data, bureaurs, harddata, datarrr, bureaurData, currentAddress } = this.state
    return (
      <>
        <Helmet>
          <title>Lead - Details </title>
        </Helmet>
        {isLoading ? (
          <div className="loading">Loading&#8230;</div>
        ) : ''}
        <div id="wrapper">
          <Sidebar />
          <RaiseQueryPopup
            dispatch={this.props.dispatch}
            open_raise_query={this.props.open_raise_query}

          />
          <div id="content-wrapper" className="d-flex flex-column">

            <div className="container-fluid lead_details_header">
              <div className="row align-items-center">
                <div className="d-flex">
                  <div style={{ flex: '1' }}>
                    <div className="backicon float-left"><a href="/closed"> <img src="img/icon_back.svg" /></a></div>
                    <div className="d-flex">
                      <div className="pr_img">
                        {this.state.profileBase ? <img className="img-profile rounded-circle img_icon_width" src={this.state.profileBase} />
                          : <img className="img-profile rounded-circle" src="img/undraw_profile.svg" />}
                      </div>
                      <div className="pr_texts">
                        <h5 className="d-block">{this.state.sfid} <span><b>Closed</b></span></h5>
                        <p>{this.state.firstname} {this.state.lastname}<span className="mailid ml-3"><img src="img/icon_mail.svg" />{this.state.email}</span><span className="contactnum"><img src="img/icon_call.svg" /> {this.state.mobile}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* <form action="" className="search-form nav_search">
                    <div className="form-group has-feedback">
                      <label htmlFor="search" className="sr-only">Search</label>
                      <input type="text" className="form-control" name="search" id="search" placeholder="Find Cases, Users" />
                    </div>
                  </form> */}


                  {/* <ul className="topicon_lists">
                    <li>
                      <a href="#">
                        <img src="images/ques.svg" />
                      </a> Raise Query
                    </li>
                    <li>
                      <a href="#">
                        <img src="images/messages.svg" />
                      </a> Email Cam
                    </li>
                    <li>
                      <a href="#" onClick={this.generatePDF}>
                        <img src="images/download.svg" />
                      </a> Download
                    </li>
                  </ul> */}

                  <Header
                    title={'lead_details'}
                    isSearchEnable={true}
                    dispatch={this.props.dispatch}
                    type={"global"}
                    history={this.props.history}
                  />

                  <ul className="topicon_lists" style={{ display: 'flex', gap: '5px' }}>
                    <a href={void (0)}>
                      <button type="button" class="btn btn-primary" style={{
                        border: "1px solid #1A1A1A",
                        filter: 'drop-shadow(0px 10px 35px rgba(0, 0, 0, 0.1))',
                        borderRadius: '7.5px'
                      }} onClick={this.openRaiseQuery}>
                        <img src="images/ques.svg" />   Raise Query
                      </button>
                    </a>
                    <a href={void (0)}>
                      <button data-toggle="modal" data-target="#exampleModalRight" type="button" class="btn btn-primary" style={{
                        border: "1px solid #1A1A1A",
                        filter: 'drop-shadow(0px 10px 35px rgba(0, 0, 0, 0.1))',
                        borderRadius: '7.5px'
                      }} >
                        <img src="images/messages.svg" /> Email CAM
                      </button>
                    </a>
                    <div className="emailcam">
                      <div class="modal fade drawer right-align" id="exampleModalRight" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                          <div class="modal-content">
                            <div class="modal-header">
                              <h5 class="modal-title" id="exampleModalLabel">Email CAM</h5>
                              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                              </button>
                            </div>

                            <div class="modal-body">
                              <div className="recBox">
                                <input type="text" className="recipientInput" name="email_cam" value={this.state.email_cam} placeholder="Add Recipient" onChange={this.handleEmailSearch} />
                                {this.renderSearch(this.state.email_search)}
                                <div className="recInputList">
                                  <ul>
                                    {this.state.selected && this.state.selected.length > 0 && this.state.selected.map(ele => {
                                      return (
                                        <><li>{ele.email} <img src="images/icons/icon-close2.png" alt="" onClick={e => this.removeEmail(ele.email)} /></li><br /></>)
                                    })}
                                  </ul>
                                </div>
                              </div>

                              <div class="camGroup">
                                <h5>Email CAM to my groups</h5>

                                {this.state.groupData && this.state.groupData.length > 0 && this.state.groupData.map(ele => {

                                  return (<div class="panel-group emailCMApopu" id="accordion" role="tablist" aria-multiselectable="true">
                                    <div class="panel panel-default">
                                      <div class="panel-heading" role="tab" id="headingOne">
                                        <h4 class={"panel-title  imgOpacity"}>
                                          <img src={this.state.selectGroup && this.state.selectGroup.includes(ele.id) ? "images/icons/check-square.svg" : "images/icons/checkbox_noright.svg"} alt="" onClick={e => this.selectGroup(ele)} />
                                          <a class="accordion-toggle" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                            {ele.title}
                                          </a>
                                        </h4>
                                      </div>
                                      <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                        <div class="panel-body">
                                          <ol>
                                            {ele.email && ele.email.length > 0 && ele.email.map(obj => { return (<li>{obj && obj.email}</li>) })}
                                          </ol>
                                        </div>
                                      </div>
                                    </div>

                                  </div>)
                                })
                                }
                              </div>
                            </div>

                            <div class="modal-footer">
                              {this.state.errorMsg ? <p style={{ color: "red" }} className="ml-2 pt-1">{'Please select group and email'}</p> : ""}
                              <button type="button" class="clearBtn1" onClick={e => {
                                e.preventDefault()
                                this.setState({
                                  selected: [],
                                  selectGroup: [],
                                  email_search: [],
                                  email_cam: ""
                                })
                              }}>Clear</button>
                              <button type="button" class="emailBtn1" data-dismiss={this.state.selectGroup && this.state.selectGroup.length > 0 && this.state.selected && this.state.selected.length > 0 ? "modal" : ""} onClick={e => {
                                this.state.selectGroup && this.state.selectGroup.length > 0 && this.state.selected && this.state.selected.length > 0 ? this.sendEmailCAM() : this.setState({ errorMsg: true })
                              }} >Email CAM</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <a
                      onClick={this.generatePDF}
                    >
                      <button type="button" class="btn btn-primary" style={{
                        border: "1px solid #1A1A1A",
                        filter: 'drop-shadow(0px 10px 35px rgba(0, 0, 0, 0.1))',
                        borderRadius: '7.5px'
                      }}>
                        <img src="images/download.svg" class="rounded" /> Download case
                      </button>
                    </a>
                  </ul>

                </div>
                <div className="col-md-12">
                  <div className="row mt-3">
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
                            Application Details
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
                            Documents
                          </a>
                          {this.state.opp_status == "Closed" || this.state.opp_status == "Disbursed" || this.state.opp_status == "Loan Disbursed" || this.state.title_satge == "Closed" || this.state.title_satge == "Disbursed" || this.state.title_satge == "Loan Disbursed" ? <a
                            className="nav-item nav-link"
                            id="nav-repayments-tab"
                            data-toggle="tab"
                            href="#nav-repayments"
                            role="tab"
                            aria-controls="nav-repayments"
                            aria-selected="false"
                          >
                            Repayments
                          </a> : ""}
                        </div>
                      </nav>
                    </div>
                    {/* <div className="col-md-4 text-right tbuttons">
      <button className="btn btn-dark mr-4"><img src="img/icon_approve.svg" /> Approve</button>
      <button className="btn btn-primary"><img src="img/icon_declare.svg" /> Decline</button>
  </div> */}
                  </div>

                </div>
              </div>
            </div>
            <div id="content">

              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-12 pt-2">
                    <div className="card">
                      <div className="card-body">
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade active show"
                            id="nav-appdetails"
                            role="tabpanel"
                            aria-labelledby="nav-appdetails-tab"
                          >
                            <div className="row">
                              <div className="col-md-3">
                                <div className="whiteboxed">
                                  <h6>Financial Borrower Details </h6>
                                  <h4><b> {this.state.firstname} {this.state.lastname}</b></h4>
                                  <div className="personinfo">{this.state.gender} <span className="dob"> {dateFormat(this.state.dob, "dd-mmm-yy")}</span><span className="maritalstatus">{this.state.martialstatus}</span></div>
                                  <ul className="prooflist">
                                    <li className="card">
                                      PAN Number
                                      {
                                        this.state.pan ?
                                          <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.getDocDetails('PAN')} data-toggle="modal" data-target="#docModel">{this.state.pan}</span>
                                          : <span>N/A</span>
                                      }
                                    </li>
                                    <li className="aadhaar">
                                      Aadhar Number
                                      {
                                        this.state.aadhar_number ?
                                          <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.getDocDetails('Aadhar')} data-toggle="modal" data-target="#docModel">{this.state.aadhar_number}</span>
                                          : <span>N/A</span>
                                      }
                                    </li>
                                    <li className="card">
                                      Driving License
                                      {
                                        this.state.driving_dl ?
                                          <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.getDocDetails('DL')} data-toggle="modal" data-target="#docModel">{this.state.driving_dl}</span>
                                          : <span>N/A</span>
                                      }
                                    </li>
                                  </ul>
                                  <h4><b>Income Details</b></h4>
                                  <div className="personinfo">{this.state.occupation} <span className="profession"> {this.state.sector}</span><span className="companydetails">{this.state.company_name}</span></div>
                                  <ul className="prooflist">
                                    <li className="wallet">
                                      Monthly Income
                                      {
                                        this.state.monthly_income ?
                                          <span>₹ {this.state.monthly_income}</span>
                                          : <span>N/A</span>
                                      }
                                    </li>
                                    <li className="stmt">
                                      Bank Statement
                                      {
                                        // this.state.Bankstatement ?
                                        //   <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.getDocDetails('Financial', 'Bank Statement')} data-toggle="modal" data-target="#docModel">{this.state.Bankstatement}</span>
                                        //   : <span>N/A</span>

                                        this.state.bank_statement_list.length > 0 ?
                                          <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.setState({ show_docType: "bank_statement_list" })} data-toggle="modal" data-target="#doc_type_Model">{this.state.bank_statement_list.length}</span>
                                          : <span>N/A</span>

                                      }
                                    </li>
                                    <li className="doc">
                                      Salary Slips
                                      {
                                        // this.state.slip ?
                                        //   <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.getDocDetails('Financial', 'Salary Slip')} data-toggle="modal" data-target="#docModel">{this.state.slip}</span>
                                        //   : <span>N/A</span>

                                        this.state.salary_slip_list.length > 0 ?
                                          <span style={{ color: "#1251F1", cursor: "pointer" }} onClick={() => this.setState({ show_docType: "salary_slip_list" })} data-toggle="modal" data-target="#doc_type_Model">{this.state.salary_slip_list.length}</span>
                                          : <span>N/A</span>
                                      }
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-md-5">
                                <div className="whiteboxed">
                                  <h6>Product Plan Details</h6>
                                  <div className="row">
                                    <div className="col-md-7">
                                      <h4>{this.state.product} <span>(Tenure- {this.state.net_tenure} Months)</span></h4>
                                    </div>
                                    <div className="col-md-5">
                                      <div className="d-flex">
                                        <div className="col-md-6 pl-0 pr-0">
                                          <h5 className="s1">FOIR post Eduvanz EMI</h5></div>
                                        <div className="">
                                          <div style={{ width: 80, height: 80 }}>
                                            <CircularProgressbar
                                              value={this.state.foiremi}
                                              text={`${this.state.foiremi}%`}
                                              styles={buildStyles({
                                                textColor: "#4BCA81",
                                                pathColor: "#4BCA81",
                                                trailColor: "#d0cecd"
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="table-responsive">
                                    <table className="billed" cellSpacing="0" cellPadding="0">
                                      <tbody>
                                        <tr>
                                          <td><img src="img/icon_bank.svg" /></td>
                                          <td>Loan Amount</td>
                                          <td className="text-right"><b>₹ {this.state.loan_amount}</b></td>
                                        </tr>
                                        <tr>
                                          <td></td>
                                          <td><span>Upfront Amount</span><img src="img/icon_iicon.svg" /></td>
                                          <td className="text-right">₹ {this.state.upfront_amount}</td>
                                        </tr>
                                        <tr>
                                          <td></td>
                                          <td><span>Monthly Amount </span><span className="d-block">( from {dateFormat(this.state.loan_startdate, "dd-mm-yyyy")} )</span></td>
                                          <td className="text-right">₹ {this.state.emi_amount}</td>
                                        </tr>
                                        <tr>
                                          <td><img src="img/icon_money.svg" /></td>
                                          <td>Total Payable <span>(APR {this.state.interest_rate}%)</span> <img src="img/icon_iicon.svg" /> </td>
                                          <td className="text-right"><b>₹ {(Number(this.state.emi_amount) * Number(this.state.net_tenure)) + Number(this.state.upfront_amount)}</b></td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                  <div className="d-block full_border"></div>
                                  <h4> <b>Principle Moratorium</b><span>( {this.state.moratorium_duration} months )</span></h4>
                                  {/* <h4>{this.state.moratorium_type} <span>( {this.state.moratorium_duration} months )</span></h4> */}
                                  <ul className="timeliner">
                                    <li className="started w40"><span></span>₹ {this.state.moratorium_amount} <label>per month</label></li>
                                    <li className="inProgress w60"><span></span>₹ {this.state.moratorium_amount} <label>per month</label></li>
                                    <li className="completed"><span></span></li>
                                  </ul>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="whiteboxed">
                                  <h6>Residential Stability</h6>
                                  <h4><b>Addresses</b></h4>
                                  <ul className="Addresses mt-3">
                                    <h5>Permanent Address</h5>
                                    {addressList && addressList.length > 0 &&
                                      (
                                        addressList.map((item, index) => (
                                          <>
                                            {
                                              item.consolidated_address__c &&
                                              <>
                                                <li key={index}>
                                                  <p>{item.consolidated_address__c}</p>
                                                  <button className="btn btn-small">{this.state.resident_type ? this.state.resident_type : ''}</button>
                                                </li>
                                              </>
                                            }
                                          </>
                                        ))
                                      )
                                    }
                                    {currentAddress && Object.keys(currentAddress).length > 0 && currentAddress.current_address__c &&
                                      <>
                                        {currentAddress.type_of_address__c === 'Permanent address'
                                          ?
                                          <h5>Current Address Same as Permanent</h5>
                                          :
                                          <h5>Current Address</h5>
                                        }
                                        <li>
                                          <p>{currentAddress.consolidated_address__c}

                                          </p>
                                          {this.state.resident_type ?
                                            <button className="btn btn-small"> {this.state.resident_type} </button>
                                            : ''}
                                        </li>
                                      </>
                                    }
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="row mt-5 mb-2">
                              <div className="col-md-12">
                                <div className="whiteboxed">
                                  <div className="row">
                                    <div className="col-md-2">
                                      <h6>Credit Factors</h6>
                                      <h4><b>Bureau Details</b></h4>

                                    </div>
                                    <div className="col-md-10">
                                      <nav className="float-left">
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                          <a
                                            className="nav-item nav-link active"
                                            id="nav-bureau-tab"
                                            data-toggle="tab"
                                            href="#nav-bureau"
                                            role="tab"
                                            aria-controls="nav-bureau"
                                            aria-selected="true"
                                          >
                                            Bureau Analysis
                                          </a>
                                          <a
                                            className="nav-item nav-link"
                                            id="nav-liabilities-tab"
                                            data-toggle="tab"
                                            href="#nav-liabilities"
                                            role="tab"
                                            aria-controls="nav-liabilities"
                                            aria-selected="false"
                                          >
                                            Bureau Liabilities
                                          </a>
                                        </div>
                                      </nav>
                                    </div>
                                  </div>

                                  <div className="row">
                                    <div className="col-md-12 pt-2">
                                      <div className="card">
                                        <div className="card-body">
                                          <div className="tab-content" id="nav-tabContent-1">
                                            <div
                                              className="tab-pane fade active show"
                                              id="nav-bureau"
                                              role="tabpanel"
                                              aria-labelledby="nav-bureau-tab"
                                            >
                                              {
                                                bureaurs && bureaurs.length ? bureaurs.map((item, index) => (
                                                  <div className="row" key={item}>
                                                    <div className="col-md-2">
                                                      <div className="mt-4 position-relative">
                                                        <div className="clock" style={{ marginLeft: '-16px' }}>
                                                          <div className="handel" style={item.cibil_score ? { "transform": "rotate(" + (300 / 900) * item.cibil_score + "deg)" }
                                                            : { "transform": "rotate(60deg)" }}>

                                                          </div>
                                                          <div className="amount-counter">
                                                            <h2 className="mb-2">{item.cibil_score ? item.cibil_score : '0'}</h2>
                                                            <p>BUREAU SCORE</p>
                                                          </div>
                                                          <div className="min-score">300</div>
                                                          <div className="max-score">900</div>
                                                        </div>

                                                      </div>
                                                      {/* <div className="">Add credit Ccore</div> */}
                                                      <ul className="listhwithcounts">
                                                        <li>Bank Accounts<span>{item.bank_account}</span></li>
                                                        <li>Overdues<span>{item.overdues}</span></li>
                                                        <li>0 Balance Ac<span>{item.zero_balance_ac}</span></li>
                                                      </ul>
                                                    </div>

                                                    <div className="col-md-10" >

                                                      <h5 className="s2"><b>Hard Pull Experian</b> <a href="#">View Report</a></h5>
                                                      <h6 className="s1">Borrower's Bureau Analysis <span>Refreshed on: {item.lastmodifieddate}</span></h6>



                                                      <div className="row" >


                                                        <div className="col-md-6">
                                                          <ul className="listhwithcounts right_border">
                                                            <li>No. of Tradelines with 0+ DPD in last 3 months
                                                              <span>{item.thirty_plus_in_last_3_months__c}</span>
                                                            </li>
                                                            <li>No. of Tradelines with 0+ DPD in last 12 months
                                                              <span>{item.zero_plus_in_last_12_months__c}</span>
                                                            </li>
                                                            <li>No. of Tradelines with Overdue Amount {'>'} 0
                                                              <span>{item.over_due_amoun_tgt_0__c}</span>
                                                            </li>
                                                            <li>No. of tradelines with Wilful Default/Settlement/Suit Filed/SMA/LSS/DBT Accounts
                                                              <span>{item.sf_will_fulde_fault_dbt_lsssma_sub__c}</span>
                                                            </li>
                                                          </ul>
                                                        </div>
                                                        <div className="col-md-6">
                                                          <ul className="listhwithcounts">
                                                            <li>No. of Tradelines with 90+ DPD in last 12 months
                                                              <span>{item.ninty_plus_in_last_12_months__c}</span>
                                                            </li>
                                                            <li>No. of Tradelines with 0+ DPD in last 3 months
                                                              <span>{item.zero_plus_in_last_3_months__c}</span>
                                                            </li>
                                                            <li>No. of Tradelines with Overdue Amount{" >"} 5000
                                                              <span>{item.over_due_gt_5000_in_tradeline__c}</span>
                                                            </li>
                                                            <li>Age in bureau (in months)
                                                              <span>{item.age_in_bureau_gt_24_months__c}</span>
                                                            </li>
                                                          </ul>
                                                        </div>
                                                      </div>




                                                    </div>


                                                  </div>
                                                )
                                                ) :

                                                  <div className="row" >
                                                    <div className="col-md-2">
                                                      <div className="mt-4 position-relative">
                                                        {/* <div className="clock" style={{ marginLeft: '-16px' }}>
                                                          <div className="handel" 
                                                          style={this.state.civil_score ? { "transform": "rotate(" + (300 / 900) * this.state.civil_score + "deg)" }
                                                            : { "transform": "rotate(60deg)" }}></div>
                                                          <div className="amount-counter">
                                                            <h2 className="mb-2">{this.state.civil_score ? 782 : 300}</h2>
                                                            <p>BUREAU SCORE</p>
                                                          </div>
                                                          <div className="min-score">300</div>
                                                          <div className="max-score">900</div>
                                                        </div> */}

                                                      </div>
                                                      {/* <div className="">Add credit Ccore</div> */}
                                                      <ul className="listhwithcounts">
                                                        <li>Bank Accounts<span>05</span></li>
                                                        <li>Overdues<span>01</span></li>
                                                        <li>0 Balance Ac<span>01</span></li>
                                                      </ul>
                                                    </div>
                                                    <div className="col-md-10">

                                                      <h5 className="s2"><b>Hard Pull Experian</b> <a href="#" data-toggle="modal" data-target="#buerau_modal">View Report</a></h5>
                                                      <h6 className="s1">Borrower's Bureau Analysis <span>Refreshed on: - </span></h6>
                                                      <div className="row" >
                                                        <div className="col-md-6">
                                                          <ul className="listhwithcounts right_border">
                                                            <li>No. of Tradelines with 0+ DPD in last 3 months
                                                              <span>-</span>
                                                            </li>
                                                            <li>No. of Tradelines with 0+ DPD in last 12 months
                                                              <span>-</span>
                                                            </li>
                                                            <li>No. of Tradelines with Overdue Amount {'>'} 0
                                                              <span>-</span>
                                                            </li>
                                                            <li>No. of tradelines with Wilful Default/Settlement/Suit Filed/SMA/LSS/DBT Accounts
                                                              <span>-</span>
                                                            </li>
                                                          </ul>
                                                        </div>
                                                        <div className="col-md-6">
                                                          <ul className="listhwithcounts">
                                                            <li>No. of Tradelines with 90+ DPD in last 12 months
                                                              <span>-</span>
                                                            </li>
                                                            <li>No. of Tradelines with 0+ DPD in last 3 months
                                                              <span>-</span>
                                                            </li>
                                                            <li>No. of Tradelines with Overdue Amount{" >"} 5000
                                                              <span>-</span>
                                                            </li>
                                                            <li>Age in bureau (in months)
                                                              <span>-</span>
                                                            </li>
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>

                                              }
                                            </div>
                                            <div
                                              className="tab-pane fade"
                                              id="nav-liabilities"
                                              role="tabpanel"
                                              aria-labelledby="nav-liabilities-tab"
                                            >


                                              {

                                                harddata && Object.keys(harddata).length > 0 ?



                                                  <div className="table-responsive" >
                                                    <table className="liabilities" cellSpacing="0" cellPadding="0">
                                                      <thead>
                                                        <tr>
                                                          <th>Active Tradelines</th>
                                                          <th>Tradelines</th>
                                                          <th>O/s Balance</th>
                                                          <th>EMI in Bureau</th>
                                                          <th>Imputed EMI</th>
                                                          <th>Obligated EMI</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td>{harddata.Active_Tradelines__c ? harddata.Active_Tradelines__c : '-'}</td>
                                                          <td>{harddata.Tradelines__c ? harddata.Tradelines__c : '-'}</td>
                                                          <td>₹ {harddata.O_s_Balance__c ? harddata.O_s_Balance__c : '-'}</td>
                                                          <td>₹ {harddata.EMI_in_Bureau__c ? harddata.EMI_in_Bureau__c : '-'}</td>
                                                          <td>₹ {harddata.Imputed_EMI__c ? harddata.Imputed_EMI__c : '-'}</td>
                                                          <td>₹ {harddata.Obligated_EMI__c ? harddata.Obligated_EMI__c : '-'}</td>
                                                        </tr>
                                                        {/* <tr>
                                                      <td>Education Loan</td>
                                                      <td>3</td>
                                                      <td>₹ 35 000</td>
                                                      <td>₹ 7 000</td>
                                                      <td>₹ 7 000</td>
                                                      <td>₹ 7 000</td>
                                                    </tr>
                                                    <tr>
                                                      <th>Total</th>
                                                      <th>4</th>
                                                      <th>₹ 70 000</th>
                                                      <th>₹ 12 000</th>
                                                      <th>₹ 12 000</th>
                                                      <th>₹ 12 000</th>
                                                    </tr> */}
                                                      </tbody>
                                                    </table>
                                                  </div>

                                                  :

                                                  <div className="table-responsive">
                                                    <table className="liabilities" cellSpacing="0" cellPadding="0">
                                                      <thead>
                                                        <tr>
                                                          <th>Active Tradelines</th>
                                                          <th>Tradelines</th>
                                                          <th>O/s Balance</th>
                                                          <th>EMI in Bureau</th>
                                                          <th>Imputed EMI</th>
                                                          <th>Obligated EMI</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        <tr>
                                                          <td>-</td>
                                                          <td>-</td>
                                                          <td>₹ -</td>
                                                          <td>₹ -</td>
                                                          <td>₹ -</td>
                                                          <td>₹ -</td>
                                                        </tr>
                                                        <h4>No bureau liabilities found.</h4>


                                                      </tbody>
                                                    </table>
                                                  </div>
                                              }


                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade"
                            id="nav-documents"
                            role="tabpanel"
                            aria-labelledby="nav-documents-tab"
                          >
                            <div className="d-block pt-3 pb-2 pr-3 pl-3">
                              <div className="row">
                                <div className="col-md-3" >
                                  <ul className="nav nav-tabs" id="verticaltab" role="tablist">
                                    <li className="nav-item">
                                      <a
                                        className="nav-link active"
                                        data-toggle="tab"
                                        href="#kyc"
                                        role="tab"
                                        aria-controls="kyc"
                                      >
                                        KYC Documents ({this.state.kycDoc && this.state.kycDoc.length > 0 ? this.state.kycDoc.length : '0'}) <a onClick={this.kycDocumentsDownload}><img src="images/download.svg" /></a>
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href="#bdocument"
                                        role="tab"
                                        aria-controls="bdocument"
                                      // onClick={this.generatePDF}
                                      >
                                        Bureau Document ({this.state.bureaurData && this.state.bureaurData.length > 0 ? '1' : '0'})
                                        <img src="images/download.svg" />
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href="#fstatements"
                                        role="tab"
                                        aria-controls="fstatements"
                                      >
                                        Financial Statements ({this.state.bank_data && this.state.bank_data.length > 0 ? this.state.bank_data.length : '0'}) <a href={void (0)} onClick={() => this.financialDocumentsDownload()} ><img src="images/download.svg" /></a>
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href="#aproofs"
                                        role="tab"
                                        aria-controls="aproofs"
                                      // onClick={this.generatePDF}
                                      >
                                        Address Proofs <span>({this.state.addressProof && this.state.addressProof.length > 0 ? this.state.addressProof.length : '0'}) </span> <img src="images/download.svg" />
                                      </a>
                                    </li>
                                    <li className="nav-item">
                                      <a
                                        className="nav-link"
                                        data-toggle="tab"
                                        href="#odocuments"
                                        role="tab"
                                        aria-controls="odocuments"
                                      // onClick={this.generatePDF}
                                      >
                                        Other Documents <span>({this.state.otherDocData && this.state.otherDocData.length > 0 ? this.state.otherDocData.length : '0'})</span> <img src="images/download.svg" />
                                      </a>
                                    </li>
                                  </ul>
                                  <div className="row">
                                    <div className="col-md-12 text-right tbuttons">
                                      <button type="button" onClick={this.handleDownloadAll} className="btn btn-primary btn-s1"><img src="images/download.svg" />Download All</button>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-9">
                                  <div className="tab-content">
                                    <div className="tab-pane active" id="kyc" role="tabpanel">
                                      <h3 className="mb-3"><b>KYC Documents</b></h3>
                                      <div className="row">
                                        {this.state.kycDoc && this.state.kycDoc.length > 0 &&
                                          <>
                                            {this.state.kycDoc.map((item) =>
                                              <>
                                                <div className="col-md-6 isdownload">

                                                  <h6><b>{item.base64['Document Type']}</b> <a href={"data:image/jpg;base64," + item.base64.base64} download={"image.jpeg"}><img src="images/download.svg" /></a></h6>
                                                  <div className="docimgs">
                                                    {item.filetype == "PDF"
                                                      ?
                                                      <iframe style={{ display: 'block', height: '100%', width: '100%' }} src={this.base64toBlob(item.base64.base64)} />
                                                      : <img src={"data:image/jpg;base64," + item.base64.base64} />}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </>
                                        }
                                      </div>
                                    </div>
                                    <div className="tab-pane" id="bdocument" role="tabpanel">

                                      <h3 className="mb-3"><b>Bureau Document</b></h3>
                                      <div className="row">
                                        <div className="col-md-12 isdownload">
                                          {bureaurData && bureaurData.length > 0 &&
                                            <>
                                              <h6><b>Bureau Document</b> <a href={void (0)} onClick={() => this.financialDocumentsDownload()} ><img src="images/download.svg" /></a></h6>


                                              <HtmlIframe html_code={bureaurData} />

                                            </>
                                          }
                                        </div>
                                      </div>

                                    </div>
                                    <div className="tab-pane" id="fstatements" role="tabpanel">

                                      <h3 className="mb-3"><b>Financial Statements</b></h3>
                                      <div className="row">
                                        <div className="col-md-12 isdownload">
                                          {bank_data && bank_data.length > 0 &&
                                            <>
                                              <h6><b>Bank Statements</b> <a href={void (0)} onClick={() => this.financialDocumentsDownload()} ><img src="images/download.svg" /></a></h6>
                                              {
                                                bank_data.map((item, index) => (

                                                  <>
                                                    <div className="col-md-6 isdownload">

                                                      <h6><b>{item.base64['Document Type']}</b> <a href={"data:image/jpg;base64," + item.base64.base64} download={"image.jpeg"}><img src="images/download.svg" /></a></h6>
                                                      <div className="docimgs">
                                                        {item.filetype == "PDF"
                                                          ?
                                                          <iframe style={{ display: 'block', height: '100%', width: '100%' }} src={this.base64toBlob(item.base64.base64)} />
                                                          : <img src={"data:image/jpg;base64," + item.base64.base64} />}
                                                      </div>
                                                    </div>
                                                  </>
                                                ))
                                              }
                                            </>
                                          }
                                        </div>
                                        <div className="col-md-12 isdownload">
                                          {this.state.statementBase &&
                                            <>
                                              <h6><b>Salary Slips</b> <img src="images/download.svg" /></h6>
                                              <div className="docimgs">
                                                <img src={this.state.statementBase} />
                                              </div>
                                            </>
                                          }
                                        </div>
                                      </div>

                                    </div>
                                    <div className="tab-pane" id="aproofs" role="tabpanel">

                                      <h3 className="mb-3"><b>Address Proofs</b></h3>
                                      <div className="row">
                                        <div className="col-md-6 isdownload">
                                          {this.state.addressProof.length > 0 &&
                                            <>
                                              {this.state.addressProof.map((item) =>
                                                <>
                                                  <h6><b>{item.base64['Document Type']}</b> <a href={"data:image/jpg;base64," + item.base64.base64} download={"image.jpeg"}><img src="images/download.svg" /></a></h6>
                                                  <div className="docimgs">
                                                    <img src={"data:image/jpg;base64," + item.base64.base64} />
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          }
                                        </div>
                                      </div>

                                    </div>
                                    <div className="tab-pane" id="odocuments" role="tabpanel">

                                      <h3 className="mb-3"><b>Other Documents</b></h3>
                                      <div className="row">
                                        {this.state.otherDocData &&
                                          <>
                                            {this.state.otherDocData.map((item) =>
                                              <>
                                                <div className="col-md-6 isdownload">

                                                  <h6><b>{item.base64['Document Type']}</b> <a href={"data:image/jpg;base64," + item.base64.base64} download={"image.jpeg"}><img src="images/download.svg" /></a></h6>
                                                  <div className="docimgs">
                                                    {item.filetype == "PDF"
                                                      ?
                                                      <iframe style={{ display: 'block', height: '100%', width: '100%' }} src={this.base64toBlob(item.base64.base64)} />
                                                      : <img src={"data:image/jpg;base64," + item.base64.base64} />}
                                                  </div>
                                                </div>
                                              </>
                                            )}
                                          </>
                                        }
                                      </div>

                                    </div>
                                  </div>

                                </div>
                              </div>
                            </div>

                          </div>
                          <div
                            className="tab-pane fade"
                            id="nav-repayments"
                            role="tabpanel"
                            aria-labelledby="nav-repayments-tab"
                          >
                            <div className="table-responsive repay_table dark_header hscroll mt-3 mb-3">
                              <table
                                className="table"
                                id="dataTable"
                                width="100%"
                                cellSpacing={0}
                              >
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>EMI</th>
                                    <th>Due Date</th>
                                    <th>Payment Received</th>
                                    <th>Payment Date</th>
                                    <th>Mode of Payment</th>
                                    <th>UTR NO.</th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>

                                  {
                                    datarrr && datarrr.length > 0 ?

                                      datarrr.map((item, index) => (
                                        <tr className="shown"
                                          key={index}
                                        >



                                          <td>{item.emi_no__c ? item.emi_no__c : '0'}</td>
                                          <td className="bold">₹ {item.emi_amt ? item.emi_amt : '0'}</td>
                                          <td>{item.due_date__c ? item.due_date__c : '-'}</td>
                                          <td className="bold">₹ {item.payment_received ? item.payment_received : '0'}</td>
                                          <td>{item.emi_paid_date__c ? item.emi_paid_date__c : '0'}</td>
                                          <td className="payment"><img src="images/e-nach.svg" /> E-Nach</td>
                                          <td>{item.utr_num ? item.utr_num : '0'}</td>
                                          <td className="bold">{item.emi_status__c ? item.emi_status__c : 'null'}</td>


                                        </tr>
                                      )
                                      ) : 'No Data Available!!'
                                  }
                                  {/* <tr className="shown">
                                    <td>2</td>
                                    <td className="bold">₹ 4,000</td>
                                    <td>30-12-2021</td>
                                    <td className="bold">₹ 4,000</td>
                                    <td>31-12-2021</td>
                                    <td className="payment"><img src="images/bank.svg" /> Bank</td>
                                    <td>AG98900765</td>
                                    <td className="bold">Paid</td>
                                  </tr>
                                  <tr className="shown">
                                    <td>3</td>
                                    <td className="bold">₹ 7,000</td>
                                    <td>30-12-2021</td>
                                    <td className="bold">₹ 7,000</td>
                                    <td>31-12-2021</td>
                                    <td className="payment"><img src="images/online.svg" /> Online</td>
                                    <td>AG98900765</td>
                                    <td className="bold">Paid</td>
                                  </tr>
                                  <tr className="shown">
                                    <td>4</td>
                                    <td className="bold">₹ 12,000</td>
                                    <td>30-12-2021</td>
                                    <td className="bold">₹ 12,000</td>
                                    <td>31-12-2021</td>
                                    <td className="payment"><img src="images/cash.svg" /> Cash</td>
                                    <td>Bill#1920</td>
                                    <td className="bold">Paid</td>
                                  </tr>
                                  <tr className="shown">
                                    <td>5</td>
                                    <td className="bold">₹ 10,000</td>
                                    <td>30-12-2021</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className="payment">-</td>
                                    <td>-</td>
                                    <td className="bold">Overdue</td>
                                  </tr>
                                  <tr className="shown">
                                    <td>6</td>
                                    <td className="bold">₹ 11,000</td>
                                    <td>30-12-2021</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className="payment">-</td>
                                    <td>-</td>
                                    <td className="bold">Pending</td>
                                  </tr>
                                  <tr className="shown">
                                    <td>7</td>
                                    <td className="bold">₹ 15,000</td>
                                    <td>30-12-2021</td>
                                    <td>-</td>
                                    <td>-</td>
                                    <td className="payment">-</td>
                                    <td>-</td>
                                    <td className="bold">Pending</td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12 text-right tbuttons pt-3 pb-3">
                        {this.state.prevDet && (
                          <button type="button" onClick={() => this.openLeads(this.state.prevDet)} className="btn btn-primary mr-4"><img src="img/icon_pcase.svg" /> Previous Case</button>
                        )}
                        {this.state.nextDet && (
                          <button type="button" onClick={() => this.openLeads(this.state.nextDet)} className="btn btn-primary">Next Case <img className="alignedright" src="img/icon_ncase.svg" /></button>
                        )}
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


        <div
          className="modal fade documentspopup"
          id="docModel"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex col-md-12">
                  <div className="col-md-4">
                    <img src="img/icon_tick.svg" /> Verified by Eduvanz
                  </div>
                  <div className="col-md-4 text-center">
                    <h5><b>{this.state.modalTitle}</b></h5>
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body" style={{ paddingBottom: "100px" }}>
                <div className="row justify-content-center align-items-center">
                  {
                    this.state.viewIs == APP ?
                      this.state.imageObj && this.state.imageObj.length > 0 ?
                        this.state.imageObj.map((data, index) => {
                          let margin = index > 1 ? "100px" : "0px";
                          return (
                            <div className="mr-2" style={{ position: "relative", width: "48%", height: "350px", marginTop: margin }}>
                              {
                                this.state.imageTypeis == "PDF" ?
                                  <iframe src={data} width="100%" height="100%"></iframe>
                                  :
                                  <img src={data} style={{ width: "98%", height: "100%" }} />
                              }
                              <a href={data} download={"image.jpeg"}>
                                <button className="btn btn-primary mt-4 mr-2" style={{ background: "#00000020", float: "right" }}><img src="img/icon_Download.svg" /> Download</button>
                              </a>
                            </div>
                          )
                        })
                        : this.state.apiCall == PRO ? "Loading image..." : "No document available"
                      :
                      <div className=" pt-5 pb-5 pl-5 pr-5" style={{ position: "relative" }}>
                        <img src={this.state.showDocument} />
                      </div>
                  }
                </div>
              </div>
              {
                this.state.viewIs == DOC &&
                <div className="modal-footer">
                  <a href={this.state.showDocument} download={"image.jpeg"}>
                    <button className="btn btn-primary mr-4"><img src="img/icon_Download.svg" /> Download</button>
                  </a>
                  <button className="btn btn-primary mr-4"><img src="img/icon_pcase.svg" /> Previous</button>
                  <button className="btn btn-primary">Next <img className="alignedright" src="img/icon_ncase.svg" /></button>
                </div>
              }
            </div>
          </div>
        </div>


        <div
          className="modal fade documentspopup"
          id="doc_type_Model"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <div className="d-flex col-md-12">
                  <div className="col-md-4">
                    <img src="img/icon_tick.svg" /> Verified by Eduvanz
                  </div>
                  <div className="col-md-4 text-center">
                    <h5><b>{this.state.modalTitle}</b></h5>
                  </div>
                  <div className="col-md-4">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="modal-body" style={{ paddingBottom: "100px" }}>
                <div className="row justify-content-center align-items-center">

                  {
                    this.state.show_docType.length > 0 &&

                      this.state.show_docType == 'bank_statement_list' ?
                      <>
                        {
                          this.state.bank_statement_list.map((data, index) => {
                            let margin = index > 1 ? "100px" : "0px";
                            return (
                              <div className="mb-8" style={{ position: "relative", width: "100%", height: "350px", marginTop: margin }}>
                                {
                                  data.filetype == "PDF" ?
                                    <>
                                      <iframe src={'data:application/pdf;base64,' + data.base64.base64} width="100%" height="100%"></iframe>
                                      <a href={'data:application/pdf;base64,' + data.base64.base64} download={"bank_statement.pdf"}>
                                        <button className="btn btn-primary mt-4 mr-2" style={{ background: "#00000040", float: "right" }}><img src="img/icon_Download.svg" /> Download</button>
                                      </a>
                                    </>
                                    :
                                    <>
                                      <img src={'data:image/jpg;base64,' + data.base64.base64} style={{ width: "98%", height: "100%" }} />
                                      <a href={'data:image/jpg;base64,' + data.base64.base64} download={"image.jpeg"}>
                                        <button className="btn btn-primary mt-4 mr-2" style={{ background: "#00000040", float: "right" }}><img src="img/icon_Download.svg" /> Download</button>
                                      </a>
                                    </>
                                }

                              </div>

                            )


                          })
                        }
                      </>
                      :

                      <>
                        {
                          this.state.salary_slip_list.map((data, index) => {
                            let margin = index > 1 ? "100px" : "0px";
                            return (
                              <div className="mb-8" style={{ position: "relative", width: "100%", height: "350px", marginTop: margin }}>
                                {
                                  data.filetype == "PDF" ?
                                    <>
                                      <iframe src={'data:application/pdf;base64,' + data.base64.base64} width="100%" height="100%"></iframe>
                                      <a href={'data:application/pdf;base64,' + data.base64.base64} download={"bank_statement.pdf"}>
                                        <button className="btn btn-primary mt-4 mr-2" style={{ background: "#00000040", float: "right" }}><img src="img/icon_Download.svg" /> Download</button>
                                      </a>
                                    </>
                                    :
                                    <>
                                      <img src={'data:image/jpg;base64,' + data.base64.base64} style={{ width: "98%", height: "100%" }} />
                                      <a href={'data:image/jpg;base64,' + data.base64.base64} download={"image.jpeg"}>
                                        <button className="btn btn-primary mt-4 mr-2" style={{ background: "#00000040", float: "right" }}><img src="img/icon_Download.svg" /> Download</button>
                                      </a>
                                    </>
                                }
                              </div>

                            )


                          })
                        }
                      </>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal fade" id="buerau_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-xl w-100" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"></h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <HtmlIframe html_code={bureaurData} />
              </div>
            </div>
          </div>
        </div>

      </>
    );
  }
}

function mapStateToProps(state) {
  const { open_raise_query, closeRaiseQuery } = state.model;
  const { isLoading, isLoggedIn, salesForceToken, user_id } = state.auth;
  const { lead_id, lead_profile } = state.user;
  const { message } = state.message;
  return {
    isLoading,
    isLoggedIn,
    message,
    lead_id,
    lead_profile,
    salesForceToken,
    user_id, open_raise_query
  };
}

export default connect(mapStateToProps)(ClosedLeadDetails);
