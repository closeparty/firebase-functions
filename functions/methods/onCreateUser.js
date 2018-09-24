'use strict';
const admin = require('firebase-admin');
const functions = require('firebase-functions');
var models = require('../models');
const nodemailer = require('nodemailer');

// Variables
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmailEmail,
        pass: gmailPassword,
    },
});

exports.exec = function (userRecord) {
    console.log("Successfully fetched user data: ", userRecord.toJSON());
    var userObject = models.profile.create(userRecord.email);
    const mailOptions = {
        from: `"Renan Marcel Paulino Leite." <${gmailEmail}>`,
        to: userRecord.email,
    };
    mailOptions.subject = 'Thanks and Welcome!';
    mailOptions.text = 'Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.';
    mailOptions.html = `<p>Thanks you for subscribing to our newsletter.</p><p>You will receive our next weekly newsletter.</p>`;
    try {
        mailTransport.sendMail(mailOptions);
        console.log(`New subscription confirmation email sent to:`, val.email);
    } catch (error) {
        console.error('There was an error while sending the email:', error);
    }
    return admin.database().ref(`users/${userRecord.uid}`).set(userObject);
};