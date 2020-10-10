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


    let editor = 
    (<div class="fieldAct folderInfo"> <div style={{fontSize: "19px", color: "white"}}>
        {this.props.folder.title} </div>
            <div style={{fontSize: "14px"}}>
                {this.props.folder.shareDescription}
            </div>
        <hr/>
        <div style={{fontSize: "15px"}}>
       <span style={{color: " rgba(0, 201, 43, 0.945)"}}> <i class="icon-eye"/></span>Obserwujących: {3}

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