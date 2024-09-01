import React, { useState, useEffect, useCallback } from 'react';
import { useExcelData } from './useExcelData';
import { applyFilters } from './filterFunctions';
import Filter from './Filter';
import Table from './Table';

const years = [2017, 2018, 2019, 2020, 2021];

function HomeScreen() {
  const { data, columns } = useExcelData('/CODES.xlsx');
  const [searchValue, setSearchValue] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [ethicalValuesFilter, setEthicalValuesFilter] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [ethicalValues, setEthicalValues] = useState([]);

  const createUniqueLists = useCallback((data, columns) => {
    const uniqueLocations = [...new Set(data.slice(1).map(row => row[5]).filter(location => location))];
    setLocations(uniqueLocations);

    const uniqueSectors = [...new Set(data.slice(1).map(row => row[3]).filter(sector => sector))];
    setSectors(uniqueSectors);

    const uniqueRegions = [...new Set(data.slice(1).map(row => row[6]).filter(region => region))];
    setRegions(uniqueRegions);

    const ethicalColumns = columns.slice(7);
    setEthicalValues(ethicalColumns);
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      createUniqueLists(data, columns);
    }
  }, [data, columns, createUniqueLists]);

  const filterData = useCallback(() => {
    setFilteredData(applyFilters(data.slice(1), searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, columns));
  }, [data, searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, columns]);

  useEffect(() => {
    filterData();
  }, [searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, filterData]);

  const handleRowClick = (row) => {
    const link = row[row.length - 1]; // הקישור יהיה בעמודה האחרונה
    if (link && link.startsWith('http')) {
      window.open(link, '_blank'); // פתיחת הקישור בדפדפן
    } else {
      const id = row[0]; 
      const filePath = `${process.env.PUBLIC_URL}/AllCodes/${id}.pdf`;
      window.open(filePath, '_blank');
    }
  };

  return (
    <div className="home-screen">
      <h1>חיפוש בקובץ</h1>
      <Filter
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        locationFilter={locationFilter}
        setLocationFilter={setLocationFilter}
        yearFilter={yearFilter}
        setYearFilter={setYearFilter}
        sectorFilter={sectorFilter}
        setSectorFilter={setSectorFilter}
        regionFilter={regionFilter}
        setRegionFilter={setRegionFilter}
        ethicalValuesFilter={ethicalValuesFilter}
        setEthicalValuesFilter={setEthicalValuesFilter}
        locations={locations}
        years={years}
        sectors={sectors}
        regions={regions}
        ethicalValues={ethicalValues}
      />
      <Table 
        columns={columns} 
        data={filteredData} 
        handleRowClick={handleRowClick}
      />
    </div>
  );
}

export default HomeScreen;
