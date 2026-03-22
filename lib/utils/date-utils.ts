/**
 * Date utility functions for timezone handling
 * All dates should be displayed in GMT+5 (PKT - Pakistan Standard Time)
 */

const GMT_PLUS_5_OFFSET = 5 * 60; // 5 hours in minutes

/**
 * Convert a date to GMT+5 timezone
 */
export function toGMTPlus5(date: Date | string): Date {
  const d = typeof date === 'string' ? new Date(date) : date;

  // Get the UTC time
  const utcTime = d.getTime();

  // Add GMT+5 offset (5 hours = 5 * 60 * 60 * 1000 milliseconds)
  const gmt5Time = new Date(utcTime + GMT_PLUS_5_OFFSET * 60 * 1000);

  return gmt5Time;
}

/**
 * Format a date to locale string in GMT+5
 */
export function formatDateGMT5(date: Date | string): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format a date to locale date string (no time) in GMT+5
 */
export function formatDateOnlyGMT5(date: Date | string): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with long month name in GMT+5
 */
export function formatDateLongGMT5(date: Date | string): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a date with time in GMT+5
 */
export function formatDateTimeGMT5(date: Date | string): string {
  if (!date) return '';

  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleString('en-US', {
    timeZone: 'Asia/Karachi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Format a date with time WITHOUT timezone conversion
 * Display the exact time from the database string (YYYY-MM-DD HH24:MI:SS format)
 */
export function formatDateTimeRaw(date: Date | string): string {
  if (!date) return '';

  // If it's already a formatted string from the backend (YYYY-MM-DD HH24:MI:SS)
  // parse it directly without timezone conversion
  const dateStr = typeof date === 'string' ? date : date.toISOString();

  // Parse the string as if it's in local timezone (no conversion)
  // Format: "2025-12-24 16:07:10"
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);

  if (match) {
    const [, year, month, day, hours24, minutes, seconds] = match;
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthName = months[parseInt(month) - 1];

    let hours = parseInt(hours24);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${monthName} ${parseInt(day)}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  }

  // Fallback: parse as ISO date and display UTC time directly
  const d = new Date(dateStr);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[d.getUTCMonth()];
  const day = d.getUTCDate();
  const year = d.getUTCFullYear();

  let hours = d.getUTCHours();
  const minutes = d.getUTCMinutes().toString().padStart(2, '0');
  const seconds = d.getUTCSeconds().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
}
