import React, { Component } from 'react';
import '../Header/Header.css';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {hideServerPopup, showServerPopup} from '../../Store/Actions/auth';

class ServerPopup extends Component {

    okClick = () => {
        this.props.Hide();
    }

    render() {

        return (
        <div class="popup" style={{top: this.props.showPopup? "30px" : "-200px"}}>

           {this.props.message} {/* <br/>Brak odpowiedzi serwera. */}
        <div style={{display: "flex", padding: "5px", marginLeft: "55px",marginRight: "55px"}}>
            <div class="popupButtton" onClick={this.okClick}>OK</div>
        </div>          
        </div>
                  
        )
    }
}



const mapStateToProps = state => {
   //debugger;
    return {
        message: state.auth.serverMessage,
        showPopup: state.auth.showServerPopup
    };
};

const mapDispatchToProps = dispatch => {
    return {
        Hide: () => dispatch(hideServerPopup()),
     
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ServerPopup);