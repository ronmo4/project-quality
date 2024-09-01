import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/PartA';
import PartB from './components/PartB';
import * as XLSX from 'xlsx';

function App() {
  const [data, setData] = useState([]); // אחסון כל הנתונים כאן
  const [columns, setColumns] = useState([]); // אחסון כותרות העמודות

  useEffect(() => {
    // קריאה ל-API לטעינת הנתונים מהשרת
    const fetchExcelData = async () => {
      try {
        const response = await fetch('https://ai-ethics-server.onrender.com/api/excel-data'); // קריאת GET לשרת
        const result = await response.json();
        const jsonData = result.data;

        setColumns(jsonData[0]); // הכותרות
        setData(jsonData.slice(1)); // הנתונים

      } catch (error) {
        console.error('Error loading excel file:', error);
      }
    };

    fetchExcelData();
  }, []);

  const uniqueLocations = [...new Set(data.map(row => row[5]).filter(location => location))];
  const uniqueSectors = [...new Set(data.map(row => row[3]).filter(sector => sector))];
  const uniqueRegions = [...new Set(data.map(row => row[6]).filter(region => region))];
  const ethicalColumns = columns.slice(7);

  const handleAddRow = async (newRow) => {
    const lastId = data.length > 1 ? parseInt(data[data.length - 1][0]) : 0; 
    newRow[0] = lastId + 1; 
    const updatedData = [...data, newRow];
    setData(updatedData);

    try {
      const response = await fetch('https://ai-ethics-server.onrender.com/api/update-excel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [newRow] })
      });

      if (!response.ok) {
        throw new Error('Failed to update Excel file');
      }

      console.log('Excel file updated successfully on server.');
    } catch (error) {
      console.error('Error updating Excel data:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>AI ברוכים הבאים לאתר קודים אתיים ב</h1>
          <div className="button-container">
            <Link to="/PartA">
              <button className="main-button">חיפוש בקובץ</button>
            </Link>
            <Link to="/PartB">
              <button className="main-button">הוספת נתונים</button>
            </Link>
          </div>
        </header>
        <Routes>
          <Route path="/PartA" element={<HomeScreen data={data} columns={columns} />} />
          <Route path="/PartB" element={
            <PartB 
              onAddRow={handleAddRow} 
              locations={uniqueLocations}
              years={[2017, 2018, 2019, 2020, 2021]}
              sectors={uniqueSectors}
              regions={uniqueRegions}
              ethicalValues={ethicalColumns}
              columns={columns}
            />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
