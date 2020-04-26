import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import authReducer from './Store/Reducers/auth';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers  } from 'redux';
import thunk from 'redux-thunk';
import { CookiesProvider } from 'react-cookie';
import HttpsRedirect from 'react-https-redirect';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

axios.defaults.baseURL = 'https://jsonplaceholder.typicode.com';
axios.defaults.headers.common['Authorization'] = 'AUTH TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(request => {
    console.log(request);
    // Edit request config
    return request;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    console.log(response);
    // Edit request config
    return response;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

const rootReducer = combineReducers({
    auth: authReducer,
    //icons: iconsReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

const app = (
    <HttpsRedirect>
        <CookiesProvider>
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
    </CookiesProvider>
    </HttpsRedirect>
);

ReactDOM.render(app, document.getElementById( 'root' ) );
registerServiceWorker();
