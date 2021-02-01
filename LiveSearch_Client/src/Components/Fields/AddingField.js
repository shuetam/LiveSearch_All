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

let spotify = <div className="imageField">              
<iframe src={this.props.id}  width="300" height="315" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
</div>

let video =    <div className="field">
<ReactPlayer
url={this.props.play.includes("www.")? this.props.play : "https://www.youtube.com/watch?v=" + this.props.play}
height= '315px'
width= '560px'
playing ={this.state.playMain} 
controls = {true}
onReady={this.mainVideoOnReady}
onPlay={this.playReflect}
onPause={this.pauseReflect}
/* onSeek={this.onChange} */
onEnded={this.props.nextSong}
/>  
</div>

let image =  <div className="imageField" >
<img 
   class="imgField"
  src={this.props.src}></img>  
</div>



 
        let iconIcons = <div style={{fontSize: "17px"}}><i class="icon-youtube"/>
        <i class="icon-spotify"/>
        <i class="icon-picture"/></div>

let inputPaste =
<span   class="fieldEditorInput">
<input id="addingIconLink" type="text"
autofocus="true"
placeholder =  "Wpisz tytuł dla folderu"/> 
 </span>


var infoText =  <div  className="lockIconF" style={{fontSize: "14px", padding: "5px", color: "rgba(255, 255, 255, 0.501)"}}>
  Aby odszukać i dodać ikony reprezentujące film YouTube lub zdjęcia,
  wklej link do filmu, strony www lub postu na Instagramie.
  W celu dodania ikony z serwisu Spotify skopiuj i wklej osadzony kod, który znajduje się
  w zakładce "Udostępnij" w opcjach utworu, albumu, artysty lub playlisty.</div>



 var findButton = <div><button class= "titleButton"   onClick={this.findHandler} style={{fontSize: 14, width: "200px",  padding: "5px"}}>
    Znajdź ikony</button></div>

var handlerButtons =  <div className="editHandler">
<button class="titleButton privateButton" onClick={this.stopAdding}  style={{fontSize: 13, padding: "3px",  width: '80px'}}>Zakończ</button>
</div>

    let editor = 
    (<div class="fieldAct fieldEditor">  <span style={{fontSize: "17px"}}>
        {iconIcons}
        {inputPaste}
        {infoText}
        
        </span>
        <p/>
            {findButton}
            {handlerButtons}       
            </div>)
    
            return editor;
     
    }
}

export default withRouter(AddingField);