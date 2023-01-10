import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOADING_SUCCESS,
  LOADING_FAILD,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  SET_MESSAGE,
  GET_LEADS_FAILD,
  GET_LEADS_SUCCESS,
  CHANGE_PASSWORD_SUCCESS,
  CHANGE_PASSWORD_FAILD,
} from "./types";

import AuthService from "../services/auth.service";

export const OTP_SENT_SUCCESS   = "OTP_SENT_SUCCESS";
export const OTP_SENT_FAILD     = "OTP_SENT_FAILD";
export const VERIFY_OTP_FAILD   = "VERIFY_OTP_FAILD";
export const VERIFY_OTP_SUCCESS = "VERIFY_OTP_SUCCESS";
export const SALESFORCE_LOGIN_SUCCESS = "SALESFORCE_LOGIN_SUCCESS";
export const SALESFORCE_LOGIN_FAILD   = "SALESFORCE_LOGIN_FAILD";

export const register = (username, email, password) => (dispatch) => {
  return AuthService.register(username, email, password).then(
    (response) => {
      dispatch({
        type: REGISTER_SUCCESS,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: response.data.message,
      });

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
        type: REGISTER_FAIL,
      });

      dispatch({
        type: SET_MESSAGE,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const mobileLogin = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS
  });
  return AuthService.login("lender_mobile_login",getData).then(
    (data) => {
      dispatch({
        type: LOADING_FAILD
      });
      // localStorage.setItem('log', data.id);
      localStorage.setItem('log_mobile', getData.mobile_no);
      let resData = {
        id: data.id,
        mobile: getData.mobile_no
      }
      // localStorage.setItem('user_id', data.id);
      localStorage.setItem('token_id', data.token);
      dispatch({
        type: OTP_SENT_SUCCESS,
        payload: resData,
      });

      return data;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        
        localStorage.removeItem('log');
        localStorage.removeItem('log_mobile');
        dispatch({
          type: OTP_SENT_FAILD
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

      return message;
    }
  );
};

export const login = (getData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS
  });
  return AuthService.login("lender_login",getData).then(
    (data) => {
      dispatch({
        type: LOADING_FAILD
      });
      let obj = {
        id: data.id,
        first_name: data.first_name,
        last_name:data.last_name,
        email:data.email,
        mobile: data.mobile,
        token: data.token
      }
      localStorage.setItem('user_id', data.id);
      localStorage.setItem('token_id', data.token);
      localStorage.setItem("user", JSON.stringify(obj))
      dispatch({
        type: LOGIN_SUCCESS,
        payload: obj,
      });

      return data;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD
      });
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
        localStorage.removeItem('log');
        localStorage.removeItem('user');
        localStorage.removeItem('log_mobile');
        dispatch({
          type: LOGIN_FAIL
        });

        dispatch({
          type: SET_MESSAGE,
          payload: message,
        });

      return message;
    }
  );
};

export const checkOtp = (givenData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return AuthService.post('verify_lender_otp',givenData).then(
    (data) => {
      dispatch({
        type: LOADING_FAILD,
      });
      if(data && data.status && data.status === 'success')
      {
        let res = {
          id: data.id,
          sfid: data.sfid,
          first_name: data.first_name,
          token: data.token
        }
        localStorage.setItem('token_id', data.token);
        localStorage.setItem('user_id', data.id);
        localStorage.setItem('user_sfid', data.sfid);
        localStorage.setItem('user', JSON.stringify(res));
        dispatch({
          type: VERIFY_OTP_SUCCESS,
          payload: res,
        });
       
      }else{
        dispatch({
          type: VERIFY_OTP_FAILD
        });
      }
      return data;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      console.log('error', error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: VERIFY_OTP_FAILD,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const salesForceLogin = (getData) => (dispatch) => {
  return AuthService.post('salesforce_auth', getData).then(
    (response) => {
      if(response.status ==="success")
      {
        localStorage.setItem("force_token", response.data.access_token);
        dispatch({
          type: SALESFORCE_LOGIN_SUCCESS,
          payload: response.data.access_token,
        });
      }else{
        dispatch({
          type: SALESFORCE_LOGIN_FAILD
        });
      }

      return response.status;
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SALESFORCE_LOGIN_FAILD,
        payload: message,
      });
      return Promise.reject();
    }
  );
};

export const getLeads = (givendata) => (dispatch) => {
  return AuthService.get(givendata?'leads?'+givendata:'leads').then(
    (response) => {
      if(response.responseCode !== undefined && response.responseCode === 400)
      {    
        dispatch({
          type: GET_LEADS_FAILD,
          payload: response.message,
        });
      }else{
        dispatch({
          type: GET_LEADS_SUCCESS,
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
        type: GET_LEADS_FAILD,
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

export const changePassword = (givenData) => (dispatch) => {
  dispatch({
    type: LOADING_SUCCESS,
  });
  return AuthService.post('create_password', givenData).then(
    (data) => {
      dispatch({
        type: LOADING_FAILD,
      });
      if(data.responseCode ===500 )
      {
        dispatch({
          type: CHANGE_PASSWORD_FAILD,
          payload: data,
        });
      }else{
        dispatch({
          type: CHANGE_PASSWORD_SUCCESS,
          payload: data,
        });
      }
      return data;
    },
    (error) => {
      dispatch({
        type: LOADING_FAILD,
      });
      console.log('error', error);
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: CHANGE_PASSWORD_FAILD,
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
