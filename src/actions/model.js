import {
    OPEN_ADD_USER,
    CLOSE_ADD_USER,
    OPEN_EMAIL_REPORT,
    CLOSE_EMAIL_REPORT,
    OPEN_DOWNLOAD_REPORT,
    CLOSE_DOWNLOAD_REPORT,
    EDIT_ADD_USER,
    OPEN_RAISE_QUERY,
    GET_SEARCH_ACTIVE,
    CLOSE_RAISE_QUERY
  } from "./types";

  export const openeMailReport = () => (dispatch) => {
    dispatch({
      type: OPEN_EMAIL_REPORT,
    });
  };
  export const openRaiseQuery = () => (dispatch) => {
    dispatch({
      type: OPEN_RAISE_QUERY,
    });
  };
  export const closeRaiseQuery = () => (dispatch) => {
        dispatch({
      type: CLOSE_RAISE_QUERY,
    });
  };
  export const closeMailReport = () => (dispatch) => {
    dispatch({
      type: CLOSE_EMAIL_REPORT,
    });
  };

  export const openeDownloadReport = () => (dispatch) => {
    dispatch({
      type: OPEN_DOWNLOAD_REPORT,
    });
  };

  export const closeDownloadReport = () => (dispatch) => {
    dispatch({
      type: CLOSE_DOWNLOAD_REPORT,
    });
  };

  export const openAddUser = () => (dispatch) => {
    dispatch({
      type: OPEN_ADD_USER,
    });
  };
  export const SetSearchActive = (value) => (dispatch) => {
    dispatch({
      type: GET_SEARCH_ACTIVE,
      payload:value,
    });
  };

  export const closeAddUser = () => (dispatch) => {
    dispatch({
      type: CLOSE_ADD_USER,
    });
  };



  export const lender_user_edit = () => (dispatch) => {
    dispatch({
      type: EDIT_ADD_USER,
    });
  };



  