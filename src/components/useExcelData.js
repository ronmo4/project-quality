import { useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';

export const useExcelData = (url) => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const loadExcelData = useCallback(async () => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      setColumns(jsonData[0]);
      setData(jsonData.slice(1));
    } catch (error) {
      console.error('Error loading excel file:', error);
    }
  }, [url]); // הוספנו את url לתלות של useCallback

  useEffect(() => {
    loadExcelData();
  }, [loadExcelData]);  // הוספנו את loadExcelData לתלות של useEffect

  return { data, columns, setData, loadExcelData };
};
