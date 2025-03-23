// app.test.js
const request = require('supertest');
const express = require('express');
const db = require('./database'); // feltételezem, hogy van egy db modulod
const app = require('./server');




// Mockoljuk a db modult
jest.mock('./database');

describe('GET /products', () => {
  
  // Sikeres válasz tesztelése
  it('should return products when database query succeeds', async () => {
    const mockProducts = [
      { id: 1, name: 'Termék 1' },
      { id: 2, name: 'Termék 2' }
    ];
    
    // Mockoljuk a db.query-t sikeres válasszal
    db.query.mockImplementation((query, callback) => {
      callback(null, mockProducts);
    });

    const response = await request(app)
      .get('/products')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toEqual(mockProducts);
  });

  // Hiba esetén tesztelése
  it('should return 500 when database query fails', async () => {
    // Mockoljuk a db.query-t hibával
    db.query.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    const response = await request(app)
      .get('/products')
      .expect('Content-Type', /json/)
      .expect(500);

    expect(response.body).toEqual({ error: 'Hiba a termékek lekérdezésekor' });
  });

  // Teardown: mock visszaállítása minden teszt után
  afterEach(() => {
    jest.clearAllMocks();
  });

});