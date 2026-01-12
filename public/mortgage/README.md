# Mortgage Calculator

A comprehensive web-based mortgage calculator that helps you calculate monthly payments, total interest, and analyze affordability for your home loan. Features include property tax, homeowners insurance, HOA fees, PMI calculations, and intelligent zip code lookup powered by AI.

## Features

### Core Functionality
- **Two Calculation Modes:**
  - **Calculate Payment**: Enter home price to calculate monthly payment
  - **Calculate Price**: Enter desired monthly payment to find affordable home price
- **Comprehensive Mortgage Calculations:**
  - Principal & Interest
  - Property Taxes
  - Homeowners Insurance
  - HOA Fees
  - Private Mortgage Insurance (PMI)
- **Affordability Analysis**: Evaluate if the mortgage fits your budget using industry-standard 28/36 debt-to-income ratios
- **Auto-Optimize Feature**: Automatically calculate the ideal home price that fits within recommended budget guidelines

### Advanced Features
- **Zip Code Lookup**: Uses OpenAI API to intelligently estimate property taxes, insurance, and HOA fees based on the property's zip code
- **Real-Time Calculations**: All values update instantly as you adjust sliders
- **PMI Auto-Calculation**: Automatically calculates PMI when down payment is less than 20%
- **Visual Affordability Meter**: Color-coded meter showing your affordability rating

## Files

- `main.html` - Main HTML file with the calculator interface
- `calculator.js` - JavaScript logic for mortgage calculations and API integration
- `styles.css` - Styling for the calculator with responsive design
- `config.js` - API key configuration (add your OpenAI key here)
- `config.example.js` - Template for config.js
- `.gitignore` - Keeps config.js secure (excludes it from git)
- `README.md` - This documentation file

## Usage

### Basic Setup

1. Open `main.html` in a web browser to use the calculator
2. Adjust the sliders to calculate your mortgage payment or affordable home price
3. Enter your income information to see affordability analysis

### Setting Up Zip Code Lookup

To enable the zip code lookup feature, you'll need to configure an OpenAI API key:

#### Step 1: Get an OpenAI API Key

1. Go to [OpenAI's API Keys page](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click **"Create new secret key"**
4. Copy the key (it starts with `sk-`)
5. Store it securely - you won't be able to see it again

#### Step 2: Configure the Application

1. Open the `config.js` file in the Mortgage Calculator directory
2. Replace `'your-api-key-here'` with your actual API key:
   ```javascript
   const OPENAI_API_KEY = 'sk-proj-your-actual-key-here';
   ```
3. Save the file

**Security Note**: The `config.js` file is in `.gitignore` to prevent accidentally committing your API key to version control. A `config.example.js` template is provided for reference.

#### Step 3: Use Zip Code Lookup

1. Open `main.html` in your browser
2. Enter a 5-digit zip code in the "Property Zip Code" field
3. Click **"Lookup Area Data"**
4. The calculator will automatically populate:
   - Property Tax (monthly estimate)
   - Home Insurance (monthly estimate)
   - HOA Fees (monthly estimate, if applicable in the area)

## How It Works

### Mortgage Calculation

The calculator uses the standard mortgage payment formula:

```
M = P * [r(1 + r)^n] / [(1 + r)^n - 1]
```

Where:
- M = Monthly payment (principal & interest)
- P = Principal loan amount (home price - down payment)
- r = Monthly interest rate (annual rate / 12)
- n = Number of payments (loan term in months)

Total monthly payment includes:
- Principal & Interest (P&I)
- Property Taxes (monthly)
- Homeowners Insurance (monthly)
- HOA Fees (monthly, if applicable)
- PMI (monthly, if down payment < 20%)

### Affordability Guidelines

The calculator uses industry-standard debt-to-income (DTI) ratios:

- **Housing Ratio (Front-End)**: 28% or less of gross monthly income
  - Includes: Mortgage payment, property taxes, insurance, HOA, PMI
- **Total Debt Ratio (Back-End)**: 36% or less of gross monthly income
  - Includes: Housing costs + all other monthly debt payments

#### Affordability Ratings:
- **Excellent**: ≤25% - Very conservative, plenty of budget flexibility
- **Good**: 25-28% - Ideal range, financially responsible
- **Moderate**: 28-33% - Acceptable but less room for savings
- **Caution**: 33-40% - May strain budget, consider alternatives
- **High Risk**: >40% - Exceeds guidelines, difficult to get approved

### Zip Code Lookup (AI-Powered)

The zip code lookup feature uses OpenAI's GPT model to provide realistic estimates based on:
- Location-specific property tax rates
- Regional insurance cost averages
- HOA prevalence and typical fees in the area
- Current home price you've entered

The AI provides contextual estimates that adjust based on the home price and local market conditions.
the `config.js` file which is excluded from version control via `.gitignore`. Never commit this file to a public repository.
- **No Third-Party Tracking**: This calculator runs entirely in your browser with no analytics or tracking.
- **API Usage**: When you use the zip code lookup, your query is sent directly to OpenAI's API. OpenAI's privacy policy applies to these requests.
- **Local Development**: This is designed for local/personal use. If deploying publicly, use proper backend environment variables instead
- **API Key Storage**: Your OpenAI API key is stored in your browser's localStorage only. It never leaves your device except when making API calls directly to OpenAI.
- **No Third-Party Tracking**: This calculator runs entirely in your browser with no analytics or tracking.
- **API Usage**: When you use the zip code lookup, your query is sent directly to OpenAI's API. OpenAI's privacy policy applies to these requests.

## API Costs

The zip code lookup uses OpenAI's `gpt-4o-mini` model, which is very cost-effective:
- Approximate cost per lookup: $0.0001-0.0002 (less than 1/50th of a cent)
- 1000 lookups would cost approximately $0.10-0.20

## Browser Compatibility

This calculator works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips for Best Results

1. **Down Payment**: Aim for 20% or more to avoid PMI
2. **Loan Term**: 30 years = lower monthly payment, but more interest over time. 15 years = higher monthly payment but significantly less total interest
3. **Property Taxes**: Vary widely by location (0.5% - 2.5% of home value annually). Use zip code lookup for accurate estimates
4. **HOA Fees**: Can range from $0 to $1000+/month depending on amenities
5. **Emergency Fund**: Even if you can "afford" a payment, ensure you have 3-6 months of expenses saved

## Comparison to Car Loan Calculator

This mortgage calculator is built on the same foundation as the Car Loan Calculator but includes:
- Additional monthly costs (property tax, insurance, HOA, PMI)
- Longer loan terms (10-30 years vs 1-7 years)
- Different affordability guidelines (28/36 rule vs 7/10 rule)
- Zip code lookup for location-based estimates
- PMI auto-calculation based on down payment percentage
- Higher price ranges appropriate for real estate

## Troubleshooting

### Zip Code Lookup Not Working
API Key Not Configured**: Check that you've added your key to `config.js` and it starts with `sk-`
2. **Config File Missing**: Ensure `config.js` exists and is loaded before `calculator.js`
3. **Network Issues**: Check your internet connection
4. **API Rate Limits**: OpenAI has rate limits; wait a moment and try again
5. **Invalid Zip Code**: Ensure you're entering a valid 5-digit US zip code
6. **Browser Console**: Open browser console (F12) to see detailed error messages
4. **Invalid Zip Code**: Ensure you're entering a valid 5-digit US zip code

### Calculator Not Updating

1. Refresh the page
2. Clear your browser cache
3. Make sure JavaScript is enabled in your browser

## Future Enhancements

Potential features for future versions:
- Amortization schedule visualization
- Comparison of different loan scenarios side-by-side
- Include utilities and maintenance cost estimates
- Tax benefit calculations (mortgage interest deduction)
- Closing cost estimator
- Monthly vs. bi-weekly payment comparison

## License

This is free and open-source software. Feel free to use, modify, and distribute as needed.

## Support

For issues or questions:
1. Check this README for solutions
2. Verify all inputs are within valid ranges
3. Test with different browsers
4. Check browser console for error messages (F12 → Console)

## Credits

Built with vanilla HTML, CSS, and JavaScript. Uses OpenAI API for intelligent zip code lookup functionality.
