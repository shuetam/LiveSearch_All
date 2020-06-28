
import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';
import YouTube from 'react-youtube';
import ReactScrollWheelHandler from "react-scroll-wheel-handler";
//import {scrollU, scrollD} from '../../Store/Actions/scroll';
import InstagramEmbed from 'react-instagram-embed';

class Field extends Component {

    constructor(props) {
        super(props);

        this.state = {
            mainVideo: null,
            reflectVideo: null,
            showReflect: false,
            interval: null
        }
    }

    mainVideoOnReady = (event) => {
        this.setState({ mainVideo: event.target });
        //event.target.seekTo(0);
        event.target.playVideo();
       
    };


    reflectVideoOnReady = (event) => {
        this.setState({ reflectVideo: event.target });
        // event.target.seekTo(0);
        // event.target.playVideo();
        event.target.mute();
        console.log(this.state.mainVideo);
    };
/* 
    scrollUp = () => {
        //debugger;
        scrollU(); }

        scrollDown = () => {
            //debugger;
            scrollD(); } */
    
    syncVid = () => {
        const diff = this.state.mainVideo.getCurrentTime() - this.state.reflectVideo.getCurrentTime();
        var randomFloat = require('random-float');
        var randomInt = require('random-int');

        if ((Math.abs(diff) > 0.06)) {
            try {
                this.state.reflectVideo.seekTo(this.state.mainVideo.getCurrentTime() + randomFloat(0.1, 0.8));
            }
            catch(error) {
                clearInterval(this.state.interval);
            }

            //   console.log("Random INT = " + randomInt(1,3));
        }

        if ((Math.abs(diff) <= 0.06)) {
            console.log("diff time ----->" + (this.state.mainVideo.getCurrentTime() - this.state.reflectVideo.getCurrentTime()));
            clearInterval(this.state.interval);
            this.setState({ interval: null });
            console.log(this.state.interval);
            this.setState({ showReflect: true });
        }
        //  clearInterval(interval);
    }




    playReflect = (event) => {
        clearInterval(this.state.interval);
        this.setState({ interval: null });
        console.log("PLAY!! ...  " + Date.now());
        this.setState({ showReflect: false });
        var randomFloat = require('random-float');
        this.state.reflectVideo.playVideo();
        if(event.target) {
            this.state.reflectVideo.seekTo(event.target.getCurrentTime() + randomFloat(0.1, 0.8));
        }


        this.setState({ interval: setInterval(this.syncVid, 1000) });
    }



    pauseReflect = (event) => {
        console.log("PAUSE!!");
        var randomFloat = require('random-float');
        this.state.reflectVideo.seekTo(event.target.getCurrentTime() + randomFloat(0.1, 0.8));
        // this.setState({interval: !this.state.interval});
        //  this.state.reflectVideo.seekTo(event.target.getCurrentTime());
        this.setState({ showReflect: false });
        clearInterval(this.state.interval);
        this.setState({ interval: null });
        // this.intervalN = null;
        this.state.reflectVideo.pauseVideo();
    }

    onChange = (event) => {
        console.log("CHANGE STATUS!!!")
    }

    render() {
        // 1,77 must be
        const opts = {
            height: '315',
            width: '560',
            playerVars: { // https://developers.google.com/youtube/player_parameters
                autoplay: 1,
                controls: 1,
                iv_load_policy: 3
            }
        };
        let loading = (<div className="field"><div class="lds-ellipsis"><div></div><div></div><div></div></div></div>);

        let actualization = (<div className="fieldAct">Trwa atualizacja bazy danych.<br/>
        Proszę spróbować ponownie za chwilę.
        </div>)

        let  noIconsFound = (<div className="fieldAct"><br/>
         Nie znaleziono żadnych ikon pasujacych do wpisanego wyrażenia.
        </div>)

        let field = (
            <div>

                <div className="field">
                
                    <YouTube id="main"
                        videoId={this.props.play}
                        opts={opts}
                        onReady={this.mainVideoOnReady}
                        onPlay={this.playReflect}
                        onPause={this.pauseReflect}
                        onStateChange={this.onChange}
                        onEnd={this.props.nextSong}
                    />
                </div>
                <div className="glass" style={{ opacity: this.state.showReflect ? 0.7 : 0.4, filter: this.state.showReflect ? 'blur(3px)' : 'blur(12px)' }} id={this.props.player}>
                    <YouTube id="reflect"
                        videoId={this.props.play}
                        opts={opts}
                        onReady={this.reflectVideoOnReady}
                    />
                </div>
                <div className="background">
                </div>
                <div className="blur">
                </div>
          
            </div>
        );
        if(this.props.show) {

            if(!this.props.fromDesktop && this.props.noIcons) {
                if(this.props.headerType == "explore") {
                    return noIconsFound;
                }
                return actualization;
            }
            return field;   
        }
        else {
            return "";
        }
    }
}

export default withRouter(Field);