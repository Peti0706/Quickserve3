import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RendelesService {

  private apiUrl = 'http://localhost:3000/sendorder';
  private apiUrl2 = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  sendOrder(data: { items: any[], totalDiscountedPrice: number,Discount:number,Discountcode:string}): Observable<any> {
    const token = localStorage.getItem('token'); 
    if (!token) return null;
    return this.http.post(this.apiUrl, data, { headers : { 'Authorization':token } }

    )};

    checkCoupon(couponCode: string): Observable<any> {
      return this.http.post(`${this.apiUrl2}/checkcoupon`, { couponCode });
    }
  }



