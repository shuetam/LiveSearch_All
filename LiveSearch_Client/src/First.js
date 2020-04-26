
import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import {manageScreen} from './Store/Actions/auth';
import { connect } from 'react-redux';


class First extends Component {

    state = {
        topFirst: '115px',
        topGlass: '565px',
        fullScreen: false,
        responsive: false
    }


    animated = () => {
        setTimeout(() => {
         
            this.setState({
                topFirst: '315px', topGlass: '365px'
            })
        }, 1000)
    }
    
    screenManage = () => {
        this.props.screenManage();
    }


    componentDidMount() {

        this.animated();
        //window.addEventListener('resize', this.liveResponsive);
    }

    //liveResponsive = () => {
        //this.Alert(window.innerWidth + "");
       // if(window.innerWidth < 760) {
            // this.setState({responsive: true});
       // }
       // else {
        // this.setState({responsive: false});
       // }
    // }

    render() {


        return (
            <div>
{/* <div onClick = {this.screenManage} class="fullScreen"><i 
class={this.props.fullScreen? "icon-resize-small-alt" : "icon-resize-full-alt"}/>


<div>{!this.props.fullScreen? "Aktywuj pełny ekran" : ""}</div></div> */}


                <div style={{ top: this.state.topFirst }} className="First">Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch</div>

{/* <div className="glassMain" style={{ top: "40px" }}>
   <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fevents%2F399159534066838%2F&tabs=timeline&width=500&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=false&appId=2395943984012670" width="500" height="500" style={{border:'none', zIndex: "400", overflow: 'auto'}} scrolling="no" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
  </div>  */}         

                <div className="glassMain" style={{ top: this.state.topGlass }}>
                    <div>Live<span style={{ color: "rgba(255, 255, 255, 0.5)" }}>S</span>earch</div>
                </div>
                <div className="blurMain">
                </div>

            </div>
        )


    }
}

const mapStateToProps = state => {
   
    return {
        fullScreen: state.auth.fullScreen,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        screenManage: () => dispatch(manageScreen()),

    };
};

  export default connect( mapStateToProps, mapDispatchToProps )(First);