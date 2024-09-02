const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid');

// נתיב לקובץ Excel
const excelFilePath = path.join(__dirname, 'public', 'Codes.xlsx');

// נתיב מלא לתיקיית שמירת קבצי ה-PDF
const pdfDirectory = path.join(__dirname, 'public', 'AllCodes');

// פונקציה לקריאת נתונים מקובץ Excel
exports.getExcelData = (req, res) => {
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
};

// פונקציה לעדכון קובץ Excel עם נתונים חדשים
exports.updateExcelData = (req, res) => {
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
    newData[0][0] = lastId + 1;

    jsonData = [...jsonData, newData[0]];

    const updatedWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
    workbook.Sheets[sheetName] = updatedWorksheet;
    XLSX.writeFile(workbook, excelFilePath);

    res.json(newData[0]);
  } catch (error) {
    console.error('Error updating Excel file:', error);
    res.status(500).send('Error updating Excel file');
  }
};

// פונקציה להעלאת קובץ PDF ולשמור את כתובת ה-URL ב-Excel
exports.uploadPdf = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const pdfFile = req.files.file;
  const id = req.body.id;

  const uniqueFileName = `${id}-${uuidv4()}.pdf`;
  const uploadPath = path.join(pdfDirectory, uniqueFileName);

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  pdfFile.mv(uploadPath, async (err) => {
    if (err) {
      console.error('Error uploading PDF file:', err);
      return res.status(500).send('Error uploading PDF file');
    }

    // יצירת URL ל-PDF שנשמר בשרת הלקוח
    const fileUrl = `https://ai-ethics-client.onrender.com/AllCodes/${uniqueFileName}`;

    try {
      // קריאת קובץ ה-Excel
      const workbook = XLSX.readFile(excelFilePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // חיפוש השורה המתאימה לפי ה-ID ועדכון ה-URL
      const rowToUpdate = jsonData.find(row => row[0] == id);
      if (rowToUpdate) {
        rowToUpdate.push(fileUrl);
      }

      const updatedWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
      workbook.Sheets[sheetName] = updatedWorksheet;
      XLSX.writeFile(workbook, excelFilePath);

      res.json({ message: 'PDF file uploaded successfully', fileUrl });
    } catch (error) {
      console.error('Error updating Excel file with PDF URL:', error);
      res.status(500).send('Error updating Excel file with PDF URL');
    }
  });
};
