import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private apiURL = 'http://api.openweathermap.org/';
  private key = '6282fef3d0655d63618ec67c25d2d5d5';

  constructor(private http: HttpClient) {}

  getWeatherInformation(city: string) {
    let params = new HttpParams();
    params = params.set('q', city);
    params = params.set('appid', this.key);

    return this.http.get(`${this.apiURL}data/2.5/forecast`, { params }).pipe(map((res: any) => {
        return {
        city: res.city,
        weatherInfo: res.list
      };
    }));
  }
}
