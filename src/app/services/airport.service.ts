import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Airport {
  id: number;
  fs: string;
  iata_code: string;
  icao_code: string;
  local_code: string;
  airport_name: string;
  city_name: string;
  city_code: string;
  state_code: string;
  iso_country: string;
  country: string;
  region_name: string;
  time_zone: string;
  weather_zone: string;
  gmt_offset: number;
  latitude: number;
  longitude: number;
  alt: number;
  classification: number;
  active: number;
}

@Injectable({
  providedIn: 'root'
})
export class AirportService {
  private airports: Airport[] = [];
  private airportsLoaded = false;

  constructor(private http: HttpClient) {}

  loadAirports(): Observable<Airport[]> {
    if (this.airportsLoaded) {
      return of(this.airports);
    }

    return this.http.get<Airport[]>('assets/AirportData.json').pipe(
      map(airports => {
        this.airports = airports.filter(airport => 
          airport.active === 1 && 
          airport.iata_code && 
          airport.iata_code.length === 3
        );
        this.airportsLoaded = true;
        return this.airports;
      }),
      catchError(error => {
        console.error('Error loading airports:', error);
        return of([]);
      })
    );
  }

  searchAirports(query: string): Observable<Airport[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const searchTerm = query.toLowerCase().trim();
    
    return this.loadAirports().pipe(
      map(airports => {
        return airports.filter(airport => 
          airport.iata_code.toLowerCase().includes(searchTerm) ||
          airport.city_name.toLowerCase().includes(searchTerm) ||
          airport.airport_name.toLowerCase().includes(searchTerm) ||
          airport.country.toLowerCase().includes(searchTerm)
        ).slice(0, 10); // Limit to 10 results for performance
      })
    );
  }

  getAirportByCode(code: string): Airport | undefined {
    return this.airports.find(airport => 
      airport.iata_code === code.toUpperCase()
    );
  }

  formatAirportDisplay(airport: Airport): string {
    return `${airport.iata_code} - ${airport.city_name}, ${airport.country}`;
  }

  getAirportSuggestions(query: string): Observable<string[]> {
    return this.searchAirports(query).pipe(
      map(airports => airports.map(airport => this.formatAirportDisplay(airport)))
    );
  }
}
