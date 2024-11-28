import dotenv from 'dotenv';
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";
import { token } from 'morgan';

dotenv.config()

const mailersend = new MailerSend({
    apiKey: process.env.MAILERSEND_KEY as string,
});

export const sendVerificationEmail = async (email: string, name: string) => {

  const sentFrom = new Sender("bensagra@trial-k68zxl2nx7klj905.mlsender.net", "Mirrow verification code");

const recipients = [
  new Recipient(email, name)
];

const emailParams = new EmailParams()
  .setFrom(sentFrom)
  .setTo(recipients)
  .setReplyTo(sentFrom)
  .setSubject("This is a Subject")
  .setHtml(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f4f4f4;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .email-header {
          background-color: #007bff;
          color: #ffffff;
          text-align: center;
          padding: 20px;
        }
        .email-header h1 {
          margin: 0;
          font-size: 24px;
        }
        .email-body {
          padding: 20px;
          line-height: 1.6;
          text-align: center;
        }
        .email-body p {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .token {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          font-size: 18px;
          font-weight: bold;
          text-decoration: none;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }
        .token:hover {
          background-color: #0056b3;
        }
        .email-footer {
          background-color: #f4f4f4;
          text-align: center;
          padding: 10px;
          font-size: 14px;
          color: #777;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>Email Verification</h1>
        </div>
        <div class="email-body">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for registering with us. Please click the button below to verify your email address:</p>
          <button 
            class="token" 
            onclick="verifyEmail('${email}')"
          >
            Verify Email
          </button>
          <p>If you did not request this email, you can safely ignore it.</p>
        </div>
        <div class="email-footer">
          <p>© 2024 Mirrow. All rights reserved.</p>
        </div>
      </div>
      <script>
        function verifyEmail(email) {
          fetch('https://mirrow-db.vercel.app/users/verify', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, email })
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              window.open('https://www.google.com');
            } else {
              alert('Verification failed. Please try again.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
          });
        }
      </script>
    </body>
    </html>
    `)
    
  .setText("This is the text content");

try {
  let data = await mailersend.email.send(emailParams);
return(data);

} catch (error) {
  return error;
}
}
  
  // Example usage