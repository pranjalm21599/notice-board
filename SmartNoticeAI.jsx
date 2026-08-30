import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell, Search, LayoutDashboard, FilePlus2, FileText, Archive, Clock3,
  BarChart3, Bot, User, LogOut, Sparkles, MessageCircle, Send, CheckCircle2,
  AlertTriangle, Calendar, Paperclip, ChevronRight, ChevronLeft, X, Menu,
  GraduationCap, Building2, Users, Filter, BookOpen, Loader2, Languages,
  Wand2, Scissors, Maximize2, ListChecks, HelpCircle, ChevronDown, Check,
  Eye, MessagesSquare, ShieldCheck, Megaphone, PenLine, ArrowRight
} from "lucide-react";

/* ============================================================
   DESIGN TOKENS
   Palette: "Ink & Marginalia" — an academic notice board where
   official text reads upright and navy, and every AI utterance
   is rendered like a hand-written annotation in the margin:
   italic serif, teal ink, dashed rule. AI is a visible second
   voice, never the notice's voice.
   ============================================================ */
const C = {
  ink: "#12172B",        // near-black navy — chrome, sidebar
  inkSoft: "#242A47",
  paper: "#F6F5F1",      // warm paper background
  paperDim: "#EFEEE8",
  card: "#FFFFFF",
  line: "#E4E2DA",
  text: "#1B1E2B",
  textDim: "#666A7C",
  textFaint: "#9296A6",
  primary: "#324B9E",    // official indigo
  primaryDark: "#25376F",
  primarySoft: "#EAEDFA",
  ai: "#0F8B8D",          // marginalia teal
  aiSoft: "#E6F5F4",
  aiDeep: "#0B6768",
  urgent: "#C0442E",
  urgentSoft: "#FBEAE6",
  important: "#B07C15",
  importantSoft: "#FBF2E0",
  general: "#3E7C4A",
  generalSoft: "#EAF4EB",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500;1,9..144,600&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&display=swap');
    .f-display { font-family: 'Fraunces', serif; }
    .f-ai { font-family: 'Fraunces', serif; font-style: italic; }
    .f-body { font-family: 'Inter', sans-serif; }
    .f-mono { font-family: 'IBM Plex Mono', monospace; }
    * { box-sizing: border-box; }
    ::selection { background: ${C.ai}33; }
    .snx-scroll::-webkit-scrollbar { width: 7px; height: 7px; }
    .snx-scroll::-webkit-scrollbar-thumb { background: #D8D6CC; border-radius: 10px; }
    .snx-scroll::-webkit-scrollbar-track { background: transparent; }
    @keyframes snxFade { from { opacity:0; transform: translateY(4px);} to {opacity:1; transform:none;} }
    .snx-in { animation: snxFade .35s ease both; }
    @keyframes snxPulse { 0%,100%{opacity:.35} 50%{opacity:1} }
    .snx-dot { animation: snxPulse 1.1s ease-in-out infinite; }
    @keyframes snxBlink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
    .snx-caret { animation: snxBlink 0.9s step-start infinite; }
  `}</style>
);

/* ============================================================
   MOCK DEMO DATA
   ============================================================ */
let NOTICE_SEQ = 9;

const INITIAL_NOTICES = [
  {
    id: 1,
    title: "Mid-Term Examination Schedule",
    department: "Computer Science & Engineering",
    course: "B.Tech CSE — Semester 2",
    priority: "urgent",
    content:
      "Students of B.Tech CSE 2nd Semester are informed that the mid-term examination will commence from 15 September 2026 and conclude on 20 September 2026. The detailed datesheet has been uploaded to the department noticeboard and the LMS portal. All students must carry their university ID card to the examination hall; entry will not be permitted without it. Students are advised to report to the examination hall at least 15 minutes before the scheduled time. The examination will be conducted in Block C, Rooms 101–108. Any student facing a scheduling conflict must contact the Examination Cell before 10 September 2026.",
    attachment: "MidTerm_DateSheet_Sem2.pdf",
    publishDate: "2026-08-25",
    expiryDate: "2026-09-20",
    targetAudience: "B.Tech CSE, Semester 2",
    audienceSize: 118,
    status: "published",
    teacher: "Prof. R. Verma",
    createdAt: "2026-08-25T09:12:00",
    aiSummary: null,
    faqs: [
      { q: "When does the mid-term examination start?", a: "The mid-term examination begins on 15 September 2026 and runs through 20 September 2026." },
      { q: "What do I need to carry to the exam hall?", a: "You must carry your university ID card. Entry is not permitted without it." },
      { q: "Where will the exams be held?", a: "In Block C, Rooms 101 to 108." },
    ],
    analytics: { views: 428, summaryOpens: 312, questionsAsked: 87, acknowledged: 391 },
  },
  {
    id: 2,
    title: "Hackathon Registration — CodeSprint 2026",
    department: "Computer Science & Engineering",
    course: "All Branches",
    priority: "important",
    content:
      "The Department of Computer Science is organizing CodeSprint 2026, a 24-hour hackathon open to all students across departments. Teams of up to 4 members can register through the official Google Form linked on the department website. Registration closes on 10 September 2026. The event will be held on 19–20 September 2026 in the Innovation Lab, Block D. Top 3 teams will receive cash prizes and internship interview opportunities with our industry partners. Each team must submit a one-page problem statement proposal by 12 September 2026 for shortlisting.",
    attachment: "CodeSprint2026_Rulebook.pdf",
    publishDate: "2026-08-20",
    expiryDate: "2026-09-20",
    targetAudience: "All Departments",
    audienceSize: 640,
    status: "published",
    teacher: "Prof. R. Verma",
    createdAt: "2026-08-20T11:00:00",
    aiSummary: null,
    faqs: [
      { q: "What is the last date for registration?", a: "Registration closes on 10 September 2026." },
      { q: "How many members can be in a team?", a: "Teams can have up to 4 members." },
      { q: "Where will the hackathon be held?", a: "In the Innovation Lab, Block D." },
    ],
    analytics: { views: 355, summaryOpens: 201, questionsAsked: 64, acknowledged: 288 },
  },
  {
    id: 3,
    title: "Assignment Submission Deadline — Data Structures",
    department: "Computer Science & Engineering",
    course: "B.Tech CSE — Semester 3",
    priority: "important",
    content:
      "Students of B.Tech CSE Semester 3 are required to submit their Data Structures assignment (Unit 3: Trees and Graphs) by 20 September 2026, 11:59 PM. Submissions must be made through the LMS portal only; email submissions will not be accepted. Late submissions within 24 hours will attract a 10% penalty; no submissions will be accepted after that window. Plagiarism checks will be run on all submissions.",
    attachment: null,
    publishDate: "2026-08-28",
    expiryDate: "2026-09-21",
    targetAudience: "B.Tech CSE, Semester 3",
    audienceSize: 96,
    status: "published",
    teacher: "Prof. R. Verma",
    createdAt: "2026-08-28T14:30:00",
    aiSummary: null,
    faqs: [
      { q: "What is the deadline?", a: "20 September 2026, 11:59 PM." },
      { q: "Where should I submit the assignment?", a: "Through the LMS portal only. Email submissions are not accepted." },
      { q: "Is there a penalty for late submission?", a: "Yes, a 10% penalty applies for submissions within 24 hours of the deadline. Nothing is accepted after that." },
    ],
    analytics: { views: 210, summaryOpens: 150, questionsAsked: 41, acknowledged: 178 },
  },
  {
    id: 4,
    title: "Workshop on Artificial Intelligence",
    department: "Computer Science & Engineering",
    course: "All Branches",
    priority: "general",
    content:
      "A two-day hands-on workshop on Artificial Intelligence and Machine Learning fundamentals will be conducted on 12–13 September 2026 in Seminar Hall 2. The workshop will be led by industry experts from TechCorp Labs and will cover neural networks, model training, and deployment basics. Attendance is compulsory for all students enrolled in the AI Elective course; it is optional but recommended for others. Interested students may register at the department office by 8 September 2026. A certificate of participation will be issued.",
    attachment: "AI_Workshop_Brochure.pdf",
    publishDate: "2026-08-22",
    expiryDate: "2026-09-13",
    targetAudience: "AI Elective students, open to all",
    audienceSize: 260,
    status: "published",
    teacher: "Prof. R. Verma",
    createdAt: "2026-08-22T10:05:00",
    aiSummary: null,
    faqs: [
      { q: "Is attendance compulsory?", a: "Yes, for students enrolled in the AI Elective course. It's optional but recommended for everyone else." },
      { q: "Where will the workshop happen?", a: "In Seminar Hall 2." },
      { q: "What is the last date for registration?", a: "8 September 2026, at the department office." },
    ],
    analytics: { views: 301, summaryOpens: 244, questionsAsked: 58, acknowledged: 260 },
  },
  {
    id: 5,
    title: "Holiday Announcement — Founder's Day",
    department: "Administration",
    course: "All Departments",
    priority: "general",
    content:
      "The university will remain closed on 5 September 2026 on account of Founder's Day. Regular classes will resume from 6 September 2026 as per the normal timetable. Hostel mess services will continue to operate normally.",
    attachment: null,
    publishDate: "2026-08-30",
    expiryDate: "2026-09-06",
    targetAudience: "All Students & Staff",
    audienceSize: 3200,
    status: "published",
    teacher: "Admin Office",
    createdAt: "2026-08-30T08:00:00",
    aiSummary: null,
    faqs: [
      { q: "Why is the university closed?", a: "It's closed on account of Founder's Day." },
      { q: "When do classes resume?", a: "From 6 September 2026, as per the normal timetable." },
    ],
    analytics: { views: 512, summaryOpens: 190, questionsAsked: 12, acknowledged: 480 },
  },
  {
    id: 6,
    title: "Campus Placement Drive — TechCorp & Finlytics",
    department: "Training & Placement Cell",
    course: "Final Year — All Branches",
    priority: "urgent",
    content:
      "The Training & Placement Cell announces a campus placement drive with TechCorp Labs and Finlytics Solutions for final-year students on 18 September 2026. Eligible students must have a minimum CGPA of 7.0 with no active backlogs. Registration is mandatory through the placement portal by 11 September 2026. Shortlisted students will undergo an online aptitude test on 14 September 2026, followed by technical interviews on the drive date. Students must carry two copies of their updated resume and a valid photo ID.",
    attachment: "Placement_Drive_Eligibility.pdf",
    publishDate: "2026-08-27",
    expiryDate: "2026-09-18",
    targetAudience: "Final Year, CGPA ≥ 7.0",
    audienceSize: 214,
    status: "published",
    teacher: "T&P Cell",
    createdAt: "2026-08-27T16:20:00",
    aiSummary: null,
    faqs: [
      { q: "What is the eligibility criteria?", a: "A minimum CGPA of 7.0 with no active backlogs." },
      { q: "What is the last date for registration?", a: "11 September 2026, through the placement portal." },
      { q: "What documents should I carry?", a: "Two copies of your updated resume and a valid photo ID." },
    ],
    analytics: { views: 389, summaryOpens: 301, questionsAsked: 93, acknowledged: 350 },
  },
  {
    id: 7,
    title: "Inter-College Coding Contest — ByteWars",
    department: "Computer Science & Engineering",
    course: "All Branches",
    priority: "general",
    content:
      "ByteWars, an inter-college competitive programming contest, will be held on 21 September 2026 from 10:00 AM to 1:00 PM in the Computer Lab, Block D. The contest is open to all students individually. Registration is free and can be done via the link shared on the department WhatsApp group by 15 September 2026. Top performers will be felicitated during the department's annual day.",
    attachment: null,
    publishDate: "2026-08-24",
    expiryDate: "2026-09-21",
    targetAudience: "All Departments",
    audienceSize: 640,
    status: "published",
    teacher: "Prof. R. Verma",
    createdAt: "2026-08-24T12:40:00",
    aiSummary: null,
    faqs: [
      { q: "Is there a registration fee?", a: "No, registration is free." },
      { q: "What is the last date to register?", a: "15 September 2026." },
    ],
    analytics: { views: 176, summaryOpens: 98, questionsAsked: 19, acknowledged: 140 },
  },
  {
    id: 8,
    title: "Merit Scholarship Application — 2026-27",
    department: "Administration",
    course: "All Departments",
    priority: "important",
    content:
      "Applications are invited for the Merit Scholarship 2026-27 for students who scored above 8.5 CGPA in the previous academic year with no active backlogs. Interested students must submit the scholarship application form along with their latest mark sheet to the Accounts Office by 25 September 2026. Late applications will not be entertained under any circumstances. Selected students will be notified via email by 10 October 2026.",
    attachment: "Scholarship_Application_Form.pdf",
    publishDate: "2026-08-29",
    expiryDate: "2026-09-25",
    targetAudience: "CGPA ≥ 8.5, all departments",
    audienceSize: 340,
    status: "published",
    teacher: "Admin Office",
    createdAt: "2026-08-29T09:50:00",
    aiSummary: null,
    faqs: [
      { q: "What is the eligibility criteria?", a: "Above 8.5 CGPA in the previous academic year with no active backlogs." },
      { q: "Where do I submit the application?", a: "At the Accounts Office." },
      { q: "What is the deadline?", a: "25 September 2026." },
    ],
    analytics: { views: 264, summaryOpens: 205, questionsAsked: 37, acknowledged: 230 },
  },
];

const DEPARTMENTS = ["Computer Science & Engineering", "Electronics & Communication", "Mechanical Engineering", "Administration", "Training & Placement Cell"];
const PRIORITY_META = {
  urgent: { label: "Urgent", color: C.urgent, soft: C.urgentSoft },
  important: { label: "Important", color: C.important, soft: C.importantSoft },
  general: { label: "General", color: C.general, soft: C.generalSoft },
};

/* ============================================================
   AI SERVICE — real calls to the Anthropic Messages API.
   Every function fails soft into a clearly-labelled fallback
   so the demo never breaks if the network call fails.
   ============================================================ */
async function callClaude(system, userText) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: userText }],
    }),
  });
  const data = await res.json();
  const text = (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();
  if (!text) throw new Error("empty AI response");
  return text;
}

function stripFences(s) {
  return s.replace(/^```(json)?/i, "").replace(/```$/i, "").trim();
}

const AI = {
  async summarize(notice) {
    const system = `You are the AI reading assistant inside a college notice board app called SmartNotice AI. Given the full text of one official notice, output ONLY a valid JSON object (no markdown fences, no commentary) with exactly these keys:
{"summary": "2-4 simple sentences explaining the notice in plain language", "keyPoints": ["short bullet strings"], "importantDates": [{"label":"what the date is for","date":"the date as written"}], "requiredActions": ["short strings describing what the student must do"], "whoAffected": "one short sentence naming who this notice applies to"}
Rules: base every field strictly on the notice text given. Never invent dates, venues, names or numbers that are not present. If a field genuinely has nothing to report, use an empty array (or, for whoAffected, "Not specified in the notice").`;
    const user = `Title: ${notice.title}\nDepartment: ${notice.department}\nCourse/Target: ${notice.course}\n\nNotice content:\n${notice.content}`;
    const raw = await callClaude(system, user);
    return JSON.parse(stripFences(raw));
  },

  async answer(notice, question, history) {
    const system = `You are "Ask AI", a notice-scoped assistant inside SmartNotice AI. You may ONLY use the text of the single notice provided below to answer. You must never invent dates, venues, eligibility, or any fact not present in the notice text, and you must not use outside knowledge about the college. Keep answers to 1-3 short sentences, plain and direct, no preamble like "Based on the notice". If the answer is genuinely not contained in the notice text, reply with EXACTLY this sentence and nothing else: "I couldn't find this information in the notice. Please contact the concerned teacher/department."

NOTICE TITLE: ${notice.title}
DEPARTMENT: ${notice.department}
NOTICE TEXT:
${notice.content}`;
    const histStr = history.map((h) => `${h.role === "user" ? "Student" : "AI"}: ${h.text}`).join("\n");
    const user = `${histStr ? histStr + "\n" : ""}Student: ${question}`;
    return callClaude(system, user);
  },

  async generateFaqs(notice) {
    const system = `You generate likely student FAQs for a college notice, strictly grounded in its text. Output ONLY a JSON array (no fences, no commentary) of 4 to 6 objects shaped like {"q":"...", "a":"..."}. Every answer must be answerable directly from the notice text — never invent facts. Prefer the most practically useful questions: deadlines, venue, eligibility, required action, required documents.`;
    const user = `Title: ${notice.title}\nNotice content:\n${notice.content}`;
    const raw = await callClaude(system, user);
    return JSON.parse(stripFences(raw));
  },

  async qualityCheck(notice) {
    const system = `You are a notice quality reviewer for a college notice board. Score the notice draft from 0-100 on clarity and completeness for a student reader, then list short pass/fail checks. Output ONLY valid JSON (no fences) shaped exactly like:
{"score": 92, "checks": [{"label":"Clear title","pass":true}, {"label":"Deadline mentioned","pass":true}, {"label":"Target audience identified","pass":true}, {"label":"Required action identified","pass":true}, {"label":"Venue specified","pass":false}, {"label":"Contact information included","pass":false}]}
Always include exactly these six checks in this order, judged strictly against the text given.`;
    const user = `Title: ${notice.title}\nDepartment: ${notice.department}\nContent:\n${notice.content}`;
    const raw = await callClaude(system, user);
    return JSON.parse(stripFences(raw));
  },

  async missingInfo(notice) {
    const system = `You review a college notice draft and list only the practically important pieces of information that appear to be missing (e.g. exact date, venue, contact person, target audience, required documents). Output ONLY a JSON array of short strings, maximum 5 items. If nothing important seems missing, output an empty array [].`;
    const user = `Title: ${notice.title}\nContent:\n${notice.content}`;
    const raw = await callClaude(system, user);
    return JSON.parse(stripFences(raw));
  },

  async rewrite(content, mode) {
    const instructions = {
      improve: "Improve the grammar, clarity and tone of this college notice. Keep every fact exactly as given — do not add or remove information. Return only the rewritten notice text, no preamble.",
      concise: "Rewrite this college notice to be noticeably shorter and more concise, keeping every fact. Return only the rewritten text, no preamble.",
      professional: "Rewrite this college notice in a more formal, professional official tone appropriate for a university administration. Keep every fact. Return only the rewritten text, no preamble.",
      detailed: "Expand this college notice with clearer structure and helpful phrasing (without inventing new facts, dates or venues). Return only the rewritten text, no preamble.",
      simplify: "Rewrite this college notice in simple, plain language that is easy for any student to understand quickly. Keep every fact. Return only the rewritten text, no preamble.",
      studentFriendly: "Rewrite this college notice in a warmer, more student-friendly tone while staying factually accurate and appropriately official. Return only the rewritten text, no preamble.",
    };
    const system = `You are a writing assistant embedded in a college notice-creation tool. ${instructions[mode]} Never invent facts, dates, venues or numbers not present in the original.`;
    return callClaude(system, content);
  },

  async title(content) {
    const system = `Suggest one short, clear, specific title (under 10 words) for this college notice. Return only the title text, nothing else, no quotes.`;
    return callClaude(system, content);
  },

  async translate(content, lang) {
    const system = `Translate the following official college notice into ${lang}. Preserve all facts, dates and numbers exactly. Return only the translated text.`;
    return callClaude(system, content);
  },
};

/* ============================================================
   SMALL UI ATOMS
   ============================================================ */
function PriorityBadge({ priority, size = "sm" }) {
  const m = PRIORITY_META[priority];
  return (
    <span
      className={`f-mono inline-flex items-center gap-1 rounded-full font-medium ${size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"}`}
      style={{ background: m.soft, color: m.color, letterSpacing: "0.04em" }}
    >
      <span style={{ width: 5, height: 5, borderRadius: 99, background: m.color, display: "inline-block" }} />
      {m.label.toUpperCase()}
    </span>
  );
}

function AITag({ children = "AI" }) {
  return (
    <span
      className="f-mono inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
      style={{ background: C.aiSoft, color: C.aiDeep, letterSpacing: "0.05em" }}
    >
      <Sparkles size={10} strokeWidth={2.5} /> {children}
    </span>
  );
}

function Btn({ children, onClick, variant = "primary", icon: Icon, size = "md", disabled, className = "", type = "button" }) {
  const base = "f-body inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const sizes = { sm: "text-xs px-2.5 py-1.5", md: "text-sm px-4 py-2.5", lg: "text-[15px] px-5 py-3" };
  const styles = {
    primary: { background: C.primary, color: "#fff" },
    ai: { background: C.ai, color: "#fff" },
    ghost: { background: "transparent", color: C.text, border: `1px solid ${C.line}` },
    aiGhost: { background: C.aiSoft, color: C.aiDeep, border: `1px solid ${C.ai}44` },
    subtle: { background: C.paperDim, color: C.text },
    danger: { background: C.urgentSoft, color: C.urgent },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${className}`}
      style={{ ...styles[variant], cursor: disabled ? "not-allowed" : "pointer" }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(0.94)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
    >
      {Icon && <Icon size={size === "sm" ? 13 : 15} strokeWidth={2.2} />}
      {children}
    </button>
  );
}

function Card({ children, className = "", style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl ${className}`}
      style={{ background: C.card, border: `1px solid ${C.line}`, ...style }}
    >
      {children}
    </div>
  );
}

function LoadingDots({ label }) {
  return (
    <div className="f-mono flex items-center gap-2 text-xs" style={{ color: C.aiDeep }}>
      <Loader2 size={13} className="animate-spin" />
      <span>{label}</span>
      <span className="flex gap-0.5">
        <span className="snx-dot" style={{ animationDelay: "0s" }}>•</span>
        <span className="snx-dot" style={{ animationDelay: ".15s" }}>•</span>
        <span className="snx-dot" style={{ animationDelay: ".3s" }}>•</span>
      </span>
    </div>
  );
}

/* Marginalia block — the app's signature AI presentation */
function AIBlock({ icon: Icon = Sparkles, title, children, loading, loadingLabel = "Thinking", empty }) {
  return (
    <div
      className="snx-in rounded-xl pl-4 pr-4 py-3.5 relative"
      style={{ background: C.aiSoft, borderLeft: `3px dashed ${C.ai}`, }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon size={13} style={{ color: C.aiDeep }} strokeWidth={2.3} />
        <span className="f-mono text-[10.5px] font-semibold" style={{ color: C.aiDeep, letterSpacing: "0.06em" }}>{title?.toUpperCase()}</span>
      </div>
      {loading ? <LoadingDots label={loadingLabel} /> : empty ? (
        <p className="f-body text-sm" style={{ color: C.textFaint }}>{empty}</p>
      ) : (
        <div className="f-ai text-[15px] leading-relaxed" style={{ color: "#0C4C4D" }}>{children}</div>
      )}
    </div>
  );
}

function TypingText({ text, speed = 14 }) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown("");
    if (!text) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text]);
  return <span>{shown}<span className="snx-caret" style={{ color: C.ai }}>▍</span></span>;
}

/* ============================================================
   LOGIN
   ============================================================ */
function LoginScreen({ onLogin }) {
  const [role, setRole] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    if (role === "teacher") setName("Prof. R. Verma");
    if (role === "student") setName("Ananya Sharma");
  }, [role]);

  return (
    <div className="min-h-screen flex items-center justify-center f-body relative overflow-hidden" style={{ background: C.ink }}>
      <div className="absolute inset-0 opacity-[0.05]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
        backgroundSize: "26px 26px",
      }} />
      <div className="w-full max-w-md mx-4 relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.ai }}>
              <Megaphone size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <span className="f-display text-2xl text-white font-semibold tracking-tight">SmartNotice <span style={{ color: C.ai }}>AI</span></span>
          </div>
          <p className="f-ai text-[15px]" style={{ color: "#B9BDD4" }}>Every notice. Clearly understood.</p>
        </div>

        <div className="rounded-2xl p-7" style={{ background: "#171D38", border: "1px solid #2A3159" }}>
          {!role ? (
            <>
              <p className="f-mono text-[11px] mb-4" style={{ color: "#8790BE", letterSpacing: "0.08em" }}>CONTINUE AS</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setRole("teacher")} className="rounded-xl p-5 text-left transition-all" style={{ background: "#1E2648", border: "1px solid #313A6B" }}
                  onMouseEnter={(e)=>e.currentTarget.style.borderColor=C.ai} onMouseLeave={(e)=>e.currentTarget.style.borderColor="#313A6B"}>
                  <BookOpen size={20} color={C.ai} className="mb-3" />
                  <p className="f-display text-white text-[17px] font-semibold">Teacher</p>
                  <p className="f-body text-xs mt-1" style={{ color: "#8790BE" }}>Publish & manage notices</p>
                </button>
                <button onClick={() => setRole("student")} className="rounded-xl p-5 text-left transition-all" style={{ background: "#1E2648", border: "1px solid #313A6B" }}
                  onMouseEnter={(e)=>e.currentTarget.style.borderColor=C.ai} onMouseLeave={(e)=>e.currentTarget.style.borderColor="#313A6B"}>
                  <GraduationCap size={20} color={C.ai} className="mb-3" />
                  <p className="f-display text-white text-[17px] font-semibold">Student</p>
                  <p className="f-body text-xs mt-1" style={{ color: "#8790BE" }}>Read & ask about notices</p>
                </button>
              </div>
            </>
          ) : (
            <div className="snx-in">
              <button onClick={() => setRole(null)} className="flex items-center gap-1 text-xs mb-5" style={{ color: "#8790BE" }}>
                <ChevronLeft size={13} /> Back
              </button>
              <div className="flex items-center gap-2 mb-5">
                {role === "teacher" ? <BookOpen size={16} color={C.ai} /> : <GraduationCap size={16} color={C.ai} />}
                <p className="f-display text-white text-lg font-semibold">Log in as {role === "teacher" ? "Teacher" : "Student"}</p>
              </div>
              <label className="f-mono text-[10px]" style={{ color: "#8790BE", letterSpacing: "0.06em" }}>NAME</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1.5 mb-4 rounded-lg px-3.5 py-2.5 text-sm f-body outline-none" style={{ background: "#0F1430", border: "1px solid #313A6B", color: "#fff" }} />
              <label className="f-mono text-[10px]" style={{ color: "#8790BE", letterSpacing: "0.06em" }}>EMAIL</label>
              <input defaultValue={role === "teacher" ? "r.verma@college.edu" : "ananya.s@college.edu"} className="w-full mt-1.5 mb-6 rounded-lg px-3.5 py-2.5 text-sm f-body outline-none" style={{ background: "#0F1430", border: "1px solid #313A6B", color: "#fff" }} />
              <Btn variant="ai" size="lg" className="w-full" icon={ArrowRight} onClick={() => onLogin(role, name || (role === "teacher" ? "Prof. R. Verma" : "Ananya Sharma"))}>
                Enter Dashboard
              </Btn>
            </div>
          )}
        </div>
        <p className="text-center f-mono text-[10.5px] mt-6" style={{ color: "#5C6392", letterSpacing: "0.05em" }}>DEMO ENVIRONMENT · AI RESPONSES ARE LIVE-GENERATED</p>
      </div>
    </div>
  );
}

/* ============================================================
   SHELL: SIDEBAR + TOPBAR
   ============================================================ */
function Sidebar({ role, view, setView, name, mobileOpen, setMobileOpen }) {
  const teacherNav = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "create", label: "Create Notice", icon: FilePlus2 },
    { id: "mynotices", label: "My Notices", icon: FileText },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "ai", label: "AI Assistant", icon: Bot },
  ];
  const studentNav = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "board", label: "Notice Board", icon: Megaphone },
    { id: "ai", label: "AI Assistant", icon: Bot },
  ];
  const nav = role === "teacher" ? teacherNav : studentNav;

  return (
    <>
      {mobileOpen && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setMobileOpen(false)} />}
      <aside
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 flex flex-col transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: C.ink }}
      >
        <div className="flex items-center gap-2 px-5 pt-6 pb-7">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.ai }}>
            <Megaphone size={16} color="#fff" />
          </div>
          <span className="f-display text-white text-[17px] font-semibold leading-none">SmartNotice <span style={{ color: C.ai }}>AI</span></span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {nav.map((n) => {
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => { setView(n.id); setMobileOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm f-body transition-colors"
                style={{ background: active ? "rgba(15,139,141,0.16)" : "transparent", color: active ? "#5FE0D8" : "#AEB3CC" }}
              >
                <n.icon size={16} strokeWidth={2} />
                {n.label}
                {active && <span className="ml-auto w-1 h-1 rounded-full" style={{ background: C.ai }} />}
              </button>
            );
          })}
        </nav>
        <div className="px-3 pb-5 pt-4" style={{ borderTop: "1px solid #232A4C" }}>
          <button onClick={() => setView("profile")} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm" style={{ color: "#AEB3CC" }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center f-mono text-[11px] font-semibold shrink-0" style={{ background: "#2A3159", color: "#fff" }}>
              {name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{name}</p>
              <p className="text-[10px] capitalize" style={{ color: "#7B81A8" }}>{role}</p>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}

function NotificationsDrop({ notices, open, onClose }) {
  const urgent = notices.filter((n) => n.priority === "urgent" && n.status === "published").slice(0, 5);
  if (!open) return null;
  return (
    <div className="absolute right-0 top-11 w-80 rounded-xl snx-in z-50 overflow-hidden" style={{ background: C.card, border: `1px solid ${C.line}`, boxShadow: "0 12px 32px rgba(18,23,43,0.14)" }}>
      <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.line}` }}>
        <p className="f-display font-semibold text-sm">Notifications</p>
        <button onClick={onClose}><X size={14} color={C.textFaint} /></button>
      </div>
      <div className="max-h-80 overflow-y-auto snx-scroll">
        {urgent.length === 0 && <p className="text-xs p-4" style={{ color: C.textFaint }}>You're all caught up.</p>}
        {urgent.map((n) => (
          <div key={n.id} className="px-4 py-3 flex gap-2.5" style={{ borderBottom: `1px solid ${C.line}` }}>
            <span className="mt-1 shrink-0" style={{ color: C.urgent }}>🔴</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: C.text }}>URGENT NOTICE</p>
              <p className="text-[13px] mt-0.5" style={{ color: C.textDim }}>"{n.title}" has been published.</p>
              <p className="f-mono text-[10px] mt-1" style={{ color: C.textFaint }}>{n.department}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TopBar({ role, notices, search, setSearch, onMenu, showSearch }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notices.filter((n) => n.priority === "urgent" && n.status === "published").length;
  return (
    <div className="sticky top-0 z-30 flex items-center gap-3 px-4 md:px-7 py-3.5" style={{ background: `${C.paper}F2`, backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}` }}>
      <button onClick={onMenu} className="md:hidden"><Menu size={20} /></button>
      {showSearch && (
        <div className="flex-1 max-w-md relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.textFaint} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notices, events, deadlines..."
            className="w-full f-body text-sm rounded-lg pl-9 pr-3 py-2.5 outline-none"
            style={{ background: C.card, border: `1px solid ${C.line}` }}
          />
        </div>
      )}
      <div className="flex-1" />
      <div className="relative">
        <button onClick={() => setNotifOpen((o) => !o)} className="relative w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.card, border: `1px solid ${C.line}` }}>
          <Bell size={16} color={C.text} />
          {unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full f-mono text-[9px] flex items-center justify-center text-white font-semibold" style={{ background: C.urgent }}>{unread}</span>}
        </button>
        <NotificationsDrop notices={notices} open={notifOpen} onClose={() => setNotifOpen(false)} />
      </div>
    </div>
  );
}

/* ============================================================
   STAT CARD
   ============================================================ */
function StatCard({ label, value, icon: Icon, accent }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="f-mono text-[10.5px] mb-2" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>{label.toUpperCase()}</p>
          <p className="f-display text-[26px] font-semibold" style={{ color: C.text }}>{value}</p>
        </div>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: accent + "17" }}>
          <Icon size={17} style={{ color: accent }} />
        </div>
      </div>
    </Card>
  );
}

/* ============================================================
   TEACHER: OVERVIEW
   ============================================================ */
function TeacherOverview({ notices, name, setView }) {
  const mine = notices.filter((n) => n.teacher === name || name === "Prof. R. Verma");
  const active = mine.filter((n) => n.status === "published");
  const scheduled = mine.filter((n) => n.status === "scheduled");
  const totalReach = active.reduce((s, n) => s + n.audienceSize, 0);
  const totalQuestions = active.reduce((s, n) => s + n.analytics.questionsAsked, 0);
  const mostViewed = [...active].sort((a, b) => b.analytics.views - a.analytics.views)[0];

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto snx-in">
      <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="f-display text-[26px] font-semibold" style={{ color: C.text }}>Good morning, {name.replace("Prof. ", "")} 👋</h1>
          <p className="text-sm mt-1" style={{ color: C.textDim }}>Here's how your notices are landing with students.</p>
        </div>
        <Btn icon={FilePlus2} onClick={() => setView("create")}>Create Notice</Btn>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Notices" value={mine.length} icon={FileText} accent={C.primary} />
        <StatCard label="Active Notices" value={active.length} icon={Megaphone} accent={C.general} />
        <StatCard label="Scheduled" value={scheduled.length} icon={Clock3} accent={C.important} />
        <StatCard label="Students Reached" value={totalReach.toLocaleString()} icon={Users} accent={C.ai} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="p-5">
          <p className="f-mono text-[10.5px] mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>MOST VIEWED NOTICE</p>
          {mostViewed ? (
            <>
              <div className="flex items-center gap-2 mb-1.5"><PriorityBadge priority={mostViewed.priority} /></div>
              <p className="f-display text-[17px] font-semibold" style={{ color: C.text }}>{mostViewed.title}</p>
              <div className="flex gap-5 mt-3">
                <div><p className="text-lg font-semibold f-display">{mostViewed.analytics.views}</p><p className="text-[11px]" style={{ color: C.textFaint }}>views</p></div>
                <div><p className="text-lg font-semibold f-display">{mostViewed.analytics.summaryOpens}</p><p className="text-[11px]" style={{ color: C.textFaint }}>AI summaries</p></div>
                <div><p className="text-lg font-semibold f-display">{mostViewed.analytics.questionsAsked}</p><p className="text-[11px]" style={{ color: C.textFaint }}>AI questions</p></div>
              </div>
            </>
          ) : <p className="text-sm" style={{ color: C.textFaint }}>No published notices yet.</p>}
        </Card>
        <Card className="p-5">
          <p className="f-mono text-[10.5px] mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>STUDENT QUESTIONS</p>
          <p className="f-display text-[26px] font-semibold">{totalQuestions}</p>
          <p className="text-xs mt-1" style={{ color: C.textDim }}>questions answered by AI across your notices this term</p>
          <div className="mt-4 pt-4 flex items-center gap-2" style={{ borderTop: `1px solid ${C.line}` }}>
            <AITag>AI insight</AITag>
            <p className="f-ai text-sm" style={{ color: C.aiDeep }}>Students most often ask about deadlines and venues — consider stating both up top.</p>
          </div>
        </Card>
      </div>

      <p className="f-mono text-[10.5px] mt-8 mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>RECENT NOTICES</p>
      <div className="space-y-2.5">
        {mine.slice(0, 5).map((n) => (
          <Card key={n.id} className="p-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <PriorityBadge priority={n.priority} />
              <p className="text-sm font-medium truncate" style={{ color: C.text }}>{n.title}</p>
            </div>
            <div className="flex items-center gap-4 text-xs shrink-0" style={{ color: C.textFaint }}>
              <span className="flex items-center gap-1"><Eye size={12} />{n.analytics.views}</span>
              <span className="flex items-center gap-1"><MessagesSquare size={12} />{n.analytics.questionsAsked}</span>
              <span className="capitalize f-mono px-2 py-0.5 rounded" style={{ background: C.paperDim }}>{n.status}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TEACHER: CREATE NOTICE  (+ AI panel)
   ============================================================ */
function CreateNotice({ addNotice, name }) {
  const [form, setForm] = useState({
    title: "", content: "", department: DEPARTMENTS[0], course: "", priority: "important",
    attachment: "", publishDate: "", expiryDate: "", targetAudience: "",
  });
  const [aiLoading, setAiLoading] = useState(null); // which action is loading
  const [aiOut, setAiOut] = useState({}); // {improve, faqs, quality, missing, title}
  const [step, setStep] = useState("write"); // write | preview
  const [publishedMsg, setPublishedMsg] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const run = async (key, fn) => {
    setAiLoading(key);
    try {
      const res = await fn();
      setAiOut((o) => ({ ...o, [key]: res }));
    } catch (e) {
      setAiOut((o) => ({ ...o, [key]: { error: true } }));
    } finally {
      setAiLoading(null);
    }
  };

  const applyRewrite = (text) => {
    set("content", text);
  };

  const runQualityAndFaqs = async () => {
    if (!form.content.trim()) return;
    await Promise.all([
      run("quality", () => AI.qualityCheck(form)),
      run("faqs", () => AI.generateFaqs(form)),
      run("summaryPreview", () => AI.summarize(form)),
    ]);
    setStep("preview");
  };

  const publish = (status) => {
    addNotice({
      ...form,
      id: NOTICE_SEQ++,
      status,
      teacher: name,
      createdAt: new Date().toISOString(),
      audienceSize: form.targetAudience ? 120 : 100,
      aiSummary: aiOut.summaryPreview && !aiOut.summaryPreview.error ? aiOut.summaryPreview : null,
      faqs: aiOut.faqs && !aiOut.faqs.error ? aiOut.faqs.map((f) => ({ ...f })) : [],
      analytics: { views: 0, summaryOpens: 0, questionsAsked: 0, acknowledged: 0 },
    });
    setPublishedMsg(status);
    setForm({ title: "", content: "", department: DEPARTMENTS[0], course: "", priority: "important", attachment: "", publishDate: "", expiryDate: "", targetAudience: "" });
    setAiOut({});
    setStep("write");
    setTimeout(() => setPublishedMsg(false), 4000);
  };

  return (
    <div className="p-5 md:p-8 max-w-7xl mx-auto snx-in">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <h1 className="f-display text-[24px] font-semibold" style={{ color: C.text }}>Create Notice</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => setStep("write")} className="f-mono text-xs px-3 py-1.5 rounded-full" style={{ background: step === "write" ? C.primary : C.paperDim, color: step === "write" ? "#fff" : C.textDim }}>1 · WRITE</button>
          <ChevronRight size={14} color={C.textFaint} />
          <button onClick={() => form.content && setStep("preview")} className="f-mono text-xs px-3 py-1.5 rounded-full" style={{ background: step === "preview" ? C.primary : C.paperDim, color: step === "preview" ? "#fff" : C.textDim }}>2 · AI PREVIEW & PUBLISH</button>
        </div>
      </div>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>AI only suggests — nothing publishes without your review.</p>

      {publishedMsg && (
        <div className="mb-5 rounded-xl px-4 py-3 flex items-center gap-2 snx-in" style={{ background: C.generalSoft, border: `1px solid ${C.general}44` }}>
          <CheckCircle2 size={16} color={C.general} />
          <p className="text-sm" style={{ color: C.general }}>{publishedMsg === "draft" ? "Saved to drafts." : publishedMsg === "scheduled" ? "Notice scheduled." : "Notice published to the student board."}</p>
        </div>
      )}

      {step === "write" ? (
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* FORM */}
          <div className="space-y-4">
            <Card className="p-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="f-mono text-[10.5px]" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>NOTICE TITLE</label>
                  <button disabled={!form.content || aiLoading === "title"} onClick={() => run("title", () => AI.title(form.content)).then(() => {})} className="text-[11px] flex items-center gap-1 disabled:opacity-40" style={{ color: C.aiDeep }}>
                    {aiLoading === "title" ? <Loader2 size={11} className="animate-spin" /> : <Wand2 size={11} />} Generate title
                  </button>
                </div>
                <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Mid-Term Examination Schedule" className="w-full text-[15px] f-body rounded-lg px-3.5 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }} />
                {aiOut.title && !aiOut.title.error && (
                  <button onClick={() => set("title", aiOut.title)} className="mt-2 flex items-center gap-1.5">
                    <AIBlock title="Suggested title" icon={Wand2}>{aiOut.title} <span className="f-mono text-[10px] not-italic ml-1" style={{ color: C.aiDeep }}>· tap to use</span></AIBlock>
                  </button>
                )}
              </div>

              <div>
                <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>NOTICE DESCRIPTION / CONTENT</label>
                <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={9} placeholder="Write the full notice here..." className="w-full text-sm f-body rounded-lg px-3.5 py-3 outline-none leading-relaxed" style={{ border: `1px solid ${C.line}` }} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>DEPARTMENT</label>
                  <select value={form.department} onChange={(e) => set("department", e.target.value)} className="w-full text-sm rounded-lg px-3 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }}>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>COURSE / CLASS</label>
                  <input value={form.course} onChange={(e) => set("course", e.target.value)} placeholder="e.g. B.Tech CSE, Sem 2" className="w-full text-sm rounded-lg px-3 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }} />
                </div>
                <div>
                  <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>PRIORITY</label>
                  <div className="flex gap-2">
                    {Object.entries(PRIORITY_META).map(([k, m]) => (
                      <button key={k} onClick={() => set("priority", k)} className="flex-1 text-xs f-mono py-2 rounded-lg" style={{ background: form.priority === k ? m.color : C.paperDim, color: form.priority === k ? "#fff" : C.textDim }}>{m.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>TARGET STUDENTS</label>
                  <input value={form.targetAudience} onChange={(e) => set("targetAudience", e.target.value)} placeholder="e.g. All B.Tech, Sem 3" className="w-full text-sm rounded-lg px-3 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }} />
                </div>
                <div>
                  <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>PUBLISH DATE</label>
                  <input type="date" value={form.publishDate} onChange={(e) => set("publishDate", e.target.value)} className="w-full text-sm rounded-lg px-3 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }} />
                </div>
                <div>
                  <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>EXPIRY DATE</label>
                  <input type="date" value={form.expiryDate} onChange={(e) => set("expiryDate", e.target.value)} className="w-full text-sm rounded-lg px-3 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }} />
                </div>
              </div>
              <div>
                <label className="f-mono text-[10.5px] mb-1.5 block" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>ATTACHMENT</label>
                <div className="flex items-center gap-2 text-sm rounded-lg px-3 py-2.5" style={{ border: `1px dashed ${C.line}`, color: C.textFaint }}>
                  <Paperclip size={14} />
                  <input value={form.attachment} onChange={(e) => set("attachment", e.target.value)} placeholder="filename.pdf (optional, for demo)" className="flex-1 outline-none bg-transparent" />
                </div>
              </div>
            </Card>

            <div className="flex flex-wrap gap-2">
              <Btn variant="subtle" size="sm" onClick={() => publish("draft")} disabled={!form.title || !form.content}>Save as Draft</Btn>
              <Btn variant="ai" size="sm" icon={Sparkles} onClick={runQualityAndFaqs} disabled={!form.content || aiLoading}>
                {aiLoading && ["quality","faqs","summaryPreview"].includes(aiLoading) ? "Analyzing…" : "Run AI Preview →"}
              </Btn>
            </div>
          </div>

          {/* AI ASSISTANT PANEL */}
          <div className="space-y-3">
            <Card className="p-4" style={{ background: C.inkSoft, border: "none" }}>
              <div className="flex items-center gap-2 mb-1">
                <Bot size={16} color={C.ai} />
                <p className="f-display text-white font-semibold text-[15px]">AI Writing Assistant</p>
              </div>
              <p className="text-xs" style={{ color: "#AEB3CC" }}>Helps you write — you decide what to keep.</p>
            </Card>

            <Card className="p-4">
              <p className="f-mono text-[10px] mb-2.5" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>REWRITE WITH AI</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["improve", "Improve with AI", Wand2],
                  ["concise", "Make Concise", Scissors],
                  ["professional", "Make Professional", ShieldCheck],
                  ["detailed", "Make Detailed", Maximize2],
                  ["simplify", "Simplify Language", MessageCircle],
                  ["studentFriendly", "Student-Friendly", GraduationCap],
                ].map(([mode, label, Icon]) => (
                  <button key={mode} disabled={!form.content || aiLoading === mode} onClick={() => run(mode, () => AI.rewrite(form.content, mode))} className="flex items-center gap-1.5 text-[11.5px] f-body px-2.5 py-2 rounded-lg disabled:opacity-40" style={{ background: C.aiSoft, color: C.aiDeep }}>
                    {aiLoading === mode ? <Loader2 size={11} className="animate-spin" /> : <Icon size={11} />} {label}
                  </button>
                ))}
              </div>
              {["improve","concise","professional","detailed","simplify","studentFriendly"].map((mode) => aiOut[mode] && !aiOut[mode].error && (
                <div key={mode} className="mt-3">
                  <AIBlock title={`Rewritten (${mode})`} icon={Wand2}>
                    {aiOut[mode]}
                    <div className="mt-2 flex gap-2 not-italic f-body">
                      <button onClick={() => applyRewrite(aiOut[mode])} className="text-[11px] font-medium px-2 py-1 rounded" style={{ background: C.ai, color: "#fff" }}>Use this</button>
                      <button onClick={() => setAiOut((o) => ({ ...o, [mode]: undefined }))} className="text-[11px] font-medium px-2 py-1 rounded" style={{ background: "#fff", color: C.aiDeep }}>Dismiss</button>
                    </div>
                  </AIBlock>
                </div>
              ))}
            </Card>

            <Card className="p-4">
              <p className="f-mono text-[10px] mb-2.5" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>MORE AI TOOLS</p>
              <div className="space-y-2">
                <button disabled={!form.content || aiLoading === "missing"} onClick={() => run("missing", () => AI.missingInfo(form))} className="w-full flex items-center gap-1.5 text-[12.5px] f-body px-3 py-2 rounded-lg disabled:opacity-40" style={{ background: C.paperDim, color: C.text }}>
                  {aiLoading === "missing" ? <Loader2 size={12} className="animate-spin" /> : <ListChecks size={13} />} Check Missing Information
                </button>
                <button disabled={!form.content || aiLoading === "hi"} onClick={() => run("hi", () => AI.translate(form.content, "Hindi"))} className="w-full flex items-center gap-1.5 text-[12.5px] f-body px-3 py-2 rounded-lg disabled:opacity-40" style={{ background: C.paperDim, color: C.text }}>
                  {aiLoading === "hi" ? <Loader2 size={12} className="animate-spin" /> : <Languages size={13} />} Translate to Hindi
                </button>
              </div>
              {aiOut.missing && !aiOut.missing.error && (
                <div className="mt-3">
                  <AIBlock title="Missing information" icon={ListChecks} empty={aiOut.missing.length === 0 ? "Nothing important looks missing." : null}>
                    {aiOut.missing.length > 0 && <ul className="list-disc pl-4 space-y-1">{aiOut.missing.map((m, i) => <li key={i}>{m}</li>)}</ul>}
                  </AIBlock>
                </div>
              )}
              {aiOut.hi && !aiOut.hi.error && (
                <div className="mt-3"><AIBlock title="Hindi translation" icon={Languages}>{aiOut.hi}</AIBlock></div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        <NoticePreviewStep form={form} aiOut={aiOut} setAiOut={setAiOut} run={run} aiLoading={aiLoading} publish={publish} setStep={setStep} />
      )}
    </div>
  );
}

function NoticePreviewStep({ form, aiOut, setAiOut, run, aiLoading, publish, setStep }) {
  const quality = aiOut.quality && !aiOut.quality.error ? aiOut.quality : null;
  const faqs = aiOut.faqs && !aiOut.faqs.error ? aiOut.faqs : [];
  const summary = aiOut.summaryPreview && !aiOut.summaryPreview.error ? aiOut.summaryPreview : null;

  const updateFaq = (i, field, val) => {
    const copy = [...faqs]; copy[i] = { ...copy[i], [field]: val };
    setAiOut((o) => ({ ...o, faqs: copy }));
  };
  const removeFaq = (i) => setAiOut((o) => ({ ...o, faqs: faqs.filter((_, idx) => idx !== i) }));
  const addFaq = () => setAiOut((o) => ({ ...o, faqs: [...faqs, { q: "New question", a: "Answer" }] }));

  return (
    <div className="grid lg:grid-cols-[1fr_340px] gap-6 snx-in">
      <div className="space-y-5">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-2"><PriorityBadge priority={form.priority} /><span className="f-mono text-xs" style={{ color: C.textFaint }}>{form.department}</span></div>
          <h2 className="f-display text-xl font-semibold mb-3">{form.title || "Untitled notice"}</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: C.textDim }}>{form.content}</p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="f-mono text-[10.5px]" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>AI-GENERATED SUMMARY & FAQs (EDITABLE)</p>
          </div>
          <AIBlock title="Short summary" icon={Sparkles} loading={aiLoading === "summaryPreview"}>{summary?.summary}</AIBlock>
          {summary && (
            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="rounded-xl p-3.5" style={{ background: C.paperDim }}>
                <p className="f-mono text-[10px] mb-1.5" style={{ color: C.textFaint }}>KEY POINTS</p>
                <ul className="text-[13px] space-y-1 list-disc pl-4" style={{ color: C.text }}>{summary.keyPoints?.map((k, i) => <li key={i}>{k}</li>)}</ul>
              </div>
              <div className="rounded-xl p-3.5" style={{ background: C.paperDim }}>
                <p className="f-mono text-[10px] mb-1.5" style={{ color: C.textFaint }}>IMPORTANT DATES</p>
                {summary.importantDates?.length ? summary.importantDates.map((d, i) => (
                  <p key={i} className="text-[13px]" style={{ color: C.text }}><span style={{ color: C.textFaint }}>{d.label}:</span> {d.date}</p>
                )) : <p className="text-[13px]" style={{ color: C.textFaint }}>None specified.</p>}
              </div>
            </div>
          )}

          <div className="mt-4">
            <p className="f-mono text-[10px] mb-2" style={{ color: C.textFaint }}>AUTO-GENERATED FAQs</p>
            {aiLoading === "faqs" && <LoadingDots label="Generating FAQs" />}
            <div className="space-y-2">
              {faqs.map((f, i) => (
                <div key={i} className="rounded-xl p-3" style={{ background: C.aiSoft, borderLeft: `3px dashed ${C.ai}` }}>
                  <input value={f.q} onChange={(e) => updateFaq(i, "q", e.target.value)} className="w-full bg-transparent f-body text-[13px] font-semibold outline-none mb-1" style={{ color: C.aiDeep }} />
                  <textarea value={f.a} onChange={(e) => updateFaq(i, "a", e.target.value)} rows={2} className="w-full bg-transparent f-ai text-[13.5px] outline-none resize-none" style={{ color: "#0C4C4D" }} />
                  <button onClick={() => removeFaq(i)} className="f-mono text-[10px] mt-1" style={{ color: C.urgent }}>Remove</button>
                </div>
              ))}
            </div>
            <button onClick={addFaq} className="mt-2 text-xs font-medium" style={{ color: C.aiDeep }}>+ Add FAQ manually</button>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <Card className="p-4">
          <p className="f-mono text-[10px] mb-2" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>NOTICE QUALITY CHECK</p>
          {aiLoading === "quality" ? <LoadingDots label="Scoring" /> : quality ? (
            <>
              <div className="flex items-end gap-1.5 mb-3">
                <span className="f-display text-3xl font-bold" style={{ color: quality.score >= 80 ? C.general : quality.score >= 60 ? C.important : C.urgent }}>{quality.score}</span>
                <span className="text-sm mb-1" style={{ color: C.textFaint }}>/ 100</span>
              </div>
              <div className="space-y-1.5">
                {quality.checks?.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12.5px]">
                    {c.pass ? <CheckCircle2 size={13} color={C.general} /> : <AlertTriangle size={13} color={C.important} />}
                    <span style={{ color: c.pass ? C.text : C.textDim }}>{c.label}</span>
                  </div>
                ))}
              </div>
            </>
          ) : <p className="text-xs" style={{ color: C.textFaint }}>Run AI Preview from step 1 to see a score.</p>}
        </Card>

        <Card className="p-4 space-y-2">
          <p className="f-mono text-[10px] mb-1" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>PUBLISH</p>
          <Btn className="w-full" icon={Megaphone} onClick={() => publish("published")} disabled={!form.title || !form.content}>Publish Notice</Btn>
          <Btn className="w-full" variant="subtle" icon={Clock3} onClick={() => publish("scheduled")} disabled={!form.publishDate}>Schedule for Publish Date</Btn>
          <Btn className="w-full" variant="ghost" icon={PenLine} onClick={() => setStep("write")}>Back to Editing</Btn>
        </Card>
      </div>
    </div>
  );
}

/* ============================================================
   TEACHER: MY NOTICES
   ============================================================ */
function MyNotices({ notices, name }) {
  const [tab, setTab] = useState("published");
  const mine = notices.filter((n) => n.teacher === name || name === "Prof. R. Verma");
  const filtered = mine.filter((n) => n.status === tab);
  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto snx-in">
      <h1 className="f-display text-[24px] font-semibold mb-1">My Notices</h1>
      <p className="text-sm mb-5" style={{ color: C.textDim }}>Everything you've written, published or scheduled.</p>
      <div className="flex gap-2 mb-5">
        {["published", "draft", "scheduled"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className="f-mono text-xs px-3.5 py-1.5 rounded-full capitalize" style={{ background: tab === t ? C.ink : C.paperDim, color: tab === t ? "#fff" : C.textDim }}>{t} ({mine.filter((n) => n.status === t).length})</button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-sm" style={{ color: C.textFaint }}>Nothing here yet.</p>}
        {filtered.map((n) => (
          <Card key={n.id} className="p-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1.5"><PriorityBadge priority={n.priority} /><span className="f-mono text-[11px]" style={{ color: C.textFaint }}>{n.department}</span></div>
                <p className="f-display font-semibold text-[15px]" style={{ color: C.text }}>{n.title}</p>
                <p className="text-xs mt-1" style={{ color: C.textFaint }}>{n.course} · Published {n.publishDate || "—"}</p>
              </div>
              <div className="flex items-center gap-4 text-xs shrink-0" style={{ color: C.textDim }}>
                <span className="flex items-center gap-1"><Eye size={12} />{n.analytics.views}</span>
                <span className="flex items-center gap-1"><Sparkles size={12} />{n.analytics.summaryOpens}</span>
                <span className="flex items-center gap-1"><MessagesSquare size={12} />{n.analytics.questionsAsked}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TEACHER: ANALYTICS
   ============================================================ */
function TeacherAnalytics({ notices, name }) {
  const mine = notices.filter((n) => (n.teacher === name || name === "Prof. R. Verma") && n.status === "published");
  const totals = mine.reduce((a, n) => ({
    views: a.views + n.analytics.views,
    summaryOpens: a.summaryOpens + n.analytics.summaryOpens,
    questionsAsked: a.questionsAsked + n.analytics.questionsAsked,
    acknowledged: a.acknowledged + n.analytics.acknowledged,
  }), { views: 0, summaryOpens: 0, questionsAsked: 0, acknowledged: 0 });
  const topFaq = mine.flatMap((n) => n.faqs.map((f) => ({ ...f, notice: n.title })))[0];
  const mostViewed = [...mine].sort((a, b) => b.analytics.views - a.analytics.views)[0];

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto snx-in">
      <h1 className="f-display text-[24px] font-semibold mb-1">Analytics</h1>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>How students are engaging with your notices.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Views" value={totals.views} icon={Eye} accent={C.primary} />
        <StatCard label="AI Summaries Opened" value={totals.summaryOpens} icon={Sparkles} accent={C.ai} />
        <StatCard label="AI Questions Asked" value={totals.questionsAsked} icon={MessagesSquare} accent={C.important} />
        <StatCard label="Acknowledged" value={totals.acknowledged} icon={CheckCircle2} accent={C.general} />
      </div>

      {mostViewed && (
        <Card className="p-5 mb-5">
          <p className="f-mono text-[10.5px] mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>NOTICE ENGAGEMENT — {mostViewed.title.toUpperCase()}</p>
          <div className="grid grid-cols-4 gap-4">
            <div><p className="f-display text-xl font-semibold">{mostViewed.analytics.views}</p><p className="text-[11px]" style={{ color: C.textFaint }}>Views</p></div>
            <div><p className="f-display text-xl font-semibold">{mostViewed.analytics.summaryOpens}</p><p className="text-[11px]" style={{ color: C.textFaint }}>AI Summaries</p></div>
            <div><p className="f-display text-xl font-semibold">{mostViewed.analytics.questionsAsked}</p><p className="text-[11px]" style={{ color: C.textFaint }}>AI Questions</p></div>
            <div><p className="f-display text-xl font-semibold">{mostViewed.analytics.acknowledged}</p><p className="text-[11px]" style={{ color: C.textFaint }}>Acknowledged</p></div>
          </div>
          {topFaq && (
            <div className="mt-4 pt-4" style={{ borderTop: `1px solid ${C.line}` }}>
              <p className="f-mono text-[10px] mb-1" style={{ color: C.textFaint }}>MOST ASKED QUESTION</p>
              <p className="f-ai text-[15px]" style={{ color: C.aiDeep }}>"{topFaq.q}"</p>
            </div>
          )}
        </Card>
      )}

      <div className="space-y-2.5">
        {mine.map((n) => (
          <Card key={n.id} className="p-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm font-medium truncate max-w-xs" style={{ color: C.text }}>{n.title}</p>
            <div className="flex gap-5 text-xs" style={{ color: C.textDim }}>
              <span>{n.analytics.views} views</span>
              <span>{n.analytics.summaryOpens} summaries</span>
              <span>{n.analytics.questionsAsked} questions</span>
              <span>{Math.round((n.analytics.acknowledged / (n.audienceSize||1)) * 100)}% ack.</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   AI ASSISTANT PAGE (shared, contextual copy per role)
   ============================================================ */
function AIAssistantPage({ role }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: role === "teacher"
      ? "Hi! I can help you brainstorm notice wording, tone, or general writing questions. For rewriting an actual notice, use the AI panel on the Create Notice page so I stay grounded in your draft."
      : "Hi! I'm the general SmartNotice assistant. For questions about a specific notice, open that notice and use \"Ask AI\" there — I'll only use that notice's own content so I never guess." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async () => {
    if (!input.trim()) return;
    const q = input.trim();
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);
    try {
      const system = role === "teacher"
        ? "You are a helpful writing assistant for a college teacher using a notice-board app. Help with general notice-writing advice, tone, structure and best practices. Keep answers under 120 words."
        : "You are a helpful general assistant inside a college notice-board app. If asked about a *specific* notice's content, remind the student to open that notice and use its own 'Ask AI' box so the answer stays accurate to that notice. Otherwise help with general study/campus-life questions helpfully and briefly, under 100 words.";
      const text = await callClaude(system, q);
      setMessages((m) => [...m, { role: "ai", text }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "ai", text: "Sorry, I couldn't reach the AI service just now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl mx-auto snx-in flex flex-col" style={{ minHeight: "calc(100vh - 64px)" }}>
      <div className="flex items-center gap-2 mb-1"><Bot size={20} color={C.ai} /><h1 className="f-display text-[24px] font-semibold">AI Assistant</h1></div>
      <p className="text-sm mb-6" style={{ color: C.textDim }}>{role === "teacher" ? "General writing help for your notices." : "General help — notice-specific answers live inside each notice."}</p>
      <div className="flex-1 space-y-4 mb-4">
        {messages.map((m, i) => m.role === "ai" ? (
          <div key={i} className="max-w-[85%]"><AIBlock title="AI Assistant" icon={Bot}>{m.text}</AIBlock></div>
        ) : (
          <div key={i} className="max-w-[85%] ml-auto rounded-xl px-4 py-2.5" style={{ background: C.primary, color: "#fff" }}>
            <p className="text-sm">{m.text}</p>
          </div>
        ))}
        {loading && <AIBlock title="AI Assistant" icon={Bot} loading loadingLabel="Thinking" />}
        <div ref={endRef} />
      </div>
      <div className="flex gap-2 sticky bottom-4">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask something..." className="flex-1 text-sm rounded-lg px-4 py-3 outline-none" style={{ border: `1px solid ${C.line}`, background: C.card }} />
        <Btn icon={Send} onClick={send} disabled={loading}>Send</Btn>
      </div>
    </div>
  );
}

/* ============================================================
   STUDENT: OVERVIEW
   ============================================================ */
function StudentOverview({ notices, name, setView, openNotice }) {
  const published = notices.filter((n) => n.status === "published");
  const urgent = published.filter((n) => n.priority === "urgent");
  const recent = [...published].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4);
  const deadlines = published.filter((n) => n.expiryDate).sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)).slice(0, 4);

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto snx-in">
      <h1 className="f-display text-[26px] font-semibold mb-1">Good morning, {name.split(" ")[0]} 👋</h1>
      <p className="text-sm mb-7" style={{ color: C.textDim }}>{urgent.length} urgent notice{urgent.length !== 1 ? "s" : ""} need your attention.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <StatCard label="New Notices" value={published.length} icon={Megaphone} accent={C.primary} />
        <StatCard label="Upcoming Deadlines" value={deadlines.length} icon={Clock3} accent={C.important} />
        <StatCard label="Questions Asked" value={published.reduce((s,n)=>s+ (n.myQuestions||0),0)} icon={HelpCircle} accent={C.ai} />
        <StatCard label="Saved Notices" value={0} icon={Archive} accent={C.general} />
      </div>

      {urgent.length > 0 && (
        <div className="mb-7">
          <p className="f-mono text-[10.5px] mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>IMPORTANT NOTICES</p>
          <div className="grid md:grid-cols-2 gap-3">
            {urgent.slice(0, 4).map((n) => <NoticeCard key={n.id} n={n} onOpen={() => openNotice(n)} />)}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-7">
        <div>
          <p className="f-mono text-[10.5px] mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>RECENT NOTICES</p>
          <div className="space-y-2.5">
            {recent.map((n) => (
              <Card key={n.id} className="p-3.5 flex items-center justify-between cursor-pointer" onClick={() => openNotice(n)}>
                <div className="flex items-center gap-2.5 min-w-0"><PriorityBadge priority={n.priority} /><p className="text-sm font-medium truncate" style={{ color: C.text }}>{n.title}</p></div>
                <ChevronRight size={14} color={C.textFaint} className="shrink-0" />
              </Card>
            ))}
          </div>
        </div>
        <div>
          <p className="f-mono text-[10.5px] mb-3" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>UPCOMING DEADLINES</p>
          <div className="space-y-2.5">
            {deadlines.map((n) => (
              <Card key={n.id} className="p-3.5 flex items-center justify-between cursor-pointer" onClick={() => openNotice(n)}>
                <div className="min-w-0"><p className="text-sm font-medium truncate" style={{ color: C.text }}>{n.title}</p><p className="text-xs" style={{ color: C.textFaint }}>{n.department}</p></div>
                <span className="f-mono text-xs shrink-0" style={{ color: C.urgent }}>{n.expiryDate}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8"><Btn variant="ghost" onClick={() => setView("board")} icon={Megaphone}>Browse full notice board</Btn></div>
    </div>
  );
}

/* ============================================================
   NOTICE CARD (student board)
   ============================================================ */
function NoticeCard({ n, onOpen, onSummary, onAsk }) {
  return (
    <Card className="p-4.5 flex flex-col gap-2.5 hover:shadow-md transition-shadow" style={{ padding: 18 }}>
      <div className="flex items-center justify-between">
        <PriorityBadge priority={n.priority} />
        <span className="f-mono text-[10.5px]" style={{ color: C.textFaint }}>{n.publishDate}</span>
      </div>
      <p className="f-display font-semibold text-[16px] leading-snug" style={{ color: C.text }}>{n.title}</p>
      <p className="text-xs" style={{ color: C.textFaint }}>{n.department} · {n.course}</p>
      <p className="text-[13px] leading-relaxed line-clamp-2" style={{ color: C.textDim }}>{n.content}</p>
      {n.attachment && <p className="text-[11px] flex items-center gap-1" style={{ color: C.textFaint }}><Paperclip size={11} /> {n.attachment}</p>}
      <div className="flex flex-wrap gap-2 mt-1">
        <Btn size="sm" variant="ghost" onClick={onOpen}>Read Full Notice</Btn>
        <Btn size="sm" variant="aiGhost" icon={Sparkles} onClick={onSummary || onOpen}>AI Summary</Btn>
        <Btn size="sm" variant="subtle" icon={HelpCircle} onClick={onAsk || onOpen}>Ask AI</Btn>
      </div>
    </Card>
  );
}

/* ============================================================
   STUDENT: NOTICE BOARD (browse / filter / search)
   ============================================================ */
function NoticeBoard({ notices, search, openNotice }) {
  const [filter, setFilter] = useState("latest");
  const [dept, setDept] = useState("all");
  let list = notices.filter((n) => n.status === "published");

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.department.toLowerCase().includes(q));
  }
  if (dept !== "all") list = list.filter((n) => n.department === dept);
  if (filter === "latest") list = [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (filter === "priority") { const order = { urgent: 0, important: 1, general: 2 }; list = [...list].sort((a, b) => order[a.priority] - order[b.priority]); }
  if (filter === "expiring") list = [...list].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto snx-in">
      <h1 className="f-display text-[24px] font-semibold mb-1">Notice Board</h1>
      <p className="text-sm mb-5" style={{ color: C.textDim }}>{list.length} notice{list.length !== 1 ? "s" : ""}{search ? ` matching "${search}"` : ""}.</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {[["latest","Latest"],["priority","Priority"],["expiring","Expiring Soon"]].map(([k,l]) => (
          <button key={k} onClick={() => setFilter(k)} className="f-mono text-xs px-3 py-1.5 rounded-full" style={{ background: filter === k ? C.ink : C.paperDim, color: filter === k ? "#fff" : C.textDim }}>{l}</button>
        ))}
        <select value={dept} onChange={(e) => setDept(e.target.value)} className="f-mono text-xs px-3 py-1.5 rounded-full outline-none" style={{ background: C.paperDim, color: C.textDim, border: "none" }}>
          <option value="all">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {list.map((n) => <NoticeCard key={n.id} n={n} onOpen={() => openNotice(n, "read")} onSummary={() => openNotice(n, "summary")} onAsk={() => openNotice(n, "ask")} />)}
        {list.length === 0 && <p className="text-sm col-span-full" style={{ color: C.textFaint }}>No notices match your filters.</p>}
      </div>
    </div>
  );
}

/* ============================================================
   STUDENT: NOTICE DETAIL (summary + FAQ + chat)
   ============================================================ */
const SUGGESTED_Q = ["What is this notice about?", "What is the deadline?", "Where will it take place?", "Is attendance compulsory?", "What documents are required?"];

function NoticeDetail({ notice, onClose, updateNotice, initialTab }) {
  const [tab, setTab] = useState(initialTab === "summary" ? "summary" : initialTab === "ask" ? "ask" : "read");
  const [summary, setSummary] = useState(notice.aiSummary);
  const [sumLoading, setSumLoading] = useState(false);
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const viewedRef = useRef(false);
  const endRef = useRef(null);

  useEffect(() => {
    if (!viewedRef.current) {
      viewedRef.current = true;
      updateNotice(notice.id, (n) => ({ ...n, analytics: { ...n.analytics, views: n.analytics.views + 1 } }));
    }
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chat, chatLoading]);

  const loadSummary = async () => {
    if (summary) return;
    setSumLoading(true);
    try {
      const s = await AI.summarize(notice);
      setSummary(s);
      updateNotice(notice.id, (n) => ({ ...n, aiSummary: s, analytics: { ...n.analytics, summaryOpens: n.analytics.summaryOpens + 1 } }));
    } catch (e) {
      setSummary({ error: true });
    } finally {
      setSumLoading(false);
    }
  };

  useEffect(() => { if (tab === "summary") loadSummary(); }, [tab]);

  const ask = async (qOverride) => {
    const q = (qOverride || input).trim();
    if (!q) return;
    setChat((c) => [...c, { role: "user", text: q }]);
    setInput("");
    setChatLoading(true);
    updateNotice(notice.id, (n) => ({ ...n, analytics: { ...n.analytics, questionsAsked: n.analytics.questionsAsked + 1 } }));
    try {
      const a = await AI.answer(notice, q, chat);
      setChat((c) => [...c, { role: "ai", text: a }]);
    } catch (e) {
      setChat((c) => [...c, { role: "ai", text: "I couldn't reach the AI service just now. Please try again in a moment." }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 snx-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl bg-white flex flex-col" style={{ maxHeight: "92vh", background: C.card }}>
        <div className="flex items-center justify-between px-5 py-4 shrink-0" style={{ borderBottom: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2"><PriorityBadge priority={notice.priority} /><span className="f-mono text-[11px]" style={{ color: C.textFaint }}>{notice.department}</span></div>
          <button onClick={onClose}><X size={18} color={C.textFaint} /></button>
        </div>

        <div className="px-5 pt-4">
          <h2 className="f-display text-xl font-semibold leading-snug" style={{ color: C.text }}>{notice.title}</h2>
          <p className="text-xs mt-1" style={{ color: C.textFaint }}>{notice.course} · Published {notice.publishDate}</p>
        </div>

        <div className="flex gap-1 px-5 mt-4 shrink-0">
          {[["read","Notice"],["summary","AI Summary"],["faq","FAQ"],["ask","Ask AI"]].map(([k,l]) => (
            <button key={k} onClick={() => setTab(k)} className="f-mono text-[11px] px-3 py-1.5 rounded-full" style={{ background: tab === k ? C.ink : C.paperDim, color: tab === k ? "#fff" : C.textDim }}>{l}</button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto snx-scroll px-5 py-4">
          {tab === "read" && (
            <div className="snx-in">
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: C.text }}>{notice.content}</p>
              {notice.attachment && (
                <div className="mt-4 flex items-center gap-2 text-sm rounded-lg px-3 py-2.5" style={{ background: C.paperDim, color: C.textDim }}>
                  <Paperclip size={14} /> {notice.attachment} <span className="ml-auto f-mono text-[11px]" style={{ color: C.textFaint }}>View / Download</span>
                </div>
              )}
            </div>
          )}

          {tab === "summary" && (
            <div className="snx-in space-y-3">
              <AIBlock title="Summary" icon={Sparkles} loading={sumLoading}>{summary?.summary}</AIBlock>
              {summary && !summary.error && (
                <>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="rounded-xl p-3.5" style={{ background: C.paperDim }}>
                      <p className="f-mono text-[10px] mb-1.5" style={{ color: C.textFaint }}>KEY POINTS</p>
                      <ul className="text-[13px] space-y-1 list-disc pl-4">{summary.keyPoints?.map((k,i) => <li key={i}>{k}</li>)}</ul>
                    </div>
                    <div className="rounded-xl p-3.5" style={{ background: C.paperDim }}>
                      <p className="f-mono text-[10px] mb-1.5" style={{ color: C.textFaint }}>IMPORTANT DATES</p>
                      {summary.importantDates?.length ? summary.importantDates.map((d,i) => <p key={i} className="text-[13px]"><span style={{ color: C.textFaint }}>{d.label}:</span> {d.date}</p>) : <p className="text-[13px]" style={{ color: C.textFaint }}>None specified.</p>}
                    </div>
                  </div>
                  <div className="rounded-xl p-3.5" style={{ background: C.paperDim }}>
                    <p className="f-mono text-[10px] mb-1.5" style={{ color: C.textFaint }}>WHAT YOU NEED TO DO</p>
                    <ul className="text-[13px] space-y-1 list-disc pl-4">{summary.requiredActions?.map((a,i) => <li key={i}>{a}</li>)}</ul>
                  </div>
                  <div className="rounded-xl p-3.5" style={{ background: C.paperDim }}>
                    <p className="f-mono text-[10px] mb-1.5" style={{ color: C.textFaint }}>WHO IS AFFECTED</p>
                    <p className="text-[13px]">{summary.whoAffected}</p>
                  </div>
                </>
              )}
              {summary?.error && <p className="text-sm" style={{ color: C.urgent }}>Couldn't generate a summary right now — try again.</p>}
            </div>
          )}

          {tab === "faq" && (
            <div className="snx-in space-y-3">
              <p className="f-mono text-[10px]" style={{ color: C.textFaint, letterSpacing: "0.05em" }}>SUGGESTED QUESTIONS</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {SUGGESTED_Q.map((q) => <button key={q} onClick={() => { setTab("ask"); setTimeout(() => ask(q), 50); }} className="text-[12px] px-3 py-1.5 rounded-full" style={{ background: C.aiSoft, color: C.aiDeep }}>{q}</button>)}
              </div>
              {notice.faqs.length === 0 && <p className="text-sm" style={{ color: C.textFaint }}>No FAQs added for this notice yet — try Ask AI.</p>}
              {notice.faqs.map((f, i) => (
                <div key={i} className="rounded-xl p-3.5" style={{ background: C.aiSoft, borderLeft: `3px dashed ${C.ai}` }}>
                  <p className="text-[13.5px] font-semibold flex items-center gap-1.5" style={{ color: C.aiDeep }}><HelpCircle size={13} /> {f.q}</p>
                  <p className="f-ai text-[14.5px] mt-1" style={{ color: "#0C4C4D" }}>{f.a}</p>
                </div>
              ))}
            </div>
          )}

          {tab === "ask" && (
            <div className="snx-in flex flex-col" style={{ minHeight: 300 }}>
              <p className="f-mono text-[10px] mb-3 flex items-center gap-1" style={{ color: C.textFaint }}><ShieldCheck size={11} /> AI answers are based on this notice only.</p>
              <div className="flex-1 space-y-3">
                {chat.length === 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {SUGGESTED_Q.map((q) => <button key={q} onClick={() => ask(q)} className="text-[12px] px-3 py-1.5 rounded-full" style={{ background: C.paperDim, color: C.textDim }}>{q}</button>)}
                  </div>
                )}
                {chat.map((m, i) => m.role === "user" ? (
                  <div key={i} className="max-w-[85%] ml-auto rounded-xl px-3.5 py-2" style={{ background: C.primary, color: "#fff" }}><p className="text-sm">{m.text}</p></div>
                ) : (
                  <div key={i} className="max-w-[88%]"><AIBlock title="Ask AI" icon={HelpCircle}>{i === chat.length - 1 ? <TypingText text={m.text} /> : m.text}</AIBlock></div>
                ))}
                {chatLoading && <AIBlock title="Ask AI" icon={HelpCircle} loading loadingLabel="Reading the notice" />}
                <div ref={endRef} />
              </div>
              <div className="flex gap-2 mt-3 sticky bottom-0 bg-white pt-2">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask anything about this notice..." className="flex-1 text-sm rounded-lg px-3.5 py-2.5 outline-none" style={{ border: `1px solid ${C.line}` }} />
                <Btn icon={Send} onClick={() => ask()} disabled={chatLoading} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE (simple, shared)
   ============================================================ */
function ProfilePage({ role, name, onLogout }) {
  return (
    <div className="p-5 md:p-8 max-w-md mx-auto snx-in">
      <h1 className="f-display text-[24px] font-semibold mb-6">Profile</h1>
      <Card className="p-6 text-center">
        <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center f-display text-xl font-semibold text-white mb-3" style={{ background: C.primary }}>
          {name.split(" ").map((w) => w[0]).slice(0,2).join("")}
        </div>
        <p className="f-display text-lg font-semibold">{name}</p>
        <p className="text-xs capitalize mb-6" style={{ color: C.textFaint }}>{role} account</p>
        <Btn variant="danger" icon={LogOut} className="w-full" onClick={onLogout}>Log out</Btn>
      </Card>
    </div>
  );
}

/* ============================================================
   ROOT APP
   ============================================================ */
export default function App() {
  const [session, setSession] = useState(null); // {role, name}
  const [view, setView] = useState("overview");
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);
  const [activeNoticeTab, setActiveNoticeTab] = useState("read");

  const addNotice = (n) => setNotices((prev) => [n, ...prev]);
  const updateNotice = (id, fn) => setNotices((prev) => prev.map((n) => (n.id === id ? fn(n) : n)));

  const openNotice = (n, tab = "read") => { setActiveNotice(n); setActiveNoticeTab(tab); };

  if (!session) return <div className="f-body">{FONTS}<LoginScreen onLogin={(role, name) => { setSession({ role, name }); setView("overview"); }} /></div>;

  const activeFresh = activeNotice ? notices.find((n) => n.id === activeNotice.id) : null;

  return (
    <div className="f-body min-h-screen flex" style={{ background: C.paper }}>
      {FONTS}
      <Sidebar role={session.role} view={view} setView={setView} name={session.name} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 min-w-0">
        <TopBar role={session.role} notices={notices} search={search} setSearch={setSearch} onMenu={() => setMobileOpen(true)} showSearch={session.role === "student" && (view === "board" || view === "overview")} />

        {session.role === "teacher" && view === "overview" && <TeacherOverview notices={notices} name={session.name} setView={setView} />}
        {session.role === "teacher" && view === "create" && <CreateNotice addNotice={addNotice} name={session.name} />}
        {session.role === "teacher" && view === "mynotices" && <MyNotices notices={notices} name={session.name} />}
        {session.role === "teacher" && view === "analytics" && <TeacherAnalytics notices={notices} name={session.name} />}
        {session.role === "teacher" && view === "ai" && <AIAssistantPage role="teacher" />}

        {session.role === "student" && view === "overview" && <StudentOverview notices={notices} name={session.name} setView={setView} openNotice={openNotice} />}
        {session.role === "student" && view === "board" && <NoticeBoard notices={notices} search={search} openNotice={openNotice} />}
        {session.role === "student" && view === "ai" && <AIAssistantPage role="student" />}

        {view === "profile" && <ProfilePage role={session.role} name={session.name} onLogout={() => { setSession(null); setView("overview"); }} />}
      </div>

      {activeFresh && (
        <NoticeDetail notice={activeFresh} onClose={() => setActiveNotice(null)} updateNotice={updateNotice} initialTab={activeNoticeTab} />
      )}
    </div>
  );
}
