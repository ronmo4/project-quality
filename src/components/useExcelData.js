import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

export const useExcelData = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const loadExcelData = async () => {
      try {
        const response = await fetch('https://ai-ethics-client.onrender.com/Codes.xlsx'); // URL מעודכן
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        setColumns(jsonData[0]);
        setData(jsonData.slice(1));
      } catch (error) {
        console.error('Error loading excel file:', error);
      }
    };

    loadExcelData();
  }, []);

  return { data, columns, setData };
};
