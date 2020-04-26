import axios from 'axios';

const instance = axios.create( {
    baseURL: 'http://www.coukkas.com.pl/account'
})

export default instance;