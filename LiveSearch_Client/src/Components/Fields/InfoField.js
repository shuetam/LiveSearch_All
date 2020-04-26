
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
    (<div class="fieldAct"><span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz ikon w tym folderze.</span><p/>
        Upuść nad folderem wybrane ikony na pulpicie głównym
        <br/>lub naciśnij <span  class="addOwn" > &#43; </span>
        w prawym dolnym rogu ekranu aby dodać nowe ikony.
        </div>)
    :
    (<div class="fieldAct">
    <span style={{fontSize: "25px", color: "rgba(255, 255, 255, 0.801)"}}>Twój pulpit</span>
    <p/>
    <span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>Nie posiadasz ikon na głównym pulpicie.</span><p/>
        Naciśnij <span class="addIconInfo">&#43;
        </span> przy wybranej ikonie w publicznych wizualizacjach:<br/>
        <span style={{color: "rgba(255, 255, 255, 0.801)"}}><i class="icon-popup"/>Eksploruj&nbsp;/&nbsp;<i class="icon-note"/>Muzyka&nbsp;/&nbsp;<i class="icon-video-alt"/>Film
        &nbsp;/&nbsp;<i class="icon-video"/>Seriale&nbsp;/&nbsp;<i class="icon-book"/>Literatura 
        &nbsp;/&nbsp;<i class="icon-calendar-empty"/>Wydarzenia</span>
        <br/>lub <span  class="addOwn" > &#43; </span>
        w prawym dolnym rogu ekranu, aby dodać nowe ikony.
        <div> W celu usunięcia ikony z pulpitu naciśnij przy niej <div class="removeEntityInfo">&#43;</div>. 
        Ikony znajdujące się już na Twoim pulpicie mogą być z niego usuwane również z poziomu publicznych wizualizacji.

         </div>
        </div>)
        ;

        if(this.props.show) {
            return field;   
        }
        else {
            return "";
        }

    }
}

export default withRouter(InfoField);