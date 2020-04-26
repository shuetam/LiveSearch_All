import React, { Component } from 'react';
import '../../App.css';
import '../Areas/Area.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import { Link, Route, NavLink } from 'react-router-dom';
import BookIcon from '../Icons/BookIcon';
import ImageField from '../Fields/ImageField';
import { BrowserRouter } from 'react-router-dom';
import randoom from 'random-int';
import axios from '../../axios-song';
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import { connect } from 'react-redux';
import {showServerPopup, manageScreen} from '../../Store/Actions/auth';
import {URL} from '../../environment'



class BestSellersAdmin extends Component {

    constructor(props) {
        super(props);

        this.state = {

            mainTitle: ".",
            loaded: false,
            intervalSong: null,
            maxCount: null,
            ytCount: null,
            fetchFrom: null,
            imgSource: "",
            hoveredId: "",
            iconID: "",
            actuallOpacity: 0.4,
            nowPlayed: "",
            playedShadow: '#FFF 0px 0px 5px, 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), #FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 10px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgb(255, 45, 45) 0px 0px 15px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 20px, rgb(255, 45, 45) 0px 0px 2px 5px',
            prevShadow: '#FFF 0px 0px 5px, 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), #FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgba(231, 173, 64, 0.637) 0px 0px 20px 10px,  rgba(231, 173, 64, 0.637) 0px 0px 10px, rgba(231, 173, 64, 0.637) 0px 0px 10px, rgba(231, 173, 64, 0.637) 0px 0px 20px, rgba(231, 173, 64, 0.637) 0px 0px 2px 5px',
            inMove: false,
            iconsType: "",
            icons: [],
            userIconsId: [],
            prevPlayed: [],
            noIcons: false,
            editedTitle: "",
            editedID: "",
            showEditor: false,
            authConfig: {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            },
        }
    }

  //  playedShadow: '#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgb(255, 45, 45) 0px 0px 30px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 20px, rgb(255, 45, 45) 0px 0px 2px 5px',


    componentDidMount() {

        
            this.setState({iconsType: "book"})
        
        fetch(this.props.fetchData).then(res => res.json()).then((result) =>
            this.setState({ icons: result })).then(() => {
            this.showBooks();
                })
            .catch(() => {this.Alert("Wystapił błąd. Brak odpowiedzi serwera. Spróbuj ponownie później."); this.setState({
                    loaded: true
                })}); 

        //this.getUserIconsId();
       // console.log(this.state.icons);
        
}

    componentWillUpdate() {

    }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

 /*     getUserIconsId = () => {

     if(this.props.isAuthenticated) {
        let data = {
            UserId: this.props.userId
        }
        
        axios.post(URL.api+URL.userIconsIds, data)
        .then((result) => {
           // debugger;
            this.setState({ userIconsId: result.data })});
        
    }
} */



editTitle = (value) => {
    debugger;
    this.setState({editedTitle: value})
}

editID = (value) => {
debugger;
this.setState({editedID: value})
}

hideEditor = (value) => {
//debugger;
this.setState({showEditor: false})
}
 
    setSize = (c) => {
       
        if(this.state.iconsType === "book") {
            return this.setSizeBook(c);
        }
    }


    setSizeBook = (c) => {
        if (c > 0) {

            return "30px";
        }
     
    }



    showBooks = () => {

        this.showErrorsOnly();

       
        if(this.state.icons.length>0) {
        setTimeout(() => {
            this.setState({
                loaded: true
            });
            //var icons = document.getElementsByClassName("entity");
        }, 2000)
        this.setState({nowPlayed: this.state.icons[0].id});
        this.setState({imgSource: this.state.icons[0].id});
    }
    else {
        this.setState({
            noIcons: true
        });
    }
    }


    onDbImgClick = (event) => {
        
        var played = document.getElementById(this.state.nowPlayed);
        if (played !== null) {
            var prevId = this.state.nowPlayed;
            this.setState(prevState => ({
                prevPlayed: [...prevState.prevPlayed, prevId]
            }))
        }
        this.setState({ nowPlayed: event.target.id });
        var note = document.getElementById(event.target.id)
        this.setState({imgSource: note.id});
       // debugger;
        note.style.boxShadow = this.state.playedShadow;

        var entity = document.getElementById(event.target.id);
        this.setState({editedTitle: entity.title });
        this.setState({editedID: entity.id });
        this.setState({showEditor: true});


    }


    onHover = (event) => {

       

        var entity = document.getElementById(event.target.id);

        var titleMain = entity.title.replace("||","<br/>");
        titleMain = titleMain.replace("||","<br/>");
        titleMain = titleMain.replace("||","<br/>");
        
        this.setState({ mainTitle: titleMain });
        var iconTitle = document.getElementById("258");
        document.getElementById("258").innerHTML = titleMain;
        iconTitle.innerHTML = titleMain;
        //debugger;
        entity.style.transition = 'top 0s, left 0s';
        

        var opacity = entity.style.opacity;
        
        console.log("ON MOUSE ON "+entity.id);
        console.log("OPACITY ->   " + opacity);
        if(entity.id !==  this.state.hoveredId)
        {
        this.setState({ actuallOpacity: opacity })
        }
        this.setState({hoveredId: entity.id});

        document.getElementById(event.target.id).style.opacity = 1;

        dragElement(document.getElementById(event.target.id));


        function dragElement(elmnt) {
            
            //localStorage.setItem('inMove', true);

            var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            elmnt.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
                localStorage.setItem('inMove', true);
            }

            function closeDragElement() {
                //debugger;
                //const inMove = localStorage.removeItem('inMove');
               // localStorage.setItem('inMove', false);
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }

    ////////////////////////////////////////////////


    editBookHandler = () => {

        var title = this.state.nowTitle;
        var id = this.state.nowPlayed;
   
      
       var newTitle = this.state.editedTitle;
   
       var data = {
           id: id,
           title: newTitle,
       }
       debugger; 
       axios.post(URL.api+URL.changeBook, data, this.state.authConfig)
       .then((result) => {
         //debugger; 
         this.Alert(result.data); 
         document.getElementById(id).title = result.data;
         document.getElementById(id).style.width = "60px";
           })
       .catch(error => {
           this.Alert("Nie udało się zmienić ikony. Spróbuj ponownie później.")}); 
   }



    userOwner = (id) => {
        return  this.state.userIconsId.includes(id);
    }


    cleanTitle = (event) => {
     
        this.setState({ mainTitle: "" });
         document.getElementById("258").innerHTML = "";
       
            document.getElementById(event.target.id).style.opacity = this.state.actuallOpacity;
        
    }

    rangeHandler = (event) => {
        var icons = document.getElementsByClassName("entity");
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.opacity = event.target.value / 100;
        }
    }

    liveSearch = (event) => {  
        var icons = document.getElementsByClassName("entity");
        for (var i = 0; i < icons.length; i++) {
            if(icons[i].title.toString().toLowerCase().includes(event.target.value.toString().toLowerCase()))
            {
                icons[i].style.visibility = 'visible';
               // icons[i].style.filter = "blur(0px)";
            }
            else
            {
                icons[i].style.visibility = 'hidden';
                   //icons[i].style.opacity = 0.3;
   
            }
        }
    }

    showErrorsOnly = () => {  

        var adminBoxEr = document.getElementById("adminBoxEr");
        if(adminBoxEr.checked) {
          
        var icons = document.getElementsByClassName("entity");
        for (var i = 0; i < icons.length; i++) {
            if(icons[i].title.toString().toLowerCase().includes("�"))
            {
                icons[i].style.visibility = 'visible';
               // icons[i].style.filter = "blur(0px)";
            }
            else
            {
                icons[i].style.visibility = 'hidden';
                   //icons[i].style.opacity = 0.3;
   
            }
        }
    }
    }

   
    getHPosition = () => {
        var randomInt = require('random-int');
        return randomInt(101,200);
    }

    getWPosition = () => {
        var randomInt = require('random-int');
        return randomInt(-50,200);
    }

    getNiceHttp = (address) => {
        var splitArr = address.split("//");
        if(splitArr.length > 1) {
            var reg = new RegExp("^www.");
            var reg1 = new RegExp("/$");

            var addr = splitArr[1];
            addr = addr.replace(reg, "");
            addr = addr.replace(reg1, "");

            if(addr.length>40)
            {
                addr = addr.substring(0, 40) + "...";
            }


            return addr;
        }
        else {
            return address;
        }
    }
      
    getBookWidth = (count) => {
                //debugger;
        var width = (20+ parseInt(count)*10) + "px";
        return width;
    }

    getBookHeight = (count) => {
        
        var height = (30+ parseInt(count)*10) + "px";
        return height;
    }


    getShadow = (left, top, id) => {

        var entity = document.getElementById(id);

        if(entity) {
            var top_ = entity.style.top;
            var left_ = entity.style.left;
            if(top_.includes("px")) {
                top = ((parseFloat(top_) / document.documentElement.clientHeight) * 100); 
                left = ((parseFloat(left_) / document.documentElement.clientWidth) * 100); 
            }
        }

        if(this.state.nowPlayed == id)
        {
            return this.state.playedShadow;
        }
        if(this.state.prevPlayed.includes(id)) {
            return this.state.prevShadow;
        }

        if(left<=50 && top<=50) {
            return "-1px 1px 3px 1px rgb(255, 255, 255)";
        }
        if(left>=50 && top<=50) {
            return "1px 1px 3px 1px rgb(255, 255, 255)";
        }
        if(left>=50 && top>=50) {
            return "1px -1px 3px 1px rgb(255, 255, 255)";
        }
        if(left<=50 && top>=50) {
            return "-1px -1px 3px 1px rgb(255, 255, 255)";
         }
    }

    render(props) {
        var randomInt = require('random-int');



/*         let icons = this.state.icons.map(song => {

            return (
                <YTIcon  remover={this.userOwner(song.id)? 1 : 0} isAuth = {this.props.isAuthenticated} userId={this.props.userId}  title={song.title} yt={song.id} id={song.id}
                    linkTo={this.onDbClick}
                    classname="entity"
                    size={this.state.loaded? this.setSize(parseInt(song.count)) : '0px' }
                    location={ this.state.loaded? 
                      {boxShadow: this.getShadow(parseInt(song.left),parseInt(song.top), song.id), top: song.top, left: song.left, transition: 'top '+2+'s, left '+2+'s', opacity: this.userOwner(song.id)? '0.2':'0.5'}:
                      {top: randomInt(101,200)+'vh', left: randomInt(-50,200)+'vw'}}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    count={song.count}
                />
            )
        }) */
       




        let books = this.state.icons.map(book => {
            return (
                <BookIcon  remover={0}  isAuth={this.props.isAuthenticated} userId={this.props.userId}   yt={book.id} id={book.id}
                classname= "entity"
                    linkTo={this.onDbImgClick}
                    
                    location={ this.state.loaded? 
                      {boxShadow: this.getShadow(parseInt(book.left), parseInt(book.top), book.id), 
                        top: book.top, left: book.left, transition: 'top '+3+'s, left '+3+'s' , width: this.getBookWidth(book.count), height: this.getBookHeight(book.count)} :
                      {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw',
                     }}
              
                    title = {book.title}
                    source = {book.id}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    srcWidth={this.getBookWidth(book.count)}
                    srcHeight={this.getBookHeight(book.count)}
                    fromFolder = {this.state.fromFolder} 
                    newimage = {false}
                />
            )
        })

      
        var isChecked = document.getElementById("adminBox");

        let editBook = (this.state.showEditor &&  isChecked.checked)?
        <div style={{zIndex:"200" }}  class="titleDivEdit">
        <input id="editT" type="text"
        autofocus="true"
        style={{backgroundColor: "black" }} 
        onKeyPress = {this.onKeyTitle}
         onChange={e => this.editTitle(e.target.value)} 
         value={this.state.editedTitle} /> 

      <input id="editID" type="text"
        autofocus="true"
        style={{backgroundColor: "black" }} 
        onKeyPress = {this.onKeyTitle}
         //onChange={e => this.editID(e.target.value)} 
         value={this.state.editedID} /> 

         <div style={{alignItems: "center"}}>
         <button class="titleButton" onClick={this.editBookHandler} style={{fontSize: 12, padding: "2px", height: '40px'  ,width: '90px'}}>Ok</button>
         &nbsp;
         <button class="titleButton" onClick={this.changeBookLocation}  style={{fontSize: 12, padding: "2px",  width: '60px'}}>Change location</button>
         &nbsp;
         <button class="titleButton" onClick={this.hideEditor}  style={{fontSize: 12, padding: "2px",  width: '60px'}}>Hide</button>
        
        
         <br/>
         <p/>
         <button class="titleButton" onClick={this.deleteYoutubeHandler}  style={{fontSize: 13, backgroundColor: "red",  padding: "2px",  width: '80px'}}>DELETE</button>
         
         </div>
         </div> : "";

        

            return (
                
                <div>

     
            <div> <input id="ls"  onChange={this.liveSearch} placeholder="Wyszukaj..." class="switchSearch" type="text"/></div>
            <div id="prop" class="switchB" style={{ position: 'fixed', right: '130px', bottom: '6px', zIndex: '300' }} > <i class="icon-cog" />
            <div id="propField">
                <p/>
                <hr/> 
                    <div>Jasność ikon:</div>
                    <input type="range" id="s"
                        onChange={this.rangeHandler} />
               <hr/> 
                {/* <p/>
                    <div class="switchScreen" onClick={this.screenManage}><i style={{fontSize: "20px" }} class={this.props.fullScreen? "icon-resize-small-alt" : "icon-resize-full-alt"}/>
                    {!this.props.fullScreen? "Aktywuj pełny ekran" : "Zamknij pełny ekran"}</div>
                  <hr/>  */}
                </div>
            </div>

           <ImageField src={this.state.imgSource} sourceShow={this.getNiceHttp(this.state.imgSource)} 
                noIcons={this.state.noIcons} fromDesktop={false}
                source={this.state.imgSource}
                show={this.state.loaded}/>

                <div id = "258" class= "titleDiv"> </div>
               
                {books}
                {editBook}

    <div class="containerIconsContainer">
               <div class="iconsContainer">
               
                </div>
                </div>
            </div>
        );
    }  
}

const mapDispatchToProps = dispatch => {
    return {

        serverAlert: (message) => dispatch(showServerPopup(message)),
    };
};

const mapStateToProps = state => {
    
    return {
        isAuthenticated: state.auth.userId !== null,
        userId: state.auth.userId,
        jwtToken: state.auth.jwttoken,
        //fullScreen: state.auth.fullScreen,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BestSellersAdmin);

