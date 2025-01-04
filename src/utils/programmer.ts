export class ProgrammerCalc {
  static toHex(num: number): string {
    return num.toString(16).toUpperCase();
  }

  static toBin(num: number): string {
    return num.toString(2);
  }

  static toOct(num: number): string {
    return num.toString(8);
  }

  static toDec(num: string, base: number): number {
    return parseInt(num, base);
  }

  static and(a: number, b: number): number {
    return a & b;
  }

  static or(a: number, b: number): number {
    return a | b;
  }

  static xor(a: number, b: number): number {
    return a ^ b;
  }

  static not(a: number): number {
    return ~a;
  }

  static leftShift(a: number, b: number): number {
    return a << b;
  }

  static rightShift(a: number, b: number): number {
    return a >> b;
  }

  static formatBinary(bin: string): string {
    // 4'lü gruplar halinde ayır
    const padded = bin.padStart(Math.ceil(bin.length / 4) * 4, '0');
    return padded.match(/.{1,4}/g)?.join(' ') || bin;
  }

  static formatHex(hex: string): string {
    // 2'li gruplar halinde ayır
    return hex.match(/.{1,2}/g)?.join(' ') || hex;
  }

  static formatOctal(oct: string): string {
    // 3'lü gruplar halinde ayır
    return oct.match(/.{1,3}/g)?.join(' ') || oct;
  }
} 