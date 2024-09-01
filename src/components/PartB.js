import React, { useState, useEffect } from 'react';
import AddForm from './AddForm';

function PartB({ onAddRow, columns }) {
  const [data, setData] = useState([]); 
  const [locations, setLocations] = useState([]);
  const [years, setYears] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [regions, setRegions] = useState([]);
  const [ethicalValues, setEthicalValues] = useState([]);
  const [entityName, setEntityName] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [ethicalValuesFilter, setEthicalValuesFilter] = useState([]);
  const [link, setLink] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://ai-ethics-server.onrender.com/api/excel-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const jsonData = result.data;

        const formattedData = jsonData.slice(1).map(row => {
          return columns.reduce((acc, col, index) => {
            acc[col] = row[index] || '';
            return acc;
          }, {});
        });

        setData(formattedData);
        setLocations([...new Set(formattedData.map(row => row.Location).filter(location => location))]);
        setYears([...new Set(formattedData.map(row => row.Year).filter(year => year))]);
        setSectors([...new Set(formattedData.map(row => row.Sector).filter(sector => sector))]);
        setRegions([...new Set(formattedData.map(row => row.Region).filter(region => region))]);
        setEthicalValues(columns.slice(7));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [columns]);

  const handleAddNewRow = async () => {
    if (!entityName || !documentName || !year || !location || !region || !sector || ethicalValuesFilter.length === 0) {
      setShowAlert(true);
      return;
    }
  
    const newRow = new Array(columns.length).fill('');
    newRow[1] = entityName;
    newRow[2] = documentName;
    newRow[3] = sector;
    newRow[4] = year;
    newRow[5] = location;
    newRow[6] = region;
    if (link) newRow.push(link);
  
    ethicalValuesFilter.forEach(value => {
      const columnIndex = columns.indexOf(value);
      if (columnIndex > -1) {
        newRow[columnIndex] = 'X';
      }
    });
  
    try {
      const response = await fetch('https://ai-ethics-server.onrender.com/api/update-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newRow] })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update Excel file');
      }
  
      const newDataWithId = await response.json(); // קבל את השורה החדשה עם ה-ID מהשרת
      setData(prevData => [...prevData, newDataWithId]); // הוספת השורה עם ה-ID המתקבל
      resetForm();
    } catch (error) {
      console.error('Error updating Excel data:', error);
    }
  };
  

  const resetForm = () => {
    setEntityName('');
    setDocumentName('');
    setYear('');
    setLocation('');
    setRegion('');
    setSector('');
    setEthicalValuesFilter([]);
    setLink('');
  };

  return (
    <div className="home-screen">
      <h1>הוספת נתונים חדשים</h1>
      {showAlert && (
        <div className="alert">
          <h3>אנא מלא את כל השדות</h3>
          <button onClick={() => setShowAlert(false)} className="add-button">אישור</button>
        </div>
      )}
      <AddForm
        entityName={entityName}
        setEntityName={setEntityName}
        documentName={documentName}
        setDocumentName={setDocumentName}
        locationFilter={location}
        setLocationFilter={setLocation}
        yearFilter={year}
        setYearFilter={setYear}
        sectorFilter={sector}
        setSectorFilter={setSector}
        regionFilter={region}
        setRegionFilter={setRegion}
        ethicalValuesFilter={ethicalValuesFilter}
        setEthicalValuesFilter={setEthicalValuesFilter}
        locations={locations}
        years={years}
        sectors={sectors}
        regions={regions}
        ethicalValues={ethicalValues}
      />
      <input
        type="text"
        placeholder="Add Link (optional)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        className="search-input"
      />
      <button onClick={handleAddNewRow} className="add-button">הוסף נתונים</button>
    </div>
  );
}

export default PartB;
