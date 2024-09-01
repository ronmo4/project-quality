import React from 'react';

function Search({ value, setValue, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  );
}

export default Search;
