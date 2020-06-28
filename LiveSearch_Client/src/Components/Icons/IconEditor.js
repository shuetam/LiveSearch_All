
import React, { Component } from 'react';
import './Icons.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {popup, showServerPopup} from '../../Store/Actions/auth';
import {URL} from '../../environment';
import ReactDOM from 'react-dom';
import EditableLabel from 'react-editable-label';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { getUrlByIcon } from '../../CommonManager.js';

class IconEditor extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            showTitle: false,                            
            value: "https://livesearch.pl/"+ this.props.title,
            copied: false,
            url: "https://livesearch.pl/"
        }
    }
   
    editTitle = (event) => {
         /* var ent = document.getElementById(event.target.id);
        var left = ent.style.left;
        var top = ent.style.top;  */
        //debugger;
        this.props.showTitleEditor(this.props.id, this.props.iconType);
    }


 shareIconName = (event) => {
    var id =this.props.id;
    var type = this.props.iconType;
    var title = this.props.title;
    //var icon = document.getElementById(id);

    var top = this.props.location.top;
    var left = this.props.location.left;

   var iconData = {
       id: id,
       type: type,
       title: title,
       top: top,
       left: left,
       tags: this.props.tags
   }
//alert("copied");
   var url = getUrlByIcon(iconData);
   return url;
 }

 shareIcon = () => {
     this.setState({copied: true});
     setTimeout(() => {
        this.setState({ copied: false});
     
    }, 1500);
 }
/* 
      componentDidMount() { 
        var thisEn = document.getElementById(this.props.id);
        var top = thisEn.style.top;
        //console.log(top);
    }   */
  
   
    
    render() {
     
    let moveFromFolder = (this.props.fromFolder && !this.props.public)? <div 
    
    onDbClick={() => {
        this.props.moveIcon();
    }}

    onClick={() => {
        this.props.moveIcon();
    }} class="switcher"><i id={this.props.id} class="icon-left-bold"/> 
    Przenieś do pulpitu<hr/></div> : "";

    let showImg = (this.props.iconType == 'IMG' ||this.props.iconType =='BOOK') ? <div 
    id={this.props.id}
    onDbClick={() => {
        this.props.showImg();
    }} 

    onClick={() => {
        this.props.showImg();
    }} 
    class="switcher"><i id={this.props.id} class="icon-resize-full-alt"/> 
    Podgląd zdjęcia <hr/></div> : "";

    let editorText = this.props.iconType == 'FOLDER'? <span>Edytuj tytuł</span> : <span>Edytuj tytuł i tagi<hr/></span>;
    
let editTitle = this.props.public? "" : 
<div id={this.props.id}  class="switcher"
    onDbClick={this.editTitle}

    onClick={this.editTitle}><i id={this.props.id} class="icon-edit"/>
    {editorText}
    </div>

    let icon = this.state.copied? <span id={this.props.id}>&#x2714;  </span> : <i id={this.props.id} class="icon-link-ext"/>;

    let share = this.props.iconType == 'FOLDER'? "" : <div id={this.props.id}  class="switcher">
    {icon}
    <CopyToClipboard text={this.shareIconName()}
          onCopy={this.shareIcon}>
          <span id={this.props.id}> {this.state.copied? "Skopiowano link" : "Kopiuj link do ikony"}</span>
        </CopyToClipboard>
    </div>

    let field = 
    <div id={this.props.id} title="" class="editField" onMouseOver={this.props.onHover} 
    style={this.props.bottom? {bottom: "20px"} : {top: "20px"} }
    onMouseLeave={this.props.onLeave}>
        {showImg}
        {moveFromFolder}    
        {editTitle}
        {share}

{/* <input value={this.state.value}
          onChange={({target: {value}}) => this.setState({value, copied: false})} />
  */}


   </div>

        return field;   
       

    }
}

/* const mapStateToProps = state => {
    return {
        jwtToken: state.auth.jwttoken,
    
    };
  };


const mapDispatchToProps = dispatch => {
    return {
        serverAlert: (message) => dispatch(showServerPopup(message)), 
        
    };
}; */

  export default IconEditor;