const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const { v4: uuidv4 } = require('uuid'); // ייבוא ספריית UUID ליצירת שמות קבצים ייחודיים

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
    const newData = req.body.data; // הנתונים החדשים שהתקבלו מהבקשה

    if (!fs.existsSync(excelFilePath)) {
      return res.status(404).send('Excel file not found');
    }

    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // מציאת ה-ID האחרון והוספת ID חדש לשורה
    const lastId = jsonData.length > 1 ? parseInt(jsonData[jsonData.length - 1][0]) : 0;
    newData[0][0] = lastId + 1; // הוספת ה-ID לשורה החדשה

    jsonData = [...jsonData, newData[0]]; // הוספת השורה החדשה למידע הקיים

    const updatedWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
    workbook.Sheets[sheetName] = updatedWorksheet;
    XLSX.writeFile(workbook, excelFilePath);

    res.json(newData[0]); // החזרת השורה החדשה עם ה-ID המעודכן
  } catch (error) {
    console.error('Error updating Excel file:', error);
    res.status(500).send('Error updating Excel file');
  }
};

exports.uploadPdf = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const pdfFile = req.files.file;
  const id = req.body.id; // נקבל את ה-ID מהבקשה

  // יצירת שם ייחודי לקובץ PDF
  const uniqueFileName = `${id}-${uuidv4()}.pdf`;

  // נתיב הקובץ לשמירה בתיקייה הציבורית
  const uploadPath = path.join(pdfDirectory, uniqueFileName);

  // בדיקה אם התיקייה קיימת, אם לא - יצירתה
  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  // שמירת קובץ ה-PDF
  pdfFile.mv(uploadPath, (err) => {
    if (err) {
      console.error('Error uploading PDF file:', err);
      return res.status(500).send('Error uploading PDF file');
    }

    res.send('PDF file uploaded successfully');
  });
};

