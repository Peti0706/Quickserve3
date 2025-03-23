import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VasarloAuthService {

  constructor(private http:HttpClient,private router:Router) { }

  private user_apiurl="http://localhost:3000/user";
  private apiUrl = 'http://localhost:3000';



  register(vasarlo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, vasarlo);
  }

  login(vasarlo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, vasarlo);
  }

  logout() {
    localStorage.removeItem('token');
    
  }



  getvasarlo(): Observable<any> | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.http.get(`${this.user_apiurl}`, { headers: { Authorization: token } });
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }


  
  private vasarloFrissites = new Subject<void>();

  vasarloFrissites$ = this.vasarloFrissites.asObservable();

  triggerLoadVasarlo() {
    this.vasarloFrissites.next();
  }



}
