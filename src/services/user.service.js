import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URI;

class UserService {
  get(Url) {
    return axios
      .get(API_URL + Url)
      .then((response) => {
      //  console.log('response', response);
        return response.data;
      });
  }

  post(getdata, Url) {
    return axios
      .post(API_URL + Url, getdata)
      .then((response) => {
      //  console.log('response', response);
        return response.data;
      });
  }

  getLeadContent() {
    return axios.get(API_URL + "leads");
  }

  getUserBoard() {
    return axios.get(API_URL + "user", { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + "mod", { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + "admin", { headers: authHeader() });
  }
}

export default new UserService();
