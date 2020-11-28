import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class FolderField extends Component {

    constructor(props) {
        super(props);


        this.state = {
            
        }
    }

    componentDidMount() {
        var folder = this.props.folder;
        debugger;
        
    }

 

    render() {
 
if(this.props.show && this.props.folder) {

    let youFollow = this.props.followed? <button class="titleButton followFiledIcon">Obserwujesz</button> : "";

    let updateDate =  !this.props.folder.updatedAt ==""?   <div style={{padding: "2px"}}>
    <span style={{color: "red"}}> 
   <i class="icon-calendar-empty"/></span> Zaktualizowano: {this.props.folder.updatedAt}
   </div>: ""
    

    let editor = 
    (<div class="fieldAct folderInfo"> <div style={{fontSize: "19px", color: "white"}}>
        {this.props.folder.title} {youFollow}</div>
        {!this.props.folder.hasDescription? "": <hr/>}
            <div style={{fontSize: "14px"}}>
                {this.props.folder.shareDescription}
            </div>
        <hr/>
        <div style={{fontSize: "15px"}}>

    
       <div style={{padding: "2px"}}>
       <span style={{color: "white"}}> 
      <i class="icon-doc"/></span> Ilość ikon: {this.props.folder.iconsCount}
      </div>
      <div style={{padding: "2px"}}>
       <span style={{color: " rgba(0, 201, 43, 0.945)"}}> 
       <i class="icon-eye"/></span> Obserwujących: {this.props.folder.followers}  
       </div>
{/*       <div style={{paddingLeft: "5px"}}>
      <span class="addIconInfo fontAdd">&#43; 
        </span>&nbsp;&nbsp;Ilość zapisów: {3}
      </div> */}
      <div style={{padding: "2px"}}>
       <span style={{color: "rgba(231, 173, 64, 0.637)"}}> 
      <i class="icon-link-ext"/></span> Udostępniono: {this.props.folder.sharedAt}
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

export default withRouter(FolderField);