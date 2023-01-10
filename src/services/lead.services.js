import axios from "axios";
const API_URL = process.env.REACT_APP_API_URI;

class LeadService {
  get(Url) {
    return axios
      .get(API_URL + Url)
      .then((response) => {
        return response.data;
      });
  }

  post(getdata, Url) {
    return axios
      .post(API_URL + Url, getdata)
      .then((response) => {
        return response.data;
      });
  }

  getLeadContent() {
    return axios.get(API_URL + "leads");
  }

}

export default new LeadService();
