// Mortgage Calculator - Object-Oriented Refactor
class MortgageCalculator {
    constructor() {
        // State properties
        this.state = {
            homePrice: 350000,
            downPayment: 70000,
            interestRate: 7.0,
            loanTerm: 360,
            propertyTax: 350,
            homeInsurance: 150,
            hoa: 0,
            pmi: 0,
            annualIncome: 0,
            existingDebt: 0,
            targetMonthlyPayment: 500
        };
        
        // Calculated values
        this.calculated = {
            loanAmount: 0,
            monthlyPayment: 0,
            principalInterest: 0,
            totalMonthlyPayment: 0,
            totalInterest: 0,
            totalAmount: 0,
            downPaymentPercent: 0,
            housingRatio: 0,
            debtRatio: 0
        };
        
        // Mode tracking
        this.calculatorMode = 'payment'; // 'payment' or 'affordability'
        this.isUpdating = false; // Prevent circular updates
        this.isDraggingAffordability = false; // Track if user is dragging affordability slider
        
        this.initializeElements();
        this.attachEventListeners();
        this.calculate();
    }
    
    initializeElements() {
        // Input elements
        this.elements = {
            homePrice: document.getElementById('homePrice'),
            homePriceDisplay: document.getElementById('homePriceValue'),
            downPayment: document.getElementById('downPayment'),
            downPaymentDisplay: document.getElementById('downPaymentValue'),
            interestRate: document.getElementById('interestRate'),
            interestRateDisplay: document.getElementById('interestRateValue'),
            loanTerm: document.getElementById('loanTerm'),
            loanTermDisplay: document.getElementById('loanTermValue'),
            propertyTax: document.getElementById('propertyTax'),
            propertyTaxDisplay: document.getElementById('propertyTaxValue'),
            homeInsurance: document.getElementById('homeInsurance'),
            homeInsuranceDisplay: document.getElementById('homeInsuranceValue'),
            hoa: document.getElementById('hoa'),
            hoaDisplay: document.getElementById('hoaValue'),
            pmi: document.getElementById('pmi'),
            pmiDisplay: document.getElementById('pmiValue'),
            annualIncome: document.getElementById('annualIncome'),
            existingDebt: document.getElementById('existingDebtPayments'),
            monthlyPaymentInput: document.getElementById('monthlyPaymentInput'),
            monthlyPaymentInputDisplay: document.getElementById('monthlyPaymentInputValue'),
            
            // Display elements
            mainResultLabel: document.getElementById('mainResultLabel'),
            mainResultValue: document.getElementById('mainResultValue'),
            principalInterestDisplay: document.getElementById('principalInterest'),
            totalMonthlyPaymentDisplay: document.getElementById('totalMonthlyPayment'),
            loanAmountDisplay: document.getElementById('loanAmount'),
            totalInterestDisplay: document.getElementById('totalInterest'),
            totalAmountDisplay: document.getElementById('totalAmount'),
            downPaymentPercentDisplay: document.getElementById('downPaymentPercent'),
            
            // Affordability elements
            housingRatioDisplay: document.getElementById('housingRatio'),
            debtRatioDisplay: document.getElementById('debtRatio'),
            rangeMarker: document.getElementById('rangeMarker'),
            meterStatus: document.getElementById('meterStatus'),
            affordabilityAdvice: document.getElementById('affordabilityAdvice'),
            conservativeAmount: document.getElementById('conservativeAmount'),
            maxAmount: document.getElementById('maxAmount'),
            riskyAmount: document.getElementById('riskyAmount'),
            
            // Mode buttons
            paymentModeBtn: document.getElementById('paymentModeBtn'),
            affordabilityModeBtn: document.getElementById('affordabilityModeBtn'),
            homePriceGroup: document.getElementById('homePriceGroup'),
            monthlyPaymentGroup: document.getElementById('monthlyPaymentGroup')
        };
    }
    
    attachEventListeners() {
        // Input change listeners - these affect loan calculations
        const loanInputs = ['homePrice', 'downPayment', 'interestRate', 'loanTerm', 
                           'propertyTax', 'homeInsurance', 'hoa', 'pmi'];
        
        loanInputs.forEach(input => {
            this.elements[input].addEventListener('input', () => {
                if (!this.isUpdating) {
                    this.state[input] = parseFloat(this.elements[input].value) || 0;
                    this.updateDisplay(input);
                    if (this.calculatorMode === 'payment') {
                        this.calculateFromHomePrice();
                    } else {
                        this.calculateFromPayment();
                    }
                }
            });
        });
        
        // Affordability inputs - only affect ratios, not home price in payment mode
        const affordabilityInputs = ['annualIncome', 'existingDebt'];
        
        affordabilityInputs.forEach(input => {
            this.elements[input].addEventListener('input', () => {
                if (!this.isUpdating) {
                    this.state[input] = parseFloat(this.elements[input].value) || 0;
                    this.updateDisplay(input);
                    if (this.calculatorMode === 'payment') {
                        // Only recalculate affordability ratios, not the loan
                        const monthlyIncome = this.state.annualIncome / 12;
                        if (monthlyIncome > 0) {
                            this.calculated.housingRatio = (this.calculated.totalMonthlyPayment / monthlyIncome) * 100;
                            this.calculated.debtRatio = ((this.calculated.totalMonthlyPayment + this.state.existingDebt) / monthlyIncome) * 100;
                        } else {
                            this.calculated.housingRatio = 0;
                            this.calculated.debtRatio = 0;
                        }
                        this.updateAllDisplays();
                    } else {
                        // In affordability mode, changing income DOES change the affordable price
                        this.calculateFromPayment();
                    }
                }
            });
        });
        
        // Monthly payment input for affordability mode
        this.elements.monthlyPaymentInput.addEventListener('input', () => {
            if (!this.isUpdating && this.calculatorMode === 'affordability') {
                this.state.targetMonthlyPayment = parseFloat(this.elements.monthlyPaymentInput.value) || 0;
                this.elements.monthlyPaymentInputDisplay.textContent = this.formatNumber(this.state.targetMonthlyPayment);
                this.calculateFromPayment();
            }
        });
        
        // Mode buttons
        this.elements.paymentModeBtn.addEventListener('click', () => this.switchMode('payment'));
        this.elements.affordabilityModeBtn.addEventListener('click', () => this.switchMode('affordability'));
        
        // Affordability slider drag
        this.setupAffordabilityDrag();
    }
    
    setupAffordabilityDrag() {
        const rangeMarker = this.elements.rangeMarker;
        const rangeBar = document.querySelector('.range-bar');
        
        rangeMarker.addEventListener('mousedown', (e) => {
            this.isDraggingAffordability = true;
            rangeMarker.classList.add('dragging');
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!this.isDraggingAffordability) return;
            
            const monthlyIncome = this.state.annualIncome / 12;
            if (monthlyIncome === 0) return;
            
            const rect = rangeBar.getBoundingClientRect();
            let positionX = e.clientX - rect.left;
            positionX = Math.max(0, Math.min(positionX, rect.width));
            const percentage = (positionX / rect.width) * 100;
            
            // Convert percentage to housing ratio (0-45% range, equal thirds)
            const maxRange = 0.45;
            const targetHousingRatio = (percentage / 100) * maxRange;
            
            // Calculate target total monthly payment
            const targetPayment = monthlyIncome * targetHousingRatio;
            
            // Calculate home price from this target payment
            this.calculateHomePriceFromTargetPayment(targetPayment, percentage);
        });
        
        document.addEventListener('mouseup', () => {
            if (this.isDraggingAffordability) {
                this.isDraggingAffordability = false;
                rangeMarker.classList.remove('dragging');
            }
        });
    }
    
    calculateHomePriceFromTargetPayment(targetTotalPayment, sliderPercentage) {
        // Subtract fixed costs from target payment to get P&I
        const fixedCosts = this.state.propertyTax + this.state.homeInsurance + 
                          this.state.hoa + this.state.pmi;
        const targetPI = Math.max(0, targetTotalPayment - fixedCosts);
        
        if (targetPI <= 0) return;
        
        const monthlyRate = (this.state.interestRate / 100) / 12;
        const loanTermMonths = this.state.loanTerm;
        
        let loanAmount;
        if (monthlyRate > 0) {
            // PV = PMT * ((1 - (1 + r)^-n) / r)
            loanAmount = targetPI * ((1 - Math.pow(1 + monthlyRate, -loanTermMonths)) / monthlyRate);
        } else {
            loanAmount = targetPI * loanTermMonths;
        }
        
        const newHomePrice = Math.max(50000, Math.min(2000000, loanAmount + this.state.downPayment));
        
        // Update state and recalculate
        this.state.homePrice = newHomePrice;
        this.isUpdating = true;
        this.elements.homePrice.value = Math.round(newHomePrice);
        this.elements.homePriceDisplay.textContent = this.formatNumber(Math.round(newHomePrice));
        this.isUpdating = false;
        
        // Recalculate all values from this home price
        this.calculateFromHomePrice();
        
        // Override the affordability display to show our target ratio
        const monthlyIncome = this.state.annualIncome / 12;
        if (monthlyIncome > 0) {
            const targetRatio = (targetTotalPayment / monthlyIncome) * 100;
            this.calculated.housingRatio = targetRatio;
            this.elements.housingRatioDisplay.textContent = targetRatio.toFixed(1) + '%';
            
            // Position marker at exact drag location
            this.elements.rangeMarker.style.left = sliderPercentage + '%';
            
            // Update affordability status
            this.updateAffordabilityStatus();
        }
    }
    
    calculateFromHomePrice() {
        // Calculate loan amount
        this.calculated.loanAmount = this.state.homePrice - this.state.downPayment;
        this.calculated.downPaymentPercent = (this.state.downPayment / this.state.homePrice) * 100;
        
        // Calculate monthly P&I
        const principal = this.calculated.loanAmount;
        const monthlyRate = (this.state.interestRate / 100) / 12;
        const numPayments = this.state.loanTerm;
        
        if (monthlyRate > 0 && principal > 0) {
            this.calculated.principalInterest = principal * 
                (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                (Math.pow(1 + monthlyRate, numPayments) - 1);
        } else {
            this.calculated.principalInterest = principal / numPayments;
        }
        
        // Calculate total monthly payment
        this.calculated.totalMonthlyPayment = this.calculated.principalInterest + 
            this.state.propertyTax + this.state.homeInsurance + this.state.hoa + this.state.pmi;
        
        this.calculated.monthlyPayment = this.calculated.totalMonthlyPayment;
        
        // Calculate total interest and amount
        this.calculated.totalAmount = (this.calculated.principalInterest * numPayments) + 
            (this.state.propertyTax * numPayments) + (this.state.homeInsurance * numPayments) + 
            (this.state.hoa * numPayments) + (this.state.pmi * numPayments);
        this.calculated.totalInterest = this.calculated.totalAmount - this.state.homePrice;
        
        // Calculate affordability ratios
        const monthlyIncome = this.state.annualIncome / 12;
        if (monthlyIncome > 0 && !this.isDraggingAffordability) {
            this.calculated.housingRatio = (this.calculated.totalMonthlyPayment / monthlyIncome) * 100;
            this.calculated.debtRatio = ((this.calculated.totalMonthlyPayment + this.state.existingDebt) / monthlyIncome) * 100;
        } else if (!this.isDraggingAffordability) {
            this.calculated.housingRatio = 0;
            this.calculated.debtRatio = 0;
        }
        
        this.updateAllDisplays();
    }
    
    calculateFromPayment() {
        const targetPI = this.state.targetMonthlyPayment - this.state.propertyTax - 
                        this.state.homeInsurance - this.state.hoa - this.state.pmi;
        
        if (targetPI <= 0) return;
        
        const monthlyRate = (this.state.interestRate / 100) / 12;
        const numPayments = this.state.loanTerm;
        
        let loanAmount;
        if (monthlyRate > 0) {
            loanAmount = targetPI * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
        } else {
            loanAmount = targetPI * numPayments;
        }
        
        const affordablePrice = loanAmount + this.state.downPayment;
        
        this.state.homePrice = Math.max(50000, Math.min(2000000, affordablePrice));
        
        this.isUpdating = true;
        this.elements.homePrice.value = Math.round(this.state.homePrice);
        this.elements.homePriceDisplay.textContent = this.formatNumber(Math.round(this.state.homePrice));
        this.isUpdating = false;
        
        this.calculateFromHomePrice();
    }
    
    updateAllDisplays() {
        // Update main result
        this.elements.mainResultValue.textContent = this.formatCurrency(Math.round(this.calculated.monthlyPayment));
        
        // Update detailed results
        this.elements.principalInterestDisplay.textContent = this.formatCurrency(Math.round(this.calculated.principalInterest));
        this.elements.totalMonthlyPaymentDisplay.textContent = this.formatCurrency(Math.round(this.calculated.totalMonthlyPayment));
        this.elements.loanAmountDisplay.textContent = this.formatCurrency(Math.round(this.calculated.loanAmount));
        this.elements.totalInterestDisplay.textContent = this.formatCurrency(Math.round(this.calculated.totalInterest));
        this.elements.totalAmountDisplay.textContent = this.formatCurrency(Math.round(this.calculated.totalAmount));
        this.elements.downPaymentPercentDisplay.textContent = this.calculated.downPaymentPercent.toFixed(1) + '%';
        
        // Update affordability displays (only if not dragging)
        if (!this.isDraggingAffordability) {
            this.elements.housingRatioDisplay.textContent = this.calculated.housingRatio.toFixed(1) + '%';
            this.elements.debtRatioDisplay.textContent = this.calculated.debtRatio.toFixed(1) + '%';
            
            // Update affordability marker position
            const maxRange = 0.45;
            const housingRatioDecimal = this.calculated.housingRatio / 100;
            let markerPosition = (housingRatioDecimal / maxRange) * 100;
            markerPosition = Math.min(Math.max(markerPosition, 0), 100);
            this.elements.rangeMarker.style.left = markerPosition + '%';
            
            this.updateAffordabilityStatus();
        }
        
        // Update affordability labels
        const monthlyIncome = this.state.annualIncome / 12;
        this.elements.conservativeAmount.textContent = this.formatCurrency(monthlyIncome * 0.15);
        this.elements.maxAmount.textContent = this.formatCurrency(monthlyIncome * 0.30);
        this.elements.riskyAmount.textContent = this.formatCurrency(monthlyIncome * 0.45);
    }
    
    updateAffordabilityStatus() {
        const housingRatio = this.calculated.housingRatio;
        const debtRatio = this.calculated.debtRatio;
        
        let status, advice, statusClass;
        
        if (housingRatio <= 15) {
            status = 'Excellent';
            statusClass = 'excellent';
            advice = '✓ Excellent! Your housing payment is very conservative at ' + housingRatio.toFixed(1) + '% of your income.';
        } else if (housingRatio <= 30) {
            status = 'Good';
            statusClass = 'good';
            advice = '✓ Good! Your housing payment of ' + housingRatio.toFixed(1) + '% is acceptable.';
        } else if (housingRatio <= 36) {
            status = 'Moderate';
            statusClass = 'moderate';
            advice = '⚠ Moderate. Your housing payment of ' + housingRatio.toFixed(1) + '% is elevated.';
        } else {
            status = 'High Risk';
            statusClass = 'risky';
            advice = '⚠ High Risk! Your housing payment of ' + housingRatio.toFixed(1) + '% is very high.';
        }
        
        this.elements.meterStatus.textContent = status;
        this.elements.meterStatus.className = 'meter-status ' + statusClass;
        this.elements.affordabilityAdvice.textContent = advice;
    }
    
    updateDisplay(input) {
        const displayElement = this.elements[input + 'Display'];
        if (displayElement) {
            displayElement.textContent = this.formatNumber(this.state[input]);
        }
    }
    
    switchMode(mode) {
        this.calculatorMode = mode;
        
        if (mode === 'payment') {
            this.elements.paymentModeBtn.classList.add('active');
            this.elements.affordabilityModeBtn.classList.remove('active');
            this.elements.homePriceGroup.style.display = 'block';
            this.elements.monthlyPaymentGroup.style.display = 'none';
            this.elements.mainResultLabel.textContent = 'Monthly Payment';
            this.calculateFromHomePrice();
        } else {
            this.elements.paymentModeBtn.classList.remove('active');
            this.elements.affordabilityModeBtn.classList.add('active');
            this.elements.homePriceGroup.style.display = 'none';
            this.elements.monthlyPaymentGroup.style.display = 'block';
            this.elements.mainResultLabel.textContent = 'Affordable Home Price';
            this.calculateFromPayment();
        }
    }
    
    calculate() {
        if (this.calculatorMode === 'payment') {
            this.calculateFromHomePrice();
        } else {
            this.calculateFromPayment();
        }
    }
    
    formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }
    
    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(Math.round(value));
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.mortgageCalculator = new MortgageCalculator();
});
