const nodemailer = require('nodemailer');

// Email küldés konfigurációja
const transporter = nodemailer.createTransport({
    service: 'gmail', // Használhatsz mást is, pl. SendGrid, Mailgun stb.
    auth: {
        user: 'quickserveprojekt2025@gmail.com', // A te email címed
        pass: 'xwjb zuzc emvm xykd'   // Gmail esetén alkalmazás-specifikus jelszó kell
    }
});

// Email küldő függvény
const sendOrderConfirmation = (orderDetails, customerEmail, callback) => {
    const mailOptions = {
      from: 'quickserveprojekt2025@gmail.com',
      to: customerEmail,
      subject: 'Rendelés visszaigazolás',
      html: `
      <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: 'Roboto', 'Open Sans', Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; font-size: 16px; }
            .container { max-width: 600px; margin: 20px auto; background: #f9f9f9; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: #2196F3; color: white; padding: 15px; text-align: center; }
            .logo { max-width: 150px; height: auto; margin: 10px auto; display: block; }
            .content { padding: 15px; color: #333; }
            .order-details { border: 1px solid black ; border-radius: 15px; padding: 15px; background: #f0f0f0; }
            .order-details li { margin: 8px 0; list-style: none; font-size: 16px; line-height: 1.6;text-align: justify;}
            .footer { text-align: center; padding: 15px; font-size: 14px; color: white; background: #2196F3; }
            .order-details li strong { color: green; }
            h2 { margin: 10px 0; font-size: 28px; text-align: center;}
            p { line-height: 1.6; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://drive.google.com/uc?export=download&id=1-t8cenCnS7VCmYILXtEH8qjOm4d5kAjx" alt="QuickServe Logo" class="logo">
            </div>
            <div class="content">
              <h2>Rendelés visszaigazolás</h2>
              <p>Kedves <strong>${orderDetails.felhasznalonev}</strong>!</p>
              <p>Köszönjük, hogy a QuickServe-t választottad! Az alábbiakban találod a rendelésed részleteit:</p>
              <ul class="order-details">
                <li><strong>Rendelésszám:</strong> #${orderDetails.id}</li>
                <li><strong>Termék:</strong> ${orderDetails.productName}</li>
                <li><strong>Mennyiség:</strong> ${orderDetails.quantity}</li>
                <li><strong>Összeg:</strong> ${orderDetails.totalPrice} Ft</li>
                <li><strong>Rendelés dátuma:</strong> ${orderDetails.orderDate}</li>
                <li><strong>Státusz:</strong> ${orderDetails.statusz}</li>
                <li><strong>Fizetési mód:</strong> ${orderDetails.fizetesimod}</li>
                <li><strong>Átvétel várható időpontja:</strong> ${orderDetails.szunet}. szünet</li>
              </ul>
              <p>Ha bármi kérdésed van, keress minket bátran!</p>
            </div>
            <div class="footer">
              <p>Üdvözlettel,<br>A QuickServe csapata</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Hiba az email küldésekor:', error);
          return callback(error);
        }
        console.log('Email sikeresen elküldve:', info.response);
        callback(null);
      });
   
   
   
};

module.exports = { sendOrderConfirmation };