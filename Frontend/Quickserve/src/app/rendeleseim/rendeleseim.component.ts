import { Component,OnInit } from '@angular/core';
import { ProfilService } from '../SERVICES/profil.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rendeleseim',
  standalone: false,
  templateUrl: './rendeleseim.component.html',
  styleUrl: './rendeleseim.component.css'
})
export class RendeleseimComponent implements OnInit {
  constructor(private profilService: ProfilService,private router:Router) {}
  Felhasznalo: any = {};
  Rendelesek: any[]=[];
  loadProfil(): void {
    this.profilService.getvasarloinfo().subscribe(data => {
     
     this.Felhasznalo = data[0]; 
   
  });
  }

  loadRendelesek(): void {
    this.profilService.getrendelesek().subscribe(data => {
      this.Rendelesek = data;
      console.log(this.Rendelesek);
    });
  }

ngOnInit(): void {
  this.loadProfil();
  this.loadRendelesek();
}

megnezem(rendelesId: number) {
  this.router.navigate(['/reszletek', rendelesId]);
}

}
