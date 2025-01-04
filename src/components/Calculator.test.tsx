import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from './Calculator';

describe('Calculator Component', () => {
  beforeEach(() => {
    render(<Calculator />);
  });

  test('renders calculator with all modes', () => {
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Scientific')).toBeInTheDocument();
    expect(screen.getByText('Programmer')).toBeInTheDocument();
    expect(screen.getByText('Converter')).toBeInTheDocument();
  });

  test('performs basic arithmetic operations', () => {
    // Click numbers and operators
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('='));

    // Check display
    const display = screen.getByText('3');
    expect(display).toBeInTheDocument();
  });

  test('switches between calculator modes', () => {
    // Switch to Scientific mode
    fireEvent.click(screen.getByText('Scientific'));
    expect(screen.getByText('sin')).toBeInTheDocument();
    expect(screen.getByText('cos')).toBeInTheDocument();

    // Switch to Programmer mode
    fireEvent.click(screen.getByText('Programmer'));
    expect(screen.getByText('HEX')).toBeInTheDocument();
    expect(screen.getByText('BIN')).toBeInTheDocument();
  });

  test('handles decimal input correctly', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('.'));
    fireEvent.click(screen.getByText('5'));
    
    const display = screen.getByText('1.5');
    expect(display).toBeInTheDocument();
  });

  test('clears display with AC button', () => {
    fireEvent.click(screen.getByText('1'));
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('AC'));
    
    const display = screen.getByText('0');
    expect(display).toBeInTheDocument();
  });
}); 