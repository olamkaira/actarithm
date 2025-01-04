import { useState, useCallback, useEffect } from 'react';
import { Calculator as CalcUtil } from '../utils/calculator';
import { ProgrammerCalc } from '../utils/programmer';
import { Converter, UnitCategories } from '../utils/converter';

type CalculatorMode = 'standard' | 'scientific' | 'programmer' | 'converter';
type ErrorType = 'input' | 'calculation' | 'system' | null;
type NumberBase = 'DEC' | 'HEX' | 'BIN' | 'OCT';

export function useCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [hasDecimal, setHasDecimal] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('standard');
  const [error, setError] = useState<ErrorType>(null);
  const [numberBase, setNumberBase] = useState<NumberBase>('DEC');
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState(UnitCategories.length.units[0]);
  const [toUnit, setToUnit] = useState(UnitCategories.length.units[1]);

  const clearError = useCallback(() => {
    if (error) {
      setTimeout(() => setError(null), 3000);
    }
  }, [error]);

  const handleNumber = useCallback((num: string) => {
    if (mode === 'programmer') {
      // Programcı modunda base'e göre input kontrolü
      const validChars = {
        DEC: /^[0-9]$/,
        HEX: /^[0-9A-Fa-f]$/,
        BIN: /^[0-1]$/,
        OCT: /^[0-7]$/
      };

      if (!validChars[numberBase].test(num)) {
        setError('input');
        clearError();
        return;
      }
    }

    setDisplay(prev => {
      if (prev.length >= 16) return prev;
      return prev === '0' ? num : prev + num;
    });
    clearError();
  }, [clearError, mode, numberBase]);

  const handleOperator = useCallback((op: string) => {
    setEquation(display + op);
    setDisplay('0');
    setHasDecimal(false);
    clearError();
  }, [display, clearError]);

  const handleDecimal = useCallback(() => {
    if (!hasDecimal && mode !== 'programmer') {
      setDisplay(prev => prev + '.');
      setHasDecimal(true);
    }
    clearError();
  }, [hasDecimal, mode, clearError]);

  const handleClear = useCallback(() => {
    setDisplay('0');
    setEquation('');
    setHasDecimal(false);
    setError(null);
  }, []);

  const handleEquals = useCallback(() => {
    try {
      const result = CalcUtil.calculate(equation, display);
      const formattedResult = CalcUtil.formatResult(result);
      
      setDisplay('');
      setTimeout(() => {
        setDisplay(formattedResult);
      }, 50);
      
      setEquation('');
      setHasDecimal(formattedResult.includes('.'));
    } catch (err) {
      setError('calculation');
      clearError();
    }
  }, [equation, display, clearError]);

  const handleScientific = useCallback((operation: string) => {
    try {
      let result;
      const currentNumber = parseFloat(display);
      
      switch (operation) {
        case 'sin':
          result = Math.sin((currentNumber * Math.PI) / 180);
          break;
        case 'cos':
          result = Math.cos((currentNumber * Math.PI) / 180);
          break;
        case 'tan':
          result = Math.tan((currentNumber * Math.PI) / 180);
          break;
        case 'sqrt':
          result = Math.sqrt(currentNumber);
          break;
        case 'square':
          result = currentNumber * currentNumber;
          break;
        case 'cube':
          result = currentNumber * currentNumber * currentNumber;
          break;
        case 'log':
          result = Math.log10(currentNumber);
          break;
        case 'ln':
          result = Math.log(currentNumber);
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          return;
      }
      
      const formattedResult = CalcUtil.formatResult(result);
      setDisplay(formattedResult);
      setEquation('');
    } catch (error) {
      setError('calculation');
      clearError();
    }
  }, [display, clearError]);

  const handleProgrammer = useCallback((operation: string) => {
    try {
      const currentNumber = parseInt(display, numberBase === 'DEC' ? 10 : numberBase === 'HEX' ? 16 : numberBase === 'BIN' ? 2 : 8);
      let result: number | string = currentNumber;

      switch (operation) {
        case 'HEX':
        case 'DEC':
        case 'BIN':
        case 'OCT':
          setNumberBase(operation as NumberBase);
          result = currentNumber;
          break;
        case 'AND':
        case 'OR':
        case 'XOR':
          const secondNumber = parseInt(equation, 10);
          result = operation === 'AND' ? ProgrammerCalc.and(currentNumber, secondNumber) :
                  operation === 'OR' ? ProgrammerCalc.or(currentNumber, secondNumber) :
                  ProgrammerCalc.xor(currentNumber, secondNumber);
          break;
        case 'NOT':
          result = ProgrammerCalc.not(currentNumber);
          break;
        case 'LSH':
          result = ProgrammerCalc.leftShift(currentNumber, 1);
          break;
        case 'RSH':
          result = ProgrammerCalc.rightShift(currentNumber, 1);
          break;
      }

      // Sonucu seçili tabana çevir
      const displayResult = numberBase === 'HEX' ? ProgrammerCalc.formatHex(ProgrammerCalc.toHex(result)) :
                          numberBase === 'BIN' ? ProgrammerCalc.formatBinary(ProgrammerCalc.toBin(result)) :
                          numberBase === 'OCT' ? ProgrammerCalc.formatOctal(ProgrammerCalc.toOct(result)) :
                          result.toString();

      setDisplay(displayResult);
      setEquation('');
    } catch (error) {
      setError('calculation');
      clearError();
    }
  }, [display, equation, numberBase, clearError]);

  const handleConverter = useCallback((category: string) => {
    setSelectedCategory(category);
    setFromUnit(UnitCategories[category].units[0]);
    setToUnit(UnitCategories[category].units[1]);
  }, []);

  const convert = useCallback(() => {
    try {
      const value = parseFloat(display);
      const result = Converter.convert(value, fromUnit, toUnit, selectedCategory);
      const formattedResult = Converter.formatResult(result);
      setDisplay(formattedResult);
    } catch (error) {
      setError('calculation');
      clearError();
    }
  }, [display, fromUnit, toUnit, selectedCategory, clearError]);

  // Klavye desteği
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'programmer' || mode === 'converter') return;

      // Sayılar
      if (/^[0-9]$/.test(e.key)) {
        handleNumber(e.key);
        return;
      }

      // Operatörler
      switch (e.key) {
        case '+':
        case '-':
        case '*':
        case '/':
          handleOperator(e.key);
          break;
        case '.':
        case ',':
          handleDecimal();
          break;
        case 'Enter':
        case '=':
          handleEquals();
          break;
        case 'Escape':
        case 'c':
        case 'C':
          handleClear();
          break;
        case 'Backspace':
          setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNumber, handleOperator, handleDecimal, handleEquals, handleClear, mode]);

  return {
    display,
    equation,
    mode,
    error,
    numberBase,
    selectedCategory,
    fromUnit,
    toUnit,
    handleNumber,
    handleOperator,
    handleDecimal,
    handleClear,
    handleEquals,
    handleScientific,
    handleProgrammer,
    handleConverter,
    convert,
    setMode,
    setFromUnit,
    setToUnit,
  };
} 