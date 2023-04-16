// Custom styles for react-select component
export const customStyles = {
  // Select input container
  control: (provided, state) => ({
    ...provided,
    boxSizing: 'border-box',
    boxShadow: 'none',
    cursor: 'text',
    fontSize: '0.75em',
    fontFamily: 'inherit',
    width: '100%',
    color: 'rgb(26, 26, 26)',
    backgroundColor: '#fff',
    border: '2px solid rgb(34, 152, 255)',
    borderRadius: '7.5px',
    '&:hover': (provided) => ({
      ...provided,
      border: '2px solid rgb(34, 152, 255)'
    }),
  }),
  // Placeholder text
  placeholder: (provided) => ({
    ...provided,
    color: 'rgb(174, 174, 174)',
  }),
  // Dropdown menu container
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: '#fff',
    border: '1px rgb(34, 152, 255) solid',
    borderRadius: '7.5px',
  }),
  // Dropdown menu option
  option: (provided, state) => ({
    ...provided,
    cursor: 'pointer',
    fontSize: '0.8em',
    fontWeight: state.isSelected ? '444' : 'inherit',
    backgroundColor: state.isSelected ? 'rgb(34, 152, 255)' : '#fff',
    color: state.isSelected ? 'rgb(26, 26, 26)' : 'rgb(26, 26, 26)',
    padding: '0.5em',
    '&:hover': {
      backgroundColor: 'rgb(34, 152, 255)',
      color: '$white-color',
    },
  }),
  // Vertical lign separator
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'rgb(174, 174, 174)',
  }),
  // Dropdown arrow button
  dropdownIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: 'rgb(174, 174, 174)',
    '&:hover': {
      color: 'rgb(26, 26, 26)',
    }
  }),
};

// Build SQL query for editing comments
export function buildEditCommentQuery(body, userId, commentId) {
  let query = 'UPDATE event_comment SET';
  let values = [];

  // Only update what user provides in request body
  if (body.rating !== undefined) {
    query += ' rating = ?,';
    values.push(body.rating);
  }
  if (body.comment !== undefined) {
    query += ' comment = ?,';
    values.push(body.comment);
  }

  // Remove trailing comma from query
  query = query.slice(0, -1);
  query += ' WHERE comment_id = ? AND user_id = ?;';
  values.push(commentId);
  values.push(userId);

  return { query, values };
}

// Build SQL query for editing event details
export function buildEditQuery(body, eventId) {
  let query = 'UPDATE event SET';
  let values = [];

  // Only update what user provides in request body
  if (body.category !== undefined) {
    query += ' category = ?,';
    values.push(body.category);
  }
  if (body.locationId !== undefined) {
    query += ' location_id = ?,';
    values.push(body.locationid);
  }
  if (body.contactEmail !== undefined) {
    query += ' contact_email = ?,';
    values.push(body.contactEmail);
  }
  if (body.contactName !== undefined) {
    query += ' contact_name = ?,';
    values.push(body.contactName);
  }
  if (body.contactPhone !== undefined) {
    query += ' contact_phone = ?,';
    values.push(body.contactPhone);
  }
  if (body.date !== undefined) {
    query += ' date = ?,';
    values.push(new Date(Date.parse(body.date)));
  }
  if (body.description !== undefined) {
    query += ' description = ?,';
    values.push(body.description);
  }
  if (body.timeEnd !== undefined) {
    query += ' time_end = ?,';
    values.push(new Date(Date.parse(body.timeEnd)));
  }
  if (body.timeStart !== undefined) {
    query += ' time_start = ?,';
    values.push(new Date(Date.parse(body.timeStart)));
  }

  // Remove trailing comma from query
  query = query.slice(0, -1);
  query += ' WHERE event_id = ?;';
  values.push(eventId);

  return { query, values };
}

// Build SQL query for editing university profile
export function buildEditUniQuery(body, userId) {
  let query = 'UPDATE university SET';
  let values = [];

  // Only update what user provides in request body
  if (body.locationId !== undefined) {
    query += ' location_id = ?,';
    values.push(body.locationId);
  }
  if (body.name !== undefined) {
    query += ' name = ?,';
    values.push(body.name);
  }
  if (body.population !== undefined) {
    query += ' population = ?,';
    values.push(body.population);
  }
  if (body.description !== undefined) {
    query += ' description = ?,';
    values.push(body.description);
  }

  // Remove trailing comma from query
  query = query.slice(0, -1);
  query += ' WHERE superadmin_id = ?;';
  values.push(userId);

  return { query, values };
}

// Format Date object
export function convertDateStringToLocal(data) {
  if (Array.isArray(data)) {
    const newData = data.map((event) => {
      const dateString = event.date;
      const startTimeString = event.time_start;
      const endTimeString = event.time_end;
      // const dateString = event.starts;
      // const [dayOfWeek, day, month, year, time, offset] = dateString.split(' ');
      // const timeString = time ? time.split(':').slice(0, 2).join(':') : '';
      // const newDateString = `${dayOfWeek} ${day} ${month} ${year} ${timeString} ${offset}`;
      // const date = new Date(newDateString);

      // Format: DDD, 23 MMM YYYY, HH:mm AM/PM
      const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'America/New_York',
      });

      // Format: HH:mm AM/PM
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York',
    });

      // event.starts = dateFormatter.format(date);
      event.local_date = dateFormatter.format(new Date(dateString));
      event.local_time_start = timeFormatter.format(new Date(startTimeString));
      event.local_time_end = timeFormatter.format(new Date(endTimeString));
      return event;
    });
  }
  else {
    const dateString = data.date;
    const startTimeString = data.time_start;
    const endTimeString = data.time_end;

    // Format: DDD, 23 MMM YYYY, HH:mm AM/PM
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/New_York',
    });

    // Format: HH:mm AM/PM
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      timeZone: 'America/New_York',
    });

    data.local_date = dateFormatter.format(new Date(dateString));
    data.local_time_start = timeFormatter.format(new Date(startTimeString));
    data.local_time_end = timeFormatter.format(new Date(endTimeString));
  }
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