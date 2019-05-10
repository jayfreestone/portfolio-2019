const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');

const directoryPath = path.join(__dirname, '../src/img');
const outputPath = path.join(__dirname, '../_site/dist/img');

function genNewFileName(originalName, width, height) {
  return originalName.replace(/(.+)(?=\.)(.+$)/, `$1-${width}-${height}$2`);
}

const sizes = require(path.join(__dirname, '../package.json')).config.image_sizes;

function parseFiles(files) {
  files.forEach((file) => {
    Object.keys(sizes).forEach((size) => {
      const [width, height] = sizes[size];
      sharp(`${directoryPath}/${file}`)
        .resize(width, height)
        .toFile(`${outputPath}/${genNewFileName(file, width, height)}`);
    });
  });
}

promisify(fs.readdir)(directoryPath)
 .then(parseFiles);