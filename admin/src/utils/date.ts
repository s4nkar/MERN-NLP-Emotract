export function convertToMonthDayCurrentFormat(isoDate) {
    // Parse the input ISO date
    const inputDate = new Date(isoDate);
    
    // Extract day and month from input date
    const day = inputDate.getUTCDate(); // e.g., 9
    const month = inputDate.toLocaleString('default', { month: 'long', timeZone: 'UTC' }); // e.g., "March"
  
    // Get current month and year
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' }); // e.g., "March"
    const currentYear = now.getFullYear(); // e.g., 2025
  
    // Return the formatted string
    return `${day} ${month} ${currentYear} - ${currentMonth} ${currentYear}`;
  }