import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class LoadingField extends Component {

    constructor(props) {
        super(props);

        this.state = {
           
        }
    }


    render() {
 
        let loading = (<div className="field"><div class="lds-ellipsis"><div></div><div></div><div></div></div></div>);

      
            return loading;
     
    }
}

export default withRouter(LoadingField);