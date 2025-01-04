type Unit = {
  name: string;
  factor: number;
  symbol: string;
};

type UnitCategory = {
  name: string;
  units: Unit[];
  baseUnit: string;
};

export const UnitCategories: Record<string, UnitCategory> = {
  length: {
    name: 'Length',
    baseUnit: 'm',
    units: [
      { name: 'Kilometer', factor: 1000, symbol: 'km' },
      { name: 'Meter', factor: 1, symbol: 'm' },
      { name: 'Centimeter', factor: 0.01, symbol: 'cm' },
      { name: 'Millimeter', factor: 0.001, symbol: 'mm' },
      { name: 'Mile', factor: 1609.34, symbol: 'mi' },
      { name: 'Yard', factor: 0.9144, symbol: 'yd' },
      { name: 'Foot', factor: 0.3048, symbol: 'ft' },
      { name: 'Inch', factor: 0.0254, symbol: 'in' }
    ]
  },
  area: {
    name: 'Area',
    baseUnit: 'm²',
    units: [
      { name: 'Square Kilometer', factor: 1000000, symbol: 'km²' },
      { name: 'Square Meter', factor: 1, symbol: 'm²' },
      { name: 'Square Mile', factor: 2589988.11, symbol: 'mi²' },
      { name: 'Acre', factor: 4046.86, symbol: 'ac' },
      { name: 'Hectare', factor: 10000, symbol: 'ha' }
    ]
  },
  volume: {
    name: 'Volume',
    baseUnit: 'L',
    units: [
      { name: 'Cubic Meter', factor: 1000, symbol: 'm³' },
      { name: 'Liter', factor: 1, symbol: 'L' },
      { name: 'Milliliter', factor: 0.001, symbol: 'mL' },
      { name: 'Gallon (US)', factor: 3.78541, symbol: 'gal' },
      { name: 'Quart (US)', factor: 0.946353, symbol: 'qt' },
      { name: 'Pint (US)', factor: 0.473176, symbol: 'pt' }
    ]
  },
  mass: {
    name: 'Mass',
    baseUnit: 'kg',
    units: [
      { name: 'Tonne', factor: 1000, symbol: 't' },
      { name: 'Kilogram', factor: 1, symbol: 'kg' },
      { name: 'Gram', factor: 0.001, symbol: 'g' },
      { name: 'Milligram', factor: 0.000001, symbol: 'mg' },
      { name: 'Pound', factor: 0.453592, symbol: 'lb' },
      { name: 'Ounce', factor: 0.0283495, symbol: 'oz' }
    ]
  },
  temperature: {
    name: 'Temperature',
    baseUnit: '°C',
    units: [
      { name: 'Celsius', factor: 1, symbol: '°C' },
      { name: 'Fahrenheit', factor: 1, symbol: '°F' },
      { name: 'Kelvin', factor: 1, symbol: 'K' }
    ]
  }
};

export class Converter {
  static convert(value: number, from: Unit, to: Unit, category: string): number {
    if (category === 'temperature') {
      return this.convertTemperature(value, from.symbol, to.symbol);
    }

    // Diğer birimler için basit çarpma/bölme
    const baseValue = value * from.factor;
    return baseValue / to.factor;
  }

  private static convertTemperature(value: number, from: string, to: string): number {
    let celsius: number;

    // Önce Celsius'a çevir
    switch (from) {
      case '°C':
        celsius = value;
        break;
      case '°F':
        celsius = (value - 32) * 5/9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      default:
        return value;
    }

    // Celsius'tan hedef birime çevir
    switch (to) {
      case '°C':
        return celsius;
      case '°F':
        return (celsius * 9/5) + 32;
      case 'K':
        return celsius + 273.15;
      default:
        return celsius;
    }
  }

  static formatResult(value: number): string {
    if (Math.abs(value) < 0.000001 || Math.abs(value) > 999999) {
      return value.toExponential(6);
    }
    return value.toPrecision(7).replace(/\.?0+$/, '');
  }
} 