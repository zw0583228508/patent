export type Category = {
  id: string;
  label: string;
  icon: string;
};

export type Tip = {
  id: string;
  type: "tip";
  author: string;
  initials: string;
  avatarGradient: readonly [string, string];
  category: string;
  categoryIcon: string;
  text: string;
  workedCount: number;
  didntWorkCount: number;
  commentCount: number;
  trustScore: number;
  isTrending?: boolean;
  timestamp: string;
};

export type Question = {
  id: string;
  type: "question";
  author: string;
  initials: string;
  avatarGradient: readonly [string, string];
  category: string;
  categoryIcon: string;
  text: string;
  answerCount: number;
  timestamp: string;
};

export type FeedItem = Tip | Question;

export const CATEGORIES: Category[] = [
  { id: "all", label: "הכל", icon: "grid" },
  { id: "home", label: "בית", icon: "home" },
  { id: "food", label: "אוכל", icon: "coffee" },
  { id: "business", label: "עסקים", icon: "briefcase" },
  { id: "health", label: "בריאות", icon: "heart" },
  { id: "tech", label: "טכנולוגיה", icon: "cpu" },
  { id: "nature", label: "טבע", icon: "sun" },
];

export const FEED_ITEMS: FeedItem[] = [
  {
    id: "t1",
    type: "tip",
    author: "מלי כהן",
    initials: "מכ",
    avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "בית",
    categoryIcon: "home",
    text: "שים גרעין אבוקדו במים עם האבוקדו החתוך — לא ישחיר גם 3 שעות אחרי.",
    workedCount: 2400,
    didntWorkCount: 142,
    commentCount: 38,
    trustScore: 94,
    timestamp: "לפני 2 שעות",
  },
  {
    id: "q1",
    type: "question",
    author: "דן לוי",
    initials: "דל",
    avatarGradient: ["#40e0f0", "#4080f0"] as const,
    category: "אוכל",
    categoryIcon: "coffee",
    text: "איך שומרים על תות שדה טרי יותר מיום אחד בלי שיתעפש?",
    answerCount: 47,
    timestamp: "לפני 4 שעות",
  },
  {
    id: "t2",
    type: "tip",
    author: "רון אבי",
    initials: "רא",
    avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "עסקים",
    categoryIcon: "briefcase",
    text: "שלח הצעת מחיר תמיד ב-PDF ולא ב-Word. נראה יותר מקצועי ולא ניתן לעריכה.",
    workedCount: 5100,
    didntWorkCount: 89,
    commentCount: 122,
    trustScore: 98,
    isTrending: true,
    timestamp: "לפני 6 שעות",
  },
  {
    id: "t3",
    type: "tip",
    author: "שירה מזרחי",
    initials: "שמ",
    avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "בריאות",
    categoryIcon: "heart",
    text: "לשתות כוס מים מיד אחרי ההשכמה — לפני קפה. מרגישים הרבה יותר עירניים תוך 10 דקות.",
    workedCount: 8700,
    didntWorkCount: 310,
    commentCount: 201,
    trustScore: 97,
    timestamp: "לפני 8 שעות",
  },
  {
    id: "q2",
    type: "question",
    author: "אורי בן-דוד",
    initials: "אב",
    avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "טכנולוגיה",
    categoryIcon: "cpu",
    text: "מה הדרך הכי טובה לנהל סיסמאות בלי להתחרפן?",
    answerCount: 93,
    timestamp: "לפני 12 שעות",
  },
  {
    id: "t4",
    type: "tip",
    author: "נועה כץ",
    initials: "נכ",
    avatarGradient: ["#f0e040", "#f0a040"] as const,
    category: "בית",
    categoryIcon: "home",
    text: "כדי להסיר ריח רע מהמקרר — שים קערת סודה לשתייה בפנים. מחליף כל חודש.",
    workedCount: 3200,
    didntWorkCount: 88,
    commentCount: 54,
    trustScore: 97,
    timestamp: "אתמול",
  },
  {
    id: "t5",
    type: "tip",
    author: "עמית ישראל",
    initials: "עי",
    avatarGradient: ["#40e0f0", "#4080f0"] as const,
    category: "טכנולוגיה",
    categoryIcon: "cpu",
    text: "Ctrl+Shift+T בדפדפן מחזיר את הטאב האחרון שנסגר. עבד לי אלפי פעמים.",
    workedCount: 12000,
    didntWorkCount: 120,
    commentCount: 445,
    trustScore: 99,
    isTrending: true,
    timestamp: "אתמול",
  },
  {
    id: "q3",
    type: "question",
    author: "יעל גולן",
    initials: "יג",
    avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "עסקים",
    categoryIcon: "briefcase",
    text: "איך לכתוב אימייל דחוף בלי להישמע נזוף?",
    answerCount: 31,
    timestamp: "לפני 2 ימים",
  },
  {
    id: "t6",
    type: "tip",
    author: "ליאור בר",
    initials: "לב",
    avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "בריאות",
    categoryIcon: "heart",
    text: "להחזיק את הטלפון בגובה העיניים בזמן גלילה — חוסך כאבי צוואר אחרי שעה.",
    workedCount: 6700,
    didntWorkCount: 220,
    commentCount: 87,
    trustScore: 97,
    timestamp: "לפני 3 ימים",
  },
  {
    id: "t7",
    type: "tip",
    author: "גיא אלון",
    initials: "גא",
    avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "טבע",
    categoryIcon: "sun",
    text: "לשים צמח אלוורה ליד חלון מערב — עמיד לשמש חזקה, לא צריך להשקות כל יום.",
    workedCount: 1800,
    didntWorkCount: 45,
    commentCount: 29,
    trustScore: 98,
    timestamp: "לפני 4 ימים",
  },
];

export const TRENDING_TIPS = FEED_ITEMS.filter(
  (item): item is Tip => item.type === "tip"
).sort((a, b) => b.workedCount - a.workedCount);

export const USER_PROFILE = {
  name: "יובל כהן",
  initials: "יכ",
  username: "@yuval_k",
  bio: "שותף טיפים יומיומיים על חיי היומיום 🧠",
  tipsCount: 23,
  workedCount: 8420,
  trustScore: 96,
  savedCount: 47,
  avatarGradient: ["#f0e040", "#40e0f0"] as [string, string],
};

export const USER_TIPS: Tip[] = [
  {
    id: "ut1",
    type: "tip",
    author: "יובל כהן",
    initials: "יכ",
    avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "עסקים",
    categoryIcon: "briefcase",
    text: "לפני כל פגישה — כתוב 3 שאלות שאתה רוצה לשאול. נראה מוכן ומקצועי יותר.",
    workedCount: 1200,
    didntWorkCount: 32,
    commentCount: 18,
    trustScore: 97,
    timestamp: "לפני שבוע",
  },
  {
    id: "ut2",
    type: "tip",
    author: "יובל כהן",
    initials: "יכ",
    avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "בריאות",
    categoryIcon: "heart",
    text: "אם אתה לא יכול לשתות 8 כוסות מים — שים בקבוק על השולחן מולך. פי 3 יותר שותים.",
    workedCount: 2100,
    didntWorkCount: 71,
    commentCount: 44,
    trustScore: 97,
    timestamp: "לפני שבועיים",
  },
];
