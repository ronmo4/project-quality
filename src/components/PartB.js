import React, { useState } from 'react';
import AddForm from './AddForm';

function PartB({ onAddRow, locations, years, sectors, regions, ethicalValues, columns }) {
  const [entityName, setEntityName] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [year, setYear] = useState('');
  const [location, setLocation] = useState('');
  const [region, setRegion] = useState('');
  const [sector, setSector] = useState('');
  const [ethicalValuesFilter, setEthicalValuesFilter] = useState([]);
  const [link, setLink] = useState(''); // שדה חדש להוספת קישור
  const [showAlert, setShowAlert] = useState(false);

  const handleAddNewRow = () => {
    if (!entityName || !documentName || !year || !location || !region || !sector || ethicalValuesFilter.length === 0) {
      setShowAlert(true);
      return;
    }

    // יצירת מערך חדש עם כל העמודות הנדרשות
    const newRow = new Array(columns.length).fill('');
    newRow[1] = entityName;
    newRow[2] = documentName;
    newRow[3] = sector;
    newRow[4] = year;
    newRow[5] = location;
    newRow[6] = region;
    if (link) newRow.push(link); // הוספת הקישור אם הוזן

    ethicalValuesFilter.forEach(value => {
      const columnIndex = columns.indexOf(value);
      if (columnIndex > -1) {
        newRow[columnIndex] = 'X';
      }
    });

    onAddRow(newRow);
    resetForm();
  };

  const resetForm = () => {
    setEntityName('');
    setDocumentName('');
    setYear('');
    setLocation('');
    setRegion('');
    setSector('');
    setEthicalValuesFilter([]);
    setLink(''); // איפוס שדה הקישור
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
