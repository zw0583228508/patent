export type Category = {
  id: string;
  label: string;
  icon: string;
};

export type Comment = {
  id: string;
  author: string;
  initials: string;
  avatarColor: string;
  text: string;
  timestamp: string;
  likeCount: number;
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
  likeCount: number;
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
  likeCount: number;
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

export const COMMENTS_MAP: Record<string, Comment[]> = {
  t1: [
    { id: "c1", author: "אורי ג'", initials: "אג", avatarColor: "#40e0f0", text: "ניסיתי — עובד מדהים! תודה על הטיפ", timestamp: "לפני שעה", likeCount: 14 },
    { id: "c2", author: "נעמה ל'", initials: "נל", avatarColor: "#f040a0", text: "האמת שאני שמה מיץ לימון, אבל אנסה את זה", timestamp: "לפני שעה", likeCount: 6 },
    { id: "c3", author: "רועי כ'", initials: "רכ", avatarColor: "#40e040", text: "הגרעין לא מועיל לדעתי, הלימון הוא שעוזר", timestamp: "לפני 2 שעות", likeCount: 3 },
  ],
  q1: [
    { id: "c4", author: "שלי מ'", initials: "שמ", avatarColor: "#f0e040", text: "שים אותם על נייר סופג ולא בשקית אטומה — חיים כפול!", timestamp: "לפני 2 שעות", likeCount: 29 },
    { id: "c5", author: "דור א'", initials: "דא", avatarColor: "#40e0f0", text: "מקרר בטמפרטורה מקסימלית גם עוזר מאוד", timestamp: "לפני 3 שעות", likeCount: 11 },
  ],
  t2: [
    { id: "c6", author: "יפית ה'", initials: "יה", avatarColor: "#f040a0", text: "עושה את זה מאז שנים, לקוחות אוהבים את הפרופסיונליות", timestamp: "לפני 4 שעות", likeCount: 42 },
    { id: "c7", author: "עמי ש'", initials: "עש", avatarColor: "#f0e040", text: "גם ריפעא כותב עם הלוגו שלו. נראה מדהים", timestamp: "לפני 5 שעות", likeCount: 17 },
    { id: "c8", author: "מאיה ר'", initials: "מר", avatarColor: "#40e040", text: "איך מייצרים PDF מוורד בלי לשלם?", timestamp: "לפני 6 שעות", likeCount: 5 },
  ],
  t3: [
    { id: "c9", author: "גיל ב'", initials: "גב", avatarColor: "#40e0f0", text: "שינה את חיי, אני פחות עייף בבוקר לגמרי", timestamp: "לפני 5 שעות", likeCount: 88 },
    { id: "c10", author: "תמר כ'", initials: "תכ", avatarColor: "#f0e040", text: "עם מים קרים או חמים?", timestamp: "לפני 6 שעות", likeCount: 12 },
  ],
  q2: [
    { id: "c11", author: "נתן ל'", initials: "נל", avatarColor: "#f040a0", text: "1Password שווה כל שקל. שנים שאני משתמש", timestamp: "לפני 8 שעות", likeCount: 67 },
    { id: "c12", author: "קרן צ'", initials: "קצ", avatarColor: "#40e040", text: "Bitwarden — חינמי ובקוד פתוח, לא צריך לשלם", timestamp: "לפני 9 שעות", likeCount: 53 },
    { id: "c13", author: "אדם פ'", initials: "אפ", avatarColor: "#40e0f0", text: "Google Passwords עושה את העבודה בלי תוספים", timestamp: "לפני 10 שעות", likeCount: 21 },
  ],
  t4: [
    { id: "c14", author: "דנה ג'", initials: "דג", avatarColor: "#f0e040", text: "פחם מופעל עובד אפילו יותר טוב מסודה!", timestamp: "לפני יום", likeCount: 19 },
  ],
  t5: [
    { id: "c15", author: "רם א'", initials: "רא", avatarColor: "#f040a0", text: "טיפ הזהב! הצלתי כמה טאבים חשובים כך", timestamp: "לפני יום", likeCount: 302 },
    { id: "c16", author: "ליה ס'", initials: "לס", avatarColor: "#40e040", text: "לא ידעתי!! כמה שנים הפסדתי", timestamp: "לפני יום", likeCount: 145 },
    { id: "c17", author: "נועם ו'", initials: "נו", avatarColor: "#40e0f0", text: "עובד גם על Mac עם Cmd+Shift+T", timestamp: "לפני יום", likeCount: 88 },
  ],
  q3: [
    { id: "c18", author: "מיכל פ'", initials: "מפ", avatarColor: "#f0e040", text: "כתוב בשורת הנושא URGENT: [נושא] — ישר לעניין", timestamp: "לפני 2 ימים", likeCount: 34 },
  ],
  t6: [
    { id: "c19", author: "שרה כ'", initials: "שכ", avatarColor: "#40e0f0", text: "ניסיתי — עובד שבועות! נהדר", timestamp: "לפני 3 ימים", likeCount: 27 },
  ],
  t7: [
    { id: "c20", author: "אבי ל'", initials: "אל", avatarColor: "#f040a0", text: "הוסף לי מים כשגיליתי. מחכה עוד 10 שנים :(", timestamp: "לפני 4 ימים", likeCount: 9 },
  ],
};

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
    commentCount: 3,
    likeCount: 412,
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
    likeCount: 89,
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
    commentCount: 3,
    likeCount: 1800,
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
    commentCount: 2,
    likeCount: 3200,
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
    likeCount: 231,
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
    commentCount: 1,
    likeCount: 670,
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
    commentCount: 3,
    likeCount: 5400,
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
    likeCount: 144,
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
    commentCount: 1,
    likeCount: 980,
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
    commentCount: 1,
    likeCount: 320,
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
  bio: "שותף טיפים יומיומיים על חיי היומיום",
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
    likeCount: 340,
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
    likeCount: 720,
    trustScore: 97,
    timestamp: "לפני שבועיים",
  },
];
