import { Component, OnInit } from '@angular/core';
import { JsonDataService } from './json-data.service';
import { stringify } from 'querystring';
import {FirebaseService} from './firebase.service';
import {KeresesEredmeny} from './kereses-eredmeny';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

 

  constructor (private firebaseService: FirebaseService,private appService: JsonDataService){

  }

  title = 'SzegedTransport';
  trip_headsign:string;

  idopontValt:string[];
  atalakitva:Number;
  jarmuSzam:string;
  public resultTrip;
  public resultJarmuSzam;
  public resultIdopontok = [];
  public time:any;

  public trips;
  public agency;
  public calendar;
  public calendar_dates;
  public shapes;
  public stop_times;
  public stops;
  public routes;

  public routesLista = [];

  ngOnInit(){
    this.appService.getAgency().subscribe(data =>{
      this.agency = data;
    }); 
    
    this.appService.getTrips().subscribe(data =>{
      this.trips = data;
    });
    this.appService.getCalendar().subscribe(data =>{
      this.calendar = data;
    });  
    this.appService.getCalendarDates().subscribe(data =>{
      this.calendar_dates = data;
    });  
    this.appService.getRoutes().subscribe(data =>{
      this.routes = data;
    });  
    this.appService.getShapes().subscribe(data =>{
      this.shapes = data;
    });  
    this.appService.getStopTimes().subscribe(data =>{
      this.stop_times = data;
    });  
    this.appService.getStops().subscribe(data =>{
      this.stops = data;
    });  


  }

  // útvonal fejléc alapján keres
  /*
  KeresesTrip(){
    if(this.trip_headsign != ""){
      this.resultTrip = this.trips.filter(res=>{
        return res.trip_headsign.match(this.trip_headsign);
      });
    }else if(this.trip_headsign == ""){
      this.ngOnInit();
    }
  }
*/
  public kezdoSign:string;
  public vegSign:string;
  public resultKezdoSign;
  public resultVegSign;
  public resultEloVegPont = [];
  public temp:string;  

tripIdVisszaad(id:string){
  for(let entry of this.trips){
    if(entry.trip_id == id){
      return entry;
    }
  }
}
stopIdVisszaad(id:string){
  for(let entry of this.stops){
    if(entry.stop_id == id){
      return entry;
    }
  }
}

tripANDstop(resultIdopontok){
  let tripANDstopKAPCS = [];
  for(let entry of resultIdopontok){
    tripANDstopKAPCS.push(this.tripIdVisszaad(entry.trip_id));
  }
  return tripANDstopKAPCS;
}

  ekkortolAtalakitva:number;
  eddigAtalakitva:number;
  depatureAtalakitva:number;
  ekkortol:string;
  eddig:string;
  //időpont alapján keres
 
  keresesEredmenyLista = [];
  keresesEredmenyLista2 = [];
  keresesEredmenyLista3 = [];
  
  idopontKeres(){
    this.resultIdopontok = [];
    this.keresesEredmenyLista = [];
    this.keresesEredmenyLista2 = [];
    this.keresesEredmenyLista3 = [];
   
    this.ekkortolAtalakitva= this.idoAtalakitas(this.ekkortol);
    this.eddigAtalakitva= this.idoAtalakitas(this.eddig);
    for (let entry of this.stop_times) {
      this.depatureAtalakitva= this.idoAtalakitas(entry.departure_time);
      if(this.depatureAtalakitva >= this.ekkortolAtalakitva && this.depatureAtalakitva <=  this.eddigAtalakitva){
        this.resultIdopontok.push(entry);
      }
    }

    
    for(let entry of this.resultIdopontok){
      let keresesEredmeny:KeresesEredmeny = new KeresesEredmeny;
      let trip = this.tripIdVisszaad(entry.trip_id);
      keresesEredmeny.indulas = entry.departure_time;
      keresesEredmeny.vegsoHely = trip.trip_headsign;
      keresesEredmeny.melyikJarat = trip.trip_id;
      keresesEredmeny.stopId = ""+entry.stop_id;
      this.keresesEredmenyLista.push(keresesEredmeny);
    }
    
    let nevhezId = ""+this.stopNevhezTartozoStopId(this.innen);
    for(let entry of this.keresesEredmenyLista){
      if(nevhezId == entry.stopId){
        this.keresesEredmenyLista2.push(entry);
      }
    }
    let tripNevhezId = ""+this.tripIdhezTartozoStop_timesTripId(this.ide);
    for(let entry of this.keresesEredmenyLista2){
      if(tripNevhezId == entry.melyikJarat){
        entry.induloHely = this.innen;
        this.keresesEredmenyLista3.push(entry);
      }
    }
  }

public innen;
public ide;
  
stopNevhezTartozoStopId(stopNev:string){
  for(let entry of this.stops){
    if(stopNev == entry.stop_name){
      return ""+entry.stop_id;
    }
  }
}
tripIdhezTartozoStop_timesTripId(tripNev:string){
  for(let entry of this.trips){
    if(tripNev == entry.trip_headsign){
      return ""+entry.trip_id;
    }
  }
}


 ora:number;
 perc:number;
 mp:number;
  idoAtalakitas(idopont:String):number{
        this.idopontValt=idopont.split(':',3);
        this.ora = parseInt(this.idopontValt[0],0);
        this.perc = parseInt(this.idopontValt[1],0);
      return this.ora*60+this.perc;
  }
}
