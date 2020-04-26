
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
//import EditableLabel from 'react-inline-edit';

class IconEditor extends Component {

    constructor(props) {
        super(props);

        this.state = { 
            showTitle: false,                            
            
        }
    }

    editTitle = (event) => {
         /* var ent = document.getElementById(event.target.id);
        var left = ent.style.left;
        var top = ent.style.top;  */
        //debugger;
        this.props.showTitleEditor(this.props.id, this.props.iconType);
    }
/* 
      componentDidMount() { 
        var thisEn = document.getElementById(this.props.id);
        var top = thisEn.style.top;
        //console.log(top);
    }   */
    
    
    render() {
     
    let moveFromFolder = this.props.fromFolder? <div 
    
    onDbClick={() => {
        this.props.moveIcon();
    }}

    onClick={() => {
        this.props.moveIcon();
    }} class="switcher"><i id={this.props.id} class="icon-left-bold"/> 
    Przenieś do pulpitu<hr/></div> : "";
    let showImg = this.props.iconType == 'IMG'? <div 
    id={this.props.id}
    onDbClick={() => {
        this.props.showImg();
    }} 

    onClick={() => {
        this.props.showImg();
    }} 
    class="switcher"><i id={this.props.id} class="icon-resize-full-alt"/> 
    Podgląd zdjęcia <hr/></div> : "";
    
    let field = 
    <div id={this.props.id} title="" class="editField" onMouseOver={this.props.onHover} 
    style={this.props.bottom? {bottom: "20px"} : {top: "20px"} }
    onMouseLeave={this.props.onLeave}>
        {showImg}
        {moveFromFolder}
        


        <div id={this.props.id}  class="switcher"
            onDbClick={this.editTitle}

            onClick={this.editTitle}><i id={this.props.id} class="icon-edit"/>
            Edytuj tytuł
            </div>
     
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