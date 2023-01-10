import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import user from "./users";
import leads from "./leads";
import model from "./model";

export default combineReducers({
  auth,
  user,
  model,
  leads,
  message,
});
