import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (data) => {
    try{
        const res = await axios.post('/api/v1/users/signup', {
            name: data.name,
            email: data.email,
            password: data.password,
            passwordConfirm: data.passwordConfirm
        });
        
        if(res.data.status === 'success'){
            showAlert("success",'Logged in successfully.');
            window.setTimeout(()=>{
                location.assign('/');
            }, 1000)
        }
    }
    catch(err){
        console.log(err);
        showAlert('error',err.response.data.message);
    }
};


