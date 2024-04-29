import fs from 'fs';

const jsonString = fs.readFileSync('./NFT-Addresses.json', 'utf8');
try {
    const whiteList = JSON.parse(jsonString);

    if (Array.isArray(whiteList)) {
        console.log(`Number of addresses: ${whiteList.length}`);
    } else {
        console.error('The JSON file is not in the correct format, the root element should be an array');
    }
} catch (err) {
    console.error('An error occurred while parsing the JSON file:', err);
}
