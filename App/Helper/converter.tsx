/*
 *   File : converter.tsx
 *   Author URI : https://evoqins.com
 *   Description : file for repeated function calls and helper functions
 *   Integrations : null
 *   Version : v1.1
 */

// ✅ Function to format number to Indian Rupees format
export const _formatToRupees = (val: string | number): string => {
  if (val === null || val === undefined) return '';
  if (val === '.') return '0.';

  // remove any existing commas
  const amount = val.toString().replace(/,/g, '');
  let [integer, decimal] = amount.split('.');

  integer = integer || '0';

  let last_three = integer.substring(integer.length - 3);
  const other_numbers = integer.substring(0, integer.length - 3);

  if (other_numbers !== '') last_three = ',' + last_three;
  const formatted = other_numbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + last_three;

  if (decimal !== undefined) {
    decimal = decimal.substring(0, 2);
    return `${formatted}.${decimal}`;
  }

  return formatted;
};

// ✅ Reverse a date from DD-MM-YYYY to YYYY-MM-DD
export const _formatDate = (dateString: string): string => {
  return dateString.split('-').reverse().join('-');
};

// ✅ Calculate age from birth date
export const _getAge = (dateString: string): string => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age.toString(); // Return string since function is typed to return string
};

// ✅ Format amount with suffix (K, Lakh, Cr)
export const _formatAmount = (amount: number): string => {
  if (amount >= 10000000) {
    return (amount / 10000000).toFixed(2) + ' Cr';
  } else if (amount >= 100000) {
    return (amount / 100000).toFixed(2) + ' Lakh';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + ' K';
  } else {
    return amount.toString();
  }
};

// ✅ Get suffix (st, nd, rd, th) for dates
export function _getSuffixesDate(day: string): string {
  if (day === '1' || day === '21' || day === '31') {
    return 'st';
  } else if (day === '2' || day === '22') {
    return 'nd';
  } else if (day === '3' || day === '23') {
    return 'rd';
  } else {
    return 'th';
  }
}
