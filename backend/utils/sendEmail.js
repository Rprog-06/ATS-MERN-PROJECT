const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text,attachmentPath) => {
  const transporter = nodemailer.createTransport({  
   host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
    auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
     tls: {
    rejectUnauthorized: false,
  },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };
 if(attachmentPath){
   mailOptions.attachments = [{ filename:"OfferLetter.pdf", path: attachmentPath,contentType:"application/pdf"  }];
 } // Verifying the email account


  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent successfully:", info.response);
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
  }
};

module.exports = sendEmail;
