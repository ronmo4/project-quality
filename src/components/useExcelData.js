// useExcelData.js
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export const useExcelData = (filePath) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        const response = await fetch(filePath);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setColumns(jsonData[0]); // הכותרות
        setData(jsonData.slice(1)); // הנתונים

      } catch (error) {
        console.error('Error loading excel file:', error);
      }
    };

    loadExcelData();
  }, [filePath]);

  return { data, columns, setData };
};
