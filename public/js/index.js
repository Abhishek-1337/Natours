import '@babel/polyfill';
import { login, logOut } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { signup } from './signup';

const loginForm = document.querySelector('.form-login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.querySelector('#book-tour');
const signupForm = document.querySelector('.form-signup');

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
        form.append('name' ,document.getElementById('name').value);
        form.append('email', document.getElementById('email').value);
        form.append('photo', document.getElementById('photo').files[0]);
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
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

if(bookBtn){
    document.addEventListener('click', e => {
        e.target.textContent = 'Processing...';
        const { tourId } = e.target.dataset;
        bookTour(tourId);
        e.target.textContent = 'Book tour now!';
    })
}

if(signupForm){
    signupForm.addEventListener('submit', e=>{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const passwordConfirm = document.getElementById('passwordConfirm').value;
        signup({name, email, password, passwordConfirm});
    });
}