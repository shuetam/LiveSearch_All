import React, { Component } from 'react';
import './Icons.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {popup, showServerPopup, removingIcon} from '../../Store/Actions/auth';
import {URL} from '../../environment'
import ReactDOM from 'react-dom';
import IconEditor from './IconEditor';

class Folder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authConfig: {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            }
        }

    }

    deleteFolder = (event) => {
        var ID = event.target.id;
        //var name = event.target.title;
        var cross = event.target;
        var entity = document.getElementById(ID);
        var name = entity.title;
        debugger;
            const data = {
                        Id: ID,
                        Type: "FOLDER",
                        //UserId: this.props.userId,
                        Title: name,
                        Top: entity.style.top,
                        Left: entity.style.left
                        }

        if(event.target.className == "disableEntity")
        { 
           /*  if(localStorage.getItem(this.props.userId+"F")==1) {
                
                axios.post(URL.api+URL.removeIcon, data)
                .then(() => {
                   // debugger;
                   // document.getElementById(ID).className  = 'disable';
                   this.props.sendToRemove(ID);
                })
                .catch(error => {console.log(error); this.Alert("Nie udało się usunąć folderu.")});
            } */
           // else {
                this.props.MagnagePopup(data, entity);
           // }

        }
    }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    editFolder = (event) => {  
       // debugger;
    }


    render() {
/*         var src0 = this.props.icon0? 'https://i.ytimg.com/vi/' + this.props.icon0 + '/hqdefault.jpg': "";
        var src1 = this.props.icon1?  'https://i.ytimg.com/vi/' + this.props.icon1 + '/hqdefault.jpg': "";
        var src2 = this.props.icon2?  'https://i.ytimg.com/vi/' + this.props.icon2 + '/hqdefault.jpg': "";
        var src3 = this.props.icon3?  'https://i.ytimg.com/vi/' + this.props.icon3 + '/hqdefault.jpg': ""; */
        

        var src0 = this.props.icon0? this.props.icon0 : "";
        var src1 = this.props.icon1?   this.props.icon1 : "";
        var src2 = this.props.icon2?   this.props.icon2 : "";
        var src3 = this.props.icon3?   this.props.icon3 : "";
        
        var classEntity = "disableEntity";
      
        var removeIcon = <div id={this.props.id} onClick = {this.deleteFolder}
        title="Usuń folder"  class={classEntity}>&#43;</div> ;


        var editIconField = <IconEditor 
        onHover = {this.props.onHover}
        onLeave = {this.props.onLeave}
        //fromFolder={this.props.fromFolder}
        //moveIcon={this.moveIcon}
        id={this.props.id}
        showTitleEditor={this.props.showTitleEditor}
        title={this.props.title}
        bottom={this.props.bottom}
        iconType="FOLDER"></IconEditor>

        var editIcon = 
        <div id={this.props.id} 
          class="editEntity" style={{left: this.props.leftEdit, top: this.props.topEdit}} ><i id={this.props.id}
        title="" class="icon-dot-3"
        />
        {editIconField}
        </div> 

       

        var content = this.props.icon0?

        <table id={this.props.id} style={{marginTop: "8px"}}>
        <tbody>
        <tr  id={this.props.id}>
        <td  id={this.props.id}>
        <img class={src0!==""? "folderTd" : ""} id={this.props.id}  src={src0} height="25px"></img> 
        </td>
        <td  id={this.props.id}> <img class={src1!==""? "folderTd" : ""}  id={this.props.id} src={src1} height="25px"></img> </td>
        </tr>
        <tr  id={this.props.id}>
        <td  id={this.props.id}> <img class={src2!==""? "folderTd" : ""}  id={this.props.id}  src={src2} height="25px"></img> </td>
        <td  id={this.props.id}> <img class={src3!==""? "folderTd" : ""} id={this.props.id}  src={src3} height="25px"></img> </td>
        </tr>
        </tbody>
        </table>
        :
        <div id={this.props.id} style={{fontSize: '11px', marginTop: "8px"}}>Upuść tutaj wybraną ikonę aby dodać ją do tego folderu.</div>

        
        return (
           
            <div  onDoubleClick={this.props.linkTo}
             id={this.props.id}
             class={this.props.classname}
             title={this.props.title}
            style={this.props.location}
            onMouseOver={this.props.onHover}
            onMouseLeave={this.props.onLeave}>
            {content}

                    {removeIcon}

            <div class="folderLabel"  id={this.props.id} >{this.props.title}</div>
                    {editIcon}
            </div>
            
           

                  
        )
    }
}

const mapStateToProps = state => {
    return {
        jwtToken: state.auth.jwttoken
    };
  };

const mapDispatchToProps = dispatch => {
    return {
        MagnagePopup: (data, cross) => dispatch(popup(data, cross)),
        serverAlert: (message) => dispatch(showServerPopup(message)),
        sendToRemove: (id) => dispatch(removingIcon(id))
    };
};

  export default connect( mapStateToProps, mapDispatchToProps )(Folder);