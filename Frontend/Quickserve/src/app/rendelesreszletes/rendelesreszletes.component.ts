import { Component,OnInit } from '@angular/core';
import { ProfilService } from '../SERVICES/profil.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-rendelesreszletes',
  standalone: false,
  templateUrl: './rendelesreszletes.component.html',
  styleUrl: './rendelesreszletes.component.css'
})
export class RendelesreszletesComponent implements OnInit {
constructor(private profilService: ProfilService,private route: ActivatedRoute,private http:HttpClient) { }
rendelesId!: number;
Rendelesadatok:any[]=[];

teljesOsszeg: number;
Osszeg:number;
Kedvezmenyesosszeg:number;
Kedvezmeny:number;
getRendelesReszletek() {
  const token = localStorage.getItem('token'); // Feltételezve, hogy a token localStorage-ban van
  this.http.get<any[]>(`http://localhost:3000/userorders/details/${this.rendelesId}`, {
    headers: { Authorization: `${token}` }
  }).subscribe(data =>{
    this.Rendelesadatok = data;
    console.log(this.Rendelesadatok);
  });
}

getteljesosszeg(){
  const token = localStorage.getItem('token');
  this.http.get<any>(`http://localhost:3000/teljesosszeg/${this.rendelesId}`, {
    headers: { Authorization: `${token}` }
  }).subscribe(data =>{
    this.teljesOsszeg = data;
    this.Osszeg=this.teljesOsszeg[0].Osszeg;
    this.Kedvezmenyesosszeg=this.teljesOsszeg[0].Kedvezmenyes_osszeg;
    this.Kedvezmeny=this.teljesOsszeg[0].Kedvezmeny;
    console.log(this.teljesOsszeg);
    console.log(this.Kedvezmenyesosszeg);
   
    if (this.Osszeg && this.Osszeg > 0) {
      // 27% ÁFA számítás: bruttó / 1.27 = nettó
      this.Nettoosszeg = Math.round(this.Osszeg / 1.27);
      // ÁFA tartalom: bruttó - nettó
      this.Adoosszeg = Math.round(this.Osszeg - this.Nettoosszeg);
     
    } else {
      this.Nettoosszeg = null;
      this.Adoosszeg = null;
    }
    
   
  
  });
}

 // Alapértelmezett érték
  Nettoosszeg: number 
  Adoosszeg: number 
 







  ngOnInit(): void {
    this.rendelesId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.rendelesId);
    this.getRendelesReszletek();
    this.getteljesosszeg();
 
  }

}
