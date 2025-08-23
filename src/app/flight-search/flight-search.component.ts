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
  
  countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Australia', 'Austria',
    'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan',
    'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cambodia',
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica',
    'Croatia', 'Cuba', 'Cyprus', 'Czech Republic', 'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador',
    'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland', 'France',
    'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau',
    'Guyana', 'Haiti', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Ivory Coast', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait',
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg',
    'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico',
    'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru',
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal',
    'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe',
    'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
    'South Africa', 'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu',
    'Vatican City', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
  ].sort(); // Sort countries alphabetically
  
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

  // Airport data
  airports: Airport[] = [];
  
  // Unique, sorted IATA codes for dropdowns
  uniqueIataCodes: string[] = [];
  
  // Multicity trip management
  cityPairs: Array<{
    origin: string;
    destination: string;
    departureDate: string;
    arrivalDate: string;
  }> = [];
  minCityPairs = 2;
  maxCityPairs = 5;

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
      
      // Create unique, sorted IATA codes for dropdowns
      this.uniqueIataCodes = [...new Set(
        airports
          .filter(airport => airport.iata_code && airport.iata_code.length === 3)
          .map(airport => airport.iata_code)
      )].sort();
    });
  }

  private setupAirportAutocomplete() {
    // Autocomplete setup removed - now using dropdowns with IATA codes
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
    // Prevent selecting Round Trip for seamen
    if (type === 'Round Trip' && this.selectedPassengerType === 'seamen') {
      return;
    }
    
    this.selectedTripType = type;
    if (type === 'One Way') {
      this.flightSearchForm.get('returnDate')?.clearValidators();
      this.flightSearchForm.get('returnDate')?.updateValueAndValidity();
      this.flightSearchForm.patchValue({ returnDate: null });
    } else if (type === 'Multi City') {
      this.initializeCityPairs();
      this.flightSearchForm.get('returnDate')?.clearValidators();
      this.flightSearchForm.get('returnDate')?.updateValueAndValidity();
    } else {
      this.flightSearchForm.get('returnDate')?.setValidators(Validators.required);
      this.flightSearchForm.get('returnDate')?.updateValueAndValidity();
    }
  }

  selectPassengerType(type: string) {
    this.selectedPassengerType = type;
    
    // If seamen is selected and current trip type is Round Trip, switch to One Way
    if (type === 'seamen' && this.selectedTripType === 'Round Trip') {
      this.selectTripType('One Way');
    }
  }

  isRoundTripDisabled(): boolean {
    return this.selectedPassengerType === 'seamen';
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

  getAvailableDestinationCodes(): string[] {
    const selectedOrigin = this.flightSearchForm.get('fromAirport')?.value;
    if (!selectedOrigin) {
      return this.uniqueIataCodes;
    }
    return this.uniqueIataCodes.filter(code => code !== selectedOrigin);
  }

  getMinArrivalDate(): string {
    const departureDate = this.flightSearchForm.get('departureDate')?.value;
    if (!departureDate) {
      return '';
    }
    const minDate = new Date(departureDate);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
  }

  onOriginChange() {
    const selectedOrigin = this.flightSearchForm.get('fromAirport')?.value;
    const selectedDestination = this.flightSearchForm.get('toAirport')?.value;
    
    // If destination is the same as origin, clear it
    if (selectedDestination === selectedOrigin) {
      this.flightSearchForm.patchValue({ toAirport: '' });
    }
  }

  // Multicity methods
  initializeCityPairs() {
    this.cityPairs = [
      { origin: '', destination: '', departureDate: '', arrivalDate: '' },
      { origin: '', destination: '', departureDate: '', arrivalDate: '' }
    ];
  }

  addCityPair() {
    if (this.cityPairs.length < this.maxCityPairs) {
      this.cityPairs.push({ origin: '', destination: '', departureDate: '', arrivalDate: '' });
    }
  }

  removeCityPair(index: number) {
    if (this.cityPairs.length > this.minCityPairs) {
      this.cityPairs.splice(index, 1);
    }
  }

  getAvailableDestinationCodesForPair(pairIndex: number): string[] {
    const currentPair = this.cityPairs[pairIndex];
    const selectedOrigin = currentPair.origin;
    
    if (!selectedOrigin) {
      return this.uniqueIataCodes;
    }
    
    // Filter out the current origin and any origins used in other pairs
    return this.uniqueIataCodes.filter(code => {
      if (code === selectedOrigin) return false;
      
      // Check if this code is used as origin in any other pair
      for (let i = 0; i < this.cityPairs.length; i++) {
        if (i !== pairIndex && this.cityPairs[i].origin === code) {
          return false;
        }
      }
      return true;
    });
  }

  onCityPairOriginChange(pairIndex: number) {
    const currentPair = this.cityPairs[pairIndex];
    
    // Clear destination if it matches the new origin
    if (currentPair.destination === currentPair.origin) {
      currentPair.destination = '';
    }
    
    // Clear destination if it's used as origin in another pair
    for (let i = 0; i < this.cityPairs.length; i++) {
      if (i !== pairIndex && this.cityPairs[i].origin === currentPair.destination) {
        currentPair.destination = '';
        break;
      }
    }
  }

  getMinArrivalDateForPair(pairIndex: number): string {
    const currentPair = this.cityPairs[pairIndex];
    if (!currentPair.departureDate) {
      return '';
    }
    const minDate = new Date(currentPair.departureDate);
    minDate.setDate(minDate.getDate() + 1);
    return minDate.toISOString().split('T')[0];
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

      // Add multicity data if applicable
      if (this.selectedTripType === 'Multi City') {
        searchCriteria.cityPairs = [...this.cityPairs];
      }

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
