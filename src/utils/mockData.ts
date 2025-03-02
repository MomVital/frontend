// Mock user data
export const mockUser = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@gmail.com',
  age: 29,
  pregnancyWeek: 24,
  dueDate: '2025-07-15',
  profileImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80',
};

// Mock health data
export const mockHealthData = {
  heartRate: {
    current: 82,
    min: 65,
    max: 95,
    average: 78,
    history: [
      { timestamp: '2025-03-01T08:00:00Z', value: 72 },
      { timestamp: '2025-03-01T12:00:00Z', value: 78 },
      { timestamp: '2025-03-01T16:00:00Z', value: 85 },
      { timestamp: '2025-03-01T20:00:00Z', value: 76 },
      { timestamp: '2025-03-02T08:00:00Z', value: 70 },
      { timestamp: '2025-03-02T12:00:00Z', value: 82 },
      { timestamp: '2025-03-02T16:00:00Z', value: 88 },
      { timestamp: '2025-03-02T20:00:00Z', value: 74 },
    ],
  },
  hrv: {
    current: 45,
    min: 30,
    max: 65,
    average: 48,
    history: [
      { timestamp: '2025-03-01T08:00:00Z', value: 42 },
      { timestamp: '2025-03-01T12:00:00Z', value: 48 },
      { timestamp: '2025-03-01T16:00:00Z', value: 39 },
      { timestamp: '2025-03-01T20:00:00Z', value: 52 },
      { timestamp: '2025-03-02T08:00:00Z', value: 45 },
      { timestamp: '2025-03-02T12:00:00Z', value: 38 },
      { timestamp: '2025-03-02T16:00:00Z', value: 44 },
      { timestamp: '2025-03-02T20:00:00Z', value: 50 },
    ],
  },
  stress: {
    current: 'Med',
    level: 65,
    history: [
      { timestamp: '2025-03-01T08:00:00Z', value: 45 },
      { timestamp: '2025-03-01T12:00:00Z', value: 60 },
      { timestamp: '2025-03-01T16:00:00Z', value: 75 },
      { timestamp: '2025-03-01T20:00:00Z', value: 50 },
      { timestamp: '2025-03-02T08:00:00Z', value: 40 },
      { timestamp: '2025-03-02T12:00:00Z', value: 65 },
      { timestamp: '2025-03-02T16:00:00Z', value: 70 },
      { timestamp: '2025-03-02T20:00:00Z', value: 55 },
    ],
  },
  emotion: {
    current: 'Calm',
    history: [
      { timestamp: '2025-03-01T08:00:00Z', value: 'Happy' },
      { timestamp: '2025-03-01T12:00:00Z', value: 'Calm' },
      { timestamp: '2025-03-01T16:00:00Z', value: 'Anxious' },
      { timestamp: '2025-03-01T20:00:00Z', value: 'Tired' },
      { timestamp: '2025-03-02T08:00:00Z', value: 'Energetic' },
      { timestamp: '2025-03-02T12:00:00Z', value: 'Calm' },
      { timestamp: '2025-03-02T16:00:00Z', value: 'Stressed' },
      { timestamp: '2025-03-02T20:00:00Z', value: 'Relaxed' },
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
    importance: 'Med',
    timestamp: '2025-03-02T14:30:00Z',
  },
  {
    id: '2',
    category: 'Physical Activity',
    title: 'Exercise Recommendation',
    description: 'Based on your heart rate variability, a gentle 20-minute walk in the morning would be beneficial for both you and your baby.',
    importance: 'High',
    timestamp: '2025-03-02T10:15:00Z',
  },
  {
    id: '3',
    category: 'Nutrition',
    title: 'Hydration Reminder',
    description: 'Your recent data suggests you may be slightly dehydrated. Try to increase your water intake to at least 8 glasses per day.',
    importance: 'Med',
    timestamp: '2025-03-02T16:45:00Z',
  },
  {
    id: '4',
    category: 'Sleep',
    title: 'Sleep Position Adjustment',
    description: 'Your sleep data indicates you might benefit from sleeping on your left side, which can improve blood flow to your baby.',
    importance: 'Low',
    timestamp: '2025-03-02T08:20:00Z',
  },
];

// Mock health insights
export const mockHealthInsights = [
  {
    id: '1',
    title: 'Heart Rate Analysis',
    description: 'Your heart rate has been within normal range for pregnant women in their second trimester. The slight elevation in the afternoons is normal and corresponds with your activity levels.',
    data: 'heartRate',
    timestamp: '2025-03-02T15:00:00Z',
  },
  {
    id: '2',
    title: 'Stress Pattern Detected',
    description: 'We\'ve noticed a pattern of increased stress levels in the mid-afternoon. This could be related to work activities or fatigue. Consider taking short breaks during this time.',
    data: 'stress',
    timestamp: '2025-03-02T11:30:00Z',
  },
  {
    id: '3',
    title: 'Sleep Quality Improvement',
    description: 'Your sleep quality has improved by 15% over the last week. Maintaining your current bedtime routine appears to be beneficial.',
    data: 'sleep',
    timestamp: '2025-03-02T09:45:00Z',
  },
  {
    id: '4',
    title: 'Emotional Well-being',
    description: 'Your emotional state has been predominantly positive, with occasional periods of anxiety. This is common during pregnancy, but do reach out to your healthcare provider if anxiety persists.',
    data: 'emotion',
    timestamp: '2025-03-02T14:15:00Z',
  },
];

// Mock pregnancy milestones
export const mockPregnancyMilestones = [
  {
    week: 4,
    title: "Embryo Formation",
    description: "Your baby is now called an embryo and is about the size of a poppy seed. The neural tube, which will become the brain and spinal cord, is developing.",
    tips: "Start taking prenatal vitamins if you haven't already. Folic acid is especially important at this stage.",
    healthData: {
      heartRate: { value: 75, change: "+3" },
      hrv: { value: 52, change: "-2" },
      stress: { value: 30, label: "Low", change: "-5" },
      emotion: { value: "Happy", previous: "Anxious" }
    }
  },
  {
    week: 6,
    title: "Heartbeat Begins",
    description: "Your baby's heart begins to beat around 6 weeks. The embryo is about the size of a lentil (0.25 inches).",
    tips: "Schedule your first prenatal appointment if you haven't already.",
    healthData: {
      heartRate: { value: 78, change: "+5" },
      hrv: { value: 48, change: "-4" },
      stress: { value: 35, label: "Low", change: "+5" },
      emotion: { value: "Anxious", previous: "Happy" }
    }
  },
  {
    week: 8,
    title: "All Essential Organs Form",
    description: "All essential organs have begun to develop. Your baby is now about the size of a kidney bean (0.5 inches).",
    tips: "Maintain a balanced diet rich in fruits, vegetables, and proteins to support your baby's rapid development.",
    healthData: {
      heartRate: { value: 80, change: "+2" },
      hrv: { value: 45, change: "-3" },
      stress: { value: 40, label: "Low", change: "+5" },
      emotion: { value: "Calm", previous: "Anxious" }
    }
  },
  {
    week: 10,
    title: "Embryo to Fetus",
    description: "Your baby is now called a fetus. Tiny fingers and toes are forming, and the neural tube has closed.",
    tips: "Stay hydrated and continue with gentle exercise if your doctor approves.",
    healthData: {
      heartRate: { value: 82, change: "+2" },
      hrv: { value: 43, change: "-2" },
      stress: { value: 45, label: "Low", change: "+5" },
      emotion: { value: "Happy", previous: "Calm" }
    }
  },
  {
    week: 12,
    title: "First Trimester Complete",
    description: "Your baby is about 2.5 inches long and weighs about 0.5 ounces. External genitalia are developing.",
    tips: "The risk of miscarriage drops significantly after the first trimester. You may start feeling more energetic.",
    healthData: {
      heartRate: { value: 84, change: "+2" },
      hrv: { value: 42, change: "-1" },
      stress: { value: 50, label: "Med", change: "+5" },
      emotion: { value: "Energetic", previous: "Happy" }
    }
  },
  {
    week: 14,
    title: "Baby's Sex Becomes Visible",
    description: "Your baby's sex may be visible on an ultrasound. The fetus is about 3.5 inches long and can make facial expressions.",
    tips: "You may notice your energy returning as you enter the second trimester.",
    healthData: {
      heartRate: { value: 85, change: "+1" },
      hrv: { value: 41, change: "-1" },
      stress: { value: 45, label: "Low", change: "-5" },
      emotion: { value: "Happy", previous: "Energetic" }
    }
  },
  {
    week: 16,
    title: "Baby Can Hear You",
    description: "Your baby can hear your voice now. The fetus is about 4.5 inches long and weighs about 3.5 ounces.",
    tips: "Talk or sing to your baby - they can hear you now and will recognize your voice after birth.",
    healthData: {
      heartRate: { value: 86, change: "+1" },
      hrv: { value: 40, change: "-1" },
      stress: { value: 40, label: "Low", change: "-5" },
      emotion: { value: "Calm", previous: "Happy" }
    }
  },
  {
    week: 18,
    title: "Baby Starts Moving",
    description: "You might start feeling your baby move (quickening). The fetus is about 5.5 inches long and weighs about 7 ounces.",
    tips: "Start doing pelvic floor exercises (Kegels) to strengthen muscles for delivery and recovery.",
    healthData: {
      heartRate: { value: 87, change: "+1" },
      hrv: { value: 39, change: "-1" },
      stress: { value: 45, label: "Low", change: "+5" },
      emotion: { value: "Excited", previous: "Calm" }
    }
  },
  {
    week: 20,
    title: "Halfway Point",
    description: "You're halfway through your pregnancy! Your baby is about 6.5 inches long and weighs about 10 ounces.",
    tips: "This is typically when you'll have an anatomy scan ultrasound to check your baby's development.",
    healthData: {
      heartRate: { value: 88, change: "+1" },
      hrv: { value: 38, change: "-1" },
      stress: { value: 50, label: "Med", change: "+5" },
      emotion: { value: "Anxious", previous: "Excited" }
    }
  },
  {
    week: 22,
    title: "Baby's Senses Developing",
    description: "Your baby's sense of touch, taste, sight, hearing, and smell are developing. The fetus is about 11 inches long.",
    tips: "Start planning your maternity leave and discussing childcare options if needed.",
    healthData: {
      heartRate: { value: 89, change: "+1" },
      hrv: { value: 37, change: "-1" },
      stress: { value: 45, label: "Low", change: "-5" },
      emotion: { value: "Calm", previous: "Anxious" }
    }
  },
  {
    week: 24,
    title: "Viability Milestone",
    description: "Your baby has reached a significant milestone - if born now, they would have a chance of survival with intensive care.",
    tips: "Consider signing up for childbirth classes if you haven't already.",
    healthData: {
      heartRate: { value: 90, change: "+1" },
      hrv: { value: 36, change: "-1" },
      stress: { value: 40, label: "Low", change: "-5" },
      emotion: { value: "Happy", previous: "Calm" }
    }
  },
  {
    week: 26,
    title: "Baby Opens Eyes",
    description: "Your baby's eyes open for the first time. The fetus is about 14 inches long and weighs about 1.7 pounds.",
    tips: "Start monitoring your baby's movement patterns. Contact your healthcare provider if you notice decreased movement.",
    healthData: {
      heartRate: { value: 91, change: "+1" },
      hrv: { value: 35, change: "-1" },
      stress: { value: 45, label: "Low", change: "+5" },
      emotion: { value: "Excited", previous: "Happy" }
    }
  },
  {
    week: 28,
    title: "Brain Development Accelerates",
    description: "Your baby's brain is developing rapidly. The fetus is about 14.8 inches long and weighs about 2.2 pounds.",
    tips: "Rest when you can and sleep on your side to improve blood flow to your baby.",
    healthData: {
      heartRate: { value: 92, change: "+1" },
      hrv: { value: 34, change: "-1" },
      stress: { value: 50, label: "Med", change: "+5" },
      emotion: { value: "Tired", previous: "Excited" }
    }
  },
  {
    week: 30,
    title: "Baby Gains Weight",
    description: "Your baby is gaining weight rapidly. The fetus is about 15.7 inches long and weighs about 3 pounds.",
    tips: "Start preparing your home for the baby's arrival. Consider creating a birth plan if you haven't already.",
    healthData: {
      heartRate: { value: 93, change: "+1" },
      hrv: { value: 33, change: "-1" },
      stress: { value: 55, label: "Med", change: "+5" },
      emotion: { value: "Anxious", previous: "Tired" }
    }
  },
  {
    week: 32,
    title: "Baby's Movements Change",
    description: "Your baby's movements may change as they have less room to move. The fetus is about 16.7 inches long and weighs about 4 pounds.",
    tips: "Pack your hospital bag and make sure your car seat is properly installed.",
    healthData: {
      heartRate: { value: 94, change: "+1" },
      hrv: { value: 32, change: "-1" },
      stress: { value: 60, label: "Med", change: "+5" },
      emotion: { value: "Nervous", previous: "Anxious" }
    }
  },
  {
    week: 34,
    title: "Lungs Nearly Mature",
    description: "Your baby's lungs are nearly fully mature. The fetus is about 17.7 inches long and weighs about 5 pounds.",
    tips: "Practice your breathing techniques for labor and delivery.",
    healthData: {
      heartRate: { value: 95, change: "+1" },
      hrv: { value: 31, change: "-1" },
      stress: { value: 65, label: "Med", change: "+5" },
      emotion: { value: "Anxious", previous: "Nervous" }
    }
  },
  {
    week: 36,
    title: "Baby Drops Lower",
    description: "Your baby may drop lower into your pelvis (lightening). The fetus is about 18.7 inches long and weighs about 6 pounds.",
    tips: "Continue to monitor your baby's movements and report any significant changes to your healthcare provider.",
    healthData: {
      heartRate: { value: 96, change: "+1" },
      hrv: { value: 30, change: "-1" },
      stress: { value: 70, label: "High", change: "+5" },
      emotion: { value: "Tired", previous: "Anxious" }
    }
  },
  {
    week: 38,
    title: "Full Term",
    description: "Your baby is considered full term. The fetus is about 19.5 inches long and weighs about 7 pounds.",
    tips: "Rest as much as possible and finalize any last-minute preparations for your baby's arrival.",
    healthData: {
      heartRate: { value: 97, change: "+1" },
      hrv: { value: 29, change: "-1" },
      stress: { value: 75, label: "High", change: "+5" },
      emotion: { value: "Excited", previous: "Tired" }
    }
  },
  {
    week: 40,
    title: "Due Date",
    description: "Your baby is ready to be born. The average newborn is about 20 inches long and weighs about 7.5 pounds.",
    tips: "Be patient if your due date passes - only about 5% of babies are born on their exact due date.",
    healthData: {
      heartRate: { value: 98, change: "+1" },
      hrv: { value: 28, change: "-1" },
      stress: { value: 80, label: "High", change: "+5" },
      emotion: { value: "Anxious", previous: "Excited" }
    }
  },
  {
    week: 42,
    title: "Post-Term",
    description: "Your pregnancy is considered post-term. Your healthcare provider will monitor you and your baby closely.",
    tips: "Discuss induction options with your healthcare provider if you haven't already.",
    healthData: {
      heartRate: { value: 99, change: "+1" },
      hrv: { value: 27, change: "-1" },
      stress: { value: 85, label: "High", change: "+5" },
      emotion: { value: "Frustrated", previous: "Anxious" }
    }
  }
]; 