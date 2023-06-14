const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: 'Content-Type',
};

app.use(cors(corsOptions));

app.get('/api', (req, res) => {
  res.send('Bienvenue')
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `Formulaire de contact <${process.env.GMAIL_ADDRESS}>`,
    to: email,
    subject: 'Nouveau message de contact',
    text: `
      Nom: ${name}
      Email: ${email}

      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Une erreur s'est produite lors de l'envoi de l'e-mail.");
    } else {
      console.log('E-mail envoyé : ' + info.response);
      res.send('Merci ! Votre message a été envoyé avec succès.');
    }
  });
});

const port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log('Server lauched on ' + port );
});

module.exports = app;
