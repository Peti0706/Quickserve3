
const request = require('supertest');
const express = require('express');
const db = require('./database'); 
const app = require('./server');





jest.mock('./database');

describe('GET /products', () => {
  
  // Sikeres válasz tesztelése
  it('termékeket kellene visszakapnia, ha az adatbázis-lekérdezés sikeres', async () => {
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


  it('500-as hibakódot kellene visszakapnia, ha az adatbázis-lekérdezés sikertelen', async () => {
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

  // visszaállítása minden teszt után
  afterEach(() => {
    jest.clearAllMocks();
  });

});