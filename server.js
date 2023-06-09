require('dotenv').config();

const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));
console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);

const contactEmail = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: process.env.REACT_APP_NODEMAILER_USER,
    pass: process.env.REACT_APP_NODEMAILER_PASS
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName;
  const lastname = req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: process.env.REACT_APP_NODEMAILER_USER,
    to: process.env.REACT_APP_NODEMAILER_RECIPIENT,
    subject: "¡Te contactaron por trabajo! - Portfolio",
    html: `Buen día ¡Felicidades, has sido contactado por trabajo desde tu sitio web de portafolio! 
          Los datos del mensaje del cliente son los siguientes:
           <p>Name: ${name}</p>
           <p>LastName: ${lastname}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});
