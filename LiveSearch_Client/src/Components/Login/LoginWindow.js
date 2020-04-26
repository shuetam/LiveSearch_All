import React, { Component } from 'react';
import { Link, Route, NavLink, withRouter } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';


class LoginWindow extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {

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
                    
                    this.props.SocialLog(response.data.userId, name, image, response.data.jwtToken, response.data.role);
                }
            }).catch(error => { this.Alert("Wystąpił błąd przy próbie zalogowania.")});
        }
        else {
            this.Alert("Musisz udostępnić swój adres email aby móc się zarejestrować.");
        }
        
        }



    responseGoogle = (response) => {
        debugger;
        if(!this.props.isAuthenticated) {
        
            this.socialLogin(response.profileObj.name, response.profileObj.email, response.profileObj.imageUrl, "G_"+response.tokenId);
         
        }

    }

    responseFacebook  = (response) => {

       if(!this.props.isAuthenticated) {
      
           this.socialLogin(response.name, response.email, response.picture.data.url, "F_"+response.accessToken);
        }
    } 
    

    render() {

        return (
        <div>
         
        </div>
                  
        )
    }
}



const mapStateToProps = state => {
   //debugger;
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
        SocialLog: (userId, userName, imageUrl, token, userRole) => 
        dispatch(authLogin(userId, userName, imageUrl, token, userRole)),
        serverAlert: (message) => dispatch(showServerPopup(message)),
    };
};


export default connect(mapStateToProps, mapDispatchToProps)(ServerPopup);