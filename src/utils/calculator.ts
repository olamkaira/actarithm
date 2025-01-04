type Operation = '+' | '-' | '*' | '/' | '%';

export class Calculator {
  private static isValidNumber(num: string): boolean {
    return !isNaN(Number(num)) && isFinite(Number(num));
  }

  private static sanitizeInput(input: string): string {
    return input.replace(/[^0-9+\-*/.%\s]/g, '');
  }

  static calculate(equation: string, currentValue: string): number {
    const sanitizedEquation = this.sanitizeInput(equation);
    const sanitizedValue = this.sanitizeInput(currentValue);

    if (!this.isValidNumber(sanitizedValue)) {
      throw new Error('Invalid input');
    }

    if (!sanitizedEquation) {
      return Number(sanitizedValue);
    }

    const operation = sanitizedEquation.slice(-1) as Operation;
    const firstNumber = Number(sanitizedEquation.slice(0, -1));

    if (!this.isValidNumber(String(firstNumber))) {
      throw new Error('Invalid equation');
    }

    const secondNumber = Number(sanitizedValue);

    switch (operation) {
      case '+':
        return firstNumber + secondNumber;
      case '-':
        return firstNumber - secondNumber;
      case '*':
        return firstNumber * secondNumber;
      case '/':
        if (secondNumber === 0) throw new Error('Division by zero');
        return firstNumber / secondNumber;
      case '%':
        return firstNumber % secondNumber;
      default:
        throw new Error('Invalid operation');
    }
  }

  static formatResult(result: number): string {
    if (!Number.isFinite(result)) {
      throw new Error('Invalid result');
    }

    // Handle decimal precision
    const resultString = result.toString();
    if (resultString.includes('.')) {
      const [, decimal] = resultString.split('.');
      if (decimal.length > 8) {
        return result.toFixed(8);
      }
    }

    return resultString;
  }
} 