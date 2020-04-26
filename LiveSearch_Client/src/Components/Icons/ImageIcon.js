import React, { Component } from 'react';
import './Icons.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import {popup, showServerPopup, addingIcon, removingIcon} from '../../Store/Actions/auth';
import {URL} from '../../environment';
import ReactDOM from 'react-dom';
import IconEditor from './IconEditor';


class ImageIcon extends Component {

    constructor(props) {
        super(props);

    this.state = {
       src: "",
       noError: true,
       showZoom: false,
       authConfig: {
        headers: {Authorization: "Bearer " + this.props.jwtToken}
    },
    //title: this.props.title,
    showTitle: false
  
    }
}
    
    componentDidMount() {

        this.setState({src: this.props.id });
        console.log("prevImgClass:" + this.props.imgClass)
    }

    removeIcon = (data, cross) => {

        axios.post(URL.api+URL.removeIcon, data, this.state.authConfig)
        .then(() => {
            
            cross.className = 'addEntity';
            
        })
        .catch(error => {console.log(error); this.Alert("Przepraszamy, nie udało się usunąć ikony.")});
    }

    disableIcon = (data, entityToDisable) => {
        //debugger;
          axios.post(URL.api+URL.removeIcon, data, this.state.authConfig)
            .then(() => {
                //entityToDisable.className  = 'disable';
                this.props.sendToRemove(entityToDisable.id);

                //entityToDisable.id = entityToDisable.id + 'dis';
                })
            .catch(error => {console.log(error); this.Alert("Przepraszamy, nie udało się usunąć ikony.")});
    }


    moveIcon = () => {

        var ID = this.props.id;
       /*  var cross = event.target;
        var entity = document.getElementById(ID);
        var name = entity.title */

            const data = {
                        Id: ID,
                        Type: "IMG",
                        //Source: this.props.url,
                        //UserId: this.props.userId,
                        //Title: name
                        }

        axios.post(URL.api+URL.moveIcon, data, this.state.authConfig)
          .then(() => {
             //entity.className  = 'disable';
             this.props.sendToRemove(ID);
              })
          .catch(error => {console.log(error); this.Alert("Nie udało się przenieść ikony.")});
  }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    showTitle = () => {
        this.setState({showTitle: true});
    }

    onError = (event) => {
        //alert('The image could not be loaded.');
        const logo = require('./149932.png');
       // this.setState({src: logo });
console.log(event);
       // if(this.props.newimage == true)
        //{
           // this.setState({noError: false});
        //}
      }

      zoomHandler = () => {
          this.setState({showZoom: !this.state.showZoom});
      }

      outZoom = () => {
          if(this.state.showZoom) {
            this.setState({showZoom: false});
          }
      } 

/*       showEditor = () => {
        this.setState({showEditor: true});
      }

      hideEditor = () => {
        this.setState({showEditor: false});
      } */
      
      setTitle = (event) => {
       
      }

    IconHandler = (event) => {
        
        var ID = event.target.id;
        var cross = event.target;
        var entity = document.getElementById(ID);
        var name = entity.title;
        var Top_ = entity.style.top;
        var Left_ = entity.style.left;


      
        if((entity.style.top).includes("px")) {
            var topFlo = (parseFloat(Top_) / document.documentElement.clientHeight) * 100;
            if(topFlo>99) {
                topFlo = 80;
            }

            var leftFlo = (parseFloat(Left_) / document.documentElement.clientWidth) * 100;
            if(leftFlo>99) {
                leftFlo = 80;
            }
            Top_= topFlo +"vh";
            Left_ = leftFlo + "vw";
        }
        
        //var folderid = this.props.folderId
        
            const data = {
                        Id: ID,
                        Type: "IMG",
                        //UserId: this.props.userId,
                        Source: this.props.url,
                        Title: name,
                        Top: Top_,
                        Left: Left_,
                        FolderId: this.props.folderId
                        }

    
             
        if(event.target.className == "addEntity")
        {
            axios.post(URL.api+URL.addIcon, data, this.state.authConfig)
            .then(() => {
               // debugger;
                cross.className = 'removeEntity'; cross.title = "Usuń z pulpitu";})
            .catch(error => {console.log(error); this.Alert("Nie udało się dodać ikony.")});
        }

        if(event.target.className == "addingEntity")
        {
            //debugger;
            const icon = {
                id: ID,
                title: "",
                source: this.props.url,
                top: entity.style.top,
                left: entity.style.left,
                type: "IMG"
            }

            axios.post(URL.api+URL.addIcon, data, this.state.authConfig)
            .then((response) => {
                debugger;
                if(response.data)
                {
                    this.props.addToProps(icon)
                }
                else {
                    this.Alert("Wybrana ikona znajduje się już w Twojej kolekcji.");
                }

               //entity.className = 'disable';
                //cross.className = 'removeEntity'; cross.title = "Usuń z pulpitu";
            })
            .catch(error => {console.log(error); this.Alert("Przepraszamy, nie udało się dodać ikony.")});
        }

        if(event.target.className == "removeEntity")
        {
           // debugger;
            if(localStorage.getItem(this.props.jwtToken+"Y")==1) {
                this.removeIcon(data, cross);
            }
            else {
                this.props.MagnagePopup(data, cross);
            }
            
        }
        if(event.target.className == "disableEntity")
        { 
            var entityToDisable = document.getElementById(ID);

            if(localStorage.getItem(this.props.jwtToken+"Y")==1) {

                this.disableIcon(data, entityToDisable)
            }
            else {
                this.props.MagnagePopup(data, entityToDisable);
            }
        }
    }

    getStyle = (prevImg) =>  {
        if(prevImg === "imgZoom1") {
            debugger;
            return {bottom: "0px", left: "0px"};
        }
        if(prevImg === "imgZoom2") {
            debugger;
            return {top: "0px", left: "0px"};
        }
        if(prevImg === "imgZoom3") {
            debugger;
            return {bottom: "0px", right: "0px"};
        }
        if(prevImg === "imgZoom4") {
            debugger;
            return {top: "0px", right: "0px"};
        }
    }

    render() {
        //var src =  this.props.id;
        //debugger;
        var src =  this.state.src;
        var classEntity = "";
        var iconTitle = "";
        var imgClass = "";

        if(this.props.quarter == 1) {
            imgClass = "imgZoom1";
            
        }
        if(this.props.quarter == 2) {
            imgClass = "imgZoom2";
            
        }
        if(this.props.quarter == 3) {
            imgClass = "imgZoom3";
         
        }
        if(this.props.quarter == 4) {
            imgClass = "imgZoom4";
         
        }




       
        if(this.props.remover==3)
        {
            classEntity = "addingEntity";
            iconTitle = "Dodaj do pulpitu";
        }
      
        if(this.props.remover==0)
        {
            classEntity = "addEntity";
            iconTitle = "Dodaj do pulpitu";
        }
        if(this.props.remover==1)
        {
            classEntity = "removeEntity";
            iconTitle = "Usuń z pulpitu";
          
        }
        if(this.props.remover==2)
        {
            classEntity = "disableEntity";
            iconTitle = "Usuń z pulpitu";
        }
       
        var addIcon = this.props.isAuth?   <div id={this.props.id} onClick = {this.IconHandler}
        title={iconTitle} style={{left: "83%"}}  class={classEntity}>&#43;</div> : "";


        var imgPreview = this.state.showZoom?  
        <img 
        class={imgClass}
        id={this.props.id}
        title={this.props.title} 
        src={this.state.src}
        onMouseLeave={this.outZoom}
        onError={this.onError}>
        </img>: "";


        ///////////////////////////
       /*  var moveIcon = //window.location.href.includes("folder")?
        (this.props.fromFolder && this.props.remover!==3)?
         <div id={this.props.id} onClick = {this.moveIcon}
          class="moveEntity" style={{left: "-27%"}}><i id={this.props.id} onClick = {this.moveIcon}
        title="Przenieś ikonę do głównego pulpitu" class="icon-left-bold"/></div>  : "";
 */
       /*  var zoomIcon = this.props.remover!==3? 
        <div id={this.props.id} onClick = {this.zoomHandler}
          class="zoomEntity" style={{left: "83%"}}><i id={this.props.id}
        title="Podgląd zdjęcia" class={this.state.showZoom? "icon-resize-small-alt" : "icon-resize-full-alt"} onClick = {this.zoomHandler} /></div> : "";
         */

 /*        var editIcon1 = this.props.remover!==3? 
        <div id={this.props.id} onClick = {this.editHandler}
          class="editEntity"><i id={this.props.id}
        title="Edytuj tytuł" class="icon-edit" onClick = {this.editHandler} /></div> : ""; */

  

        ///////////////////////////

        var editIconField = <IconEditor 
        onHover = {this.props.onHover}
        onLeave = {this.props.onLeave}
        fromFolder={this.props.fromFolder}
        moveIcon={this.moveIcon}
        showImg={this.zoomHandler}
        id={this.props.id}
        showTitleEditor={this.props.showTitleEditor}
        title={this.props.title}
        bottom={this.props.bottom}
        iconType="IMG"></IconEditor>

        var editIcon = (this.props.remover!==3 && this.props.fromDesk)? 
        <div id={this.props.id} 
          class="editEntity" style={{left: this.props.leftEdit}}><i id={this.props.id}
        title="" class="icon-dot-3"/>
        {editIconField}
        </div> : "";
        
          /* var editTitle = this.props.remover!==3? 
         <div id={this.props.id} class="titleDivEdit">
          <input  id={this.props.id} type="text" 
          onChange={this.setTitle} placeholder="Wyszukaj..."/></div>: "";  */ 
         

        return (


           
            <div  onDoubleClick={this.props.linkTo}
            
            title={this.props.title} id={this.props.id}
            class={this.state.noError? this.props.classname : "disable"}
            style={this.props.location}
            onMouseOver={this.props.onHover}
            onMouseLeave={this.props.onLeave}>

                <img 
                   class= {this.props.type =="BOOK"?  "entBook" : "entImg"}
                   id={this.props.id}
                   title={this.props.title} 
                   src={this.state.src}
                   onMouseLeave={this.outZoom}
                   onError={this.onError}>
                </img> 

                 {imgPreview}
                    
             
                {/* <i class="icon-note" id={this.props.id}
                  title={this.props.title}  /> */} 
                    {addIcon}
                
                    {editIcon}
                  
               {/*    <div id={this.props.id} onClick = {this.saveYT}
                  title={this.props.title}  class="addEntity">&#43;</div> */}
            </div>
                 
                  
        )
    }
}

const mapStateToProps = state => {
    return {
        jwtToken: state.auth.jwttoken,
        
    };
  };


const mapDispatchToProps = dispatch => {
    return {
        MagnagePopup: (data, cross) => dispatch(popup(data, cross)),
        serverAlert: (message) => dispatch(showServerPopup(message)),
        addToProps: (icon) => dispatch(addingIcon(icon)),
        sendToRemove: (id) => dispatch(removingIcon(id))
        
    };
};

  export default connect( mapStateToProps, mapDispatchToProps )(ImageIcon);