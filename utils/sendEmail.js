const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (data) => {
  const msg = {
    ...data,
    from: "inceptor.tolerance@meta.ua",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch(console.error);
};

module.exports = { sendEmail };
