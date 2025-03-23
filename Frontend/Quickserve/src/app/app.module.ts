import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooldalComponent } from './fooldal/fooldal.component';
import { NavbarComponent } from './navbar/navbar.component';
import { KosarComponent } from './kosar/kosar.component';
import { LoginComponent } from './login/login.component';
import { RegisztracioComponent } from './regisztracio/regisztracio.component';
import { ProfilComponent } from './profil/profil.component';
import { RendeleseimComponent } from './rendeleseim/rendeleseim.component';
import { RendelesreszletesComponent } from './rendelesreszletes/rendelesreszletes.component';
import { Eladoi1Component } from './eladoi-1/eladoi-1.component';
import { Eladoi2Component } from './eladoi-2/eladoi-2.component';
import { NemtalalhatoComponent } from './nemtalalhato/nemtalalhato.component';
import { RendelesElkuldveComponent } from './rendeles-elkuldve/rendeles-elkuldve.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


import { EladoLoginRegisztracioComponent } from './elado-login-regisztracio/elado-login-regisztracio.component';
import { FormsModule } from '@angular/forms';
import { VeglegesitoComponent } from './veglegesito/veglegesito.component';
import { NavbarEladoiComponent } from './navbar-eladoi/navbar-eladoi.component';

@NgModule({
  declarations: [
    AppComponent,
    FooldalComponent,
    NavbarComponent,
    KosarComponent,
    LoginComponent,
    RegisztracioComponent,
    ProfilComponent,
    RendeleseimComponent,
    RendelesreszletesComponent,
    Eladoi1Component,
    Eladoi2Component,
    NemtalalhatoComponent,
    RendelesElkuldveComponent,
    EladoLoginRegisztracioComponent,
    VeglegesitoComponent,
    NavbarEladoiComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    CommonModule,
    HttpClientModule
   
  ],
  providers: [],
  bootstrap: [AppComponent,NavbarComponent]
})
export class AppModule { }
