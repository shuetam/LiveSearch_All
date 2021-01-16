import React, { Component } from 'react';
import { connect } from 'react-redux';
import './App.css';
import Header from './Components/Header/Header';
import Field from './Components/Fields/Field';
import YTArea from './Components/Areas/YTArea';
import { Route } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import Switch from 'react-router-dom/Switch';
import {authCheckState, checkSizeFactor} from './Store/Actions/auth';
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
import Popup from './Components/Popup/Popup';
import ServerPopup from './Components/Popup/ServerPopup';

//import {scrollU, scrollD} from './Store/Actions/scroll';


class App extends Component {

    componentWillMount () {

        document.title = "LiveSearch";
        this.props.onTryAutoSignup(); 
        this.props.checkSizeFactor();
    }
       
 
    render() {
       
        return (
            <BrowserRouter>
                <div>
                
                    <Route path={'/:id?/:id1?/:id2?'} component={Header} />
                    <Popup/>
                    <ServerPopup/>
               
                </div>
            </BrowserRouter>
        );
    }
}


  
  const mapDispatchToProps = dispatch => {
    return {
      onTryAutoSignup: () => dispatch(authCheckState() ),
      checkSizeFactor: () => dispatch(checkSizeFactor())
    };
  };

  export default  connect( null, mapDispatchToProps )( App );