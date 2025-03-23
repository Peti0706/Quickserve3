import { Component,OnInit } from '@angular/core';
import { ProfilService} from '../SERVICES/profil.service';
@Component({
  selector: 'app-profil',
  standalone: false,
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent implements OnInit {
constructor(private profilService: ProfilService) {}

Felhasznalo: any = {};

loadProfil(): void {
  this.profilService.getvasarloinfo().subscribe(data => {
   
   this.Felhasznalo = data[0]; 
 
});
}



ngOnInit(): void {
  this.loadProfil();
}



}