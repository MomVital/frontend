// Mock user data
export const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@example.com',
  age: 28,
  pregnancyWeek: 24,
  dueDate: '2023-12-15',
  profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
};

// Mock health data
export const mockHealthData = {
  heartRate: {
    current: 82,
    min: 65,
    max: 95,
    average: 78,
    history: [
      { timestamp: '2023-08-01T08:00:00Z', value: 72 },
      { timestamp: '2023-08-01T12:00:00Z', value: 78 },
      { timestamp: '2023-08-01T16:00:00Z', value: 85 },
      { timestamp: '2023-08-01T20:00:00Z', value: 76 },
      { timestamp: '2023-08-02T08:00:00Z', value: 70 },
      { timestamp: '2023-08-02T12:00:00Z', value: 82 },
      { timestamp: '2023-08-02T16:00:00Z', value: 88 },
      { timestamp: '2023-08-02T20:00:00Z', value: 74 },
    ],
  },
  hrv: {
    current: 45,
    min: 30,
    max: 65,
    average: 48,
    history: [
      { timestamp: '2023-08-01T08:00:00Z', value: 42 },
      { timestamp: '2023-08-01T12:00:00Z', value: 48 },
      { timestamp: '2023-08-01T16:00:00Z', value: 39 },
      { timestamp: '2023-08-01T20:00:00Z', value: 52 },
      { timestamp: '2023-08-02T08:00:00Z', value: 45 },
      { timestamp: '2023-08-02T12:00:00Z', value: 38 },
      { timestamp: '2023-08-02T16:00:00Z', value: 44 },
      { timestamp: '2023-08-02T20:00:00Z', value: 50 },
    ],
  },
  stress: {
    current: 'Medium',
    level: 65,
    history: [
      { timestamp: '2023-08-01T08:00:00Z', value: 45 },
      { timestamp: '2023-08-01T12:00:00Z', value: 60 },
      { timestamp: '2023-08-01T16:00:00Z', value: 75 },
      { timestamp: '2023-08-01T20:00:00Z', value: 50 },
      { timestamp: '2023-08-02T08:00:00Z', value: 40 },
      { timestamp: '2023-08-02T12:00:00Z', value: 65 },
      { timestamp: '2023-08-02T16:00:00Z', value: 70 },
      { timestamp: '2023-08-02T20:00:00Z', value: 55 },
    ],
  },
  emotion: {
    current: 'Calm',
    history: [
      { timestamp: '2023-08-01T08:00:00Z', value: 'Happy' },
      { timestamp: '2023-08-01T12:00:00Z', value: 'Calm' },
      { timestamp: '2023-08-01T16:00:00Z', value: 'Anxious' },
      { timestamp: '2023-08-01T20:00:00Z', value: 'Tired' },
      { timestamp: '2023-08-02T08:00:00Z', value: 'Energetic' },
      { timestamp: '2023-08-02T12:00:00Z', value: 'Calm' },
      { timestamp: '2023-08-02T16:00:00Z', value: 'Stressed' },
      { timestamp: '2023-08-02T20:00:00Z', value: 'Relaxed' },
    ],
  },
  sleep: {
    lastNight: {
      duration: 7.5,
      quality: 'Good',
      deepSleep: 2.3,
      lightSleep: 4.2,
      remSleep: 1.0,
    },
    average: {
      duration: 7.2,
      quality: 'Good',
      deepSleep: 2.1,
      lightSleep: 4.0,
      remSleep: 1.1,
    },
  },
};

// Mock AI suggestions
export const mockAiSuggestions = [
  {
    id: '1',
    category: 'Stress Management',
    title: 'Reduce Stress Levels',
    description: 'Your stress levels have been elevated over the past 48 hours. Consider practicing deep breathing exercises for 10 minutes in the morning and evening.',
    importance: 'High',
    timestamp: '2023-08-02T14:30:00Z',
  },
  {
    id: '2',
    category: 'Physical Activity',
    title: 'Gentle Exercise Recommendation',
    description: 'Based on your heart rate variability, a gentle 20-minute walk in the morning would be beneficial for both you and your baby.',
    importance: 'Medium',
    timestamp: '2023-08-02T10:15:00Z',
  },
  {
    id: '3',
    category: 'Nutrition',
    title: 'Hydration Reminder',
    description: 'Your recent data suggests you may be slightly dehydrated. Try to increase your water intake to at least 8 glasses per day.',
    importance: 'Medium',
    timestamp: '2023-08-01T16:45:00Z',
  },
  {
    id: '4',
    category: 'Sleep',
    title: 'Sleep Position Adjustment',
    description: 'Your sleep data indicates you might benefit from sleeping on your left side, which can improve blood flow to your baby.',
    importance: 'Low',
    timestamp: '2023-08-01T08:20:00Z',
  },
];

// Mock health insights
export const mockHealthInsights = [
  {
    id: '1',
    title: 'Heart Rate Analysis',
    description: 'Your heart rate has been within normal range for pregnant women in their second trimester. The slight elevation in the afternoons is normal and corresponds with your activity levels.',
    data: 'heartRate',
    timestamp: '2023-08-02T15:00:00Z',
  },
  {
    id: '2',
    title: 'Stress Pattern Detected',
    description: 'We\'ve noticed a pattern of increased stress levels in the mid-afternoon. This could be related to work activities or fatigue. Consider taking short breaks during this time.',
    data: 'stress',
    timestamp: '2023-08-02T11:30:00Z',
  },
  {
    id: '3',
    title: 'Sleep Quality Improvement',
    description: 'Your sleep quality has improved by 15% over the last week. Maintaining your current bedtime routine appears to be beneficial.',
    data: 'sleep',
    timestamp: '2023-08-01T09:45:00Z',
  },
  {
    id: '4',
    title: 'Emotional Well-being',
    description: 'Your emotional state has been predominantly positive, with occasional periods of anxiety. This is common during pregnancy, but do reach out to your healthcare provider if anxiety persists.',
    data: 'emotion',
    timestamp: '2023-08-01T14:15:00Z',
  },
];

// Mock pregnancy milestones
export const mockPregnancyMilestones = [
  {
    week: 24,
    title: 'Baby is the size of a corn',
    description: 'Your baby is about 30cm long and weighs around 600 grams. Their face is fully formed, complete with eyelashes, eyebrows, and hair.',
    tips: 'Stay hydrated and continue with gentle exercise like prenatal yoga or swimming.',
  },
  {
    week: 25,
    title: 'Baby is the size of a rutabaga',
    description: 'Your baby\'s hands are now fully developed, and they\'re spending more time awake practicing breathing movements.',
    tips: 'Start planning your maternity leave and consider taking a childbirth education class.',
  },
  {
    week: 26,
    title: 'Baby is the size of a scallion',
    description: 'Your baby\'s eyes will open soon, and they can respond to external sounds and your voice.',
    tips: 'Begin doing pelvic floor exercises regularly to prepare for delivery.',
  },
  {
    week: 27,
    title: 'Baby is the size of a cauliflower',
    description: 'Your baby is gaining weight rapidly and can now hiccup, which you might feel as rhythmic movements.',
    tips: 'Start thinking about your birth plan and discuss it with your healthcare provider.',
  },
]; 