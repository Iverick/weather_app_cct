// Format provided rawTime value to look the following - Today, 03:30 PM
export function formatCurrentTime(rawTime: string): string {
  const currentDate = new Date();
  const weatherDate = new Date(rawTime);

  const isToday = currentDate.toDateString() === weatherDate.toDateString();

  const label = isToday ? "Today" : weatherDate.toLocaleString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const time = weatherDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${label}, ${time}`;
}

export function formatForecastDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { weekday: 'short' });
}
