const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
const dest = path.join(__dirname, 'dummy_resume.pdf');

console.log('Downloading test PDF...');
const file = fs.createWriteStream(dest);

https.get(url, (response) => {
  response.pipe(file);
  file.on('finish', () => {
    file.close(() => {
      console.log('Download complete: dummy_resume.pdf');
      process.exit(0);
    });
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error('Error downloading:', err.message);
  process.exit(1);
});
