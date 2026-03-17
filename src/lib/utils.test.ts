import { describe, it, expect } from 'vitest';
import { getInitials } from './utils';

describe('getInitials', () => {
  it('should return "U" if name is null, undefined, or empty', () => {
    expect(getInitials(null)).toBe('U');
    expect(getInitials(undefined)).toBe('U');
    expect(getInitials('')).toBe('U');
  });

  it('should return the first letter of a single name in uppercase', () => {
    expect(getInitials('john')).toBe('J');
    expect(getInitials('alice')).toBe('A');
  });

  it('should return initials of first and last name', () => {
    expect(getInitials('John Doe')).toBe('JD');
    expect(getInitials('jane smith')).toBe('JS');
  });

  it('should return initials of first and last name even with middle names', () => {
    expect(getInitials('John Quincy Adams')).toBe('JA');
    expect(getInitials('First Middle Last')).toBe('FL');
  });

  it('should handle extra whitespace correctly', () => {
    expect(getInitials('  John    Doe  ')).toBe('JD');
  });

  it('should always return uppercase initials', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});
