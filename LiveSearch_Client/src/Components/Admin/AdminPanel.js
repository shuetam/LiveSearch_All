import React, { Component } from 'react';
import { Link, Route, NavLink } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from '../../axios-song';
import { connect } from 'react-redux';
import {showServerPopup, manageScreen} from '../../Store/Actions/auth';
import {URL} from '../../environment'
import './AdminStyles.css';



class AdminPanel extends Component {

    constructor(props) {
        super(props);

        this.state = {
            updateInfo: {


            },
            users: [],
            authConfig: {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            },
         }
        }


        componentDidMount() {
            axios.post(URL.api+URL.getallusers, null, this.state.authConfig)
            .then((result) => 
                this.setState({ users: result.data }))
                .catch(() => {this.Alert("Coś nie tak z pobraniem userów"); })
        
                axios.post(URL.api+URL.getUpdateInfo, null, this.state.authConfig)
                .then((result) => 
                {debugger;
                    this.setState({ updateInfo: result.data });})
                    .catch(() => {this.Alert("Coś nie tak z pobraniem updteInfo"); })

            }


        componentWillUpdate() {

        }
    
        Alert = (message) => {
            this.props.serverAlert(message);
        }


        SongsUpdate = () => {
            axios.post(URL.api+URL.startSongs, null, this.state.authConfig)
            .then((result) => 
            {
                this.Alert(result.data)})
                .catch(() => {this.Alert("Coś z updatem"); })
        }

        MoviesUpdate = () => {
            axios.post(URL.api+URL.startMovies, null, this.state.authConfig)
            .then((result) => 
            {
                this.Alert(result.data)})
                .catch(() => {this.Alert("Coś z updatem"); })
        }

        MoviesUpdateWYT = () => {
            axios.post(URL.api+URL.startMoviesWYT, null, this.state.authConfig)
            .then((result) => 
            {
                this.Alert(result.data)})
                .catch(() => {this.Alert("Coś z updatem"); })
        }

        BooksUpdate = () => {
            axios.post(URL.api+URL.startBooks, null, this.state.authConfig)
            .then((result) => 
            {
                this.Alert(result.data)})
                .catch(() => {this.Alert("Coś z updatem"); })
        }




getUserByEmail = (email) => {
    var user = this.state.users.find( user => user.email === email);
    return user;
}

changeUserStatus = (event) => {
    var email = event.target.id;
    var user = this.getUserByEmail(email);

/*     Email {get; set;}
    public string Token {get; set;}
    public string AuthType */

    var data = {
        Email: user.email,
        AuthType: user.authType
    }

    axios.post(URL.api+URL.changeUserStatus, data, this.state.authConfig)
    .then((result) => 
    this.Alert(result.data.email + " - " +  result.data.active))
        .catch(() => {this.Alert("Coś nie tak ze zmianą usera"); })

}


        render(props) {

            let users = this.state.users.map(user => {
       
                return (
                            
            <tr class="adminActive">
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.authType}</td>
                <td>{user.created}</td>
                <td>{user.lastLogin}</td>
                <td>{user.loginsCount}</td>
                <td>{user.iconsCount}</td>
                <td  onClick = {this.changeUserStatus} id={user.email}>   {user.active}</td>
            </tr> 
                         
                    )
                })

                return (<div className="mainContent">
                <table id="adminTable" > 
            <tr>
                  <td>  SONGS: [{this.state.updateInfo.songsCount }] [{this.state.updateInfo.songsErrors }]
                   <div>Last added: |{this.state.updateInfo.songsUpdate}|</div>
                   <div>First played: |{this.state.updateInfo.songsFirstPlayed}|</div>
                   <div>Last played: |{this.state.updateInfo.songsLastPlayed}|</div>
                   <div>Total hours: |{this.state.updateInfo.songsHours}|</div>
                   <div> |{this.state.updateInfo.songsRuning}| Next: {this.state.updateInfo.songInterval}</div>
                   <div style={{fontSize: "8px"}} onClick={this.SongsUpdate} class="switch">START UPDATING SONGS</div> </td>
                
                    <td> ALL MOVIES: [{this.state.updateInfo.tvMoviesCount}] [{this.state.updateInfo.moviesErrors }] [{this.state.updateInfo.mRating}]
                    <div>SHOWING: [{this.state.updateInfo.showingMoviesCount}] [{this.state.updateInfo.showingMoviesCountErrors }] [{this.state.updateInfo.shRating }]</div> 
                     <div>First played: |{this.state.updateInfo.moviesFirstPlayed}|</div>   
                     <div>Last played: |{this.state.updateInfo.moviesLastPlayed}|</div> 
                     <div>Total hours: |{this.state.updateInfo.moviesHours}|</div> 
                     <div> |{this.state.updateInfo.moviesRuning}|  Next: {this.state.updateInfo.movieInterval}</div>               
                     <div style={{fontSize: "8px"}} onClick={this.MoviesUpdate} class="switch">START UPDATING MOVIES</div>
                     <div style={{fontSize: "8px"}} onClick={this.MoviesUpdateWYT} class="switch">START UPDATING MOVIES WITHOUT YT</div>
                     </td>

                  <td>  BESTSELLERS: [{this.state.updateInfo.bestsellersCount}] [{this.state.updateInfo.bestsellersErrors}]
                  <div>Last added: |{this.state.updateInfo.bestsellersUpdate}|</div>
                  <div> Next: {this.state.updateInfo.bookInterval}</div>
                  <div> Bonito[{this.state.updateInfo.bonito}]
                     Aros[{this.state.updateInfo.aros}]
                     Czytam[{this.state.updateInfo.czytam}]
                     Empik[{this.state.updateInfo.empik}]
                     Gandalf[{this.state.updateInfo.gandalf}]
                     Livro[{this.state.updateInfo.livro}]
                     Profit24[{this.state.updateInfo.profit24}]  </div>
<div> |{this.state.updateInfo.booksRuning}|</div> 
                  <div style={{fontSize: "8px"}} onClick={this.BooksUpdate} class="switch">START UPDATING BOOKS</div> </td>
            </tr>  
            </table>
            <br/> 
            <br/>   
            <h3>USERS: [{this.state.users.length}]</h3>
            <table id="adminTable"> 
            <tr>
    <th>Name</th>
    <th>Email</th>
    <th>AuthType</th>
    <th>Created</th>
    <th>Last login</th>
    <th>Logins count</th>
    <th>Icons count</th>
    <th>Active</th>
  </tr>


            {users}
         
           
            </table>


                </div>);

        }


    }



    const mapDispatchToProps = dispatch => {
        return {
            serverAlert: (message) => dispatch(showServerPopup(message)),
            manageScreen: () => dispatch(manageScreen())
    
        };
    };
    
    const mapStateToProps = state => {
        
        return {
            isAuthenticated: state.auth.jwttoken !== null,
            isAdmin: state.auth.userRole == "ADMIN",
            jwtToken: state.auth.jwttoken,
           
        };
    };
    
    export default connect(mapStateToProps, mapDispatchToProps)(AdminPanel);