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
    color: 'var(--dark-color)',
    backgroundColor: 'var(--event-box-color)',
    border: '2px solid var(--main-color)',
    borderRadius: 'var(--border-radius)',
    '&:hover': (provided) => ({
      ...provided,
      border: '2px solid var(--main-color)'
    }),
  }),
  // Placeholder text
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--alt-dark-color)',
  }),
  // Dropdown menu container
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: 'var(--event-box-color)',
    border: '1px var(--main-color) solid',
    borderRadius: 'var(--border-radius)',
  }),
  // Dropdown menu option
  option: (provided, state) => ({
    ...provided,
    cursor: 'pointer',
    fontSize: '0.8em',
    fontWeight: state.isSelected ? '444' : 'inherit',
    backgroundColor: state.isSelected ? 'var(--main-color)' : 'var(--event-box-color)',
    color: state.isSelected ? 'var(--dark-color)' : 'var(--dark-color)',
    padding: '0.5em',
    '&:hover': {
      backgroundColor: 'var(--main-color)',
      color: 'var(--white-color)',
    },
  }),
  // Vertical lign separator
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'var(--alt-dark-color)',
  }),
  // Dropdown arrow button
  dropdownIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: 'var(--alt-dark-color)',
    '&:hover': {
      color: 'var(--dark-color)',
    }
  }),
};