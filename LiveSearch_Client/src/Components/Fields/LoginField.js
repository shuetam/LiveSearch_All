import React, { Component } from 'react';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class LoginField extends Component {

    constructor(props) {
        super(props);

        this.state = {  
        }
    }

    render() {
 
    let field = 
    (<div class="fieldAct"><span style={{fontSize: "20px", color: "rgba(255, 255, 255, 0.801)"}}>
    </span><p/>
    <div style={{marginLeft: "20px"}}>
       Zaloguj się aby przeglądać swój pulpit i dodawać do niego nowe ikony
       </div>
        </div>)

        return field;   


    }
}

export default withRouter(LoginField);