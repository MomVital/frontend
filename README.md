# MomVital - Pregnancy Health Monitoring App

MomVital is a mobile application designed to help pregnant women monitor their health using advanced facial scanning technology. The app provides personalized health insights, AI-powered suggestions, and pregnancy milestone tracking.

## Features

- **Facial Health Scanning**: Scan your face to analyze heart rate, heart rate variability, stress levels, and emotional state.
- **Health Analysis**: View detailed analysis of your health metrics with personalized insights.
- **AI Suggestions**: Receive AI-powered health recommendations based on your scan results.
- **Pregnancy Milestone Tracking**: Track your pregnancy journey with weekly milestones and tips.
- **User Profile**: Manage your personal and pregnancy information.
- **Settings**: Customize app preferences and manage your account.

## Tech Stack

- **Frontend**: React Native with Expo
- **UI**: Styled Components
- **Navigation**: React Navigation
- **Icons**: Expo Vector Icons
- **Camera**: Expo Camera

## Project Structure

```
frontend/
├── src/
│   ├── assets/         # Images, fonts, and other static assets
│   ├── components/     # Reusable UI components
│   ├── hooks/          # Custom React hooks
│   ├── navigation/     # Navigation configuration and types
│   ├── screens/        # App screens
│   ├── theme/          # Theme configuration (colors, spacing, typography)
│   └── utils/          # Utility functions and mock data
├── App.tsx             # Main app component
└── package.json        # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/momvital.git
   cd momvital/frontend
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```
   npm start
   # or
   yarn start
   ```

4. Open the app on your device using the Expo Go app or run it on an emulator.

## Screens

- **Home**: Overview of your health status and pregnancy milestones
- **Scan**: Facial scanning interface for health analysis
- **Analysis**: Detailed health metrics and insights
- **AI Suggestions**: Personalized health recommendations
- **Profile**: User profile and pregnancy information
- **Settings**: App preferences and account management
- **Registration**: New user registration

## Future Enhancements

- Integration with wearable devices for continuous health monitoring
- Telemedicine features for connecting with healthcare providers
- Community features for connecting with other pregnant women
- Expanded health metrics and analysis
- Customizable health goals and tracking

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This app was developed as part of a hackathon project
- Special thanks to all contributors and mentors
