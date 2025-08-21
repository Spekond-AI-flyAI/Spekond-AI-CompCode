import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { SearchService, SearchCriteria } from '../services/search.service';

export interface FlightItinerary {
  id: number;
  priceOnlyPTC: boolean;
  fromLocation: any;
  toLocation: any;
  splitPricingInformationList: any;
  groupingMap: any;
  seamen: boolean;
  fareSourceCode: any;
  pricingMessage: any;
  pricingInformation: any;
}

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  searchCriteria: SearchCriteria | null = null;
  flightResults: FlightItinerary[] = [];
  filteredResults: FlightItinerary[] = [];
  loading = true;
  error = false;

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchCriteria = this.searchService.getSearchCriteria();
    
    if (!this.searchCriteria) {
      // No search criteria, redirect back to search
      this.router.navigate(['/search']);
      return;
    }

    this.loadFlightResults();
  }

  loadFlightResults() {
    this.loading = true;
    this.error = false;

    this.http.get<FlightItinerary[]>('assets/FlightItineraryList.json').pipe(
      map(results => {
        this.flightResults = results;
        this.filterResults();
        this.loading = false;
        return results;
      }),
      catchError(error => {
        console.error('Error loading flight results:', error);
        this.loading = false;
        this.error = true;
        return of([]);
      })
    ).subscribe();
  }

  private filterResults() {
    if (!this.searchCriteria) {
      this.filteredResults = this.flightResults;
      return;
    }

    // Simple filtering based on search criteria
    // In a real application, you would implement more sophisticated filtering logic
    this.filteredResults = this.flightResults.filter(itinerary => {
      // Basic filtering - you can enhance this based on your specific requirements
      if (this.searchCriteria!.filters.nonStop && this.hasStops(itinerary)) {
        return false;
      }
      
      if (this.searchCriteria!.filters.refundable && !this.isRefundable(itinerary)) {
        return false;
      }

      // Add more filtering logic as needed
      return true;
    });

    // Limit results for performance
    this.filteredResults = this.filteredResults.slice(0, 50);
  }

  private hasStops(itinerary: FlightItinerary): boolean {
    // Implement logic to check if itinerary has stops
    // This is a placeholder - implement based on your data structure
    return false;
  }

  private isRefundable(itinerary: FlightItinerary): boolean {
    // Implement logic to check if itinerary is refundable
    // This is a placeholder - implement based on your data structure
    return true;
  }

  getTotalPassengers(): number {
    if (!this.searchCriteria) return 0;
    return this.searchCriteria.passengers.adult + 
           this.searchCriteria.passengers.child + 
           this.searchCriteria.passengers.infant;
  }

  formatDate(date: Date | null): string {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  goBackToSearch() {
    this.router.navigate(['/search']);
  }

  clearSearch() {
    this.searchService.clearSearchCriteria();
    this.router.navigate(['/search']);
  }

  getSearchSummary(): string {
    if (!this.searchCriteria) return '';
    
    const from = this.searchCriteria.fromAirport;
    const to = this.searchCriteria.toAirport;
    const date = this.formatDate(this.searchCriteria.departureDate);
    const passengers = this.getTotalPassengers();
    
    return `${from} → ${to} • ${date} • ${passengers} passenger${passengers !== 1 ? 's' : ''}`;
  }

  trackByResult(index: number, result: FlightItinerary): number {
    return result.id;
  }
}
