import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

export function formatHumanReadableDate(dateString: string): string {
  const date = new Date(dateString);

  if (isToday(date)) {
    return `Today, ${format(date, 'h:mma')}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, 'h:mma')}`;
  }

  if (isThisWeek(date, { weekStartsOn: 1 })) {
    return `${format(date, 'EEE')} ${format(date, 'h:mma')}`;  
  }

  return format(date, 'do, MMMM');  
}

export function formatDate(date: string | Date): string {
  return format(date, 'dd MMM');
}
