        // Global variables
        let currentInput = '0';
        let previousInput = '';
        let currentOperator = null;
        let shouldResetScreen = false;
        let calculationHistory = [];

        // DOM elements
        const resultDisplay = document.getElementById('resultDisplay');
        const calculationDisplay = document.getElementById('calculationDisplay');
        const historyList = document.getElementById('historyList');
        const errorMessage = document.getElementById('errorMessage');

        // Initialize calculator
        function initializeCalculator() {
            updateDisplay();
            loadHistoryFromStorage();
            updateHistoryDisplay();
        }

        // Append number to current input
        function appendNumber(number) {
            hideError();
            
            if (currentInput === '0' || shouldResetScreen) {
                currentInput = number;
                shouldResetScreen = false;
            } else {
                currentInput += number;
            }
            
            updateDisplay();
        }

        // Append decimal point
        function appendDecimal() {
            hideError();
            
            if (shouldResetScreen) {
                currentInput = '0.';
                shouldResetScreen = false;
            } else if (!currentInput.includes('.')) {
                currentInput += '.';
            }
            
            updateDisplay();
        }

        // Append operator
        function appendOperator(operator) {
            hideError();
            
            if (currentOperator !== null) {
                calculate();
            }
            
            previousInput = currentInput;
            currentOperator = operator;
            shouldResetScreen = true;
            
            updateCalculationDisplay();
        }

        // Perform calculation
        function calculate() {
            hideError();
            
            if (currentOperator === null || shouldResetScreen) {
                return;
            }
            
            let result;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev) || isNaN(current)) {
                showError('Invalid calculation');
                return;
            }
            
            switch (currentOperator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '×':
                    result = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        showError('Cannot divide by zero');
                        return;
                    }
                    result = prev / current;
                    break;
                default:
                    return;
            }
            
            // Format result to avoid floating point precision issues
            result = Math.round(result * 100000000) / 100000000;
            
            // Add to history
            const calculation = `${previousInput} ${currentOperator} ${currentInput} = ${result}`;
            addToHistory(calculation);
            
            currentInput = result.toString();
            currentOperator = null;
            shouldResetScreen = true;
            
            updateDisplay();
            updateCalculationDisplay();
        }

        // Clear all inputs
        function clearAll() {
            hideError();
            currentInput = '0';
            previousInput = '';
            currentOperator = null;
            shouldResetScreen = false;
            updateDisplay();
            calculationDisplay.textContent = '';
        }

        // Update main display
        function updateDisplay() {
            resultDisplay.textContent = formatNumber(currentInput);
        }

        // Update calculation display
        function updateCalculationDisplay() {
            if (currentOperator) {
                calculationDisplay.textContent = `${formatNumber(previousInput)} ${currentOperator}`;
            } else {
                calculationDisplay.textContent = '';
            }
        }

        // Format number for display
        function formatNumber(number) {
            const num = parseFloat(number);
            if (isNaN(num)) return '0';
            
            // Handle large numbers with scientific notation
            if (Math.abs(num) > 999999999999999) {
                return num.toExponential(6);
            }
            
            return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        // Add calculation to history
        function addToHistory(calculation) {
            calculationHistory.unshift(calculation);
            if (calculationHistory.length > 10) {
                calculationHistory.pop();
            }
            saveHistoryToStorage();
            updateHistoryDisplay();
        }

        // Clear history
        function clearHistory() {
            calculationHistory = [];
            saveHistoryToStorage();
            updateHistoryDisplay();
        }

        // Update history display
        function updateHistoryDisplay() {
            historyList.innerHTML = '';
            
            if (calculationHistory.length === 0) {
                historyList.innerHTML = '<div class="history-item">No calculations yet</div>';
                return;
            }
            
            calculationHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = item;
                historyList.appendChild(historyItem);
            });
        }

        // Save history to localStorage
        function saveHistoryToStorage() {
            localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
        }

        // Load history from localStorage
        function loadHistoryFromStorage() {
            const savedHistory = localStorage.getItem('calculatorHistory');
            if (savedHistory) {
                calculationHistory = JSON.parse(savedHistory);
            }
        }

        // Show error message
        function showError(message) {
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
            
            // Auto-hide error after 3 seconds
            setTimeout(hideError, 3000);
        }

        // Hide error message
        function hideError() {
            errorMessage.style.display = 'none';
        }

        // Keyboard support
        document.addEventListener('keydown', function(event) {
            if (/[0-9]/.test(event.key)) {
                appendNumber(event.key);
            } else if (event.key === '.') {
                appendDecimal();
            } else if (event.key === '+') {
                appendOperator('+');
            } else if (event.key === '-') {
                appendOperator('-');
            } else if (event.key === '*') {
                appendOperator('×');
            } else if (event.key === '/') {
                event.preventDefault();
                appendOperator('÷');
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                calculate();
            } else if (event.key === 'Escape' || event.key === 'Delete') {
                clearAll();
            } else if (event.key === 'Backspace') {
                event.preventDefault();
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                updateDisplay();
            }
        });

        // Initialize calculator on load
        window.onload = initializeCalculator;