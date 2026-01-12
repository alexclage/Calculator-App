// Get all input elements
const homePriceInput = document.getElementById('homePrice');
const downPaymentInput = document.getElementById('downPayment');
const interestRateInput = document.getElementById('interestRate');
const loanTermInput = document.getElementById('loanTerm');
const monthlyPaymentInput = document.getElementById('monthlyPaymentInput');
const propertyTaxInput = document.getElementById('propertyTax');
const homeInsuranceInput = document.getElementById('homeInsurance');
const hoaInput = document.getElementById('hoa');
const pmiInput = document.getElementById('pmi');
const zipcodeInput = document.getElementById('zipcode');

// Get all display elements
const homePriceDisplay = document.getElementById('homePriceValue');
const downPaymentDisplay = document.getElementById('downPaymentValue');
const interestRateDisplay = document.getElementById('interestRateValue');
const loanTermDisplay = document.getElementById('loanTermValue');
const monthlyPaymentInputDisplay = document.getElementById('monthlyPaymentInputValue');
const propertyTaxDisplay = document.getElementById('propertyTaxValue');
const homeInsuranceDisplay = document.getElementById('homeInsuranceValue');
const hoaDisplay = document.getElementById('hoaValue');
const pmiDisplay = document.getElementById('pmiValue');

// Get result elements
const mainResultLabel = document.getElementById('mainResultLabel');
const mainResultValue = document.getElementById('mainResultValue');
const principalInterestDisplay = document.getElementById('principalInterest');
const totalMonthlyPaymentDisplay = document.getElementById('totalMonthlyPayment');
const loanAmountDisplay = document.getElementById('loanAmount');
const totalInterestDisplay = document.getElementById('totalInterest');
const totalAmountDisplay = document.getElementById('totalAmount');
const downPaymentPercentDisplay = document.getElementById('downPaymentPercent');

// Get mode elements
const paymentModeBtn = document.getElementById('paymentModeBtn');
const affordabilityModeBtn = document.getElementById('affordabilityModeBtn');
const homePriceGroup = document.getElementById('homePriceGroup');
const monthlyPaymentGroup = document.getElementById('monthlyPaymentGroup');

// Get affordability check elements
const annualIncomeInput = document.getElementById('annualIncome');
const existingDebtPaymentsInput = document.getElementById('existingDebtPayments');
const housingRatioDisplay = document.getElementById('housingRatio');
const debtRatioDisplay = document.getElementById('debtRatio');
const rangeMarker = document.getElementById('rangeMarker');
const meterStatus = document.getElementById('meterStatus');
const affordabilityAdvice = document.getElementById('affordabilityAdvice');
const conservativeAmountDisplay = document.getElementById('conservativeAmount');
const maxAmountDisplay = document.getElementById('maxAmount');
const riskyAmountDisplay = document.getElementById('riskyAmount');

// Get optimize checkbox
const optimizeCheckbox = document.getElementById('optimizeCheckbox');

// Get lookup elements
const lookupBtn = document.getElementById('lookupBtn');
const lookupStatus = document.getElementById('lookupStatus');

// Calculator mode: 'payment' or 'affordability'
let calculatorMode = 'payment';
let currentMonthlyPayment = 0;
let isOptimizing = false;

// Format number as currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Format number with commas
function formatNumber(value) {
    return new Intl.NumberFormat('en-US').format(value);
}

// Calculate loan details (payment mode)
function calculateLoan() {
    const homePrice = parseFloat(homePriceInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    const annualInterestRate = parseFloat(interestRateInput.value);
    const loanTermYears = parseInt(loanTermInput.value);
    const loanTermMonths = loanTermYears * 12;
    
    // Calculate loan amount
    const loanAmount = homePrice - downPayment;
    
    // Calculate down payment percentage
    const downPaymentPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
    
    // Calculate monthly principal & interest payment
    let monthlyPI = 0;
    let totalInterest = 0;
    
    if (loanAmount > 0 && annualInterestRate > 0) {
        const monthlyInterestRate = annualInterestRate / 100 / 12;
        monthlyPI = loanAmount * 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
            (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
        
        totalInterest = (monthlyPI * loanTermMonths) - loanAmount;
    } else if (loanAmount > 0) {
        // If interest rate is 0
        monthlyPI = loanAmount / loanTermMonths;
        totalInterest = 0;
    }
    
    // Get additional monthly costs
    const propertyTax = parseFloat(propertyTaxInput.value);
    const homeInsurance = parseFloat(homeInsuranceInput.value);
    const hoa = parseFloat(hoaInput.value);
    const pmi = parseFloat(pmiInput.value);
    
    // Calculate total monthly payment
    const totalMonthly = monthlyPI + propertyTax + homeInsurance + hoa + pmi;
    
    const totalAmount = loanAmount + totalInterest;
    
    // Update displays
    mainResultValue.textContent = formatCurrency(totalMonthly);
    principalInterestDisplay.textContent = formatCurrency(monthlyPI);
    totalMonthlyPaymentDisplay.textContent = formatCurrency(totalMonthly);
    loanAmountDisplay.textContent = formatCurrency(loanAmount);
    totalInterestDisplay.textContent = formatCurrency(totalInterest);
    totalAmountDisplay.textContent = formatCurrency(totalAmount);
    downPaymentPercentDisplay.textContent = downPaymentPercent.toFixed(1) + '%';
    
    // Auto-calculate PMI if down payment is less than 20%
    if (downPaymentPercent < 20 && pmiInput.value === '0') {
        const estimatedPMI = (loanAmount * 0.005) / 12; // Rough estimate: 0.5% annually
        pmiInput.value = Math.round(estimatedPMI);
        pmiDisplay.textContent = formatNumber(pmiInput.value);
    } else if (downPaymentPercent >= 20 && pmiInput.value !== '0') {
        // Auto-clear PMI if down payment is 20% or more (unless user manually set it)
        const autoCalculatedPMI = Math.round((loanAmount * 0.005) / 12);
        if (Math.abs(parseFloat(pmiInput.value) - autoCalculatedPMI) < 5) {
            pmiInput.value = 0;
            pmiDisplay.textContent = '0';
        }
    }
    
    // Store current monthly payment for affordability check
    currentMonthlyPayment = totalMonthly;
}

// Calculate affordable home price (affordability mode)
function calculateAffordability() {
    const targetMonthlyPayment = parseFloat(monthlyPaymentInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    const annualInterestRate = parseFloat(interestRateInput.value);
    const loanTermYears = parseInt(loanTermInput.value);
    const loanTermMonths = loanTermYears * 12;
    
    // Get additional monthly costs
    const propertyTax = parseFloat(propertyTaxInput.value);
    const homeInsurance = parseFloat(homeInsuranceInput.value);
    const hoa = parseFloat(hoaInput.value);
    const pmi = parseFloat(pmiInput.value);
    
    // Calculate target P&I payment (subtract additional costs)
    const additionalCosts = propertyTax + homeInsurance + hoa + pmi;
    const targetPI = targetMonthlyPayment - additionalCosts;
    
    let affordableLoanAmount = 0;
    
    if (targetPI > 0) {
        if (annualInterestRate > 0) {
            const monthlyInterestRate = annualInterestRate / 100 / 12;
            // Reverse calculation: P = M * [(1 + r)^n - 1] / [r * (1 + r)^n]
            affordableLoanAmount = targetPI * 
                (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1) / 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths));
        } else {
            // If interest rate is 0
            affordableLoanAmount = targetPI * loanTermMonths;
        }
    }
    
    const affordableHomePrice = affordableLoanAmount + downPayment;
    const totalInterest = (targetPI * loanTermMonths) - affordableLoanAmount;
    const totalAmount = affordableLoanAmount + totalInterest;
    
    // Calculate down payment percentage
    const downPaymentPercent = affordableHomePrice > 0 ? (downPayment / affordableHomePrice) * 100 : 0;
    
    // Update displays
    mainResultValue.textContent = formatCurrency(affordableHomePrice);
    principalInterestDisplay.textContent = formatCurrency(targetPI);
    totalMonthlyPaymentDisplay.textContent = formatCurrency(targetMonthlyPayment);
    loanAmountDisplay.textContent = formatCurrency(affordableLoanAmount);
    totalInterestDisplay.textContent = formatCurrency(totalInterest);
    totalAmountDisplay.textContent = formatCurrency(totalAmount);
    downPaymentPercentDisplay.textContent = downPaymentPercent.toFixed(1) + '%';
    
    // Store current monthly payment for affordability check
    currentMonthlyPayment = targetMonthlyPayment;
}

// Update value displays
function updateDisplays() {
    if (calculatorMode === 'payment') {
        homePriceDisplay.textContent = formatNumber(homePriceInput.value);
        
        // Ensure down payment doesn't exceed home price
        if (parseFloat(downPaymentInput.value) > parseFloat(homePriceInput.value)) {
            downPaymentInput.value = homePriceInput.value;
        }
    } else {
        monthlyPaymentInputDisplay.textContent = formatNumber(monthlyPaymentInput.value);
    }
    
    downPaymentDisplay.textContent = formatNumber(downPaymentInput.value);
    interestRateDisplay.textContent = interestRateInput.value;
    loanTermDisplay.textContent = loanTermInput.value;
    propertyTaxDisplay.textContent = formatNumber(propertyTaxInput.value);
    homeInsuranceDisplay.textContent = formatNumber(homeInsuranceInput.value);
    hoaDisplay.textContent = formatNumber(hoaInput.value);
    pmiDisplay.textContent = formatNumber(pmiInput.value);
    
    if (calculatorMode === 'payment') {
        calculateLoan();
    } else {
        calculateAffordability();
    }
    
    // Update affordability check
    updateAffordabilityCheck();
}

// Optimize payment based on income
function optimizePayment() {
    if (!isOptimizing) return;
    
    const annualIncome = parseFloat(annualIncomeInput.value) || 0;
    const monthlyIncome = annualIncome / 12;
    const existingDebt = parseFloat(existingDebtPaymentsInput.value) || 0;
    const annualInterestRate = parseFloat(interestRateInput.value);
    const loanTermYears = parseInt(loanTermInput.value);
    const loanTermMonths = loanTermYears * 12;
    
    // Get additional monthly costs
    const propertyTax = parseFloat(propertyTaxInput.value);
    const homeInsurance = parseFloat(homeInsuranceInput.value);
    const hoa = parseFloat(hoaInput.value);
    const pmi = parseFloat(pmiInput.value);
    const additionalCosts = propertyTax + homeInsurance + hoa + pmi;
    
    // Calculate ideal housing payment (28% of monthly income)
    const idealHousingPayment = monthlyIncome * 0.28;
    const targetPI = Math.max(0, idealHousingPayment - additionalCosts);
    
    if (calculatorMode === 'payment') {
        // Calculate the home price that results in this payment
        const downPayment = parseFloat(downPaymentInput.value);
        let affordableLoanAmount = 0;
        
        if (annualInterestRate > 0) {
            const monthlyInterestRate = annualInterestRate / 100 / 12;
            affordableLoanAmount = targetPI * 
                (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1) / 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths));
        } else {
            affordableLoanAmount = targetPI * loanTermMonths;
        }
        
        const optimalHomePrice = affordableLoanAmount + downPayment;
        
        // Update home price slider
        homePriceInput.value = Math.round(optimalHomePrice);
        homePriceDisplay.textContent = formatNumber(homePriceInput.value);
        
    } else {
        // In affordability mode, adjust the monthly payment slider
        const targetTotalPayment = idealHousingPayment;
        monthlyPaymentInput.value = Math.round(targetTotalPayment);
        monthlyPaymentInputDisplay.textContent = formatNumber(monthlyPaymentInput.value);
    }
    
    // Recalculate
    if (calculatorMode === 'payment') {
        calculateLoan();
    } else {
        calculateAffordability();
    }
    updateAffordabilityCheck();
}

// Handle optimize checkbox change
function handleOptimizeChange() {
    isOptimizing = optimizeCheckbox.checked;
    
    if (isOptimizing) {
        // Disable manual input on the main sliders when optimizing
        homePriceInput.disabled = calculatorMode === 'payment';
        monthlyPaymentInput.disabled = calculatorMode === 'affordability';
        
        // Run optimization
        optimizePayment();
    } else {
        // Re-enable manual input
        homePriceInput.disabled = false;
        monthlyPaymentInput.disabled = false;
    }
}

// Calculate and display affordability check
function updateAffordabilityCheck() {
    const annualIncome = parseFloat(annualIncomeInput.value) || 0;
    const monthlyIncome = annualIncome / 12;
    const existingDebt = parseFloat(existingDebtPaymentsInput.value) || 0;
    const housingPayment = currentMonthlyPayment;
    
    // Calculate housing payment ratio (front-end ratio)
    const housingRatio = monthlyIncome > 0 ? (housingPayment / monthlyIncome) * 100 : 0;
    housingRatioDisplay.textContent = housingRatio.toFixed(1) + '%';
    
    // Calculate total debt ratio (back-end ratio)
    const totalDebt = housingPayment + existingDebt;
    const debtRatio = monthlyIncome > 0 ? (totalDebt / monthlyIncome) * 100 : 0;
    debtRatioDisplay.textContent = debtRatio.toFixed(1) + '%';
    
    // Calculate the range boundaries
    // Conservative: 25% of monthly income (very safe)
    // Recommended: 28% of monthly income (standard guideline)
    // Max acceptable: 36% of monthly income (including all debt)
    const conservativePayment = monthlyIncome * 0.25;
    const recommendedPayment = monthlyIncome * 0.28;
    const maxPayment = monthlyIncome * 0.36;
    
    // Update range labels
    conservativeAmountDisplay.textContent = formatCurrency(conservativePayment);
    maxAmountDisplay.textContent = formatCurrency(recommendedPayment);
    riskyAmountDisplay.textContent = formatCurrency(maxPayment);
    
    // Calculate marker position (percentage across the bar)
    // The bar represents: 0% to 50% of income
    const maxRange = 0.50; // 50% of income is the full width of the bar
    let markerPosition = (housingRatio / 100) / maxRange * 100;
    markerPosition = Math.min(Math.max(markerPosition, 0), 100); // Clamp between 0-100
    
    rangeMarker.style.left = markerPosition + '%';
    
    // Determine affordability status
    let status, advice, statusClass;
    
    if (housingRatio <= 25) {
        status = 'Excellent';
        statusClass = 'excellent';
        advice = '✓ Excellent! Your housing payment is very conservative at ' + housingRatio.toFixed(1) + '% of your income, well below the recommended 28% guideline. You have significant room in your budget for savings, investments, and other expenses.';
    } else if (housingRatio <= 28) {
        status = 'Good';
        statusClass = 'good';
        if (debtRatio <= 36) {
            advice = '✓ Good! Your housing payment of ' + housingRatio.toFixed(1) + '% is at or near the ideal 28% guideline, and your total debt ratio of ' + debtRatio.toFixed(1) + '% is within the recommended 36% maximum. This is a financially responsible amount.';
        } else {
            advice = '⚠ Moderate. Your housing payment of ' + housingRatio.toFixed(1) + '% is good, but your total debt ratio of ' + debtRatio.toFixed(1) + '% exceeds the 36% guideline. Consider reducing other debts before taking on this mortgage.';
        }
    } else if (housingRatio <= 33) {
        status = 'Moderate';
        statusClass = 'moderate';
        if (debtRatio <= 36) {
            advice = '⚠ Moderate. Your housing payment of ' + housingRatio.toFixed(1) + '% exceeds the ideal 28% but is still manageable. Your total debt ratio of ' + debtRatio.toFixed(1) + '% is acceptable. Ensure you have a solid emergency fund and stable income.';
        } else {
            advice = '⚠ Caution! Your housing payment of ' + housingRatio.toFixed(1) + '% is elevated, and your total debt ratio of ' + debtRatio.toFixed(1) + '% exceeds recommended limits. This may strain your budget. Consider a less expensive home or reducing existing debts.';
        }
    } else if (housingRatio <= 40) {
        status = 'Caution';
        statusClass = 'caution';
        advice = '⚠ Caution! Your housing payment of ' + housingRatio.toFixed(1) + '% significantly exceeds the 28% guideline. Combined with existing debt (' + debtRatio.toFixed(1) + '% total), this may seriously strain your budget. Strongly consider a less expensive home, larger down payment, or paying down existing debts first.';
    } else {
        status = 'High Risk';
        statusClass = 'high-risk';
        advice = '⛔ High Risk! Your housing payment of ' + housingRatio.toFixed(1) + '% far exceeds recommended guidelines. With a total debt ratio of ' + debtRatio.toFixed(1) + '%, this could severely impact your financial stability and ability to save. You may struggle to get approved for a mortgage at this ratio. Strongly reconsider more affordable options.';
    }
    
    // Update status
    meterStatus.textContent = status;
    meterStatus.className = 'meter-status ' + statusClass;
    affordabilityAdvice.textContent = advice;
}

// Switch to payment mode
function switchToPaymentMode() {
    calculatorMode = 'payment';
    paymentModeBtn.classList.add('active');
    affordabilityModeBtn.classList.remove('active');
    homePriceGroup.style.display = 'block';
    monthlyPaymentGroup.style.display = 'none';
    mainResultLabel.textContent = 'Monthly Payment';
    updateDisplays();
}

// Switch to affordability mode
function switchToAffordabilityMode() {
    calculatorMode = 'affordability';
    affordabilityModeBtn.classList.add('active');
    paymentModeBtn.classList.remove('active');
    homePriceGroup.style.display = 'none';
    monthlyPaymentGroup.style.display = 'block';
    mainResultLabel.textContent = 'Affordable Home Price';
    updateDisplays();
}

// Zip Code Lookup Function
async function lookupZipCode() {
    const zipcode = zipcodeInput.value.trim();
    
    if (!zipcode || zipcode.length !== 5 || !/^\d{5}$/.test(zipcode)) {
        showLookupStatus('Please enter a valid 5-digit zip code', 'error');
        return;
    }
    
    // Check if API key is configured
    if (typeof OPENAI_API_KEY === 'undefined' || !OPENAI_API_KEY) {
        showLookupStatus('API key not configured. Please add your OpenAI API key to config.js', 'error');
        return;
    }
    
    showLookupStatus('Looking up area data for ' + zipcode + '...', 'info');
    lookupBtn.disabled = true;
    
    try {
        const homePrice = parseFloat(homePriceInput.value);
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a real estate data assistant. Provide realistic estimates for property-related costs in the given zip code. Return ONLY a JSON object with no additional text or markdown formatting.'
                    },
                    {
                        role: 'user',
                        content: `For zip code ${zipcode} and a home price of $${homePrice}, provide realistic monthly estimates for:
- Property tax (monthly)
- Home insurance (monthly)
- HOA fees (monthly, if applicable in the area)

Return ONLY a JSON object in this exact format with no additional text:
{
  "propertyTax": <number>,
  "homeInsurance": <number>,
  "hoa": <number>,
  "location": "<city, state>"
}`
                    }
                ],
                temperature: 0.3,
                max_tokens: 200
            })
        });
        
        if (!response.ok) {
            throw new Error('API request failed: ' + response.statusText);
        }
        
        const data = await response.json();
        const content = data.choices[0].message.content.trim();
        
        // Parse the JSON response
        let parsedData;
        try {
            // Remove any potential markdown code blocks
            const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedData = JSON.parse(cleanContent);
        } catch (parseError) {
            throw new Error('Failed to parse response data');
        }
        
        // Update the input fields with the fetched data
        if (parsedData.propertyTax !== undefined) {
            propertyTaxInput.value = Math.round(parsedData.propertyTax);
            propertyTaxDisplay.textContent = formatNumber(propertyTaxInput.value);
        }
        
        if (parsedData.homeInsurance !== undefined) {
            homeInsuranceInput.value = Math.round(parsedData.homeInsurance);
            homeInsuranceDisplay.textContent = formatNumber(homeInsuranceInput.value);
        }
        
        if (parsedData.hoa !== undefined) {
            hoaInput.value = Math.round(parsedData.hoa);
            hoaDisplay.textContent = formatNumber(hoaInput.value);
        }
        
        const location = parsedData.location || 'this area';
        showLookupStatus(`✓ Data loaded for ${location}`, 'success');
        
        // Recalculate with new values
        updateDisplays();
        
    } catch (error) {
        showLookupStatus('✗ Lookup failed: ' + error.message, 'error');
    } finally {
        lookupBtn.disabled = false;
    }
}

function showLookupStatus(message, type) {
    lookupStatus.textContent = message;
    lookupStatus.className = 'lookup-status ' + type;
    lookupStatus.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            lookupStatus.style.display = 'none';
        }, 5000);
    }
}

// Add event listeners to all inputs
homePriceInput.addEventListener('input', updateDisplays);
downPaymentInput.addEventListener('input', () => {
    updateDisplays();
    if (isOptimizing) optimizePayment();
});
interestRateInput.addEventListener('input', () => {
    updateDisplays();
    if (isOptimizing) optimizePayment();
});
loanTermInput.addEventListener('input', () => {
    updateDisplays();
    if (isOptimizing) optimizePayment();
});
monthlyPaymentInput.addEventListener('input', updateDisplays);
propertyTaxInput.addEventListener('input', updateDisplays);
homeInsuranceInput.addEventListener('input', updateDisplays);
hoaInput.addEventListener('input', updateDisplays);
pmiInput.addEventListener('input', updateDisplays);

annualIncomeInput.addEventListener('input', () => {
    updateAffordabilityCheck();
    if (isOptimizing) optimizePayment();
});
existingDebtPaymentsInput.addEventListener('input', () => {
    updateAffordabilityCheck();
    if (isOptimizing) optimizePayment();
});

// Add event listeners to mode buttons
paymentModeBtn.addEventListener('click', switchToPaymentMode);
affordabilityModeBtn.addEventListener('click', switchToAffordabilityMode);

// Add event listener to optimize checkbox
optimizeCheckbox.addEventListener('change', handleOptimizeChange);

// Add event listener for zip code lookup
lookupBtn.addEventListener('click', lookupZipCode);

// Allow Enter key to trigger lookup
zipcodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        lookupZipCode();
    }
});

// Make affordability meter marker draggable
let isDragging = false;
let dragStartX = 0;

rangeMarker.addEventListener('mousedown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    rangeMarker.classList.add('dragging');
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    const annualIncome = parseFloat(annualIncomeInput.value) || 0;
    if (annualIncome === 0) return;
    
    const monthlyIncome = annualIncome / 12;
    const rangeBar = document.querySelector('.range-bar');
    const rect = rangeBar.getBoundingClientRect();
    
    // Calculate position as percentage
    let positionX = e.clientX - rect.left;
    positionX = Math.max(0, Math.min(positionX, rect.width));
    const percentage = (positionX / rect.width) * 100;
    
    // Convert percentage to housing ratio (0-50% of income range)
    const maxRange = 0.50;
    const housingRatio = (percentage / 100) * maxRange;
    
    // Calculate new total housing payment amount
    const newTotalPayment = monthlyIncome * housingRatio;
    
    // Update the current monthly payment
    currentMonthlyPayment = newTotalPayment;
    
    // Back-calculate the home price from the desired payment
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const annualRate = parseFloat(interestRateInput.value) / 100;
    const monthlyRate = annualRate / 12;
    const loanTermMonths = parseFloat(loanTermInput.value);
    const propertyTax = parseFloat(propertyTaxInput.value) || 0;
    const homeInsurance = parseFloat(homeInsuranceInput.value) || 0;
    const hoa = parseFloat(hoaInput.value) || 0;
    const pmi = parseFloat(pmiInput.value) || 0;
    
    // Subtract non-principal/interest costs
    const principalInterestPayment = newTotalPayment - propertyTax - homeInsurance - hoa - pmi;
    
    if (monthlyRate > 0 && principalInterestPayment > 0) {
        // Use loan payment formula to calculate principal: P = PMT * ((1 - (1 + r)^-n) / r)
        const loanAmount = principalInterestPayment * ((1 - Math.pow(1 + monthlyRate, -loanTermMonths)) / monthlyRate);
        const newHomePrice = Math.max(50000, Math.min(2000000, loanAmount + downPayment));
        
        // Update the home price slider
        homePriceInput.value = Math.round(newHomePrice);
        homePriceDisplay.textContent = formatNumber(Math.round(newHomePrice));
        
        // Manually position the marker to match the drag position
        rangeMarker.style.left = percentage + '%';
        
        // Recalculate to update all displays but skip repositioning marker
        if (calculatorMode === 'payment') {
            calculateLoan();
            // Re-apply our drag position after calculation
            rangeMarker.style.left = percentage + '%';
        }
        
        // Update affordability display values
        updateAffordabilityCheck();
        // Re-apply drag position one more time to ensure it stays
        rangeMarker.style.left = percentage + '%';
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        rangeMarker.classList.remove('dragging');
    }
});

// Initialize calculator on page load
updateDisplays();
