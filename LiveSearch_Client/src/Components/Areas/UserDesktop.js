import React, { Component } from 'react';
import '../../App.css';
import './Area.css';
import './table.css';
import Header from '../Header/Header';
import Field from '../Fields/Field';
import ImageField from '../Fields/ImageField';
import SpotifyField from '../Fields/SpotifyField';
import LoadingField from '../Fields/LoadingField';
import LoginField from '../Fields/LoginField';
import InfoField from '../Fields/InfoField';
import { Link, Route, NavLink } from 'react-router-dom';
import YTIcon from '../Icons/YTIcon';
import ImageIcon from '../Icons/ImageIcon';
import SpotifyIcon from '../Icons/SpotifyIcon';
import Folder from '../Icons/Folder';
import { BrowserRouter } from 'react-router-dom';
import randoom from 'random-int';
import axios from '../../axios-song';
import { connect } from 'react-redux';
import { showServerPopup, addingIcon, stopAddingIcon, stopRemovingIcon, manageScreen} from '../../Store/Actions/auth';
import { URL, PATHES } from '../../environment';
import TagsField from '../Fields/TagsField';
import { leftToVw, topToVh } from '../../Converters.js';
import { bottomIcon, getQuarter, removeHiding } from '../../CommonManager.js';



class UserDesktop extends Component {

   
    constructor(props) {
        super(props);

        /* fetch(this.props.fetchData )
        .then(res => res.json()).then((result) => this.setState({songs: result})).then(()=> this.setMaxCount());
        
 */
        this.state = {

            mainTitle: ".",
            loadedIcons: false,
            intervalSong: null,
            maxCount: null,
            ytCount: null,
            fetchFrom: null,
            hoveredId: "",
            entityID: "",
            actuallOpacity: 0.5,
            nowPlayed: "",
            playedShadow: '#FFF 0px 0px 5px, 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), #FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 10px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgb(255, 45, 45) 0px 0px 15px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 20px, rgb(255, 45, 45) 0px 0px 2px 5px',
            prevShadow: '#FFF 0px 0px 5px, 0px 0px 3px 1px rgb(255, 255, 255), 0px 0px 3px 1px rgb(255, 255, 255), #FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px,#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgba(231, 173, 64, 0.637) 0px 0px 20px 10px,  rgba(231, 173, 64, 0.637) 0px 0px 10px, rgba(231, 173, 64, 0.637) 0px 0px 10px, rgba(231, 173, 64, 0.637) 0px 0px 20px, rgba(231, 173, 64, 0.637) 0px 0px 2px 5px',
         
            idInMove: "",
            explQuery: "",
            wrongWWW: false,

            icons: [
            ],

            folders: [
            ],
            prevPlayed: [  
            ],
            currentFolderTop: "",
            currentFolderLeft: "",
            fromFolder: false,
            newIcons: [
            ],
            newImages: [
            ],
            newSpotify: [
            ],
            images: [
            ],
            spotify: [
            ],
            newFolders: [],
            iconsFound: false,
            addingIcon: false,
            imgField: false,
            ytField: false,
            spotifyField: false,
            infoField: false,
            addingIconData: {},
            folderId: "",
            sourceUrl: "",
            noIconsFound: false,
            searchingIcons: false,
            authConfig: {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            },
            folderName: "",
            imgSource: "",
            showTitleEdit: false,
            editedTitle: "",
            editedTags: "",
            editedId: "",
            titleToEdit: "",
            addSwitcher: "addYouTube",
            addPlaceholder: "Wklej link do filmu YouTube",
            entityTags: [],
            firstHover: false,
            addingFolder: false
            
        }
    }

  //  playedShadow: '#FFF 0px 0px 5px, #FFF 0px 0px 10px, #FFF 0px 0px 5px, rgb(255, 45, 45) 0px 0px 30px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 10px, rgb(255, 45, 45) 0px 0px 20px, rgb(255, 45, 45) 0px 0px 2px 5px',


    componentDidMount() {

        document.addEventListener("keydown", this.keyManager, false);

        if(this.props.isAuthenticated)
        {
            var propss = this.props;
            var folderId = "";
            var props = this.props.match.params;
          
            if(this.props.match.params.id1=="folder") {
                folderId = this.props.match.params.id2? this.props.match.params.id2 : "";
                this.setState({fromFolder: true});
            } 
      

           // this.setState({fromFolder: this.props.match.params.id1? true : false });
            this.setState({folderId: folderId });
            //debugger;
            this.getImages(this.props.userId, folderId);
            this.getSpotify(this.props.userId, folderId);
            this.getIcons(this.props.userId, folderId);
        }
    }

    componentWillUnmount(){
        document.removeEventListener("keydown", this.keyManager, false);
      }

    componentWillUpdate() {

    }

    componentWillReceiveProps(nextProps) {
        //debugger;

            if(nextProps.removedId) {
                //this.removeIconById(nextProps.removedId);
                this.disableIconById(nextProps.removedId);
                this.props.stopRemoving();
            }

        if(nextProps.addingIcon) 
        {
        
      // document.getElementById(addingIcon.id).className = "disable";
      //debugger;

      if(nextProps.addingIcon.type == "YT") {
          this.disableAddingIcon(nextProps.addingIcon.id)
                this.setState(prevState => ({
                    icons: [...prevState.icons, nextProps.addingIcon]
                  }));
    
                  this.props.stopAdding();
            }

        if(nextProps.addingIcon.type == "IMG") {
                this.disableAddingImage(nextProps.addingIcon.id)
                      this.setState(prevState => ({
                          images: [...prevState.images, nextProps.addingIcon]
                        }));
          
                        this.props.stopAdding();
                  }

        if(nextProps.addingIcon.type == "SPOTIFY") {
            this.disableAddingSpotify(nextProps.addingIcon.id)
                    this.setState(prevState => ({
                              spotify: [...prevState.spotify, nextProps.addingIcon]
                        }));
              
                            this.props.stopAdding();
                      }

                      this.showTitleEditor(nextProps.addingIcon.id, nextProps.addingIcon.type);
      }


      }

    getIcons = (Id, folderId) => {
        this.setState({loadedIcons: false});
        //debugger;
        const data = {
            userId: Id,
            folderId: folderId
            
        };
        const axiosConfig = {
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Access-Control-Allow-Origin': 'http://localhost:3000',
                'Access-Control-Allow-Credentials': 'true'
            }};

           /*  var config = {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            }; */
       
     axios.post(URL.api + URL.userIcons, data, this.state.authConfig)
        .then((result) => {
           
        this.setState({ icons: result.data })})
        .then(() => this.getFolders(data))
        .catch(error => {console.log(error); 
            //this.setState({loadedIcons: true});
            this.Alert("Nie udało się pobrać ikon. Spróbuj ponownie później.")});

    }

    getImages = (Id, folderId) => {
        this.setState({loadedIcons: false});
        //debugger;
        const data = {
            userId: Id,
            folderId: folderId
            
        };
 
        
     axios.post(URL.api + URL.userImages, data, this.state.authConfig)
        .then((result) => {
           
        this.setState({ images: result.data })})
        
        .catch(error => {console.log(error); 
                //this.setState({loadedIcons: true});
            this.Alert("Nie udało się pobrać obrazów. Spróbuj ponownie później.")});

    }


    getSpotify = (Id, folderId) => {
        this.setState({loadedIcons: false});
        //debugger;
        const data = {
            userId: Id,
            folderId: folderId
        };
     axios.post(URL.api + URL.userSpotify, data, this.state.authConfig)
        .then((result) => {
        this.setState({ spotify: result.data })})
        .catch(error => {console.log(error); 
            //this.setState({loadedIcons: true});
            this.Alert("Nie udało się pobrać utworów Spotify. Spróbuj ponownie później.")});
    }


     getFolders = (data) => {
         if(data.folderId == "") {
            axios.post(URL.api + URL.userFolders, data, this.state.authConfig)
            .then((result) => {
                
            this.setState({ folders: result.data })})
            .then(() => {
                this.manageIcons()})
            .catch(error => {console.log(error); this.Alert("Nie udało się pobrać folderów. Spróbuj ponownie później.")});
             
         }
         else {
            this.setState({folders: []});
            this.manageIcons();
      }
     }

    getLastIcon = () => {
        var allIcons = [...this.state.folders, ...this.state.spotify, ...this.state.images, ...this.state.icons];
        if(allIcons.length>0) {
           return allIcons[allIcons.length-1];
        }
        else {
            return false;
        }
    }

    keyManager = (event) => {

        if(event.keyCode === 27) {

            if(this.state.addingIcon) {
                this.stopAdding();
            }

            if(this.state.showTitleEdit) {
                this.editTitleCancel();
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
                //var folId = folders[i].id;
                //var foldSt = [...this.state.folders].find( icon => icon.id === folId);
               // folders[i].style.left = toPX(foldSt.left) + 'px';
               // folders[i].style.top = toPX(foldSt.top) + 'px';
               folders[i].style.transition =  'top 0s, left 0s';
            }
        }
    }


    manageIcons = () => {

        //this.setState({ytField: false});
        var lastIcon = this.getLastIcon();

        if(lastIcon) {
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
             if(type == "FOLDER") {
                this.setState({ytField: false});
            } 

            setTimeout(() => {
                this.setState({ loadedIcons: true});
                //var foldersState = this.state.folders;
                //var toPX = require('to-px');
            }, 500);
        }
        else {
            this.setState({infoField: true});
            this.setState({
                loadedIcons: true
              });
        }
        
    }


    anyIcons = () => {
        var anyIcons = (this.state.spotify.length>0 || this.state.icons.length>0 || this.state.images.length>0 || this.state.folders.length>0);
        return anyIcons;
    }

/*     setSize = (c) => {
        if (c === 1) {
            return "30px";
        }
        if (c === this.state.maxCount && this.state.maxCount === 2) {
            return "50px";
        }
        if (this.state.maxCount === 1) {
            return "30px";
        }
        else {
            var result = ((50 * (c - this.state.maxCount)) / (this.state.maxCount - 1)) + 80;
            return result + 'px';
        }
    } */

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



    openFolder = (event) => {
        this.props.history.push(PATHES.userFolder + event.target.id);
        //this.getIcons( this.props.userId, event.target.id);
    }


    neonShadowHandler = (id) => {

        var played = document.getElementById(this.state.nowPlayed);
        if (played !== null) {
            var prevId = this.state.nowPlayed;
            this.setState(prevState => ({
                prevPlayed: [...prevState.prevPlayed, prevId]
              }))

        }
        this.setState({ nowPlayed: id });
        this.setState({ entityID: id });
       this.setState({entityTags: this.getIconTags(id)});
        var note = document.getElementById(id)
        if(note) {
            note.style.boxShadow = this.state.playedShadow;
        }
    }


    onDbSpotifyClick = (event) => {
        this.setState({imgField: false});
        this.setState({ytField: false});
        this.setState({infoField: false});
        this.setState({spotifyField: true});
        var id = event.target.id;
        this.neonShadowHandler(id);
    }




    onDbClick = (event) => {

        this.setState({imgField: false});
        this.setState({ytField: true});
        this.setState({infoField: false});
        this.setState({spotifyField: false});
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
        
       // var allIcons = [...this.state.icons, ...this.state.folders, ...this.state.images];

        //this.setState({imgSource: note.title});
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


    onHover = (event) => {

      if(!this.state.firstHover)
      {
          this.manageTrans();
        }
          
     

        this.setState({idInMove: event.target.id});

        var entity = document.getElementById(event.target.id);

        if(entity) {

        
        var titleMain = entity.title.replace("||","<br/>");

        if(this.state.showTitleEdit)
        {
            titleMain = ""; 
        }
        while(titleMain.includes("||"))
        {
            titleMain = titleMain.replace("||","<br/>");
        }

        //titleMain = this.getNiceHttp(titleMain);
        
        this.setState({ mainTitle: titleMain });
        var iconTitle = document.getElementById("258");

        if(titleMain == "" ){
            titleMain = "brak tytułu";
        }
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

        function dragElement(elmnt, fold) {
            
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

                document.getElementById("saveIcons").className = "switchB";


            }

            function closeDragElement() {
           
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    }
    }

    onHoverFolder = (event) => {

        var entity = document.getElementById(event.target.id);
        if(entity) {

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
                document.getElementById("saveIcons").className = "switchB";
                //localStorage.setItem('inMove', true);
            }
            
            function closeDragElement() {
                //debugger;
                //const inMove = localStorage.removeItem('inMove');
            
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
    
}

    ////////////////////////////////////////////////

    cleanTitle = (event) => {
        //debugger;
        this.setState({ mainTitle: "" });
        document.getElementById("258").innerHTML = "";
        var entity = document.getElementById(event.target.id);

    if(entity) {
        document.getElementById(event.target.id).style.opacity = this.state.actuallOpacity;

        var elTop = parseInt(entity.style.top, 10);
        var elLeft = parseInt(entity.style.left, 10);

        var fold = document.getElementsByClassName("folder");

      //  this.setIconLocationAfterMove(entity.id);
       // document.getElementById("saveIcons").className = "switch";

        if(fold.length>0)
        {  
            var toPX = require('to-px');

            for(var i=0;i<fold.length;i++)
            {
            
                var foldLeft0 = parseInt(toPX(fold[i].style.left),10);
                var foldLeft1 = foldLeft0 + 40;
                
                var foldTop0 = parseInt(toPX(fold[i].style.top),10);
                var foldTop1 = foldTop0 + 40;
                
                var vert =   elLeft < foldLeft1 && elLeft > foldLeft0
                var hori =   elTop < foldTop1 && elTop > foldTop0
                //debugger;
                if(vert && hori)
                {
                    //debugger;
                    var allIcons = [...this.state.spotify, ...this.state.icons, ...this.state.folders, ...this.state.images];

                    var icon = allIcons.find( icon => icon.id === entity.id);

                    const data = {
                        Id: entity.id,
                        Type: icon.type,
                        //UserId: this.props.userId,
                        ParentId: fold[i].id
                        }

                    axios.post(URL.api+URL.addToFolder, data, this.state.authConfig)
                    .then((result) => {
                        this.updateFolderIcons(result.data.folder);
                        document.getElementById(result.data.entityId).className="disable";
                      //  document.getElementById("saveIcons").className = "switchDisable";
                        this.disableIconById(result.data.entityId);
                       // this.setIconLocationAfterMove(entity.id);
                    })
                    .catch(error => {console.log(error); alert("Server error.")});

                    //this.updateFolderIcons(fold[i].id, entity.id);
                   
                    //entity.style.display = "none";
                    break;
                }
            }

        }
       

        var top = entity.style.top;
        var left = entity.style.left;

        var leftE = leftToVw(left);
        var topE= topToVh(top);

        entity.style.left = leftE;
        entity.style.top = topE;
        this.setStateIconLocation(entity.id, leftE, topE);
       
    }
            //var icon = this.state.icons.find(x => x.id === entity.id);
    }

    setStateIconLocation = (Id, left, top) => {
        var icon = this.getIconById(Id);
        
        if(!icon) {
            icon = this.state.newIcons.find(x => x.id === Id);
        }
        
        if(icon) {
        
            icon.top = top;
            icon.left = left;
        }
    }

/*     removeIconById = (Id) => {
   
       function checkId (icon) {
        return icon.id !== Id
       }

           this.setState( {icons:  [...this.state.icons].filter(checkId)});

            } */



    disableIconById = (Id) => {

        var allIcons = [...this.state.spotify, ...this.state.icons, ...this.state.folders, ...this.state.images];

        var icon = allIcons.find( icon => icon.id === Id);
        if(icon) {
            //icon = this.state.folders.find( icon => icon.id === Id);
            icon.id = "dis";
        }
    }

    disableAddingIcon = (Id) => {
        var icon = this.state.newIcons.find( icon => icon.id === Id);
        icon.id = "dis";
    }

    disableAddingImage = (Id) => {
        var image = this.state.newImages.find(image => image.id === Id);
        image.id = "dis";
    }

    disableAddingSpotify = (Id) => {
        var spot = this.state.newSpotify.find(spot => spot.id === Id);
        spot.id = "dis";
    }


    updateFolderIcons = (folder) => {
        this.setState(state => {
          const list = state.folders.map((item, j) => {
             // debugger;
            if (item.id == folder.id) {
               item.icon0 = folder.icon0;
               item.icon1 = folder.icon1;
               item.icon2 = folder.icon2;
               item.icon3 = folder.icon3;
            }
          });
          return {
            list,
          };
        });
      };
       

    leaveFolder = (event) => {
        var entity = document.getElementById(event.target.id);
       
        if(entity) {

         var top = entity.style.top;
         var left = entity.style.left;
 
         var leftE = leftToVw(left);
         var topE = topToVh(top);
 
         entity.style.left = leftE;
         entity.style.top = topE;
         this.setStateIconLocation(entity.id, leftE, topE);
//debugger;
        document.getElementById(event.target.id).style.opacity = this.state.actuallOpacity;
        }
    }

        

    rangeHandler = (event) => {
        var icons = document.getElementsByClassName("entity");
        //debugger;
        for (var i = 0; i < icons.length; i++) {
            icons[i].style.opacity = event.target.value / 100;
        }

        var folders = document.getElementsByClassName("folder");
        //debugger;
        for (var i = 0; i < folders.length; i++) {
            folders[i].style.opacity = event.target.value / 100;
        }

    }

    editFolder = (event) => { 
    
        document.getElementById(event.trget.id).defaultValue = event.target.value;
        var ttt = event.target.value;
    }

    setFolderName = (event) => {
        //debugger;
        if(event.key == "Enter") {
            this.addFolderHandler();
        }
        else {
            var name = document.getElementById("exploreT").value;

            if(name.length > 20) {
                document.getElementById("exploreT").value = this.state.folderName;
            }
            var folName = document.getElementById("exploreT").value;
            this.setState({folderName: folName});
            this.setState({explQuery: folName});

        }
    }

    editTitle = (value) => {
        
        if(this.state.folderEditing) {
            if(value.length>20) {
                document.getElementById("editT").value = this.state.editedTitle;
            }
            else {
                this.setState({editedTitle: value})
            }
        }
        else {
            this.setState({editedTitle: value})
        }
    }

    editTags = (value) => {
        
        
            if(value.length>200) {
                document.getElementById("editTags").value = this.state.editedTags;
            }
            else {
                this.setState({editedTags: value})
            }
        
    }

    
    onKeyTitle = (event) => {
      
        if(event.key == "Enter") {
            this.editTitleHandler();
        }

    }


    showTitleEditor = (id, iconType) => {
        
   /*   var findField = document.getElementById('addingIconField');

     if(findField) {
        findField.innerHTML = "";
     } */

    if(iconType == "FOLDER") {
        this.setState({folderEditing: true});
    }
    else {
        this.setState({folderEditing: false});
    }


        var entity = document.getElementById(id);
        var title = entity.title;
        this.setState({ mainTitle: "" });
        document.getElementById("258").innerHTML = "";
        
        this.setState({editedId: id});
        this.setState({editedTitle: title});


        var tags = this.getIconTags(id);

        this.setState({editedTags: tags.toString()});

        this.setState({titleToEdit: title});

        this.setState({showTitleEdit: true});
      
    }


    editTitleHandler = () => {
        this.setState({showTitleEdit: false});

        var editedTags = this.state.editedTags;

        var tags = editedTags.split(',');

         var titleMain = this.state.editedTitle.replace("||","<br/>");
        while(titleMain.includes("||"))
        {
            titleMain = titleMain.replace("||","<br/>");
        }

        this.setState({ mainTitle: titleMain });
        document.getElementById("258").innerHTML = titleMain; 
    
        var Id = this.state.editedId;
        var newTitle = this.state.editedTitle;

        var allIcons = [...this.state.spotify, ...this.state.icons, ...this.state.folders, ...this.state.images];
        var icon = allIcons.find( icon => icon.id === Id);
        icon.title = newTitle;

        var data = {
            Id: Id,
            Title: newTitle,
            Type: icon.type,
            tags: tags
        }

        axios.post(URL.api+URL.changeTitle, data, this.state.authConfig)
        .then((result) => {
          debugger;
            var allIcons = [...this.state.spotify, ...this.state.icons, ...this.state.folders, ...this.state.images];
            var icon = allIcons.find( icon => icon.id === result.data.id);
            icon.title = result.data.title;
            icon.tags = result.data.tags;
            if(icon.id == this.state.entityID) {
                this.setState({entityTags: result.data.tags});
            }

            
            })
        .catch(error => {
            this.editTitleCancel();
            this.Alert("Nie udało się zmienić tytułu. Spróbuj ponownie później.")}); 

            setTimeout(() => {
                document.getElementById("258").innerHTML = ""; 
            }, 1500)
    }

    editTitleCancel = () => {
        this.setState({showTitleEdit: false});
        var titleMain = this.state.titleToEdit.replace("||","<br/>");
        while(titleMain.includes("||"))
        {
            titleMain = titleMain.replace("||","<br/>");
        }

        this.setState({ mainTitle: titleMain });
        document.getElementById("258").innerHTML = titleMain;
        var allIcons = [...this.state.spotify, ...this.state.icons, ...this.state.folders, ...this.state.images];
        var icon = allIcons.find( icon => icon.id === this.state.editedId);
        icon.title = this.state.titleToEdit;
        setTimeout(() => {
            document.getElementById("258").innerHTML = ""; 
        }, 1500)
    }



    addFolderHandler = () => {
       
        document.getElementById("exploreT").readOnly = false; 
        var name = document.getElementById("exploreT").value;
        const data = {
            Type: "FOLDER",
            //UserId: this.props.userId,
            Title: name
            }

        axios.post(URL.api+URL.createFolder, data, this.state.authConfig)
        .then((result) => {
          
            this.setState(prevState => ({
                newFolders: [...prevState.newFolders, result.data]
              }));
              document.getElementById("exploreT").value = "";
            
            })
        .catch(error => {this.Alert("Wystąpił błąd przy próbie utworzenia folderu. Spróbuj ponownie później.")}); 
    }


    addIconHandlerPress = (event) => {
        debugger;
        if(event.key == "Enter") {
            this.addIconHandler();
        }
        if(event.key === "Escape") {
            this.stopAdding();
        }
    }

    addIconHandler = () => {

        this.setState({iconsFound: false});
        this.setState({noIconsFound: false});
        this.setState({searchingIcons: true});
        this.setState({ newIcons: [] });
        this.setState({ newImages: [] });
        this.setState({ newSpotify: [] });

        var exprwww = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(exprwww);
       
        var url = document.getElementById("exploreT").value;
        this.setState({explQuery: url});
        const data = {
           // UserId: this.props.userId,
            Title: url
            }
           var switcher =  this.state.addSwitcher;

           var goFind = url.includes("iframe") || url.match(regex);

            if (goFind && url !== "") {
                this.setState({wrongWWW: false});
                
                axios.post(URL.api+URL.findIcons, data, this.state.authConfig)
                .then((result) => {
                    //debugger;

                    if(result.data[0].id == "noFound") {
                        this.setState({noIconsFound: true});
                    }
                    else {

                        this.setState({sourceUrl: url});
                       
                        this.setState({ newIcons:
                            Array.prototype.filter.call(result.data, function(icon){
                                return (icon.type).includes("YT");
                            })
                        });
                        //debugger;
                        this.setState({ newSpotify:
                            
                            Array.prototype.filter.call(result.data, function(icon){
                                return (icon.type).includes("SPOTIFY");
                            })
                            
                        });
                        
                        this.setState({ newImages:
                            
                            Array.prototype.filter.call(result.data, function(icon){
                                return (icon.type).includes("IMG");
                            })
                            
                        });
                        //this.props.setUrl(url);
                     
                        setTimeout(() => {
                          this.setState({
                            iconsFound: true
                          });
                      }, 400)
                        
                        
                    }

                    })
                .catch(error => {
                    this.setState({noIconsFound: true});
                    this.Alert("Wystąpił błąd podczas wyszukiwania ikon. Spróbuj ponownie później.")});

            } else {
                this.setState({wrongWWW: true});
            }

    }

        liveSearch = (event) => {  
        var icons = document.getElementsByClassName("entity");
        for (var i = 0; i < icons.length; i++) {
            if(icons[i].title.toString().toLowerCase().includes(event.target.value.toString().toLowerCase()))
            {
                icons[i].style.visibility = 'visible';
               // icons[i].style.filter = "";
               // icons[i].style.opacity = this.state.actuallOpacity;
            }
            else
            {
                icons[i].style.visibility = 'hidden';
                //icons[i].style.filter = "blur(5px)";
               // icons[i].style.opacity = 0.3;
            }
        }
    }

    backToDesktop = () => {
        this.props.history.push(PATHES.userPulpit);
    }

    showAddingIcon = () => {
        removeHiding();
        this.setState({addingFolder: false});
        if(this.state.addingIcon) {
            this.stopAdding()
        }
        else {
            this.setState({addingIcon: true});
        }
    }

    showAddingFolder = () => {
        this.setState({addingIcon: false});
        removeHiding();
        if(this.state.addingFolder) {
            this.stopAddingFolder()
        }
        else {
            this.setState({addingFolder: true});
            //this.setState({addingIcon: true});
        }
    }



    saveIcons = () => {
        

       // var iconsClass = document.getElementsByClassName("entity");
        var folders = document.getElementsByClassName("folder");
        //var iconsClass = [...this.state.icons];
        var icons = document.getElementsByClassName("entity");
        //var folders = [...this.state.folders];
      /*   var icons = Array.prototype.filter.call(iconsClass, function(icon){
            return (icon.style.top).includes("px");
        }); */
 

        //icons.filter(checkPX);
        //debugger;
        var dataIcons = [];
        var toPX = require('to-px');

        for (var i = 0; i < icons.length; i++) {
            var topEl = icons[i].style.top; 
            var leftEl = icons[i].style.left;

            var top = topToVh(topEl);
            var left = leftToVw(leftEl);
            /* var topFlo = (parseFloat(topEl) / document.documentElement.clientHeight) * 100;
                if(topFlo>99) {
                    topFlo = 90;
                }
    
                var leftFlo = (parseFloat(leftEl) / document.documentElement.clientWidth) * 100;
                if(leftFlo>99) {
                    leftFlo = 90;
                }
                var top = topFlo +"vh";
                var left = leftFlo + "vw"; */

            //icons[i].style.top = top;
            //icons[i].style.left = left;

            var Id = icons[i].id;
            var icon = {
            UserId: this.props.userId,
            Type: "ICON",
            Id:  Id,
            Left: left,
            Top: top
           }
           dataIcons.push(icon);
        }

        for (var i = 0; i < folders.length; i++) {
            //var leftfolder = folders[i].left;

/*             var topFlo = (parseFloat(folders[i].style.top) / document.documentElement.clientHeight) * 100;
            if(topFlo>99) {
                topFlo = 90;
            }

            var leftFlo = (parseFloat(folders[i].style.left) / document.documentElement.clientWidth) * 100;
            if(leftFlo>99) {
                leftFlo = 90;
            } */

            var topEl = folders[i].style.top;
            var leftEl = folders[i].style.left;
            var top = topToVh(topEl);
            var left = leftToVw(leftEl);

         /*    var top = topFlo +"vh";
            var left = leftFlo + "vw"; */


           // var top = ((parseFloat(folders[i].style.top) / document.documentElement.clientHeight) * 100)+"vh";
           // var left = ((parseFloat(folders[i].style.left) / document.documentElement.clientWidth) * 100)+"vw";
            var Id = folders[i].id;
           // debugger;
            var folder = {
             //UserId: this.props.userId,
             Type: "FOLDER",
             Id:  Id,
             Left: left,
             Top: top
            }
            dataIcons.push(folder);
         }


         if(dataIcons.length>0) {
             
        axios.post(URL.api+URL.saveLocations, dataIcons, this.state.authConfig) 
        .then((result) => {
            document.getElementById("saveIcons").className = "switchDisable";
            })
        .catch((error) => {this.Alert("Nie udało się zachować lokalizacji.")}); 
        }
        else {
            document.getElementById("saveIcons").className = "switchDisable";
        }
    }  



/*     bottomIcon = (id, top_) => {
        var entity = document.getElementById(id);

        if(entity) {

            var top = entity.style.top;
            if(top.includes("px")) {
                var topH = ((parseFloat(top) / document.documentElement.clientHeight) * 100);
                if(topH > 80) {
                    return true;
                }
            }
            else {
                if(parseFloat(top) > 80) {
                    return true;
                }
            }
        }
        else {
            if(parseFloat(top_) > 80) {
                return true;
            }
        }

        return false;
    } */


    Alert = (message) => {
        this.props.serverAlert(message);
    }


    getHPosition = () => {
        var randomInt = require('random-int');
        return randomInt(101,200);
    }

    getWPosition = () => {
        var randomInt = require('random-int');
        return randomInt(-50,200);
    }


  

    stopAdding = () => {
        document.getElementById("exploreT").value = "";
        this.setState({addingIcon: false});
        this.setState({wrongWWW: false});
        this.setState({noIconsFound: false});
        this.setState({searchingIcons: false});
        this.setState({
            iconsFound: false
          });
        this.setState({newIcons: []});
        this.setState({newImages: []});
        this.setState({newSpotify: []});
        this.setState({explQuery: ""});
    }

    stopAddingFolder = () => {

        var newFolders = document.getElementsByClassName('folder');

        for(var i=0;i<newFolders.length;i++)
        {
            var fold = newFolders[i];
            var stateFol = this.getIconById(fold.id);
            if(stateFol) {
                stateFol.top = fold.style.top;
                stateFol.left = fold.style.left;
            }
        }

        this.setState(prevState => ({
            folders: [...prevState.folders, ...this.state.newFolders]
          }));
          this.setState({newFolders: []})
        this.setState({addingFolder: false});
        document.getElementById("exploreT").value = "";
        this.setState({addingIcon: false});
        this.setState({explQuery: ""});
    }


/* 
    getQuarter = (id, _left, _top) => {
        var entity = document.getElementById(id);
        var top = parseFloat(_top);
        var left = parseFloat(_left);
        
        var quarter = 1;
        
        if(entity) {
            var top_ = entity.style.top;
            var left_ = entity.style.left;
            if(top_.includes("px")) {
                top = ((parseFloat(top_) / document.documentElement.clientHeight) * 100); 
                left = ((parseFloat(left_) / document.documentElement.clientWidth) * 100); 
            }
        }
        if(left<=50 && top<=50) {
           
            quarter = 1;
        }
        if(left>=50 && top<=50) {
            
            quarter = 2;
        }
        if(left>=50 && top>=50) {
           
            quarter = 3;
        }
        if(left<=50 && top>=50) {
          
            quarter = 4;
         }
         //console.log("positions:" + top + "   " + left);
       return quarter;
    } */


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

    getClass = (id) => {
        if (id !== "dis" && !this.state.addingIcon && !this.state.addingFolder) {
            return "entity";
        }
        if (id == "dis") {
            return "disable";
        }
        if ((this.state.addingIcon || this.state.addingFolder) && id !== "dis") {
            return "entityDis";
        }
    }

    getFolderClass = (id) => {
        if (id !== "dis" && !this.state.addingIcon && !this.state.addingFolder) {
            return "folder";
        }
        if (id == "dis") {
            return "disable";
        }
        if ((this.state.addingIcon || this.state.addingFolder) && id !== "dis") {
            return "folderDis";
        }
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

   

   /*  switchAddIcon = (event) => {
        document.getElementById("iLink").value = "";
        var id = event.target.id;
        this.setState({addSwitcher: id });

        if(id == "addYouTube")
            this.setState({addPlaceholder: "Wklej link do filmu YouTube"});
        if(id == "addWWW")
            this.setState({addPlaceholder: "Wklej link do strony ze zdjęciami"});
        if(id == "addInstagram")
            this.setState({addPlaceholder: "Wklej link do postu"});
        if(id == "addSpotify")
            this.setState({addPlaceholder: "Wklej kod osadzenia"});
    } */

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

            getIconById = (Id) => {
                var allIcons = [...this.state.icons, ...this.state.images, ...this.state.spotify, ...this.state.folders, ...this.state.newFolders ];
                var icon = allIcons.find( icon => icon.id === Id);
                return icon;
            }
        
            getIconTags(Id) {
                var icon = this.getIconById(Id);
                if(icon && icon.type !== 'FOLDER') {
                    return icon.tags;
                }
                return [];
        
            }
cleanexplQuery = () => {

    document.getElementById("exploreT").value = "";
    this.setState({explQuery: ""});
}

setAddingIcon = () => {
    this.setState({explQuery: document.getElementById("exploreT").value});
}


    render(props) {

        var randomInt = require('random-int');
        //debugger;
        let icons = this.state.icons.map(song => {
            return (
                <YTIcon  remover={2}  isAuth={this.props.isAuthenticated}   title={song.title} yt={song.id} id={song.id}
                classname= {this.getClass(song.id)}
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
                    count={song.count}
                    fromFolder = {this.state.fromFolder}
                    showTitleEditor = {this.showTitleEditor}
                    leftEdit = "70%"
                    bottom = {bottomIcon(song.id, song.top)}
                    tags={song.tags}
                    fromDesk = {true}
                    public={false}
                    guidId={song.guidId}
                />
            )
        })



        let spotifies = this.state.spotify.map(song => {
            return (
                <SpotifyIcon  remover={2}  isAuth={this.props.isAuthenticated}   
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
                    fromDesk = {true}
                    public={false}
                    guidId={song.guidId}
                />
            )
        })


        let newSpotifies = this.state.newSpotify.map(song => {
            return (
                <SpotifyIcon  remover={3}  isAuth={this.props.isAuthenticated}   
                title={song.title} id={song.id}
                src = {song.source}
                classname= { (song.id == "dis")? "disable":"entity"}
                    linkTo={this.onDbSpotifyClick}
                  
                    location={ this.state.iconsFound?  
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
                    folderId = {this.state.folderId}
                    fromFolder = {this.state.fromFolder}
                    showTitleEditor = {this.showTitleEditor}
                    leftEdit = "70%"
                    bottom = {bottomIcon(song.id, song.top)}
                    fromDesk = {false}
                    public={false}
                    newIcon={true}
                />
            )
        })


        let images = this.state.images.map(img => {
            //debugger;
            return (
                <ImageIcon  remover={2}  isAuth={this.props.isAuthenticated}    yt={img.id} id={img.id}
                classname= {this.getClass(img.id)}
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
                    count={img.count}
                    fromFolder = {this.state.fromFolder} 
                    newimage = {false}
                    tags={img.tags}
                    type = {img.type}
                    showTitleEditor = {this.showTitleEditor}
                    leftEdit = "70%"
                    bottom = {bottomIcon(img.id, img.top)}
                    quarter = {getQuarter(img.id, img.left, img.top)}
                    fromDesk = {true}
                    public={false}
                    guidId={img.guidId}
                />
            )
        })


        let newImages = this.state.newImages.map(img => {
            return (
                <ImageIcon  remover={3}  isAuth={this.props.isAuthenticated} yt={img.id} id={img.id}
                classname= { (img.id == "dis")? "disable":"entity"}
                    linkTo={this.onDbImgClick}
                    /* size={this.state.loadedIcons? '40px' : '0px' } */
                    location={ this.state.iconsFound? 
                      {boxShadow: this.getShadow(parseInt(img.left), parseInt(img.top), img.id), top: img.top, left: img.left, transition: 'top '+2+'s, left '+2+'s' , width: "60px", height: "50px", borderRadius: '6px'} :
                      {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw',
                     }}
                      //{top: 20+'vh', left: 20+'vw'}}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    srcWidth={this.getImgWidth(img.type)}
                    srcHeight={this.getImgHeight(img.type)}
                    count={img.count}
                    title = {img.title}
                    source = {img.source}
                    fromFolder = {this.state.fromFolder} 
                    url = {this.state.sourceUrl}
                    folderId = {this.state.folderId}
                    newimage = {true}
                    newIcon={true}
                    public={false}
                />
            )
        })


        let removingExplore = this.state.explQuery==""?  "" :
        <div  onClick = {this.cleanexplQuery}  class="removeExpl clickElem">&#43;</div>

        let newIcons = this.state.newIcons.map(song => {

            return (
                <YTIcon  remover={3} isAuth={this.props.isAuthenticated}  title={song.title} yt={song.id} id={song.id}
                classname= { (song.id == "dis")? "disable":"entity"} 
                    linkTo={this.onDbClick}
                    size={ '40px'  }
                    location={ this.state.iconsFound? 
                      {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id), top: song.top, left: song.left, transition: 'top '+2+'s, left '+2+'s'}:
                      {top: this.getHPosition(101,200)+'vh', left: this.getWPosition(-50,200)+'vw'}}
                      //{top: 20+'vh', left: 20+'vw'}}
                    onHover={this.onHover}
                    onLeave={this.cleanTitle}
                    count={song.count}
                    fromFolder = {this.state.fromFolder}
                    folderId = {this.state.folderId}
                    leftEdit = "70%"
                    public={false}
                    newIcon={true}
                />
            )
        })

        let folders = this.state.folders.map(song => {
       
            return (
                        
                <Folder  title={song.title} yt={song.id} id={song.id}
                    classname= {this.getFolderClass(song.id)}
                    linkTo={this.openFolder}         
                    location={ this.state.loadedIcons? 
                    {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id), top: song.top, left: song.left, transition: 'top '+2+'s, left '+2+'s'}:
                    {top: randomInt(101,200)+'vh', left: randomInt(-50,200)+'vw'}}
                    onHover={this.onHoverFolder}
                    onLeave={this.leaveFolder}
                    count={song.count}
                    icon0= {song.icon0}
                    icon1= {song.icon1}
                    icon2= {song.icon2}
                    icon3= {song.icon3}
                    showTitleEditor = {this.showTitleEditor}
                    leftEdit = "92%"
                    topEdit = "95%"
                    bottom = {bottomIcon(song.id, song.top)}
                    public={false}
                    
                    />
                     
                )
            })
            
            var i = 0;
            let newFolders = this.state.newFolders.map(song => {
                i = i+1;
                return (
                            
                    <Folder  title={song.title} yt={song.id} id={song.id}
                        classname= "folder"
                        linkTo={this.openFolder}         
                        location={ this.state.loadedIcons?
                        {boxShadow: this.getShadow(parseInt(song.left), parseInt(song.top), song.id), top: song.top, left: song.left, transition: 'top '+2+'s, left '+2+'s'}:
                        {top: randomInt(101,200)+'vh', left: randomInt(-50,200)+'vw'}}
                        onHover={this.onHoverFolder}
                        onLeave={this.leaveFolder}
                        hideEditors={true}
                        
                        />
                         
                    )
                })

       

        let addingInfo = this.state.wrongWWW?
        <div style={{color: 'red'}}> Nieprawidłowy adres lub kod osadzenia. </div> : "";

        let noIcons = this.state.noIconsFound?
        <div> Nie znaleziono nowych ikon.</div> : "";

        let iconsInfo = (this.state.iconsFound && !this.state.showTitleEdit)?
        <div>Naciśnij <span class="addIconInfo">&#43;</span> przy wybranej ikonie aby dodać ją do pulpitu.</div> : "";

        let loading = (this.state.searchingIcons && !this.state.wrongWWW && !this.state.noIconsFound && !this.state.iconsFound)?
        (<div style={{color: 'white'}} class="lds-ellipsiss"><div></div><div></div><div></div></div>) : "";


/*         let addingIcon = <div id="ownField" style={{display: this.state.addingIcon? 'block' : 'none'}} >
        <p>Dodaj nowe ikony z:</p>

        <div  style={{display: "flex"}}>

        <div id="addYouTube" onClick={this.switchAddIcon} class={(this.state.addSwitcher == "addYouTube")? "addSwitcherActive" : "addSwitcher" }  >YouTube</div>
        <div id="addWWW" onClick={this.switchAddIcon} style={{marginLeft: "10px"}}  class={(this.state.addSwitcher == "addWWW")? "addSwitcherActive" : "addSwitcher" } >WWW</div>
        <div id="addInstagram" onClick={this.switchAddIcon} style={{marginLeft: "10px"}}  class={(this.state.addSwitcher == "addInstagram")? "addSwitcherActive" : "addSwitcher" } >Instagram</div>
        <div id="addSpotify" onClick={this.switchAddIcon} style={{marginLeft: "10px"}}  class={(this.state.addSwitcher == "addSpotify")? "addSwitcherActive" : "addSwitcher" } >Spotify</div>

        </div>
       
        <p></p>
        <div style={{display: "flex"}}>
        <input type="text" placeholder={this.state.addPlaceholder}
        onKeyPress={this.addIconHandlerPress}
        style={{width: "230px"}} id="iLink"/>
        <button class= { "popupButtton" } style={{fontSize: 12, padding: "4px",  width: '90px', marginLeft: "10px"}}  
        onClick={this.addIconHandler} >Znajdź ikony</button>
         <div title="Zakończ" class= { "stopAdding" }
        onClick={this.stopAdding}>&#43;</div>
        </div>
        <div style={{marginLeft: '0px'}} id="infoLink">&#9432;info
                <div id="info">
                            Aby odszukać i dodać ikony reprezentujące film YouTube lub zdjęcia,
                            wklej link do filmu, strony www lub postu na Instagramie.
                            W celu dodania ikony z serwisu Spotify skopiuj i wklej osadzony kod, który znajduje się
                            w zakładce "Udostępnij" w opcjach utworu, albumu, artysty lub playlisty. 
                        </div>
                </div>
            <div style={{display: "flex"}}>
           {addingInfo}
           {noIcons}
           {iconsInfo}
           {loading}
        </div>
        </div>; */



        let tagsField = this.state.loadedIcons? <TagsField noIcons = {!this.anyIcons()}  searchTag={this.props.searchTag} fromDesk={true} setTags={this.showTitleEditor}  id={this.state.entityID} tags = {this.state.entityTags} />  : "";


            let field = "";

        if(this.props.isAuthenticated) {
            if(this.state.ytField)
                field = <Field play={this.state.entityID} show={this.state.loadedIcons} nextSong={this.nextSongHandler} loadText={this.props.fetchData} />

            if(this.state.imgField)
                field = <ImageField src={this.state.entityID} sourceShow={this.getNiceHttp(this.state.imgSource)} 
                source={this.state.imgSource}
                show={this.state.loadedIcons}/>
            if(this.state.infoField)
                field = <InfoField show = {!this.anyIcons()}  fromFolder={this.state.fromFolder}/>

            if(this.state.spotifyField)
                field = <SpotifyField id={this.state.entityID} show={this.state.loadedIcons}/>

            if(!this.state.spotifyField && !this.state.infoField && !this.state.ytField && !this.state.loadedIcons) {
                field = <LoadingField/>
            }
        }
        else {
            field = <LoginField/>
 
        }

          let tagsEdit =  this.state.folderEditing?  ""
          : 
         
          <input id="editTags" type="text"
          autofocus="true"
         placeholder = "Wpisz tagi oddzielając je przecinkami"
          onKeyPress = {this.onKeyTitle}
           onChange={e => this.editTags(e.target.value)} 
           value={this.state.editedTags} /> ; 

        let titleEdit = 
        <div style={{display: this.state.showTitleEdit? "block" : "none" }}  class="titleDivEdit">
        <input id="editT" type="text"
        autofocus="true"
       placeholder = {this.state.folderEditing? "Wpisz tytuł dla folderu" : "Wpisz tytuł dla ikony"}
        onKeyPress = {this.onKeyTitle}
         onChange={e => this.editTitle(e.target.value)} 
         value={this.state.editedTitle} /> 
     
        {tagsEdit}


         <div style={{alignItems: "center"}}>
         <button class="titleButton" onClick={this.editTitleHandler} style={{fontSize: 12, padding: "2px",  width: '60px'}}>Ok</button>
         &nbsp;
         <button class="titleButton" onClick={this.editTitleCancel}  style={{fontSize: 12, padding: "2px",  width: '60px'}}>Anuluj</button>
         </div>
         </div>;

            let saveIcons = <div id="saveIcons" class="switchDisable" onClick={this.saveIcons} >
            <i class="icon-floppy" />
            <div id="saveIconsField" class="hoverInfo"  >
                Zapamiętaj aktualne ulokowanie ikon  
            </div>
        </div>
        
        let folderIcon = //window.location.href.includes("folder")? 
        (this.props.match.params.id1=="folder")? 
        <div id="backFolder" onClick={this.backToDesktop} class="switchB"> 
        <i class="icon-left-bold" />
        <div id="backFolderField" class="hoverInfo" >
        Wróć do głównego pulpitu 
        </div>
        </div>
        :
        <div id="plus" class= {this.state.addingFolder? "switchA" : "switchB" } onClick={this.showAddingFolder}  title="Dodaj nowy folder"> 
        <i class="icon-folder-add" />
        <div id="plusField" class="hoverInfo" title="">
        Utwórz nowy folder
        {/* <p>Utwórz nowy folder o nazwie:</p>
        <div style={{display: "flex"}}>
        <input type="text"  onKeyPress={this.setFolderName}  onChange={this.setFolderName}  style={{width: "105px"}} id="fol"/>
        <button class="popupButtton" style={{fontSize: 12, padding: "4px", marginLeft: "10px"}}  onClick={this.addFolderHandler} >Dodaj</button>
        </div> */}
        </div>
        </div>;
        
        let addOwn =
        <div id="addOwn" class= {this.state.addingIcon? "addOwn activePlus" : "addOwn" }  onClick={this.showAddingIcon}> 
        &#43;
        <div id="addText" class="hoverInfo" >
        Dodaj własne ikony  
        </div>
        </div>
  let infoAdding = this.state.addingFolder?
  <span>Utwórz foldery i dodawaj do nich wybrane ikony, aby uporządkować i segregować
      swoją kolekcję. Nazwa folderu może składać sie z maksymalnie 20 znaków.</span>
  :
  <span>Aby odszukać i dodać ikony reprezentujące film YouTube lub zdjęcia,
  wklej link do filmu, strony www lub postu na Instagramie.
  W celu dodania ikony z serwisu Spotify skopiuj i wklej osadzony kod, który znajduje się
  w zakładce "Udostępnij" w opcjach utworu, albumu, artysty lub playlisty.</span>


let findNewIcons = (this.state.addingIcon ||  this.state.addingFolder)?
             <div class="actuallMenu">

 <div style={{marginLeft: '10px', marginTop: '10px'}} id="infoLink">&#9432;info
                <div id="info">
                           {infoAdding}
                        </div>
                </div>
     {/*    <label>Dodaj nowe ikony z: </label> */}
         <div class="addingDiv">
        
             <input id="exploreT" type="text"

             onKeyPress={this.state.addingFolder? this.setFolderName :  this.addIconHandlerPress}
             onChange={this.state.addingFolder? this.setFolderName : this.setAddingIcon}

                 autofocus="true"
                placeholder = {this.state.addingFolder? "Wpisz tytuł dla folderu..." :  "Wklej link lub kod osadzenia..."}
                  /> {removingExplore}</div>
                       <button class= { "popupButtton" } 
                       style={{fontSize: 12, padding: "2px", height: '25px',  width: '85px', marginTop: '5px', marginLeft: "10px"}}  
        onClick={this.state.addingFolder? this.addFolderHandler : this.addIconHandler} > {this.state.addingFolder? "Dodaj folder":  "Znajdź ikony"}</button>

         <button class= { "popupButtton" } style={{fontSize: 12, padding: "2px", height: '25px',  width: '85px', marginTop: '5px', marginLeft: "10px"}}  
        onClick={this.state.addingFolder? this.stopAddingFolder : this.stopAdding} >Zakończ</button>

   <div id='addingIconField' class='addingIconTitle'>
           {addingInfo}
           {noIcons}
           {iconsInfo}
           {loading}
        </div>


                  </div> : "";

        
    let  deskMenu =  (<div class="deskMenu">
           {addOwn}
           {folderIcon}
        {saveIcons}
          {findNewIcons}
            </div>); 


            return  (
                <div className="area">
                {deskMenu}
        
            <div> <input id="ls" onChange={this.liveSearch} placeholder="Wyszukaj..." class="switchSearch" type="text"/></div>
          
           {/*  <div id="saveIcons" class="switchDisable" onClick={this.saveIcons} style={{ position: 'fixed', right: '155px', bottom: '6px', zIndex: '300' }} >
             <i class="icon-floppy" />
             <div id="saveIconsField"  >
                    Zapamiętaj aktualne ulokowanie ikon.  
                </div>
            </div> */}

            <div id="prop" class="switchB" style={{ position: 'fixed', right: '130px', bottom: '6px', zIndex: '300' }} >
             <i class="icon-cog" />
             <div id="propField">
                <p/>
                <hr/> 
                    <div>Jasność ikon:</div>
                    <input type="range" id="s"
                        onChange={this.rangeHandler} />
               <hr/> 
             {/*    <p/>
                    <div class="switcher" onClick={this.screenManage}><i style={{fontSize: "20px" }} class={this.props.fullScreen? "icon-resize-small-alt" : "icon-resize-full-alt"}/>
                    {!this.props.fullScreen? "Aktywuj pełny ekran" : "Zamknij pełny ekran"}</div>
                  <hr/>  */}
                </div>
            </div>
           
           {tagsField}
              {field}

                <div id = "258" class="titleDiv" > </div>


                {titleEdit}
                
                
                {icons}
                {folders}
                {images}
                {spotifies}
                {newIcons}
                {newImages}
                {newSpotifies}
                {addingIcon}
                {newFolders}
                

               <div class="containerIconsContainer">
               <div class="iconsContainer">
                </div>
                </div>
            
            </div>
        );
    }  
}
const mapStateToProps = state => {
    //debugger;
  return {
      isAuthenticated: state.auth.jwttoken !== null,
      //userId: state.auth.userId,
      jwtToken: state.auth.jwttoken,
      addingIcon: state.auth.addingIcon,
      removedId: state.auth.removingIconId,
      //fullScreen: state.auth.fullScreen,
  };
};

const mapDispatchToProps = dispatch => {
    return {
        serverAlert: (message) => dispatch(showServerPopup(message)),
        stopAdding: () => dispatch(stopAddingIcon()),
        stopRemoving: () => dispatch(stopRemovingIcon()),
        
    };
};
//export default UserDesktop;

export default connect(mapStateToProps, mapDispatchToProps)(UserDesktop);



