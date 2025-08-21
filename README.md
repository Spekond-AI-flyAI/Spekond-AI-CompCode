# Spekond AI Flight Search UI

A modern, clean, and responsive flight search interface built with Angular 17, Angular Material, and TailwindCSS.

## Features

### ✈️ Trip Type Selection
- **One Way**: Single journey flights
- **Round Trip**: Return journey flights  
- **Multi City**: Complex multi-destination itineraries

### 🛫 Flight Details
- **From/To Airports**: Intelligent autocomplete with airport search
- **Departure/Return Dates**: Modern date pickers with validation
- **Class Selection**: Economy, Premium Economy, Business, First Class
- **Passenger Management**: Interactive counters for Adults, Children, and Infants

### 🔍 Advanced Options
- **Preferred Airline**: Text input for airline preferences
- **Transit Airport**: Optional transit point specification
- **Smart Filters**: Refundable, Non-stop, Split Ticket options

### 🎨 Design Features
- **Modern UI**: Clean, spacious layout with generous whitespace
- **Brand Colors**: Spekond AI brand colors (red primary, soft greys, muted blue highlights)
- **Responsive Design**: Optimized for desktop and mobile devices
- **Smooth Animations**: Hover effects and transitions for better UX

## Technology Stack

- **Angular 17**: Latest Angular framework
- **Angular Material**: Material Design components
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming for autocomplete

## Project Structure

```
src/
├── app/
│   ├── flight-search/
│   │   ├── flight-search.component.ts
│   │   ├── flight-search.component.html
│   │   └── flight-search.component.css
│   ├── app.component.ts
│   ├── app.module.ts
│   └── app.component.html
├── styles.css
├── main.ts
└── index.html
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Spekond-AI-flyAI/Spekond-AI-CompCode.git
   cd Spekond-AI-CompCode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open browser**
   Navigate to `http://localhost:4200`

### Build Commands

- **Development build**: `npm run build`
- **Production build**: `npm run build --prod`
- **Watch mode**: `npm run watch`

## Customization

### Brand Colors
The color scheme can be customized in `tailwind.config.js`:

```javascript
colors: {
  'spekond': {
    'red': '#DC2626',      // Primary button color
    'grey': { /* grey scale */ },
    'blue': { /* blue scale */ }
  }
}
```

### Airport Data
Replace the dummy airport data in `flight-search.component.ts` with your actual `AirportData.json`:

```typescript
airports: Airport[] = [
  // Your airport data here
];
```

## Responsive Design

The UI is fully responsive with:
- **Desktop**: 2-column layout for optimal space usage
- **Tablet**: Adaptive grid layouts
- **Mobile**: Single-column layout with optimized touch targets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the Spekond AI team.

