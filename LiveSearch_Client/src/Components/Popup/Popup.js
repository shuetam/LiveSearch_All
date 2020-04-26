import React, { Component } from 'react';
import '../Header/Header.css';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {forSure, showServerPopup, removingIcon} from '../../Store/Actions/auth';
import {URL} from '../../environment';

class Popup extends Component {

    okClick = () => {
        this.clickDoNotShow();
        var config = {
            headers: {Authorization: "Bearer " + this.props.jwtToken}
        }; 
        axios.post(URL.api+URL.removeIcon, this.props.data, config)
        .then(() => {
            if(this.props.entity.className == "removeEntity") {
                this.props.entity.className = 'addEntity';
            }
            else {
               // this.props.entity.className = "disable";
                this.props.sendToRemove(this.props.entity.id);
            }

        })
        .catch(error => {console.log(error); this.Alert("Wystąpił błąd. Spróbuj ponownie później.")});

        this.props.ForSure();
    }

    noClick = () => {
        this.clickDoNotShow();
        this.props.ForSure(); 
    }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    clickDoNotShow = () => {

        if(document.getElementById("doNotShowBox").checked === true) {

            /* if(this.props.data && this.props.data.Type == "FOLDER")
            {
                localStorage.setItem(this.props.userId+"F", 1);
            } */
            if(this.props.data)
            {
                localStorage.setItem(this.props.jwtToken+"Y", 1);
            }
        }
    }

    render() {

        var hasTitle = (this.props.data && this.props.data.Title !== "");
        var title = hasTitle? this.props.data.Title : "brak tytułu";
        var isFolder = (this.props.data && this.props.data.Type == "FOLDER");
        var folder = (this.props.data && this.props.data.Type == "FOLDER")? "folder" : "";
        var withEl = (this.props.data && this.props.data.Type == "FOLDER")? 
        " wraz ze wszystkimi elementami w nim zawartymi" : "";

        let doNot = <label id="doNotShow" style={{fontSize: "12px", display: isFolder? "none": "block" }} >
        <input name="doNotShow" type="checkbox" id="doNotShowBox" />
        Nie pokazuj więcej tego okna.
        </label>
  
        
        return (
        <div class="popup" style={{top: this.props.showPopup? "10px" : "-1000px"}}>

           Czy na pewno chcesz usunąć ze swojego pulpitu {folder} <span style={{color: "white"}} ><br/>{title}</span>{withEl}?
        <div style={{display: "flex", padding: "5px", marginLeft: "55px",marginRight: "55px"}}>
            <div class="popupButtton" onClick={this.okClick}>Tak</div> <div class="popupButtton" onClick={this.noClick}>Nie</div>
        </div>
            {doNot}        
        </div>
                  
        )
    }
}


const mapStateToProps = state => {
   //debugger;
    return {
        showPopup: state.auth.showPopup,
        data: state.auth.dataToSend,
        entity: state.auth.entityToChange,
        //userId: state.auth.userId,
        jwtToken: state.auth.jwttoken,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        ForSure: () => dispatch(forSure()),
        serverAlert: (message) => dispatch(showServerPopup(message)),
        sendToRemove: (id) => dispatch(removingIcon(id))
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(Popup);