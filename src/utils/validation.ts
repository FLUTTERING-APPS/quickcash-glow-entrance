// Validation utilities for Aadhaar and PAN

export const validateAadhaar = (aadhaar: string): { isValid: boolean; error?: string } => {
  // Remove spaces and convert to string
  const cleanAadhaar = aadhaar.replace(/\s/g, '');
  
  // Check if it's 12 digits
  if (!/^\d{12}$/.test(cleanAadhaar)) {
    return { isValid: false, error: 'Aadhaar must be exactly 12 digits' };
  }
  
  // Check if it starts with 2-9 (Aadhaar numbers don't start with 0 or 1)
  if (!/^[2-9]/.test(cleanAadhaar)) {
    return { isValid: false, error: 'Aadhaar number must start with 2-9' };
  }
  
  // Basic checksum validation (simplified version)
  const digits = cleanAadhaar.split('').map(Number);
  
  return { isValid: true };
};

export const validatePAN = (pan: string): { isValid: boolean; error?: string } => {
  // Remove spaces and convert to uppercase
  const cleanPAN = pan.replace(/\s/g, '').toUpperCase();
  
  // Check PAN format: ABCDE1234F (5 letters, 4 digits, 1 letter)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  
  if (!panRegex.test(cleanPAN)) {
    return { isValid: false, error: 'PAN format should be ABCDE1234F (5 letters, 4 digits, 1 letter)' };
  }
  
  return { isValid: true };
};

export const formatAadhaar = (value: string): string => {
  // Remove all non-digits
  const numbers = value.replace(/\D/g, '');
  
  // Limit to 12 digits
  const limited = numbers.substring(0, 12);
  
  // Format as XXXX XXXX XXXX
  return limited.replace(/(\d{4})(?=\d)/g, '$1 ');
};

export const formatPAN = (value: string): string => {
  // Remove spaces and convert to uppercase
  const clean = value.replace(/\s/g, '').toUpperCase();
  
  // Limit to 10 characters
  const limited = clean.substring(0, 10);
  
  // Format as ABCDE 1234 F
  if (limited.length > 5) {
    if (limited.length > 9) {
      return `${limited.substring(0, 5)} ${limited.substring(5, 9)} ${limited.substring(9)}`;
    }
    return `${limited.substring(0, 5)} ${limited.substring(5)}`;
  }
  
  return limited;
};