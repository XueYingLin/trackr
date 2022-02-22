export function getHeaderDisplayDate(date: Date) {
  const today = new Date();

  let displayDate;
  if (daysBetween(today, date) < 7) {
    displayDate = Intl.DateTimeFormat([], { weekday: 'long' }).format(date);
  } else if (today.getFullYear() === date.getFullYear()) {
    displayDate = Intl.DateTimeFormat([], { month: 'short', weekday: 'long', day: 'numeric' }).format(date);
  } else {
    displayDate = Intl.DateTimeFormat([], { month: 'short', weekday: 'long', day: 'numeric', year: 'numeric' }).format(date)
  }

  return displayDate;
}

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

function daysBetween(date: Date, anotherDate: Date) {
  return Math.floor((date.getTime() / ONE_DAY_MS) - (anotherDate.getTime() / ONE_DAY_MS))
}

export function addDays(date: Date, days: number) {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
}

export function isToday(date: Date) {
  return daysBetween(new Date(), date) === 0;
}