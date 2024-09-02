const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path'); // יש לוודא שייבוא path נכון

const { getExcelData, updateExcelData, uploadPdf } = require('./excelController');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

// הגדרת שירות קבצים סטטיים לתיקייה AllCodes
app.use('/AllCodes', express.static(path.join(__dirname, 'public', 'AllCodes')));

const PORT = process.env.PORT || 5000;

app.get('/api/excel-data', getExcelData);
app.post('/api/update-excel', updateExcelData);
app.post('/api/upload-pdf', uploadPdf);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
