import {
  GET_LEADS_SUCCESS,
  GET_LEADS_FAILD,
  CLEAR_USER_MESSAGE,
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
  SET_MOBILE_NUMBER,
  isLoad,
  GET_NEWEST_SUCCESS,
  GET_NEWEST_FAILD,
  LEADDATA

} from "../actions/types";

let lead_id = localStorage.getItem("lead_id");

const initialState = {
  leads: [],
  leadsCount: 0,
  lead_profile: {},
  lead_limit: 0,
  userMessage: '',
  isSuccess: 0,
  banks: [],
  lead_id: lead_id ? lead_id : null,
  lead_count: null,
  leadProfileImg: '',
  leadPanImg: '',
  otherFrontImg: '',
  otherBackImg: '',
  selectedTab: '',
  pdfString: '',
  products: [],
  entity: [],
  email_report_list: null,
  group_recipient: null,
  entitySearch: false,
  email_search: null,
  group_list: null,
  email_list: null,
  lenders: null,
  roles: null,
  bureau: {},
  bureauhard: {},
  repayment: {},
  searchArr: [],
  Mobile_NO: '',
  Loading: null,
  lead_data: null,
  global_Search_Keyword:''
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  //console.log("Payload", type, payload);
  switch (type) {
    case GET_LEAD_COUNT_SUCCESS:
      return {
        ...state,
        lead_count: payload
      };
    case GET_ROLE_SUCCESS:
      return {
        ...state,
        roles: payload
      };

    case GET_ROLE_FAILD:
      return {
        ...state,
        roles: null,
      };

    case GET_BUREAU_SUCCESS:
      return {
        ...state,
        bureau: payload
      };

    case GET_BUREAU_FAILD:
      return {
        ...state,
        bureau: null,
      };

    case GET_REPAYMENT_SUCCESS:
      return {
        ...state,
        repayment: payload
      };

    case GET_REPAYMENT_FAILD:
      return {
        ...state,
        repayment: null,
      };
    case GET_BUREAUHARD_SUCCESS:
      return {
        ...state,
        bureauhard: payload
      };

    case GET_BUREAUHARD_FAILD:
      return {
        ...state,
        bureauhard: null,
      };

    case GET_NEWEST_SUCCESS:
      return {
        ...state,
        newest: payload
      };

    case GET_NEWEST_FAILD:
      return {
        ...state,
        newest: null,
      };

    case GET_REPAYMENT_SUCCESS:
      return {
        ...state,
        repayment: payload
      };

    case GET_REPAYMENT_FAILD:
      return {
        ...state,
        repayment: null,
      };
    case GET_BUREAUHARD_SUCCESS:
      return {
        ...state,
        bureauhard: payload
      };

    case GET_BUREAUHARD_FAILD:
      return {
        ...state,
        bureauhard: null,
      };

    case GET_LENDER_SUCCESS:
      return {
        ...state,
        lenders: payload
      };

    case GET_LENDER_FAILD:
      return {
        ...state,
        lenders: null,
      };
    case "GET_GROUP_SUCCESS":
      return {
        ...state,
        group_list: payload
      };
    case "GET_GROUP_FAILD":
      return {
        ...state,
        group_list: null
      };
    case "GET_EMAIL_REPORT_SUCCESS":
      return {
        ...state,
        email_report_list: payload
      };
    case "GET_EMAIL_REPORT_FAILD":
      return {
        ...state,
        email_report_list: null
      };
    case "GET_GROUP_RECIPIENT_SUCCESS":
      return {
        ...state,
        group_recipient: payload
      };
    case "GET_GROUP_RECIPIENT_FAILD":
      return {
        ...state,
        group_recipient: null
      };
    case "GET_RECIPIENT_SUCCESS":
      return {
        ...state,
        email_list: payload
      };
    case "GET_RECIPIENT_FAILD":
      return {
        ...state,
        email_list: null
      };
    case "GROUP_EMAIL_SEARCH_SUCCESS":
      return {
        ...state,
        email_search: payload
      };
    case "GROUP_EMAIL_SEARCH_FAILD":
      return {
        ...state,
        email_search: null
      };
    case "GET_PRODUCTS_SUCCESS":
      return {
        ...state,
        products: payload
      };
    case "GET_PRODUCTS_FAILD":
      return {
        ...state,
        products: []
      };
    case "LEADS_COUNT_SUCCESS":
      return {
        ...state,
        leadsCount: payload
      };
    case "LEAD_PDF_STRING_SUCCESS":
      return {
        ...state,
        pdfString: payload
      };
    case "LEAD_PROFILE_IMG_SUCCESS":
      return {
        ...state,
        leadProfileImg: payload
      };
    case "LEAD_PAN_IMG_SUCCESS":
      return {
        ...state,
        leadPanImg: payload
      };
    case "LEAD_OTHER_FRONT_IMG_SUCCESS":
      return {
        ...state,
        otherFrontImg: payload.content,
        selectedTab: payload.type
      };
    case "LEAD_OTHER_BACK_IMG_SUCCESS":
      return {
        ...state,
        otherBackImg: payload.content
      };
    case "LEAD_PROFILE_SUCCESS":
      return {
        ...state,
        lead_limit: payload.ipa_basic_bureau__c ? payload.ipa_basic_bureau__c : 0,
        lead_profile: payload
      };
    case "LEAD_PROFILE_FAILD":
      return {
        ...state,
        lead_limit: 0,
        lead_profile: {}
      };
    case CLEAR_USER_MESSAGE:
      return {
        ...state,
        userMessage: '',
        isSuccess: 0
      };

    case GET_LEADS_SUCCESS:
      return {
        ...state,
        leads: payload
      };

    case GET_LEADS_FAILD:
      return {
        ...state,
        leads: [],
      };
    case "GLOBAL_SEARCH_KEYWORD":
      return {
        ...state,
        global_Search_Keyword: payload,
      };
    case GET_SEARCH_VALUE_SUCCESS:
      return {
        ...state,
        searchArr: payload,
      };
    case "UPDATE_LEAD_ID":
      return {
        ...state,
        lead_id: payload
      };
    case SET_MOBILE_NUMBER:
      return {
        ...state,
        Mobile_NO: payload
      };
    case isLoad:
      return {
        ...state,
        Loading: payload
      };
    case LEADDATA:
      console.log('payload', payload)
      return {
        ...state,
        lead_data: payload
      };


    default:
      return state;
  }
}
