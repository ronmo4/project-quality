const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(fileUpload());

// בדוק אם התיקייה public קיימת, אם לא - צור אותה
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir);
}

// הגדרת תיקיית public כסטטית
app.use(express.static(publicDir));

app.post('/save-excel', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const excelFile = req.files.file;
  const savePath = path.join(publicDir, 'Codes.xlsx');

  excelFile.mv(savePath, (err) => {
    if (err) {
      console.error('Error saving Excel file:', err);
      return res.status(500).send(err);
    }

    console.log('Excel file saved successfully at', savePath);
    res.send('Excel file saved successfully!');
  });
});

app.get('/get-excel', (req, res) => {
  const filePath = path.join(publicDir, 'Codes.xlsx');
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading Excel file:', err);
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
