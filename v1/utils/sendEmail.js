const nodemailer = require('nodemailer');

// Create a transporter using Gmail (or any other email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.mailtrap.io' for testing purposes
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your app password
  },
  tls: {
    rejectUnauthorized: false,  // Ignore certificate errors
  },
});

// Function to send an email to a single recipient
const sendEmail = async (toEmail, taskTitle) => {

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: toEmail, // Recipient address
    subject: 'A task has been shared with you from Task management API', // Subject of the email
    text: `A task titled "${taskTitle}" has been shared with you. Please check your task list for more details.`, // Email body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.log('Error sending email:', error);
    return false; // Return false if there was an error sending the email
  }
};

module.exports = sendEmail;
