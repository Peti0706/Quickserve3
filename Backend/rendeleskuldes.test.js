const request = require('supertest');
const app = require('./server'); 
const jwt = require('jsonwebtoken');
const db = require('./database'); 
const { sendOrderConfirmation } = require('./emailservice');

// Mockoljuk az adatbázist és az email küldést
jest.mock('./database', () => ({
  query: jest.fn()
}));

jest.mock('./emailservice', () => ({
  sendOrderConfirmation: jest.fn()
}));

// Érvényes token létrehozása
const validToken = jwt.sign(
  { Vasarlo_ID: 1, Nev: 'Teszt Felhasználó', Email: 'test@example.com' },
  'secret'
);


describe('POST /sendorder endpoint', () => {

  describe('Autentikáció ellenőrzése', () => {
    it('401-es hibakódot kell visszakapnia, ha nincs token megadva', async () => {
      const response = await request(app)
        .post('/sendorder')
        .send({ items: [], totalDiscountedPrice: 0, Discount: 0, Discountcode: '' });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Nincs bejelentkezve');
    });

    it('403-as hibakódot kell visszakapnia, ha érvénytelen token van megadva', async () => {
      const response = await request(app)
        .post('/sendorder')
        .set('Authorization', 'invalidtoken')
        .send({ items: [], totalDiscountedPrice: 0, Discount: 0, Discountcode: '' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Érvénytelen token');
    });
  });

  // Sikeres működés tesztelése
  describe('Sikeres rendelés rögzítése', () => {
    it('200-as kódot kell visszakapnia, ha érvényes token és adatok vannak megadva', async () => {
      const items = [
        {
          Megrendeles_ID: 1,
          Cikkszam: 'ABC123',
          Datum: '2023-01-01',
          Mennyiseg: 2,
          Szunet: 'Nem',
          Fizetesi_mod: 'Kártya',
          Termeknev: 'Termék1',
          Tipus: 'Típus1'
        }
      ];
      const totalDiscountedPrice = 100;
      const Discount = 10;
      const Discountcode = 'KEDVEZMENY10';

      // Mockoljuk az adatbázis lekérdezéseket
      db.query.mockImplementation((sql, values, callback) => {
        callback(null, { insertId: 1 });
      });

      // Mockoljuk az email küldést
      sendOrderConfirmation.mockImplementation((orderDetails, email, callback) => {
        callback(null);
      });

      const response = await request(app)
        .post('/sendorder')
        .set('Authorization', validToken)
        .send({ items, totalDiscountedPrice, Discount, Discountcode });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('A rendelést és az állapotot sikeresen rögzítettük, visszaigazolás elküldve!');
      expect(db.query).toHaveBeenCalledTimes(2);
      expect(sendOrderConfirmation).toHaveBeenCalledTimes(1);
    });
  });

  // Hibakezelés tesztelése
  describe('Hibakezelés', () => {
    it('500-as hibakódot kell visszakapnia, ha az adatbázis-lekérdezés a rendelés rögzítésekor sikertelen', async () => {
      db.query.mockImplementationOnce((sql, values, callback) => {
        callback(new Error('Database error'));
      });

      const response = await request(app)
        .post('/sendorder')
        .set('Authorization', validToken)
        .send({ items: [{ Megrendeles_ID: 1 }], totalDiscountedPrice: 0, Discount: 0, Discountcode: '' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Hiba a rendelés rögzítésekor');
    });

    it('500-as hibakódot kell visszakapnia, ha az adatbázis-lekérdezés az állapot rögzítésekor sikertelen', async () => {
      db.query
        .mockImplementationOnce((sql, values, callback) => {
          callback(null, { insertId: 1 });
        })
        .mockImplementationOnce((sql, values, callback) => {
          callback(new Error('Database error'));
        });

      const response = await request(app)
        .post('/sendorder')
        .set('Authorization', validToken)
        .send({ items: [{ Megrendeles_ID: 1 }], totalDiscountedPrice: 0, Discount: 0, Discountcode: '' });

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Hiba a rendelés állapot rögzítésekor');
    });
  });
});