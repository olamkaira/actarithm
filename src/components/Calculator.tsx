import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCalculator } from '../hooks/useCalculator';
import { CalculatorDisplay } from './CalculatorDisplay';
import { UnitCategories } from '../utils/converter';

type ErrorType = 'input' | 'calculation' | 'system' | null;

const ErrorMessage = memo(({ type }: { type: ErrorType }) => {
  if (!type) return null;

  const messages = {
    input: 'Invalid input',
    calculation: 'Calculation error',
    system: 'System error'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 bg-destructive/10 text-destructive text-sm p-2 rounded-t-xl text-center"
      role="alert"
      aria-live="polite"
    >
      {messages[type]}
    </motion.div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';

const buttonVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  tap: { scale: 0.98 },
  hover: { scale: 1.02 }
};

const CalculatorButton = memo(({ 
  onClick, 
  className, 
  children,
  ariaLabel,
  disabled
}: { 
  onClick: () => void; 
  className: string; 
  children: React.ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}) => (
  <motion.button
    variants={buttonVariants}
    initial="initial"
    animate="animate"
    whileHover={disabled ? undefined : "hover"}
    whileTap={disabled ? undefined : "tap"}
    onClick={onClick}
    className={`${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {children}
  </motion.button>
));

CalculatorButton.displayName = 'CalculatorButton';

const ProgrammerButtons = memo(({ onOperation, numberBase }: { onOperation: (op: string) => void, numberBase: string }) => (
  <motion.div 
    className="grid grid-cols-4 col-span-4 gap-3 mb-3"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {[
      'HEX', 'DEC', 'OCT', 'BIN',
      'AND', 'OR', 'XOR', 'NOT',
      'LSH', 'RSH', '(', ')'
    ].map((op) => (
      <CalculatorButton
        key={op}
        onClick={() => onOperation(op)}
        className={`calculator-button h-14 ${op === numberBase ? 'bg-primary text-primary-foreground' : ''}`}
        ariaLabel={`Calculate ${op}`}
      >
        {op}
      </CalculatorButton>
    ))}
  </motion.div>
));

ProgrammerButtons.displayName = 'ProgrammerButtons';

const ConverterButtons = memo(({ onSelect, selectedCategory }: { onSelect: (category: string) => void, selectedCategory: string }) => (
  <motion.div 
    className="grid grid-cols-4 col-span-4 gap-3 mb-3"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {Object.keys(UnitCategories).map((category) => (
      <CalculatorButton
        key={category}
        onClick={() => onSelect(category)}
        className={`calculator-button h-14 ${category === selectedCategory ? 'bg-primary text-primary-foreground' : ''}`}
        ariaLabel={`Convert ${UnitCategories[category].name}`}
      >
        {UnitCategories[category].name}
      </CalculatorButton>
    ))}
  </motion.div>
));

ConverterButtons.displayName = 'ConverterButtons';

const UnitSelector = memo(({ 
  label, 
  value, 
  onChange, 
  units 
}: { 
  label: string;
  value: any;
  onChange: (unit: any) => void;
  units: any[];
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm text-muted-foreground">{label}</label>
    <select
      value={value.symbol}
      onChange={(e) => onChange(units.find(u => u.symbol === e.target.value))}
      className="rounded-lg bg-background/50 p-2 text-sm outline-none focus:ring-2 focus:ring-primary"
    >
      {units.map((unit) => (
        <option key={unit.symbol} value={unit.symbol}>
          {unit.name} ({unit.symbol})
        </option>
      ))}
    </select>
  </div>
));

UnitSelector.displayName = 'UnitSelector';

export function Calculator() {
  const {
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
  } = useCalculator();

  return (
    <div className="w-full max-w-md relative" role="region" aria-label="Calculator">
      <AnimatePresence>
        <ErrorMessage type={error} />
      </AnimatePresence>

      <motion.div
        className="mb-6 flex items-center justify-between rounded-xl bg-card/50 p-2 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="grid w-full grid-cols-4 gap-1" role="tablist" aria-label="Calculator modes">
          {['standard', 'scientific', 'programmer', 'converter'].map((modeOption) => (
            <motion.button
              key={modeOption}
              onClick={() => setMode(modeOption as any)}
              role="tab"
              aria-selected={mode === modeOption}
              aria-controls={`${modeOption}-panel`}
              className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                mode === modeOption
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {modeOption.charAt(0).toUpperCase() + modeOption.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl bg-card/50 p-6 shadow-xl backdrop-blur-sm"
        role="tabpanel"
        aria-label={`${mode} calculator panel`}
      >
        <CalculatorDisplay equation={equation} display={display} />

        {mode === 'converter' && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <UnitSelector
              label="From"
              value={fromUnit}
              onChange={setFromUnit}
              units={UnitCategories[selectedCategory].units}
            />
            <UnitSelector
              label="To"
              value={toUnit}
              onChange={setToUnit}
              units={UnitCategories[selectedCategory].units}
            />
          </div>
        )}

        <div className="grid grid-cols-4 gap-3">
          {mode === 'scientific' && (
            <motion.div 
              className="grid grid-cols-4 col-span-4 gap-3 mb-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {[
                'sin', 'cos', 'tan', 'log',
                'ln', 'sqrt', 'square', 'cube',
                'pi', 'e', '(', ')'
              ].map((op) => (
                <CalculatorButton
                  key={op}
                  onClick={() => handleScientific(op)}
                  className="calculator-button h-14"
                  ariaLabel={`Calculate ${op}`}
                >
                  {op === 'sqrt' ? '√' : op === 'square' ? 'x²' : op === 'cube' ? 'x³' : op}
                </CalculatorButton>
              ))}
            </motion.div>
          )}

          {mode === 'programmer' && <ProgrammerButtons onOperation={handleProgrammer} numberBase={numberBase} />}
          {mode === 'converter' && <ConverterButtons onSelect={handleConverter} selectedCategory={selectedCategory} />}

          <CalculatorButton
            onClick={handleClear}
            className="calculator-button col-span-2 h-16"
            ariaLabel="Clear all"
          >
            AC
          </CalculatorButton>
          <CalculatorButton
            onClick={() => mode === 'converter' ? convert() : handleOperator('/')}
            className="operator-button h-16"
            ariaLabel={mode === 'converter' ? "Convert" : "Divide"}
          >
            {mode === 'converter' ? '⟷' : '÷'}
          </CalculatorButton>
          <CalculatorButton
            onClick={() => handleOperator('*')}
            className="operator-button h-16"
            ariaLabel="Multiply"
            disabled={mode === 'converter'}
          >
            ×
          </CalculatorButton>

          {[7, 8, 9].map(num => (
            <CalculatorButton
              key={num}
              onClick={() => handleNumber(String(num))}
              className="calculator-button h-16"
              ariaLabel={String(num)}
            >
              {num}
            </CalculatorButton>
          ))}
          <CalculatorButton
            onClick={() => handleOperator('-')}
            className="operator-button h-16"
            ariaLabel="Subtract"
            disabled={mode === 'converter'}
          >
            −
          </CalculatorButton>

          {[4, 5, 6].map(num => (
            <CalculatorButton
              key={num}
              onClick={() => handleNumber(String(num))}
              className="calculator-button h-16"
              ariaLabel={String(num)}
            >
              {num}
            </CalculatorButton>
          ))}
          <CalculatorButton
            onClick={() => handleOperator('+')}
            className="operator-button h-16"
            ariaLabel="Add"
            disabled={mode === 'converter'}
          >
            +
          </CalculatorButton>

          {[1, 2, 3].map(num => (
            <CalculatorButton
              key={num}
              onClick={() => handleNumber(String(num))}
              className="calculator-button h-16"
              ariaLabel={String(num)}
            >
              {num}
            </CalculatorButton>
          ))}
          <CalculatorButton
            onClick={handleEquals}
            className="operator-button row-span-2 h-[134px]"
            ariaLabel="Calculate result"
            disabled={mode === 'converter'}
          >
            =
          </CalculatorButton>

          <CalculatorButton
            onClick={() => handleNumber('0')}
            className="calculator-button col-span-2 h-16"
            ariaLabel="Zero"
          >
            0
          </CalculatorButton>
          <CalculatorButton
            onClick={handleDecimal}
            className="calculator-button h-16"
            ariaLabel="Decimal point"
            disabled={mode === 'programmer'}
          >
            .
          </CalculatorButton>
        </div>
      </motion.div>
    </div>
  );
} 