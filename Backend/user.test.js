// user.test.js
const request = require('supertest');
const app = require('./server'); // Az Express app elérési útja
const jwt = require('jsonwebtoken');

// Mockoljuk a jwt.verify függvényt
jest.mock('jsonwebtoken', () => ({
  verify: jest.fn()
}));




describe('GET /user', () => {
  beforeEach(() => {
    // Tisztítsuk a mockokat minden teszt előtt
    jest.clearAllMocks();
  });
  afterAll(() => {
    require('./database').end(); // Valódi kapcsolat lezárása, ha nem mockolod
  });

  it('401 hibakóddal kellene visszatérjen ha nem adtak meg tokent', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', ''); // Üres Authorization fejléc

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Nincs bejelentkezve' });
  });

  it('403 hibakóddal kellene visszatérnie a a token érvénytelen', async () => {
    // Mockoljuk a jwt.verify-t, hogy hibát adjon vissza
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error('Invalid token'), null);
    });

    const response = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer invalidtoken');

    expect(response.status).toBe(403);
    expect(response.body).toEqual({ message: 'Érvénytelen token' });
    expect(jwt.verify).toHaveBeenCalledWith('Bearer invalidtoken', 'secret', expect.any(Function));
  });

  it('a felhasználóval kellene visszatérnie ha a token érvényes', async () => {
    // Mockoljuk a jwt.verify-t, hogy sikeres dekódolást adjon vissza
    const decodedUser = { Nev: 'TesztUser', Vasarlo_ID: 1 };
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedUser);
    });

    const response = await request(app)
      .get('/user')
      .set('Authorization', 'Bearer validtoken');

    expect(response.status).toBe(200);
    expect(response.body).toBe('TesztUser');
    expect(jwt.verify).toHaveBeenCalledWith('Bearer validtoken', 'secret', expect.any(Function));
  });
});