import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (data, type) => {
    try{
        const suffix = type === 'password' ? 'updateMyPassword' : 'updateMe';
        const url =  '/api/v1/users/'+suffix; 
        const res = await axios.patch(url, data);
        
        if(res.data.status === 'success'){
            showAlert("success",'Data updated successfully.');
        }
    }
    catch(err){
        console.log(err);
        showAlert('error',err.response.data.message);
    }
};


