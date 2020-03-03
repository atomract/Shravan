const nodemailer = require('nodemailer')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'sudiptdabral2991999@gmail.com',
      pass: 'iamawinner',
    },
  });



const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';
module.exports = function sendEmail(email, id) {
    console.log("<< SEND EMAIL >>", email, id)
    jwt.sign(
        {
          user: id,
          email: email
        },
        EMAIL_SECRET,
        {
          expiresIn: '1d',
        },
        (err, emailToken) => {
        console.log("ERROR SEND MAIL ", err)
          const url = `http://localhost:5000/api/user/confirmation/${emailToken}`;

          transporter.sendMail({
            to: email,
            subject: 'Confirm Email',
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
          });
        },
      );
}