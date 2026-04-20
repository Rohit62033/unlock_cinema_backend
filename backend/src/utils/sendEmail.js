import nodemailer from 'nodemailer'

const sendOtpEmail = async (email, otp) => {

  const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const mailConfiguration = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP verification",
    html: `<p> Your otp for verification is <b>${otp}</b>. Expires in 10 minutes.</p>`
  }

  await transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) throw new Error(error)

    console.log("otp sent successfully")
  })

}

export default sendOtpEmail;