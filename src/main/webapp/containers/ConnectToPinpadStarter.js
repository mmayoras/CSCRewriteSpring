import React, {Component} from 'react';
import ZipCode from '../components/pinpadData/ZipCode';
import DOB from '../components/pinpadData/DOB';
import Welcome from '../components/pinpadData/Welcome';
import SSN from '../components/pinpadData/SSN';
import Refresh from '../components/pinpadData/Refresh';
import {dispatch, getState} from '../pinpadUtil/dispatchIndex';
import {isOpen} from '../pinpadUtil/socket';
import {resetPinPadData} from '../redux/pinpad/actionCreators';

class ConnectToPinpadStarter extends Component {
  constructor() {
    super();

    this.state = {
      pinPadConnected: false,
      updatePinPadConnected: false,
      localZipCode: '',
      localDOB: '',
      localSSN: '',
    };
  }

  refreshData = () => {
    const zipCode = getState().pinpadCardDetails.zipCode;
    const dob = getState().pinpadCardDetails.dob;
    const ssn = getState().pinpadCardDetails.ssn;

    this.setState({
      localZipCode: zipCode,
      localDOB: dob,
      localSSN: ssn,
    });
  };

  componentDidMount = () => {
    const setup = setInterval(() => {
      if (isOpen()) {
        clearInterval(setup);
        this.setState({
          updatePinPadConnected: true,
          pinPadConnected: true,
        });
      } else {
        clearInterval(setup);
        console.error('pinPad offline');
        this.setState({
          updatePinPadConnected: false,
          pinPadConnected: false,
        });
      }
    }, 50);

    dispatch(resetPinPadData());
  };

  render() {
    let pinPadConnected = this.state.pinPadConnected;
    const pinpadHeaderStyle = {
      padding: '5px',
      fontSize: '1.5em',
    };
    const pinpadDataDivStyle = {
      display: 'inline-block',
      padding: '5px',
    };

    return (
        <div style={{textAlign: 'center'}}>
          <p style={pinpadHeaderStyle}>PIN Pad Data</p>
          <Welcome pinpadConnected={pinPadConnected}
                   divStyle={pinpadDataDivStyle}/>
          <ZipCode pinpadConnected={pinPadConnected}
                   divStyle={pinpadDataDivStyle}/>
          <DOB pinpadConnected={pinPadConnected} divStyle={pinpadDataDivStyle}/>
          <SSN pinpadConnected={pinPadConnected} divStyle={pinpadDataDivStyle}/>
          <Refresh pinpadConnected={pinPadConnected}
                   divStyle={pinpadDataDivStyle}
                   refreshData={this.refreshData}/>
          <p style={{padding: '5px'}}><b>Zip Code:</b> {this.state.localZipCode} <b>Date
            of Birth:</b> {this.state.localDOB} <b>SSN:</b> {this.state.localSSN}</p>
        </div>
    );
  }
}

export default ConnectToPinpadStarter;
