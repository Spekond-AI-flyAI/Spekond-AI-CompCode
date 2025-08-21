import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AirportService, Airport } from '../services/airport.service';
import { SearchService, SearchCriteria } from '../services/search.service';

interface PassengerCounts {
  adult: number;
  child: number;
  infant: number;
}

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  flightSearchForm: FormGroup;
  tripTypes = ['One Way', 'Round Trip', 'Multi City'];
  selectedTripType = 'One Way';
  
  classes = ['Economy', 'Premium Economy', 'Business', 'First Class'];
  
  passengerCounts: PassengerCounts = {
    adult: 1,
    child: 0,
    infant: 0
  };

  filters = {
    refundable: false,
    nonStop: false,
    splitTicket: false
  };

  // Passenger type
  selectedPassengerType = 'seamen';

  // Airport autocomplete
  filteredFromAirports: Observable<Airport[]>;
  filteredToAirports: Observable<Airport[]>;
  airports: Airport[] = [];

  constructor(
    private fb: FormBuilder,
    private airportService: AirportService,
    private searchService: SearchService,
    private router: Router
  ) {
    this.flightSearchForm = this.fb.group({
      fromAirport: ['', Validators.required],
      toAirport: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [''],
      class: ['Economy', Validators.required],
      preferredAirline: [''],
      transitAirport: [''],
      nationality: [''],
      searchNearestAirport: [''],
      searchType: ['from']
    });
  }

  ngOnInit() {
    this.setupAirportAutocomplete();
    this.setDefaultDates();
    this.loadAirports();
  }

  private loadAirports() {
    this.airportService.loadAirports().subscribe(airports => {
      this.airports = airports;
    });
  }

  private setupAirportAutocomplete() {
    this.filteredFromAirports = this.flightSearchForm.get('fromAirport')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAirports(value))
    );

    this.filteredToAirports = this.flightSearchForm.get('toAirport')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterAirports(value))
    );
  }

  private _filterAirports(value: string): Airport[] {
    if (typeof value === 'string') {
      const filterValue = value.toLowerCase();
      return this.airports.filter(airport => 
        airport.iata_code.toLowerCase().includes(filterValue) ||
        airport.city_name.toLowerCase().includes(filterValue) ||
        airport.airport_name.toLowerCase().includes(filterValue) ||
        airport.country.toLowerCase().includes(filterValue)
      ).slice(0, 10);
    }
    return [];
  }

  private setDefaultDates() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    this.flightSearchForm.patchValue({
      departureDate: tomorrow.toISOString().split('T')[0]
    });
  }

  selectTripType(type: string) {
    this.selectedTripType = type;
    if (type === 'One Way') {
      this.flightSearchForm.get('returnDate')?.clearValidators();
      this.flightSearchForm.get('returnDate')?.updateValueAndValidity();
      this.flightSearchForm.patchValue({ returnDate: null });
    } else {
      this.flightSearchForm.get('returnDate')?.setValidators(Validators.required);
      this.flightSearchForm.get('returnDate')?.updateValueAndValidity();
    }
  }

  selectPassengerType(type: string) {
    this.selectedPassengerType = type;
  }

  updatePassengerCount(type: keyof PassengerCounts, increment: boolean) {
    if (increment) {
      if (type === 'adult' && this.passengerCounts.adult < 9) {
        this.passengerCounts.adult++;
      } else if (type === 'child' && this.passengerCounts.child < 8) {
        this.passengerCounts.child++;
      } else if (type === 'infant' && this.passengerCounts.infant < this.passengerCounts.adult) {
        this.passengerCounts.infant++;
      }
    } else {
      if (type === 'adult' && this.passengerCounts.adult > 1) {
        this.passengerCounts.adult--;
        // Ensure infants don't exceed adults
        if (this.passengerCounts.infant > this.passengerCounts.adult) {
          this.passengerCounts.infant = this.passengerCounts.adult;
        }
      } else if (type === 'child' && this.passengerCounts.child > 0) {
        this.passengerCounts.child--;
      } else if (type === 'infant' && this.passengerCounts.infant > 0) {
        this.passengerCounts.infant--;
      }
    }
  }

  onAdultChange(event: any) {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 1 && value <= 9) {
      this.passengerCounts.adult = value;
      // Ensure infants don't exceed adults
      if (this.passengerCounts.infant > this.passengerCounts.adult) {
        this.passengerCounts.infant = this.passengerCounts.adult;
      }
    }
  }

  onChildChange(event: any) {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= 8) {
      this.passengerCounts.child = value;
    }
  }

  onInfantChange(event: any) {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= this.passengerCounts.adult) {
      this.passengerCounts.infant = value;
    }
  }

  getTotalPassengers(): number {
    return this.passengerCounts.adult + this.passengerCounts.child + this.passengerCounts.infant;
  }

  displayAirport(airport: Airport): string {
    return airport ? this.airportService.formatAirportDisplay(airport) : '';
  }

  onSearch() {
    if (this.flightSearchForm.valid) {
      const searchCriteria: SearchCriteria = {
        tripType: this.selectedTripType,
        fromAirport: this.flightSearchForm.get('fromAirport')?.value || '',
        toAirport: this.flightSearchForm.get('toAirport')?.value || '',
        departureDate: this.flightSearchForm.get('departureDate')?.value,
        returnDate: this.flightSearchForm.get('returnDate')?.value,
        class: this.flightSearchForm.get('class')?.value || 'Economy',
        passengers: { ...this.passengerCounts },
        preferredAirline: this.flightSearchForm.get('preferredAirline')?.value || '',
        transitAirport: this.flightSearchForm.get('transitAirport')?.value || '',
        filters: { ...this.filters },
        passengerType: this.selectedPassengerType
      };

      // Store search criteria in service
      this.searchService.setSearchCriteria(searchCriteria);
      
      // Navigate to results page
      this.router.navigate(['/results']);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.flightSearchForm.controls).forEach(key => {
      const control = this.flightSearchForm.get(key);
      control?.markAsTouched();
    });
  }

  // Helper method to check if form field is invalid
  isFieldInvalid(fieldName: string): boolean {
    const field = this.flightSearchForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  // Helper method to get field error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.flightSearchForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) {
        return 'This field is required';
      }
    }
    return '';
  }
}
