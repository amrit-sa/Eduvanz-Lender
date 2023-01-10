import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOADING_SUCCESS,
  LOADING_FAILD,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  GET_LEADS_SUCCESS,
  GET_LEADS_FAILD,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILD,
  SALESFORCE_LOGIN_SUCCESS,
  SALESFORCE_LOGIN_FAILD,
} from "../actions/types";

const user       = JSON.parse(localStorage.getItem("user"));
const log        = parseInt(localStorage.getItem("log"));
const log_mobile = localStorage.getItem("log_mobile");
const sales_force_token = localStorage.getItem("force_token");
const userId   = parseInt(localStorage.getItem("user_id"));
const userSfid = localStorage.getItem("user_sfid");
const tokenId  = localStorage.getItem("token_id");

const initialState = { 
    isLoading: false,
    isLoggedIn: user?true:false, 
    user: user?user:null,
    log: log?log:null,
    user_id: userId?userId:null,
    user_sfid: userSfid?userSfid:null,
    token_id: tokenId?tokenId:null,
    log_mobile: log_mobile?log_mobile:null,
    salesForceToken: sales_force_token?sales_force_token:null,
    leads: [],
  };

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case 'VERIFY_OTP_SUCCESS':
      return {
          ...state,
          user: payload,
          user_id: payload.id,
          user_sfid: payload.sfid,
          token_id: payload.token,
          isLoggedIn: true
        };
    case 'VERIFY_OTP_FAILD':
        return {
          ...state,
          user: null,
          isLoggedIn: false
        };
    case SALESFORCE_LOGIN_SUCCESS:
      return {
        ...state,
        salesForceToken: payload,
      };
    case SALESFORCE_LOGIN_FAILD:
      return {
        ...state,
        salesForceToken: null,
      };
    case LOADING_SUCCESS:
      return {
        ...state,
        isLoading: true,
      };
    case LOADING_FAILD:
      return {
        ...state,
        isLoading: false
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case 'OTP_SENT_SUCCESS':
      return {
        ...state,
        log: payload.id,
        log_mobile: payload.mobile
      };
    case 'OTP_SENT_FAILD':
      return {
        ...state,
        log: null,
        log_mobile: null
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user_id: payload.id,
        token_id: payload.token,
        user: payload,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
      
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
      case GET_LEADS_SUCCESS:
        return { 
          ...state,
          leads: payload 
          };
  
      case GET_LEADS_FAILD:
        return { 
          ...state,
          userMessage: payload 
          };
      case CHANGE_PASSWORD_SUCCESS:
        return {
            ...state,
            authMessage: payload,
            isSuccess: 1,
            isLoading: false,
          };
      case CHANGE_PASSWORD_FAILD:
          return {
            ...state,
            authMessage: payload,
            isSuccess: 0,
            isLoading: false,
          };
    default:
      return state;
  }
}
