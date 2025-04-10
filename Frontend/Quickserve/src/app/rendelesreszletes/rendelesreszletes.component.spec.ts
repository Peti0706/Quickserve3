import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RendelesreszletesComponent } from './rendelesreszletes.component';
import { ProfilService } from '../SERVICES/profil.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

describe('RendelesreszletesComponent', () => {
  let component: RendelesreszletesComponent;
  let httpClient: HttpClient;

  // Mock ActivatedRoute
  const mockActivatedRoute = {
    snapshot: {
      paramMap: {
        get: () => '1' // Teszt rendelesId = 1
      }
    }
  };

  beforeEach(async () => {
    // LocalStorage mock Jesttel
    jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('mock-token');

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        RendelesreszletesComponent,
        ProfilService,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        HttpClient
      ]
    }).compileComponents();

    component = TestBed.inject(RendelesreszletesComponent);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    // mockok visszaállítása
    jest.restoreAllMocks();
  });

  it('Létrekellene jönnie a komponensnek', () => {
    expect(component).toBeTruthy();
  });

  describe('getteljesosszeg', () => {
    it('Le kellene kérnie a rendelés részleteit és ki kell számítania a nettó és adóösszegeket', () => {
      const mockResponse = [{
        Osszeg: 1270,
        Kedvezmenyes_osszeg: 1000,
        Kedvezmeny: 270
      }];

      // HttpClient get metódus mockolása
      jest.spyOn(httpClient, 'get').mockReturnValue({
        subscribe: (callback: (data: any) => void) => callback(mockResponse)
      } as any);

      component.rendelesId = 1;
      component.getteljesosszeg();

      expect(httpClient.get).toHaveBeenCalledWith(
        'http://localhost:3000/teljesosszeg/1',
        { headers: { Authorization: 'mock-token' } }
      );
      expect(component.Osszeg).toBe(1270);
      expect(component.Kedvezmenyesosszeg).toBe(1000);
      expect(component.Kedvezmeny).toBe(270);
      expect(component.Nettoosszeg).toBe(1000); // 1270 / 1.27 ≈ 1000
      expect(component.Adoosszeg).toBe(270);   // 1270 - 1000 = 270
    });

    it('Null-ra kellene állítania a nettó és adóösszegeket, ha az Osszeg 0 vagy undefined', () => {
      const mockResponse = [{
        Osszeg: 0,
        Kedvezmenyes_osszeg: 0,
        Kedvezmeny: 0
      }];

      jest.spyOn(httpClient, 'get').mockReturnValue({
        subscribe: (callback: (data: any) => void) => callback(mockResponse)
      } as any);

      component.rendelesId = 1;
      component.getteljesosszeg();

      expect(component.Osszeg).toBe(0);
      expect(component.Nettoosszeg).toBeNull();
      expect(component.Adoosszeg).toBeNull();
    });

    it('Kezelnie kellene az undefined Osszeg-et a válaszban', () => {
      const mockResponse = [{
        Kedvezmenyes_osszeg: 1000,
        Kedvezmeny: 270
      }];

      jest.spyOn(httpClient, 'get').mockReturnValue({
        subscribe: (callback: (data: any) => void) => callback(mockResponse)
      } as any);

      component.rendelesId = 1;
      component.getteljesosszeg();

      expect(component.Osszeg).toBeUndefined();
      expect(component.Nettoosszeg).toBeNull();
      expect(component.Adoosszeg).toBeNull();
    });
  });
});