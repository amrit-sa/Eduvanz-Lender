import React, { Component } from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";


class LenderUploadedFiles extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loading: false,
      selectedTab: 1,
    };
  }

  handleTab = (value) =>{
    this.setState({selectedTab: value});
  }

  render() {
    const { isLoggedIn, message } = this.props;
    const { selectedTab } = this.state
    return (
      <>
      <Helmet>
        <title>Uploaded Files</title>
      </Helmet>
      <div className="jumbotron text-center">
        <div className="row">
          <div className="col-sm-12">
             
          </div>
        </div>
      </div>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(LenderUploadedFiles);
