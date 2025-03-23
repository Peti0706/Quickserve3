import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface termekek{
  Cikkszam:number;
  Termeknev:string;
  Tipus:string;
  Egysegar:number;
  Kategoria:string;
  Kepurl:string;
}

@Injectable({
  providedIn: 'root'
})

export class FooldalService {

  constructor(private http:HttpClient) { }

private termekek_apiurl="http://localhost:3000/products";

private apiUrl = 'http://localhost:3000/api/kedvencek';

getTermekek(): Observable<any>{
  return this.http.get<any>(this.termekek_apiurl);
}



getKedvencek(): Observable<number[]> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return this.http.get<number[]>(this.apiUrl, { headers: { Authorization: token } });
}

addKedvenc(productId: string): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return this.http.post(this.apiUrl, { productId },{ headers: { Authorization: token } });
}

removeKedvenc(productId: string): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) return null;
  return this.http.delete(`${this.apiUrl}/${productId}`, { headers: { Authorization: token } });
}


}