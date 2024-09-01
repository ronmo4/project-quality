import React from 'react'; 
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import HomeScreen from './components/PartA';
import PartB from './components/PartB';
import { useExcelData } from './components/useExcelData'; 
import * as XLSX from 'xlsx';

function App() {
  const { data, columns, setData } = useExcelData('https://ai-ethics-client.onrender.com/Codes.xlsx');  // URL מרוחק

  const uniqueLocations = [...new Set(data.map(row => row[5]).filter(location => location))];
  const uniqueSectors = [...new Set(data.map(row => row[3]).filter(sector => sector))];
  const uniqueRegions = [...new Set(data.map(row => row[6]).filter(region => region))];
  const ethicalColumns = columns.slice(7);

  const handleAddRow = async (newRow) => {
    const lastId = data.length > 1 ? parseInt(data[data.length - 1][0]) : 0; 
    newRow[0] = lastId + 1; 
    const updatedData = [...data, newRow];
    
    // עדכון המידע המקומי כדי שהרשימה תתעדכן מיידית
    setData(updatedData);

    const workbook = XLSX.utils.book_new();
    const worksheetData = [columns, ...updatedData];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    worksheet['!cols'] = [];
    worksheet['!cols'][4] = { rtl: true };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    // שליחת הקובץ המעודכן לשרת
    const formData = new FormData();
    formData.append('file', blob, 'Codes.xlsx');

    try {
      const response = await fetch('https://ai-ethics-server.onrender.com/save-excel', { // שינוי URL לשרת הנכון
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        console.log('Excel file saved successfully on the server!');
        // אין צורך לקרוא ל-loadExcelData, פשוט נשתמש בנתונים המעודכנים
      } else {
        console.error('Failed to save Excel file on the server.');
      }
    } catch (error) {
      console.error('Error saving Excel file:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>ברוכים הבאים לאתר קודים אתיים ב-AI</h1>
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
              data={data}
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
