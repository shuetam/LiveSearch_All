import React, { Component } from 'react';
import '../Header/Header.css';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';



class UnfollowPopup extends Component {

    okClick = () => {
       this.props.unFollowFolder(true, this.props.folderId);
    }

    noClick = () => {
        this.props.unFollowFolder(false, this.props.folderId);
    }



    render() {
//if(this.props.folder) {

    var title = this.props.unFollowTitle;
    
    return (
        <div class="popup" style={{top: this.props.showPopup? "10px" : "-1000px"}}>
    
               Czy na pewno chcesz przestać obserwować folder <span style={{color: "white"}} ><br/>{title}</span>?
            <div style={{display: "flex", padding: "5px", marginLeft: "55px",marginRight: "55px"}}>
                <div class="popupButtton" onClick={this.okClick}>Tak</div> <div class="popupButtton" onClick={this.noClick}>Nie</div>
            </div>
                
            </div>
                      
                    )
                //}
               // else {
                   // return "";
                //}
    }
}


export default withRouter(UnfollowPopup);