export const  dateFormater = (isoDateString) => {
  const date = new Date(isoDateString);
  
  const options = {
    // weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
    // second: '2-digit',
    // timeZoneName: 'short'
  };
  
  return date.toLocaleDateString('en-US', options) 
//   + '.' + date.getMilliseconds().toString().padStart(3, '0');
}