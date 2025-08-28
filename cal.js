// Calculator state variables
let currentInput = '0';
let previousInput = '';
let operation = null;
let shouldResetScreen = false;
let calculationHistory = [];

// DOM elements
const currentOperationScreen = document.getElementById('current-operation');
const previousOperationScreen = document.getElementById('previous-operation');
const errorMessage = document.getElementById('error-message');
const historyList = document.getElementById('history-list');

// Update display function
function updateDisplay() {
    currentOperationScreen.textContent = currentInput;
    previousOperationScreen.textContent = previousInput + (operation ? ' ' + getOperationSymbol(operation) : '');
}

// Get operation symbol for display
function getOperationSymbol(op) {
    switch(op) {
        case '+': return '+';
        case '-': return '−';
        case '*': return '×';
        case '/': return '÷';
        case '%': return '%';
        default: return op;
    }
}

// Append number to current input
function appendNumber(number) {
    clearError();
    
    if (currentInput === '0' || shouldResetScreen) {
        currentInput = number;
        shouldResetScreen = false;
    } else {
        currentInput += number;
    }
    
    // Limit input length to prevent overflow
    if (currentInput.length > 15) {
        showError('Input too long');
        currentInput = currentInput.slice(0, 15);
    }
    
    updateDisplay();
}

// Append operation
function appendOperation(op) {
    clearError();
    
    if (currentInput === 'Error') {
        clearAll();
        return;
    }
    
    if (operation !== null) {
        // If an operation is already pending, calculate it first
        calculate();
    }
    
    previousInput = currentInput;
    operation = op;
    shouldResetScreen = true;
    updateDisplay();
}

// Calculate result
function calculate() {
    clearError();
    
    if (operation === null || shouldResetScreen) return;
    
    if (currentInput === 'Error') {
        clearAll();
        return;
    }
    
    let computation;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) {
        showError('Invalid calculation');
        return;
    }
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '*':
            computation = prev * current;
            break;
        case '/':
            if (current === 0) {
                showError('Cannot divide by zero');
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }
    
    // Format the result to avoid floating point precision issues
    computation = parseFloat(computation.toFixed(10));
    
    // Add to history
    const historyEntry = {
        calculation: `${previousInput} ${getOperationSymbol(operation)} ${currentInput}`,
        result: computation
    };
    calculationHistory.unshift(historyEntry);
    updateHistory();
    
    currentInput = computation.toString();
    operation = null;
    previousInput = '';
    shouldResetScreen = true;
    updateDisplay();
}

// Clear all calculator state
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operation = null;
    shouldResetScreen = false;
    clearError();
    updateDisplay();
}

// Delete last character
function deleteLast() {
    clearError();
    
    if (currentInput === 'Error') {
        clearAll();
        return;
    }
    
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Add decimal point
function appendDecimal() {
    clearError();
    
    if (shouldResetScreen) {
        currentInput = '0.';
        shouldResetScreen = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    currentInput = 'Error';
    shouldResetScreen = true;
    updateDisplay();
}

// Clear error message
function clearError() {
    errorMessage.textContent = '';
}

// Update history display
function updateHistory() {
    historyList.innerHTML = '';
    
    calculationHistory.slice(0, 10).forEach((entry, index) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        li.innerHTML = `
            <div class="history-calculation">${entry.calculation}</div>
            <div class="history-result">= ${entry.result}</div>
        `;
        historyList.appendChild(li);
    });
}

// Clear history
function clearHistory() {
    calculationHistory = [];
    updateHistory();
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    if (/[0-9]/.test(event.key)) {
        appendNumber(event.key);
    } else if (event.key === '.') {
        appendDecimal();
    } else if (event.key === '+') {
        appendOperation('+');
    } else if (event.key === '-') {
        appendOperation('-');
    } else if (event.key === '*') {
        appendOperation('*');
    } else if (event.key === '/') {
        event.preventDefault();
        appendOperation('/');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
    } else if (event.key === 'Escape') {
        clearAll();
    } else if (event.key === 'Backspace') {
        deleteLast();
    } else if (event.key === '%') {
        appendOperation('%');
    }
});

// Initialize calculator
updateDisplay();
updateHistory();