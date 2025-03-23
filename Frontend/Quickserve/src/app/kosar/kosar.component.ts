import { Component,OnInit } from '@angular/core';
import { KosarService } from '../SERVICES/kosar.service';
import { ProfilService } from '../SERVICES/profil.service';


@Component({
  selector: 'app-kosar',
  standalone: false,
  templateUrl: './kosar.component.html',
  styleUrl: './kosar.component.css'
})
export class KosarComponent implements OnInit {
  
  constructor(private kosarservice:KosarService,private profilService:ProfilService) { }

  public Kosar: any[] = [];
  Felhasznalo: any = {};

  loadProfil(): void {
    this.profilService.getvasarloinfo().subscribe(data => {
     
     this.Felhasznalo = data[0]; 
   
  });
  }

  ngOnInit() {
    
    this.kosarservice.getCartItems().subscribe(items => {
      this.Kosar = items;  // Frissítjük a kosár tartalmát
     
    });
    this.loadProfil(); 
  }

  csokkentes(cikkszam: string) {
    this.kosarservice.decreaseQuantity(cikkszam);
  }

  noveles(cikkszam: string) {
    this.kosarservice.increaseQuantity(cikkszam);
  }

  termektorles(cikkszam: string) {
    this.kosarservice.removeItem(cikkszam);
  }

  getteljesar(): number {
    return this.kosarservice.getTotalPrice();
  }

  getnettoar(): number {
    return this.kosarservice.getNetPrice();
  }

  getado(): number {
    return this.kosarservice.getVatAmount();
  }

}
