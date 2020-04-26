
import React, { Component } from 'react';
import './Style.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class Contact extends Component {

    constructor(props) {
        super(props);

        this.state = {  
        }
    }

    goTo = (event) => {
        window.open(event.target.id);
       
    }

    render() {
 
        let contact = (<div style={{textAlign: "center"}}  className="mainContent">
        <p>
        Portal <span style={{ color: "rgba(231, 173, 64, 0.637)" }}>Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch</span> jest wciąż w budowie. Systematycznie udoskonalamy aktualne funkcje i wprowadzamy nowe.</p>
        <p>Jesteśmy otwarci na Wasze sugestie, uwagi oraz propozycje, które prosimy kierować pod adres:</p>
        <p>
        admin@
       <span style={{ color: "rgba(231, 173, 64, 0.637)" }}>Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch</span>.pl
        </p>
        </div>)


            return contact;   


    }
}

export default withRouter(Contact);