import React, { Component } from "react"
import { connect } from "react-redux"
import Helmet from "react-helmet"

  const initial = {
};

class Screen5 extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
  }

 

  render() {
    return (
        <>
        <Helmet>
            <title> Screen 5 </title>
        </Helmet>
       
        
        </>
    );
  }
}

export default Screen5;
