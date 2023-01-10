import axios from "axios";
const REACT_APP_API_URI = process.env.REACT_APP_API_URI;
const API_URL = REACT_APP_API_URI;

class AuthService {
  login(url, getData) {
    return axios
      .post(API_URL + url, getData)
      .then((response) => {
        return response.data;
      });
  }

  post(url, getData) {
    return axios
      .post(API_URL + url, getData)
      .then((response) => {
        return response.data;
      });
  }

  get(url) {
    return axios
      .get(API_URL + url)
      .then((response) => {
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(username, email, password) {
    return axios.post(API_URL + "signup", {
      username,
      email,
      password,
    });
  }
}

export default new AuthService();
