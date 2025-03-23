const request = require('supertest');
const app = require('./server'); // Feltételezem, hogy az app.js-ban van az express app
const jwt = require('jsonwebtoken');
const db = require('./database'); // Feltételezem, hogy ez az adatbázis modul
const { sendOrderConfirmation } = require('./emailservice');

// Mockoljuk az adatbázis modult
jest.mock('./database', () => ({
  query: jest.fn()
}));

// Mockoljuk az email küldést
jest.mock('./emailservice', () => ({
  sendOrderConfirmation: jest.fn((orderDetails, email, callback) => callback(null))
}));

describe('POST /sendorder', () => {
  // Érvényes token és rendelési adatok létrehozása


  const validToken = jwt.sign({ Vasarlo_ID: 1, Nev: 'Teszt Felhasználó', Email: 'teszt@example.com' }, 'secret');
  const orderData = {
    items: [
      {
        Megrendeles_ID: '123',
        Cikkszam: 'ABC123',
        Datum: '2023-05-20',
        Mennyiseg: 2,
        Szunet: 'Nem',
        Fizetesi_mod: 'Kártya',
        Termeknev: 'Termék 1',
        Tipus: 'Típus 1'
      },
      {
        Megrendeles_ID: '123',
        Cikkszam: 'DEF456',
        Datum: '2023-05-20',
        Mennyiseg: 1,
        Szunet: 'Nem',
        Fizetesi_mod: 'Kártya',
        Termeknev: 'Termék 2',
        Tipus: 'Típus 2'
      }
    ],
    totalDiscountedPrice: 10000,
    Discount: 10,
    DiscountId: 'KUPON123'
  };

  // 1. Sikeres rendelés teszt
  it('should send order successfully with valid token and data', async () => {
    db.query.mockImplementation((sql, values, callback) => {
      if (sql.startsWith('INSERT INTO megrendelések')) {
        callback(null, { insertId: 1 });
      } else if (sql.startsWith('INSERT INTO rendelés_állapot')) {
        callback(null, { insertId: 1 });
      }
    });

    const res = await request(app)
      .post('/sendorder')
      .set('Authorization', validToken)
      .send(orderData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'A rendelést és az állapotot sikeresen rögzítettük, visszaigazolás elküldve!');

    expect(db.query).toHaveBeenCalledTimes(2);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO megrendelések(Megrendeles_ID, Vasarlo_ID, Cikkszam,Datum, Mennyiseg, Szunet,Fizetesi_mod,Kedvezmenyes_osszeg,Kedvezmeny,Kupon_ID) VALUES ?',
      [[
        ['123', 1, 'ABC123', '2023-05-20', 2, 'Nem', 'Kártya', 10000, 10, 'KUPON123'],
        ['123', 1, 'DEF456', '2023-05-20', 1, 'Nem', 'Kártya', 10000, 10, 'KUPON123']
      ]],
      expect.any(Function)
    );
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO rendelés_állapot(Megrendeles_ID, Statusz) VALUES (?, \'Rendelés elküldve\')',
      ['123'],
      expect.any(Function)
    );

    expect(sendOrderConfirmation).toHaveBeenCalledWith(
      {
        id: '123',
        productName: 'Termék 1 (Típus 1), Termék 2 (Típus 2)',
        quantity: 3,
        totalPrice: 10000,
        orderDate: '2023-05-20',
        statusz: 'Rendelés elküldve',
        fizetesimod: 'Kártya',
        szunet: 'Nem',
        felhasznalonev: 'Teszt Felhasználó'
      },
      'teszt@example.com',
      expect.any(Function)
    );
  });

  // 2. Hiányzó token teszt
  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/sendorder')
      .send(orderData);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('message', 'Nincs bejelentkezve');
  });

  // 3. Érvénytelen token teszt
  it('should return 403 if token is invalid', async () => {
    const invalidToken = jwt.sign({ Vasarlo_ID: 1 }, 'wrongsecret');
    const res = await request(app)
      .post('/sendorder')
      .set('Authorization', invalidToken)
      .send(orderData);

    expect(res.statusCode).toEqual(403);
    expect(res.body).toHaveProperty('message', 'Érvénytelen token');
  });

  // 4. Adatbázis hiba teszt
  it('should return 500 if database query fails', async () => {
    db.query.mockImplementation((sql, values, callback) => {
      if (sql.startsWith('INSERT INTO megrendelések')) {
        callback(new Error('Database error'));
      }
    });

    const res = await request(app)
      .post('/sendorder')
      .set('Authorization', validToken)
      .send(orderData);

    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', 'Hiba a rendelés rögzítésekor');
  });

  // 5. Email küldés hiba teszt
  it('should still return 200 even if email sending fails', async () => {
    db.query.mockImplementation((sql, values, callback) => {
      callback(null, { insertId: 1 });
    });

    sendOrderConfirmation.mockImplementation((orderDetails, email, callback) => {
      callback(new Error('Email sending failed'));
    });

    const res = await request(app)
      .post('/sendorder')
      .set('Authorization', validToken)
      .send(orderData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'A rendelést és az állapotot sikeresen rögzítettük, visszaigazolás elküldve!');
  });
});