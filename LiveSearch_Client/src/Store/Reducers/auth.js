import { updateStore } from '../updateStore';
import { connect } from 'react-redux';
import axios from 'axios';

const initialState = {
    jwttoken: null,
   // userId: null,
    error: null,
    showPopup: false,
    showServerPopup: false,
    dataToSend: null,
    entityToChange: null,
    serverMessage: "",
    addingIcon: null,
    removingIconId: null,
    fullScreen: false,
    firstField: false
};

const  manageEsc = (state, action) => {
    
}


const manageScreen = (state, action) => {

    var elem = document.documentElement;
    

    if((window.fullScreen) ||
    (window.innerWidth == window.screen.width && window.innerHeight == window.screen.height)) {
        //this.setState({fullScreen: false});
        if (document.exitFullscreen) {
            document.exitFullscreen()
            .then(() => console.log("Document Exited form exit Full screen mode"))
            .catch((err) => console.error(err));
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE/Edge */
            document.msExitFullscreen();
        }

       /*  exitFullscreen
        mozCancelFullScreen
        webkitExitFullscreen
        msExitFullscreen */

        return updateStore( state, { 
           // fullScreen: false
        } ); 
    }
    else {
        //this.setState({fullScreen: true});
        if (elem.requestFullscreen) {
            elem.requestFullscreen()
            .then(() => console.log("Document Exited form Full screen mode"))
            .catch((err) => console.error(err));
        } else if (elem.mozRequestFullScreen) { /* Firefox */
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { /* IE/Edge */
            elem.msRequestFullscreen();
        }
        return updateStore( state, { 
           // fullScreen: true
        } ); 
    }
}


const removingIcon = (state, action) => {
    return updateStore( state, { 
        removingIconId: action.id,
     } ); 
}

const iconAdding = (state, action) => {
    // debugger;
     return updateStore( state, { 
        addingIcon: action.data,
     } ); 
 };

 const stopIconAdding = (state, action) => {
    // debugger;
     return updateStore( state, { 
        addingIcon: null,
     } ); 
 };

 const showFirst = (state, action) => {
     debugger;
     return updateStore( state, { 
        firstField: action.data,
     } ); 
 };
 

 const hideLogin = (state, action) => {
    // debugger;
     return updateStore( state, { 
        showLoginWindow: false,
     } ); 
 };


 const stopRemoving = (state, action) => {
    // debugger;
     return updateStore( state, { 
        removingIconId: null,
     } ); 
 };


const managePopup = (state, action) => {
   // debugger;
    return updateStore( state, { 
        showPopup: true,
        dataToSend: action.data,
        entityToChange: action.entity,

    } ); 
};

const showServerPopup = (state, action) => {
     //debugger;
     return updateStore( state, { 
         showServerPopup: true,
         serverMessage: action.message
     }); 
 };

const hideServerPopup = (state, action) => {
    // debugger;
     return updateStore( state, { 
         showServerPopup: false
     } ); 
 };

const hidePopup = (state, action) => {
   // debugger;
    return updateStore( state, { 
        showPopup: false
    } ); 
};


const authLogin = (state, action) => {
    //this.props.GetUserIconsID(action.userId);
    return updateStore( state, { 
        jwttoken: action.token,
        userId: action.userId,
        userName: action.userName,
        imageUrl: action.imageUrl,
        userRole: action.userRole,
        userNick: action.userNick,
        error: null,
    } );      
    //debugger;
};

const authFacebook = (state, action) => {
    return updateStore( state, { 
        token: action.idToken,
        userId: action.facebookId, 
        error: null,
     } );
};

const authError = (state, action) => {
    return updateStore( state, {
        error: action.error,
    });
};

const authLogout = (state, action) => {
    return updateStore(state, { jwttoken: null, userId: null });
};


const reducer = ( state = initialState, action ) => {
    switch ( action.type ) {
        case ('AUTH_LOGIN'): return authLogin(state, action);
        //case ('AUTH_FACEBOOK'): return authFacebook(state, action);
        case ('AUTH_LOGOUT'): return authLogout(state, action);
        case ('AUTH_ERROR'): return authError(state, action);
        case ('POPUP'): return managePopup(state, action);
        case ('FOR_SURE'): return hidePopup(state, action);
        case ('SERVER_POPUP'): return hideServerPopup(state, action);
        case ('SHOW_SERVER_POPUP'): return showServerPopup(state, action);
        case ('ADDING'): return iconAdding(state, action);
        case ('STOP_ADDING'): return stopIconAdding(state, action);
        case ('REMOVING'): return removingIcon(state, action);
        case ('STOP_REMOVING'): return stopRemoving(state, action);
        case ('SCREEN'): return manageScreen(state, action);
        case ('ESC_MANAGE'): return manageEsc(state, action);
       // case ('LOGIN_MANAGE'): return showLogin(state, action);
        case ('FIRST_SHOW'): return showFirst(state, action);
        
        default:
            return state;
    }
};

//export default connect( null, mapDispatchToProps )(reducer);

export default reducer;