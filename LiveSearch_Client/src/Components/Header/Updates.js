import {URL, PATHES} from '../../environment';
import axios from 'axios';

export const Update = () => {
    console.log("Update !!!! ");
    axios.post(URL.api+URL.update, null)
    .catch(error => { console.log("Update error")});

}