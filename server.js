const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // ייבוא החבילה CORS
const excelController = require('./excelController'); // ייבוא הבקר

const app = express();
app.use(cors()); // שימוש ב-CORS
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

// מסלולים שמבצעים שימוש בפונקציות בבקר
app.get('/api/excel-data', excelController.getExcelData);
app.post('/api/update-excel', excelController.updateExcelData);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
