const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendOtpEmail(to, otp) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: " ' SHOHAYOK-THE FLOOD FIGHTER ' Password Reset OTP",
      text: `YOUR PASSWORD RESET OTP IS: ${otp}`
    });
    
    
}
catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    throw err; // 🔥 important
  }
}
async function sendAdminAlert(area, count) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // 🔥 admin email (same for now)
      subject: "🚨 URGENT: Multiple Rescue Requests",
      html: `
        <h2>🚨 Emergency Alert</h2>
        <p><strong>Area:</strong> ${area}</p>
        <p><strong>Total Requests:</strong> ${count}</p>
        <p>Please review and activate mission immediately.</p>
      `
    });

    console.log("📧 Admin alert sent");

  } catch (err) {
    console.error("❌ ADMIN EMAIL ERROR:", err);
  }
}
module.exports = { sendOtpEmail , sendAdminAlert };