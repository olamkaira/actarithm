import { Calculator } from './calculator';

describe('Calculator Utility', () => {
  describe('calculate', () => {
    test('performs addition correctly', () => {
      expect(Calculator.calculate('2+', '3')).toBe(5);
      expect(Calculator.calculate('0+', '3')).toBe(3);
      expect(Calculator.calculate('-2+', '3')).toBe(1);
    });

    test('performs subtraction correctly', () => {
      expect(Calculator.calculate('5-', '3')).toBe(2);
      expect(Calculator.calculate('0-', '3')).toBe(-3);
      expect(Calculator.calculate('-2-', '3')).toBe(-5);
    });

    test('performs multiplication correctly', () => {
      expect(Calculator.calculate('2*', '3')).toBe(6);
      expect(Calculator.calculate('0*', '3')).toBe(0);
      expect(Calculator.calculate('-2*', '3')).toBe(-6);
    });

    test('performs division correctly', () => {
      expect(Calculator.calculate('6/', '2')).toBe(3);
      expect(Calculator.calculate('0/', '3')).toBe(0);
      expect(Calculator.calculate('-6/', '2')).toBe(-3);
    });

    test('handles division by zero', () => {
      expect(() => Calculator.calculate('6/', '0')).toThrow('Division by zero');
    });

    test('handles invalid input', () => {
      expect(() => Calculator.calculate('abc', '123')).toThrow('Invalid equation');
      expect(() => Calculator.calculate('123+', 'abc')).toThrow('Invalid input');
    });

    test('handles empty equation', () => {
      expect(Calculator.calculate('', '123')).toBe(123);
    });
  });

  describe('formatResult', () => {
    test('formats integers correctly', () => {
      expect(Calculator.formatResult(123)).toBe('123');
      expect(Calculator.formatResult(-123)).toBe('-123');
      expect(Calculator.formatResult(0)).toBe('0');
    });

    test('formats decimals correctly', () => {
      expect(Calculator.formatResult(1.23)).toBe('1.23');
      expect(Calculator.formatResult(-1.23)).toBe('-1.23');
      expect(Calculator.formatResult(0.123456789)).toBe('0.12345679');
    });

    test('handles special cases', () => {
      expect(() => Calculator.formatResult(Infinity)).toThrow('Invalid result');
      expect(() => Calculator.formatResult(NaN)).toThrow('Invalid result');
    });
  });
}); 