const express = require('express');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const bodyParser = require('body-parser');
const cors = require('cors'); // ייבוא החבילה CORS

const app = express();
app.use(cors()); // שימוש ב-CORS
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// נתיב לקובץ Excel
const excelFilePath = path.join(__dirname, 'public', 'Codes.xlsx');

// קריאת נתונים מקובץ ה-Excel
app.get('/api/excel-data', (req, res) => {
  try {
    if (!fs.existsSync(excelFilePath)) {
      return res.status(404).send('Excel file not found');
    }

    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    res.json({ data });
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).send('Error reading Excel file');
  }
});

// עדכון קובץ ה-Excel עם נתונים חדשים
app.post('/api/update-excel', (req, res) => {
    try {
      const newData = req.body.data; 
  
      if (!fs.existsSync(excelFilePath)) {
        return res.status(404).send('Excel file not found');
      }
  
      const workbook = XLSX.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      
      const lastId = jsonData.length > 1 ? parseInt(jsonData[jsonData.length - 1][0]) : 0;
      newData[0][0] = lastId + 1; // לעדכן את ה-ID של השורה החדשה
  
      jsonData = [...jsonData, ...newData];
  
      const updatedWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
      workbook.Sheets[sheetName] = updatedWorksheet;
      XLSX.writeFile(workbook, excelFilePath);
  
      res.json(newData[0]); // החזרת השורה החדשה עם ה-ID המעודכן
    } catch (error) {
      console.error('Error updating Excel file:', error);
      res.status(500).send('Error updating Excel file');
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
