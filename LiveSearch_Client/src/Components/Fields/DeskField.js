import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class DeskField extends Component {

    constructor(props) {
        super(props);


        this.state = {
            
        }
    }

    componentDidMount() {
        
        
    }

 

    render() {
 
if(this.props.show && this.props.desk) {

    let youFollow = this.props.followed? <button class="titleButton followFiledIcon">Obserwujesz</button> : "";

    let updateDate =  !this.props.desk.updatedAt ==""?   <div style={{padding: "2px"}}>
    <span style={{color: "red"}}> 
   <i class="icon-calendar-empty"/></span> Zaktualizowano: {this.props.desk.updatedAt}
   </div>: ""
    

    let editor = 
    (<div class="fieldAct folderInfo"> <div style={{fontSize: "19px", color: "white"}}>
        {this.props.desk.title} {youFollow}</div>
        {!this.props.desk.hasDescription? "": <hr/>}
            <div style={{fontSize: "14px"}}>
                {this.props.desk.shareDescription}
            </div>
        <hr/>
        <div style={{fontSize: "15px"}}>

    
       <div style={{padding: "2px"}}>
       <span style={{color: "white"}}> 
      <i class="icon-doc"/></span> Ilość ikon: {this.props.desk.iconsCount}
      </div>
      <div style={{padding: "2px"}}>
       <span style={{color: " rgba(0, 201, 43, 0.945)"}}> 
       <i class="icon-eye"/></span> Obserwujących: {this.props.desk.followers}  
       </div>
{/*       <div style={{paddingLeft: "5px"}}>
      <span class="addIconInfo fontAdd">&#43; 
        </span>&nbsp;&nbsp;Ilość zapisów: {3}
      </div> */}
      <div style={{padding: "2px"}}>
       <span style={{color: "rgba(231, 173, 64, 0.637)"}}> 
      <i class="icon-link-ext"/></span> Udostępniono: {this.props.desk.sharedAt}
      </div>

    {updateDate}

        </div>
            </div>)

      
            return editor;
        }
        else {
            return "";
        }
     
    }
}

export default withRouter(DeskField);