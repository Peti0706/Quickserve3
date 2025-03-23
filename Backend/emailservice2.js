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
const sendStatuszChange = (Statusz, Megrendelo_email,rendelesid,callback) => {
    const mailOptions = {
      from: 'quickserveprojekt2025@gmail.com',
      to: Megrendelo_email,
      subject: 'Rendelésed státusza megváltozott',
      html: `
      <!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rendelési Státusz Frissítés</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
          
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
        }
        .logo {
            max-width: 150px;
            height: auto;
        }
        .content {
            padding: 20px;
            line-height: 1.6;
        }
        .status {
            font-weight: bold;
            color: #28A745;
            margin: 10px 0;
        }
        .footer {
            background-color: #007BFF;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #ffffff;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #0056b3;
            color: #ffffff;
            text-decoration: none;
            border-radius: 25px;
            margin-top: 15px;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #003d82;
        }
        .allapot-table {
            width: 60%;
            margin: 10px auto;
            background-color: #f8f9fa;
            border-radius: 25px;
            
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            border-collapse: collapse;
        }
        .allapot-table td {
            padding: 5px;
            text-align: center;
            vertical-align: middle;
            
        }
        
          .bal{
            margin-left: 10px;
            }
          .jobb{
            margin-right: 10px;
            }
        @media only screen and (max-width: 600px) {
            .container {
                width: 100%;
                margin: 0px;
                border-radius: 8px;
            }
            .header, .content, .footer {
                padding: 15px;
            }
            .logo {
                max-width: 150px;
            }
            .allapot-table {
                width: 85%;
                
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://drive.google.com/uc?export=download&id=1-t8cenCnS7VCmYILXtEH8qjOm4d5kAjx" alt="QuickServe Logo" class="logo">
        </div>
        <div class="content">
            <h2 style="text-align: center;">Rendelési állapot</h2>
            <p>Kedves Vásárlónk!</p>
            <p>A(z) <strong>${rendelesid}</strong> rendelésed státusza megváltozott.</p>
            <table class="allapot-table">
                <tr>
                    <td><p class="bal"><strong>Jelenlegi állapota:</strong></p></td>
                    <td><p class="status jobb">${Statusz}</p></td>
                </tr>
            </table>
            <p>Köszönjük, hogy minket választottál!</p>
            <a href="http://localhost:4200/reszletek/${rendelesid}" class="button" style="text-decoration:none; color:white">Rendelés Megtekintése</a>
        </div>
        <div class="footer">
            <p>Üdvözlettel: <strong>QuickServe csapata</strong></p>
            <p>Ha kérdésed van, keress minket bátran!</p>
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

module.exports = { sendStatuszChange };