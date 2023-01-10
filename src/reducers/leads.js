import { 
    DASHBOARD_COUNT_FAILD,
    DASHBOARD_COUNT_SUCCESS,
    DISBURSAL_HISTORY_FAILD,
    REPAYMENT_HISTORY_FAILD,
    DISBURSAL_HISTORY_SUCCESS,
    REPAYMENT_HISTORY_SUCCESS,
 } from "../actions/types";

const initialState = {
    dashboard_disbursal: null,
    dashboard_repayments: null,
    dashboard_pending: null,
    dashboard_rejected: null,
    disbursal_history: null,
    repayment_history: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  //console.log("Payload", type, payload);
  switch (type) {
    case DASHBOARD_COUNT_SUCCESS:
      return { 
        ...state,
        dashboard_disbursal: payload && payload.disbursal?payload.disbursal:null,
        dashboard_repayments: payload && payload.repayments?payload.repayments:null,
        dashboard_pending: payload && payload.pending?payload.pending:null,
        dashboard_rejected: payload && payload.rejected?payload.rejected:null,
     };
     case DASHBOARD_COUNT_FAILD:
      return { 
        ...state,
        dashboard_disbursal: null,
        dashboard_repayments: null,
        dashboard_pending: null,
        dashboard_rejected: null,
     };
     case DISBURSAL_HISTORY_SUCCESS:
      return { 
        ...state,
        disbursal_history: payload,
     };
     case DISBURSAL_HISTORY_FAILD:
      return { 
        ...state,
        disbursal_history: null,
     };
     case REPAYMENT_HISTORY_SUCCESS:
      return { 
        ...state,
        repayment_history: payload,
     };
     case REPAYMENT_HISTORY_FAILD:
      return { 
        ...state,
        repayment_history: null,
     };
    default:
      return state;
  }
}
