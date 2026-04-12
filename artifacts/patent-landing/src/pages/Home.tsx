import { useEffect, useRef } from "react";

function HeroSection() {
  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-16 relative overflow-hidden"
      style={{ background: "#0a0a0f" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(240,224,64,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 60% 80% at 80% 70%, rgba(64,224,240,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 50% 50% at 50% 100%, rgba(240,64,160,0.06) 0%, transparent 60%)
          `,
        }}
      />

      <div
        className="inline-block mb-8 px-5 py-1.5 rounded-full text-xs tracking-widest uppercase"
        style={{
          background: "rgba(240,224,64,0.12)",
          border: "1px solid rgba(240,224,64,0.3)",
          color: "#f0e040",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "3px",
        }}
        data-testid="hero-tag"
      >
        תכנון מוצר מלא · 2025
      </div>

      <h1
        className="patent-hero-gradient mb-6"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "clamp(64px, 14vw, 140px)",
          fontWeight: 800,
          letterSpacing: "-4px",
          lineHeight: 0.9,
        }}
        data-testid="hero-title"
      >
        Patent
      </h1>

      <p
        className="text-xl mb-12 max-w-lg font-light"
        style={{ color: "#7070a0" }}
        data-testid="hero-subtitle"
      >
        הרשת החברתית של הידע היומיומי — שתף, שאל, אמת.
      </p>

      <div className="flex gap-3 flex-wrap justify-center" data-testid="hero-badges">
        {[
          "📱 Mobile First",
          "🌍 גלובלי",
          "🤖 AI-Powered",
          "✅ אימות קולקטיבי",
        ].map((badge) => (
          <span
            key={badge}
            className="px-5 py-2 rounded-full text-sm"
            style={{
              background: "#1c1c27",
              border: "1px solid #2a2a3a",
              color: "#7070a0",
            }}
            data-testid={`badge-${badge}`}
          >
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}

function Divider() {
  return (
    <div
      className="mx-6"
      style={{
        height: "1px",
        background: "linear-gradient(90deg, transparent, #2a2a3a, transparent)",
      }}
    />
  );
}

function ConceptSection() {
  const cards = [
    {
      icon: "💡",
      title: "נותן טיפ",
      desc: "מעלה טיפ קצר שגילה — בטקסט, תמונה, או וידאו קצר. הקהל מאמת אם זה עובד באמת. ככל שהטיפ עוזר לאנשים — כך עולה הדירוג שלך.",
      gradient: "linear-gradient(90deg, #f0e040, #f0a040)",
    },
    {
      icon: "❓",
      title: "מבקש פתרון",
      desc: "מעלה בעיה שאין לו עליה תשובה. הקהל עונה. התשובות הכי טובות עולות למעלה ונהפכות לטיפים רשמיים בפלטפורמה — עם קרדיט למי שענה.",
      gradient: "linear-gradient(90deg, #40e0f0, #4080f0)",
    },
    {
      icon: "✅",
      title: "מאמת קהל",
      desc: "כל טיפ מקבל הצבעות \"עבד לי / לא עבד לי\". זה הופך את Patent מרשת של דעות — לרשת של עובדות שנבדקו על ידי אנשים אמיתיים.",
      gradient: "linear-gradient(90deg, #f040a0, #a040f0)",
    },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-6 py-20"
      style={{ background: "#0a0a0f" }}
      data-testid="concept-section"
    >
      <div className="patent-section-label">הקונספט</div>
      <h2
        className="patent-section-title"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8" }}
      >
        שני סוגי משתמשים.
        <br />
        מעגל אחד מושלם.
      </h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        {cards.map((card, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl p-8 transition-all duration-300"
            style={{
              background: "#13131a",
              border: "1px solid #2a2a3a",
            }}
            data-testid={`concept-card-${i}`}
          >
            <div
              className="absolute top-0 left-0 right-0"
              style={{ height: "2px", background: card.gradient }}
            />
            <span className="text-4xl mb-4 block">{card.icon}</span>
            <div
              className="text-lg font-bold mb-2.5"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f0f8" }}
            >
              {card.title}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <section
      style={{
        background: "#13131a",
        borderTop: "1px solid #2a2a3a",
        borderBottom: "1px solid #2a2a3a",
        padding: "80px 24px",
      }}
      data-testid="mockup-section"
    >
      <div
        className="max-w-6xl mx-auto grid gap-16 items-start"
        style={{ gridTemplateColumns: "1fr 340px" }}
      >
        <div>
          <div className="patent-section-label">עיצוב האפליקציה</div>
          <h2
            className="patent-section-title"
            style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8", marginBottom: "24px" }}
          >
            כך זה נראה
            <br />
            בפועל.
          </h2>
          <p className="mb-6 leading-relaxed" style={{ color: "#7070a0", fontSize: "15px" }}>
            הממשק בנוי סביב פיד אנכי נקי. כל כרטיס הוא עולם קטן — טיפ, אימות, וקטגוריה. הניווט תחתי, FAB מרכזי לפרסום חדש.
          </p>

          <div className="flex flex-col gap-3">
            {[
              { bg: "rgba(240,224,64,0.15)", border: "rgba(240,224,64,0.3)", icon: "💡", text: "כרטיסי טיפ עם ציון אמינות חי" },
              { bg: "rgba(64,224,240,0.12)", border: "rgba(64,224,240,0.3)", icon: "❓", text: "כרטיסי שאלה בצבע שונה לאבחנה מהירה" },
              { bg: "rgba(240,64,160,0.12)", border: "rgba(240,64,160,0.3)", icon: "🔥", text: "טרנדינג יומי — הטיפ הכי מאומת ב-24 שעות" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3" data-testid={`feature-bullet-${i}`}>
                <div
                  className="flex-shrink-0 flex items-center justify-center text-base rounded-full"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: item.bg,
                    border: `1px solid ${item.border}`,
                  }}
                >
                  {item.icon}
                </div>
                <div className="text-sm" style={{ color: "#7070a0" }}>{item.text}</div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-[44px] relative"
          style={{
            width: "320px",
            margin: "0 auto",
            background: "#0d0d14",
            border: "2px solid #2a2a3a",
            padding: "16px",
            boxShadow: "0 0 0 1px #1a1a28, 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
          data-testid="phone-mockup"
        >
          <div
            className="mx-auto mb-3"
            style={{
              width: "100px",
              height: "28px",
              background: "#0d0d14",
              borderRadius: "0 0 20px 20px",
              border: "2px solid #2a2a3a",
              borderTop: "none",
            }}
          />

          <div
            className="overflow-hidden"
            style={{
              background: "#0a0a0f",
              borderRadius: "32px",
              minHeight: "580px",
            }}
          >
            <div
              className="sticky top-0 flex items-center justify-between px-4 py-3"
              style={{
                background: "rgba(10,10,15,0.95)",
                borderBottom: "1px solid #1c1c27",
                backdropFilter: "blur(10px)",
              }}
            >
              <span
                className="text-2xl font-black"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  background: "linear-gradient(135deg, #f0e040, #40e0f0)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Patent
              </span>
              <div className="flex gap-3 text-base">🔔 🔍</div>
            </div>

            <div
              className="flex px-4 py-2.5 gap-1.5"
              style={{ borderBottom: "1px solid #1c1c27" }}
            >
              {["הכל", "בית", "אוכל", "עסקים"].map((tab, i) => (
                <div
                  key={tab}
                  className="px-3.5 py-1 rounded-full text-[11px]"
                  style={
                    i === 0
                      ? {
                          background: "rgba(240,224,64,0.15)",
                          border: "1px solid rgba(240,224,64,0.4)",
                          color: "#f0e040",
                        }
                      : {
                          color: "#7070a0",
                          border: "1px solid #2a2a3a",
                        }
                  }
                >
                  {tab}
                </div>
              ))}
            </div>

            <div
              className="mx-3 my-2.5 rounded-2xl p-3.5"
              style={{
                background: "#13131a",
                border: "1px solid #2a2a3a",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #f0e040, #40e0f0)",
                    color: "#0a0a0f",
                  }}
                >
                  מל
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold" style={{ color: "#d0d0e0" }}>מלי כהן</div>
                  <div className="text-[9px]" style={{ color: "#7070a0" }}>🏠 בית</div>
                </div>
                <div
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(240,224,64,0.15)",
                    color: "#f0e040",
                    border: "1px solid rgba(240,224,64,0.3)",
                  }}
                >
                  ✅ 94%
                </div>
              </div>
              <div className="text-[12px] leading-snug mb-2.5" style={{ color: "#c0c0d8" }}>
                שים גרעין אבוקדו במים עם האבוקדו החתוך — לא ישחיר גם 3 שעות אחרי.
              </div>
              <div className="flex gap-2 items-center">
                <div
                  className="flex-1 rounded-lg py-1 text-center text-[10px]"
                  style={{
                    background: "rgba(64,224,64,0.12)",
                    border: "1px solid rgba(64,224,64,0.3)",
                    color: "#40e040",
                  }}
                >
                  ✅ עבד לי (2.4k)
                </div>
                <div
                  className="flex-1 rounded-lg py-1 text-center text-[10px]"
                  style={{
                    background: "rgba(240,64,64,0.1)",
                    border: "1px solid rgba(240,64,64,0.25)",
                    color: "#f04040",
                  }}
                >
                  ❌ לא עבד (142)
                </div>
                <div className="text-[10px]" style={{ color: "#7070a0" }}>💬 38</div>
              </div>
            </div>

            <div
              className="mx-3 mb-2.5 rounded-2xl p-3.5"
              style={{
                background: "#13131a",
                border: "1px solid rgba(64,224,240,0.2)",
              }}
            >
              <div className="text-[9px] tracking-widest uppercase mb-1.5" style={{ color: "#40e0f0" }}>❓ מחפש פתרון</div>
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #40e0f0, #4080f0)",
                    color: "#0a0a0f",
                  }}
                >
                  דן
                </div>
                <div>
                  <div className="text-[11px] font-semibold" style={{ color: "#d0d0e0" }}>דן לוי</div>
                  <div className="text-[9px]" style={{ color: "#7070a0" }}>🍕 אוכל</div>
                </div>
              </div>
              <div className="text-[12px] leading-snug mb-2" style={{ color: "#c0c0d8" }}>
                איך שומרים על תות שדה טרי יותר מיום אחד בלי שיתעפש?
              </div>
              <div
                className="inline-block px-3 py-1 rounded-lg text-[10px]"
                style={{
                  background: "rgba(64,224,240,0.1)",
                  border: "1px solid rgba(64,224,240,0.3)",
                  color: "#40e0f0",
                }}
              >
                ענה · 47 תשובות
              </div>
            </div>

            <div
              className="mx-3 mb-2.5 rounded-2xl p-3.5"
              style={{
                background: "#13131a",
                border: "1px solid #2a2a3a",
              }}
            >
              <div className="flex items-center gap-2 mb-2.5">
                <div
                  className="rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                  style={{
                    width: "28px",
                    height: "28px",
                    background: "linear-gradient(135deg, #f040a0, #a040f0)",
                    color: "#0a0a0f",
                  }}
                >
                  רון
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-semibold" style={{ color: "#d0d0e0" }}>רון אבי</div>
                  <div className="text-[9px]" style={{ color: "#7070a0" }}>💼 עסקים</div>
                </div>
                <div
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{
                    background: "rgba(240,224,64,0.15)",
                    color: "#f0e040",
                    border: "1px solid rgba(240,224,64,0.3)",
                  }}
                >
                  🔥 טרנד
                </div>
              </div>
              <div className="text-[12px] leading-snug mb-2.5" style={{ color: "#c0c0d8" }}>
                שלח הצעת מחיר תמיד ב-PDF ולא ב-Word. נראה יותר מקצועי ולא ניתן לעריכה.
              </div>
              <div className="flex gap-2 items-center">
                <div
                  className="flex-1 rounded-lg py-1 text-center text-[10px]"
                  style={{
                    background: "rgba(64,224,64,0.12)",
                    border: "1px solid rgba(64,224,64,0.3)",
                    color: "#40e040",
                  }}
                >
                  ✅ עבד לי (5.1k)
                </div>
                <div
                  className="flex-1 rounded-lg py-1 text-center text-[10px]"
                  style={{
                    background: "rgba(240,64,64,0.1)",
                    border: "1px solid rgba(240,64,64,0.25)",
                    color: "#f04040",
                  }}
                >
                  ❌ לא עבד (89)
                </div>
                <div className="text-[10px]" style={{ color: "#7070a0" }}>💬 122</div>
              </div>
            </div>

            <div
              className="flex justify-around px-4 pt-2 pb-3.5"
              style={{
                borderTop: "1px solid #1c1c27",
                background: "#0d0d14",
              }}
            >
              {[
                { icon: "🏠", label: "בית", active: true },
                { icon: "🔥", label: "טרנד" },
                { fab: true },
                { icon: "🔍", label: "חיפוש" },
                { icon: "👤", label: "פרופיל" },
              ].map((item, i) =>
                item.fab ? (
                  <div
                    key={i}
                    className="flex items-center justify-center text-xl font-bold rounded-full -mt-1.5"
                    style={{
                      width: "38px",
                      height: "38px",
                      background: "linear-gradient(135deg, #f0e040, #40e0f0)",
                      color: "#0a0a0f",
                    }}
                  >
                    +
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-0.5 text-[9px]"
                    style={{ color: item.active ? "#f0e040" : "#7070a0" }}
                  >
                    <div className="text-lg">{item.icon}</div>
                    <div>{item.label}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DesignSpec() {
  const colors = [
    { hex: "#0a0a0f", border: "#2a2a3a", name: "רקע", code: "#0a0a0f" },
    { hex: "#13131a", border: "#2a2a3a", name: "Surface", code: "#13131a" },
    { hex: "#f0e040", border: "#2a2a3a", name: "Accent", code: "#f0e040" },
    { hex: "#40e0f0", border: "#2a2a3a", name: "Info", code: "#40e0f0" },
    { hex: "#40e040", border: "#2a2a3a", name: "אמת", code: "#40e040" },
    { hex: "#f04040", border: "#2a2a3a", name: "שגוי", code: "#f04040" },
  ];

  const categories = ["🏠 בית", "🍕 אוכל", "💼 עסקים", "💊 בריאות", "💻 טכנולוגיה", "🌿 טבע"];
  const principles = [
    { icon: "🌑", bold: "Dark Mode בלבד", text: "— נוח לעיניים, מחזיר סוללה" },
    { icon: "📐", bold: "Border Radius 14-16px", text: "— עגול ונגיש" },
    { icon: "⚡", bold: "Micro-animations", text: "— כפתורי הצבעה עם haptic" },
    { icon: "🎯", bold: "Accent צהוב", text: "— אחד בלבד, כל השאר מינורי" },
    { icon: "📊", bold: "Progress bars", text: "— אחוז אמינות בכל טיפ" },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-6 py-20"
      style={{ background: "#0a0a0f" }}
      data-testid="design-spec-section"
    >
      <div className="patent-section-label">מדריך עיצוב</div>
      <h2
        className="patent-section-title"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8" }}
      >
        שפה ויזואלית.
      </h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <div
          className="rounded-2xl p-7"
          style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
          data-testid="spec-colors"
        >
          <div
            className="text-[11px] tracking-widest uppercase mb-4"
            style={{ color: "#7070a0", fontFamily: "'Syne', sans-serif" }}
          >
            צבעים
          </div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((c) => (
              <div key={c.hex} className="flex flex-col items-center gap-1.5">
                <div
                  className="rounded-full"
                  style={{
                    width: "40px",
                    height: "40px",
                    background: c.hex,
                    border: `2px solid ${c.border}`,
                  }}
                />
                <div className="text-[9px] text-center leading-tight" style={{ color: "#7070a0" }}>
                  {c.name}
                  <br />
                  {c.code}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
          data-testid="spec-typography"
        >
          <div
            className="text-[11px] tracking-widest uppercase mb-4"
            style={{ color: "#7070a0", fontFamily: "'Syne', sans-serif" }}
          >
            טיפוגרפיה
          </div>
          <div className="mb-3">
            <div className="text-[11px] mb-1" style={{ color: "#7070a0" }}>Syne — כותרות</div>
            <div
              className="text-3xl leading-none"
              style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: "#f0f0f8" }}
            >
              Patent
            </div>
          </div>
          <div className="mb-3">
            <div className="text-[11px] mb-1" style={{ color: "#7070a0" }}>Noto Sans Hebrew — גוף</div>
            <div className="text-xl font-semibold" style={{ color: "#f0f0f8" }}>
              טיפ שגילית שווה זהב
            </div>
          </div>
          <div className="text-[12px] mt-3" style={{ color: "#7070a0" }}>
            כותרות: 800 bold · גוף: 400/600 · מינימום: 12px
          </div>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
          data-testid="spec-principles"
        >
          <div
            className="text-[11px] tracking-widest uppercase mb-4"
            style={{ color: "#7070a0", fontFamily: "'Syne', sans-serif" }}
          >
            עקרונות עיצוב
          </div>
          <div className="flex flex-col gap-2.5">
            {principles.map((p) => (
              <div key={p.bold} className="text-[13px]" style={{ color: "#7070a0" }}>
                {p.icon} <strong style={{ color: "#f0f0f8" }}>{p.bold}</strong>{p.text}
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-2xl p-7"
          style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
          data-testid="spec-icons"
        >
          <div
            className="text-[11px] tracking-widest uppercase mb-4"
            style={{ color: "#7070a0", fontFamily: "'Syne', sans-serif" }}
          >
            אייקונים ואמוג'י
          </div>
          <div className="text-[13px] mb-3" style={{ color: "#7070a0" }}>
            כל קטגוריה מיוצגת באמוג'י — פשוט, אינטואיטיבי, אוניברסלי.
          </div>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-1.5 rounded-lg text-[13px]"
                style={{
                  background: "#1c1c27",
                  border: "1px solid #2a2a3a",
                  color: "#c0c0d8",
                }}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      num: "01",
      title: "אימות קולקטיבי חכם",
      desc: "כל טיפ מציג בזמן אמת כמה אנשים ניסו אותו ובאיזה אחוז הצליח. זה לא דעה — זה נתון.",
    },
    {
      num: "02",
      title: "בקשת פתרון עם תגמול",
      desc: "מי שמעלה שאלה יכול להגדיר \"תגמול\" — נקודות, תג, או עתידית כסף. מי שעונה הכי טוב — מרוויח.",
    },
    {
      num: "03",
      title: "פרופיל מומחה",
      desc: "כל משתמש בונה ציון אמינות לפי הטיפים שלו. ככל שהטיפים שלך עוזרים לאנשים — כך אתה עולה ל\"מומחה מאומת\".",
    },
    {
      num: "04",
      title: "AI סינון איכות",
      desc: "מודל AI מסנן טיפים שגויים, מסוכנים, או כפולים — לפני שהם עולים לפיד הראשי.",
    },
    {
      num: "05",
      title: "טרנד יומי",
      desc: "כל יום — הטיפ הכי מאומת ב-24 שעות האחרונות. Push notification שאנשים באמת רוצים לפתוח.",
    },
    {
      num: "06",
      title: "שמירה וקולקציות",
      desc: "שמור טיפים לפי נושא — \"טיפי מטבח\", \"טיפי עסקים\", \"טיפי חיסכון\". הפלטפורמה שלך של ידע אישי.",
    },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-6 py-20"
      style={{ background: "#0a0a0f" }}
      data-testid="features-section"
    >
      <div className="patent-section-label">פיצ'רים מרכזיים</div>
      <h2
        className="patent-section-title"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8" }}
      >
        מה בפנים.
      </h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        {features.map((f) => (
          <div
            key={f.num}
            className="rounded-2xl p-7"
            style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
            data-testid={`feature-${f.num}`}
          >
            <div
              className="leading-none mb-2"
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "48px",
                fontWeight: 800,
                color: "#f0e040",
                opacity: 0.25,
              }}
            >
              {f.num}
            </div>
            <div
              className="text-base font-bold mb-2"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f0f8" }}
            >
              {f.title}
            </div>
            <div className="text-sm leading-relaxed" style={{ color: "#7070a0" }}>
              {f.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function UserFlowSection() {
  const steps = [
    { num: "STEP 01", title: "הורדה", desc: "מגיע מוויראל — חבר שלח טיפ שעבד" },
    { num: "STEP 02", title: "הרשמה", desc: "בחירת 3 קטגוריות עניין. 30 שניות." },
    { num: "STEP 03", title: "גילוי", desc: "פיד מותאם אישית. גלילה ראשונה — כבר מוצא טיפ שימושי." },
    { num: "STEP 04", title: "השתתפות", desc: "מצביע \"עבד לי\" על טיפ. מרגיש חלק מהקהילה." },
    { num: "STEP 05", title: "תרומה", desc: "מעלה טיפ משלו. מקבל תגובות. מתחיל לחזור." },
    { num: "STEP 06", title: "שגרה", desc: "פותח כל בוקר לראות מה הטיפ של היום." },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-6 py-20"
      style={{ background: "#0a0a0f" }}
      data-testid="flow-section"
    >
      <div className="patent-section-label">User Flow</div>
      <h2
        className="patent-section-title"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8" }}
      >
        איך משתמש חדש
        <br />
        הופך לקבוע.
      </h2>

      <div className="flex gap-0 overflow-x-auto pb-4 flow-scroll">
        {steps.map((step, i) => (
          <div key={step.num} className="flex items-center flex-shrink-0">
            <div
              className="rounded-2xl p-6 relative"
              style={{
                minWidth: "200px",
                background: "#13131a",
                border: "1px solid #2a2a3a",
              }}
              data-testid={`flow-step-${i}`}
            >
              <div
                className="text-[11px] tracking-widest mb-2"
                style={{ fontFamily: "'Syne', sans-serif", color: "#f0e040" }}
              >
                {step.num}
              </div>
              <div
                className="text-sm font-bold mb-1.5"
                style={{ fontFamily: "'Syne', sans-serif", color: "#f0f0f8" }}
              >
                {step.title}
              </div>
              <div className="text-[12px] leading-relaxed" style={{ color: "#7070a0" }}>
                {step.desc}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div
                className="text-lg px-2 flex-shrink-0"
                style={{ color: "#f0e040" }}
              >
                ←
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RoadmapSection() {
  const phases = [
    {
      label: "שלב א · חודשים 1–3",
      title: "MVP",
      labelColor: "#40e040",
      items: [
        "פרופיל משתמש",
        "העלאת טיפ (טקסט + תמונה)",
        "הצבעה עבד / לא עבד",
        "פיד לפי פופולריות",
        "קטגוריות בסיסיות",
        "שיתוף לוואטסאפ",
      ],
    },
    {
      label: "שלב ב · חודשים 4–8",
      title: "צמיחה",
      labelColor: "#f0e040",
      items: [
        "בקשת פתרון + תגמול",
        "פרופיל מומחה + ציון",
        "Push notification יומי",
        "וידאו קצר",
        "חיפוש מתקדם",
        "אפליקציית Web",
      ],
    },
    {
      label: "שלב ג · חודשים 9–18",
      title: "מונטיזציה",
      labelColor: "#40e0f0",
      items: [
        "מינוי פרימיום",
        "ספונסרים ומותגים",
        "AI סינון מתקדם",
        "שפות נוספות",
        "API לעסקים",
        "מרקטפלייס טיפים",
      ],
    },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-6 py-20"
      style={{ background: "#0a0a0f" }}
      data-testid="roadmap-section"
    >
      <div className="patent-section-label">רודמאפ</div>
      <h2
        className="patent-section-title"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8" }}
      >
        שלושה שלבים
        <br />
        לשוק העולמי.
      </h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        {phases.map((phase) => (
          <div
            key={phase.title}
            className="rounded-2xl p-7"
            style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
            data-testid={`phase-${phase.title}`}
          >
            <div
              className="text-[10px] tracking-widest uppercase mb-2"
              style={{ color: phase.labelColor }}
            >
              {phase.label}
            </div>
            <div
              className="text-lg font-bold mb-4"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f0f8" }}
            >
              {phase.title}
            </div>
            <ul className="flex flex-col gap-2">
              {phase.items.map((item) => (
                <li
                  key={item}
                  className="text-[13px] relative pr-4"
                  style={{ color: "#7070a0" }}
                >
                  <span className="absolute right-0" style={{ color: "#2a2a3a" }}>▸</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function MonetizationSection() {
  const models = [
    {
      icon: "👑",
      title: "Patent Pro",
      desc: "ללא פרסומות, כלי ניתוח מתקדם, וגישה מוקדמת לפיצ'רים חדשים.",
      est: "₪19/חודש",
    },
    {
      icon: "🏢",
      title: "Branded Tips",
      desc: "מותגים מממנים טיפים בתחום שלהם — נייטיב ולא פולשני.",
      est: "₪50–500 לטיפ",
    },
    {
      icon: "🏆",
      title: "תגמול תשובות",
      desc: "מי שמעלה שאלה יכול לשים \"פרס\" — נקודות שניתן להמיר.",
      est: "עמלת פלטפורמה 15%",
    },
    {
      icon: "🔌",
      title: "Patent API",
      desc: "עסקים ניגשים למאגר הטיפים המאומתים דרך API — B2B.",
      est: "₪299+/חודש",
    },
  ];

  return (
    <section
      className="max-w-6xl mx-auto px-6 py-20"
      style={{ background: "#0a0a0f" }}
      data-testid="monetization-section"
    >
      <div className="patent-section-label">מודל עסקי</div>
      <h2
        className="patent-section-title"
        style={{ fontSize: "clamp(28px, 5vw, 48px)", color: "#f0f0f8" }}
      >
        איך עושים כסף.
      </h2>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))" }}>
        {models.map((m) => (
          <div
            key={m.title}
            className="rounded-2xl p-7 text-center"
            style={{ background: "#13131a", border: "1px solid #2a2a3a" }}
            data-testid={`money-${m.title}`}
          >
            <div className="text-4xl mb-3">{m.icon}</div>
            <div
              className="text-base font-bold mb-2"
              style={{ fontFamily: "'Syne', sans-serif", color: "#f0f0f8" }}
            >
              {m.title}
            </div>
            <div className="text-[13px] leading-relaxed mb-3" style={{ color: "#7070a0" }}>
              {m.desc}
            </div>
            <div className="text-[12px] font-semibold" style={{ color: "#f0e040" }}>
              {m.est}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer
      className="text-center py-16 px-6"
      style={{ borderTop: "1px solid #2a2a3a", background: "#0a0a0f" }}
      data-testid="footer"
    >
      <div
        className="patent-footer-gradient mb-4"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: "64px",
          fontWeight: 800,
        }}
      >
        Patent
      </div>
      <div className="text-sm" style={{ color: "#7070a0" }}>
        הרשת החברתית של הידע היומיומי · 2025
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ background: "#0a0a0f", minHeight: "100vh", overflowX: "hidden" }}>
      <HeroSection />
      <Divider />
      <ConceptSection />
      <Divider />
      <PhoneMockup />
      <Divider />
      <DesignSpec />
      <Divider />
      <FeaturesSection />
      <Divider />
      <UserFlowSection />
      <Divider />
      <RoadmapSection />
      <Divider />
      <MonetizationSection />
      <Footer />
    </div>
  );
}
