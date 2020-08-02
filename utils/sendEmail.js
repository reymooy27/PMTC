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

function sendEmail(email, teamName) {
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
      background: #151a2c;
      color: white;
      padding: 0;
      box-sizing: border-box;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <div
      style="
        width: 90%;
        max-width: 700px;
        text-align: center;
        margin: 4em auto;
        padding: 1em;
        border-radius: 10px;
      "
    >
      <h3>Hi <strong style="color: #00ddaa;">${teamName}!</strong></h3>
      <h3>Selesaikan pendaftaran tim anda</h3>
      <p>
        Biaya pendaftaran sebesar
        <strong style="color: #00ddaa;">Rp. 50.000</strong>
      </p>
      <p>BRI : <strong style="color: #00ddaa;">92929292xx92929xx</strong></p>

      <br />
      <p>
        Selanjutnya silahkan anda melakukan pembayaran melalui nomor rekening
        yang tersedia di atas selambat-lambatnya 12 jam sejak diterimanya email
        konfirmasi ini
      </p>
      <p>
        Punya pertanyaan? Anda mengalami kendala? Hubungi kami di Whatsapp
        <b style="color: #00ddaa;">0822 3781 3869</b> atau email ke
        <b>pmtc.official@gmail.com</b>
      </p>
      <p>Terima kasih!</p>
      <span style="color: grey; font-size: 12px;"
        >Anda menerima email ini sebagai pemberitahuan tentang registrasi tim
        anda pada Turnamen PUBG Mobile Terminator Challenge</span
      >
      <div
        style="border-top: 2px solid #00ddaa; margin: 20px auto 0; width: 100%;"
      >
        <div style="width: 150px; display: flex; margin: 10px auto;">
          <div style="margin: 10px 5px; width: 120px;">
            <a
              href="https://www.facebook.com/pubgmtc.official/?modal=admin_todo_tour"
            >
              <img
                src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2012/png/iconmonstr-facebook-1.png&r=0&g=222&b=171"
                alt=""
                style="width: 30px;"
              />
            </a>
          </div>
          <div style="margin: 10px 5px; width: 120px;">
            <a href="https://www.instagram.com/pmtc.official/">
              <img
                src="https://iconmonstr.com/wp-content/g/gd/makefg.php?i=../assets/preview/2016/png/iconmonstr-instagram-11.png&r=0&g=222&b=171"
                alt=""
                style="width: 30px; background: transparent;"
              />
            </a>
          </div>
        </div>
        <h3>pmtc.official@gmail.com</h3>
        <p style="font-size: 12px;">
          PMTC | Jalan R.W. Monginsidi III, Fatululi, Kupang
        </p>
        <p style="font-size: 12px;">
          Copyrigth © 2020 PUBG Mobile Terminator Challenge
        </p>
      </div>
    </div>
  </body>
</html>


      `,
      auth: {
        user: "pmtc.official@gmail.com",
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: myAccessToken,
        expires: 1484314697598,
      },
    },
    (err, info) => {
      if (err) console.log(err);

      transporter.close();
    }
  );
}

module.exports = sendEmail;
