import { useCookies } from 'react-cookie';


export const manageScreen = () => {
    return {
        type: 'SCREEN',
        
    };
    };

    export const escManage = () => {
        return {
            type: 'ESC_MANAGE',
            
        };
        };
    


export const removingIcon = (id) => {
    return {
        type: 'REMOVING',
        id: id,
    };
    };


export const addingIcon = (icon) => {
    return {
        type: 'ADDING',
        data: icon,
    };
    };

    export const stopRemovingIcon = () => {
        return {
            type: 'STOP_REMOVING',
        };
    };

    export const stopAddingIcon = () => {
        return {
            type: 'STOP_ADDING',
        };
        };


export const popup = (data, entity) => {
    return {
        type: 'POPUP',
        data: data,
        entity: entity,

    };
    };

    export const forSure = () => {
        return {
            type: 'FOR_SURE',
        };
        };


        export const hideServerPopup = () => {
            return {
                type: 'SERVER_POPUP',
            };
            };


        export const showLogin = () => {
            return {
                type: 'LOGIN_MANAGE',
            };
        };

        export const showFirst = (data) => {
            return {
                data: data,
                type: 'FIRST_SHOW',
            };
        };

        export const showServerPopup = (message) => {
                return {
                    type: 'SHOW_SERVER_POPUP',
                    message: message
                };
                };



export const login = (userName, imageUrl, token, userRole, userNick) => {
    return {
        type: 'AUTH_LOGIN',
        userRole: userRole,
        token: token,
        userName: userName,
        imageUrl: imageUrl,
        userNick: userNick
    };
    };


export const authLogout = () => {
debugger;
    //document.cookie = "user_Id" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = "JT1" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = "user_Name1=" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = "image_Url1" + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';

    //localStorage.removeItem('token');
    //localStorage.removeItem('expirationDate');
    //localStorage.removeItem('userId');
    //localStorage.removeItem('imageUrl');
    //localStorage.removeItem('userName');
    //window.location.replace("/");
return {
    type: 'AUTH_LOGOUT'
};
};

export const authError = (error) => {
return {
    type: 'AUTH_ERROR',
    error: error
};
};


export const setAuthTimeout = () => {
    return dispatch => {
        setTimeout(() => {
            dispatch(authLogout());
        }, 3000); //3600000 * 48
    };
};


export const authLogin = (userId, userName, imageUrl, token, userRole, userNick) => {
    return dispatch => {
//debugger;
       /*  const authData = {
            userId: userId,
            token: token,
            logWith: logWith
        }; */
       // debugger;
        
                /// here send data to server and if userId exists return image and name - or change
                // them if are diffrent. If new user save user with name and imageUrl and go to login action.
                
                var user = {
                    userId: userId,
                    userName: userName,
                    imageUrl: imageUrl
                };
                var exdays = 7; // sesion in days
                var d = new Date();
                //d.setTime(d.getTime() + (60 * 1000));
                d.setTime(d.getTime() + (exdays*24*60*60*1000));
                var expires = "expires="+ d.toUTCString();

                //document.cookie = "user_Id=" + userId + ";" + expires + ";path=/";
                document.cookie = "JT1=" + token + ";" + expires + ";path=/";
                document.cookie = "user_Name1=" + userName + ";" + expires + ";path=/";
                //document.cookie = "user_Nick1=" + userNick + ";" + expires + ";path=/";
                document.cookie = "image_Url1=" + imageUrl + ";" + expires + ";path=/";
                

                dispatch(login( userName, imageUrl, token, userRole, userNick));
                //document.cookie
                //const [cookies, setCookie] = useCookies(['user']);
                //setCookie('user', user, { path: '/' });
                //const expirationDate = new Date(new Date().getTime() + expires_in * 1000);
                //localStorage.setItem('token', token);
                //localStorage.setItem('expirationDate', expirationDate);
                //localStorage.setItem('userId', userId);
                //localStorage.setItem('userName', userName);
                //localStorage.setItem('imageUrl', imageUrl);
                //dispatch(setAuthTimeout());


        //let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyB5cHT6x62tTe-g27vBDIqWcwQWBSj3uiY';

/*         axios.post(url, authData)
            .then(response => {
                console.log(response);
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);
                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(err => {
                dispatch(authFail(err.response.data.error));
            }); */
    };
};

export const authCheckState = () => {
    return dispatch => {
        // get userId from cookie
        //const token = localStorage.getItem('userId');
        const jwToken = getCookie("JT1");
        //const expiresIn = localStorage.getItem('expiresIn');
       // debugger;
        if (!jwToken) {
            dispatch(authLogout());
        } //else {
           
             else {
                 //debugger;
                 //// here get only userId from cookie and send it to server to get userName and iamgeUrl
             
                const userName = getCookie("user_Name1");
              
                const imageUrl = getCookie("image_Url1");
                const jwttoken = getCookie("JT1");
                dispatch(login(userName, imageUrl, jwttoken));
        
            }   
        }
    };

    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
            c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
          }
        }
        return "";
      }

