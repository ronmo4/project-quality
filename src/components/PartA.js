import React, { useState, useEffect, useCallback } from 'react';
import { applyFilters } from './filterFunctions';
import Filter from './Filter';
import Table from './Table';

const years = [2017, 2018, 2019, 2020, 2021];

function PartA() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ai-ethics-server.onrender.com/api/excel-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const jsonData = result.data;

        setColumns(jsonData[0]);
        setData(jsonData.slice(1));
        createUniqueLists(jsonData.slice(1), jsonData[0]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const createUniqueLists = useCallback((data, columns) => {
    const uniqueLocations = [...new Set(data.map(row => row[5]).filter(location => location))];
    setLocations(uniqueLocations);

    const uniqueSectors = [...new Set(data.map(row => row[3]).filter(sector => sector))];
    setSectors(uniqueSectors);

    const uniqueRegions = [...new Set(data.map(row => row[6]).filter(region => region))];
    setRegions(uniqueRegions);

    const ethicalColumns = columns.slice(7);
    setEthicalValues(ethicalColumns);
  }, []);

  const filterData = useCallback(() => {
    setFilteredData(applyFilters(data, searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, columns));
  }, [data, searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, columns]);

  useEffect(() => {
    filterData();
  }, [searchValue, locationFilter, yearFilter, sectorFilter, regionFilter, ethicalValuesFilter, filterData]);

  const handleRowClick = (row) => {
    const link = row[row.length - 1]; // מניחים שהקישור או כתובת ה-PDF נמצא בעמודה האחרונה
    if (link && link.startsWith('http')) {
      window.open(link, '_blank'); // פתיחת קישור בטאב חדש אם הוא מתחיל ב-http
    } else {
      const id = row[0]; 
      const filePath = `https://ai-ethics-client.onrender.com/AllCodes/${id}.pdf`; // שימוש בכתובת ה-URL המתאימה
      window.open(filePath, '_blank'); // פתיחת קובץ PDF מהשרת בטאב חדש
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

export default PartA;
