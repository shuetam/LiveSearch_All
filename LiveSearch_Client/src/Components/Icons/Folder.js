import React, { Component } from 'react';
import './Icons.css';
import { connect } from 'react-redux';
import {popup, showServerPopup, removingIcon} from '../../Store/Actions/auth';

import IconEditor from './IconEditor';

class Folder extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authConfig: {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            },
        
        }

    }

    deleteFolder = (event) => {
        var ID = event.target.id;
        //var name = event.target.title;
        var cross = event.target;
        var entity = document.getElementById(ID);
        var name = entity.title;
    
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
       this.props.showTitleEditor(this.props.id, "FOLDER");
    }
    followFolder = (event) => {
        this.props.followFolder(this.props.id);
    }

    unFollowFolder = (event) => {
      this.props.unFollowFolder(this.props.id);
    }


    render() {
/*         var src0 = this.props.icon0? 'https://i.ytimg.com/vi/' + this.props.icon0 + '/hqdefault.jpg': "";
        var src1 = this.props.icon1?  'https://i.ytimg.com/vi/' + this.props.icon1 + '/hqdefault.jpg': "";
        var src2 = this.props.icon2?  'https://i.ytimg.com/vi/' + this.props.icon2 + '/hqdefault.jpg': "";
        var src3 = this.props.icon3?  'https://i.ytimg.com/vi/' + this.props.icon3 + '/hqdefault.jpg': ""; */
        

        var src0 = this.props.icon0? this.props.icon0 : "";
        var src1 = (this.props.icon1 && !this.props.smallFolder)?   this.props.icon1 : "";
        var src2 = (this.props.icon2 && !this.props.smallFolder)?  this.props.icon2 : "";
        var src3 = (this.props.icon3 && !this.props.smallFolder)?   this.props.icon3 : "";
        debugger;
        var classEntity = "disableEntity";
      
        var removeIcon ="";
        var shareIcon = "";
        var editIconField =""; 
        var followedIcon =""; 

        if(!this.props.public) {

            removeIcon = this.props.hideEditors? "" : <div id={this.props.id} onClick = {this.deleteFolder}
            title="Usuń folder"  class={classEntity}>&#43;</div> ;
            
        shareIcon = this.props.shared? <div id={this.props.id} title="Obserwujących"  className="lockIcon openIcon"><i id={this.props.id}  class="icon-lock-open-alt"/></div> 
            : <div id={this.props.id} title="Prywatny" className="lockIcon"><i id={this.props.id} class="icon-lock"/></div>;
            
            editIconField = <i id={this.props.id} title="Edytuj/udostępnij" class="icon-edit" onClick={this.editFolder}/>
        }
        else{

         if(!this.props.owner) {
            followedIcon = this.props.followed?
            // <div onClick={this.unFollowFolder} id={this.props.id} title="Przestań obserwować"  className= {"editEntity followIcon" } style={{fontSize: "17px"}}><i id={this.props.id}  class="icon-eye-off"/></div>  
            
            ""
            : <button onClick={this.followFolder} id={this.props.id} title="Obserwuj"  className= { "titleButton followIcon " + this.props.waiting}>Obserwuj</button> 


        }
    }

        var editIconField_old = <IconEditor 
        onHover = {this.props.onHover}
        onLeave = {this.props.onLeave}
        //fromFolder={this.props.fromFolder}
        //moveIcon={this.moveIcon}
        id={this.props.id}
        showTitleEditor={this.props.showTitleEditor}
        title={this.props.title}
        bottom={this.props.bottom}
        shared = {this.props.shared}
        iconType="FOLDER"></IconEditor>

        var editIcon = this.props.hideEditors? "" :
        <div id={this.props.id} onClick={this.editFolder}
          class="editEntity" style={{left: this.props.leftEdit, top: this.props.topEdit}} >
        {editIconField}
   
        </div> 
      

       

        var content = this.props.icon0?

        <table id={this.props.id} style={{marginTop: this.props.smallFolder? "2px" : "8px", width: "100%", height: "100%"}}>
        <tbody>
        <tr  id={this.props.id}>
        <td  id={this.props.id}>
        <img class={src0!==""? "folderTd" : "disable"} id={this.props.id}  src={src0} width={this.props.factor * 35+"px"}  height= {this.props.factor * 25+"px"}></img> 
        </td>
        <td  id={this.props.id}> <img class={src1!==""? "folderTd" : "disable"}  id={this.props.id} src={src1} width={this.props.factor * 35+"px"}  height= {this.props.factor * 25+"px"}></img> </td>
        </tr>
        <tr  id={this.props.id}>
        <td  id={this.props.id}> <img class={src2!==""? "folderTd" : "disable"}  id={this.props.id}  src={src2} width={this.props.factor * 35+"px"}  height= {this.props.factor * 25+"px"}></img> </td>
        <td  id={this.props.id}> <img class={src3!==""? "folderTd" : "disable"} id={this.props.id}  src={src3} width={this.props.factor * 35+"px"}  height= {this.props.factor * 25+"px"}></img> </td>
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
            {shareIcon}
            {followedIcon}
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