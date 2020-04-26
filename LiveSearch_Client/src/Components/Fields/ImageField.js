
import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class ImageField extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showBig: false
           
        }
    }

    openSourceSmall = (event) => {
        window.open(this.props.source);
        event.stopPropagation();
    }

    openSourceBig = (event) => {
        window.open(this.props.source);
        event.stopPropagation();
    }

    showBig = () => {
        this.setState({showBig: true});
    }

    hideBig = () => {
        this.setState({showBig: false});
    }



    render() {
 
        let loading = (<div className="field"><div class="lds-ellipsis"><div></div><div></div><div></div></div></div>);
        let actualization = (<div className="fieldAct">Trwa atualizacja bazy danych.<br/>
        Proszę spróbować ponownie za chwilę.
        </div>)
        let bigImage = this.state.showBig? (<div className ="imageFieldZoom" onClick={this.hideBig}>   
         <div id="bigimgSource"  onClick={this.openSourceBig}>{this.props.sourceShow}</div>  
          <img className = "imageFieldZoom" src={this.props.src} >
             
                </img></div>)
                        : "";
        
    let field = (
            <div>

                <div className="imageField" onClick = {this.showBig}>
                <div id="imgSource"  onClick={this.openSourceSmall}>{this.props.sourceShow}</div>
                
                <img 
                   class="imgField"
                  title={this.props.title} 
                  src={this.props.src}></img> 
                  
                </div>
                <div className="imgGlass" style={{ opacity: 0.5 , filter: 'blur(2px)' }} id={this.props.player}>
               <img 
                   class="imgField"
                  title={this.props.title} 
                  src={this.props.src}></img>
                </div>
                <div className="background">
                </div>
                <div className="blur">
                </div>
          
          {bigImage}
                
            </div>
        );
        if(this.props.show) {
            if(!this.props.fromDesktop && this.props.noIcons) {
                return actualization;
            }
            return field;   
        }
        else {
            return loading;
        }
    }
}

export default withRouter(ImageField);