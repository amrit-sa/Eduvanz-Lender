import { 
    OPEN_ADD_USER,
    CLOSE_ADD_USER,
    OPEN_EMAIL_REPORT,
    OPEN_RAISE_QUERY,
    CLOSE_EMAIL_REPORT,
    OPEN_DOWNLOAD_REPORT,
    CLOSE_DOWNLOAD_REPORT,
    EDIT_ADD_USER,
    GET_SEARCH_ACTIVE,
    CLOSE_RAISE_QUERY
 } from "../actions/types";
const initialState = {
    open_add_user: false,
    open_email_report: false,
    open_raise_query: false,
    open_download_report: false,
    lender_user_edit: false,
    searchActive:false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  //console.log("Payload", type, payload);
  switch (type) {
    case OPEN_DOWNLOAD_REPORT:
      return { 
        ...state,
        open_download_report: true 
      };

    case CLOSE_DOWNLOAD_REPORT:
      return { 
        ...state,
        open_download_report: false,
      };
    case OPEN_EMAIL_REPORT:
      return { 
        ...state,
        open_email_report: true 
      };
      case OPEN_RAISE_QUERY:
        return { 
          ...state,
          open_raise_query: true 
        };
        case CLOSE_RAISE_QUERY:
          return { 
            ...state,
            open_raise_query: false,
          };
    case CLOSE_EMAIL_REPORT:
      return { 
        ...state,
        open_email_report: false,
      };
    case OPEN_ADD_USER:
      return { 
        ...state,
        open_add_user: true 
      };

    case CLOSE_ADD_USER:
      return { 
        ...state,
        open_add_user: false,
      };
      case EDIT_ADD_USER:
      return { 
        ...state,
        lender_user_edit: true,
      };
      case GET_SEARCH_ACTIVE:
      return { 
        ...state,
        searchActive: payload,
      };
    default:
      return state;
  }
}
