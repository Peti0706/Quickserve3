import { TestBed } from '@angular/core/testing';
import { KosarComponent } from './kosar.component';
import { KosarService } from '../SERVICES/kosar.service';
import { ProfilService } from '../SERVICES/profil.service';
import { of } from 'rxjs';

describe('KosarComponent', () => {
  let component: KosarComponent;
  let kosarService: jest.Mocked<KosarService>;
  let profilService: jest.Mocked<ProfilService>;

  beforeEach(async () => {
    // Mock szolgáltatások létrehozása Jesttel
    const kosarServiceMock = {
      getCartItems: jest.fn(),
      decreaseQuantity: jest.fn(),
      increaseQuantity: jest.fn(),
      removeItem: jest.fn(),
      getTotalPrice: jest.fn(),
      getNetPrice: jest.fn(),
      getVatAmount: jest.fn()
    } as unknown as jest.Mocked<KosarService>; // Típuskényszerítés

    const profilServiceMock = {
      getvasarloinfo: jest.fn()
    } as unknown as jest.Mocked<ProfilService>; // Típuskényszerítés

    await TestBed.configureTestingModule({
      providers: [
        KosarComponent,
        { provide: KosarService, useValue: kosarServiceMock },
        { provide: ProfilService, useValue: profilServiceMock }
      ]
    }).compileComponents();

    component = TestBed.inject(KosarComponent);
    kosarService = TestBed.inject(KosarService) as jest.Mocked<KosarService>;
    profilService = TestBed.inject(ProfilService) as jest.Mocked<ProfilService>;
  });

  it('Létrekellene jönnie', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('Be kellene töltenie a kosár elemeit és a felhasználói profilt', () => {
      const mockCartItems = [{ cikkszam: '123', nev: 'Termék', mennyiseg: 2, ar: 500 }];
      const mockProfilData = [{ nev: 'Teszt Felhasználó', email: 'teszt@example.com' }];

      kosarService.getCartItems.mockReturnValue(of(mockCartItems));
      profilService.getvasarloinfo.mockReturnValue(of(mockProfilData));

      component.ngOnInit();

      expect(kosarService.getCartItems).toHaveBeenCalled();
      expect(profilService.getvasarloinfo).toHaveBeenCalled();
      expect(component.Kosar).toEqual(mockCartItems);
      expect(component.Felhasznalo).toEqual(mockProfilData[0]);
    });
  });

  describe('csokkentes', () => {
    it('Meg kellene hívnia a decreaseQuantity-t a kosarService-en', () => {
      const cikkszam = '123';
      component.csokkentes(cikkszam);
      expect(kosarService.decreaseQuantity).toHaveBeenCalledWith(cikkszam);
    });
  });

  describe('noveles', () => {
    it('Meg kellene hívnia az increaseQuantity-t a kosarService-en', () => {
      const cikkszam = '123';
      component.noveles(cikkszam);
      expect(kosarService.increaseQuantity).toHaveBeenCalledWith(cikkszam);
    });
  });

  describe('termektorles', () => {
    it('Meg kellene hívnia a removeItem-et a kosarService-en', () => {
      const cikkszam = '123';
      component.termektorles(cikkszam);
      expect(kosarService.removeItem).toHaveBeenCalledWith(cikkszam);
    });
  });

  describe('getteljesar', () => {
    it('Vissza kellene adnia a teljes árat a kosarService-től', () => {
      kosarService.getTotalPrice.mockReturnValue(1000);
      const result = component.getteljesar();
      expect(kosarService.getTotalPrice).toHaveBeenCalled();
      expect(result).toBe(1000);
    });
  });

  describe('getnettoar', () => {
    it('Vissza kellene adnia a nettó árat a kosarService-től', () => {
      kosarService.getNetPrice.mockReturnValue(787);
      const result = component.getnettoar();
      expect(kosarService.getNetPrice).toHaveBeenCalled();
      expect(result).toBe(787);
    });
  });

  describe('getado', () => {
    it('Vissza kellene adnia az ÁFA összegét a kosarService-től', () => {
      kosarService.getVatAmount.mockReturnValue(213);
      const result = component.getado();
      expect(kosarService.getVatAmount).toHaveBeenCalled();
      expect(result).toBe(213);
    });
  });
});