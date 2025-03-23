import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class ProfilService {

  constructor(private http:HttpClient) { }

  private felhasznalourl="http://localhost:3000/userinfo";
  private rendelesekurl="http://localhost:3000/userorders";
  private rendelesadatokurl="http://localhost:3000/userorders/details";

  getvasarloinfo(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.http.get<any>(this.felhasznalourl,{ headers: { Authorization: token } });
  }

  getrendelesek(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return this.http.get<any>(this.rendelesekurl, { headers: { Authorization: token } });
  }

  

}
