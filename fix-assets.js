const fs = require('fs');
const path = require('path');

// This script helps fix asset path issues in the project
console.log('Running fix-assets script...');

// Function to check if a directory exists
function directoryExists(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch (err) {
    return false;
  }
}

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!directoryExists(dirPath)) {
    console.log(`Creating directory: ${dirPath}`);
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, 'assets');
ensureDirectoryExists(assetsDir);

// Create placeholder images if they don't exist
const createPlaceholderImage = (filename) => {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder image: ${filename}`);
    // Create a simple PNG-like buffer as a placeholder
    // This is a minimal valid PNG file
    const pngHeader = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82
    ]);
    fs.writeFileSync(filePath, pngHeader);
  }
};

// Create placeholder images for onboarding
createPlaceholderImage('onboarding-1.png');
createPlaceholderImage('onboarding-2.png');
createPlaceholderImage('onboarding-3.png');
createPlaceholderImage('icon.png');
createPlaceholderImage('splash.png');
createPlaceholderImage('adaptive-icon.png');
createPlaceholderImage('favicon.png');

console.log('Fix-assets script completed successfully.'); 