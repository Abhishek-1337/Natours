const nodemailer = require('nodemailer');
const pug = require('pug');
const { convert } = require('html-to-text');

module.exports = class Email{

    constructor(user, url){
        this.to = user.email,
        this.url = url;
        this.firstName = user.name.split(' ')[0];
        this.from = `Abhishek Vishwakarma ${process.env.EMAIL_FROM}`
    }

    newTransport(){
    //Create a transporter service that actually sends emails
        if(process.env.NODE_ENV === 'production'){
            return nodemailer.createTransport({
                service: 'SendGrid',
                auth: {
                    user: process.env.EMAIL_SENDGRID,
                    pass: process.env.PASS_SENDGRID
                }
            });
        }

        return  nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async send(template, subject){
        //render HTML from pug file
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstName: this.firstName,
            subject,
            url: this.url
        })

         //Define mail options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: convert(html)
        }

        await this.newTransport().sendMail(mailOptions);

    }

    async sendWelcome(){
        await this.send('welcome', 'Welcome to the natours family');
    }

    async sendResetToken(){
        await this.send('passwordReset', 'Your password reset token');
    }
}
