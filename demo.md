# Flight Search UI Demo Guide

## Quick Start Demo

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open Browser
Navigate to `http://localhost:4200`

## Demo Features to Test

### ✈️ Trip Type Toggle
- Click between "One Way", "Round Trip", and "Multi City"
- Notice how "Return Date" becomes optional for "One Way" trips

### 🛫 Airport Search
- Type in "BLR" or "Bengaluru" in the "From" field
- See autocomplete suggestions with airport codes and cities
- Try "DXB" or "Dubai" in the "To" field

### 📅 Date Selection
- Click on departure date to open the date picker
- Select a future date
- For round trips, select a return date after departure

### 👥 Passenger Management
- Use the +/- buttons to adjust passenger counts
- Notice validation rules:
  - Adults: minimum 1, maximum 9
  - Children: minimum 0, maximum 8
  - Infants: cannot exceed adult count

### 🎯 Class Selection
- Click the dropdown to see all class options
- Select different classes to see the change

### 🔍 Filters
- Toggle the checkboxes for Refundable, Non-stop, and Split Ticket
- See how they update the search criteria

### 🔎 Search Functionality
- Fill in required fields (From, To, Departure Date)
- Click the "Search Flights" button
- Check browser console for the search data output

## Sample Search Data

The form will output structured data like this:
```json
{
  "fromAirport": "BLR - Bengaluru",
  "toAirport": "DXB - Dubai",
  "departureDate": "2025-08-07T00:00:00.000Z",
  "returnDate": "2025-08-14T00:00:00.000Z",
  "class": "Economy",
  "preferredAirline": "Emirates",
  "transitAirport": "DXB",
  "tripType": "Round Trip",
  "passengers": {
    "adult": 2,
    "child": 1,
    "infant": 0
  },
  "filters": {
    "refundable": true,
    "nonStop": false,
    "splitTicket": false
  }
}
```

## Responsive Testing

### Desktop View
- 2-column layout for optimal space usage
- Hover effects on buttons and form fields

### Mobile View
- Resize browser window or use DevTools
- Single-column layout
- Touch-friendly button sizes

## Customization Demo

### Change Brand Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  'spekond': {
    'red': '#FF0000',  // Change to your preferred red
    // ... other colors
  }
}
```

### Add More Airports
Edit the `airports` array in `flight-search.component.ts`:
```typescript
airports: Airport[] = [
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  // ... add more airports
];
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Kill process on port 4200
   npx kill-port 4200
   # Or use different port
   npm start -- --port 4201
   ```

2. **Angular Material not loading**
   - Check browser console for errors
   - Ensure all Material modules are imported in `app.module.ts`

3. **TailwindCSS not working**
   - Verify `tailwind.config.js` is in root directory
   - Check that `styles.css` imports TailwindCSS

### Browser Compatibility
- Test in Chrome, Firefox, Safari, and Edge
- Ensure JavaScript is enabled
- Check for any console errors

## Next Steps

1. **Connect to Real API**: Replace dummy data with actual flight search API
2. **Add Validation**: Implement more sophisticated form validation
3. **Enhance UX**: Add loading states, success/error messages
4. **Testing**: Add unit tests and e2e tests
5. **Deployment**: Build and deploy to production environment
