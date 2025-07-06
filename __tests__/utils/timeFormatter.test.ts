import {
  formatCurrentTime,
  formatForecastDate
} from '@/utils/timeFormatter';

describe('timeFormatter', () => {
  beforeAll(() => {
    // Freeze "time now" to 2025-07-06T10:00:00Z
    jest.useFakeTimers('modern').setSystemTime(
      Date.parse('2025-07-06T10:00:00Z')
    );
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('prepends "Today" when the date matches today', () => {
    const raw = '2025-07-06T14:30:00Z';
    const weatherDate = new Date(raw);

    // Build expected the same way the code does:
    const formattedDate = weatherDate.toLocaleString(undefined, {
      weekday: 'short',
      day:     'numeric',
      month:   'short',
    });
    const time = weatherDate.toLocaleTimeString(undefined, {
      hour:   '2-digit',
      minute: '2-digit',
    });
    const expected = `Today, ${formattedDate}, ${time}`;

    expect(formatCurrentTime(raw)).toBe(expected);
  });

  it('omits "Today" when the date is not today', () => {
    const raw = '2025-07-05T09:15:00Z'; // one day earlier
    const weatherDate = new Date(raw);

    const formattedDate = weatherDate.toLocaleString(undefined, {
      weekday: 'short',
      day:     'numeric',
      month:   'short',
    });
    const time = weatherDate.toLocaleTimeString(undefined, {
      hour:   '2-digit',
      minute: '2-digit',
    });
    const expected = `${formattedDate}, ${time}`;

    expect(formatCurrentTime(raw)).toBe(expected);
  });

  it('formats forecast dates to a short weekday', () => {
    const raw = '2025-07-07'; // a Monday in the frozen timeline
    const date = new Date(raw);
    const expected = date.toLocaleDateString(undefined, { weekday: 'short' });
    expect(formatForecastDate(raw)).toBe(expected);
  });
});
