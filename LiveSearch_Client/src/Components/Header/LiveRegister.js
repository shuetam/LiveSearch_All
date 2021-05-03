import React, { Component } from 'react';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';
import { URL, PATHES } from '../../environment';
import ServerPopup from '../Popup/ServerPopup';
import {authLogin, showServerPopup} from '../../Store/Actions/auth';
import { connect } from 'react-redux';
import { hideLiveSearchLogin} from '../../CommonManager';
import ReCAPTCHA from "react-google-recaptcha";

class LiveRegister extends Component {

    constructor(props) {
        super(props);

        this.state = {  
            showRegister: false,
            wrongEmail: false,
            wrongLogin: false,
            resetPassword: false,
            loading: false,
            emailRegister: "",
            passwordRegister: "",
            passwordRegister1: "",
            emailLogin: "",
            passwordLogin: "",
            wrongPassword: false,
            wrongPassword1: false,
            emailSended: false,
            authConfig: {
                headers: {Authorization: "Bearer " + this.props.jwtToken}
            },
            captchaToken: ""
        }
    }

    showLogin = () => {
        this.setState({showRegister: false});
        this.setState({ 
            wrongEmail: false,
            wrongLogin: false,
            wrongPassword: false,
            wrongPassword1: false,
            loading: false,
            emailSended: false,
            emailRegister: "",
            passwordRegister: "",
            passwordRegister1: "",
            emailLogin: "",
            passwordLogin: ""});
    }

    showRegister = () => {
       this.setState({showRegister: true});
       this.setState({ 
        wrongEmail: false,
        wrongLogin: false,
        wrongPassword: false,
            wrongPassword1: false,
        loading: false,
        emailSended: false,
        emailRegister: "",
        passwordRegister: "",
        passwordRegister1: "",
        emailLogin: "",
        passwordLogin: ""});
    }

    hideLiveLogin = () => {
        this.setState({ showRegister: false,
            wrongEmail: false,
            wrongLogin: false,
            resetPassword: false,
            wrongPassword: false,
            wrongPassword1: false,
            loading: false,
            emailSended: false,
            emailRegister: "",
            passwordRegister: "",
            passwordRegister1: "",
            emailLogin: "",
            passwordLogin: ""});
        hideLiveSearchLogin();
    }


    liveRegister = (email, password) => {
            const data = {
                Email: email,
                Password: password,
                CaptchaToken: this.state.captchaToken
            };
            var image = ""
           
            axios.post(URL.api+URL.registerUser, data)
            .then(response => {
             
                if(response.data == "error") {
                    this.Alert("Wystąpił błąd przy próbie zarejestrowania.");
                    this.setState({loading: false});
                    return false;
                }
                if(response.data == "captcha") {
                    this.Alert("Błąd weryfikacji Captcha.");
                    this.setState({loading: false});
                    return false;
                }
                if(response.data.email == "exists")
                {
                    this.Alert("Konto powiązane z wpisanym adresem email istnieje już w systemie.");
                    this.setState({loading: false});
                  return false;
                }
                    
                this.props.SocialLog(response.data.userId, response.data.userName, image, response.data.jwtToken, response.data.role, response.data.userNick);
              
                hideLiveSearchLogin();
                this.setState({loading: false});
                window.location.replace("/pulpit");
                
            }).catch(error => { this.Alert("Wystąpił błąd przy próbie zarejestrowania.");
            this.setState({loading: false});
           
        });
        }


        userReset = () => {
            if(this.props.isAuthenticated) {
                axios.post(URL.api + URL.getuseremail, null, this.state.authConfig)
                .then((result) => {console.log(result.data );
                    this.liveReset(result.data)})
                
                .catch(error => {console.log(error); 
                    this.Alert("Wystąpił błąd. Spróbuj ponownie później.")});
                }
        }


        liveReset = (login) => {

            const data = {
                Email: login,
                Password: this.state.passwordRegister
            };
            var image = ""
           
            axios.post(URL.api+URL.resetPassword, data)
            .then(response => {
             
                if(response.data == "error") {
                    this.Alert("Wystąpił błąd przy próbie resetu hasła. Spróbuj ponownie za chwile");
                    this.setState({loading: false});
                    return false;
                }
                if(response.data == "notexists")
                {
                    this.Alert("Wpisany adres email nie został znaleziony w systemie.");
                    this.setState({loading: false});
                  return false;
                }
                if(response.data == "emailerror")
                {
                    this.Alert("Wystąpił błąd przy próbie resetu hasła. Spróbuj ponownie za chwile");
                    this.setState({loading: false});
                  return false;
                }
                    
                //this.props.SocialLog(response.data.userId, response.data.userName, image, response.data.jwtToken, response.data.role, response.data.userNick);
              
                //hideLiveSearchLogin();
                this.setState({loading: false});
                this.setState({emailSended: true});
                //window.location.replace("/pulpit");
                
            }).catch(error => { this.Alert("Wystąpił błąd przy próbie resetu hasła.");
            this.setState({loading: false});
           
        });
        }



        liveLogin = (email, password) => {
            const data = {
                Email: email,
                Password: password
            };
            var image = "";
           
            axios.post(URL.api+URL.loginUser, data)
            .then(response => {
             
                if(response.data == "loginFalse")
                { 
                    this.setState({wrongLogin: true});
                    this.setState({loading: false});
                  return false;
                }
                    
                this.props.SocialLog(response.data.userId, response.data.userName, image, response.data.jwtToken, response.data.role, response.data.userNick);
              
                hideLiveSearchLogin();
                this.setState({loading: false});
                window.location.replace("/pulpit");
                
            }).catch(error => { this.Alert("Wystąpił błąd przy próbie zalogowania.");
            this.setState({loading: false});
           
        });
        }



        setEmailRegister = (e) => {
            this.setState({emailRegister: e.target.value})
        }

        setPasswordReg = (e) => {
            this.setState({passwordRegister: e.target.value})
        }

        setPasswordReg1 = (e) => {
            this.setState({passwordRegister1: e.target.value})
        }

        setEmailLogin = (e) => {
            this.setState({emailLogin: e.target.value})
        }

        setPasswordLogin = (e) => {
            this.setState({passwordLogin: e.target.value})
        }

        passwordReset = () => {
            this.setState({resetPassword: true});
            this.setState({ 
                wrongEmail: false,
                wrongLogin: false,
                wrongPassword: false,
                wrongPassword1: false,
                emailSended: false,
                loading: false,
                emailRegister: "",
                passwordRegister: "",
                passwordRegister1: "",
                emailLogin: "",
                passwordLogin: ""});
        }


    liveSearchRegister = () => {
        this.setState({wrongEmail: false});
        this.setState({wrongPassword: false});
        this.setState({wrongPassword1: false})
        var login = this.state.emailRegister;
        var password = this.state.passwordRegister;
        var password1 = this.state.passwordRegister1;
        
        const emailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email = emailValid.test(String(login).toLowerCase());

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;
        var passwordLen = passwordRegex.test(password);
        var theSame = password === password1;

        if(!this.props.isAuthenticated) {
            this.setState({wrongEmail: !email})
        }
        else {
            email = true;
        }

        this.setState({wrongPassword: !passwordLen})

        if(passwordLen) {
            this.setState({wrongPassword1: !theSame})
        }

           if(email && passwordLen && theSame) {
               this.setState({loading: true});
             if(this.state.resetPassword || this.props.isAuthenticated) {
                 if(this.props.isAuthenticated) {
                    this.userReset();
                 }
                 else {

                     this.liveReset(login);
                 }
             }
             else {
                 this.liveRegister(login, password);
                }

           }
           
    }

    liveSearchLogin = () => {
        this.setState({wrongLogin: false});
        var login = this.state.emailLogin;
        var password = this.state.passwordLogin;
        
        const emailValid = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var email = emailValid.test(String(login).toLowerCase());
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;

        var passwordLen = passwordRegex.test(password);
       
        this.setState({wrongLogin: !email || !passwordLen});

           if(email && passwordLen) {
               this.setState({loading: true});
            this.liveLogin(login, password);
           }
    }


    onKeyLogin = (event) => {
      
        if(event.key == "Enter") {
            this.liveSearchLogin();
        }
    }

    onKeyRegister = (event) => {
      
        if(event.key == "Enter") {
            this.liveSearchRegister();
        }
    }

    onCaptchaChange = (value) => {
        this.setState({captchaToken: value});
    }

    Alert = (message) => {
        this.props.serverAlert(message);
    }

    render() {
 let wrongEmail = this.state.wrongEmail? <div class="wrongRegister"> Wpisz prowidłowy adres email </div>  : "";
 let wrongPassword = this.state.wrongPassword? <div class="wrongRegister"> Hasło powinno zawierać od 6 do 20 znaków<br/> w tym conajmniej jedną wielką literę oraz jedną cyfrę. </div>  : "";
 let wrongPassword1 = this.state.wrongPassword1? <div class="wrongRegister"> Niezgodność haseł </div>  : "";
 let wrongLogin = this.state.wrongLogin? <div class="wrongRegister"> Nieprawidłowy adres email lub hasło </div>  : "";
let emailInfo = this.state.emailSended? <div class="wrongRegister" style={{color: 'green'}}> Na podany adres email został wysłany link resetujący <br/>hasło, będzie on aktywny przez 24 godziny. </div>  : "";

 let disable = <div class="disableRegister" onClick={this.hideLiveLogin}>&#43;</div>

 let captchaCheck = <div class="captchaDiv"> <ReCAPTCHA
 sitekey="6LefE8MaAAAAAIDJsCtx-cwqKQEqXnIDFGOfo4YY"
 onChange={this.onCaptchaChange}
 theme = "dark"
 size="compact"/>
</div>

 let registerInputs = <div id="registerInputs"> 

<input id="emailRegister" onChange={this.setEmailRegister} value={this.state.emailRegister}  onKeyPress = {this.onKeyRegister}  placeholder="Adres email" class="registerInput" type="email" />
{wrongEmail}
<p/>
<input id="passwordRegister" onChange={this.setPasswordReg} value={this.state.passwordRegister}   onKeyPress = {this.onKeyRegister}  placeholder="Utwórz hasło" class="registerInput" type="password" autocomplete="new-password"/>
<p/>
 <input id="passwordRegister1" onChange={this.setPasswordReg1} value={this.state.passwordRegister1}   onKeyPress = {this.onKeyRegister}  placeholder="Powtórz hasło" class="registerInput" type="password" autocomplete="new-password"/>
{wrongPassword1}
{wrongPassword}
<p/> 
{captchaCheck}
<button class= {this.state.loading? "registerButtonEnabled " : "registerButton"}  onClick={this.liveSearchRegister}>ZAREJESTRUJ SIĘ</button>

{disable}
<label onClick={this.showLogin}> Masz już konto? Zaloguj się! </label>
</div>



let loginInputs = <div id="loginInputs"> 

<input id="emailLogin" onChange={this.setEmailLogin} value={this.state.emailLogin}  onKeyPress = {this.onKeyLogin}  placeholder="Twój adres email" class="registerInput" type="text" style={{width: "300px", marginLeft: "48px"}}/>
<p/>
<input id="passwordLogin" onChange={this.setPasswordLogin} value={this.state.passwordLogin} onKeyPress = {this.onKeyLogin}  placeholder="Twoje hasło" class="registerInput" type="password" style={{width: "300px", marginLeft: "48px"}}/>
<br/>

<label style={{fontSize: "11px", position: 'absolute', left:'15px', top:'97px'}} onClick={this.passwordReset}> Nie pamiętasz hasła? </label>
<p/>
<button class= {this.state.loading? "registerButtonEnabled " : "registerButton"}onClick={this.liveSearchLogin}>ZALOGUJ SIĘ</button>

{disable}

<label style={{fontSize: "15px"}} onClick={this.showRegister} > Nie masz jeszcze konta? <span style={{textDecoration: "underline"}}>Zarejestruj się!</span> </label>
{wrongLogin}
</div>

let emailSet = this.props.isAuthenticated? "" : <input id="emailRegister"  onChange={this.setEmailRegister} value={this.state.emailRegister}  onKeyPress = {this.onKeyRegister}  placeholder="Twój adres email użyty przy rejestracji" class="registerInput" type="email" style={{width: "300px", marginLeft: "48px"}}/>


let reset = <div id="registerInputs"> 

{emailSet}
{wrongEmail}
<p/>
<input id="passwordRegister" onChange={this.setPasswordReg} value={this.state.passwordRegister}   onKeyPress = {this.onKeyRegister}  placeholder="Utwórz nowe hasło" class="registerInput" type="password" autocomplete="new-password" style={{width: "300px", marginLeft: "48px"}}/>
<p/>
 <input id="passwordRegister1" onChange={this.setPasswordReg1} value={this.state.passwordRegister1}   onKeyPress = {this.onKeyRegister}  placeholder="Powtórz nowe hasło" class="registerInput" type="password" autocomplete="new-password" style={{width: "300px", marginLeft: "48px"}}/>
{wrongPassword1}
{wrongPassword}
{emailInfo}
<p/> 

<button class= {this.state.loading? "registerButtonEnabled " : "registerButton"}  onClick={this.liveSearchRegister}>WYŚLIJ LINK RESETUJĄCY HASŁO</button>
{disable}
</div>

if(this.state.resetPassword || this.props.isAuthenticated)
{
    return reset;
}

    return this.state.showRegister?  registerInputs : loginInputs;   


    }
}

const mapStateToProps = state => {
   
    
    return {
        isAuthenticated: state.auth.jwttoken !== null,
        jwtToken: state.auth.jwttoken
    };
};

const mapDispatchToProps = dispatch => {
    return {
        SocialLog: (userId, userName, imageUrl, token, userRole, userNick) => 
        dispatch(authLogin(userId, userName, imageUrl, token, userRole, userNick)),
        serverAlert: (message) => dispatch(showServerPopup(message)),
    
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LiveRegister);
