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

class YTIcon extends Component {


    constructor(props) {
        super(props);
    this.state = {
       src: "",
       authConfig: {
        headers: {Authorization: "Bearer " + this.props.jwtToken}
    },
    title: this.props.title,
    
    }
}

    componentDidMount() {
        var src = 'https://i.ytimg.com/vi/' + this.props.id + '/hqdefault.jpg';
        this.setState({src: src });
    }

    removeIcon = (data, cross) => {

        axios.post(URL.api+URL.removeIcon, data, this.state.authConfig)
        .then(() => {
            
            cross.className = 'addEntity';
            
        })
        .catch(error => {console.log(error); this.Alert("Przepraszamy, nie udało się usunąć ikony.")});
    }

    disableIcon = (data, entityToDisable) => {
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
        //var cross = event.target;
        //var entity = document.getElementById(ID);
        //var name = entity.title

            const data = {
                        Id: ID,
                        Type: "YT",
                        //UserId: this.props.userId,
                        //Title: name
                        }

        axios.post(URL.api+URL.moveIcon, data, this.state.authConfig)
          .then(() => {
             //entity.className  = 'disable';
             this.props.sendToRemove(ID);
              })
          .catch(error => {console.log(error); this.Alert("Przepraszamy, nie udało się przenieść ikony.")});
  }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    onError = () => {
        //alert('The image could not be loaded.');
        const logo = require('./149932.png');
        this.setState({src: logo });
      }

      showEditor = () => {
        this.setState({showEditor: true})
      }

      hideEditor = () => {
        this.setState({showEditor: false})
      }

    YTHandler = (event) => {
        
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
                        Type: "YT",
                        //UserId: this.props.userId,
                        Title: name,
                        Top: Top_,
                        Left: Left_,
                        FolderId: this.props.folderId
                        }

    
         //debugger;    
        if(event.target.className == "addEntity")
        {
            var url = URL.api+URL.addIcon;
            //console.log("DKASHKDJHASKJDSA - " + url);
            axios.post(URL.api+URL.addIcon, data, this.state.authConfig)
            .then((response) => {
                debugger;
                cross.className = 'removeEntity'; cross.title = "Usuń z pulpitu";})
            .catch(error => {console.log(error); this.Alert("Przepraszamy, nie udało się dodać ikony.")});
        }

        if(event.target.className == "addingEntity")
        {
            //debugger;
            const icon = {
                id: ID,
                title: "",
                top: entity.style.top,
                left: entity.style.left,
                type: "YT"
            }

            axios.post(URL.api+URL.addIcon, data, this.state.authConfig)
            .then((response) => {
                debugger;
                if(response.data){
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
            //debugger;
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

    render() {
     
        var classEntity = "";
        var iconTitle = ""
       
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
       
        var addIcon = this.props.isAuth?   <div id={this.props.id} onClick = {this.YTHandler}
        title={iconTitle}  class={classEntity}>&#43;</div> : "";

        var indexIcon = this.props.isAdmin? 
        <div style={{fontSize: "11px"}} title={iconTitle} id={this.props.id} >{this.props.index}</div> : "";


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
            iconType="YT"></IconEditor>

            var editIcon = (this.props.remover!==3 && this.props.fromDesk)? 
            <div id={this.props.id} 
            class="editEntity" style={{left: this.props.leftEdit}}><i id={this.props.id}
            title="" class="icon-dot-3"
            />
            {editIconField}
            </div> : "";

        return (
            <div onDoubleClick={this.props.linkTo}
            
            title={this.props.title} id={this.props.id}
            class={this.props.classname}
            style={this.props.location}
            onMouseOver={this.props.onHover}
            onMouseLeave={this.props.onLeave}>
                <img 
             
                  id={this.props.id}
                  title={this.props.title} 
                  src={this.state.src} height={this.props.size} style={{ margin: '0px'}} 
                  onError={this.onError}>
                  </img> 

                {/* <i class="icon-note" id={this.props.id}
                  title={this.props.title}  /> */} 
                    {addIcon}
                    
                    {editIcon}
                    {indexIcon}
                 
                   
               
               {/*    <div id={this.props.id} onClick = {this.saveYT}
                  title={this.props.title}  class="addEntity">&#43;</div> */}
            </div>
                  
        )
    }
}
const mapStateToProps = state => {
    return {
        jwtToken: state.auth.jwttoken,
        url: state.auth.sourceUrl,
        isAdmin: state.auth.userRole == "ADMIN",
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

  export default connect( mapStateToProps, mapDispatchToProps )(YTIcon);