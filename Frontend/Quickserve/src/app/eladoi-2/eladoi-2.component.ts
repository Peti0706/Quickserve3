import { Component,OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EladoRendelesReszletesService } from '../SERVICES/elado-rendeles-reszletes.service';
@Component({
  selector: 'app-eladoi-2',
  standalone: false,
  templateUrl: './eladoi-2.component.html',
  styleUrl: './eladoi-2.component.css'
})
export class Eladoi2Component implements OnInit {

  constructor(private route: ActivatedRoute,private reszletesservice:EladoRendelesReszletesService) { }

Termekek:any[]=[];
teljesosszeg:any[]=[];
Rendeloadatai:any[]=[];
Osszeg:number;
KedvezmenyesOsszeg:number;
Kuponkod:string="";
Megrendeles_ID:number;
Ujstatusz:string="";
MegrendeloEmail:string;
Statusz:string="";
Modositas_datuma:string="";
Szunet:string="";
getmegrendeles_id():number {
  return this.Megrendeles_ID;
}

getmegrendeloemail():string {
  return this.MegrendeloEmail;
}

statuszmodositas(ujstatusz:string){
this.Ujstatusz = ujstatusz;
this.Megrendeles_ID = this.getmegrendeles_id();
this.MegrendeloEmail = this.getmegrendeloemail();
this.reszletesservice.sendstatus(this.Ujstatusz,this.Megrendeles_ID,this.MegrendeloEmail).subscribe(res => {
  this.getrendelesstatusz();
});

alert("Sikeres módosítás!");
}

getrendelesstatusz(){
  const rendelesId = Number(this.route.snapshot.paramMap.get('id'));
this.reszletesservice.getstatus(rendelesId).subscribe(data => {
  this.Statusz = data[0].Statusz;
  this.Modositas_datuma = data[0].Modositas_datuma;
 
 console.log(data);
});
}

getrendelesreszletek(){
  const rendelesId = Number(this.route.snapshot.paramMap.get('id'));
 this.reszletesservice.getRendelesReszletek(rendelesId).subscribe(data => {
 this.Termekek = data;
 console.log(this.Termekek);
});
}

getRendelesOsszeg(){
  const rendelesId = Number(this.route.snapshot.paramMap.get('id'));
 this.reszletesservice.getrendelesosszeg(rendelesId).subscribe(data => {
 this.teljesosszeg = data;
 this.Osszeg = this.teljesosszeg[0].Osszeg;
 this.KedvezmenyesOsszeg = this.teljesosszeg[0].Kedvezmenyes_osszeg;
 this.Kuponkod = this.teljesosszeg[0].Kuponkod;
 this.Szunet = this.teljesosszeg[0].Szunet;
 console.log(this.teljesosszeg);
});

}

getRendeloadatai(){
  const rendelesId = Number(this.route.snapshot.paramMap.get('id'));
 this.reszletesservice.getrendeloadatai(rendelesId).subscribe(data => {
 this.Rendeloadatai = data;
 this.Megrendeles_ID = this.Rendeloadatai[0].Megrendeles_ID;
 this.MegrendeloEmail = this.Rendeloadatai[0].email;
 console.log(this.Rendeloadatai);
});
}

ngOnInit(): void {
  
  this.getrendelesreszletek();
  this.getRendelesOsszeg();
  this.getRendeloadatai();
  this.getrendelesstatusz();
}

}
