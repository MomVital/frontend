# MomVital - AI-Powered Pregnancy Health Companion

MomVital is a mobile application designed to help pregnant women monitor their health and receive AI-powered recommendations based on their health data.

## NativeWind v4 Setup

This project uses NativeWind v4 for styling with Tailwind CSS. Here's how it's set up:

1. **Dependencies**:
   - `nativewind`: ^4.0.1
   - `tailwindcss`: ^3.4.17
   - `react-native-reanimated`: ~3.16.2
   - `react-native-safe-area-context`: 4.8.2

2. **Configuration Files**:
   - `global.css`: Contains Tailwind directives
   - `tailwind.config.js`: Includes the NativeWind preset and custom colors
   - `babel.config.js`: Includes the NativeWind babel preset
   - `metro.config.js`: Configured with NativeWind's Metro integration
   - `app.json`: Configured to use Metro bundler for web

3. **Usage**:
   Simply use the `className` prop in your components:
   ```jsx
   <View className="bg-primary-500 p-4 rounded-lg">
     <Text className="text-white font-bold">Hello World</Text>
   </View>
   ```

## Fixing Common Issues

### If you encounter styling issues with NativeWind:

1. **Complete reset of your project**:
   ```bash
   npm run reset
   ```
   This will remove node_modules, clear the Expo cache, clean the npm cache, and reinstall everything.

2. **Make sure your tailwind.config.js includes the NativeWind preset**:
   ```javascript
   module.exports = {
     content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
     presets: [require("nativewind/preset")],
     // ...rest of your config
   };
   ```

3. **Ensure your metro.config.js is properly configured**:
   ```javascript
   const { getDefaultConfig } = require('expo/metro-config');
   const { withNativeWind } = require('nativewind/metro');
   
   const config = getDefaultConfig(__dirname);
   
   module.exports = withNativeWind(config, { input: './global.css' });
   ```

4. **Check that your babel.config.js is correctly set up**:
   ```javascript
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
     };
   };
   ```

5. **Verify that you have imported the global.css file in App.tsx**:
   ```typescript
   import "./global.css";
   ```

### For TypeScript and NativeWind Issues:

If you encounter TypeScript errors related to missing type declarations or `className` property not being recognized:

1. **Make sure you have the proper type declarations**:
   ```typescript
   // In a .d.ts file
   /// <reference types="nativewind/types" />
   ```

2. **Restart your development server with cache cleared**:
   ```bash
   npx expo start -c
   ```

## Project Structure

```
frontend/
├── assets/              # App images and icons
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context for state management
│   ├── screens/         # App screens
│   ├── styles/          # CSS styles
│   ├── types/           # TypeScript type declarations
│   └── utils/           # Helper functions and utilities
├── App.tsx              # Main app component with navigation
├── babel.config.js      # Babel configuration
├── global.css           # Tailwind CSS directives
├── index.ts             # Entry point
├── metro.config.js      # Metro bundler configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Features

- **Health Monitoring**: Track heart rate, HRV, stress levels, emotions, and more
- **AI Recommendations**: Receive personalized health advice based on your data
- **Pregnancy Tracking**: Monitor your pregnancy progress and milestones
- **User-Friendly Interface**: Beautiful and intuitive UI with a pink-themed design
- **Secure Authentication**: Protect your health data with secure login

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Run on a device or simulator:
   - Press `i` to run on iOS Simulator
   - Press `a` to run on Android Emulator
   - Scan the QR code with the Expo Go app on your physical device

## Backend Integration

This frontend is designed to connect to a backend API that can analyze health data. For development purposes, it uses mock data. To connect to a real backend:

1. Update the API endpoints in the relevant files
2. Implement proper error handling for API calls
3. Update the authentication flow to work with your backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Expo team for the amazing React Native development experience
- NativeWind for bringing Tailwind CSS to React Native
- All the open-source libraries used in this project
