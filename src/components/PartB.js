import React, { useState, useEffect } from 'react';
import AddForm from './AddForm';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // ייבוא הפונקציות הנדרשות מ-firebase/storage
import { storage } from '../config/firebaseConfig';

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
  const [pdfFile, setPdfFile] = useState(null);
  const [disableUpload, setDisableUpload] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // מצב טעינה חדש

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

    setIsLoading(true); // התחלת טעינה

    let fileLink = '';
    if (pdfFile) {
      const storageRef = ref(storage, `pdfs/${pdfFile.name}`); // יצירת reference לשמירת הקובץ ב-storage
      try {
        await uploadBytes(storageRef, pdfFile); // העלאת הקובץ
        fileLink = await getDownloadURL(storageRef); // קבלת קישור השיתוף
      } catch (error) {
        console.error('Error uploading PDF to Firebase:', error);
        setIsLoading(false); // סיום טעינה במקרה של שגיאה
        return;
      }
    }
  
    const newRow = new Array(columns.length).fill('');
    newRow[1] = entityName;
    newRow[2] = documentName;
    newRow[3] = sector;
    newRow[4] = year;
    newRow[5] = location;
    newRow[6] = region;
    if (link) {
      newRow.push(link);
    } else if (fileLink) {
      newRow.push(fileLink); // הוספת קישור ל-PDF שהועלה ל-Firebase Storage
    }

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
    } finally {
      setIsLoading(false); // סיום טעינה
    }
  };

  const handlePdfChange = (e) => {
    setPdfFile(e.target.files[0]);
    setLink(''); // איפוס שדה הקישור אם נבחר קובץ PDF
    setDisableUpload(true); // חסימת שדה הקישור
  };

  const handleLinkChange = (e) => {
    setLink(e.target.value);
    setPdfFile(null); // איפוס שדה קובץ PDF אם הוזן קישור
    setDisableUpload(false); // פתיחת שדה PDF
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
    setPdfFile(null);
    setDisableUpload(false);
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
        onChange={handleLinkChange}
        className="search-input"
        disabled={disableUpload}
      />
      <input
        type="file"
        accept=".pdf"
        onChange={handlePdfChange}
        className="file-input"
        disabled={disableUpload}
      />
      <button onClick={handleAddNewRow} className="add-button" disabled={isLoading}>
        הוסף נתונים
      </button>

      {/* חלונית מודאלית לטעינה */}
      {isLoading && (
        <div className="loading-modal">
          <div className="loading-spinner"></div>
          <p>טוען...</p>
        </div>
      )}
    </div>
  );
}

export default PartB;
