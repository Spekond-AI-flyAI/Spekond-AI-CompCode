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

export interface FlightDetails {
  id: number;
  airline: string;
  flightNumber: string;
  departureTime: string;
  departureAirport: string;
  departureTerminal: string;
  departureDate: string;
  arrivalTime: string;
  arrivalAirport: string;
  arrivalTerminal: string;
  arrivalDate: string;
  duration: string;
  layover?: string;
  layoverDuration?: string;
  price?: string;
  stops?: number;
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
  
  // Popup properties
  showPopup = false;
  selectedFlight: FlightDetails | null = null;
  
  // Modify search properties
  showModifySearch = false;
  
  // Share properties
  showEmailModal = false;
  showWhatsAppModal = false;
  emailAddress = '';
  phoneNumber = '';

  constructor(
    private http: HttpClient,
    private searchService: SearchService,
    private router: Router
  ) {}

  ngOnInit() {
    this.searchCriteria = this.searchService.getSearchCriteria();
    
    if (!this.searchCriteria) {
      // Create default search criteria for testing instead of redirecting
      console.log('No search criteria found, creating default for testing');
      this.searchCriteria = {
        tripType: 'ONE WAY',
        fromAirport: 'BOM',
        toAirport: 'DEL',
        departureDate: new Date('2025-08-30'),
        returnDate: null,
        class: 'ECONOMY',
        passengers: {
          adult: 1,
          child: 1,
          infant: 0
        },
        preferredAirline: '',
        transitAirport: '',
        filters: {
          refundable: false,
          nonStop: false,
          splitTicket: false
        },
        passengerType: 'seamen'
      };
      console.log('Default search criteria created:', this.searchCriteria);
    }

    this.loadFlightResults();
  }

  loadFlightResults() {
    console.log('loadFlightResults called');
    this.loading = true;
    this.error = false;

    // Load all itineraries from the JSON file
    this.http.get<FlightItinerary[]>('assets/FlightItineraryList.json').pipe(
      map(results => {
        console.log('Flight results loaded:', results?.length);
        this.flightResults = Array.isArray(results) ? results : [];
        this.filterResults();
        this.loading = false;
        return this.flightResults;
      }),
      catchError(error => {
        console.error('Error loading flight results:', error);
        this.loading = false;
        this.error = true;
        this.flightResults = [];
        this.filteredResults = [];
        return of([]);
      })
    ).subscribe();
  }

  private filterResults() {
    console.log('filterResults called');
    if (!this.searchCriteria) {
      this.filteredResults = this.flightResults;
      console.log('No search criteria, using all results:', this.filteredResults.length);
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

    // Show all results
    console.log('Filtered results (all):', this.filteredResults.length);
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

  // Test method to ensure popup works
  testPopup() {
    console.log('testPopup called');
    console.log('Current showPopup state:', this.showPopup);
    console.log('Current filteredResults:', this.filteredResults);
    
    // Create a test flight
    this.selectedFlight = {
      id: 999,
      airline: 'Test Airline',
      flightNumber: 'TEST 123',
      departureTime: '10:00',
      departureAirport: 'BOM',
      departureTerminal: 'Terminal 1',
      departureDate: 'Mon, 25-Aug-2025',
      arrivalTime: '12:00',
      arrivalAirport: 'DEL',
      arrivalTerminal: 'Terminal 2',
      arrivalDate: 'Mon, 25-Aug-2025',
      duration: '02h 00m',
      layover: 'Non-stop',
      layoverDuration: '0h 0m',
      price: '€299',
      stops: 0
    };
    
    console.log('Test flight created:', this.selectedFlight);
    this.showPopup = true;
    console.log('showPopup set to:', this.showPopup);
    
    // Force change detection
    setTimeout(() => {
      console.log('After timeout - showPopup:', this.showPopup);
    }, 100);
  }

  // Modify search methods
  toggleModifySearch() {
    console.log('toggleModifySearch called, current state:', this.showModifySearch);
    this.showModifySearch = !this.showModifySearch;
    console.log('showModifySearch now:', this.showModifySearch);
  }

  // Popup methods
  openFlightDetails(flight: any) {
    console.log('openFlightDetails called with flight:', flight);
    console.log('filteredResults length:', this.filteredResults.length);
    
    // Create a simple flight details object
    this.selectedFlight = {
      id: flight.id || 1,
      airline: 'IndiGo',
      flightNumber: '6E 762',
      departureTime: '06:00',
      departureAirport: this.searchCriteria?.fromAirport || 'BOM',
      departureTerminal: 'Terminal 2',
      departureDate: 'Fri, 29-Aug-2025',
      arrivalTime: '07:55',
      arrivalAirport: this.searchCriteria?.toAirport || 'DEL',
      arrivalTerminal: 'Terminal 1',
      arrivalDate: 'Fri, 29-Aug-2025',
      duration: '01h 55m',
      layover: 'Non-stop',
      layoverDuration: '0h 0m',
      price: '€349',
      stops: 0
    };
    
    console.log('selectedFlight created:', this.selectedFlight);
    this.showPopup = true;
    console.log('showPopup set to:', this.showPopup);
    
    // Force change detection
    setTimeout(() => {
      console.log('After timeout - showPopup:', this.showPopup);
    }, 100);
  }

  closePopup() {
    this.showPopup = false;
    this.selectedFlight = null;
    this.showEmailModal = false;
    this.showWhatsAppModal = false;
    this.emailAddress = '';
    this.phoneNumber = '';
  }

  onPopupOverlayClick(event: Event) {
    // Close popup if clicking on the overlay (not the content)
    if (event.target === event.currentTarget) {
      this.closePopup();
    }
  }

  // Share methods
  copyToClipboard() {
    if (this.selectedFlight) {
      const itineraryText = this.generateItineraryText();
      navigator.clipboard.writeText(itineraryText).then(() => {
        // You could add a toast notification here
        console.log('Itinerary copied to clipboard');
        alert('Itinerary copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy to clipboard:', err);
        alert('Failed to copy to clipboard. Please try again.');
      });
    }
  }

  showEmailInput() {
    this.showEmailModal = true;
  }

  sendEmail() {
    if (this.emailAddress && this.selectedFlight) {
      const subject = encodeURIComponent('Flight Itinerary Details');
      const body = encodeURIComponent(this.generateItineraryText());
      const mailtoLink = `mailto:${this.emailAddress}?subject=${subject}&body=${body}`;
      window.open(mailtoLink);
      this.showEmailModal = false;
      this.emailAddress = '';
    } else if (!this.emailAddress) {
      alert('Please enter an email address');
    }
  }

  showWhatsAppInput() {
    this.showWhatsAppModal = true;
  }

  sendWhatsApp() {
    if (this.phoneNumber && this.selectedFlight) {
      const text = encodeURIComponent(this.generateItineraryText());
      // Remove any non-numeric characters from phone number
      const cleanPhone = this.phoneNumber.replace(/\D/g, '');
      const whatsappLink = `https://wa.me/${cleanPhone}?text=${text}`;
      window.open(whatsappLink, '_blank');
      this.showWhatsAppModal = false;
      this.phoneNumber = '';
    } else if (!this.phoneNumber) {
      alert('Please enter a phone number');
    }
  }

  private generateItineraryText(): string {
    if (!this.selectedFlight) return '';
    
    return `Flight Itinerary Details

Airline: ${this.selectedFlight.airline}
Flight Number: ${this.selectedFlight.flightNumber}

Departure:
Time: ${this.selectedFlight.departureTime}
Airport: ${this.selectedFlight.departureAirport} (${this.selectedFlight.departureTerminal})
Date: ${this.selectedFlight.departureDate}

Arrival:
Time: ${this.selectedFlight.arrivalTime}
Airport: ${this.selectedFlight.arrivalAirport} (${this.selectedFlight.arrivalTerminal})
Date: ${this.selectedFlight.arrivalDate}

Duration: ${this.selectedFlight.duration}
Layover: ${this.selectedFlight.layover}
Price: ${this.selectedFlight.price}`;
  }

  // Navigation methods
  goToMyBookings() {
    alert('My Bookings feature will be available soon!');
  }

  goToCrewTracking() {
    alert('Crew Tracking feature will be available soon!');
  }
}
