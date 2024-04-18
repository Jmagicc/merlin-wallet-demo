import XLSX from 'xlsx';
import sqlite3 from 'sqlite3';
import fs from 'fs';

const db = new sqlite3.Database(':memory:');

// Read Excel file
const workbook = XLSX.readFile('NFTWL-Gary.xlsx');
const sheetName = '4.17';
const sheet = workbook.Sheets[sheetName];
const range = XLSX.utils.decode_range(sheet['!ref']);

// Array to store addresses
let addressesArray = [];

// Write Excel data to a SQLite database
db.serialize(() => {
    db.run('CREATE TABLE addresses (address TEXT)');
    for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        const cellAddress = 'A' + rowNum;
        const cell = sheet[cellAddress];
        if (cell && cell.v) {
            const address = cell.v;
            db.run('INSERT INTO addresses (address) VALUES (?)', address);
        }
    }
});

// Create an HTML page and count addresses whose occurrences exceed 1
db.all('SELECT address, COUNT(address) AS count FROM addresses GROUP BY address HAVING COUNT(address) > 1', (err, rows) => {
    const htmlContent = `
        <html>
        <head>
            <title>NFT Addresses</title>
        </head>
        <body>
            <h1>NFT Addresses with Count > 1</h1>
            <table>
                <tr>
                    <th>Address</th>
                    <th>Count</th>
                </tr>
                ${rows.map(row => `<tr><td>${row.address}</td><td>${row.count}</td></tr>`).join('')}
            </table>
        </body>
        </html>
    `;

    // Write HTML content to file
    fs.writeFileSync('NFT-Addresses-CountGreaterThan1.html', htmlContent);
});


db.serialize(() => {
    db.run('CREATE TABLE addresses (address TEXT)');
    for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
        const cellAddress = 'A' + rowNum;
        const cell = sheet[cellAddress];
        if (cell && cell.v) {
            const address = cell.v;
            addressesArray.push(address);
            db.run('INSERT INTO addresses (address) VALUES (?)', address);
        }
    }
});

db.close();


fs.writeFileSync('NFT-Addresses.json', JSON.stringify(addressesArray));

const addressesFromFile = JSON.parse(fs.readFileSync('NFT-Addresses.json', 'utf8'));

console.log(addressesFromFile);