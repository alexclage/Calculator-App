// Get all input elements
const carPriceInput = document.getElementById('carPrice');
const downPaymentInput = document.getElementById('downPayment');
const interestRateInput = document.getElementById('interestRate');
const loanTermInput = document.getElementById('loanTerm');
const monthlyPaymentInput = document.getElementById('monthlyPaymentInput');

// Get all display elements
const carPriceDisplay = document.getElementById('carPriceValue');
const downPaymentDisplay = document.getElementById('downPaymentValue');
const interestRateDisplay = document.getElementById('interestRateValue');
const loanTermDisplay = document.getElementById('loanTermValue');
const monthlyPaymentInputDisplay = document.getElementById('monthlyPaymentInputValue');

// Get result elements
const mainResultLabel = document.getElementById('mainResultLabel');
const mainResultValue = document.getElementById('mainResultValue');
const loanAmountDisplay = document.getElementById('loanAmount');
const totalInterestDisplay = document.getElementById('totalInterest');
const totalAmountDisplay = document.getElementById('totalAmount');

// Get mode elements
const paymentModeBtn = document.getElementById('paymentModeBtn');
const affordabilityModeBtn = document.getElementById('affordabilityModeBtn');
const carPriceGroup = document.getElementById('carPriceGroup');
const monthlyPaymentGroup = document.getElementById('monthlyPaymentGroup');

// Get affordability check elements
const annualIncomeInput = document.getElementById('annualIncome');
const existingCarPaymentsInput = document.getElementById('existingCarPayments');
const totalCarPaymentsDisplay = document.getElementById('totalCarPayments');
const debtRatioDisplay = document.getElementById('debtRatio');
const rangeMarker = document.getElementById('rangeMarker');
const meterStatus = document.getElementById('meterStatus');
const affordabilityAdvice = document.getElementById('affordabilityAdvice');
const conservativeAmountDisplay = document.getElementById('conservativeAmount');
const maxAmountDisplay = document.getElementById('maxAmount');
const riskyAmountDisplay = document.getElementById('riskyAmount');

// Get optimize checkbox
const optimizeCheckbox = document.getElementById('optimizeCheckbox');

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
    const carPrice = parseFloat(carPriceInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    const annualInterestRate = parseFloat(interestRateInput.value);
    const loanTermMonths = parseInt(loanTermInput.value);
    
    // Calculate loan amount
    const loanAmount = carPrice - downPayment;
    
    // Calculate monthly payment
    let monthlyPayment = 0;
    let totalInterest = 0;
    
    if (loanAmount > 0 && annualInterestRate > 0) {
        const monthlyInterestRate = annualInterestRate / 100 / 12;
        monthlyPayment = loanAmount * 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths)) / 
            (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);
        
        totalInterest = (monthlyPayment * loanTermMonths) - loanAmount;
    } else if (loanAmount > 0) {
        // If interest rate is 0
        monthlyPayment = loanAmount / loanTermMonths;
        totalInterest = 0;
    }
    
    const totalAmount = loanAmount + totalInterest;
    
    // Update displays
    mainResultValue.textContent = formatCurrency(monthlyPayment);
    loanAmountDisplay.textContent = formatCurrency(loanAmount);
    totalInterestDisplay.textContent = formatCurrency(totalInterest);
    totalAmountDisplay.textContent = formatCurrency(totalAmount);
    
    // Store current monthly payment for affordability check
    currentMonthlyPayment = monthlyPayment;
}

// Calculate affordable car price (affordability mode)
function calculateAffordability() {
    const targetMonthlyPayment = parseFloat(monthlyPaymentInput.value);
    const downPayment = parseFloat(downPaymentInput.value);
    const annualInterestRate = parseFloat(interestRateInput.value);
    const loanTermMonths = parseInt(loanTermInput.value);
    
    let affordableLoanAmount = 0;
    
    if (annualInterestRate > 0) {
        const monthlyInterestRate = annualInterestRate / 100 / 12;
        // Reverse calculation: P = M * [(1 + r)^n - 1] / [r * (1 + r)^n]
        affordableLoanAmount = targetMonthlyPayment * 
            (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1) / 
            (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths));
    } else {
        // If interest rate is 0
        affordableLoanAmount = targetMonthlyPayment * loanTermMonths;
    }
    
    const affordableCarPrice = affordableLoanAmount + downPayment;
    const totalInterest = (targetMonthlyPayment * loanTermMonths) - affordableLoanAmount;
    const totalAmount = affordableLoanAmount + totalInterest;
    
    // Update displays
    mainResultValue.textContent = formatCurrency(affordableCarPrice);
    loanAmountDisplay.textContent = formatCurrency(affordableLoanAmount);
    totalInterestDisplay.textContent = formatCurrency(totalInterest);
    totalAmountDisplay.textContent = formatCurrency(totalAmount);
    
    // Store current monthly payment for affordability check
    currentMonthlyPayment = targetMonthlyPayment;
}

// Update value displays
function updateDisplays() {
    if (calculatorMode === 'payment') {
        carPriceDisplay.textContent = formatNumber(carPriceInput.value);
        
        // Ensure down payment doesn't exceed car price
        if (parseFloat(downPaymentInput.value) > parseFloat(carPriceInput.value)) {
            downPaymentInput.value = carPriceInput.value;
        }
    } else {
        monthlyPaymentInputDisplay.textContent = formatNumber(monthlyPaymentInput.value);
    }
    
    downPaymentDisplay.textContent = formatNumber(downPaymentInput.value);
    interestRateDisplay.textContent = interestRateInput.value;
    loanTermDisplay.textContent = loanTermInput.value;
    
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
    const existingPayments = parseFloat(existingCarPaymentsInput.value) || 0;
    const annualInterestRate = parseFloat(interestRateInput.value);
    const loanTermMonths = parseInt(loanTermInput.value);
    
    // Calculate ideal monthly payment (7% of monthly income minus existing payments)
    const idealTotalPayment = monthlyIncome * 0.07;
    const targetNewPayment = Math.max(0, idealTotalPayment - existingPayments);
    
    if (calculatorMode === 'payment') {
        // Calculate the car price that results in this payment
        const downPayment = parseFloat(downPaymentInput.value);
        let affordableLoanAmount = 0;
        
        if (annualInterestRate > 0) {
            const monthlyInterestRate = annualInterestRate / 100 / 12;
            affordableLoanAmount = targetNewPayment * 
                (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1) / 
                (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTermMonths));
        } else {
            affordableLoanAmount = targetNewPayment * loanTermMonths;
        }
        
        const optimalCarPrice = affordableLoanAmount + downPayment;
        
        // Update car price slider
        carPriceInput.value = Math.round(optimalCarPrice);
        carPriceDisplay.textContent = formatNumber(carPriceInput.value);
        
    } else {
        // In affordability mode, adjust the monthly payment slider
        monthlyPaymentInput.value = Math.round(targetNewPayment);
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
        carPriceInput.disabled = calculatorMode === 'payment';
        monthlyPaymentInput.disabled = calculatorMode === 'affordability';
        
        // Run optimization
        optimizePayment();
    } else {
        // Re-enable manual input
        carPriceInput.disabled = false;
        monthlyPaymentInput.disabled = false;
    }
}

// Calculate and display affordability check
function updateAffordabilityCheck() {
    const annualIncome = parseFloat(annualIncomeInput.value) || 0;
    const monthlyIncome = annualIncome / 12;
    const existingPayments = parseFloat(existingCarPaymentsInput.value) || 0;
    const newPayment = currentMonthlyPayment;
    
    // Calculate total car payments
    const totalPayments = existingPayments + newPayment;
    totalCarPaymentsDisplay.textContent = formatCurrency(totalPayments);
    
    // Calculate debt-to-income ratio for car payments
    const debtRatio = monthlyIncome > 0 ? (totalPayments / monthlyIncome) * 100 : 0;
    debtRatioDisplay.textContent = debtRatio.toFixed(1) + '%';
    
    // Calculate the range boundaries
    // Conservative: 5% of monthly income (safe zone)
    // Max recommended: 10% of monthly income (acceptable zone)
    const conservativePayment = monthlyIncome * 0.05;
    const maxRecommendedPayment = monthlyIncome * 0.10;
    const riskyPayment = monthlyIncome * 0.15;
    
    // Update range labels
    conservativeAmountDisplay.textContent = formatCurrency(conservativePayment);
    maxAmountDisplay.textContent = formatCurrency(maxRecommendedPayment);
    riskyAmountDisplay.textContent = formatCurrency(riskyPayment);
    
    // Calculate marker position (percentage across the bar)
    // The bar represents: 0% to 15% of income
    // Conservative (7%) is at 46.7% position
    // Max recommended (10%) is at 66.7% position
    const maxRange = 0.15; // 15% of income is the full width of the bar
    let markerPosition = (debtRatio / 100) / maxRange * 100;
    markerPosition = Math.min(Math.max(markerPosition, 0), 100); // Clamp between 0-100
    
    rangeMarker.style.left = markerPosition + '%';
    
    // Determine affordability status
    let status, advice, statusClass;
    
    if (debtRatio <= 5) {
        status = 'Excellent';
        statusClass = 'excellent';
        advice = '✓ Excellent! Your car payment is very conservative and well within the safe 5% target. You have significant room in your budget for savings and other expenses.';
    } else if (debtRatio <= 10) {
        status = 'Good';
        statusClass = 'good';
        advice = '✓ Good! Your car payment is within the acceptable 10% of gross monthly income. This is a financially responsible amount that leaves adequate budget flexibility for other expenses and savings.';
    } else if (debtRatio <= 15) {
        status = 'Moderate';
        statusClass = 'moderate';
        advice = '⚠ Moderate. Your car payment is above the 7% ideal but within the acceptable 10% maximum. At ' + debtRatio.toFixed(1) + '% of your income, you should still be able to manage this payment, but consider if you have enough left for other expenses and emergency savings.';
    } else if (debtRatio <= 15) {
        status = 'Caution';
        statusClass = 'caution';
        advice = '⚠ Caution! Your car payments exceed the 10% recommended maximum. At ' + debtRatio.toFixed(1) + '% of your income, this may strain your budget. Consider a less expensive vehicle, larger down payment, or longer loan term to reduce monthly payments.';
    } else {
        status = 'High Risk';
        statusClass = 'high-risk';
        advice = '⛔ High Risk! Your car payments represent ' + debtRatio.toFixed(1) + '% of your gross income, significantly exceeding the recommended maximum of 10%. This payment could seriously impact your financial stability and ability to save. Strongly consider more affordable options.';
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
    carPriceGroup.style.display = 'block';
    monthlyPaymentGroup.style.display = 'none';
    mainResultLabel.textContent = 'Monthly Payment';
    updateDisplays();
}

// Switch to affordability mode
function switchToAffordabilityMode() {
    calculatorMode = 'affordability';
    affordabilityModeBtn.classList.add('active');
    paymentModeBtn.classList.remove('active');
    carPriceGroup.style.display = 'none';
    monthlyPaymentGroup.style.display = 'block';
    mainResultLabel.textContent = 'Affordable Car Price';
    updateDisplays();
}

// Add event listeners to all inputs
carPriceInput.addEventListener('input', updateDisplays);
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
annualIncomeInput.addEventListener('input', () => {
    updateAffordabilityCheck();
    if (isOptimizing) optimizePayment();
});
existingCarPaymentsInput.addEventListener('input', () => {
    updateAffordabilityCheck();
    if (isOptimizing) optimizePayment();
});

// Add event listeners to mode buttons
paymentModeBtn.addEventListener('click', switchToPaymentMode);
affordabilityModeBtn.addEventListener('click', switchToAffordabilityMode);

// Add event listener to optimize checkbox
optimizeCheckbox.addEventListener('change', handleOptimizeChange);

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
    
    // Convert percentage to debt ratio (0-15% of income range)
    const maxRange = 0.15;
    const debtRatio = (percentage / 100) * maxRange;
    
    // Calculate new total payment amount
    const newTotalPayment = monthlyIncome * debtRatio;
    const existingPayments = parseFloat(existingCarPaymentsInput.value) || 0;
    const newCarPayment = Math.max(0, newTotalPayment - existingPayments);
    
    // Update the current monthly payment
    currentMonthlyPayment = newCarPayment;
    
    // Back-calculate the car price from the desired payment
    const downPayment = parseFloat(downPaymentInput.value) || 0;
    const annualRate = parseFloat(interestRateInput.value) / 100;
    const monthlyRate = annualRate / 12;
    const loanTermMonths = parseFloat(loanTermInput.value);
    
    if (newCarPayment > 0) {
        let newCarPrice;
        
        if (monthlyRate > 0) {
            // Use loan payment formula to calculate principal: P = PMT * ((1 - (1 + r)^-n) / r)
            const loanAmount = newCarPayment * ((1 - Math.pow(1 + monthlyRate, -loanTermMonths)) / monthlyRate);
            newCarPrice = Math.max(5000, Math.min(200000, loanAmount + downPayment));
        } else {
            // If interest rate is 0, simple calculation
            const loanAmount = newCarPayment * loanTermMonths;
            newCarPrice = Math.max(5000, Math.min(200000, loanAmount + downPayment));
        }
        
        // Update the car price slider
        carPriceInput.value = Math.round(newCarPrice);
        carPriceDisplay.textContent = formatNumber(Math.round(newCarPrice));
        
        // Save the target payment before recalculating
        const targetPayment = newCarPayment;
        
        // Manually position the marker to match the drag position
        rangeMarker.style.left = percentage + '%';
        
        // Recalculate everything based on the new car price to sync all values
        if (calculatorMode === 'payment') {
            calculateLoan();
        }
        
        // Now override the currentMonthlyPayment with our target for affordability display
        currentMonthlyPayment = targetPayment;
        
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
