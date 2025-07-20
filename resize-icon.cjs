const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Path to the source image
const sourcePath = path.join(__dirname, 'public', 'images', 'app-icon.png');
// Path to the destination image
const destPath = path.join(__dirname, 'public', 'images', 'app-icon-512.png');

// Resize the image to 512x512
sharp(sourcePath)
  .resize(512, 512)
  .toFile(destPath)
  .then(() => {
    console.log('Successfully created app-icon-512.png');
  })
  .catch(err => {
    console.error('Error creating app-icon-512.png:', err);
  }); 