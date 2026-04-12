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
  repostCount?: number;
  trustScore: number;
  isTrending?: boolean;
  timestamp: string;
  repostedBy?: string;
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
  repostCount: number;
  timestamp: string;
  repostedBy?: string;
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
  { id: "user1", name: "מלי כהן", initials: "מכ", username: "@mali_k", bio: "חובבת בישול ובית חכם", tipsCount: 34, followersCount: 1240, followingCount: 89, trustScore: 94, avatarGradient: ["#f0e040", "#40e0f0"] as const, categoryId: "home" },
  { id: "user2", name: "דן לוי", initials: "דל", username: "@dan_levi", bio: "שואל שאלות חכמות על אוכל", tipsCount: 12, followersCount: 340, followingCount: 210, trustScore: 89, avatarGradient: ["#40e0f0", "#4080f0"] as const, categoryId: "food" },
  { id: "user3", name: "רון אבי", initials: "רא", username: "@ron_avi", bio: "יזם ועסקים דיגיטליים", tipsCount: 67, followersCount: 4200, followingCount: 55, trustScore: 98, avatarGradient: ["#f040a0", "#a040f0"] as const, categoryId: "business" },
  { id: "user4", name: "שירה מזרחי", initials: "שמ", username: "@shira_m", bio: "בריאות ורווחה יומיומית", tipsCount: 45, followersCount: 2800, followingCount: 120, trustScore: 97, avatarGradient: ["#40e040", "#40e0f0"] as const, categoryId: "health" },
  { id: "user5", name: "אורי בן-דוד", initials: "אב", username: "@uri_bd", bio: "מפתח ואוהב טכנולוגיה", tipsCount: 28, followersCount: 980, followingCount: 340, trustScore: 93, avatarGradient: ["#f0e040", "#f040a0"] as const, categoryId: "tech" },
  { id: "user6", name: "נועה כץ", initials: "נכ", username: "@noa_k", bio: "טיפים לחיי יום-יום", tipsCount: 19, followersCount: 560, followingCount: 78, trustScore: 97, avatarGradient: ["#f0e040", "#f0a040"] as const, categoryId: "home" },
  { id: "user7", name: "עמית ישראל", initials: "עי", username: "@amit_i", bio: "גיק טכנולוגיה ופרודוקטיביות", tipsCount: 82, followersCount: 7600, followingCount: 30, trustScore: 99, avatarGradient: ["#40e0f0", "#4080f0"] as const, categoryId: "tech" },
  { id: "user8", name: "יעל גולן", initials: "יג", username: "@yael_g", bio: "תקשורת ועסקים", tipsCount: 14, followersCount: 420, followingCount: 190, trustScore: 91, avatarGradient: ["#f040a0", "#a040f0"] as const, categoryId: "business" },
  { id: "user9", name: "ליאור בר", initials: "לב", username: "@lior_b", bio: "בריאות ואיכות חיים", tipsCount: 31, followersCount: 1100, followingCount: 65, trustScore: 97, avatarGradient: ["#40e040", "#f0e040"] as const, categoryId: "health" },
  { id: "user10", name: "גיא אלון", initials: "גא", username: "@guy_a", bio: "גינון וטבע", tipsCount: 22, followersCount: 670, followingCount: 140, trustScore: 98, avatarGradient: ["#f040a0", "#f0e040"] as const, categoryId: "nature" },
  { id: "user11", name: "Sarah Mitchell", initials: "SM", username: "@sarah_m", bio: "Home organization & cooking enthusiast", tipsCount: 58, followersCount: 12400, followingCount: 210, trustScore: 97, avatarGradient: ["#f0e040", "#40e040"] as const, categoryId: "home" },
  { id: "user12", name: "James Park", initials: "JP", username: "@james_p", bio: "Software engineer & productivity nerd", tipsCount: 94, followersCount: 23000, followingCount: 88, trustScore: 99, avatarGradient: ["#40e0f0", "#a040f0"] as const, categoryId: "tech" },
  { id: "user13", name: "Elena Russo", initials: "ER", username: "@elena_r", bio: "Nutritionist & wellness coach", tipsCount: 76, followersCount: 18700, followingCount: 155, trustScore: 98, avatarGradient: ["#40e040", "#40e0f0"] as const, categoryId: "health" },
  { id: "user14", name: "Carlos Mendez", initials: "CM", username: "@carlos_m", bio: "Chef & food blogger", tipsCount: 112, followersCount: 34000, followingCount: 320, trustScore: 99, avatarGradient: ["#f040a0", "#f0e040"] as const, categoryId: "food" },
  { id: "user15", name: "Aisha Johnson", initials: "AJ", username: "@aisha_j", bio: "Business strategist & entrepreneur", tipsCount: 63, followersCount: 9800, followingCount: 145, trustScore: 96, avatarGradient: ["#f0e040", "#f040a0"] as const, categoryId: "business" },
  { id: "user16", name: "Luca Bianchi", initials: "LB", username: "@luca_b", bio: "Nature lover & sustainable living", tipsCount: 41, followersCount: 5600, followingCount: 230, trustScore: 95, avatarGradient: ["#40e040", "#f0e040"] as const, categoryId: "nature" },
  { id: "user17", name: "Maya Patel", initials: "MP", username: "@maya_p", bio: "UX designer & coffee addict", tipsCount: 37, followersCount: 7100, followingCount: 180, trustScore: 94, avatarGradient: ["#f040a0", "#40e0f0"] as const, categoryId: "tech" },
  { id: "user18", name: "Omar Hassan", initials: "OH", username: "@omar_h", bio: "Fitness trainer & life optimizer", tipsCount: 89, followersCount: 15200, followingCount: 92, trustScore: 98, avatarGradient: ["#40e0f0", "#40e040"] as const, categoryId: "health" },
  { id: "user19", name: "Sophie Dubois", initials: "SD", username: "@sophie_d", bio: "Interior design & minimalist living", tipsCount: 55, followersCount: 8900, followingCount: 267, trustScore: 96, avatarGradient: ["#f0e040", "#a040f0"] as const, categoryId: "home" },
  { id: "user20", name: "Kenji Tanaka", initials: "KT", username: "@kenji_t", bio: "Tech & startup culture", tipsCount: 71, followersCount: 11300, followingCount: 60, trustScore: 97, avatarGradient: ["#a040f0", "#40e0f0"] as const, categoryId: "tech" },
  { id: "user21", name: "Fatima Al-Rashid", initials: "FA", username: "@fatima_ar", bio: "نصائح للمطبخ والمنزل", tipsCount: 48, followersCount: 6700, followingCount: 190, trustScore: 95, avatarGradient: ["#f040a0", "#f0e040"] as const, categoryId: "food" },
  { id: "user22", name: "Diego García", initials: "DG", username: "@diego_g", bio: "Negocios y emprendimiento", tipsCount: 33, followersCount: 4100, followingCount: 220, trustScore: 93, avatarGradient: ["#40e040", "#a040f0"] as const, categoryId: "business" },
  { id: "user23", name: "Nina Kowalski", initials: "NK", username: "@nina_k", bio: "Zdrowe życie i gotowanie", tipsCount: 29, followersCount: 3200, followingCount: 175, trustScore: 92, avatarGradient: ["#40e0f0", "#f040a0"] as const, categoryId: "health" },
  { id: "user24", name: "Tom Watson", initials: "TW", username: "@tom_w", bio: "Garden & outdoor living expert", tipsCount: 44, followersCount: 5800, followingCount: 133, trustScore: 96, avatarGradient: ["#40e040", "#40e0f0"] as const, categoryId: "nature" },
  { id: "user25", name: "Rin Yamamoto", initials: "RY", username: "@rin_y", bio: "Minimalism & Japanese lifestyle tips", tipsCount: 52, followersCount: 9400, followingCount: 88, trustScore: 98, avatarGradient: ["#f0e040", "#40e0f0"] as const, categoryId: "home" },
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
  t5: [
    { id: "c15", author: "רם א'", initials: "רא", avatarColor: "#f040a0", text: "טיפ הזהב! הצלתי כמה טאבים חשובים כך", timestamp: "לפני יום", likeCount: 302 },
    { id: "c16", author: "ליה ס'", initials: "לס", avatarColor: "#40e040", text: "לא ידעתי!! כמה שנים הפסדתי", timestamp: "לפני יום", likeCount: 145 },
    { id: "c17", author: "נועם ו'", initials: "נו", avatarColor: "#40e0f0", text: "עובד גם על Mac עם Cmd+Shift+T", timestamp: "לפני יום", likeCount: 88 },
  ],
  te1: [
    { id: "ce1", author: "Mike R.", initials: "MR", avatarColor: "#40e0f0", text: "This completely changed my workflow. Been using it for 6 months now.", timestamp: "2h ago", likeCount: 234 },
    { id: "ce2", author: "Lisa K.", initials: "LK", avatarColor: "#f040a0", text: "Works on Notion and Google Docs too! Life changing.", timestamp: "3h ago", likeCount: 167 },
    { id: "ce3", author: "Sam T.", initials: "ST", avatarColor: "#40e040", text: "Also works in most code editors. Ctrl+Z has a limit but this doesn't.", timestamp: "4h ago", likeCount: 89 },
  ],
  te2: [
    { id: "ce4", author: "Anna M.", initials: "AM", avatarColor: "#f0e040", text: "I add a squeeze of lemon too — double the hydration effect!", timestamp: "1h ago", likeCount: 312 },
    { id: "ce5", author: "David L.", initials: "DL", avatarColor: "#40e0f0", text: "The key is doing it BEFORE coffee. Coffee dehydrates you first.", timestamp: "2h ago", likeCount: 198 },
    { id: "ce6", author: "Priya S.", initials: "PS", avatarColor: "#f040a0", text: "I put a glass on my nightstand the night before so I don't forget.", timestamp: "3h ago", likeCount: 145 },
  ],
  te3: [
    { id: "ce7", author: "Chris W.", initials: "CW", avatarColor: "#40e040", text: "Been doing the 2-minute rule since reading GTD years ago. Still works.", timestamp: "5h ago", likeCount: 421 },
    { id: "ce8", author: "Rachel G.", initials: "RG", avatarColor: "#f0e040", text: "The secret is not letting the pile grow. Each email once rule changed everything.", timestamp: "6h ago", likeCount: 287 },
  ],
  te5: [
    { id: "ce10", author: "Ben J.", initials: "BJ", avatarColor: "#40e0f0", text: "I actually use this for my entire grocery budget. Down to $250/month for 2 people.", timestamp: "1h ago", likeCount: 543 },
    { id: "ce11", author: "Mia F.", initials: "MF", avatarColor: "#f040a0", text: "The frozen herb ice cubes tip inside this changed my cooking!", timestamp: "2h ago", likeCount: 312 },
    { id: "ce12", author: "Jake H.", initials: "JH", avatarColor: "#40e040", text: "Meal prepping Sunday night is the single best habit I've built.", timestamp: "3h ago", likeCount: 234 },
  ],
  te8: [
    { id: "ce16", author: "Tom A.", initials: "TA", avatarColor: "#f0e040", text: "20-20-20 rule. Every 20 mins, look 20 feet away for 20 seconds. Game changer for eyes.", timestamp: "2h ago", likeCount: 387 },
    { id: "ce17", author: "Sara B.", initials: "SB", avatarColor: "#40e0f0", text: "I set my blue light filter to start at 3pm instead of sunset. Much better sleep.", timestamp: "3h ago", likeCount: 245 },
  ],
  te12: [
    { id: "ce22", author: "Emily R.", initials: "ER", avatarColor: "#f040a0", text: "The vinegar trick works! Did it this morning, spotless.", timestamp: "30m ago", likeCount: 89 },
    { id: "ce23", author: "Jack M.", initials: "JM", avatarColor: "#40e040", text: "Add a few drops of essential oil to the vinegar for a nice smell too.", timestamp: "1h ago", likeCount: 67 },
  ],
  te15: [
    { id: "ce28", author: "Alex P.", initials: "AP", avatarColor: "#40e0f0", text: "I ask 'will this matter in 5 years?' for big decisions, '5 minutes?' for small ones. Perfect.", timestamp: "1h ago", likeCount: 623 },
    { id: "ce29", author: "Nina W.", initials: "NW", avatarColor: "#f040a0", text: "The rubber duck method for code debugging is similar — just explaining it out loud.", timestamp: "2h ago", likeCount: 445 },
  ],
  te20: [
    { id: "ce36", author: "Leo K.", initials: "LK", avatarColor: "#40e040", text: "Overnight oats in a mason jar. Prep 5 at once Sunday night. Done for the week.", timestamp: "1h ago", likeCount: 312 },
    { id: "ce37", author: "Mia S.", initials: "MS", avatarColor: "#f0e040", text: "I freeze individual portions of smoothie ingredients in bags. Blend straight from frozen.", timestamp: "2h ago", likeCount: 267 },
  ],
  te25: [
    { id: "ce44", author: "Ryan P.", initials: "RP", avatarColor: "#40e0f0", text: "I put everything in 'Archive' instead of delete. Inbox zero every day, never lost anything.", timestamp: "3h ago", likeCount: 521 },
    { id: "ce45", author: "Sophie L.", initials: "SL", avatarColor: "#f040a0", text: "Unsubscribe from everything first. Then inbox zero is actually achievable.", timestamp: "4h ago", likeCount: 398 },
  ],
};

export const FEED_ITEMS: FeedItem[] = [
  // ===== ORIGINAL HEBREW TIPS =====
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

  // ===== ENGLISH TIPS — TECH =====
  {
    id: "te1", type: "tip", userId: "user12",
    author: "James Park", initials: "JP", avatarGradient: ["#40e0f0", "#a040f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "In any text editor, Ctrl+Z undoes — but Ctrl+Y redoes. Most people only know half the shortcut.",
    workedCount: 18400, didntWorkCount: 210, commentCount: 3, likeCount: 7800, trustScore: 99,
    isTrending: true, timestamp: "1h ago",
  },
  {
    id: "te2", type: "tip", userId: "user12",
    author: "James Park", initials: "JP", avatarGradient: ["#40e0f0", "#a040f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Use Google's 'site:' operator to search within a specific website. Example: site:reddit.com best productivity apps — way more useful than their native search.",
    workedCount: 14200, didntWorkCount: 180, commentCount: 2, likeCount: 6100, trustScore: 99,
    isTrending: true, timestamp: "3h ago",
  },
  {
    id: "te3", type: "tip", userId: "user20",
    author: "Kenji Tanaka", initials: "KT", avatarGradient: ["#a040f0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Screenshot on Mac: Cmd+Shift+4 lets you select any area. Cmd+Shift+5 gives you a full toolbar with video recording too.",
    workedCount: 9800, didntWorkCount: 145, commentCount: 2, likeCount: 4200, trustScore: 98,
    timestamp: "5h ago",
  },
  {
    id: "te4", type: "tip", userId: "user17",
    author: "Maya Patel", initials: "MP", avatarGradient: ["#f040a0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Use 'reader mode' in Safari or Firefox when reading long articles. Removes all ads, popups, and distractions. Pure text, perfect focus.",
    workedCount: 7600, didntWorkCount: 98, commentCount: 0, likeCount: 3100, trustScore: 97,
    timestamp: "8h ago",
  },
  {
    id: "te5", type: "tip", userId: "user7",
    author: "עמית ישראל", initials: "עי", avatarGradient: ["#40e0f0", "#4080f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Windows + D instantly minimizes ALL windows and shows your desktop. Windows + L locks your computer in one keystroke. Memorize these two.",
    workedCount: 11000, didntWorkCount: 130, commentCount: 3, likeCount: 5200, trustScore: 99,
    isTrending: true, timestamp: "12h ago",
  },
  {
    id: "te6", type: "tip", userId: "user12",
    author: "James Park", initials: "JP", avatarGradient: ["#40e0f0", "#a040f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "If your phone battery drains fast: go to Settings and check which apps use background refresh. Disable all the ones you don't need. Can double your battery life.",
    workedCount: 13500, didntWorkCount: 420, commentCount: 1, likeCount: 4800, trustScore: 97,
    timestamp: "1d ago",
  },
  {
    id: "te7", type: "tip", userId: "user20",
    author: "Kenji Tanaka", initials: "KT", avatarGradient: ["#a040f0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Type 'define:' before any word in Google to get an instant dictionary definition without opening a new site. Example: define:ephemeral",
    workedCount: 8900, didntWorkCount: 112, commentCount: 0, likeCount: 3700, trustScore: 98,
    timestamp: "1d ago",
  },
  {
    id: "te8", type: "tip", userId: "user17",
    author: "Maya Patel", initials: "MP", avatarGradient: ["#f040a0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Enable dark mode AND reduce screen brightness to 50% after 8pm. Your sleep quality will noticeably improve within a week. Blue light suppresses melatonin.",
    workedCount: 16700, didntWorkCount: 890, commentCount: 2, likeCount: 6900, trustScore: 97,
    isTrending: true, timestamp: "2d ago",
  },
  {
    id: "qe1", type: "question", userId: "user5",
    author: "אורי בן-דוד", initials: "אב", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "What's the best free tool for recording your screen with audio on Windows?",
    answerCount: 67, likeCount: 178, timestamp: "6h ago",
  },
  {
    id: "qe2", type: "question", userId: "user17",
    author: "Maya Patel", initials: "MP", avatarGradient: ["#f040a0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "How do you organize 10+ browser tabs without losing your mind? Any system that actually works?",
    answerCount: 112, likeCount: 345, timestamp: "1d ago",
  },

  // ===== ENGLISH TIPS — HEALTH =====
  {
    id: "th1", type: "tip", userId: "user13",
    author: "Elena Russo", initials: "ER", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Drink a full glass of water immediately when you wake up — before coffee, before your phone. Your body is dehydrated from 8 hours without water. Energy kicks in within 15 minutes.",
    workedCount: 22000, didntWorkCount: 680, commentCount: 3, likeCount: 9400, trustScore: 98,
    isTrending: true, timestamp: "2h ago",
  },
  {
    id: "th2", type: "tip", userId: "user18",
    author: "Omar Hassan", initials: "OH", avatarGradient: ["#40e0f0", "#40e040"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "If you can't fall asleep, try the 4-7-8 breathing method: inhale for 4 seconds, hold for 7, exhale for 8. Repeat 3 times. Works in under 2 minutes for most people.",
    workedCount: 19800, didntWorkCount: 1200, commentCount: 2, likeCount: 8700, trustScore: 96,
    isTrending: true, timestamp: "4h ago",
  },
  {
    id: "th3", type: "tip", userId: "user13",
    author: "Elena Russo", initials: "ER", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Put your workout clothes out the night before. That one step removes the friction that stops 90% of morning workouts before they start.",
    workedCount: 15600, didntWorkCount: 890, commentCount: 1, likeCount: 6800, trustScore: 97,
    timestamp: "7h ago",
  },
  {
    id: "th4", type: "tip", userId: "user18",
    author: "Omar Hassan", initials: "OH", avatarGradient: ["#40e0f0", "#40e040"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Walking 10 minutes after every meal significantly improves blood sugar control. You don't need a gym — just a short post-meal walk. Especially effective after dinner.",
    workedCount: 17200, didntWorkCount: 540, commentCount: 2, likeCount: 7100, trustScore: 98,
    timestamp: "10h ago",
  },
  {
    id: "th5", type: "tip", userId: "user23",
    author: "Nina Kowalski", initials: "NK", avatarGradient: ["#40e0f0", "#f040a0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Replace afternoon coffee with a 10-minute walk outside. The sunlight resets your circadian rhythm and you get a natural energy boost without the 3am insomnia.",
    workedCount: 11400, didntWorkCount: 760, commentCount: 1, likeCount: 4900, trustScore: 95,
    timestamp: "1d ago",
  },
  {
    id: "th6", type: "tip", userId: "user13",
    author: "Elena Russo", initials: "ER", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Eat your vegetables FIRST at every meal, before anything else on the plate. You eat more of them when you're hungriest, and the fiber blunts blood sugar spikes from carbs.",
    workedCount: 13800, didntWorkCount: 490, commentCount: 0, likeCount: 5600, trustScore: 98,
    timestamp: "1d ago",
  },
  {
    id: "th7", type: "tip", userId: "user18",
    author: "Omar Hassan", initials: "OH", avatarGradient: ["#40e0f0", "#40e040"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Stop eating 3 hours before bed. Your digestion disrupts deep sleep. This single change improved my sleep score by 20 points on my tracker within a week.",
    workedCount: 14900, didntWorkCount: 1100, commentCount: 2, likeCount: 6400, trustScore: 96,
    timestamp: "2d ago",
  },
  {
    id: "th8", type: "tip", userId: "user23",
    author: "Nina Kowalski", initials: "NK", avatarGradient: ["#40e0f0", "#f040a0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Keep your bedroom at 65-68°F (18-20°C). This is the scientifically optimal temperature for deep sleep. If you run hot, try cooling your feet — it drops core body temperature faster.",
    workedCount: 9800, didntWorkCount: 340, commentCount: 1, likeCount: 4200, trustScore: 97,
    timestamp: "2d ago",
  },
  {
    id: "qh1", type: "question", userId: "user9",
    author: "ליאור בר", initials: "לב", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "What's an actual effective way to stop stress eating? Not looking for willpower advice — looking for a practical system.",
    answerCount: 84, likeCount: 267, timestamp: "5h ago",
  },
  {
    id: "qh2", type: "question", userId: "user13",
    author: "Elena Russo", initials: "ER", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "How do you stay consistent with exercise when you travel frequently for work?",
    answerCount: 56, likeCount: 198, timestamp: "1d ago",
  },

  // ===== ENGLISH TIPS — FOOD =====
  {
    id: "tf1", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Salt your pasta water until it tastes like the sea. Not a little salt — a lot. This is the only chance to season the pasta itself, not just the sauce.",
    workedCount: 21000, didntWorkCount: 890, commentCount: 2, likeCount: 9100, trustScore: 99,
    isTrending: true, timestamp: "1h ago",
  },
  {
    id: "tf2", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Let meat rest for half the time it cooked before cutting. A 20-minute steak needs 10 minutes rest. Cut too early and all the juices pour out onto the board.",
    workedCount: 16800, didntWorkCount: 540, commentCount: 1, likeCount: 7200, trustScore: 99,
    timestamp: "3h ago",
  },
  {
    id: "tf3", type: "tip", userId: "user21",
    author: "Fatima Al-Rashid", initials: "FA", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Freeze fresh herbs in olive oil in an ice cube tray. Pop one into a pan whenever you cook — instant fresh herb flavor all year long, even in winter.",
    workedCount: 13400, didntWorkCount: 290, commentCount: 2, likeCount: 5800, trustScore: 98,
    timestamp: "5h ago",
  },
  {
    id: "tf4", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Add a small pinch of salt to your coffee grounds before brewing. It removes bitterness without making it taste salty. Works even better with cheap coffee.",
    workedCount: 18900, didntWorkCount: 2100, commentCount: 1, likeCount: 8100, trustScore: 97,
    isTrending: true, timestamp: "8h ago",
  },
  {
    id: "tf5", type: "tip", userId: "user21",
    author: "Fatima Al-Rashid", initials: "FA", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Store tomatoes at room temperature with the stem side down. The stem end is the entry point for bacteria. This alone doubles their shelf life.",
    workedCount: 14200, didntWorkCount: 380, commentCount: 0, likeCount: 6100, trustScore: 98,
    timestamp: "12h ago",
  },
  {
    id: "tf6", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "If a recipe calls for buttermilk and you don't have any: add 1 tablespoon of lemon juice or white vinegar to 1 cup of regular milk. Wait 5 minutes. Instant buttermilk.",
    workedCount: 11700, didntWorkCount: 240, commentCount: 1, likeCount: 5100, trustScore: 99,
    timestamp: "1d ago",
  },
  {
    id: "tf7", type: "tip", userId: "user21",
    author: "Fatima Al-Rashid", initials: "FA", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Peel garlic in 10 seconds: place the clove under the flat side of a knife, give it one firm press. The skin slides right off. No more fumbling with papery peels.",
    workedCount: 23400, didntWorkCount: 670, commentCount: 2, likeCount: 10200, trustScore: 99,
    isTrending: true, timestamp: "1d ago",
  },
  {
    id: "tf8", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Keep a Parmesan rind in your freezer. Drop it into soups, stews, or sauces while cooking. It melts in and adds a deep, savory richness that's impossible to replicate.",
    workedCount: 9800, didntWorkCount: 180, commentCount: 0, likeCount: 4400, trustScore: 98,
    timestamp: "2d ago",
  },
  {
    id: "tf9", type: "tip", userId: "user21",
    author: "Fatima Al-Rashid", initials: "FA", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Ripen bananas in 15 minutes: place unpeeled bananas on a baking sheet at 300°F/150°C until the skin turns black. They'll be perfectly sweet and soft inside.",
    workedCount: 12600, didntWorkCount: 890, commentCount: 1, likeCount: 5400, trustScore: 96,
    timestamp: "2d ago",
  },
  {
    id: "qf1", type: "question", userId: "user2",
    author: "דן לוי", initials: "דל", avatarGradient: ["#40e0f0", "#4080f0"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "What's your actual go-to meal when you need to cook something impressive in under 30 minutes?",
    answerCount: 134, likeCount: 456, timestamp: "2h ago",
  },
  {
    id: "qf2", type: "question", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "How do you make vegetables taste good enough that kids actually eat them without hiding them in something?",
    answerCount: 89, likeCount: 312, timestamp: "8h ago",
  },

  // ===== ENGLISH TIPS — BUSINESS =====
  {
    id: "tb1", type: "tip", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "When someone says 'I'll think about it,' ask 'What specific information would help you decide?' — it turns a vague stall into a real conversation about objections you can actually address.",
    workedCount: 13800, didntWorkCount: 890, commentCount: 2, likeCount: 6200, trustScore: 96,
    isTrending: true, timestamp: "3h ago",
  },
  {
    id: "tb2", type: "tip", userId: "user22",
    author: "Diego García", initials: "DG", avatarGradient: ["#40e040", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Send a follow-up email 48 hours after any meeting with a bullet-point summary of decisions made and next steps. Most dropped balls happen because nobody wrote anything down.",
    workedCount: 11200, didntWorkCount: 340, commentCount: 1, likeCount: 4900, trustScore: 97,
    timestamp: "6h ago",
  },
  {
    id: "tb3", type: "tip", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Raise your prices by 20% and lose 15% of clients. You'll work less, earn more, and the clients who stay are usually the best ones. Most freelancers are dramatically undercharging.",
    workedCount: 9400, didntWorkCount: 1800, commentCount: 2, likeCount: 4100, trustScore: 94,
    timestamp: "9h ago",
  },
  {
    id: "tb4", type: "tip", userId: "user3",
    author: "רון אבי", initials: "רא", avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Start every presentation with the conclusion, then explain why. Most people bury the lead. Your audience will stay engaged when they know what you're building toward.",
    workedCount: 14600, didntWorkCount: 430, commentCount: 1, likeCount: 6300, trustScore: 97,
    isTrending: true, timestamp: "12h ago",
  },
  {
    id: "tb5", type: "tip", userId: "user22",
    author: "Diego García", initials: "DG", avatarGradient: ["#40e040", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Block 90-minute focus sessions in your calendar and treat them like client meetings — non-negotiable. Deep work on your hardest problem first, before email, before Slack.",
    workedCount: 12900, didntWorkCount: 560, commentCount: 0, likeCount: 5600, trustScore: 97,
    timestamp: "1d ago",
  },
  {
    id: "tb6", type: "tip", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Reply to emails with 5 sentences or fewer. This constraint forces clarity and saves everyone time. If it needs more — it should be a call. Write '5-sentence policy' in your email footer.",
    workedCount: 8700, didntWorkCount: 450, commentCount: 2, likeCount: 3800, trustScore: 96,
    timestamp: "1d ago",
  },
  {
    id: "tb7", type: "tip", userId: "user3",
    author: "רון אבי", initials: "רא", avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "After any rejection, ask 'What would need to be different for you to say yes?' The answer either gives you a path forward or tells you to move on. Both are valuable.",
    workedCount: 11300, didntWorkCount: 670, commentCount: 1, likeCount: 4900, trustScore: 97,
    timestamp: "2d ago",
  },
  {
    id: "tb8", type: "tip", userId: "user22",
    author: "Diego García", initials: "DG", avatarGradient: ["#40e040", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Use the subject line 'Following up — [original subject]' instead of 'Following up.' Reminds them of context immediately and doubles your response rate.",
    workedCount: 9100, didntWorkCount: 280, commentCount: 0, likeCount: 4000, trustScore: 96,
    timestamp: "2d ago",
  },
  {
    id: "qb1", type: "question", userId: "user8",
    author: "יעל גולן", initials: "יג", avatarGradient: ["#f040a0", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "How do you politely decline a project that's clearly going to be a nightmare client without burning the relationship?",
    answerCount: 72, likeCount: 289, timestamp: "4h ago",
  },
  {
    id: "qb2", type: "question", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "What's the best way to negotiate salary when you already have a number in your head but the HR asks you to give a number first?",
    answerCount: 98, likeCount: 412, timestamp: "10h ago",
  },

  // ===== ENGLISH TIPS — HOME =====
  {
    id: "to1", type: "tip", userId: "user11",
    author: "Sarah Mitchell", initials: "SM", avatarGradient: ["#f0e040", "#40e040"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Clean your microwave with zero scrubbing: fill a bowl with water and a sliced lemon, microwave for 3 minutes, then wipe. Steam loosens everything and the lemon neutralizes odors.",
    workedCount: 24600, didntWorkCount: 410, commentCount: 2, likeCount: 10800, trustScore: 99,
    isTrending: true, timestamp: "2h ago",
  },
  {
    id: "to2", type: "tip", userId: "user19",
    author: "Sophie Dubois", initials: "SD", avatarGradient: ["#f0e040", "#a040f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Use a rubber band around a paint can to wipe your brush — instead of the rim. The rim stays clean, the lid seals properly, and you stop dripping on the floor.",
    workedCount: 17800, didntWorkCount: 230, commentCount: 1, likeCount: 7600, trustScore: 99,
    timestamp: "4h ago",
  },
  {
    id: "to3", type: "tip", userId: "user25",
    author: "Rin Yamamoto", initials: "RY", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "The Japanese 'one in, one out' rule: before bringing anything new into your home, you remove one item. This stops clutter from accumulating without any additional effort.",
    workedCount: 14200, didntWorkCount: 890, commentCount: 2, likeCount: 6100, trustScore: 97,
    timestamp: "7h ago",
  },
  {
    id: "to4", type: "tip", userId: "user11",
    author: "Sarah Mitchell", initials: "SM", avatarGradient: ["#f0e040", "#40e040"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Clean your shower while you're IN it, at the end of your shower. Just a quick wipe with a squeegee or cloth. 30 seconds. Prevents soap scum and mold from ever building up.",
    workedCount: 19400, didntWorkCount: 560, commentCount: 1, likeCount: 8400, trustScore: 98,
    timestamp: "10h ago",
  },
  {
    id: "to5", type: "tip", userId: "user19",
    author: "Sophie Dubois", initials: "SD", avatarGradient: ["#f0e040", "#a040f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Put a bread clip under furniture legs that scratch hardwood floors. Free, invisible, and works better than felt pads that fall off after a month.",
    workedCount: 11600, didntWorkCount: 780, commentCount: 0, likeCount: 5100, trustScore: 95,
    timestamp: "1d ago",
  },
  {
    id: "to6", type: "tip", userId: "user25",
    author: "Rin Yamamoto", initials: "RY", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Make your bed immediately when you get up — before you do anything else. It takes 2 minutes and anchors your entire day. A made bed makes the whole room feel tidy.",
    workedCount: 16700, didntWorkCount: 1200, commentCount: 2, likeCount: 7200, trustScore: 96,
    timestamp: "1d ago",
  },
  {
    id: "to7", type: "tip", userId: "user11",
    author: "Sarah Mitchell", initials: "SM", avatarGradient: ["#f0e040", "#40e040"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "To stop a squeaky door hinge: rub a bar of soap, petroleum jelly, or even a candle wax along the hinge pin. Works instantly, lasts months. No WD-40 needed.",
    workedCount: 13400, didntWorkCount: 290, commentCount: 1, likeCount: 5800, trustScore: 98,
    timestamp: "2d ago",
  },
  {
    id: "to8", type: "tip", userId: "user19",
    author: "Sophie Dubois", initials: "SD", avatarGradient: ["#f0e040", "#a040f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Store bed sheets inside one of their own pillowcases. No more linen closet chaos — everything for that bed is in one neat package that's easy to find and put away.",
    workedCount: 21300, didntWorkCount: 340, commentCount: 2, likeCount: 9200, trustScore: 99,
    isTrending: true, timestamp: "2d ago",
  },
  {
    id: "qo1", type: "question", userId: "user6",
    author: "נועה כץ", initials: "נכ", avatarGradient: ["#f0e040", "#f0a040"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "What's the most effective way to actually get yourself to clean your home regularly when you hate cleaning?",
    answerCount: 103, likeCount: 387, timestamp: "3h ago",
  },

  // ===== ENGLISH TIPS — NATURE =====
  {
    id: "tn1", type: "tip", userId: "user16",
    author: "Luca Bianchi", initials: "LB", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "Water plants in the morning, not evening. Morning water reaches roots before the heat. Evening watering leaves moisture on leaves overnight, which causes fungal disease.",
    workedCount: 12800, didntWorkCount: 670, commentCount: 1, likeCount: 5600, trustScore: 96,
    timestamp: "3h ago",
  },
  {
    id: "tn2", type: "tip", userId: "user24",
    author: "Tom Watson", initials: "TW", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "Put your finger 2 inches into the soil before watering houseplants. If it's still moist, don't water. Overwatering kills more plants than underwatering.",
    workedCount: 16400, didntWorkCount: 540, commentCount: 2, likeCount: 7100, trustScore: 98,
    isTrending: true, timestamp: "6h ago",
  },
  {
    id: "tn3", type: "tip", userId: "user16",
    author: "Luca Bianchi", initials: "LB", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "Spend at least 20 minutes in natural light before noon. This sets your cortisol and melatonin rhythms for the rest of the day. Better energy, better sleep — all from light.",
    workedCount: 14900, didntWorkCount: 890, commentCount: 2, likeCount: 6400, trustScore: 96,
    timestamp: "9h ago",
  },
  {
    id: "tn4", type: "tip", userId: "user24",
    author: "Tom Watson", initials: "TW", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "Used coffee grounds are an excellent fertilizer for acid-loving plants like roses, tomatoes, and blueberries. Don't throw them — mix into the soil directly.",
    workedCount: 11200, didntWorkCount: 380, commentCount: 1, likeCount: 4800, trustScore: 97,
    timestamp: "1d ago",
  },
  {
    id: "tn5", type: "tip", userId: "user16",
    author: "Luca Bianchi", initials: "LB", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "To remove a splinter easily: apply white glue to the area, let it dry, then peel it off. The splinter usually comes right with it. No needles, no pain.",
    workedCount: 18700, didntWorkCount: 2100, commentCount: 1, likeCount: 8000, trustScore: 95,
    timestamp: "1d ago",
  },
  {
    id: "tn6", type: "tip", userId: "user24",
    author: "Tom Watson", initials: "TW", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "Put pebbles in your plant saucers and fill with water. As water evaporates, it creates humidity around your plants. Most indoor plants thrive in humidity — your home is usually too dry.",
    workedCount: 9600, didntWorkCount: 290, commentCount: 0, likeCount: 4100, trustScore: 97,
    timestamp: "2d ago",
  },
  {
    id: "qn1", type: "question", userId: "user10",
    author: "גיא אלון", initials: "גא", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "What's the easiest edible plant to grow indoors for beginners with zero gardening experience?",
    answerCount: 78, likeCount: 234, timestamp: "7h ago",
  },

  // ===== MORE ENGLISH TIPS — MIXED =====
  {
    id: "tm1", type: "tip", userId: "user12",
    author: "James Park", initials: "JP", avatarGradient: ["#40e0f0", "#a040f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Use Ctrl+F to find text on any webpage, PDF, or document — including job listings and contracts. Search for keywords like 'remote', 'salary', or 'benefits' instead of reading everything.",
    workedCount: 15700, didntWorkCount: 180, commentCount: 2, likeCount: 6800, trustScore: 99,
    timestamp: "15h ago",
  },
  {
    id: "tm2", type: "tip", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "The 2-minute rule: if a task takes less than 2 minutes, do it immediately — don't schedule it, don't put it on a list. The mental overhead of tracking small tasks costs more than doing them.",
    workedCount: 19800, didntWorkCount: 1200, commentCount: 3, likeCount: 8600, trustScore: 97,
    isTrending: true, timestamp: "18h ago",
  },
  {
    id: "tm3", type: "tip", userId: "user13",
    author: "Elena Russo", initials: "ER", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "When you feel anxious, name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste. The '5-4-3-2-1' grounding technique interrupts anxiety spirals instantly.",
    workedCount: 22100, didntWorkCount: 980, commentCount: 2, likeCount: 9700, trustScore: 98,
    isTrending: true, timestamp: "20h ago",
  },
  {
    id: "tm4", type: "tip", userId: "user11",
    author: "Sarah Mitchell", initials: "SM", avatarGradient: ["#f0e040", "#40e040"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Dryer sheets repel mosquitoes. Put one in your pocket when going outside in summer. Tested by multiple studies. Works for about an hour.",
    workedCount: 13400, didntWorkCount: 3200, commentCount: 1, likeCount: 5700, trustScore: 91,
    timestamp: "22h ago",
  },
  {
    id: "tm5", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Meal prep doesn't have to mean full meals. Just prep ingredients: chop all your vegetables Sunday, cook a big batch of grains, portion your proteins. Assembly is then 5 minutes any night.",
    workedCount: 17800, didntWorkCount: 560, commentCount: 3, likeCount: 7700, trustScore: 98,
    isTrending: true, timestamp: "1d ago",
  },
  {
    id: "tm6", type: "tip", userId: "user18",
    author: "Omar Hassan", initials: "OH", avatarGradient: ["#40e0f0", "#40e040"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Do 10 pushups every morning before you check your phone. That's the rule. 10 pushups first. After 30 days it becomes automatic, and you'll have done 300 pushups that month.",
    workedCount: 14600, didntWorkCount: 2100, commentCount: 2, likeCount: 6300, trustScore: 95,
    timestamp: "1d ago",
  },
  {
    id: "tm7", type: "tip", userId: "user20",
    author: "Kenji Tanaka", initials: "KT", avatarGradient: ["#a040f0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Create a 'parking lot' document for ideas that come up during focused work. Write it down, close it, and get back to what you were doing. Your brain stops worrying once the idea is captured.",
    workedCount: 11900, didntWorkCount: 340, commentCount: 1, likeCount: 5200, trustScore: 97,
    timestamp: "2d ago",
  },
  {
    id: "tm8", type: "tip", userId: "user25",
    author: "Rin Yamamoto", initials: "RY", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Every item in your home should have a 'home' — a specific place where it always lives. When you take it out, you return it there. No more searching for keys, glasses, or remotes.",
    workedCount: 16200, didntWorkCount: 780, commentCount: 2, likeCount: 7000, trustScore: 97,
    timestamp: "2d ago",
  },
  {
    id: "tm9", type: "tip", userId: "user16",
    author: "Luca Bianchi", initials: "LB", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "A 10-minute walk in nature (not the gym, not the street — actual nature with trees) reduces cortisol by up to 15% in clinical studies. Schedule it like a meeting.",
    workedCount: 13700, didntWorkCount: 540, commentCount: 1, likeCount: 5900, trustScore: 97,
    timestamp: "3d ago",
  },
  {
    id: "tm10", type: "tip", userId: "user22",
    author: "Diego García", initials: "DG", avatarGradient: ["#40e040", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Before any negotiation, write down your BATNA — Best Alternative To a Negotiated Agreement. Knowing your walkaway option removes desperation from your voice. You'll negotiate from strength.",
    workedCount: 8900, didntWorkCount: 430, commentCount: 1, likeCount: 3900, trustScore: 96,
    timestamp: "3d ago",
  },
  {
    id: "tm11", type: "tip", userId: "user23",
    author: "Nina Kowalski", initials: "NK", avatarGradient: ["#40e0f0", "#f040a0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Track what you eat for just 7 days — not to diet, just to see. Most people are shocked by what they actually eat vs. what they think they eat. Awareness alone changes habits.",
    workedCount: 12400, didntWorkCount: 890, commentCount: 1, likeCount: 5400, trustScore: 95,
    timestamp: "3d ago",
  },
  {
    id: "tm12", type: "tip", userId: "user24",
    author: "Tom Watson", initials: "TW", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "To remove a bee sting: don't squeeze with tweezers — scrape it out sideways with a card or your fingernail. Squeezing injects more venom. Scraping removes it clean.",
    workedCount: 21400, didntWorkCount: 340, commentCount: 2, likeCount: 9300, trustScore: 99,
    isTrending: true, timestamp: "3d ago",
  },
  {
    id: "tm13", type: "tip", userId: "user12",
    author: "James Park", initials: "JP", avatarGradient: ["#40e0f0", "#a040f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Use Google Lens (or your phone camera search) to instantly look up any plant, landmark, business sign, or dog breed. Point and hold. The days of not knowing what something is are over.",
    workedCount: 16800, didntWorkCount: 450, commentCount: 2, likeCount: 7300, trustScore: 98,
    timestamp: "3d ago",
  },
  {
    id: "tm14", type: "tip", userId: "user19",
    author: "Sophie Dubois", initials: "SD", avatarGradient: ["#f0e040", "#a040f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Use a tension rod under the kitchen sink to hang cleaning spray bottles. Doubles the storage space in your cleaning cabinet without any drilling or installation.",
    workedCount: 18900, didntWorkCount: 280, commentCount: 1, likeCount: 8200, trustScore: 99,
    isTrending: true, timestamp: "4d ago",
  },
  {
    id: "tm15", type: "tip", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "When making any decision, ask 'what would I advise a friend to do in this situation?' You'll instantly think more clearly. We're terrible at decisions for ourselves but great at decisions for others.",
    workedCount: 14300, didntWorkCount: 670, commentCount: 2, likeCount: 6200, trustScore: 97,
    isTrending: true, timestamp: "4d ago",
  },
  {
    id: "tm16", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Scrambled eggs: cook on the LOWEST heat possible, stirring constantly, removing from heat every 30 seconds. Takes 5 minutes instead of 2 but the result is creamy, never rubbery.",
    workedCount: 13100, didntWorkCount: 980, commentCount: 1, likeCount: 5700, trustScore: 96,
    timestamp: "4d ago",
  },
  {
    id: "tm17", type: "tip", userId: "user17",
    author: "Maya Patel", initials: "MP", avatarGradient: ["#f040a0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "Hold the spacebar on your phone keyboard to turn it into a trackpad. Drag left/right to precisely position your cursor. Works on iPhone and most Android keyboards. Saves enormous frustration.",
    workedCount: 24700, didntWorkCount: 560, commentCount: 2, likeCount: 10900, trustScore: 99,
    isTrending: true, timestamp: "4d ago",
  },
  {
    id: "tm18", type: "tip", userId: "user13",
    author: "Elena Russo", initials: "ER", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Before a high-stakes conversation, hold a 'power pose' for 2 minutes — hands on hips, chin up, standing tall. Research shows it measurably lowers cortisol and raises confidence.",
    workedCount: 11700, didntWorkCount: 2300, commentCount: 2, likeCount: 5100, trustScore: 93,
    timestamp: "5d ago",
  },
  {
    id: "tm19", type: "tip", userId: "user21",
    author: "Fatima Al-Rashid", initials: "FA", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "To prevent onions from making you cry: chill the onion in the freezer for 15 minutes before cutting. Cold temperature reduces the release of the sulfur compounds that irritate your eyes.",
    workedCount: 19200, didntWorkCount: 1400, commentCount: 1, likeCount: 8300, trustScore: 96,
    timestamp: "5d ago",
  },
  {
    id: "tm20", type: "tip", userId: "user25",
    author: "Rin Yamamoto", initials: "RY", avatarGradient: ["#f0e040", "#40e0f0"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "The 5-second declutter rule: if you've walked past something 5 times thinking 'I should deal with that,' deal with it now. It takes 30 seconds. Waiting takes mental energy every time you see it.",
    workedCount: 12900, didntWorkCount: 560, commentCount: 2, likeCount: 5600, trustScore: 97,
    timestamp: "5d ago",
  },
  {
    id: "tm21", type: "tip", userId: "user18",
    author: "Omar Hassan", initials: "OH", avatarGradient: ["#40e0f0", "#40e040"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Chew each bite 20-30 times instead of 5-10. Digestion starts in your mouth — properly chewed food is absorbed more efficiently and you feel full on less food. Easy to practice, hard to forget.",
    workedCount: 10800, didntWorkCount: 890, commentCount: 1, likeCount: 4700, trustScore: 95,
    timestamp: "5d ago",
  },
  {
    id: "tm22", type: "tip", userId: "user20",
    author: "Kenji Tanaka", initials: "KT", avatarGradient: ["#a040f0", "#40e0f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "On iPhone: triple-click the side button to enable Guided Access and lock the phone to one app. Great for giving your phone to kids without them going anywhere else.",
    workedCount: 13500, didntWorkCount: 450, commentCount: 1, likeCount: 5900, trustScore: 97,
    timestamp: "6d ago",
  },
  {
    id: "tm23", type: "tip", userId: "user16",
    author: "Luca Bianchi", initials: "LB", avatarGradient: ["#40e040", "#f0e040"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "To get rid of ants naturally: spray a mixture of equal parts white vinegar and water where you see them. Destroys their scent trails. They won't come back to that path.",
    workedCount: 16400, didntWorkCount: 1800, commentCount: 1, likeCount: 7100, trustScore: 94,
    timestamp: "6d ago",
  },
  {
    id: "tm24", type: "tip", userId: "user22",
    author: "Diego García", initials: "DG", avatarGradient: ["#40e040", "#a040f0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "When your to-do list feels overwhelming: write down everything, then ask 'what's the ONE thing that if done today would make everything else easier or unnecessary?' Do only that.",
    workedCount: 17100, didntWorkCount: 670, commentCount: 2, likeCount: 7400, trustScore: 97,
    isTrending: true, timestamp: "6d ago",
  },
  {
    id: "tm25", type: "tip", userId: "user11",
    author: "Sarah Mitchell", initials: "SM", avatarGradient: ["#f0e040", "#40e040"] as const,
    category: "Home", categoryIcon: "home", categoryId: "home",
    text: "Unclog a drain without chemicals: pour half a cup of baking soda, then half a cup of white vinegar. Cover and wait 15 minutes. Flush with boiling water. Works on 80% of clogs.",
    workedCount: 20100, didntWorkCount: 2400, commentCount: 2, likeCount: 8700, trustScore: 96,
    timestamp: "1w ago",
  },
  {
    id: "tm26", type: "tip", userId: "user23",
    author: "Nina Kowalski", initials: "NK", avatarGradient: ["#40e0f0", "#f040a0"] as const,
    category: "Health", categoryIcon: "heart", categoryId: "health",
    text: "Set a 20-minute timer when you feel like snacking. True hunger persists; cravings usually pass. If you're still hungry after 20 minutes, eat. Most of the time the craving is gone.",
    workedCount: 14200, didntWorkCount: 1100, commentCount: 1, likeCount: 6100, trustScore: 96,
    timestamp: "1w ago",
  },
  {
    id: "tm27", type: "tip", userId: "user14",
    author: "Carlos Mendez", initials: "CM", avatarGradient: ["#f040a0", "#f0e040"] as const,
    category: "Food", categoryIcon: "coffee", categoryId: "food",
    text: "Freeze grapes and use them as ice cubes in wine. They keep it cold without diluting it, and they taste delicious when you fish them out at the end.",
    workedCount: 16800, didntWorkCount: 430, commentCount: 2, likeCount: 7300, trustScore: 98,
    timestamp: "1w ago",
  },
  {
    id: "tm28", type: "tip", userId: "user15",
    author: "Aisha Johnson", initials: "AJ", avatarGradient: ["#f0e040", "#f040a0"] as const,
    category: "Business", categoryIcon: "briefcase", categoryId: "business",
    text: "Batch all your meetings to 2-3 days a week. Keep the other days meeting-free for deep work. Your output will increase dramatically and your calendar stress will disappear.",
    workedCount: 11400, didntWorkCount: 780, commentCount: 1, likeCount: 4900, trustScore: 96,
    timestamp: "1w ago",
  },
  {
    id: "tm29", type: "tip", userId: "user24",
    author: "Tom Watson", initials: "TW", avatarGradient: ["#40e040", "#40e0f0"] as const,
    category: "Nature", categoryIcon: "sun", categoryId: "nature",
    text: "To keep cut flowers fresh longer: add a crushed aspirin and a teaspoon of sugar to the water. The aspirin lowers pH to fight bacteria; the sugar feeds the flowers. Lasts twice as long.",
    workedCount: 13900, didntWorkCount: 890, commentCount: 1, likeCount: 6000, trustScore: 96,
    timestamp: "1w ago",
  },
  {
    id: "tm30", type: "tip", userId: "user12",
    author: "James Park", initials: "JP", avatarGradient: ["#40e0f0", "#a040f0"] as const,
    category: "Technology", categoryIcon: "cpu", categoryId: "tech",
    text: "You can paste text WITHOUT its formatting by pressing Ctrl+Shift+V (Windows) or Cmd+Shift+V (Mac) in most apps. Stops accidentally importing someone else's font into your document forever.",
    workedCount: 19300, didntWorkCount: 340, commentCount: 2, likeCount: 8400, trustScore: 99,
    isTrending: true, timestamp: "1w ago",
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
