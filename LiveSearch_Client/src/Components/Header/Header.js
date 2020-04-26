
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Header.css';
import {Update} from './Updates.js';
//import "../../Fontello/css/fontello.css";
//import "../../icon/css/fontello.css";
//import "../../Icons/css/fontello.css";
import "../../Icons1/css/folder-add.css";
import { Link, Route, NavLink, BrowserRouter, Switch } from 'react-router-dom';
import YTArea from '../Areas/YTArea';
import YTAreaAdmin from '../Admin/YTAreaAdmin';
import BestSellersAdmin from '../Admin/BestSellersAdmin';
import AdminPanel from '../Admin/AdminPanel';
import BestSellers from '../Areas/BestSellers';
import Field from '../Fields/Field';
import Policy from '../Informations/Policy';
import Contact from '../Informations/Contact';
import Information from '../Informations/Information';
import Popup from '../Popup/Popup';
import ServerPopup from '../Popup/ServerPopup';
import First from '../../First';
import GoogleLogin from 'react-google-login';
import {GoogleLogout} from 'react-google-login';
import {authLogin, authLogout, showServerPopup, escManage, manageScreen} from '../../Store/Actions/auth';
import FacebookLogin from 'react-facebook-login';
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
//import {scrollU, scrollD} from '../../Store/Actions/scroll';
import UserDesktop from '../Areas/UserDesktop';
import axios from 'axios';
import {URL, PATHES} from '../../environment';



var fetchData = "";

class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {

            takeSongDataFrom: URL.api + URL.randomSongs,
            takeMovieDataFrom: URL.api + URL.tvMovies,
            opacity: 0.4,
            takeAllErrors: false,
            showCookie: true,
            cookieLeft: "-450px",
            showMusicArrow: true,
            showFilmsArrow: true,
            showBooksArrow: true,
            isFullScreen: false,
   
        }
    }


    
    componentDidMount() {
       // console.log("PARAMS");
       // console.log(this.props);
        //debugger;
        Update();
        console.log("params id ---->"  +   this.props.match.params.id);
  /*      */
        //document.addEventListener("keydown", this.escFunction, false);
        this.manageFullScreenState();
        document.addEventListener('fullscreenchange', this.manageFullScreenState, false);
        document.addEventListener('mozfullscreenchange', this.manageFullScreenState, false);
        document.addEventListener('webkitfullscreenchange', this.manageFullScreenState, false);
        document.addEventListener('msfullscreenchange', this.manageFullScreenState, false);

    
        var cookieAkcept = localStorage.getItem("cookieAkcept");

        //var disableArrows = localStorage.getItem("disableArrows");

        var musicArrows = localStorage.getItem("musicArrow");
        var filmsArrows = localStorage.getItem("filmsArrow");
        var booksArrows = localStorage.getItem("booksArrow");

        /* if(disableArrows == 1){
            this.setState({showInfoArrow: false});
        } */

        if(musicArrows == 1){
            this.setState({showMusicArrow: false});
        }

        if(filmsArrows == 1){
            this.setState({showFilmsArrow: false});
        }

        if(booksArrows == 1){
            this.setState({showBooksArrow: false});
        }



        if(cookieAkcept == 1){
            this.setState({showCookie: false});
        }
        else {
            this.setState({showCookie: true});
            this.animatedCookie();
        }
    
        if(!this.props.isAuthenticated) {

            /* var facebooks = document.getElementsByClassName("loginBtn loginBtn--facebook");
            for(var i=0;i<facebooks.length;i++) {
                document.getElementsByClassName("loginBtn loginBtn--facebook")[i].innerHTML = "Zaloguj przez Facebook";
            } */
        }
        this.liveResponsive();
        //window.addEventListener('resize', this.liveResponsive);
// EVENT LISNER ONLY IN FIRST COMPONENT!!!
        
    }

    componentWillUnmount() {
        this.manageFullScreenState();
        //document.removeEventListener("keydown", this.escFunction, false);
        document.addEventListener('fullscreenchange', this.manageFullScreenState, false);
        document.addEventListener('mozfullscreenchange', this.manageFullScreenState, false);
        document.addEventListener('webkitfullscreenchange', this.manageFullScreenState, false);
        document.addEventListener('msfullscreenchange', this.manageFullScreenState, false);

      }




    componentDidUpdate() {
        //debugger;

       /*  if(!this.props.isAuthenticated) {
            var facebooks = document.getElementsByClassName("loginBtn loginBtn--facebook");
            for(var i=0;i<facebooks.length;i++) {
                document.getElementsByClassName("loginBtn loginBtn--facebook")[i].innerHTML = "Zaloguj przez Facebook";
            }
        } */
    }
    
 

    Main = () => {
     //window.location.replace("/");
     this.props.history.push('/');

     if(this.props.isAdmin) {
        this.props.history.push('/adminpanel');
     }
    }

    InMusic = () => {
        return  this.props.match.params.id?   this.props.match.params.id.includes("muzyka") : false;
    }

    InMovies = () => {
        return  this.props.match.params.id?   this.props.match.params.id.includes("filmy") : false;
     }


     InBooks = () => {
        return  this.props.match.params.id?   this.props.match.params.id.includes("literatura") : false;
     }


    myDesktop = () => {
        this.props.history.push(PATHES.userPulpit);
    }

    hideMusicArrow = () => {
        this.setState({showMusicArrow: false});
        localStorage.setItem("musicArrow", 1);
    }

    hideFilmsArrow = () => {
        this.setState({showFilmsArrow: false});
        localStorage.setItem("filmsArrow", 1);
    }

    hideBooksArrow = () => {
        this.setState({showFilmsArrow: false});
        localStorage.setItem("booksArrow", 1);
    }




    acceptCookies = () => {
        this.setState({showCookie: false});
        localStorage.setItem("cookieAkcept", 1);
    }

    animatedCookie = () => {
        setTimeout(() => {
         
            this.setState({
                cookieLeft: '50px'
            })
        }, 1000)
    }

    manageFullScreenState = () => {

        //this.Alert("I detect screen change");
       
            if((window.fullScreen) ||
            (window.innerWidth == window.screen.width && window.innerHeight == window.screen.height)) {
                this.setState({isFullScreen: true});
            }
            else {
                this.setState({isFullScreen: false});
            }
    }

    screenManage = () => {
        this.props.screenManage();
    }


    liveResponsive = () => {
       //this.Alert(window.innerWidth + "");
       if(window.innerWidth < 760) {
            this.setState({responsive: true});
       }
       else {
        this.setState({responsive: false});
       }
    }

    socialLogin = (name, email, image, token) => {

if(email !== undefined) {

    const data = {
        Email: email,
        Token: token
    };
   
    axios.post(URL.api+URL.login, data)
    .then(response => {
        if(response.data == "error") {
            this.Alert("Wystąpił błąd przy próbie zalogowania.errr");
        }
        else {
            
            this.props.SocialLog(response.data.userId, name, image, response.data.jwtToken, response.data.role, response.data.userNick);
            this.props.history.push(PATHES.userPulpit);
        }
    }).catch(error => { this.Alert("Wystąpił błąd przy próbie zalogowania.")});
}
else {
    this.Alert("Musisz udostępnić swój adres email aby móc się zarejestrować.");
}

}

responseErrorGoogle = (response) => {
    this.Alert("Wystąpił błąd przy próbie zalogowania.");
}

        
    responseGoogle = (response) => {
        debugger;
        if(!this.props.isAuthenticated) {
        
            this.socialLogin(response.profileObj.name, response.profileObj.email, response.profileObj.imageUrl, "G_"+response.tokenId);
         
            //this.props.SocialLog( response.profileObj.givenName, response.profileObj.imageUrl, response.tokenId);
        }
        //console.log(response);
    }

     /* googleSignOut = ()  => {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
          console.log('User signed out.');
        });
      } */

    responseFacebook  = (response) => {
       //console.log(response);
      
       if(!this.props.isAuthenticated) {
      
           this.socialLogin(response.name, response.email, response.picture.data.url, "F_"+response.accessToken);
         
           //this.props.SocialLog( response.name, response.picture.data.url, response.accessToken ); 
        }
    }

     logOut =() => {

        this.props.Logout();
       
         //document.getElementById("login").id = "another";
         window.location.replace("/");
    }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    clickCheckBox = () => {

        var stateCount = 0;


        for (var i = 1; i < 8; i++) {
            document.getElementById(i).disabled = false;
            //////here
            if (document.getElementById(i).checked) {
                document.getElementById(i+'a').style.color='rgba(231, 173, 64, 0.836)';
                document.getElementById(i+'a').style.pointerEvents =  'auto';
               
               
                stateCount = stateCount + 1;
                if (stateCount === 3) {

                    for (var i = 1; i < 8; i++) {
                        if (document.getElementById(i).checked === false) {

                            document.getElementById(i).disabled = true;
                            document.getElementById(i+'a').style.color = "rgba(255, 255, 255, 0.310)";
                            document.getElementById(i+'a').style.pointerEvents =  "none";
                        }
                    }
                }
            }
            else {
                document.getElementById(i+'a').style.color='rgba(255, 255, 255, 0.842)';
                document.getElementById(i+'a').style.pointerEvents =  'auto';
        
            }
        }
        var fetchFrom = "";

        for (var i = 1; i < 8; i++) {
            if (document.getElementById(i).checked) {
                fetchFrom = fetchFrom + document.getElementById(i).name;
            }
        }

         fetchData = URL.api + URL.radioSongs + fetchFrom;
    
        if (fetchFrom === "") {
            fetchData = URL.api + URL.randomSongs; 
        }
        //this.setState({ takeSongDataFrom: fetchData });
    }


   // scrollDown = () => {
            //debugger;
            //scrollD();
/*         if(localStorage.getItem('inMove')=='false') {
            
            var songs = document.getElementsByClassName("entity");
            var initialLocations = [];
            for (var i = 0; i < songs.length; i++) {
                //console.log(songs[i].style.top);
                songs[i].style.transition = 'top '+2+'s, left '+2+'s'
                initialLocations.push({ 'top': songs[i].style.top, 'left': songs[i].style.left });
            }
            
            for (var i = 1; i < songs.length; i++) {
                songs[i-1].style.top = initialLocations[i].top;
                songs[i-1].style.left = initialLocations[i].left;
            }
        } */
        //console.log(initialLocations);
   // } 

/*     scrollUp = () => {
        scrollU();
    } */


    showSongs = () => {

       // document.getElementById("s").value = 50;
        //console.log("Fetch data when clicked:  " + fetchData);
        
        //this.setState({ takeAllErrors: false });

        if(fetchData !== "")
        {
            this.setState({ takeSongDataFrom: fetchData });
        }

        if(this.props.isAdmin)
        {
            var adminBoxEr = document.getElementById("adminBoxEr");
            if(adminBoxEr.checked) {
                //debugger;
                this.setState({ takeAllErrors: true });
                var takeErrors = URL.api+URL.getallerrors;
                this.setState({ takeSongDataFrom: takeErrors });
            }
           
        }


        if(this.props.isAdmin) {
            this.props.history.push(PATHES.songsAdmin);
        }
        else {
            this.props.history.push(PATHES.songs);
        }

        this.hideMusicArrow();
    };

    openLink = (event) => {
        this.props.history.push(event.target.id);
    }


        showBooks = () => {
           
            if(this.props.isAdmin) {
                this.props.history.push(PATHES.bestsellersAdmin);
            }
            else {
                this.props.history.push(PATHES.bestsellers);
            }
            this.hideBooksArrow();
        }

    showMovies = () => {
        this.setState({ takeAllErrors: false });

        var moviesUrl = URL.api+URL.tvMovies;
        var cinema = document.getElementById("cBox");
        var tvmovies = document.getElementById("tvBox");

        if(cinema.checked)
        {
            moviesUrl = URL.api+URL.tvMovies;
        }
        if(tvmovies.checked)
        {
            moviesUrl = URL.api+URL.tvMovies;

            if(this.props.isAdmin)
            {
                var adminBoxEr = document.getElementById("adminBoxEr");
                if(adminBoxEr.checked) {
                     moviesUrl = URL.api+URL.getMoviesForAdmin;
                   
                }
               
            }
        }

        this.setState({takeMovieDataFrom: moviesUrl});
        
        if(this.props.isAdmin) {
            this.props.history.push(PATHES.moviesAdmin);
        }
        else {
            this.props.history.push(PATHES.movies);
        }
            
        this.hideFilmsArrow();
    }

    clickTV = () => {
  
        var box = document.getElementById("tvBox");
        if(box.checked) {
            document.getElementById('1m').style.color = 'rgba(231, 173, 64, 0.836)';
            document.getElementById('bM').className = "filmButtton";
            //movieChecked = true;
        }
        else {
            document.getElementById('1m').style.color = 'rgba(255, 255, 255, 0.842)';
            document.getElementById('bM').className = "filmButttonEnabled";
        }

        
        var box1= document.getElementById("cBox");
        box1.checked = false;
        document.getElementById('2m').style.color = 'rgba(255, 255, 255, 0.842)';
        document.getElementById('cityTab').style.display = 'none';
    }


    clickBestsellers = () => {
  
        var box = document.getElementById("bookBox");
        if(box.checked) {
            document.getElementById('1b').style.color = 'rgba(231, 173, 64, 0.836)';
            
            document.getElementById('bB').className = "bookButtton";

        }
        else {
            document.getElementById('1b').style.color = 'rgba(255, 255, 255, 0.842)';
            document.getElementById('bB').className = "bookButttonEnabled";
            
        }
    }

    clickCinema = () => {
  
        var box = document.getElementById("cBox");
        if(box.checked) {
            document.getElementById('2m').style.color = 'rgba(231, 173, 64, 0.637)';
            document.getElementById('bM').className = "filmButtton";
            document.getElementById('cityTab').style.display = 'block';
        }
        else {
            document.getElementById('2m').style.color = 'rgba(255, 255, 255, 0.842)';
            document.getElementById('bM').className = "filmButttonEnabled";
            document.getElementById('cityTab').style.display = 'none';
        }
        var box1 = document.getElementById("tvBox");
        box1.checked = false;
        document.getElementById('1m').style.color = 'rgba(255, 255, 255, 0.842)';
    }



    getMovedIcons = () => {

        var iconsClass = document.getElementsByClassName("entity");
        //var folders = [...this.state.folders];
        var icons = Array.prototype.filter.call(iconsClass, function(icon){
            return (icon.style.top).includes("px");
        });
            return icons;
        }
        
        
        changeAllLocaions = () => {
            if(this.props.isAdmin) {
                var icons = this.getMovedIcons();
                for (var i = 0; i < icons.length; i++) {
                    this.changeYoutubeLocationForAll(icons[i].id);
                }
                this.Alert("Finished"); 
            }
        }


        changeYoutubeLocationForAll = (id) => {

            //var id = this.state.nowPlayed;
            var icon = document.getElementById(id);
            var topEl = icon.style.top; 
            var leftEl = icon.style.left;
        
                var topFlo = (parseFloat(topEl) / document.documentElement.clientHeight) * 100;
                if(topFlo>99) {
                    topFlo = 90;
                }
        
                var leftFlo = (parseFloat(leftEl) / document.documentElement.clientWidth) * 100;
                if(leftFlo>99) {
                    leftFlo = 90;
                }
                var top = topFlo +"vh";
                var left = leftFlo + "vw";
        
                var data = {
                    Id:  id,
                    Left: left,
                    Top: top
                   }
        
                   //debugger; 
                   var config = {
                    headers: {Authorization: "Bearer " + this.props.jwtToken}
                }
                   axios.post(URL.api+URL.changeLocation, data, config)
                   .then((result) => {
                       
                       })
                   .catch(error => {
                       this.Alert("Nie udało się zmienić lokacji. Spróbuj ponownie później.")}); 
        
        }



    
    render() {
    
        
        let userDesktop = null;
        let userFolder = null;
        let loginPanel = null;


    let infoArrowMusic = this.state.showMusicArrow? <div  class="infoArrow"><i class="icon-left-bold" />
    <span style={{fontSize: "13px"}}>Zapoznaj się z info.</span></div> : "";

let infoArrowFilms = this.state.showFilmsArrow? <div class="infoArrow"><i class="icon-left-bold" />
<span style={{fontSize: "13px"}}>Zapoznaj się z info.</span></div> : "";

let infoArrowBest = this.state.showBooksArrow? <div  class="infoArrowBestsellers"><i class="icon-left-bold" />
<span style={{fontSize: "13px"}}>Zapoznaj się z info.</span></div> : "";

    let movies = 
       <Route path={PATHES.movies} exact component={(props)=> (
             <YTArea {...props} fetchData = {this.state.takeMovieDataFrom} />
         )} />;
        
let first =  <Route path={'/'} exact component={First} />

    let songs =  <Route path={PATHES.songs} exact component={(props) => (
            <YTArea {...props} fetchData={this.state.takeSongDataFrom} />
        )} />;

    let books = <Route path={PATHES.bestsellers} exact component={(props) => (
            <BestSellers {...props} fetchData={URL.api + URL.bestsellers} />
        )} />;

        let policy = <Route path={PATHES.policy} component={(props) => (
            <Policy/> )} />;

            let contact = <Route path={PATHES.contact} component={(props) => (
                <Contact/> )} />;

                let information = <Route path={PATHES.information} component={(props) => (
                    <Information/> )} />;

    ///////////////////////////////////////////////
    let moviesAdmin = this.props.isAdmin?
    <Route path={PATHES.moviesAdmin} exact component={(props)=> (
        <YTAreaAdmin {...props}  takeAllErrors = {this.state.takeAllErrors}  fetchData = {this.state.takeMovieDataFrom} />
    )} /> : "";

    let songsAdmin = this.props.isAdmin?
     <Route path={PATHES.songsAdmin} exact component={(props) => (
        <YTAreaAdmin {...props}   takeAllErrors = {this.state.takeAllErrors}  fetchData={this.state.takeSongDataFrom} />
    )} /> : "";

    let adminPanel = this.props.isAdmin?
    <Route path={PATHES.adminPanel} exact component={(props) => (
       <AdminPanel {...props}/>
   )} /> : "";

    let bestAdmin = this.props.isAdmin?
    <Route path={PATHES.bestsellersAdmin} exact component={(props) => (
        <BestSellersAdmin {...props} fetchData={URL.api + URL.bestsellers} />
    )} /> : "";

    ///////////////////////////////////////////////

    let cookieInfo = this.state.showCookie? 
    <div class="cookieInfo" style={{ left: this.state.cookieLeft }}>
        Strona Livesearch.pl wykorzystuje pliki cookies.<br/> 
        Korzystając z serwisu wyrażasz zgodę na ich używanie.<br/>
        Plikami cookies możesz zarządzać w ustawienia przeglądarki.<br/>
        Więcej informacji znajdziesz w naszej <span onClick={this.openLink} id={PATHES.policy} style={{fontSize: "11px"}} class="switchHref">Polityce prywatności.</span>
     <button class="cookieButtton" onClick={this.acceptCookies}>Akceptuje</button>
                   
    </div> : "";








    let loginButtons = <div> 
        
        <table class="dna-table"> 
<tr>  
        <GoogleLogin
    clientId="117000838761-6dm3mpripvcovoqlsq00pbaoa207qbdl.apps.googleusercontent.com" 
    buttonText="Zaloguj przez Google"
    onSuccess={this.responseGoogle}
    onFailure={this.responseErrorGoogle}
   
    //117000838761-6dm3mpripvcovoqlsq00pbaoa207qbdl.apps.googleusercontent.com
    cookiePolicy={'single_host_origin'}/>
<p/>
 </tr>
<tr>

          <FacebookLogin
            appId="227659324986702"//"2395943984012670"
            autoLoad={false}
            textButton="Zaloguj przez Facebook"
            fields="name,email,picture"
            cssClass="loginBtn loginBtn--facebook"
            callback={this.responseFacebook}/>
            </tr>
</table> 
            
            </div>;



        //if(this.props.isAuthenticated) {
            userDesktop = (<Route path={PATHES.userPulpit} component={(props) => (
                <UserDesktop {...props} />
            )} />);

            userFolder = (<Route path={PATHES.userFolder + ':fid?'} component={(props) => (
                <UserDesktop {...props} />
            )} />);
        //} 
        //else {
         //  loginPanel = <div class="loginPanel"> {loginButtons}</div>
       // }





let authenticate = (<div class="logIn" id="userP"> Zaloguj się
<div id="login" class="social"> 
{loginButtons}
</div>
</div>);

let letsLogin = this.props.isAuthenticated? "": <p style={{color: "rgba(231, 173, 64, 0.937)"}}>Zaloguj się aby zapisywać ikony z tej wizualizacji na własnym pulpicie</p>; 

let screenSwitch = <div id="screenS"  class="screenSwitch" onClick={this.screenManage}><i style={{fontSize: "20px" }} class={this.state.isFullScreen? "icon-resize-small-alt" : "icon-resize-full-alt"}/>
   <div id="screenField"> {this.state.isFullScreen?  "Zamknij pełny ekran" :  "Aktywuj pełny ekran"}       </div>
</div>

let adminHeader = this.props.isAdmin?  <div onClick={this.changeAllLocaions} class="switch">ADMIN</div> : "";

let onlyErrorsCheck = this.props.isAdmin? <label class="switch">All<input  name="adminB" type="checkbox" defaultChecked={true} id="adminBoxEr"/> </label>: "";

let adminCheck = this.props.isAdmin? <label class="switch">Editor<input name="adminB"
 type="checkbox" defaultChecked={true} id="adminBox" /></label> : "";
//let url = 'https://lh5.googleusercontent.com/-fM22zCVGNzY/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rd2KVOJS8-bzXw0bRyHnScQ_eqykA/s96-c/photo.jpg';
let userPanel = (<div class="logIn" id="userP">


 <img  id="imageGoogle" src={this.props.imageUrl}></img> <span style={{position: 'relative', top: -3}}>{this.props.userName}</span>
<div id="login"> <div style={{fontSize: 14}} class="desktop" onClick={this.myDesktop}>Mój pulpit</div>
<hr/> 
<div  style={{fontSize: 12}} class="desktopC"><div  class="construction"></div>Obserwowane foldery</div>
<hr/> 
<div style={{fontSize: 12}}  class="desktopC"><div  class="construction"></div>Foldery użytkowników</div>
<hr/> 
{/*  <div style={{fontSize: 12}} class="desktopC">Twój publiczny nick:</div>
 <div id="userNick" title="Edytuj" style={{fontSize: 12}} class="desktop">
 {this.props.userName} <i id="userNickEdit" class="icon-edit"/> </div>
 <hr/>  */}
 <div class="desktop" style={{fontSize: 11}}  onClick={this.logOut}>Wyloguj</div> 
 
 </div>
</div>);

//let userHeader = (<div class="logIn" style={{position: "relative"}}  id="userP"><div  class="lds-ellipsis"><div></div><div></div><div></div></div></div>);

let userHeader = this.props.isAuthenticated ? userPanel :  authenticate;

let infoForSmall = <div class="menuForSmall"> Wersja strony dla małego okna przeglądarki i urządzeń mobilnych jest w przygotowaniu.</div> 
    

        let mainMenu =  (<div class="menu"> 

    <div id="explore" class="switch"> <i class="icon-popup"/>Eksploruj
            <div id="exploreField"> <div class="construction"></div> Strona w budowie  </div>
             </div>


            <div id="music" class=  {this.InMusic()? "activeSwitch": "switch"}>
                <i class="icon-note" />
                Muzyka
                <div id="radio">

                    <div class="headHeader">Utwory grane w ostatnich 12h w:</div>
                    <div  id="infoLink">&#9432;info
                <div id="info">
                <span style={{color: "white"}}> Wizualizacja piosenek granych <br/>w najpopularniejszych stacjach radiowych.</span><br/>
                                Utwory muzyczne wyświetlane są jako ikony - wielkość każdej z ikon uzależniona jest od łącznej ilości odtworzeń utworu <br/>w wybranych stacjach radiowych.
                                Początkowe ulokowanie ikon jest losowe, ich położenie możesz dowolnie
                                zmieniać. Aby odtworzyć dany utwór kliknij dwukrotnie na jego ikonę.
                                <p>W jednym czasie możesz wizualizować dane z maksymalnie 3 stacji radiowych.</p>
                                <p>W przypadku braku zaznaczenia jakichkolwiek stacji, system wylosuje <br/>i zaprezentuje 70 utworów <br/>(po 10 z każdego radia). </p>
                                {letsLogin}
                            </div>
                        </div>

                             {infoArrowMusic}

                        

                    <p> <label id="1a" onClick={this.clickCheckBox}>
                        <input name="rmf_" type="checkbox" id="1" />
                        Rmf FM
                        </label>
                    </p>

                    <p> <label id="2a" onClick={this.clickCheckBox}>
                        <input name="zet_" type="checkbox" id="2" />
                        Radio Zet
                        </label>
                    </p>

                    <p> <label id="3a" onClick={this.clickCheckBox} >
                        <input name="rmfmaxx_" type="checkbox" id="3" />
                        Rmf Maxx
                        </label>
                    </p>

                    <p> <label id="4a" onClick={this.clickCheckBox} >
                        <input name="eska_" type="checkbox" id="4" />
                        Radio Eska
                        </label>
                    </p>

             {/*        <p> <label id="5a" onClick={this.clickCheckBox} >
                        <input name="plus_" type="checkbox" id="5" />
                        Radio Plus
                        </label>
                    </p> */}

                    <p> <label id="5a" onClick={this.clickCheckBox} >
                        <input name="vox_" type="checkbox" id="5" />
                        Vox FM
                        </label>
                    </p>

                    <p> <label id="6a" onClick={this.clickCheckBox} >
                        <input name="zloteprzeboje_" type="checkbox" id="6" />
                        Złote Przeboje
                        </label>
                    </p>

                    <p> <label id="7a" onClick={this.clickCheckBox} >
                        <input name="trojka_" type="checkbox" id="7" />
                        Trójka
                        </label>
                    </p>

{/*                     <p> <label id="7a" onClick={this.clickCheckBox} >
                        <input name="chillizet_" type="checkbox" id="7" />
                        ChilliZet
                        </label>
                    </p> */}

{/*                     <p> <label id="7a" onClick={this.clickCheckBox} >
                        <input name="rmfclassic_" type="checkbox" id="7" />
                        Rmf Classic
                        </label>
                    </p> */}
 {/*
                    <p> <label id="10a" onClick={this.clickCheckBox} >
                        <input name="antyradio_" type="checkbox" id="10" />
                        AntyRadio
                        </label>
                    </p> */}

                    <button class="musicButtton" onClick={this.showSongs}>POKA<span style={{ fontSize: 14 }}>&#380;</span> UTWORY</button>
                   
<br/>
                       
                </div>

            </div>

            <div id="movie" class=  {this.InMovies()? "activeSwitch": "switch"}> <i class="icon-video-alt" />Film 
 <div id="movieField">
<div class="headHeader">Zwiastuny produkcji filmowych:</div>
<div   id="infoLink">&#9432;info
                <div id="info">
                <span style={{color: "white"}}>Wizualizacja filmowego rozkładu jazdy naziemnych stacji telewizyjnych.</span><br/> 
                            Każdy zwiastun filmowy reprezentowany jest przez ikonę, której wielkość uzależniona jest od
                            oceny filmu w serwisie <a href="http://www.filmweb.pl">filmweb.pl</a>.
                            Początkowe ulokowanie ikon jest losowe, ich położenie możesz dowolnie
                            zmieniać. Aby odtworzyć dany zwiastun kliknij dwukrotnie na jego ikonę.
                            {letsLogin}
                        </div>
                </div>
                {infoArrowFilms}

<p/>
<label id="1m" class="mainChoice" onClick={this.clickTV} > 
<input name="tv" type="checkbox" id="tvBox" />
Telewizja
</label>
<br/>
        <div style={{marginLeft: "10px", fontSize: '12px'}}>
        Filmy które zostaną wyemitowane 
        <br/>w najbli&#380;szych 24h <br/>w stacjach telewizji naziemnej.
        </div>
        <p/>
<label id="2m" style={{ pointerEvents: "none" }} class="mainChoice"  onClick={this.clickCinema}>
<input name="tv" type="checkbox" id="cBox" /> 
 Kino
</label>
<div style={{marginLeft: "18px", fontSize: '12px'}}>
        {/* Filmy wyświetlane dzisiaj w kinach: */}
       <div class="construction"></div> Strona w budowie 
        <br/>

<table id="cityTab" style={{display: 'none'}}>
<tbody>
<tr>
<td>        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Warszawa
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Gdańsk
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Łódź
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Rzeszów
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Białystok
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Kielce
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Olsztyn
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Poznań
        </label>

        </td>
        <td>    <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Kraków
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Wrocław
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Katowice
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Szczecin
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Bydgoszcz
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Toruń
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Lublin
        </label>
        <br/>
        <label id="1c" class="cityCinema"  onClick={this.cityCinema}>
                <input name="tv" type="checkbox" id="1cc" /> 
        Opole
        </label>
        
        </td>
</tr>
</tbody>
</table>

        </div>
<p/>
<button id="bM" class= "filmButttonEnabled" onClick={this.showMovies}>POKA<span style={{ fontSize: 14 }}>&#380;</span> FILMY</button>
<br/>
</div>
            </div>
            <div id="series" class="switch"> <i class="icon-video" />Seriale 
            <div id="seriesField"><div class="construction"></div> Strona w budowie</div>
            </div>
            
            <div id="book" class=  {this.InBooks()? "activeSwitch": "switch"}> <i class="icon-book" />Literatura 
            
            <div id="bookField">
<div class="headHeader">Okładki pozycji książkowych:</div>
{/* <div id="infoLink">&#9432;info
                <div id="info">
                      Bestsellery z najlepszych księgarni
                        </div>
                </div> */}
<p/>
<label id="1b"  class="mainChoice" onClick={this.clickBestsellers} > 
<input name="book" type="checkbox" id="bookBox" />                     
Bestsellery
</label>
<br/>
<div  id="infoLink">&#9432;info
                <div id="info">
        <span style={{color: "white"}}>Wizualizacja aktualnych bestsellerów <br/>z 
         najpopularniejszych księgarni internetowych.</span><br/>
        Wielkości ikon reprezentujących okładki uzależnione są od ilości księgarni 
        <br/> w których dana pozycja występuje na liście bestsellerów.
        {letsLogin}
                        </div>
                </div> 
                {infoArrowBest}
        <br/>
<button id="bB" class= "bookButttonEnabled" onClick={this.showBooks}>POKA<span style={{ fontSize: 14 }}>&#380;</span> KSIĄ<span style={{ fontSize: 14 }}>&#380;</span>KI</button>
<br/>
</div>
            
            
            
            </div>
            
            <div id="events" class="switch">  <i class="icon-calendar-empty"/>Wydarzenia
            <div id="eventsField"> <div class="construction"></div> Strona w budowie  </div>
             </div>
             {adminCheck}
             {onlyErrorsCheck}
             {adminHeader}
            {screenSwitch}
           {userHeader}
        </div>
        )

return (
          <div className="container">
              
            <div id="allLive" className="header">
                <div className="main" onClick={this.Main} >Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch</div>

                {mainMenu}
                {infoForSmall}
                {cookieInfo}
           
               
                <Switch>
                    {/* <Route path={'/'} exact component={First} /> */}

                    
                            {first}
                            {books}
                            {songs}
                            {movies}
                            {policy}
                            {contact}
                            {information}
                            {userDesktop}
                            {userFolder}
                            {moviesAdmin}
                            {songsAdmin}
                            {adminPanel}
                            {bestAdmin}
                            
                           
                            
                       {/*  <Route path={'/songs'} component={(props) => (
                            <YTArea {...props} fetchData={this.state.takeDataFrom} />
                        )} /> */}
                    

                {/* <Route path={'/youtubeid/:YT?'} exact component={(props) => (
                        <Field {...props} play={this.props.match.params.id} />
                    )} /> */}
                </Switch>

            </div>
            <div  className = {this.props.match.params.id? "footer" : "mainFooter"}>
            <div onClick={this.openLink} id={PATHES.contact} class="switchFooter">Kontakt</div>
            <div onClick={this.openLink} id={PATHES.policy} class="switchFooter">Polityka prywatności</div>
            <div onClick={this.openLink} id={PATHES.information} class="switchFooter">Dodatkowe informacje</div>
            </div>
           
            </div>
        )

    }

}

//// IF I WANT PASS DATA TO ROUTE WITH ID IN PATH:
{/* <Route path={'/songs:fd?'} render={(props) => (
  <Songs {...props} fetchData={this.state.takeDataFrom} /> */}


  const mapStateToProps = state => {
   
    
    return {
        isAuthenticated: state.auth.jwttoken !== null,
      
        jwtToken: state.auth.jwttoken,
        userName: state.auth.userName,
        isAdmin: state.auth.userRole == "ADMIN",
        //userId: state.auth.userId,
        imageUrl: state.auth.imageUrl
    };
};

const mapDispatchToProps = dispatch => {
    return {
        SocialLog: (userId, userName, imageUrl, token, userRole, userNick) => 
        dispatch(authLogin(userId, userName, imageUrl, token, userRole, userNick)),
        //FacebookLog: ( userName, imageUrl, token) => dispatch(authLogin(userName, imageUrl, token)),
        escManage: () => dispatch(escManage()),
        Logout: () => dispatch(authLogout()),
        serverAlert: (message) => dispatch(showServerPopup(message)),
        screenManage: () => dispatch(manageScreen()),
    };
};

  export default connect(mapStateToProps, mapDispatchToProps)(Header);