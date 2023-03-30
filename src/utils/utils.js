// Format Date object
export function convertDateStringToLocal(data) {
  const newData = data.map((event) => {
    const dateString = event.starts;
    const [dayOfWeek, day, month, year, time, offset] = dateString.split(' ');
    const timeString = time ? time.split(':').slice(0, 2).join(':') : '';
    const newDateString = `${dayOfWeek} ${day} ${month} ${year} ${timeString} ${offset}`;
    const date = new Date(newDateString);

    // Format: DDD, 23 MMM YYYY, HH:mm AM/PM
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York',
    });

    event.starts = dateFormatter.format(date);
    return event;
  });

  return newData;
}

// Username regex
// Requirements:
// - Length: 4-23
// - Begin with a letter
// - Can include: letters | numbers | dashes (-) | underscores (_)
export const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;

// Password regex
// Requirements:
// - Length: 8-24
// - 1 of each: uppercase letter | lowercase letter | number | special character
export const PASS_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%])[a-zA-Z0-9!@#$%]{8,24}$/;

// Email regex
// Format: [name]@[domain].[extension]
export const EMAIL_REGEX = /^([a-zA-Z\d\.-]+)@([a-zA-Z\d-]+)\.([a-z]{2,8})(\.[a-z]{2,8})?$/;