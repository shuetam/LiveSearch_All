import React, { Component } from 'react';
import '../../App.css';
import './Area.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import ImageField from '../Fields/ImageField';
import FirstField from '../Fields/FirstField';
import SpotifyField from '../Fields/SpotifyField';
import FolderField from '../Fields/FolderField';
import InfoField from '../Fields/InfoField';
import { Link, Route, NavLink } from 'react-router-dom';
import YTIcon from '../Icons/YTIcon';
import LoadingField from '../Fields/LoadingField';
import { BrowserRouter } from 'react-router-dom';
import ImageIcon from '../Icons/ImageIcon';
import randoom from 'random-int';
import axios from '../../axios-song';
//import {scrollU, scrollD} from '../../Store/Actions/scroll';
import { connect } from 'react-redux';
import {showServerPopup, showFirst, setSizeFactor} from '../../Store/Actions/auth';
import {URL, PATHES} from '../../environment'
import TagsField from '../Fields/TagsField';
import 'url-search-params-polyfill';
import {parseBool} from '../../Converters.js';
import { leftToVw, topToVh } from '../../Converters.js';
import { bottomIcon, getQuarter, getIconFromUrl, manageLogin } from '../../CommonManager.js';
import SpotifyIcon from '../Icons/SpotifyIcon';
import Folder from '../Icons/Folder';
import UnfollowPopup from '../Popup/UnfollowPopup';

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
            followedIds: [],
            prevPlayed: [],
            noIcons: false,
            foldersIcons: false,
            explPopCheck: true,
            explIconsCount: 10,
            explDesk: true,
            explActuall: true,
            explHistory: true,
            explQuery: "",
            firstHover: false,
            firstField: false,
            exploreSkip: 0,
            showNextPrev: false,
            sharedFolders: [],
            openedFolder: "",
            showFolderField: false,
            hoveredFolder: null,
            followedIcons: false,
            unFollowTitle: "",
            showUnfollow: false,
            unFollowId: "",
            folderInfo: {},
            waiting: "",
            waitingPopup: "",
            showFolderInfo: false,
            fromHeader: false,
            smallFolder: true,
            userFolders: ""
           
        }
      
    }



    componentDidMount() {
        
        var firstField = localStorage.getItem("firstField");
        this.setState({smallFolder: this.props.sizeFactor < 0.8});
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
       
      
        if(exploreQuery !== null){
            this.setState({explQuery: exploreQuery})
        }
     
    }


    ManageExplFilter = () => {
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
            this.setState({ userIconsId: result.data.userIds });
            this.setState({ followedIds: result.data.followedIds })});
        //.catch(error => {this.Alert("cos nie tak z ids")}); 
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

handleScroll = (event) => {
   
    if (event.deltaY > 0 && this.props.sizeFactor<2)
    {
        this.props.setFactor(this.props.sizeFactor + 0.1);
        this.setState({smallFolder: this.props.sizeFactor + 0.1 < 0.8});
    }
     if (event.deltaY < 0 && this.props.sizeFactor>0.6)
    {
        this.props.setFactor(this.props.sizeFactor - 0.1);
        this.setState({smallFolder: this.props.sizeFactor - 0.1 < 0.8});
    }
   
  }


    startFetchingIcons = () => {

        var query = this.props.location.search;
        var search = new URLSearchParams(query);
    if(this.props.headerType=="explore" || this.props.headerType=="folders" || this.props.headerType=="followed") {
      
        var exploreQuery = search.get("q");
        var exploreSkip = search.get("skip");
        var from = search.get("from");
        var folder = search.get("folder");
        
        var folderId = this.props.match.params.folderId? this.props.match.params.folderId : "";

        if(exploreQuery !== null){
            this.setState({explQuery: exploreQuery});
        }
        else {
            exploreQuery = "";
        }
       
        if(folder !== null) {
            this.setState({userFolders: folder});
        }
        

        if(this.props.match.params.folderId){
            
            this.setState({openedFolder: folderId});
            
            let fetchFolderInfo = this.props.isAuthenticated? URL.api + URL.folderInfoAuth : URL.api + URL.folderInfo;
            var data = { 
                folderId: folderId,     
            }  

            var config = this.props.isAuthenticated?
                   {
                        headers: {Authorization: "Bearer " + this.props.jwtToken}
                    } : null;

            axios.post(fetchFolderInfo, data, config)
            .then((result) => { 
                if(result.data) {
                  this.setState({folderInfo: result.data})
                  this.setState({showFolderInfo: true})
                }
        })
        
            .catch(error => {console.log(error);
            });
 

        }
        else {
            folderId = "";
            
        }
       
    if(this.props.headerType=="folders" && !this.props.match.params.folderId) {
        this.setState({foldersIcons: true});
        }


        
        if(exploreSkip !== null){
            this.setState({exploreSkip: parseInt(exploreSkip)});
        }
        else {
            exploreSkip = 0;
        }

        if(from !== null){
            this.setState({fromHeader: true});
        }



        var explPopCheck = localStorage.getItem('explPopCheck');
        var explIconsCount =  localStorage.getItem('explIconsCount');
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
            folderId: folderId,
            query: exploreQuery,
            count: explIconsCount,
            next: exploreSkip,
            userFolder: folder
        }
        
        if(this.props.headerType=="explore") {
       
            fetchData = URL.api + URL.explore;
        }

        if(this.props.headerType=="folders") {
       
            fetchData = URL.api + URL.sharedFolders;
        }

        var config = null;
        if(this.props.headerType=="followed" && this.props.isAuthenticated) {

       
                config = {
                    headers: {Authorization: "Bearer " + this.props.jwtToken}
                }
       
            this.setState({followedIcons: true});
            fetchData = URL.api + URL.followedFolders;
        }


        var iconId= search.get("iconId");
        var iconTitle= search.get("iconTitle");
        var iconTags= search.get("iconTags");
        this.setState({ loadedIcons: false });

        if(iconId !== null) {

        var icons = getIconFromUrl(query);

        this.setStatesForIcon(icons).then(() => {this.prepareIcons()});

            //this.prepareIcons();
        }

        else {

        axios.post(fetchData, data, config)
        .then((result) => { 
            debugger;
            //var deep = result.data.deep;
            if(result.data.length == parseInt(this.state.explIconsCount)) {
              this.setState({showNextPrev: true})
                //this.Alert("there is somwthing else");
            }
        this.setState({ icons:
            Array.prototype.filter.call(result.data, function(icon) {
                return icon.type=="YT";
            })
        });

        this.setState({ images:
            Array.prototype.filter.call(result.data, function(icon){
                return (icon.type=="IMG" || icon.type=="BOOK");
            })
        });

        this.setState({ sharedFolders:
            Array.prototype.filter.call(result.data, function(icon) {
                return icon.type=="FOLDER";
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


    getLastIcon = () => {
        var allIcons = [ ...this.state.spotify, ...this.state.images, ...this.state.icons, ...this.state.sharedFolders];
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
           

            setTimeout(() => {
              this.setState({ loadedIcons: true});          
          }, 0)
            
        }
        else {
            this.setState({ entityID:  "" });
            this.setState({ noIcons: true,  loadedIcons: true });
            this.setState({ytField: true});
         
        }
    }


    nextSongHandler = () => {

        var randomInt = require('random-int');

        // here if icons/songs lenght==0 then take next song from databse
        var vidID = this.state.icons[randomInt(this.state.icons.length - 1)].id;
        this.setState({ entityID: vidID });
        this.setState({entityTags: this.getIconTags(vidID)});
        var note = document.getElementById(vidID);

    
    note.style.boxShadow = this.state.playedShadow;

        var played = document.getElementById(this.state.nowPlayed);
        if (played !== null) {
            var prevId = this.state.nowPlayed;
            this.setState(prevState => ({
                prevPlayed: [...prevState.prevPlayed, prevId]
              }))
        }
        this.setState({ nowPlayed: vidID});
    }



    nextSongHandler1 = () => {

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
        var note = document.getElementById(id);
        var icon = this.getIconById(id);
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

    followFolder = (folderId) => {
        if(this.props.isAuthenticated) {
            this.setState({waiting: "inputDis"});
            var config = {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            }

            var Top_= 10 +"vh";
           var  Left_ = 10 + "vw";

        var entity = document.getElementById(folderId);

        if(entity) {

        
             Top_ = entity.style.top;
             Left_ = entity.style.left;
    
    
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
        }
        else if (this.state.folderInfo) {
            folderId = this.state.folderInfo.id;
            Top_= this.state.folderInfo.top;
            Left_ = this.state.folderInfo.left;
        }

            var data = { 
                FolderId: folderId,
                Left: Left_,
                Top:  Top_
            }
            axios.post(URL.api+URL.followFolder, data, config)
            .then((result) => {
              
                if(result.data) {

                    var folder = this.getIconById(result.data.id);
                    if(folder) {
                        folder.followers = result.data.followers;
                        this.setState({ hoveredFolder: folder });
                        this.setState(prevState => ({
                            followedIds: [...prevState.followedIds, folder.id]
                          }))

                    }
                    if(this.state.folderInfo) {
                        this.setState({folderInfo: result.data});                  
                    }

                }
                else {
                    this.Alert("Nie znaleziono folderu, spróbuj ponownie za chwilę.");
                }
                this.setState({waiting: ""});
                }
               
            ).catch(error => {this.Alert("Wystąpił błąd, spróbuj ponownie za chwilę.")}); 
            }
            else {
                manageLogin();
            }

    }


    unFollowFolderPop = () => {
        var folder = this.state.folderInfo;
      
        if(folder) {
            this.setState({waiting: "inputDis"});
            this.setState({unFollowTitle: folder.title});
            this.setState({unFollowId: folder.id});
            this.setState({showUnfollow: true});
        }
    }


    unFollowFolder = (forSure, folderId) => {
        if(!forSure) {
            this.setState({showUnfollow: false});
            this.setState({waiting: ""});
            return;
        }

        if(this.props.isAuthenticated) {
            this.setState({waitingPopup: "inputDis"});
            var config = {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            }
            var data = { 
                FolderId: folderId
            }
            axios.post(URL.api+URL.unfollowFolder, data, config)
            .then((result) => {
              
                if(result.data) {
                  
                    this.setState({showUnfollow: false});
                    this.setState({folderInfo: result.data});        
                }
                else {
                    this.Alert("Nie znaleziono folderu, spróbuj ponownie za chwilę.");
                    this.setState({waiting: ""});
                }
                this.setState({waiting: ""});
                this.setState({waitingPopup: ""});

                }
               
            ).catch(error => {this.Alert("Wystąpił błąd, spróbuj ponownie za chwilę."); 
            this.setState({waiting: ""});
            this.setState({waitingPopup: ""});});

    }
}

getHeaderPosition = (start, end) => {
    if(this.state.fromHeader)
    {
       return !this.state.loadedIcons? start : end;
    }
    else {
        return  end;
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
    
    userFollow = (id) => {
        return  this.state.followedIds.includes(id);
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
      
        var iconsEntity = document.getElementsByClassName("entity");
        var folders = document.getElementsByClassName("folder");
        
            var icons = [...folders,...iconsEntity];
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.opacity = event.target.value / 100;
        }
    }

    liveSearch = (event) => {  
       
        var iconsEntity = document.getElementsByClassName("entity");
        var folders = document.getElementsByClassName("folder");
        
            var icons = [...folders,...iconsEntity];

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

    getFolderClass = (id) => {
        if(id == "dis") {
            return "disable";
        }
        return "folder";
    }

    getImgWidth = (type) => {
               
        var width = 60;
        if(type=="BOOK") {
            width=45;
        }
        if(type=="SPOTIFY") {
            width=45;
        }
            return width * this.props.sizeFactor + "px";
        }

        getImgHeight = (type) => {

            var height = 50;
            if(type=="BOOK") {
                height=60;
            }
            if(type=="SPOTIFY") {
                height=45;
            }

        return height * this.props.sizeFactor + "px";

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
        var allIcons = [...this.state.icons, ...this.state.images, ...this.state.spotify, ...this.state.sharedFolders ];
        var icon = allIcons.find( icon => icon.id == Id);
        return icon;
    }

    getIconTags(Id) {
        var icon = this.getIconById(Id);
        if(icon) {
            return icon.tags;
        }
        return [];

    }

    openFolder = (event) => {
       
        if(this.props.headerType=="followed")
            this.props.history.push(PATHES.followedFolders + "/" + event.target.id);
           
        if(this.props.headerType=="folders")
            this.props.history.push(PATHES.sharedFolders + "/" + event.target.id);
    
    }


    getShadow = (left, top, id, isFolder) => {

     if(!isFolder) {

         if(this.state.nowPlayed == id)
         {
             return this.state.playedShadow;
            }
            if(this.state.prevPlayed.includes(id)) {
                return this.state.prevShadow;
            }
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

            if(this.props.headerType=="explore")
                this.exploreHandler();

            if(this.props.headerType=="folders")
                this.foldersExplore();
        }

    }

    exploreHandler = () => {
        
        this.props.history.push(PATHES.explore + "?q="+ this.state.explQuery + "&skip=0");
    }

    foldersExplore = () => {
        
        this.props.history.push(PATHES.sharedFolders + "?q="+ this.state.explQuery + "&skip=0");
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
            if(this.props.headerType=="explore") {
                this.props.history.push(PATHES.explore + "?q="+ this.state.explQuery + "&skip=" +skip  );
            }
            if(this.props.headerType=="folders") {
                if(this.state.userFolders !== "") {
                    this.props.history.push(PATHES.sharedFolders + "?q="+ this.state.explQuery + "&skip=" +skip + "&folder="+ this.state.userFolders );
                }
                else {
                    this.props.history.push(PATHES.sharedFolders + "?q="+ this.state.explQuery + "&skip=" +skip  );
                }

            }
        }
    }


    showNext = () => {
        if(this.state.showNextPrev) {
        var skip = this.state.exploreSkip + 1;
        if(this.props.headerType=="explore") {
            this.props.history.push(PATHES.explore + "?q="+ this.state.explQuery + "&skip=" +skip );
        }
        if(this.props.headerType=="folders") {
            if(this.state.userFolders !== "") {
            this.props.history.push(PATHES.sharedFolders + "?q="+ this.state.explQuery + "&skip=" +skip + "&folder="+ this.state.userFolders  );
        }
        else {
            this.props.history.push(PATHES.sharedFolders + "?q="+ this.state.explQuery + "&skip=" +skip)
        }
    }

        }
    }

    backFromFolder = () => {

        if(this.props.headerType=="followed")
            this.props.history.push(PATHES.followedFolders + "?from=1");

        if(this.props.headerType=="folders")
            this.props.history.push(PATHES.sharedFolders+ "?q="+ this.state.explQuery + "&skip=0"+"&from=1");
    }

    activeSharedFoldersFromUser = () => {     
            this.props.history.push(PATHES.sharedFolders+ "?q="+ this.state.explQuery + "&skip=0"+"&from=1"+"&folder="+this.state.folderInfo.id);
    }


    saveIcons = () => {
        
        if(this.props.isAuthenticated) {
            var config = {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            }
        

        var folders = document.getElementsByClassName("folder");   
        var icons = document.getElementsByClassName("entity");
  
        var dataIcons = [];
        var toPX = require('to-px');

        for (var i = 0; i < folders.length; i++) {
            var topEl = folders[i].style.top;
            var leftEl = folders[i].style.left;
            var top = topToVh(topEl);
            var left = leftToVw(leftEl);
           var Id = folders[i].id;
         
            var folder = {
            
             Type: "FOLLOWED_FOLDER",
             Id:  Id,
             Left: left,
             Top: top
            }
            dataIcons.push(folder);
         }


         if(dataIcons.length>0) {
             
        axios.post(URL.api+URL.saveLocations, dataIcons, config) 
        .then((result) => {
            document.getElementById("saveIcons").className = "switchDisable";
            })
        .catch((error) => {this.Alert("Nie udało się zachować lokalizacji.")}); 
        }
        else {
            document.getElementById("saveIcons").className = "switchDisable";
        }
    } 
} 

    onHoverFolder = (event) => {

        var entity = document.getElementById(event.target.id);
        if(entity) {
            var folder = this.getIconById(entity.id);
          
            this.setState({hoveredFolder: folder})
            this.setState({showFolderField: true});

            var topp = entity.style.top;
            
            entity.style.transition = 'top 0s, left 0s';
            
            var opacity = entity.style.opacity;
            
            if(entity.id !==  this.state.hoveredId)
            {
                this.setState({ actuallOpacity: opacity })
            }
            this.setState({hoveredId: entity.id});
            
            document.getElementById(event.target.id).style.opacity = 1;
            
            dragElement(document.getElementById(event.target.id));
        }
        
        
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
                var saveLoc = document.getElementById("saveIcons");
                if(saveLoc)
                saveLoc.className = "switchB";
            }
            
            function closeDragElement() {
            
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    
}

leaveFolder = (event) => {

    this.setState({showFolderField: false});

    var entity = document.getElementById(event.target.id);
   
    if(entity) {

     var top = entity.style.top;
     var left = entity.style.left;

     var leftE = leftToVw(left);
     var topE = topToVh(top);

     entity.style.left = leftE;
     entity.style.top = topE;
     this.setStateIconLocation(entity.id, leftE, topE);

    document.getElementById(event.target.id).style.opacity = this.state.actuallOpacity;
    }
}

 

    render(props) {

        let actuallMenu = "";

let prevNext = <div class="nextPrev">
<span  id="prev" class= {this.state.exploreSkip > 0?   "clickElem nextPrevAct" : "clickElem nextPrev"}  onClick = {this.showPrev}><i class="icon-left-open"/>
Poprzednie
</span>   
<span id="next" class= {this.state.showNextPrev?   "clickElem nextPrevAct" : "clickElem nextPrev"} onClick = {this.showNext}>Następne<i class="icon-right-open"/>

</span>
</div> ;

let removingExplore = this.state.explQuery==""?  "" :
<div  onClick = {this.cleanexplQuery}  class="removeExpl clickElem">&#43;</div>
   
 if(this.props.headerType == "explore" ||  this.props.headerType=="folders") {
 

var exploreButton = this.state.foldersIcons? <button onClick={this.foldersExplore} 
class='titleButton explButton'>Wyszukaj</button> :
<button onClick={this.exploreHandler} class='titleButton explButton'>Eksploruj</button>

actuallMenu = this.state.openedFolder != ""? "" :  (<div id="exploreMenu" class="actuallMenu" style={{left: this.getHeaderPosition("-500px", "300px") }} >


<div id="explFilter" class="switch" style={{fontSize: "20px", marginTop: "3px", display: "inline"}}> 
<i class="icon-sliders"/>
<div id="explFilterField" >

Maksymalna ilość ikon na stronie: 
<button id="iconCount"  onClick={this.lessExplIconsCount} ><i class="icon-left-open"></i></button>
<input id="exploreN" type="text" value={this.state.explIconsCount} /> 
<button onClick={this.addExplIconsCount} id="iconCount"><i  class="icon-right-open"/> </button>

</div>
</div>
<div class="exploreDiv">

    <input id="exploreT" type="text"
        autofocus="true"
        ref="textInput"
        placeholder= {this.state.foldersIcons? "Wyszukaj foldery..." :  "Wyszukaj - autorzy, tytuły, wykonawcy..."}
        onKeyPress = {this.onKeyExplore}
        onChange={e => this.editExplore(e.target.value)}
        value={this.state.explQuery}/>{removingExplore}</div> 
        {exploreButton}

    {prevNext}
 </div>) }


let folderInfoHeader = "";

if(this.props.match.params.folderId && this.state.showFolderInfo) {

let followButton = "";

if(!this.userOwner(this.props.match.params.folderId)) {

followButton = !this.state.folderInfo.followed?   <button onClick={this.followFolder} id={this.props.id}   className= { "titleButton followButtton " + this.state.waiting}>Obserwuj
</button> :
<button onClick={this.unFollowFolderPop} id={this.props.id}   className= { "titleButton privateButton " + this.state.waiting}>Przestań obserwować</button> ;
}
folderInfoHeader = <div class="folderInfoHeader">

<div id="backFolder" onClick={this.backFromFolder} class="switchB backFromFolder"> 
        <i class="icon-left-bold" />
        <div id="backFolderField" class="hoverInfo" >
         Powrót 
        </div>
        </div>
        
                       <div onClick={this.activeSharedFoldersFromUser} id="folderTitle"> {this.state.folderInfo.title}
                       <div id="folderTitleField" class="hoverInfo" >
                        Kliknij aby wyświetlić inne publiczne foldery osoby udostępniającej ten folder
                        </div>
                       </div>
                        {followButton}
                       
                        </div>
} 


        let tagsField = this.state.loadedIcons? <TagsField  noIcons={this.state.noIcons} searchTag={this.props.searchTag}  tags = {this.getIconTags(this.state.entityID)} />  : "";
    

        if(this.state.firstField || this.state.foldersIcons || this.state.followedIcons) {
            tagsField = "";
        }

        let saveIcons = (this.props.headerType=="followed" && !this.props.match.params.folderId)? <div id="saveIcons" class="switchDisable" onClick={this.saveIcons} >
        <i class="icon-floppy" />
        <div id="saveIconsField" class="hoverInfo">
            Zapamiętaj aktualne ulokowanie folderów  
        </div>
    </div> : "";

        let field = "";

        if(this.state.foldersIcons || this.state.followedIcons) {
            var folderId = this.state.showFolderField? this.state.hoveredFolder.id : 0;
            field = <FolderField folder={this.state.hoveredFolder} followed={this.userFollow(folderId)}  show={this.state.showFolderField}/>
        

        }

        let unfollowPopup = <UnfollowPopup waiting={this.state.waitingPopup} unFollowFolder={this.unFollowFolder} showPopup={this.state.showUnfollow} folderId = {this.state.unFollowId} unFollowTitle={this.state.unFollowTitle}/>

        if(!this.state.loadedIcons) {
            field = <LoadingField/>
        }
        else {
                if(this.state.ytField)
                    field = <Field play={this.state.entityID} folders={this.state.foldersIcons} noIcons={this.state.noIcons}
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
                    size={ 40 * this.props.sizeFactor + 'px' }
                    location={ this.state.loadedIcons? 
                      {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id, false), 
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
           
            return (
                <ImageIcon remover= {this.userOwner(img.id)? 1 : 0}  isAuth={this.props.isAuthenticated}  
                  yt={img.id} id={img.id}
                classname= "entity"
                    linkTo={this.onDbImgClick}
                    /* size={this.state.loadedIcons? '40px' : '0px' } */
                    location={ this.state.loadedIcons? 
                      {boxShadow: this.getShadow(parseInt(img.left), parseInt(img.top), img.id, false), top: img.top, 
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
                      {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id, false), 
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


        let sharedFolders = this.state.sharedFolders.map(song => {
       
            return (
                        
                <Folder  title={song.title} yt={song.id} id={song.id}
                    classname= {this.getFolderClass(song.id)}
                    linkTo={this.openFolder}         
                    location={ this.state.loadedIcons? 
                    {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id, true), 
                        top: song.top, left: song.left,
                        height: 80 * this.props.sizeFactor + "px",
                        width: 80 * this.props.sizeFactor + "px",
                         transition: 'top '+2+'s, left '+2+'s'}:
                    {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw',}}
                    onHover={this.onHoverFolder}
                    onLeave={this.leaveFolder}
                    count={song.count}
                    icon0= {song.icon0}
                    icon1= {song.icon1}
                    icon2= {song.icon2}
                    icon3= {song.icon3}
                    followFolder = {this.followFolder}
                    unFollowFolder = {this.unFollowFolderPop}
                    leftEdit = "85%"
                    topEdit = "85%"
                    bottom = {bottomIcon(song.id, song.top)}
                    public={true}
                    shared = {song.shared}
                    owner = {this.userOwner(song.id)}
                    followed = {this.userFollow(song.id)}
                    waiting = {this.state.waiting}
                    factor = {this.props.sizeFactor}
                    smallFolder = {this.state.smallFolder}
                    />
                     
                )
            })


            return (
                
                <div  className="area" onWheel ={this.handleScroll}>

     
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
               
                {sharedFolders}
                {icons}
                {images}
                {spotifies}
                {unfollowPopup}
              
                <div class="deskMenu" style={{left: this.getHeaderPosition("-50px","120px") }}>
                    {saveIcons}
                    {folderInfoHeader}
                </div>
               

    {/* <div class="containerIconsContainer">
               <div class="iconsContainer">
               
                </div>
                </div> */}



         
            </div>
        );
    }  
}

const mapDispatchToProps = dispatch => {
    return {

        serverAlert: (message) => dispatch(showServerPopup(message)),
        showFirst: (show) => dispatch(showFirst(show)),
        setFactor: (factor) => dispatch(setSizeFactor(factor))

    };
};

const mapStateToProps = state => {
    
    return {
        isAuthenticated: state.auth.jwttoken !== null,
        jwtToken: state.auth.jwttoken,
        firstField: state.auth.firstField,
        sizeFactor: state.auth.sizeFactor
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PublicDesktop);



