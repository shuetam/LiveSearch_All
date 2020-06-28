import axios from 'axios';

const instance = axios.create( {
    baseURL: 'https://www.fitize.pl/api'
})

export default instance;