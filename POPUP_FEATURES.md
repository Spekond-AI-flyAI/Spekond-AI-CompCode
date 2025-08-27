# Flight Details Popup Features

## Overview
A new popup functionality has been added to the flight search results page that displays detailed itinerary information when users click on "Flight Details" for any flight result.

## Features

### 1. Popup Trigger
- Click on the "Flight Details" button for any flight result
- Popup appears with a smooth fade-in animation

### 2. Popup Content
The popup displays:
- **Header Bar**: Shows trip details including trip type, passenger counts, and class
- **Itinerary Details**: 
  - Departure and arrival times with airport codes
  - Flight number and airline information
  - Journey duration
  - Airport names and terminals
- **Action Buttons**:
  - Fare Details & Rules
  - Baggage Allowance  
  - Visa Rules

### 3. Share Functionality
Three functional share buttons in the bottom-right corner:
- **Copy to Clipboard** (Red): Copies itinerary details to clipboard
- **Email** (Red): Opens default email client with pre-filled itinerary
- **WhatsApp** (Green): Opens WhatsApp with pre-filled itinerary message

### 4. Responsive Design
- Popup is responsive and works on different screen sizes
- Maximum height with scrollable content for smaller screens
- Backdrop blur effect for modern browsers

### 5. Animations
- Smooth fade-in animation for the overlay
- Slide-in animation for the popup content
- Hover effects on buttons and interactive elements

## Technical Implementation

### Files Modified
- `src/app/results/results.component.ts` - Added popup logic and methods
- `src/app/results/results.component.html` - Added popup HTML structure
- `src/app/results/results.component.css` - Added popup styling and animations

### Key Methods
- `openFlightDetails()` - Opens the popup with flight data
- `closePopup()` - Closes the popup
- `copyToClipboard()` - Copies itinerary to clipboard
- `sendEmail()` - Opens email client
- `sendWhatsApp()` - Opens WhatsApp

### Data Structure
The popup uses a `FlightDetails` interface that includes:
- Flight information (airline, flight number, times, airports)
- Search criteria (passenger counts, trip type, class)
- Dynamic content based on actual search parameters

## Usage
1. Navigate to the flight search results page
2. Click on "Flight Details" for any flight result
3. View detailed itinerary information in the popup
4. Use share buttons to copy, email, or WhatsApp the details
5. Click the X button or click outside the popup to close

## Browser Compatibility
- Modern browsers with ES6+ support
- Clipboard API for copy functionality
- Responsive design for mobile and desktop
