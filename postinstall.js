const fs = require('fs');
const path = require('path');

// This script helps fix common issues with project setup
console.log('Running post-install script...');

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

// Ensure the types directory exists
ensureDirectoryExists(path.join(__dirname, 'src', 'types'));

// Ensure the assets directory exists
const assetsDir = path.join(__dirname, 'assets');
ensureDirectoryExists(assetsDir);

// Create placeholder images if they don't exist
const createPlaceholderImage = (filename) => {
  const filePath = path.join(assetsDir, filename);
  if (!fs.existsSync(filePath)) {
    console.log(`Creating placeholder image: ${filename}`);
    // Create a simple SVG as a placeholder
    const svgContent = `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
      <text x="50%" y="50%" font-family="Arial" font-size="24" fill="#333" text-anchor="middle">${filename}</text>
    </svg>`;
    fs.writeFileSync(filePath, svgContent);
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

// Create a simple CSS file if it doesn't exist
const cssFilePath = path.join(__dirname, 'global.css');
if (!fs.existsSync(cssFilePath)) {
  console.log('Creating global.css file...');
  fs.writeFileSync(
    cssFilePath,
    '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
  );
}

console.log('Post-install script completed successfully.'); 