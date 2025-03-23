import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EladoRendelesekService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'http://localhost:3000/orders';

  getrendelesek(): Observable<any> {
    const token2 = localStorage.getItem('token2');
    if (!token2) return null;
    return this.http.get<any>(this.apiUrl, { headers: { Authorization: token2 } });
  }

}
