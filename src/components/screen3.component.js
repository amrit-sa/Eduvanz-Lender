import React, { Component } from "react"
import { connect } from "react-redux"
import Helmet from "react-helmet"

  const initial = {
};

class Screen3 extends Component {
  constructor(props) {
    super(props);
    this.state = initial;
  }

 

  render() {
    return (
        <>
        <Helmet>
            <title> Screen 3 </title>
        </Helmet>
  <button
    type="button"
    className="btn btn-primary"
    data-toggle="modal"
    data-target="#model_1"
  >
    Launch demo modal
  </button>
  <div
    className="modal fade documentspopup"
    id="model_1"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
        <div class="d-flex col-md-12">
        <div className="col-md-4">
          <img src="img/icon_tick.svg" /> Verified by Eduvanz
        </div>
          <div className="col-md-4 text-center">
            <h5><b>Modal title</b></h5>
          </div>
          <div className="col-md-4">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="row justify-content-center align-items-center">
            <div className=" pt-5 pb-5 pl-5 pr-5">
            <img src="images/14.jpg" />
            </div>
            </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary mr-4"><img src="img/icon_Download.svg" /> Download</button>
          <button className="btn btn-primary mr-4"><img src="img/icon_pcase.svg" /> Previous</button>
          <button className="btn btn-primary">Next <img class="alignedright" src="img/icon_ncase.svg" /></button>
        </div>
      </div>
    </div>
  </div>


  <button
    type="button"
    className="btn btn-primary"
    data-toggle="modal"
    data-target="#model_2"
  >
    Launch demo modal
  </button>

  <div
    className="modal fade documentspopup"
    id="model_2"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
        <div class="d-flex col-md-12">
        <div className="col-md-4">
          <img src="img/icon_tick.svg" /> Verified by Eduvanz
        </div>
          <div className="col-md-4 text-center">
            <h5><b>Modal title</b></h5>
          </div>
          <div className="col-md-4">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="row justify-content-center align-items-center">
            <div className=" pt-5 pb-5 pl-5 pr-5">
            <img src="images/14.jpg" />
            </div>
            </div>
        </div>
        <div className="modal-footer">
        <div className="btndesigned1">
            <button className="active">Front</button>
            <button>Back</button>
          </div>
          <button className="btn btn-primary mr-4"><img src="img/icon_Download.svg" /> Download</button>
          <button className="btn btn-primary mr-4"><img src="img/icon_pcase.svg" /> Previous</button>
          <button className="btn btn-primary">Next <img class="alignedright" src="img/icon_ncase.svg" /></button>
        </div>
      </div>
    </div>
  </div>



  <button
    type="button"
    className="btn btn-primary"
    data-toggle="modal"
    data-target="#model_3"
  >
    Launch demo modal
  </button>

  <div
    className="modal fade documentspopup"
    id="model_3"
    tabIndex={-1}
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
        <div class="d-flex col-md-12">
        <div className="col-md-4">
          <img src="img/icon_tick.svg" /> Verified by Eduvanz
        </div>
          <div className="col-md-4 text-center">
            <h5><b>Modal title</b></h5>
          </div>
          <div className="col-md-4">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
          </div>
          </div>
        </div>
        <div className="modal-body">
          <div className="row justify-content-center align-items-center">
            <div className=" pt-5 pb-5 pl-5 pr-5">
            <img src="images/14.jpg" />
            </div>
            </div>
        </div>
        <div className="modal-footer">
          <div className="btndesigned2">
            <button className="active">01</button>
            <button>02</button>
            <button>03</button>
            <button>04</button>
            <button>05</button>
          </div>
          <button class="btn btn-primary mr-4"><img src="img/icon_Download.svg" /> Download</button>
          <button class="btn btn-primary mr-4"><img src="img/icon_pcase.svg" /> Previous</button>
          <button class="btn btn-primary">Next <img class="alignedright" src="img/icon_ncase.svg" /></button>
        </div>
      </div>
    </div>
  </div>

        </>
    );
  }
}

export default Screen3;
