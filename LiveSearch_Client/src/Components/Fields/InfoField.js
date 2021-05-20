
import React, { Component } from 'react';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class InfoField extends Component {

    constructor(props) {
        super(props);

        this.state = {  
        }
    }

    render() {

 
    let field = this.props.fromFolder?
    (<div class="fieldAct"><span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz jeszcze ikon w tym folderze.</span><p/>
        Upuść nad folderem wybrane ikony na pulpicie głównym
        <br/>lub użyj funkcji powyżej aby utworzyć nowe ikony.
        </div>)
    :
    (<div class="fieldAct">
    <span style={{fontSize: "25px", color: "rgba(255, 255, 255, 0.801)"}}>Twój pulpit</span>
    <p/>
    <span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz jeszcze ikon na głównym pulpicie.</span><p/>
        Naciśnij <span class="addIconInfo">&#43;
        </span> przy wybranej ikonie lub stwórz własne ikony używając funkcji powyżej.
        <div> W celu usunięcia ikony z pulpitu naciśnij przy niej <div class="removeEntityInfo">&#43;</div>. 
        <br/>Ikony znajdujące się już na Twoim pulpicie mogą być z niego usuwane również z poziomu publicznych pulpitów.
<br/>Wszelkie dodatkowe informacje znajdziesz pod znakami &#9432;info oraz w dziale "Informacje i pomoc".
         </div>
        </div>)
        ;

        if(this.props.show && !this.props.addingIcon) {
            return field;   
        }
        else {
            return "";
        }

    }
}

export default withRouter(InfoField);