import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EladoAuthService {

  constructor(private http:HttpClient,private router:Router) { }

  private elado_apiurl="http://localhost:3000/admin/accountinf";
  private apiUrl = 'http://localhost:3000';



  register(elado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/elado/register`, elado);
  }

  login(elado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/elado/login`, elado);
  }

  logout() {
    localStorage.removeItem('token2');
    this.router.navigate(['/elado/login']);
  }



  getelado(): Observable<any> | null {
    const token2 = localStorage.getItem('token2');
    if (!token2) return null;
    return this.http.get(`${this.elado_apiurl}`, { headers: { Authorization: token2 } });
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token2');
  }


  
  

}
