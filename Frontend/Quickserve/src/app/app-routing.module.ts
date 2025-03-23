import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FooldalComponent } from './fooldal/fooldal.component';
import { LoginComponent } from './login/login.component';
import { RegisztracioComponent } from './regisztracio/regisztracio.component';
import { KosarComponent } from './kosar/kosar.component';
import { ProfilComponent } from './profil/profil.component';
import { RendeleseimComponent } from './rendeleseim/rendeleseim.component';
import { RendelesreszletesComponent } from './rendelesreszletes/rendelesreszletes.component';
import { Eladoi1Component } from './eladoi-1/eladoi-1.component';
import { Eladoi2Component } from './eladoi-2/eladoi-2.component';
import { NemtalalhatoComponent } from './nemtalalhato/nemtalalhato.component';
import { RendelesElkuldveComponent } from './rendeles-elkuldve/rendeles-elkuldve.component';
import { EladoLoginRegisztracioComponent } from './elado-login-regisztracio/elado-login-regisztracio.component';
import { VeglegesitoComponent } from './veglegesito/veglegesito.component';
const routes: Routes = [
  { path: '', component: FooldalComponent },
  { path: 'bejelentkezes', component: LoginComponent },
  { path: 'regisztracio', component: RegisztracioComponent },
  { path: 'kosar', component: KosarComponent },
  { path: 'profil', component: ProfilComponent },
  { path: 'rendeleseim', component: RendeleseimComponent },
  { path: 'reszletek/:id', component: RendelesreszletesComponent },
  { path: 'eladoi', component: Eladoi1Component },
  { path: 'elado/reszletek/:id', component: Eladoi2Component },
  { path: 'sikeresrendeles', component: RendelesElkuldveComponent },
  {path: 'elado/bejelentkezes', component: EladoLoginRegisztracioComponent },
  { path: 'rendelesosszesito', component: VeglegesitoComponent},
  {path:"**",component:NemtalalhatoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
