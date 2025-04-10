
const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('./database');
const app=require("./server");




// Mockoljuk a db és jwt modult
jest.mock('./database');
jest.mock('jsonwebtoken');

describe('DELETE /admin/kuponok/:kuponid', () => {
  
  // Sikeres törlés tesztelése érvényes tokennel
  it('törölnie kellene a kupont érvényes tokennel', async () => {
    const kuponid = "1";
    const validToken = 'valid-token';

    // Mockoljuk a JWT verify-t sikeres válasszal
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: 123 }); // sikeres dekódolás
    });

    // Mockoljuk a db.query-t sikeres válasszal
    db.query.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const response = await request(app)
      .delete(`/admin/kuponok/${kuponid}`)
      .set('Authorization', validToken)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual({ message: 'Sikeresen törölted a kuponot!' });
    expect(db.query).toHaveBeenCalledWith('DELETE FROM kuponok WHERE ID=?', [kuponid], expect.any(Function));
  });

  // Hiányzó token tesztelése
  it('401-es hibakódot kellene visszaadnia, ha nincs token megadva', async () => {
    const kuponid = 1;

    const response = await request(app)
      .delete(`/admin/kuponok/${kuponid}`)
      .expect('Content-Type', /json/)
      .expect(401);

    expect(response.body).toEqual({ message: 'Nincs bejelentkezve' });
  });

  // Érvénytelen token tesztelése
  it('403-as hibakódot kellene visszaadnia, ha a token érvénytelen', async () => {
    const kuponid = 1;
    const invalidToken = 'invalid-token';

    // Mockoljuk a JWT verify-t hibával
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    const response = await request(app)
      .delete(`/admin/kuponok/${kuponid}`)
      .set('Authorization', invalidToken)
      .expect('Content-Type', /json/)
      .expect(403);

    expect(response.body).toEqual({ message: 'Érvénytelen token' });
  });

  // Adatbázis hiba tesztelése
  it('500-as hibakódot kellene visszaadnia, ha az adatbázis-lekérdezés sikertelen', async () => {
    const kuponid = 1;
    const validToken = 'valid-token';

    // Mockoljuk a JWT verify-t sikeres válasszal
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: 123 });
    });

    // Mockoljuk a db.query-t hibával
    db.query.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .delete(`/admin/kuponok/${kuponid}`)
      .set('Authorization', validToken)
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toEqual({ error: 'Hiba az adatok lekérdezésekor' });
  });

  // mock visszaállítása minden teszt után
  afterEach(() => {
    jest.clearAllMocks();
  });
});