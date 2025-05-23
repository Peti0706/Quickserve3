
const request = require('supertest');
const app = require('./server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database'); 

// Mockoljuk az adatbázis és a bcrypt függvényeket
jest.mock('./database', () => ({
  query: jest.fn()
}));
jest.mock('bcryptjs');

describe('POST /login', () => {
  beforeEach(() => {
    // Tisztítsuk a mockokat minden teszt előtt
    jest.clearAllMocks();
  });

  

  it('sikeres bejelentkezésnek kellene lennie helyes adatokkal', async () => {
    // Mock adatbázis válasz
    const mockUser = {
      Vasarlo_ID: 1,
      Nev: 'TesztUser',
      Jelszo: 'hashedPassword',
      Email: 'teszt@example.com'
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [mockUser]);
    });

    // Mock helyes jelszó
    bcrypt.compare.mockResolvedValue(true);

   
    jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken');

    const response = await request(app)
      .post('/login')
      .send({ Nev: 'TesztUser', Jelszo: 'password123' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: 'mockedToken',
      vasarlo: { name: 'TesztUser' }
    });
    expect(db.query).toHaveBeenCalledWith(
      'SELECT * FROM vásárlók WHERE Nev = ?',
      ['TesztUser'],
      expect.any(Function)
    );
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
  });

  it('400-as hibakóddal kellene visszatérnie ha a felhasználónév helytelen', async () => {
    // üres eredmény
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, []);
    });

    const response = await request(app)
      .post('/login')
      .send({ Nev: 'RosszUser', Jelszo: 'password123' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Hibás név vagy jelszó' });
  });

  it('400-as hibakódot kellene visszakapnia, ha a jelszó helytelen', async () => {
    const mockUser = {
      Vasarlo_ID: 1,
      Nev: 'TesztUser',
      Jelszo: 'hashedPassword',
      Email: 'teszt@example.com'
    };
    db.query.mockImplementation((sql, params, callback) => {
      callback(null, [mockUser]);
    });

    // Mock hibás jelszó
    bcrypt.compare.mockResolvedValue(false);

    const response = await request(app)
      .post('/login')
      .send({ Nev: 'TesztUser', Jelszo: 'rosszJelszo' });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Hibás név vagy jelszó' });
  });
});