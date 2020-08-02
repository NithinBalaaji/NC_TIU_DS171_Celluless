const sgMail = require('@sendgrid/mail');

// Importing configuration/env variables
const config = require('../config/index');


// Setting Sendgrid API key
sgMail.setApiKey(config.SENDGRID_API_KEY);


exports.sendEmail = async (email, subject, html) => {
    try {
        const message = {
            from: config.FROM_MAIL_ADDRESS,
            to: email,
            subject: subject,
            html: html,
        };
        let mail = await sgMail.send(message);
        return {
            status_code: 200,
            message: "Success",
            data: {}
        }
    } catch(error){
        console.error(error.toString());
        return {
            status_code: 500,
            message: error.toString(),
            data: {}
        }
    }
}