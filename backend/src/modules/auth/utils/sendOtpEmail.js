import nodemailer from 'nodemailer'

export const sendOtpEmail = async (email, otp) => {

  if (!otp || !email) {
    throw new Error("Email and OTP are required")
  }

  const transporter = nodemailer.createTransport(
    {
      host: "stmp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }

  )

  const mailConfiguration = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP verification",
    html: `<p> Your OTP for verification is <b>${otp}</b>. Expires in 10 minutes.</p>`
  }

  await transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) throw new Error(error)

    console.log("otp sent successfully");

  })
}

export default sendOtpEmail