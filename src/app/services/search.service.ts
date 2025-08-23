import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SearchCriteria {
  tripType: string;
  fromAirport: string;
  toAirport: string;
  departureDate: Date | null;
  returnDate: Date | null;
  class: string;
  passengers: {
    adult: number;
    child: number;
    infant: number;
  };
  preferredAirline: string;
  transitAirport: string;
  filters: {
    refundable: boolean;
    nonStop: boolean;
    splitTicket: boolean;
  };
  passengerType: string;
  cityPairs?: Array<{
    origin: string;
    destination: string;
    departureDate: string;
    arrivalDate: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchCriteriaSubject = new BehaviorSubject<SearchCriteria | null>(null);
  public searchCriteria$ = this.searchCriteriaSubject.asObservable();

  constructor() {}

  setSearchCriteria(criteria: SearchCriteria): void {
    this.searchCriteriaSubject.next(criteria);
  }

  getSearchCriteria(): SearchCriteria | null {
    return this.searchCriteriaSubject.value;
  }

  clearSearchCriteria(): void {
    this.searchCriteriaSubject.next(null);
  }

  getTotalPassengers(criteria: SearchCriteria): number {
    return criteria.passengers.adult + criteria.passengers.child + criteria.passengers.infant;
  }

  isRoundTrip(criteria: SearchCriteria): boolean {
    return criteria.tripType === 'Round Trip';
  }

  isMultiCity(criteria: SearchCriteria): boolean {
    return criteria.tripType === 'Multi City';
  }
}
