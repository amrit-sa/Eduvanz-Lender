import {
  GET_LEADS_SUCCESS,
  GET_LEADS_FAILD,
  LOGOUT,
  SET_MESSAGE,
  LOADING_FAILD,
  LOADING_SUCCESS,
  GET_ROLE_FAILD,
  GET_ROLE_SUCCESS,
  GET_LENDER_FAILD,
  GET_LENDER_SUCCESS,
  GET_LEAD_COUNT_SUCCESS,
  GET_BUREAU_SUCCESS,
  GET_BUREAU_FAILD,
  GET_BUREAUHARD_SUCCESS,
  GET_BUREAUHARD_FAILD,
  GET_REPAYMENT_SUCCESS,
  GET_REPAYMENT_FAILD,
  GET_SEARCH_VALUE_SUCCESS,
  GET_SEARCH_VALUE_FAILD,
  SET_MOBILE_NUMBER,
  isLoad,
  GET_NEWEST_SUCCESS,
  GET_NEWEST_FAILD,
  LEADDATA

} from "./types";

import AuthService from "../services/auth.service";
import UserService from "../services/user.service";


export const LEAD_PROFILE_SUCCESS = "LEAD_PROFILE_SUCCESS";
export const LEAD_PROFILE_FAILD = "LEAD_PROFILE_FAILD";
export const LEAD_PROFILE_IMG_SUCCESS = "LEAD_PROFILE_IMG_SUCCESS";
export const LEAD_PAN_IMG_SUCCESS = "LEAD_PAN_IMG_SUCCESS";
export const LEAD_OTHER_FRONT_IMG_SUCCESS = "LEAD_OTHER_FRONT_IMG_SUCCESS";
export const LEAD_OTHER_BACK_IMG_SUCCESS = "LEAD_OTHER_BACK_IMG_SUCCESS";
export const LEAD_PDF_STRING_SUCCESS = "LEAD_PDF_STRING_SUCCESS";
export const LEADS_COUNT_SUCCESS = "LEADS_COUNT_SUCCESS";
export const LEADS_COUNT_FAILD = "LEADS_COUNT_FAILD";
export const GET_GROUP_SUCCESS = "GET_GROUP_SUCCESS";
export const GET_GROUP_FAILD = "GET_GROUP_FAILD";
export const GET_EMAIL_REPORT_SUCCESS = "GET_EMAIL_REPORT_SUCCESS";
export const GET_EMAIL_REPORT_FAILD = "GET_EMAIL_REPORT_FAILD";
export const GET_PRODUCTS_SUCCESS = "GET_PRODUCTS_SUCCESS";
export const GET_PRODUCTS_FAILD = "GET_PRODUCTS_FAILD";
export const GROUP_EMAIL_SEARCH_SUCCESS = "GROUP_EMAIL_SEARCH_SUCCESS";
export const GROUP_EMAIL_SEARCH_FAILD = "GROUP_EMAIL_SEARCH_FAILD";
export const GET_RECIPIENT_SUCCESS = "GET_RECIPIENT_SUCCESS";
export const GET_RECIPIENT_FAILD = "GET_RECIPIENT_FAILD";
export const GET_GROUP_RECIPIENT_SUCCESS = "GET_GROUP_RECIPIENT_SUCCESS";
export const GET_GROUP_RECIPIENT_FAILD = "GET_GROUP_RECIPIENT_FAILD";

export const clearEmailSearch = () => (dispatch) => {
  dispatch({
    type: GROUP_EMAIL_SEARCH_FAILD,
  });
};

export const clearGroupRecipient = () => (dispatch) => {
  dispatch({
    type: GET_GROUP_RECIPIENT_FAILD,
  });
};

export const groupEmailSearch = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'group_email_search').then(
    (response) => {
      if (response && response.length > 0) {
        dispatch({
          type: GROUP_EMAIL_SEARCH_SUCCESS,
          payload: response
        });
      } else {
        dispatch({
          type: GROUP_EMAIL_SEARCH_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GROUP_EMAIL_SEARCH_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getLenderList = (givendata) => (dispatch) => {
  console.log('given_data', givendata)

  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'lender_list').then(
    (response) => {
      console.log('data', response);

      dispatch({
        type: LOADING_FAILD,
      });
      if (response && response.status === "success") {
        dispatch({
          type: GET_LENDER_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_LENDER_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      dispatch({
        type: GET_LENDER_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getRoleList = () => (dispatch) => {
  return UserService.get('roles').then(
    (response) => {
      if (response && response.status === "success") {
        dispatch({
          type: GET_ROLE_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_ROLE_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_ROLE_FAILD
      });
      return Promise.reject();
    }
  );
};

export const geBbureau = (getData) => (dispatch) => {
  // return UserService.get('bureau_analysis').then(
  return UserService.get(`bureau_analysis?user_sfid=${getData.user_sfid}`).then(

    (response) => {
      if (response && response.status === "success") {
        dispatch({
          type: GET_BUREAU_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_BUREAU_FAILD
        });
      }
    }
  );
};

export const getNewestcase = (getData) => (dispatch) => {
  return UserService.get(`lender_newest_case?lender_sfid=${getData.lender_sfid}&section=${getData.section}&date_range=${getData.date_range} `).then(

    (response) => {
      if (response && response.status === "success") {
        dispatch({
          type: GET_NEWEST_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_NEWEST_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_NEWEST_FAILD
      });
      return Promise.reject();
    }
  );
};
// export const geBbureauHardpull = (getData) => (dispatch) => {
//   return UserService.get(`bureau_detail?id=${getData.id}`).then(

//      (response) => {
//        if(response && response.status ==="success" )
//        {    
//          dispatch({
//            type: GET_BUREAUHARD_SUCCESS,
//            payload: response.data
//          });
//        }else{
//          dispatch({
//            type: GET_BUREAUHARD_FAILD
//          });
//        }
//        return response;
//      },
//      (error) => {
//        dispatch({
//          type: GET_BUREAUHARD_FAILD
//        });
//        return Promise.reject();
//      }
//    );
//  };
// export const geBbureauHardpull = (getData) => (dispatch) => {
//   return UserService.get(`bureau_detail?id=${getData.id}`).then(

//      (response) => {
//        if(response && response.status ==="success" )
//        {    
//          dispatch({
//            type: GET_BUREAUHARD_SUCCESS,
//            payload: response.data
//          });
//        }else{
//          dispatch({
//            type: GET_BUREAUHARD_FAILD
//          });
//        }
//        return response;
//      },
//      (error) => {
//        dispatch({
//          type: GET_BUREAUHARD_FAILD
//        });
//        return Promise.reject();
//      }
//    );
//  };

export const getDocumentCount = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'lender_user_document_count').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_GROUP_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_GROUP_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_GROUP_FAILD
      });
      return Promise.reject();
    }
  );
};
export const geBbureauHardpull = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'bureau_detail').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_GROUP_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_GROUP_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_GROUP_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getStatusmsg = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'lender_lead_approval_details').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_GROUP_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_GROUP_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_GROUP_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getRepayment = (getData) => (dispatch) => {
  return UserService.get(`repayment_schedule?opp_sfid=${getData.opp_sfid}`).then(

    (response) => {
      if (response && response.status === "success") {
        dispatch({
          type: GET_REPAYMENT_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_REPAYMENT_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_REPAYMENT_FAILD
      });
      return Promise.reject();
    }
  );
};

export const editUser = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'lender_user_edit_update').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return Promise.reject();
    }
  );
};


export const createUser = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'add_lender').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return Promise.reject();
    }
  );
};

export const removeUser = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'remove_lender_user').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};


export const createEmailGroup = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'add_email_group').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};



export const lender_lead_through_email = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'lender_lead_through_email').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return Promise.reject();
    }
  );
};

export const lender_lead_through_email_scheduler = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'lender_lead_through_email_scheduler').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return Promise.reject();
    }
  );
};




export const createEmailReport = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'add_email_report').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return Promise.reject();
    }
  );
};

export const removeEmailGroup = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'remove_email_group').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const removeEmailReport = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(givendata, 'remove_email_report').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return Promise.reject();
    }
  );
};

export const getGroupList = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'lender_group_list').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_GROUP_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_GROUP_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_GROUP_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getEmailReport = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'email_reports').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_EMAIL_REPORT_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_EMAIL_REPORT_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_EMAIL_REPORT_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getGroupRecipient = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'get_group_recipient').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_GROUP_RECIPIENT_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_GROUP_RECIPIENT_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_GROUP_RECIPIENT_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getRecipientList = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'email_recipients').then(
    (response) => {
      if (response && response.status && response.status === "success") {
        dispatch({
          type: GET_RECIPIENT_SUCCESS,
          payload: response.data
        });
      } else {
        dispatch({
          type: GET_RECIPIENT_FAILD
        });
      }
      return response;
    },
    (error) => {
      dispatch({
        type: GET_RECIPIENT_FAILD
      });
      return Promise.reject();
    }
  );
};

export const addEmailRecipient = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'add_email_recipient').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const removeEmailRecipient = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'remove_email_recipient').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};


export const getLeads = (givendata,pagination_obj,dateRangeObj={},selectedCase) => (dispatch) => {
  console.log('dateRangeObj',dateRangeObj)
  let updatedData = {};

  dispatch({
    type: isLoad,
    payload: true
  });

  if (givendata.drf_status === 'Completed') {
    updatedData = { ...givendata }
  } else {
    updatedData = { ...givendata }
    delete updatedData.drf_status
  }
  let paginationObj = null
  if (pagination_obj != undefined) {
    paginationObj = pagination_obj
  }
  else {
    paginationObj = { 'page': 1, "limit": 10 }

  }
  updatedData['from_date_time']=dateRangeObj.from_date_time?dateRangeObj.from_date_time:''
  updatedData['to_date_time']=dateRangeObj.to_date_time?dateRangeObj.to_date_time.replace(/00:00:00/gi, "23:59:59"):''
  updatedData['sort_by']=selectedCase?selectedCase:''

  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(updatedData, `lender_leads?page=${paginationObj.page}&limit=${paginationObj.limit}`).then(
    (response) => {
      dispatch({
        type: isLoad,
        payload: false
      });
      if (response && response.status && response.status === "success") {
        console.log('ok', response)
        dispatch({
          type: GET_LEADS_SUCCESS,
          payload: response.data
        });
        dispatch({
          type:GET_LEAD_COUNT_SUCCESS,
          payload:response.contDet.allLead ? response.contDet.allLead.total : null,
        })
      } else {
        dispatch({
          type: GET_LEADS_FAILD
        });
      }
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      dispatch({
        type: GET_LEADS_FAILD
      });
      return Promise.reject();
    }
  );
};

export const getLeadsCount = (givendata) => (dispatch) => {
  return UserService.get(givendata ? 'get_lender_leads_count?' + givendata : 'get_lender_leads_count').then(
    (response) => {
      if (response.responseCode !== undefined && response.responseCode === 400) {
        dispatch({
          type: LEADS_COUNT_FAILD,
          payload: response.message,
        });
      } else {
        dispatch({
          type: LEADS_COUNT_SUCCESS,
          payload: response
        });
      }
      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: LEADS_COUNT_FAILD,
        payload: message,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};


export const getBulkHistory = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(getData, 'lender_bulk_update_history').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};


  export const createBulkLeads = (getData) => (dispatch) => {
    dispatch({
      type: LOADING_SUCCESS,
    });
    return UserService.post(getData, 'lender_bulk_lead_update').then(
      (response) => {
        dispatch({
          type: LOADING_FAILD,
        });
        return response;
      },
      (error) => {
        dispatch({
          type: LOADING_FAILD,
        });
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        return message;
      }
    );
  };

export const getUserProfile = (getData) => (dispatch) => {
  return UserService.post(getData, 'get_user_profile').then(
    (response) => {
      console.log('resp here', response)
      if (response.responseCode === 200) {
        const leadCount = response && response.leadCount ? response.leadCount : null
        dispatch({
          type: GET_LEAD_COUNT_SUCCESS,
          payload: leadCount
        });
        // dispatch({
        //   type: LEADDATA,
        //   payload: response
        // });
      }
      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const getLeadProfileDocuemnt = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(getData, 'getProfileDocument').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      if (response.status === "success") {
        let getData = response.data;
        if (getData.profile !== undefined && getData.profile !== "") {
          dispatch({
            type: LEAD_PROFILE_IMG_SUCCESS,
            payload: "data:image/jpg;base64," + getData.profile
          });
        } else {
          dispatch({
            type: LEAD_PROFILE_IMG_SUCCESS,
            payload: ""
          });
        }
      }
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const loanUpdate = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(getData, 'loan_update').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const getBankDocuemnt = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(getData, 'getBankStatement').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const getLeadPanDocuemnt = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(getData, 'getPanDocument').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      if (response.status === "success") {
        let getData = response.data;
        if (getData.pan_front !== undefined && getData.pan_front !== "") {
          let resData = getData.pan_front;
          dispatch({
            type: LEAD_PAN_IMG_SUCCESS,
            payload: "data:image/jpg;base64," + resData.base
          });
        } else {
          dispatch({
            type: LEAD_PAN_IMG_SUCCESS,
            payload: ""
          });
        }
      }
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const getLeadOtherDocuemnt = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return UserService.post(getData, 'getOtherdocument').then(
    (response) => {
      dispatch({
        type: LOADING_FAILD,
      });
      if (response.status === "success") {
        let getData = response;
        if (getData.aadharfrontdata !== undefined && getData.aadharfrontdata !== "") {
          let resData = getData.aadharfrontdata;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Aadhar',
          }
          dispatch({
            type: LEAD_OTHER_FRONT_IMG_SUCCESS,
            payload: data
          });
        } else if (getData.driving_front !== undefined && getData.driving_front !== "") {
          let resData = getData.driving_front;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Driving',
          }
          dispatch({
            type: LEAD_OTHER_FRONT_IMG_SUCCESS,
            payload: data
          });
        } else if (getData.voterfrontdata !== undefined && getData.voterfrontdata !== "") {
          let resData = getData.voterfrontdata;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Voter'
          }
          dispatch({
            type: LEAD_OTHER_FRONT_IMG_SUCCESS,
            payload: data
          });

        } else if (getData.passport !== undefined && getData.passport !== "") {
          let resData = getData.passport_front;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Passport'
          }
          dispatch({
            type: LEAD_OTHER_FRONT_IMG_SUCCESS,
            payload: data
          });
        } else {
          let data = {
            content: "",
            type: 'Aadhar'
          }
          dispatch({
            type: LEAD_OTHER_FRONT_IMG_SUCCESS,
            payload: data
          });
        }

        if (getData.aadharbackdata !== undefined && getData.aadharbackdata !== "") {
          let resData = getData.aadharbackdata;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Aadhar',
          }
          dispatch({
            type: LEAD_OTHER_BACK_IMG_SUCCESS,
            payload: data
          });
        } else if (getData.driving_back !== undefined && getData.driving_back !== "") {
          let resData = getData.driving_back;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Driving',
          }
          dispatch({
            type: LEAD_OTHER_BACK_IMG_SUCCESS,
            payload: data
          });
        } else if (getData.voterbackdata !== undefined && getData.voterbackdata !== "") {
          let resData = getData.voterbackdata;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Voter',
          }
          dispatch({
            type: LEAD_OTHER_BACK_IMG_SUCCESS,
            payload: data
          });

        } else if (getData.passport !== undefined && getData.passport !== "") {
          let resData = getData.passport_back;
          let data = {
            content: "data:image/jpg;base64," + resData.base,
            type: 'Passport',
          }
          dispatch({
            type: LEAD_OTHER_BACK_IMG_SUCCESS,
            payload: data
          });
        } else {
          let data = {
            content: "",
            type: 'Aadhar',
          }
          dispatch({
            type: LEAD_OTHER_BACK_IMG_SUCCESS,
            payload: data
          });
        }
      }
      return response;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};


export const getLeadProfile = (getData) => (dispatch) => {
  dispatch({ type: LOADING_SUCCESS })
  return UserService.post(getData, 'get_lead_profile').then(
    (response) => {
      dispatch({ type: LOADING_FAILD })
      if (response.status === "success") {
        dispatch({
          type: LEAD_PROFILE_SUCCESS,
          payload: response.data
        })
      } else {
        dispatch({
          type: LEAD_PROFILE_FAILD
        })
      }
      return response;
    },
    (error) => {
      dispatch({ type: LOADING_FAILD })
      dispatch({
        type: LEAD_PROFILE_FAILD
      })
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const getLenderLeadDetails = (getData) => (dispatch) => {
  dispatch({ type: LOADING_SUCCESS })
  return UserService.post(getData, 'lender_lead_details').then(
    (response) => {
      dispatch({ type: LOADING_FAILD })
      return response;
    },
    (error) => {
      dispatch({ type: LOADING_FAILD })
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
    }
  );
};

export const getProducts = (getData) => (dispatch) => {
  dispatch({ type: LOADING_SUCCESS })
  return UserService.get('get_products').then(
    (response) => {
      dispatch({ type: LOADING_FAILD })
      if (response.responseCode !== undefined && response.responseCode === 400) {
        dispatch({
          type: GET_PRODUCTS_FAILD,
        });
      } else {
        dispatch({
          type: GET_PRODUCTS_SUCCESS,
          payload: response
        });
      }
      return response;
    },
    (error) => {
      dispatch({ type: LOADING_FAILD })
      dispatch({
        type: GET_PRODUCTS_FAILD
      })
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return Promise.reject();
    }
  );
};

export const openLeadProfileModel = (id) => (dispatch) => {
  localStorage.setItem("lead_id", id);
  dispatch({ type: "UPDATE_LEAD_ID", payload: id });
}


export const getAddressProof = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'getAddressProof ').then(
    (response) => {
      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
export const getAddressProofDoc = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'getDocumentByType ').then(
    (response) => {
      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const getAddress = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'get_user_address').then(
    (response) => {
      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const getlenderCount = (givendata) => (dispatch) => {
  return UserService.get(givendata ? 'lender_leads_count?' + givendata : 'lender_leads_count').then(
    (response) => {
      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};


export const logout = () => (dispatch) => {
  AuthService.logout();

  dispatch({
    type: LOGOUT,
  });
};

export const getEmailReportSearch = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'email_report_search').then(
    (response) => {
      dispatch({
        type:"GET_EMAIL_REPORT_SUCCESS",
        payload:response.data
      })


      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const globalSearch = (payload) => (dispatch)=>{
  dispatch({
    type: "GLOBAL_SEARCH_KEYWORD",
    payload: payload
  })
}


export const getSearchResults = (givendata) => (dispatch) => {
  return UserService.get(`lender_search?lender_sfid=${givendata.lender_sfid}&section=${givendata.section}&search_keyword=${givendata.search_keyword}`).then(
    (response) => {
      dispatch({
        type: GET_SEARCH_VALUE_SUCCESS,
        payload: response.searchResult,
      })
      return response;
    },
    (error) => {
      dispatch({
        type: GET_SEARCH_VALUE_FAILD,
        payload: [],
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const setMobileNo = (mobile_no) => (dispatch) => {
  dispatch({
    type: SET_MOBILE_NUMBER,
    payload: mobile_no,
  })
}

export const getDashboardSummary = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'lender_dashboard_summary').then(
    (response) => {
      if (response.status === 'success')
        return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
}
export const setProfile = (givendata) => (dispatch) => {
  console.log('get data',givendata)
   return UserService.post(givendata, 'lender_user_update').then(
    (response) => {
     console.log('rsponse new',response)
      return response;
    },
    // (error) => {
    //   return error;
    //   //return Promise.reject();
    // }
  )
  .catch((error) => {
    console.log('err',error)
  });

}

export const getUserProfileData = (getData) => (dispatch) => {
  return UserService.post(getData, 'get_lender_details').then(
    (response) => {
      if (response.status=== "success") {
        dispatch({
          type: LEADDATA,
          payload: response
        });
      }
      return response;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return message;
        });
    }

export const submitFeedback = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'lender_user_feedback').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const getDocByType = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'getDocumentByType').then(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject();
    }
  );
};

export const RaiseQueryCall = (givendata) => (dispatch) => {
   return UserService.post(givendata, 'raise_query').then(
    (response) => {
      return response;
    },
  )
  .catch((error) => {
    console.log('err',error)
  });

}
export const sendEmailCAM = (givendata) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });

  return UserService.post(givendata, 'lender_email_cam').then(

   (response) => {
    dispatch({
      type: LOADING_FAILD,
    });
    return response;
   },
 )
 .catch((error) => {
  dispatch({
    type: LOADING_FAILD,
  });
   console.log('err',error)
 });

}

export const manageSeachResult = (givendata) => (dispatch) => {
  return UserService.post(givendata, 'lender_profile_search').then(
   (response) => {
    dispatch({
      type: GET_SEARCH_VALUE_SUCCESS,
      payload: response.data,
    })
     return response;
   },
 )
 .catch((error) => {
  dispatch({
    type: GET_SEARCH_VALUE_FAILD,
    payload: [],
  });
   console.log('err',error)
 });

}