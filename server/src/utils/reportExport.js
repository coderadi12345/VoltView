import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const buildCsv = (rows) => {
  const headers = Object.keys(rows[0] || { message: 'No data' });
  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((header) => JSON.stringify(row[header] ?? '')).join(','));
  });
  return lines.join('\n');
};

export const buildExcel = async (rows) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('VoltView Report');
  const headers = Object.keys(rows[0] || { message: 'No data' });
  worksheet.columns = headers.map((header) => ({ header, key: header, width: 24 }));
  rows.forEach((row) => worksheet.addRow(row));
  return workbook.xlsx.writeBuffer();
};

export const buildPdf = (title, rows) =>
  new Promise((resolve) => {
    const doc = new PDFDocument({ margin: 48 });
    const buffers = [];

    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.fontSize(20).text(title, { underline: true });
    doc.moveDown();

    rows.slice(0, 100).forEach((row, index) => {
      doc.fontSize(10).text(`${index + 1}. ${JSON.stringify(row)}`);
      doc.moveDown(0.4);
    });

    doc.end();
  });
