import { Component,ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { EladoAuthService } from '../SERVICES/elado-auth.service';


@Component({
  selector: 'app-elado-login-regisztracio',
  standalone: false,
  templateUrl: './elado-login-regisztracio.component.html',
  styleUrl: './elado-login-regisztracio.component.css'
})
export class EladoLoginRegisztracioComponent{
  
  constructor(private eladoauthservice: EladoAuthService, private router: Router){
  }

  isRightPanelActive = false; 

  onSignUp(): void {
    this.isRightPanelActive = true; // Átvált regisztráció módra
  }

  onSignIn(): void {
    this.isRightPanelActive = false; // Visszaáll bejelentkezési módra
  }

    

    nev: string = '';
    password: string = '';
    errorMessage: string = '';
   
    login() {
      if (!this.nev || !this.password) {
        this.errorMessage = "Kérlek töltsd ki az összes mezőt!";
        return;
      }
  
      this.eladoauthservice.login({ Nev: this.nev, Jelszo: this.password }).subscribe(
        (res: any) => {
          console.log("Bejelentkezési válasz:", res);
          localStorage.setItem('token2', res.token);
          
          this.router.navigate(['/eladoi']);
        },
        err => {
          console.error("Hiba a bejelentkezésnél:", err);
          this.errorMessage = "Hibás email vagy jelszó!";
        }
      );
    }

    regNev: string = '';
  regEmail: string = '';
  regJelszo: string = '';
  regTelefonszam: string = '';
  regNyitvatartas: string = '';
  

  errorMessage2: string = '';

  register() {
    if (!this.regNev || !this.regEmail || !this.regJelszo || !this.regTelefonszam || !this.regNyitvatartas) {
      console.log(this.regNev,this.regJelszo,this.regTelefonszam,this.regNyitvatartas,this.regEmail);
      this.errorMessage2 = "Kérlek töltsd ki az összes mezőt!";
      return;
    }

    this.eladoauthservice.register({ Nev: this.regNev, Telefonszam: this.regTelefonszam, Nyitvatartas: this.regNyitvatartas,Email:this.regEmail, Jelszo: this.regJelszo}).subscribe(
      (res: any) => {
        console.log("Sikeres regisztráció:", res);
        alert("Sikeres regisztráció! Most már bejelentkezhetsz.");
       this.onSignIn();
      },
      err => {
        console.error("Hiba a regisztrációnál:", err);
        this.errorMessage2 = "Hiba történt a regisztráció során!";
      }
    );
  }


}
