import XLSX from 'xlsx';
import sqlite3 from 'sqlite3';
import fs from 'fs';

const db = new sqlite3.Database(':memory:');

// 读取 Excel 文件
const workbook = XLSX.readFile('NFTWL-Gary.xlsx');
const sheetName = '4.17';
const sheet = workbook.Sheets[sheetName];
const range = XLSX.utils.decode_range(sheet['!ref']);

// 将 Excel 数据写入 SQLite 数据库
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

// 创建 HTML 页面并统计地址出现次数超过1的地址
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

    // 将 HTML 内容写入文件
    fs.writeFileSync('NFT-Addresses-CountGreaterThan1.html', htmlContent);
});

db.close();