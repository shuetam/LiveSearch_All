import React, { Component } from 'react';
import '../../App.css';
import './Area.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import ImageField from '../Fields/ImageField';
import FirstField from '../Fields/FirstField';
import SpotifyField from '../Fields/SpotifyField';
import LoginField from '../Fields/LoginField';
import InfoField from '../Fields/InfoField';
import { Link, Route, NavLink } from 'react-router-dom';
import YTIcon from '../Icons/YTIcon';
import LoadingField from '../Fields/LoadingField';
import { BrowserRouter } from 'react-router-dom';
import ImageIcon from '../Icons/ImageIcon';
import randoom from 'random-int';
import axios from '../../axios-song';
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
//import {scrollU, scrollD} from '../../Store/Actions/scroll';
import { connect } from 'react-redux';
import {showServerPopup, showFirst, manageScreen} from '../../Store/Actions/auth';
import {URL, PATHES} from '../../environment'
import TagsField from '../Fields/TagsField';
import 'url-search-params-polyfill';
import {parseBool} from '../../Converters.js';
import { leftToVw, topToVh } from '../../Converters.js';
import { bottomIcon, getQuarter, getIconFromUrl } from '../../CommonManager.js';
import SpotifyIcon from '../Icons/SpotifyIcon';

class PublicDesktop extends Component {

    constructor(props) {
        super(props);

        this.state = {

            mainTitle: ".",
            loadedIcons: false,
           
            hoveredId: "",
            ytID: "",
            actuallOpacity: 0.5,
            nowPlayed: "",
            playedShadow: '#FFF 0px 0px 5px, 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), #FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 10px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgb(255, 45, 45) 0px 0px 15px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 20px, rgb(255, 45, 45) 0px 0px 2px 5px',
            prevShadow: '#FFF 0px 0px 5px, 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), #FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgba(231, 173, 64, 0.637) 0px 0px 20px 10px,  rgba(231, 173, 64, 0.637) 0px 0px 10px, rgba(231, 173, 64, 0.637) 0px 0px 10px, rgba(231, 173, 64, 0.637) 0px 0px 20px, rgba(231, 173, 64, 0.637) 0px 0px 2px 5px',
           
            icons: [],
            images: [],
            spotify: [],
            userIconsId: [],
            prevPlayed: [],
            noIcons: false,

            explPopCheck: true,
            explIconsCount: 10,
            explDesk: true,
            explActuall: true,
            explHistory: true,
            explQuery: "",
            firstHover: false,
            firstField: false,
            exploreSkip: 0,
            showNextPrev: false
        }
      
    }



    componentDidMount() {
        
        this.setState({firstField: this.props.firstField});
        this.startFetchingIcons();
        this.getUserIconsId();
    }
    
    componentWillMount() {
        
    }   
    
    componentWillUpdate() {
     
    }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    ManageQueryUrl = () => {
        var query = this.props.location.search;
        var search = new URLSearchParams(query);
        var exploreQuery = search.get("q");
       
        debugger;
        if(exploreQuery !== null){
            this.setState({explQuery: exploreQuery})
        }
     
    }


    ManageExplFilter = () => {
      /*   var explPopCheck = localStorage.getItem('explPopCheck');
        var explDesk = localStorage.getItem('explDesk');
        var explActuall = localStorage.getItem('explActuall');
        var explHistory = localStorage.getItem('explHistory');
        if(explPopCheck !==null) {
            this.setState({explPopCheck: parseBool(explPopCheck)});
        }
        if(explDesk !==null) {
            this.setState({explDesk: parseBool(explDesk)});
        }
        if(explActuall !==null) {
            this.setState({explActuall: parseBool(explActuall)});
        }
        if(explHistory !==null) {
            this.setState({explHistory: parseBool(explHistory)});
        } */

        var explIconsCount =  localStorage.getItem('explIconsCount');
        if(explIconsCount !==null) {
            this.setState({explIconsCount: parseInt(explIconsCount)});
        }
        
     
      }


     getUserIconsId = () => {

     if(this.props.isAuthenticated) {
        var config = {
            headers: {Authorization: "Bearer " + this.props.jwtToken}
        }
        axios.post(URL.api+URL.userIconsIds, null, config)
        .then((result) => {
           // debugger;
            this.setState({ userIconsId: result.data })});
        //.catch(error => {this.Alert()}); 
        }
    }


    setStatesForIcon = (icons) => {

        return new Promise(resolve => {

        this.setState({ icons:
            Array.prototype.filter.call(icons, function(icon) {
                return icon.type=="YT";
            })
        });

        this.setState({ spotify:
            Array.prototype.filter.call(icons, function(icon) {
                return icon.type=="SPOTIFY";
            })
        });

        this.setState({ images:
            Array.prototype.filter.call(icons, function(icon){
                return (icon.type=="IMG" || icon.type=="BOOK");
            })})
            resolve(icons);  

    })
}


    startFetchingIcons = () => {

        var query = this.props.location.search;
        var search = new URLSearchParams(query);
    if(this.props.headerType=="explore") {
      
        var exploreQuery = search.get("q");
        var exploreSkip = search.get("skip");

        if(exploreQuery !== null){
            this.setState({explQuery: exploreQuery});
        }
        else {
            exploreQuery = "";
        }
       
        
        if(exploreSkip !== null){
            this.setState({exploreSkip: parseInt(exploreSkip)});
        }
        else {
            exploreSkip = 0;
        }

        var explPopCheck = localStorage.getItem('explPopCheck');
        var explIconsCount =  localStorage.getItem('explIconsCount');
        /* var explDesk = localStorage.getItem('explDesk');
        var explActuall = localStorage.getItem('explActuall');
        var explHistory = localStorage.getItem('explHistory'); */
        if(explPopCheck !==null) {
            this.setState({explPopCheck: parseBool(explPopCheck)});
        }
        else {
            explPopCheck = this.state.explPopCheck
        }
        if(explIconsCount !==null) {
            this.setState({explIconsCount: parseInt(explIconsCount)});
        }
        else {
            localStorage.setItem('explIconsCount', this.state.explIconsCount );
            explIconsCount = this.state.explIconsCount;
        }
  
    }


        var fetchData = this.props.fetchData;
        var data = { 
            query: exploreQuery,
            count: explIconsCount,
            next: exploreSkip       
        }
        
        if(this.props.headerType=="explore") {
       
            fetchData = URL.api + URL.explore;

         

           // console.log(data);
        }


        var iconId= search.get("iconId");
        var iconType= search.get("iconType");
        var iconTitle= search.get("iconTitle");
        var iconTags= search.get("iconTags");
        var iconLeft= search.get("iconLeft");
        var iconTop= search.get("iconTop");
        this.setState({ loadedIcons: false });

        if(iconId !== null) {

        var icons = getIconFromUrl(query);

        this.setStatesForIcon(icons).then(() => {this.prepareIcons()});

            //this.prepareIcons();
        }

        else {

        axios.post(fetchData, data, null)
        .then((result) => { 
            var deep = result.data.deep;

            if(parseInt(deep)<5) {
                this.setState({showNextPrev: true})
                //this.Alert(deep);
            }
        this.setState({ icons:
            Array.prototype.filter.call(result.data.results, function(icon) {
                return icon.type=="YT";
            })
        });

        this.setState({ images:
            Array.prototype.filter.call(result.data.results, function(icon){
                return (icon.type=="IMG" || icon.type=="BOOK");
            })
        });

    })
    .then(() => {
        this.prepareIcons()})
        .catch(error => {console.log(error);
            this.Alert("Wystąpił błąd przy pobieraniu ikon. Spróbuj ponownie za chwilę.");
            this.setState({ loadedIcons: true });
        });
    }
}



/*     getIcons = () => {
        var youtubeUrl = this.props.fetchYoutube;
        var data = null;
        if(this.props.headerType=="explore") {
            youtubeUrl = URL.api + URL.exploreYT;

            data = {
                    query: this.state.explQuery,
                    sortByPopular: this.state.explPopCheck,
                    iconsCount: this.state.explIconsCount,     
            }
            debugger;
        }

        this.setState({ loadedIcons: false });
        axios.post(youtubeUrl, data, null)
        .then((result) => {
        this.setState({ icons: result.data })})
        .then(() => {
            this.prepareIcons()})
        .catch(error => {console.log(error); 
            this.Alert("Wystąpił błąd przy pobieraniu ikon. Spróbuj ponownie za chwilę.");
            this.setState({ loadedIcons: true });
        });

    } */



    getLastIcon = () => {
        var allIcons = [ ...this.state.spotify, ...this.state.images, ...this.state.icons];
        if(allIcons.length>0) {
           return allIcons[allIcons.length-1];
        }
        else {
            return false;
        }
    }

    prepareIcons = () => {

        if(this.state.firstField)
        {   
            setTimeout(() => {
                this.setState({ loadedIcons: true});
                
            }, 0)
            return;
        }
    
        var lastIcon = this.getLastIcon();

        if (lastIcon) {
           
    
            var type = lastIcon.type;
            this.setState({ nowPlayed: lastIcon.id });
            this.setState({ entityID:  lastIcon.id });
            this.setState({entityTags: this.getIconTags(lastIcon.id)});


            //this.setState({ytField: false});

            if(type == "YT") {
                
                this.setState({ytField: true});
            }
            if(type == "IMG") {
               
                this.setState({imgSource: lastIcon.source });
               
                this.setState({imgField: true});
            }
            if(type == "BOOK") {
                
                this.setState({imgSource: lastIcon.source });
               
                this.setState({imgField: true});
            }
            if(type == "SPOTIFY") {
               
                this.setState({spotifyField: true});
            }

        
        if(this.state.icons.length>0) {
            if(lastIcon.id.includes("Error") || lastIcon.id.includes("!!ID")) {
                this.nextSongHandler();
            }
        }
           
       // var note = document.getElementById(lastIcon.id);
       // if(note) {
         //   note.style.boxShadow = this.state.playedShadow;
       // }


            setTimeout(() => {
              this.setState({ loadedIcons: true});
              //var icons = document.getElementsByClassName("entity");
          }, 0)
            
        }
        else {
            this.setState({ noIcons: true,  loadedIcons: true });
            this.setState({ytField: true});
        }
    }



    nextSongHandler = () => {

        var randomInt = require('random-int');
        var index = randomInt(this.state.icons.length - 1);
        var vidID = this.state.icons[index].id;

        if(vidID.includes("Error") && index !== 0 ) {
            this.nextSongHandler();
        }
        else {
        this.setState({ ytID: vidID });
        var note = document.getElementById(vidID);

        note.style.boxShadow = this.state.playedShadow;

        var played = document.getElementById(this.state.nowPlayed);
        if (played !== null) {
            var prevId = this.state.nowPlayed;
            this.setState(prevState => ({
                prevPlayed: [...prevState.prevPlayed, prevId]
              }))
        }
        this.setState({ nowPlayed: note.id });
    }
    }

    neonShadowHandler = (id) => {
        this.setState({firstField: false});

        var played = document.getElementById(this.state.nowPlayed);
        if (played !== null) {
            var prevId = this.state.nowPlayed;
            this.setState(prevState => ({
                prevPlayed: [...prevState.prevPlayed, prevId]
              }))

        }
        this.setState({ nowPlayed: id });
        this.setState({ entityID: id });
        var note = document.getElementById(id)
        if(note) {
            note.style.boxShadow = this.state.playedShadow;
        }
    }

    onDbClick = (event) => {

        this.setState({imgField: false});
        this.setState({ytField: true});
        this.setState({infoField: false});
        this.setState({spotifyField: false});
        var id = event.target.id;
        this.neonShadowHandler(id);
    }

    onDbSpotifyClick = (event) => {
        this.setState({imgField: false});
        this.setState({ytField: false});
        this.setState({infoField: false});
        this.setState({spotifyField: true});
        var id = event.target.id;
        this.neonShadowHandler(id);
    }


    onDbImgClick = (event) => {
        this.setState({imgField: true});
        this.setState({ytField: false});
        this.setState({infoField: false});
        this.setState({spotifyField: false});

        var id = event.target.id;
        this.neonShadowHandler(id);
    
        var icon = [...this.state.images].find( icon => icon.id === event.target.id);
        if(icon) {
           if(icon.type == "BOOK") {
            this.setState({imgSource: icon.id});
           }
           else {
            this.setState({imgSource: icon.source});
           }
        }
    }

    manageTrans = () => {
        this.setState({firstHover: true});
        var folders = document.getElementsByClassName("folder");
        var icons = document.getElementsByClassName("entity");
        if(icons.length>0)
        {
            for(var i=0;i<icons.length;i++)
            {
               icons[i].style.transition =  'top 0s, left 0s';
            }
        }
        
        if(folders.length>0)
        {
            for(var i=0;i<folders.length;i++)
            {
               folders[i].style.transition =  'top 0s, left 0s';
            }
        }
    }


    onHover = (event) => {

        if(!this.state.firstHover)
        {
            this.manageTrans();
        }

        var entity = document.getElementById(event.target.id);

        if(entity) {

        var titleMain = entity.title.replace("||","<br/>");
        titleMain = titleMain.replace("||","<br/>");
       
        while(titleMain.includes("||"))
        {
            titleMain = titleMain.replace("||","<br/>");
        }

        
        this.setState({ mainTitle: titleMain });
        var iconTitle = document.getElementById("258");
        document.getElementById("258").innerHTML = titleMain;
        iconTitle.innerHTML = titleMain;
        //debugger;
        entity.style.transition = 'top 0s, left 0s';
        

        var opacity = entity.style.opacity;
        
        if(entity.id !==  this.state.hoveredId)
        {
        this.setState({ actuallOpacity: opacity })
        }
        this.setState({hoveredId: entity.id});

        document.getElementById(event.target.id).style.opacity = 1;

        dragElement(document.getElementById(event.target.id));


        function dragElement(elmnt) {
            
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
               // localStorage.setItem('inMove', true);
            }

            function closeDragElement() {
 
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }
    }

    ////////////////////////////////////////////////



    userOwner = (id) => {
        return  this.state.userIconsId.includes(id);
    }


    cleanTitle = (event) => {
     
        this.setState({ mainTitle: "" });
         document.getElementById("258").innerHTML = "";

         var entity = document.getElementById(event.target.id);
         var top = entity.style.top;
         var left = entity.style.left;
 
         var leftE = leftToVw(left);
         var topE= topToVh(top);
 
         entity.style.left = leftE;
         entity.style.top = topE;
         this.setStateIconLocation(entity.id, leftE, topE);
       
            document.getElementById(event.target.id).style.opacity = this.state.actuallOpacity;
        
    }

    setStateIconLocation = (Id, left, top) => {
        var icon = this.getIconById(Id);
       
        if(icon) {
        
            icon.top = top;
            icon.left = left;
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

    getImgWidth = (type) => {
               
        var width = "60px";
        if(type=="BOOK") {
            width="45px";
        }
        if(type=="SPOTIFY") {
            width="45px";
        }
            return width;
        }

        getImgHeight = (type) => {

            var height = "50px";
            if(type=="BOOK") {
                height="60px";
            }
            if(type=="SPOTIFY") {
                height="45px";
            }

        return height;

        }

        getImgBorder = (type) => {

            var border = "6px";
            if(type=="BOOK") {
                border="0px";
            }
            if(type=="SPOTIFY") {
                border="0px";
            }

            return border;
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
    getIconById = (Id) => {
        var allIcons = [...this.state.icons, ...this.state.images, ...this.state.spotify ];
        var icon = allIcons.find( icon => icon.id === Id);
        return icon;
    }

    getIconTags(Id) {
        var icon = this.getIconById(Id);
        if(icon) {
            return icon.tags;
        }
        return [];

    }


    getShadow = (left, top, id) => {

     
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

    setExplDesk = () => {
        if(!this.state.explActuall && !this.state.explHistory) {
            return;
        }
        else {
            localStorage.setItem("explDesk", !this.state.explDesk);
            this.setState({explDesk: !this.state.explDesk});
        }
    }

    setExplHistory = () => {
        if(!this.state.explActuall && !this.state.explDesk) {
            return;
        }
        else {
            localStorage.setItem("explHistory", !this.state.explHistory);
            this.setState({explHistory: !this.state.explHistory});
        }
    }

    setExplActuall = () => {
        if(!this.state.explHistory && !this.state.explDesk) {
            return;
        }
        else {
            localStorage.setItem("explActuall", !this.state.explActuall);
            this.setState({explActuall: !this.state.explActuall});
        }
    }

    editExplore = (value) => {
        this.setState({showNextPrev: false });
      this.setState({explQuery: value});
    }

    onKeyExplore = (event) => {
  
        if(event.key == "Enter") {
            this.exploreHandler();
        }

    }

    exploreHandler = () => {
        
        this.props.history.push(PATHES.explore + "?q="+ this.state.explQuery + "&skip=0");
        /* this.setState({headerType: "explore"});
        this.setState({showNextPrev: false}); */
    }

    addExplIconsCount = () => {
        var count = this.state.explIconsCount + 10;

        if(count <= 100) {
            localStorage.setItem("explIconsCount", count);
            this.setState({explIconsCount: count})
        }
        
    }

    lessExplIconsCount = () => {
        var count = this.state.explIconsCount - 10;

        if(count >= 10) {
            localStorage.setItem("explIconsCount", count);
            this.setState({explIconsCount: count})
        }
        
    }

    explCheck = () => {
        localStorage.setItem("explPopCheck", !this.state.explPopCheck);
        this.setState({explPopCheck: !this.state.explPopCheck});
    }

    cleanexplQuery = () => {
        this.setState({explQuery: ""});
    }

    showPrev = () => {
        if(this.state.exploreSkip > 0) {
            var skip = this.state.exploreSkip - 1;
            this.props.history.push(PATHES.explore + "?q="+ this.state.explQuery + "&skip="+skip);
        }
    }


    showNext = () => {
        var skip = this.state.exploreSkip + 1;
        this.props.history.push(PATHES.explore + "?q="+ this.state.explQuery + "&skip=" +skip );
    }

 

    render(props) {

        let actuallMenu = "";

let prevNext = (this.state.showNextPrev && this.state.explQuery!="")? <div class="nextPrev">
<span  id="prev" class="clickElem nextPrev"  onClick = {this.showPrev}><i class="icon-left-open"/>
<div id="prevField" class="hoverInfo" >Poprzednie</div>
</span>   
<span id="next" class="clickElem nextPrev"  onClick = {this.showNext}><i class="icon-right-open"/>
<div id="nextField" class="hoverInfo" >Następne</div>
</span>
</div> : "";

let removingExplore = this.state.explQuery==""?  "" :
<div  onClick = {this.cleanexplQuery}  class="removeExpl clickElem">&#43;</div>
   
 if(this.props.headerType == "explore") {
 
actuallMenu =  (<div id="exploreMenu" class="actuallMenu">

{/*  <label id="najPopL" onClick={this.clickExploreCheckBox} >
                        <input name="najpopularniejsze_" type="checkbox" id="najPop" />
                        Najpopularniejsze<i class="icon-down-open"/>
                        </label>

                         <label id="najNowL" onClick={this.clickExploreCheckBox} >
                        <input style={{marginLeft: "0px"}} name="najnowsze_" type="checkbox" id="najNow" />
                        Ikony<i class="icon-down-open"/>
                        </label> */}

<div id="explFilter" class="switch" style={{fontSize: "20px", marginTop: "3px", display: "inline"}}> 
<i class="icon-sliders"/>
<div id="explFilterField" >

{/*Sortuj według:
 <span  id="infoLink">&#9432;info
                <div id="info">
               Wizualizacja piosenek granych <br/>w najpopularniejszych stacjach radiowych.
               <br/>
              </div>
</span> 



 <label id="explPop" onClick={this.explCheck}
style={{color: this.state.explPopCheck? 'white' 
: 'rgba(255, 255, 255, 0.510)'  }}><i class="icon-fire"/>Popularność</label>
<label id="explDate"
style={{color: !this.state.explPopCheck? 'white' 
: 'rgba(255, 255, 255, 0.510)'  }}
onClick={this.explCheck}>
                        <i class="icon-calendar-empty"/>Data utworzenia
                        </label>
                        <hr/> */}
Maksymalna ilość ikon na stronie: 
<button id="iconCount"  onClick={this.lessExplIconsCount} ><i class="icon-left-open"></i></button>
<input id="exploreN" type="text" value={this.state.explIconsCount} /> 
<button onClick={this.addExplIconsCount} id="iconCount"><i  class="icon-right-open"/> </button>

{/* Wyszukuj spośród:
<div style={{marginTop: "5px"}}>
<label onClick = {this.setExplDesk}
style={{color: this.state.explDesk? 'white' 
: 'rgba(255, 255, 255, 0.510)', marginLeft: "0px" }}><i class="icon-doc-landscape"/>Pulpity użytkowników</label></div>

<div style={{marginTop: "5px"}}><label onClick = {this.setExplActuall}
style={{color: this.state.explActuall? 'white' 
: 'rgba(255, 255, 255, 0.510)', marginLeft: "0px"  }}><i class="icon-fire"/>Dział aktualności</label></div>
<div style={{marginTop: "5px"}}>
<label  onClick = {this.setExplHistory}
style={{color: this.state.explHistory? 'white' 
: 'rgba(255, 255, 255, 0.510)', marginLeft: "0px"}}><i class="icon-history"/>Historia działu aktualności</label></div>
<hr/>*/} 
</div>
</div>
<div class="exploreDiv">

    <input id="exploreT" type="text"
        autofocus="true"
        ref="textInput"
        placeholder= "Wyszukaj - autorzy, tytuły, wykonawcy..."
        onKeyPress = {this.onKeyExplore}
        onChange={e => this.editExplore(e.target.value)}
        value={this.state.explQuery}/>{removingExplore}</div> 
<button onClick={this.exploreHandler} class='titleButton explButton'>Eksploruj</button>

    {prevNext}
 </div>); }


        var randomInt = require('random-int');
        let tagsField = this.state.loadedIcons? <TagsField  noIcons={this.state.noIcons} searchTag={this.props.searchTag}  tags = {this.getIconTags(this.state.entityID)} />  : "";
        
       
        if(this.state.firstField) {
            tagsField = "";
        }


        let field = "";
        if(!this.state.loadedIcons) {
            field = <LoadingField/>
        }
        else {
                if(this.state.ytField)
                    field = <Field play={this.state.entityID} noIcons={this.state.noIcons}
                    headerType={this.props.headerType}
                    show={this.state.loadedIcons} nextSong={this.nextSongHandler} loadText={this.props.fetchData} />
    
                if(this.state.imgField)
                    field = <ImageField src={this.state.entityID} sourceShow={this.getNiceHttp(this.state.imgSource)} 
                    source={this.state.imgSource}  noIcons={this.state.noIcons}
                    show={this.state.loadedIcons}/>
            
    
                if(this.state.spotifyField)
                    field = <SpotifyField id={this.state.entityID}  noIcons={this.state.noIcons}  show={this.state.loadedIcons}/>
   
                    if(this.state.firstField)
                        field = <FirstField />


        }



        let icons = this.state.icons.map(song => {
            return (
                <YTIcon  remover={this.userOwner(song.id)? 1 : 0}  isAuth={this.props.isAuthenticated}   title={song.title} yt={song.id} id={song.id}
                    classname="entity"
                    linkTo={this.onDbClick}
                    size={ '40px' }
                    location={ this.state.loadedIcons? 
                      {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id), 
                        top: song.top, left: song.left, transition: 'top '+2+'s, left '+2+'s'}:
                      {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw',
                   }}
                      //{top: 20+'vh', left: 20+'vw'}}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    bottom = {bottomIcon(song.id, song.top)}
                    quarter = {getQuarter(song.id, song.left, song.top)}
                    leftEdit = "70%" //to for share
                    fromDesk = {false}
                    tags={song.tags}
                    public={true}
                    guidId={song.guidId}
                />
            )
        })

        let images = this.state.images.map(img => {
            //debugger;
            return (
                <ImageIcon remover= {this.userOwner(img.id)? 1 : 0}  isAuth={this.props.isAuthenticated}  
                  yt={img.id} id={img.id}
                classname= "entity"
                    linkTo={this.onDbImgClick}
                    /* size={this.state.loadedIcons? '40px' : '0px' } */
                    location={ this.state.loadedIcons? 
                      {boxShadow: this.getShadow(parseInt(img.left), parseInt(img.top), img.id), top: img.top, 
                        left: img.left, transition: 'top '+2+'s, left '+2+'s', 
                        width: this.getImgWidth(img.type), height: this.getImgHeight(img.type), 
                         borderRadius: this.getImgBorder(img.type)} :
                      {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw',
                     }}
                      //{top: 20+'vh', left: 20+'vw'}}
                    title = {img.title}
                    source = {img.source}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    srcWidth={this.getImgWidth(img.type)}
                    srcHeight={this.getImgHeight(img.type)}
                    type = {img.type}
                  
                    leftEdit = "70%"
                    bottom = {bottomIcon(img.id, img.top)}
                    quarter = {getQuarter(img.id, img.left, img.top)}
                    fromDesk = {false}
                    tags={img.tags}
                    guidId={img.guidId}
                    public={true}
                />
            )
        })


        let spotifies = this.state.spotify.map(song => {
            return (
                <SpotifyIcon  remover= {this.userOwner(song.id)? 1 : 0}  isAuth={this.props.isAuthenticated}   
                title={song.title} id={song.id}
                src = {song.source}
                classname= {this.getClass(song.id)}
                    linkTo={this.onDbSpotifyClick}
                    
                    location={ this.state.loadedIcons? 
                      {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id), 
                        top: song.top, left: song.left, transition: 'top '+2+'s, left '+2+'s',
                        width: this.getImgWidth(song.type), height: this.getImgHeight(song.type), 
                        borderRadius: this.getImgBorder(song.type)
                    }:
                      {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw',
                   }}
                      //{top: 20+'vh', left: 20+'vw'}}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    count={song.count}
                    fromFolder = {this.state.fromFolder}
                    showTitleEditor = {this.showTitleEditor}
                    tags={song.tags}
                    leftEdit = "70%"
                    bottom = {bottomIcon(song.id, song.top)}
                    fromDesk = {false}
                    public={true}
                    guidId={song.guidId}
                />
            )
        })


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
               {/*  <p/>
                    <div class="switchScreen" onClick={this.screenManage}><i style={{fontSize: "20px" }} class={this.isFullScreen()? "icon-resize-small-alt" : "icon-resize-full-alt"}/>
                    {!this.isFullScreen()? "Aktywuj pełny ekran" : "Zamknij pełny ekran"}</div>
                  <hr/>  */}
                </div>
            </div>
                    {actuallMenu}
                    {tagsField}
                    {field}
                <div id = "258" class= "titleDiv"> </div>
               
                {icons}
                {images}
                {spotifies}
               

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
        showFirst: (show) => dispatch(showFirst(show)),

    };
};

const mapStateToProps = state => {
    
    return {
        isAuthenticated: state.auth.jwttoken !== null,
        //userId: state.auth.userId,
    
        //fullScreen: state.auth.fullScreen
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicDesktop);



