// ─── Navigation Links ───
export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Lawyers", href: "#search" },
  { label: "About", href: "#why-choose" },
  { label: "Contact", href: "#contact" },
];

// ─── Languages ───
export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
];

// ─── Trust Indicators ───
export const TRUST_INDICATORS = [
  { value: "500+", label: "Verified Lawyers" },
  { value: "25", label: "Districts Covered" },
  { value: "10K+", label: "Cases Handled" },
  { value: "99.9%", label: "Uptime" },
];

// ─── Specializations for Search ───
export const SPECIALIZATIONS = [
  "Criminal Law",
  "Family Law",
  "Corporate Law",
  "Property Law",
  "Labour Law",
  "Immigration Law",
  "Tax Law",
  "Constitutional Law",
  "Civil Law",
  "Environmental Law",
];

// ─── Districts ───
export const DISTRICTS = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Mullaitivu",
  "Vavuniya",
  "Trincomalee",
  "Batticaloa",
  "Ampara",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

// ─── Language Options for Search ───
export const LANGUAGE_OPTIONS = ["Sinhala", "Tamil", "English"];

// ─── Mock Lawyer Cards ───
export const MOCK_LAWYERS = [
  {
    id: 1,
    name: "Ayesha Perera",
    title: "Attorney-at-Law",
    specialization: "Family Law",
    district: "Colombo",
    languages: ["Sinhala", "English"],
    rating: 4.9,
    reviews: 128,
    experience: "12 years",
    verified: true,
    avatar: null,
  },
  {
    id: 2,
    name: "Kumaran Selvam",
    title: "Attorney-at-Law",
    specialization: "Criminal Law",
    district: "Jaffna",
    languages: ["Tamil", "English"],
    rating: 4.8,
    reviews: 96,
    experience: "15 years",
    verified: true,
    avatar: null,
  },
  {
    id: 3,
    name: "Dinesh Fernando",
    title: "Attorney-at-Law",
    specialization: "Corporate Law",
    district: "Gampaha",
    languages: ["Sinhala", "English"],
    rating: 4.7,
    reviews: 84,
    experience: "10 years",
    verified: true,
    avatar: null,
  },
];

// ─── How It Works Steps ───
export const CLIENT_STEPS = [
  {
    step: 1,
    title: "Search Lawyers",
    description: "Browse verified lawyers by specialization, district, and preferred language.",
  },
  {
    step: 2,
    title: "Book Appointment",
    description: "Schedule a consultation at your convenience with real-time availability.",
  },
  {
    step: 3,
    title: "Upload Documents",
    description: "Securely share case-related documents through our encrypted platform.",
  },
  {
    step: 4,
    title: "Track Progress",
    description: "Monitor your case status and receive updates in real time.",
  },
];

export const LAWYER_STEPS = [
  {
    step: 1,
    title: "Register & Verify",
    description: "Create your profile and get verified through BASL credentials.",
  },
  {
    step: 2,
    title: "Manage Schedule",
    description: "Set your availability and manage appointments efficiently.",
  },
  {
    step: 3,
    title: "Handle Cases",
    description: "Access case files, documents, and communicate with clients securely.",
  },
  {
    step: 4,
    title: "Grow Practice",
    description: "Build your reputation with ratings, reviews, and a professional profile.",
  },
];

export const ADMIN_STEPS = [
  {
    step: 1,
    title: "Verify Lawyers",
    description: "Review and approve lawyer registrations with BASL validation.",
  },
  {
    step: 2,
    title: "Monitor System",
    description: "Track platform metrics, user activity, and system health.",
  },
  {
    step: 3,
    title: "Manage Content",
    description: "Control platform content, announcements, and policies.",
  },
  {
    step: 4,
    title: "Generate Reports",
    description: "Access analytics and generate comprehensive platform reports.",
  },
];

// ─── Features ───
export const FEATURES = [
  {
    title: "Secure Document Upload",
    description:
      "End-to-end encrypted document storage ensuring your sensitive legal documents remain confidential and protected.",
    icon: "Shield",
  },
  {
    title: "Appointment Booking",
    description:
      "Seamless scheduling system with real-time availability, reminders, and calendar integration.",
    icon: "Calendar",
  },
  {
    title: "Case Tracking",
    description:
      "Real-time case progress monitoring with milestone tracking, status updates, and timeline visualization.",
    icon: "FileSearch",
  },
  {
    title: "Verified Lawyers",
    description:
      "Every lawyer is BASL-verified with credential checks ensuring you connect with legitimate legal professionals.",
    icon: "BadgeCheck",
  },
  {
    title: "Multi-language Support",
    description:
      "Full platform support in Sinhala, Tamil, and English — making justice accessible across all communities.",
    icon: "Languages",
  },
  {
    title: "Smart Notifications",
    description:
      "Stay informed with intelligent notifications for appointments, case updates, and important deadlines.",
    icon: "Bell",
  },
];

// ─── Why Choose Us ───
export const WHY_CHOOSE = [
  {
    title: "Built for Sri Lanka",
    description:
      "Designed specifically for the Sri Lankan legal ecosystem with support for all three official languages and local legal frameworks.",
    icon: "MapPin",
  },
  {
    title: "Bank-Grade Security",
    description:
      "256-bit encryption, secure document vaults, and privacy-first architecture ensuring your data stays protected.",
    icon: "Lock",
  },
  {
    title: "BASL Compliance",
    description:
      "Every lawyer verified against Bar Association of Sri Lanka records. No unverified practitioners on our platform.",
    icon: "Scale",
  },
  {
    title: "Complete Transparency",
    description:
      "Clear fee structures, genuine reviews, and transparent communication. No hidden charges or surprises.",
    icon: "Eye",
  },
];

// ─── Future Vision ───
export const FUTURE_VISION = [
  {
    title: "Mobile Application",
    description: "Native iOS and Android apps for on-the-go legal management and consultations.",
    icon: "Smartphone",
    status: "Coming 2027",
  },
  {
    title: "Video Consultation",
    description:
      "Secure, HD video calls with screen sharing for remote legal consultations across Sri Lanka.",
    icon: "Video",
    status: "Coming 2027",
  },
  {
    title: "AI Legal Assistant",
    description:
      "Intelligent case matching and preliminary legal guidance powered by AI trained on Sri Lankan law.",
    icon: "Brain",
    status: "In Research",
  },
  {
    title: "Integrated Payments",
    description:
      "Secure payment gateway supporting local banks, mobile payments, and international transactions.",
    icon: "CreditCard",
    status: "Coming 2027",
  },
];

// ─── Testimonials ───
export const TESTIMONIALS = [
  {
    name: "Priya Wickramasinghe",
    role: "Business Owner, Colombo",
    content:
      "SL-LMS helped me find the perfect corporate lawyer within minutes. The verification system gave me complete confidence in my choice. Highly recommended!",
    rating: 5,
  },
  {
    name: "Tharushi De Silva",
    role: "Teacher, Kandy",
    content:
      "I was worried about finding a family lawyer who speaks Sinhala in my district. SL-LMS made it incredibly easy. The whole process was smooth and professional.",
    rating: 5,
  },
  {
    name: "Rajiv Navaratnam",
    role: "Engineer, Jaffna",
    content:
      "As a Tamil speaker, finding legal services was always challenging. SL-LMS bridges that gap beautifully. The multi-language support is a game changer.",
    rating: 5,
  },
];

// ─── Footer Links ───
export const FOOTER_LINKS = {
  platform: [
    { label: "Find Lawyers", href: "#search" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Features", href: "#features" },
    { label: "Register as Lawyer", href: "#register" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
  resources: [
    { label: "Help Center", href: "/help" },
    { label: "Blog", href: "/blog" },
    { label: "FAQs", href: "/faq" },
    { label: "API Documentation", href: "/api-docs" },
  ],
};
