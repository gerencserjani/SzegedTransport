import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class JsonDataService {

  constructor(private httpClient: HttpClient) { }

  getAgency(): Observable<any>{
   return this.httpClient.get('./assets/agency.json');
  }
  getCalendar(): Observable<any>{
    return this.httpClient.get('./assets/calendar.json');
   }
  getCalendarDates(): Observable<any>{
    return this.httpClient.get('./assets/calendar_dates.json');
   }
  getRoutes(): Observable<any>{
    return this.httpClient.get('./assets/routes.json');
   }
  getShapes(): Observable<any>{
    return this.httpClient.get('./assets/shapes.json');
   }
  getStopTimes(): Observable<any>{
    return this.httpClient.get('./assets/stop_times.json');
   }
  getStops(): Observable<any>{
    return this.httpClient.get('./assets/stops.json');
   }
  getTrips(): Observable<any>{
    return this.httpClient.get('./assets/trips.json');
   }

}
