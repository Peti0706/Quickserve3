import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VasarloAuthService } from './vasarlo-auth.service';

describe('VasarloAuthService', () => {
  let service: VasarloAuthService;
  let httpMock: HttpTestingController;

  // Mock localStorage
  let store = {};
  const mockLocalStorage = {
    getItem: (key: string): string => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => (store[key] = value),
    removeItem: (key: string) => delete store[key],
    clear: () => (store = {}),
  };

  beforeEach(() => {
    // Mock localStorage Jest-tel
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(mockLocalStorage.getItem);
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(mockLocalStorage.setItem);
    jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(mockLocalStorage.removeItem);
    jest.spyOn(Storage.prototype, 'clear').mockImplementation(mockLocalStorage.clear);

    // Tesztmodul konfigurálása
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VasarloAuthService],
    });

    service = TestBed.inject(VasarloAuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ellenőrzi, hogy nincs függőben lévő HTTP kérés
    jest.restoreAllMocks(); // Visszaállítjuk a mockokat minden teszt után
  });

  describe('register', () => {
    it('POST kérést kellene küldenie a regisztrációhoz.', () => {
      const dummyVasarlo = { name: 'Teszt', email: 'teszt@example.com', password: 'jelszo' };
      const dummyResponse = { success: true };

      service.register(dummyVasarlo).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dummyVasarlo);
      req.flush(dummyResponse);
    });
  });

  describe('login', () => {
    it('POST kérést kellene küldenie a bejelentkezéshez.', () => {
      const dummyVasarlo = { email: 'teszt@example.com', password: 'jelszo' };
      const dummyResponse = { token: 'fake-token' };

      service.login(dummyVasarlo).subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dummyVasarlo);
      req.flush(dummyResponse);
    });
  });

  describe('logout', () => {
    it('El kellene távolítania a tokent a localStorage-ból', () => {
      mockLocalStorage.setItem('token', 'fake-token');
      service.logout();
      expect(mockLocalStorage.getItem('token')).toBeNull();
    });
  });

  describe('getvasarlo', () => {
    it('Null-t kellene visszaadnia, ha nincs jelen token', () => {
      mockLocalStorage.removeItem('token');
      const result = service.getvasarlo();
      expect(result).toBeNull();
    });

    it('GET kérést kellene küldenie a felhasználó lekérdezéséhez, ha a token jelen van', () => {
      const dummyToken = 'fake-token';
      const dummyResponse = { name: 'Teszt', email: 'teszt@example.com' };
      mockLocalStorage.setItem('token', dummyToken);

      service.getvasarlo().subscribe((response) => {
        expect(response).toEqual(dummyResponse);
      });

      const req = httpMock.expectOne('http://localhost:3000/user');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe(dummyToken);
      req.flush(dummyResponse);
    });
  });
});