import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable,of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EladoRendelesReszletesService {

  constructor(private http:HttpClient) { }

  private apiurl1="http://localhost:3000/admin/teljesosszeg";
  private apiurl2="http://localhost:3000/admin/orderdetails/userinf";
  private apiurl3="http://localhost:3000/admin/sendstatus";
  private apiurl4="http://localhost:3000/admin/statusz";
  getRendelesReszletek(rendelesId: number):Observable<any>{
    const token2 = localStorage.getItem('token2'); 
    
    if (!token2) {
      return of([]); // Üres tömböt adunk vissza Observable-ként
    }
   return this.http.get<any>(`http://localhost:3000/admin/orderdetails/products/${rendelesId}`, { headers: { Authorization: token2 } })
     
    }

    getrendelesosszeg(rendelesId: number):Observable<any>{
      const token2 = localStorage.getItem('token2'); 
      if (!token2) {
        return of([]); 
      }
      return this.http.get<any>(`${this.apiurl1}/${rendelesId}`, { headers: { Authorization: token2 } })
    }

    getrendeloadatai(rendelesId:number):Observable<any>{
      const token2 = localStorage.getItem('token2');
      if (!token2) {
        return of([]); 
      }
      return this.http.get<any>(`${this.apiurl2}/${rendelesId}`, { headers: { Authorization: token2 } })
    }

    sendstatus(status:string,rendelesId:number,Megrendelo_email:string):Observable<any>{
      const token2 = localStorage.getItem('token2');
      if (!token2) {
        return of([]);
      }
      return this.http.put<any>(`${this.apiurl3}/${rendelesId}`,{Statusz:status,Megrendelo_email:Megrendelo_email}, { headers: { Authorization: token2 } })
    
    }

    getstatus(rendelesId:number){
      const token2 = localStorage.getItem('token2');
      if (!token2) {
        return of([]); 
      }
      return this.http.get<any>(`${this.apiurl4}/${rendelesId}`, { headers: { Authorization: token2 } })
    
    }
}
