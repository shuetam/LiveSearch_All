import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';
import ReactPlayer from 'react-player';


class AddingField extends Component {

    constructor(props) {
        super(props);


        this.state = {
            
        }
    }

    componentDidMount() {
        
    }

 
    findHandler = () => {
        var url = document.getElementById("addingIconLink").value;
        this.props.findIcon(url);
    }

    stopAdding = () => {
        this.props.stopAdding();
    }



    render() {

        let iconIcons = <div style={{fontSize: "17px"}}><i class="icon-youtube"/>
        <i class="icon-spotify"/>
        <i class="icon-picture"/></div>

let inputPaste =
<span   class="fieldEditorInput">
<input id="addingIconLink" type="text"
autofocus="true"
placeholder =  "Wklej link lub kod osadzenia"/> 
 </span>


var infoText =  <div  className="lockIconF" style={{fontSize: "13px", padding: "5px", color: "rgba(255, 255, 255, 0.701)"}}>
  Aby odszukać i dodać ikony reprezentujące film YouTube lub zdjęcia,
  wklej link do filmu, strony www lub postu na Instagramie.
  W celu dodania ikony z serwisu Spotify skopiuj i wklej osadzony kod, który znajduje się
  w zakładce "Udostępnij" w opcjach utworu, albumu, artysty lub playlisty.</div>



 var findButton = <button class= "titleButton"   onClick={this.findHandler} style={{marginLeft: "10px",  fontSize: 14, width: "140px",  padding: "5px"}}>
    Znajdź ikony</button>

var endButton =  <div className="editHandler">
<button class="titleButton privateButton" onClick={this.stopAdding}  style={{fontSize: 13, padding: "3px",  width: '120px'}}>Zakończ</button>
</div>

    

    let editor = 
    (<div class="fieldAct fieldEditor">  <span style={{fontSize: "17px"}}>
        {iconIcons}
        {infoText}
        {inputPaste}
            {findButton}
        </span>
        
      
            {endButton}       
            </div>)
    
            return editor;
     
    }
}

export default withRouter(AddingField);