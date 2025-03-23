import { Component } from '@angular/core';
import { VasarloAuthService } from '../SERVICES/vasarlo-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  nev: string = '';
  jelszo: string = '';
  hibauzenet: string = '';
  constructor(private authService: VasarloAuthService, private router: Router){
  }
  login() {
    if (!this.nev || !this.jelszo) {
      this.hibauzenet = "Kérlek töltsd ki az összes mezőt!";
      return;
    }

    this.authService.login({ Nev: this.nev, Jelszo: this.jelszo }).subscribe(
      (res: any) => {
        console.log("Bejelentkezési válasz:", res);
        localStorage.setItem('token', res.token);
        this.authService.triggerLoadVasarlo();
        
        this.router.navigate(['']);
      },
      err => {
        console.error("Hiba a bejelentkezésnél:", err);
        this.hibauzenet = "Hibás email vagy jelszó!";
      }
    );
  }







}
