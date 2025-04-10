import { Component,OnInit } from '@angular/core';
import { ProfilService} from '../SERVICES/profil.service';
import { KosarService } from '../SERVICES/kosar.service';
import { RendelesService } from '../SERVICES/rendeles.service';
import { Router } from '@angular/router'
@Component({
  selector: 'app-veglegesito',
  standalone: false,
  templateUrl: './veglegesito.component.html',
  styleUrl: './veglegesito.component.css'
})
export class VeglegesitoComponent {

constructor(private profilService:ProfilService,private kosarservice:KosarService,private rendelesservice:RendelesService,private router:Router) { }
Felhasznaloemail:string = null;
Felhasznalo: any = {};
Kosar:any[]=[];
public orderSuccessMessage: string | null = null;
  public orderErrorMessage: string | null = null;
  public selectedSzunet: number | null = null;
  public selectedPaymentMethod: string = 'Készpénz';
  public couponCode: string = '';
  public discount: number = 0;
  public discountcode: string;
loadProfil(): void {
  this.profilService.getvasarloinfo().subscribe(data => {
   
   this.Felhasznalo = data[0]; 
    this.Felhasznaloemail = data[2];
  
});
}

getfelhasznaloemail():string{
  return this.Felhasznaloemail;

}

getKosar():void{
  this.kosarservice.getCartItems().subscribe(items => {
    this.Kosar = items;
    console.log(items);
  });
}


ngOnInit(): void {
  this.loadProfil();
  this.getKosar();
  
}

getTotalPrice(): number {
  return this.kosarservice.getTotalPrice();
}

getDiscountedTotalPrice(): number {
  const totalPrice = this.getTotalPrice();
  const discountAmount = totalPrice * (this.discount / 100);
  return Math.round(totalPrice - discountAmount); // Kerekített végösszeg
}

getDiscount():number{
  return this.discount;

}

getDiscountcode(): string {
  return this.discountcode;
}

getNetPrice(): number {
  return this.kosarservice.getNetPrice();
}

getDiscountedNetPrice(): number {
  return Math.round(this.getDiscountedTotalPrice() / 1.27);
}

getVatAmount(): number {
  return this.kosarservice.getVatAmount();
}

getDiscountedVatAmount(): number {
  return this.getDiscountedTotalPrice() - this.getDiscountedNetPrice();
}

checkCoupon() {
  if (!this.couponCode) {
    this.orderErrorMessage = 'Kérlek add meg a kuponkódot!';
    setTimeout(() => this.orderErrorMessage = null, 3000);
    return;
  }

  this.rendelesservice.checkCoupon(this.couponCode).subscribe({
    next: (response) => {
      this.discount = response.discount; // A kedvezmény százaléka
      this.discountcode = response.discountcode;
      this.orderSuccessMessage = `Kuponkód elfogadva! ${this.discount}% kedvezmény alkalmazva.`;
      setTimeout(() => this.orderSuccessMessage = null, 3000);
    },
    error: (err) => {
      this.discount = 0; // Kedvezmény visszaállítása, ha érvénytelen
      this.orderErrorMessage = err.error?.message || 'Érvénytelen kuponkód!';
      setTimeout(() => this.orderErrorMessage = null, 3000);
    }
  });
}

private generateShortOrderId(): number {
  const now = new Date();
  const datePart = parseInt(now.toISOString().slice(0, 10).replace(/-/g, ''), 10); // Pl. 20250227
  const randomPart = Math.floor(Math.random() * 1000); // Pl. 456
  return datePart * 1000 + randomPart; // Pl. 20250227456
}


submitOrder() {
  if (this.Kosar.length === 0) {
    this.orderErrorMessage = 'A kosár üres, nem lehet rendelést leadni!';
    setTimeout(() => this.orderErrorMessage = null, 3000);
    return;
  }

  if (this.selectedSzunet === null) {
    this.orderErrorMessage = 'Kérlek válassz egy szünetet!';
    setTimeout(() => this.orderErrorMessage = null, 3000);
    return;
  }

  if (!this.selectedPaymentMethod) {
    this.orderErrorMessage = 'Kérlek válassz fizetési módot!';
    setTimeout(() => this.orderErrorMessage = null, 3000);
    return;
  }

  // Egyedi Megrendeles_ID generálása (pl. timestamp + random)
  const now = new Date();
  const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

 const megrendelesId = this.generateShortOrderId();
  // Kosár tételek formázása az API-nak
  const orderItems = this.Kosar.map(item => ({
    Megrendeles_ID: megrendelesId,
    Cikkszam: item.Cikkszam,
    Datum: currentDate,
    Mennyiseg: item.quantity,
    Szunet: Number(this.selectedSzunet),
    Fizetesi_mod: this.selectedPaymentMethod,
    Termeknev:item.Termeknev,
    Tipus: item.Tipus
  }));

 
  

  const totalDiscountedPrice = this.getDiscountedTotalPrice();
  const Discount= this.getDiscount();
  const Discountcode= this.getDiscountcode();;

  this.rendelesservice.sendOrder({ items: orderItems, totalDiscountedPrice,Discount,Discountcode }).subscribe({
    next: (response) => {
      this.orderSuccessMessage = response.message || 'Rendelés sikeresen leadva!';
      this.kosarservice.clearCart(); // Kosár kiürítése sikeres rendelés után
      this.selectedSzunet = null;
      this.selectedPaymentMethod = 'Készpénz';
      this.orderSuccessMessage = null;
        this.router.navigate(['/sikeresrendeles']);
    
    },
    error: (err) => {
      this.orderErrorMessage = err.error?.message || 'Hiba történt a rendelés leadásakor!';
      setTimeout(() => this.orderErrorMessage = null, 3000);
    }
  });
}

}
