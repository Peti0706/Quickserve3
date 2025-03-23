import { Component,OnInit } from '@angular/core';
import { EladoAuthService } from '../SERVICES/elado-auth.service';
import { EladoRendelesekService } from '../SERVICES/elado-rendelesek.service';
import { __makeTemplateObject } from 'tslib';
import { format, toZonedTime } from 'date-fns-tz';
import { hu, th } from 'date-fns/locale';
import { interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { KuponService } from '../SERVICES/kupon.service';
@Component({
  selector: 'app-eladoi-1',
  standalone: false,
  templateUrl: './eladoi-1.component.html',
  styleUrl: './eladoi-1.component.css'
})
export class Eladoi1Component implements OnInit {

  nap: string;
  datum: string;
  ido: string;
  private pollingSubscription: Subscription;


  Idobeallitas() {
    const now = new Date();
    const idozona = 'Europe/Budapest'; 
    const zonedDate = toZonedTime(now, idozona);

    this.nap = format(zonedDate, 'EEEE', { locale: hu });
    this.datum = format(zonedDate, 'yyyy. MM. dd.', { locale: hu }); 
    this.ido = format(zonedDate, 'HH:mm:ss', { locale: hu }); 
  }

constructor(private eladoauthservice: EladoAuthService,private rendelesService: EladoRendelesekService,private router: Router,private kuponservice: KuponService){
  this.Idobeallitas();
    setInterval(() => this.Idobeallitas(), 1000);
}

Elado:any[]=[];
Rendelesek:any[]=[];

Kuponok:any[]=[];


getElado(){
  this.eladoauthservice.getelado().subscribe((data)=>{
    this.Elado = data;
    console.log(this.Elado);
  
  })
}

getRendelesek(){
  this.rendelesService.getrendelesek().subscribe(data=>{
    this.Rendelesek = data;
    console.log(this.Rendelesek);
  })

}



getNyitvatartas(index:number) {
  const [napok, idok] = this.Elado[index].nyitvatartas.split(';');
  return { napok, idok };
}

megnezem(rendelesId: number) {
  this.router.navigate(['/elado/reszletek', rendelesId]);
}

getKuponok(){
  this.kuponservice.getKuponok().subscribe(data=>{
    this.Kuponok = data;
    console.log(this.Kuponok);
  })
}

Kuponkod:string='';
Arengedmeny:number=1;
kuponerror:string='';
AddKupon(){
  if(this.Kuponkod.length==0 || this.Arengedmeny==0){
    this.kuponerror="Mindkét mező kitöltése kötelező!";
    return;
  }
this.kuponservice.addKupon(this.Kuponkod,this.Arengedmeny).subscribe((res:any)=>{
  
  this.getKuponok();
  alert(res.message);
  
},
err=>{
alert("Ez a kupon már létezik!");
});


}

DeleteKupon(Kuponid:number){
  this.kuponservice.deleteKupon(Kuponid).subscribe(res=>{
    
    this.getKuponok()
    alert(res.message);
    
  })
  
}


ngOnInit(): void {
  this.getElado();
  this.getRendelesek();
  this.pollingSubscription = interval(5000).subscribe(() => {
    this.getRendelesek();
  });
  this.getKuponok();
}



ngOnDestroy() {
  // Leiratkozás az intervallumról, hogy ne fusson feleslegesen
  if (this.pollingSubscription) {
    this.pollingSubscription.unsubscribe();
  }
}

}
