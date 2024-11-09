const nodemailer = require('nodemailer');

// Create a transporter using Gmail (or any other email service)
const transporter = nodemailer.createTransport({
  service: 'gmail', // or 'smtp.mailtrap.io' for testing purposes
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to send an email to a single recipient
const sendEmail = (toEmail, taskTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender address
    to: toEmail, // Recipient address
    subject: 'A task has been shared with you', // Subject of the email
    text: `A task titled "${taskTitle}" has been shared with you. Please check your task list for more details.`, // Email body
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = sendEmail;
