const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running gesture handler fix script...');

// Try to reinstall gesture handler
try {
  console.log('Reinstalling react-native-gesture-handler...');
  execSync('npm uninstall react-native-gesture-handler', { stdio: 'inherit' });
  execSync('expo install react-native-gesture-handler', { stdio: 'inherit' });
} catch (error) {
  console.log('Error reinstalling react-native-gesture-handler:', error.message);
}

// Update babel.config.js to include the gesture handler plugin
try {
  const babelConfigPath = path.join(__dirname, 'babel.config.js');
  if (fs.existsSync(babelConfigPath)) {
    let babelConfig = fs.readFileSync(babelConfigPath, 'utf8');
    
    // Check if the plugin is already included
    if (!babelConfig.includes('react-native-reanimated/plugin')) {
      console.log('Adding react-native-reanimated/plugin to babel.config.js');
      
      // Simple replacement to add the plugin
      babelConfig = babelConfig.replace(
        'plugins: [',
        'plugins: [\n      \'react-native-reanimated/plugin\','
      );
      
      fs.writeFileSync(babelConfigPath, babelConfig);
    }
  }
} catch (error) {
  console.log('Error updating babel.config.js:', error.message);
}

console.log('Gesture handler fix script completed. Please run "npm run reset" and then restart your app.'); 