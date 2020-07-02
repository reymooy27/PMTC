const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const dotenv = require("dotenv");
dotenv.config();

const myOAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

myOAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});
const myAccessToken = myOAuth2Client.getAccessToken();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

function sendEmail(email) {
  transporter.sendMail(
    {
      from: "PUBG Mobile Terminator Challenge <gdrrey@gmail.com>",
      to: email,
      subject: "Selesaikan Pendaftaran Tim-mu",
      html: `
      <html>
        <head>
          <meta charset="utf-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <title>Page Title</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </head>
        <body
          style="
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: Arial, Helvetica, sans-serif;
            background: #151a2c;
          "
        >
          <div
            style="
              width: 600px;
              background: #0e1013;
              color: white;
              text-align: center;
              margin: 4em auto;
              padding: 1em;
              border-radius: 10px;
              box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.541);
            "
          >
            <h4>PUBG Mobile Terminator Challenge</h4>
            <h2>Selesaikan pendaftaran tim anda</h2>
            <p>Biaya pendaftaran sebesar Rp. 100.000</p>
            <p>BRI : 92929292xx92929xx</p>

            <br />
            <p>
              Punya pertanyaan? Hubungi kami di Whatsapp <b>0822 3781 3869</b> atau
              email ke <b>pmtc.official@gmail.com</b>
            </p>
            <p>Terima kasih!</p>
            <span style="color: grey; font-size: 12px;"
              >Anda menerima email ini sebagai pembereritahuan tentang regisrtasi tim
              anda pada Turnamen PUBG Mobile Terminator Challenge</span
            >
          </div>
        </body>
      </html>
      `,
      auth: {
        user: "gdrrey@gmail.com",
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: myAccessToken,
        expires: 1484314697598,
      },
    },
    (err, info) => {
      if (err) console.log(err);

      transporter.close();
      console.log("Email Terkirim");
    }
  );
}

module.exports = sendEmail;
