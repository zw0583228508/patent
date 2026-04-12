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
  userId: string;
  author: string;
  initials: string;
  avatarGradient: readonly [string, string];
  category: string;
  categoryIcon: string;
  categoryId: string;
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
  userId: string;
  author: string;
  initials: string;
  avatarGradient: readonly [string, string];
  category: string;
  categoryIcon: string;
  categoryId: string;
  text: string;
  answerCount: number;
  likeCount: number;
  timestamp: string;
};

export type FeedItem = Tip | Question;

export type MockUser = {
  id: string;
  name: string;
  initials: string;
  username: string;
  bio: string;
  tipsCount: number;
  followersCount: number;
  followingCount: number;
  trustScore: number;
  avatarGradient: readonly [string, string];
  categoryId: string;
};

export const CATEGORIES: Category[] = [
  { id: "all", label: "הכל", icon: "grid" },
  { id: "home", label: "בית", icon: "home" },
  { id: "food", label: "אוכל", icon: "coffee" },
  { id: "business", label: "עסקים", icon: "briefcase" },
  { id: "health", label: "בריאות", icon: "heart" },
  { id: "tech", label: "טכנולוגיה", icon: "cpu" },
  { id: "nature", label: "טבע", icon: "sun" },
];

export const MOCK_USERS: MockUser[] = [
  {
    id: "user1", name: "מלי כהן", initials: "מכ", username: "@mali_k",
    bio: "חובבת בישול ובית חכם", tipsCount: 34, followersCount: 1240, followingCount: 89,
    trustScore: 94, avatarGradient: ["#f0e040", "#40e0f0"] as const, categoryId: "home",
  },
  {
    id: "user2", name: "דן לוי", initials: "דל", username: "@dan_levi",
    bio: "שואל שאלות חכמות על אוכל", tipsCount: 12, followersCount: 340, followingCount: 210,
    trustScore: 89, avatarGradient: ["#40e0f0", "#4080f0"] as const, categoryId: "food",
  },
  {
    id: "user3", name: "רון אבי", initials: "רא", username: "@ron_avi",
    bio: "יזם ועסקים דיגיטליים", tipsCount: 67, followersCount: 4200, followingCount: 55,
    trustScore: 98, avatarGradient: ["#f040a0", "#a040f0"] as const, categoryId: "business",
  },
  {
    id: "user4", name: "שירה מזרחי", initials: "שמ", username: "@shira_m",
    bio: "בריאות ורווחה יומיומית", tipsCount: 45, followersCount: 2800, followingCount: 120,
    trustScore: 97, avatarGradient: ["#40e040", "#40e0f0"] as const, categoryId: "health",
  },
  {
    id: "user5", name: "אורי בן-דוד", initials: "אב", username: "@uri_bd",
    bio: "מפתח ואוהב טכנולוגיה", tipsCount: 28, followersCount: 980, followingCount: 340,
    trustScore: 93, avatarGradient: ["#f0e040", "#f040a0"] as const, categoryId: "tech",
  },
  {
    id: "user6", name: "נועה כץ", initials: "נכ", username: "@noa_k",
    bio: "טיפים לחיי יום-יום", tipsCount: 19, followersCount: 560, followingCount: 78,
    trustScore: 97, avatarGradient: ["#f0e040", "#f0a040"] as const, categoryId: "home",
  },
  {
    id: "user7", name: "עמית ישראל", initials: "עי", username: "@amit_i",
    bio: "גיק טכנולוגיה ופרודוקטיביות", tipsCount: 82, followersCount: 7600, followingCount: 30,
    trustScore: 99, avatarGradient: ["#40e0f0", "#4080f0"] as const, categoryId: "tech",
  },
  {
    id: "user8", name: "יעל גולן", initials: "יג", username: "@yael_g",
    bio: "תקשורת ועסקים", tipsCount: 14, followersCount: 420, followingCount: 190,
    trustScore: 91, avatarGradient: ["#f040a0", "#a040f0"] as const, categoryId: "business",
  },
  {
    id: "user9", name: "ליאור בר", initials: "לב", username: "@lior_b",
    bio: "בריאות ואיכות חיים", tipsCount: 31, followersCount: 1100, followingCount: 65,
    trustScore: 97, avatarGradient: ["#40e040", "#f0e040"] as const, categoryId: "health",
  },
  {
    id: "user10", name: "גיא אלון", initials: "גא", username: "@guy_a",
    bio: "גינון וטבע", tipsCount: 22, followersCount: 670, followingCount: 140,
    trustScore: 98, avatarGradient: ["#f040a0", "#f0e040"] as const, categoryId: "nature",
  },
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
    id: "t1", type: "tip", userId: "user1",
    author: "מלי כהן", initials: "מכ", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "בית", categoryIcon: "home", categoryId: "home",
    text: "שים גרעין אבוקדו במים עם האבוקדו החתוך — לא ישחיר גם 3 שעות אחרי.",
    workedCount: 2400, didntWorkCount: 142, commentCount: 3, likeCount: 412, trustScore: 94,
    timestamp: "לפני 2 שעות",
  },
  {
    id: "q1", type: "question", userId: "user2",
    author: "דן לוי", initials: "דל", avatarGradient: ["#40e0f0", "#4080f0"] as const,
    category: "אוכל", categoryIcon: "coffee", categoryId: "food",
    text: "איך שומרים על תות שדה טרי יותר מיום אחד בלי שיתעפש?",
    answerCount: 47, likeCount: 89, timestamp: "לפני 4 שעות",
  },
  {
    id: "t2", type: "tip", userId: "user3",
    author: "רון אבי", initials: "רא", avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "עסקים", categoryIcon: "briefcase", categoryId: "business",
    text: "שלח הצעת מחיר תמיד ב-PDF ולא ב-Word. נראה יותר מקצועי ולא ניתן לעריכה.",
    workedCount: 5100, didntWorkCount: 89, commentCount: 2, likeCount: 1800, trustScore: 98,
    isTrending: true, timestamp: "לפני 6 שעות",
  },
  {
    id: "t3", type: "tip", userId: "user4",
    author: "שירה מזרחי", initials: "שמ", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "בריאות", categoryIcon: "heart", categoryId: "health",
    text: "לשתות כוס מים מיד אחרי ההשכמה — לפני קפה. מרגישים הרבה יותר עירניים תוך 10 דקות.",
    workedCount: 8700, didntWorkCount: 310, commentCount: 2, likeCount: 3200, trustScore: 97,
    timestamp: "לפני 8 שעות",
  },
  {
    id: "q2", type: "question", userId: "user5",
    author: "אורי בן-דוד", initials: "אב", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "טכנולוגיה", categoryIcon: "cpu", categoryId: "tech",
    text: "מה הדרך הכי טובה לנהל סיסמאות בלי להתחרפן?",
    answerCount: 93, likeCount: 231, timestamp: "לפני 12 שעות",
  },
  {
    id: "t4", type: "tip", userId: "user6",
    author: "נועה כץ", initials: "נכ", avatarGradient: ["#f0e040", "#f0a040"] as const,
    category: "בית", categoryIcon: "home", categoryId: "home",
    text: "כדי להסיר ריח רע מהמקרר — שים קערת סודה לשתייה בפנים. מחליף כל חודש.",
    workedCount: 3200, didntWorkCount: 88, commentCount: 1, likeCount: 670, trustScore: 97,
    timestamp: "אתמול",
  },
  {
    id: "t5", type: "tip", userId: "user7",
    author: "עמית ישראל", initials: "עי", avatarGradient: ["#40e0f0", "#4080f0"] as const,
    category: "טכנולוגיה", categoryIcon: "cpu", categoryId: "tech",
    text: "Ctrl+Shift+T בדפדפן מחזיר את הטאב האחרון שנסגר. עבד לי אלפי פעמים.",
    workedCount: 12000, didntWorkCount: 120, commentCount: 3, likeCount: 5400, trustScore: 99,
    isTrending: true, timestamp: "אתמול",
  },
  {
    id: "q3", type: "question", userId: "user8",
    author: "יעל גולן", initials: "יג", avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "עסקים", categoryIcon: "briefcase", categoryId: "business",
    text: "איך לכתוב אימייל דחוף בלי להישמע נזוף?",
    answerCount: 31, likeCount: 144, timestamp: "לפני 2 ימים",
  },
  {
    id: "t6", type: "tip", userId: "user9",
    author: "ליאור בר", initials: "לב", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "בריאות", categoryIcon: "heart", categoryId: "health",
    text: "להחזיק את הטלפון בגובה העיניים בזמן גלילה — חוסך כאבי צוואר אחרי שעה.",
    workedCount: 6700, didntWorkCount: 220, commentCount: 1, likeCount: 980, trustScore: 97,
    timestamp: "לפני 3 ימים",
  },
  {
    id: "t7", type: "tip", userId: "user10",
    author: "גיא אלון", initials: "גא", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "טבע", categoryIcon: "sun", categoryId: "nature",
    text: "לשים צמח אלוורה ליד חלון מערב — עמיד לשמש חזקה, לא צריך להשקות כל יום.",
    workedCount: 1800, didntWorkCount: 45, commentCount: 1, likeCount: 320, trustScore: 98,
    timestamp: "לפני 4 ימים",
  },
];

export const TRENDING_TIPS = FEED_ITEMS.filter(
  (item): item is Tip => item.type === "tip"
).sort((a, b) => b.workedCount - a.workedCount);

export const USER_PROFILE = {
  id: "me",
  name: "יובל כהן",
  initials: "יכ",
  username: "@yuval_k",
  bio: "שותף טיפים יומיומיים על חיי היומיום",
  tipsCount: 23,
  workedCount: 8420,
  trustScore: 96,
  savedCount: 47,
  followersCount: 312,
  followingCount: 58,
  avatarGradient: ["#f0e040", "#40e0f0"] as [string, string],
};

export const USER_TIPS: Tip[] = [
  {
    id: "ut1", type: "tip", userId: "me",
    author: "יובל כהן", initials: "יכ", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "עסקים", categoryIcon: "briefcase", categoryId: "business",
    text: "לפני כל פגישה — כתוב 3 שאלות שאתה רוצה לשאול. נראה מוכן ומקצועי יותר.",
    workedCount: 1200, didntWorkCount: 32, commentCount: 18, likeCount: 340, trustScore: 97,
    timestamp: "לפני שבוע",
  },
  {
    id: "ut2", type: "tip", userId: "me",
    author: "יובל כהן", initials: "יכ", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "בריאות", categoryIcon: "heart", categoryId: "health",
    text: "אם אתה לא יכול לשתות 8 כוסות מים — שים בקבוק על השולחן מולך. פי 3 יותר שותים.",
    workedCount: 2100, didntWorkCount: 71, commentCount: 44, likeCount: 720, trustScore: 97,
    timestamp: "לפני שבועיים",
  },
];
