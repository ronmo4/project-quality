export const filterBySearch = (data, searchValue) => {
    if (searchValue.trim() === '') return data;
    const lowercasedFilter = searchValue.toLowerCase();
    return data.filter(row =>
      (row[1] && row[1].toString().toLowerCase().includes(lowercasedFilter)) ||
      (row[2] && row[2].toString().toLowerCase().includes(lowercasedFilter))
    );
  };
  
  export const filterByLocation = (data, locationFilter) => {
    if (locationFilter === '') return data;
    return data.filter(row => row[5] === locationFilter);
  };
  
  export const filterByYear = (data, yearFilter) => {
    if (yearFilter === '') return data;
    return data.filter(row => row[4] && row[4].toString() === yearFilter);
  };
  
  export const filterBySector = (data, sectorFilter) => {
    if (sectorFilter === '') return data;
    return data.filter(row => row[3] === sectorFilter);
  };
  
  export const filterByRegion = (data, regionFilter) => {
    if (regionFilter === '') return data;
    return data.filter(row => row[6] === regionFilter);
  };
  
  export const filterByEthicalValues = (data, ethicalValuesFilter, columns) => {
    if (ethicalValuesFilter.length === 0) return data;
    return data.filter(row =>
      ethicalValuesFilter.every(value => {
        const columnIndex = columns.indexOf(value);
        return row[columnIndex] === 'X';
      })
    );
  };
  
  export const applyFilters = (data, searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, columns) => {
    let filteredData = filterBySearch(data, searchValue);
    filteredData = filterByLocation(filteredData, locationFilter);
    filteredData = filterByYear(filteredData, yearFilter);
    filteredData = filterBySector(filteredData, sectorFilter);
    filteredData = filterByRegion(filteredData, regionFilter);
    filteredData = filterByEthicalValues(filteredData, ethicalValuesFilter, columns);
    return filteredData;
  };
  