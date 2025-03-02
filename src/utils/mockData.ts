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
    week: 4,
    title: "Embryo Formation",
    description: "Your baby is now called an embryo and is about the size of a poppy seed. The neural tube, which will become the brain and spinal cord, is developing.",
    tips: "Start taking prenatal vitamins if you haven't already. Folic acid is especially important at this stage."
  },
  {
    week: 6,
    title: "Heartbeat Begins",
    description: "Your baby's heart begins to beat around 6 weeks. The embryo is about the size of a lentil (0.25 inches).",
    tips: "Schedule your first prenatal appointment if you haven't already."
  },
  {
    week: 8,
    title: "All Essential Organs Form",
    description: "All essential organs have begun to develop. Your baby is now about the size of a kidney bean (0.5 inches).",
    tips: "Maintain a balanced diet rich in fruits, vegetables, and proteins to support your baby's rapid development."
  },
  {
    week: 10,
    title: "Embryo to Fetus",
    description: "Your baby is now called a fetus. Tiny fingers and toes are forming, and the neural tube has closed.",
    tips: "Stay hydrated and continue with gentle exercise if your doctor approves."
  },
  {
    week: 12,
    title: "First Trimester Complete",
    description: "Your baby is about 2.5 inches long and weighs about 0.5 ounces. External genitalia are developing.",
    tips: "The risk of miscarriage drops significantly after the first trimester. You may start feeling more energetic."
  },
  {
    week: 14,
    title: "Baby's Sex Becomes Visible",
    description: "Your baby's sex may be visible on an ultrasound. The fetus is about 3.5 inches long and can make facial expressions.",
    tips: "You may notice your energy returning as you enter the second trimester."
  },
  {
    week: 16,
    title: "Baby Can Hear You",
    description: "Your baby can hear your voice now. The fetus is about 4.5 inches long and weighs about 3.5 ounces.",
    tips: "Talk or sing to your baby - they can hear you now and will recognize your voice after birth."
  },
  {
    week: 18,
    title: "Baby Starts Moving",
    description: "You might start feeling your baby move (quickening). The fetus is about 5.5 inches long and weighs about 7 ounces.",
    tips: "Start doing pelvic floor exercises (Kegels) to strengthen muscles for delivery and recovery."
  },
  {
    week: 20,
    title: "Halfway Point",
    description: "You're halfway through your pregnancy! Your baby is about 6.5 inches long and weighs about 10 ounces.",
    tips: "This is typically when you'll have an anatomy scan ultrasound to check your baby's development."
  },
  {
    week: 22,
    title: "Baby's Senses Developing",
    description: "Your baby's sense of touch, taste, sight, hearing, and smell are developing. The fetus is about 11 inches long.",
    tips: "Start planning your maternity leave and discussing childcare options if needed."
  },
  {
    week: 24,
    title: "Viability Milestone",
    description: "Your baby has reached a significant milestone - if born now, they would have a chance of survival with intensive care.",
    tips: "Consider signing up for childbirth classes if you haven't already."
  },
  {
    week: 26,
    title: "Baby Opens Eyes",
    description: "Your baby's eyes open for the first time. The fetus is about 14 inches long and weighs about 1.7 pounds.",
    tips: "Start monitoring your baby's movement patterns. Contact your healthcare provider if you notice decreased movement."
  },
  {
    week: 28,
    title: "Brain Development Accelerates",
    description: "Your baby's brain is developing rapidly. The fetus is about 14.8 inches long and weighs about 2.2 pounds.",
    tips: "Rest when you can and sleep on your side to improve blood flow to your baby."
  },
  {
    week: 30,
    title: "Baby Gains Weight",
    description: "Your baby is gaining weight rapidly. The fetus is about 15.7 inches long and weighs about 3 pounds.",
    tips: "Start preparing your home for the baby's arrival. Consider creating a birth plan if you haven't already."
  },
  {
    week: 32,
    title: "Baby's Movements Change",
    description: "Your baby's movements may change as they have less room to move. The fetus is about 16.7 inches long and weighs about 4 pounds.",
    tips: "Pack your hospital bag and make sure your car seat is properly installed."
  },
  {
    week: 34,
    title: "Lungs Nearly Mature",
    description: "Your baby's lungs are nearly mature. The fetus is about 17.7 inches long and weighs about 5 pounds.",
    tips: "Finalize your birth plan and discuss it with your healthcare provider."
  },
  {
    week: 36,
    title: "Baby Drops Lower",
    description: "Your baby may drop lower into your pelvis (lightening). The fetus is about 18.7 inches long and weighs about 6 pounds.",
    tips: "Watch for signs of labor, including regular contractions, water breaking, or bloody show."
  },
  {
    week: 38,
    title: "Full Term",
    description: "Your baby is considered full term. The fetus is about 19.6 inches long and weighs about 7 pounds.",
    tips: "Rest as much as possible and stay hydrated. Labor could begin any day now."
  },
  {
    week: 40,
    title: "Due Date",
    description: "Your baby is ready to be born! The average newborn is about 20 inches long and weighs about 7.5 pounds.",
    tips: "Don't worry if you go past your due date. Many first-time mothers deliver after their due date."
  },
  {
    week: 42,
    title: "Post-Term Pregnancy",
    description: "Your pregnancy is now considered post-term. Your healthcare provider will monitor you and your baby closely.",
    tips: "Discuss induction options with your healthcare provider if you haven't delivered by now."
  }
]; 