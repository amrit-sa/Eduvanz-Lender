import {
    DASHBOARD_COUNT_FAILD,
    DASHBOARD_COUNT_SUCCESS,
    DISBURSAL_HISTORY_FAILD,
    REPAYMENT_HISTORY_FAILD,
    DISBURSAL_HISTORY_SUCCESS,
    REPAYMENT_HISTORY_SUCCESS,
    GET_DIS_HIS_CHART_DATA,
    GET_RE_HIS_CHART_DATA
  } from "./types";

  import LeadService from "../services/lead.services";
  
  export const getDashboardCount = (getData) => (dispatch) => {
    return LeadService.post(getData, "leads_final_history").then(
      (response) => {
        if(response && response.status && response.status === 'success')
        {    
            const getData = response && response.data ? response.data:null;
          dispatch({
            type: DASHBOARD_COUNT_SUCCESS,
            payload: getData,
          });
        }else{
          dispatch({
            type: DASHBOARD_COUNT_FAILD
          });
        }
        return Promise.resolve();
      },
      (error) => {
        return Promise.reject();
      }
    );
  };

  export const getDisbursalHistory = (getData) => (dispatch) => {
    return LeadService.post(getData, "get_disbursal_history").then(
      (response) => {
        if(response && response.status && response.status === 'success')
        {    
            const getData = response && response.data ? response.data:null;
          dispatch({
            type: DISBURSAL_HISTORY_SUCCESS,
            payload: getData,
          });
        }else{
          dispatch({
            type: DISBURSAL_HISTORY_FAILD
          });
        }
        return Promise.resolve();
      },
      (error) => {
        return Promise.reject();
      }
    );
  };

  export const getRepaymentHistory = (getData) => (dispatch) => {
    return LeadService.post(getData, "get_repayment_history").then(
      (response) => {
        if(response && response.status && response.status === 'success')
        {    
            const getData = response && response.data ? response.data:null;
          dispatch({
            type: REPAYMENT_HISTORY_SUCCESS,
            payload: getData,
          });
        }else{
          dispatch({
            type: REPAYMENT_HISTORY_FAILD
          });
        }
        return Promise.resolve();
      },
      (error) => {
        return Promise.reject();
      }
    );
  };

  export const getDisHisChartData = (getData) => (dispatch) => {
    return LeadService.post(getData, "lender_disbursal_history").then(
      (response) => {       
        return response;
      },
      (error) => {
        return Promise.reject();
      }
    );
  };

  export const getReHisChartData = (getData) => (dispatch) => {
    return LeadService.post(getData, "lender_repayment_history").then(
      (response) => {       
        return response;
      },
      (error) => {
        return Promise.reject();
      }
    );
  };
