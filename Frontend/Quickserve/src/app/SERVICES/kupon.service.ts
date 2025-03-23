import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KuponService {

  constructor(private http:HttpClient) { }


  private apiUrl = 'http://localhost:3000/admin/kuponok';

getKuponok(): Observable<any> {
  const token2 = localStorage.getItem('token2');
  if (!token2) return null;
  return this.http.get<any>(this.apiUrl, { headers: { Authorization: token2 } });
}

addKupon(Kuponkod:string,Arengedmeny:number): Observable<any> {
  const token2 = localStorage.getItem('token2');
  if (!token2) return null;
  return this.http.post<any>(this.apiUrl, {Kuponkod,Arengedmeny}, { headers: { Authorization: token2 } });
}


deleteKupon(Kuponid:number):Observable<any>{
  const token2 = localStorage.getItem('token2');
  if (!token2) return null;
  return this.http.delete<any>(`${this.apiUrl}/${Kuponid}`, { headers: { Authorization: token2 } });
}


}

