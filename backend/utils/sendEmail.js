const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text,attachmentPath) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
