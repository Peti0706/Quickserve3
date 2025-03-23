import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class KosarService {

  constructor() {
    this.loadFromLocalStorage();
    this.cartItemsSubject.next(this.cartItems);
   }

  private cartItems: any[] = []; // A kosárban lévő termékek tömbje
  private cartItemsSubject = new BehaviorSubject<any[]>([]); // Observable a változások követéséhez
  private storageKey = 'cartItems'

  // Termék hozzáadása a kosárhoz
  

  private loadFromLocalStorage() {
    const storedItems = localStorage.getItem(this.storageKey);
    this.cartItems = storedItems ? JSON.parse(storedItems) : [];
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.cartItems));
  }

  addToCart(termek: any) {
   // Ellenőrizzük, hogy a termék már a kosárban van-e (cikkszám alapján)
   const existingItem = this.cartItems.find(item => item.Cikkszam === termek.Cikkszam);
   if (existingItem) {
     // Ha már van, növeljük a mennyiséget
     existingItem.quantity = (existingItem.quantity || 1) + 1;
   } else {
     // Ha nincs, új elemként adjuk hozzá 1-es mennyiséggel
     const newItem = { ...termek, quantity: 1 };
     this.cartItems.push(newItem);
   }
    this.saveToLocalStorage();
    console.log('Kosár tartalma:', this.cartItems);
    this.cartItemsSubject.next([...this.cartItems]); // Értesítés a változásról
  }

  decreaseQuantity(cikkszam: string) {
    const item = this.cartItems.find(i => i.Cikkszam === cikkszam);
    if (item && item.quantity > 1) {
      item.quantity--;
      this.saveToLocalStorage();
      this.cartItemsSubject.next([...this.cartItems]);
    } else if (item && item.quantity === 1) {
      this.removeItem(cikkszam);
    }
  }

  increaseQuantity(cikkszam: string) {
    const item = this.cartItems.find(i => i.Cikkszam === cikkszam);
    if (item) {
      item.quantity = (item.quantity || 0) + 1; // Növeljük a mennyiséget
      this.saveToLocalStorage();
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }


  removeItem(cikkszam: string) {
    this.cartItems = this.cartItems.filter(item => item.Cikkszam !== cikkszam);
    this.saveToLocalStorage();
    this.cartItemsSubject.next([...this.cartItems]);
  }

  // Kosár tartalmának lekérdezése (Observable-ként)
  getCartItems() {
    
    return this.cartItemsSubject.asObservable();
    
  }

  getTotalPrice(): number {
   
    return this.cartItems.reduce((total, item) => {
     
      return total + (item.Egysegar * item.quantity);
    }, 0);
  }

  getNetPrice(): number {
    const totalPrice = this.getTotalPrice();
    return Math.round(totalPrice / 1.27); // Nettó ár = Bruttó / 1.27, kerekítve
  }

  getVatAmount(): number {
    const totalPrice = this.getTotalPrice();
    const netPrice = this.getNetPrice();
    return totalPrice - netPrice; // ÁFA = Bruttó - Nettó
  }

  clearCart() {
    this.cartItems = [];
    this.saveToLocalStorage();
    this.cartItemsSubject.next([...this.cartItems]);
  }

  }


