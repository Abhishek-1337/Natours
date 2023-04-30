const nodemailer = require('nodemailer');

const sendEmail = async (options) => {

    //Create a transporter service that actually sends emails
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
 
    //Define mail options
    const mailOptions = {
        from: 'Abhishek vishwakarma <abhishekrinku4@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    //Send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;