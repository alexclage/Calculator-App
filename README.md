# Financial Calculators Web Application

A Node.js/Express web application that provides two powerful financial calculators:
- **Car Loan Calculator** - Calculate monthly car payments and affordability
- **Mortgage Calculator** - Calculate monthly mortgage payments with property taxes, insurance, and more

## Features

- Clean, responsive user interface
- Independent calculator pages accessible via routes
- Easy navigation between calculators
- Static file serving with Express
- Lightweight and fast

## Project Structure

```
Budget App/
├── server.js                 # Express server
├── package.json             # Node.js dependencies
├── public/                  # Static files served by Express
│   ├── index.html          # Home page with navigation
│   ├── car-loan/           # Car Loan Calculator
│   │   ├── index.html
│   │   ├── calculator.js
│   │   ├── styles.css
│   │   └── README.md
│   └── mortgage/           # Mortgage Calculator
│       ├── index.html
│       ├── calculator.js
│       ├── styles.css
│       ├── config.js
│       └── README.md
└── README.md               # This file
```

## Installation

1. Make sure you have Node.js installed (version 14 or higher recommended)

2. Navigate to the project directory:
   ```bash
   cd "Budget App"
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

Start the server:
```bash
npm start
```

The application will be available at:
- **Home Page**: http://localhost:3000
- **Car Loan Calculator**: http://localhost:3000/car-loan
- **Mortgage Calculator**: http://localhost:3000/mortgage

## Using the Calculators

### Car Loan Calculator
Navigate to `/car-loan` to:
- Calculate monthly car payments based on price, down payment, interest rate, and loan term
- Determine how much car you can afford based on your desired monthly payment
- View affordability analysis based on your income
- See total interest and total amount paid over the life of the loan

### Mortgage Calculator
Navigate to `/mortgage` to:
- Calculate monthly mortgage payments including principal and interest
- Factor in property taxes, home insurance, HOA fees, and PMI
- Look up area data by zip code (if configured)
- Determine home affordability based on income and existing debt
- View detailed payment breakdowns

## Development

To make changes:
1. Edit files in the `public/` directory for frontend changes
2. Edit `server.js` for routing or server configuration changes
3. The server serves static files automatically from the `public/` directory
4. Restart the server to see changes (no hot-reload configured)

## Technologies Used

- **Backend**: Node.js with Express
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Server**: Express static file serving

## License

ISC

## Notes

- The original calculator directories (`Car Loan Calculator/` and `Mortgage Calculator/`) can be kept for reference or removed once the application is working
- All calculator functionality is preserved from the original single-page apps
- Each calculator operates independently on its own route
