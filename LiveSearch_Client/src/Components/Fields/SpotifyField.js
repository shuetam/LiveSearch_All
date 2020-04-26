import React, { Component } from 'react';
import axios from 'axios';
import './Field.css';
import { Route, NavLink, Switch, withRouter } from 'react-router-dom';


class SpotifyField extends Component {

    constructor(props) {
        super(props);

        this.state = {
           
           
        }
    }

    /* <iframe src="https://open.spotify.com/embed/track/4w8niZpiMy6qz1mntFA5uM" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

<iframe src="https://open.spotify.com/embed/artist/540vIaP2JwjQb9dm3aArA4" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

<iframe src="https://open.spotify.com/embed/album/3CrpfLi8E2VWFf7ZLjgpNt" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

<iframe src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
 */
    

    render() {
 
        let loading = (<div className="field"><div class="lds-ellipsis"><div></div><div></div><div></div></div></div>);
        let actualization = (<div className="fieldAct">Trwa atualizacja bazy danych.<br/>
        Proszę spróbować ponownie za chwilę.
        </div>)
      
        
      //background-image: url("https://i.scdn.co/image/ab67706f000000026fb114f0e9ebb89e8c48d629");

    let field = (
            <div>

                <div className="imageField">
              
                
                <iframe src={this.props.id}  width="300" height="315" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>

                  
                </div>
                
                
{/*                 <div className="imgGlass" style={{ opacity: 0.5 , filter: 'blur(2px)' }} id={this.props.player}>
                </div>
                <div className="background">
                </div>
                <div className="blur">
                </div> */}
          
     
                
            </div>
        );
        if(this.props.show) {
            if(!this.props.fromDesktop && this.props.noIcons) {
                return actualization;
            }
            return field;   
        }
        else {
            return "";
        }
    }
}

export default withRouter(SpotifyField);