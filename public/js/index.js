import '@babel/polyfill';
import { login, logOut } from './login';
import { updateSettings } from './updateSettings';

const loginForm = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');

if(loginForm){
    loginForm.addEventListener('submit', e=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
};

if(logoutBtn){
    logoutBtn.addEventListener('click', logOut);
};

if(userDataForm){
    userDataForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const form = new FormData();
        console.log('hello'+form);
        form.append('name' ,document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        console.log(form);
        updateSettings(form, 'data');
    });
}

if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async (e)=>{
        e.preventDefault();
        const btn = document.querySelector('.btn--activity');
        btn.textContent = 'Updating...';
        btn.disabled = true;
        const passwordCurrent = document.getElementById('password-current').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('password-confirm').value;
        await updateSettings({passwordCurrent, password, passwordConfirm}, 'password');

        btn.disabled = false;
        btn.textContent = 'save password';
        document.getElementById('password-current').value = '';
        document.getElementById('password').value = '';
        document.getElementById('password-confirm').value = '';
    });
}