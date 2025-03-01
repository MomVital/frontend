const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running iOS fix script...');

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

// Ensure the ios directory exists
const iosDir = path.join(__dirname, 'ios');
ensureDirectoryExists(iosDir);

// Try to clean the React Native cache
try {
  console.log('Cleaning React Native cache...');
  execSync('npx react-native-clean-project --keep-node-modules', { stdio: 'inherit' });
} catch (error) {
  console.log('Could not clean React Native cache. This is not critical.');
}

// Try to reinstall pods if on macOS
try {
  if (process.platform === 'darwin') {
    console.log('Reinstalling CocoaPods dependencies...');
    if (directoryExists(path.join(__dirname, 'ios', 'Pods'))) {
      execSync('cd ios && pod deintegrate && pod install', { stdio: 'inherit' });
    } else {
      execSync('cd ios && pod install', { stdio: 'inherit' });
    }
  }
} catch (error) {
  console.log('Could not reinstall CocoaPods. This is not critical for Expo projects.');
}

console.log('iOS fix script completed. Please run "npm run reset" and then "npm run ios" to test.'); 