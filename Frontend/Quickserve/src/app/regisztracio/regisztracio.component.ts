import { Component } from '@angular/core';
import { VasarloAuthService } from '../SERVICES/vasarlo-auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-regisztracio',
  standalone: false,
  templateUrl: './regisztracio.component.html',
  styleUrl: './regisztracio.component.css'
})
export class RegisztracioComponent {

constructor(private router: Router, private VasarloAuthService: VasarloAuthService){}

  regNev: string = '';
  regEmail: string = '';
  regJelszo: string = '';
  regTelefonszam: string = '';
  regLakcim: string = '';
  regOsztaly: number = 9;

  errorMessage: string = '';

  register() {
    if (!this.regNev || !this.regEmail || !this.regJelszo || !this.regTelefonszam || !this.regLakcim) {
      console.log(this.regNev,this.regJelszo,this.regTelefonszam,this.regOsztaly,this.regLakcim,this.regEmail);
      this.errorMessage = "Kérlek töltsd ki az összes mezőt!";
      return;
    }

    this.VasarloAuthService.register({ Nev: this.regNev, Telefonszam: this.regTelefonszam, Lakcim: this.regLakcim,Email:this.regEmail, Jelszo: this.regJelszo, Osztaly: this.regOsztaly }).subscribe(
      (res: any) => {
        
        alert(res.message);
        this.router.navigate(['/bejelentkezes']);
      },
      err => {
        console.error("Hiba a regisztrációnál:", err);
        this.errorMessage = "Hiba történt a regisztráció során!";
      }
    );
  }


}
