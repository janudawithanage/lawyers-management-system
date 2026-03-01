/**
 * ══════════════════════════════════════════════════════════════
 * SL-LMS CLIENT — Comprehensive Mock Data Layer
 * ══════════════════════════════════════════════════════════════
 *
 * Realistic Sri Lankan legal domain data for all client features.
 * Structured to mirror the eventual API response shapes.
 *
 * API Mapping:
 *   overviewStats       → GET /api/v1/client/stats
 *   appointments        → GET /api/v1/client/appointments
 *   cases               → GET /api/v1/client/cases
 *   recentActivity      → GET /api/v1/client/activity
 *   lawyers             → GET /api/v1/lawyers/search
 *   documents           → GET /api/v1/client/documents
 *   clientProfile       → GET /api/v1/client/profile
 *   specializations     → GET /api/v1/metadata/specializations
 *   districts           → GET /api/v1/metadata/districts
 *   languages           → GET /api/v1/metadata/languages
 *   timeSlots           → GET /api/v1/appointments/slots
 */

// ══════════════════════════════════════════════════════════════
//  METADATA & FILTER OPTIONS
// ══════════════════════════════════════════════════════════════

export const specializations = [
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Corporate Law",
  "Labour Law",
  "Immigration Law",
  "Tax Law",
  "Constitutional Law",
  "Environmental Law",
  "Intellectual Property",
  "Maritime Law",
  "Human Rights Law",
  "Banking & Finance",
  "Insurance Law",
  "Cyber Law",
];

export const districts = [
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

export const languages = [
  "Sinhala",
  "Tamil",
  "English",
  "Sinhala & English",
  "Tamil & English",
  "All Three",
];

// ══════════════════════════════════════════════════════════════
//  LAWYER DIRECTORY (for Search Lawyers page)
// ══════════════════════════════════════════════════════════════

export const lawyers = [
  {
    lawyer_id: "LWR-001",
    name: "Atty. Kamal Perera",
    specialization: "Criminal Law",
    district: "Colombo",
    rating: 4.8,
    verified: true,
    experience: 15,
    cases_won: 142,
    cases_total: 168,
    consultationFee: 5000,
    languages: ["Sinhala", "English"],
    bio: "Senior criminal law practitioner with over 15 years of experience in the Colombo High Court. Specializes in bail applications, murder trials, financial crime defence, and appellate advocacy. Recognized by the Bar Association of Sri Lanka for outstanding criminal defence work.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2011/CR/1024",
    email: "kamal.perera@sllegal.lk",
    phone: "+94 11 234 5678",
    profile_picture: "https://randomuser.me/api/portraits/men/32.jpg",
    education: "LLB (Colombo), Attorney-at-Law (SLLS)",
    office_address: "42 Hulftsdorp Street, Colombo 12",
    reviews: [
      { id: "R001", client_name: "Nimal S.", rating: 5, comment: "Exceptional criminal defence lawyer. Handled my case with utmost professionalism and secured the best outcome.", date: "2026-02-10" },
      { id: "R002", client_name: "Dinesh K.", rating: 5, comment: "Very thorough preparation and excellent courtroom presence. Highly recommended.", date: "2026-01-22" },
      { id: "R003", client_name: "Priya M.", rating: 4, comment: "Professional and knowledgeable. Kept me informed throughout the process.", date: "2025-12-15" },
      { id: "R004", client_name: "Ajith W.", rating: 5, comment: "The best criminal lawyer in Colombo. Worth every rupee.", date: "2025-11-08" },
    ],
  },
  {
    lawyer_id: "LWR-002",
    name: "Atty. Nimalka Fernando",
    specialization: "Family Law",
    district: "Kandy",
    rating: 4.9,
    verified: true,
    experience: 12,
    cases_won: 98,
    cases_total: 115,
    consultationFee: 4500,
    languages: ["Sinhala", "English"],
    bio: "Renowned family law specialist handling custody, divorce, and matrimonial disputes with compassion and expertise. Provides mediation and litigation services for families across the Central Province. Known for her empathetic approach and strong advocacy in child welfare cases.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2014/FM/2048",
    email: "nimalka.fernando@sllegal.lk",
    phone: "+94 81 234 5679",
    profile_picture: "https://randomuser.me/api/portraits/women/44.jpg",
    education: "LLB (Peradeniya), LLM Family Law (London)",
    office_address: "15 Dalada Veediya, Kandy",
    reviews: [
      { id: "R005", client_name: "Samanthi P.", rating: 5, comment: "She handled my custody case with incredible sensitivity. Truly cares about her clients.", date: "2026-02-18" },
      { id: "R006", client_name: "Kumara J.", rating: 5, comment: "Outstanding mediation skills. Resolved our divorce amicably.", date: "2026-01-05" },
      { id: "R007", client_name: "Anoma D.", rating: 5, comment: "The best family lawyer in Kandy. Very patient and understanding.", date: "2025-12-20" },
    ],
  },
  {
    lawyer_id: "LWR-003",
    name: "Atty. Ranjan de Silva",
    specialization: "Property Law",
    district: "Galle",
    rating: 4.7,
    verified: true,
    experience: 20,
    cases_won: 215,
    cases_total: 248,
    consultationFee: 6000,
    languages: ["Sinhala", "English"],
    bio: "Expert in property disputes, land partition cases, and real estate transactions across the Southern Province. Two decades of experience handling complex land registry matters, encroachment disputes, and property title verification.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2006/PR/0512",
    email: "ranjan.desilva@sllegal.lk",
    phone: "+94 91 456 7890",
    profile_picture: "https://randomuser.me/api/portraits/men/45.jpg",
    education: "LLB (Colombo), Notary Public",
    office_address: "78 Church Street, Galle Fort",
    reviews: [
      { id: "R008", client_name: "Bandula R.", rating: 5, comment: "Resolved a 10-year land dispute efficiently. Extremely knowledgeable in property law.", date: "2026-02-01" },
      { id: "R009", client_name: "Sunil W.", rating: 4, comment: "Good experience overall. Very detailed in document preparation.", date: "2025-11-30" },
      { id: "R010", client_name: "Malini F.", rating: 5, comment: "Excellent property lawyer. Saved us from a fraudulent transaction.", date: "2025-10-15" },
    ],
  },
  {
    lawyer_id: "LWR-004",
    name: "Atty. Dilini Jayawardena",
    specialization: "Corporate Law",
    district: "Colombo",
    rating: 4.6,
    verified: true,
    experience: 8,
    cases_won: 64,
    cases_total: 78,
    consultationFee: 7500,
    languages: ["English"],
    bio: "Corporate law expert specializing in mergers, acquisitions, and commercial litigation. Advises multinational companies and BOI enterprises on regulatory compliance, shareholder agreements, and corporate governance.",
    avatar: null,
    available: false,
    bar_registration_number: "BASL/2018/CO/3156",
    email: "dilini.jayawardena@sllegal.lk",
    phone: "+94 11 567 8901",
    profile_picture: "https://randomuser.me/api/portraits/women/65.jpg",
    education: "LLB (Colombo), MBA (AIT Bangkok)",
    office_address: "Level 12, World Trade Center, Colombo 01",
    reviews: [
      { id: "R011", client_name: "Roshan T.", rating: 5, comment: "Excellent corporate counsel. Handled our M&A transaction flawlessly.", date: "2026-01-28" },
      { id: "R012", client_name: "Chathura M.", rating: 4, comment: "Very professional. Good understanding of commercial law.", date: "2025-12-05" },
    ],
  },
  {
    lawyer_id: "LWR-005",
    name: "Atty. Thilini Ratnayake",
    specialization: "Labour Law",
    district: "Colombo",
    rating: 4.5,
    verified: true,
    experience: 10,
    cases_won: 87,
    cases_total: 102,
    consultationFee: 4000,
    languages: ["Sinhala", "English"],
    bio: "Labour tribunal specialist handling wrongful termination, industrial disputes, and employee rights cases. Advocates for fair workplace practices and has represented both employers and employees in complex labour matters.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2016/LB/2890",
    email: "thilini.ratnayake@sllegal.lk",
    phone: "+94 11 678 9012",
    profile_picture: "https://randomuser.me/api/portraits/women/33.jpg",
    education: "LLB (Open University), Diploma in HR Management",
    office_address: "22 Union Place, Colombo 02",
    reviews: [
      { id: "R013", client_name: "Suresh N.", rating: 5, comment: "Won my wrongful termination case. Very dedicated and hardworking.", date: "2026-02-12" },
      { id: "R014", client_name: "Kalyani S.", rating: 4, comment: "Good legal advice on employment contracts. Responsive communication.", date: "2025-11-18" },
      { id: "R015", client_name: "Ravi P.", rating: 5, comment: "Excellent labour law knowledge. Helped negotiate a fair severance package.", date: "2025-09-25" },
    ],
  },
  {
    lawyer_id: "LWR-006",
    name: "Atty. Suresh Kumar",
    specialization: "Immigration Law",
    district: "Jaffna",
    rating: 4.4,
    verified: true,
    experience: 7,
    cases_won: 53,
    cases_total: 65,
    consultationFee: 5500,
    languages: ["Tamil", "English"],
    bio: "Immigration and visa law expert assisting Sri Lankan diaspora communities. Handles work permits, residency applications, deportation defence, and citizenship matters with a focus on the Northern Province community.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2019/IM/3578",
    email: "suresh.kumar@sllegal.lk",
    phone: "+94 21 345 6789",
    profile_picture: "https://randomuser.me/api/portraits/men/38.jpg",
    education: "LLB (Jaffna), Certificate in Immigration Law (UK)",
    office_address: "5 Hospital Road, Jaffna",
    reviews: [
      { id: "R016", client_name: "Thanaraj V.", rating: 5, comment: "Helped my family with visa applications. Very knowledgeable about immigration law.", date: "2026-01-15" },
      { id: "R017", client_name: "Meena K.", rating: 4, comment: "Good service. Communication was clear and timely.", date: "2025-10-20" },
    ],
  },
  {
    lawyer_id: "LWR-007",
    name: "Atty. Priyanka Weerasinghe",
    specialization: "Constitutional Law",
    district: "Colombo",
    rating: 4.9,
    verified: true,
    experience: 25,
    cases_won: 310,
    cases_total: 345,
    consultationFee: 10000,
    languages: ["Sinhala", "English"],
    bio: "Distinguished constitutional lawyer and Supreme Court practitioner with 25 years of experience in fundamental rights petitions, judicial review, and constitutional interpretation. President's Counsel nominee and frequent legal commentator.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2001/CN/0098",
    email: "priyanka.weerasinghe@sllegal.lk",
    phone: "+94 11 789 0123",
    profile_picture: "https://randomuser.me/api/portraits/men/61.jpg",
    education: "LLB (Colombo), LLM Constitutional Law (Harvard), PhD Law (Oxford)",
    office_address: "Supreme Court Complex, Hulftsdorp, Colombo 12",
    reviews: [
      { id: "R018", client_name: "Gamini H.", rating: 5, comment: "The most brilliant legal mind in Sri Lanka. Won our fundamental rights case.", date: "2026-02-20" },
      { id: "R019", client_name: "Indrani M.", rating: 5, comment: "Incredible knowledge and courtroom presence. A true authority in constitutional law.", date: "2026-01-10" },
      { id: "R020", client_name: "Saman L.", rating: 5, comment: "World-class legal representation. Worth the premium fee.", date: "2025-11-28" },
      { id: "R021", client_name: "Rohan B.", rating: 4, comment: "Very experienced but can be hard to schedule. Quality is unmatched.", date: "2025-10-05" },
    ],
  },
  {
    lawyer_id: "LWR-008",
    name: "Atty. Mohamed Farook",
    specialization: "Tax Law",
    district: "Colombo",
    rating: 4.3,
    verified: false,
    experience: 6,
    cases_won: 41,
    cases_total: 52,
    consultationFee: 4500,
    languages: ["English", "Tamil"],
    bio: "Tax planning and dispute resolution specialist with prior experience at the Inland Revenue Department (IRD). Assists businesses and individuals with tax compliance, audits, and appeals before the Tax Appeals Commission.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2020/TX/4102",
    email: "mohamed.farook@sllegal.lk",
    phone: "+94 11 890 1234",
    profile_picture: "https://randomuser.me/api/portraits/women/72.jpg",
    education: "LLB (Colombo), ACCA Qualified",
    office_address: "88 Galle Road, Colombo 04",
    reviews: [
      { id: "R022", client_name: "Ismail A.", rating: 4, comment: "Helped resolve our tax dispute efficiently. Good understanding of IRD procedures.", date: "2026-01-08" },
      { id: "R023", client_name: "Fathima H.", rating: 5, comment: "Excellent tax advisory. Saved our company significant amounts.", date: "2025-10-15" },
    ],
  },
  {
    lawyer_id: "LWR-009",
    name: "Atty. Chaminda Bandara",
    specialization: "Environmental Law",
    district: "Kurunegala",
    rating: 4.2,
    verified: true,
    experience: 9,
    cases_won: 35,
    cases_total: 44,
    consultationFee: 3500,
    languages: ["Sinhala"],
    bio: "Environmental law advocate working on conservation, pollution, and natural resource cases across North Western Province. Collaborates with environmental NGOs on landmark environmental protection litigation.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2017/EN/3012",
    email: "chaminda.bandara@sllegal.lk",
    phone: "+94 37 234 5678",
    profile_picture: "https://randomuser.me/api/portraits/men/55.jpg",
    education: "LLB (Kelaniya), MSc Environmental Science",
    office_address: "12 Negombo Road, Kurunegala",
    reviews: [
      { id: "R024", client_name: "Wimal G.", rating: 4, comment: "Good environmental law expertise. Helped with our EIA challenge.", date: "2025-12-10" },
      { id: "R025", client_name: "Nilantha S.", rating: 4, comment: "Dedicated advocate for environmental causes. Affordable rates.", date: "2025-09-18" },
    ],
  },
  {
    lawyer_id: "LWR-010",
    name: "Atty. Samantha Wickremasinghe",
    specialization: "Intellectual Property",
    district: "Colombo",
    rating: 4.7,
    verified: true,
    experience: 11,
    cases_won: 76,
    cases_total: 89,
    consultationFee: 8000,
    languages: ["Sinhala", "English"],
    bio: "Intellectual property and patent law specialist advising tech startups, creative agencies, and innovators. Expert in trademark registration, copyright protection, and patent filing before the National IP Office.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2015/IP/2654",
    email: "samantha.wickremasinghe@sllegal.lk",
    phone: "+94 11 901 2345",
    profile_picture: "https://randomuser.me/api/portraits/women/51.jpg",
    education: "LLB (Colombo), LLM Intellectual Property (Singapore)",
    office_address: "Orion City IT Park, Colombo 09",
    reviews: [
      { id: "R026", client_name: "Tharindu P.", rating: 5, comment: "Protected our startup's IP brilliantly. Very tech-savvy lawyer.", date: "2026-02-05" },
      { id: "R027", client_name: "Amaya D.", rating: 5, comment: "Excellent patent filing service. Smooth and professional.", date: "2025-12-22" },
      { id: "R028", client_name: "Nuwan B.", rating: 4, comment: "Good trademark registration guidance. Reasonable turnaround.", date: "2025-10-30" },
    ],
  },
  {
    lawyer_id: "LWR-011",
    name: "Atty. Arjuna Mahendran",
    specialization: "Banking & Finance",
    district: "Colombo",
    rating: 4.6,
    verified: true,
    experience: 14,
    cases_won: 112,
    cases_total: 130,
    consultationFee: 7000,
    languages: ["Sinhala", "English"],
    bio: "Banking regulation and financial compliance expert. Advises commercial banks, finance companies, and fintechs on CBSL regulations, anti-money laundering compliance, and financial dispute resolution.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2012/BF/1256",
    email: "arjuna.mahendran@sllegal.lk",
    phone: "+94 11 012 3456",
    profile_picture: "https://randomuser.me/api/portraits/men/67.jpg",
    education: "LLB (Colombo), CFA Level II, MSc Banking & Finance (LSE)",
    office_address: "28 York Street, Colombo 01",
    reviews: [
      { id: "R029", client_name: "Malik R.", rating: 5, comment: "Outstanding banking law expertise. Resolved our regulatory compliance issues.", date: "2026-01-20" },
      { id: "R030", client_name: "Chamari S.", rating: 4, comment: "Professional and detail-oriented. Good advice on loan documentation.", date: "2025-11-12" },
    ],
  },
  {
    lawyer_id: "LWR-012",
    name: "Atty. Kavitha Nadarajah",
    specialization: "Human Rights Law",
    district: "Batticaloa",
    rating: 4.8,
    verified: true,
    experience: 16,
    cases_won: 130,
    cases_total: 155,
    consultationFee: 3000,
    languages: ["Tamil", "English"],
    bio: "Human rights defender with extensive experience in the Eastern Province. Advocates for displaced communities, minority rights, and post-conflict justice. Works with international human rights organizations and the Human Rights Commission.",
    avatar: null,
    available: true,
    bar_registration_number: "BASL/2010/HR/0876",
    email: "kavitha.nadarajah@sllegal.lk",
    phone: "+94 65 234 5678",
    profile_picture: "https://randomuser.me/api/portraits/women/48.jpg",
    education: "LLB (Eastern), LLM International Human Rights (Geneva)",
    office_address: "4 Bar Road, Batticaloa",
    reviews: [
      { id: "R031", client_name: "Selvi T.", rating: 5, comment: "A true champion of human rights. Fought tirelessly for our community.", date: "2026-02-15" },
      { id: "R032", client_name: "Kajan M.", rating: 5, comment: "Incredible dedication to justice. Goes above and beyond for her clients.", date: "2026-01-02" },
      { id: "R033", client_name: "Nirmala P.", rating: 5, comment: "The most compassionate lawyer I have ever worked with.", date: "2025-11-25" },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
//  OVERVIEW STATISTICS
// ══════════════════════════════════════════════════════════════

export const overviewStats = [
  {
    id: "active-cases",
    label: "Active Cases",
    value: 3,
    change: "+1",
    changeType: "increase",
    period: "this month",
    icon: "briefcase",
  },
  {
    id: "appointments",
    label: "Upcoming Appointments",
    value: 2,
    change: "Next: Tomorrow",
    changeType: "neutral",
    period: "",
    icon: "calendar",
  },
  {
    id: "documents",
    label: "Documents Uploaded",
    value: 14,
    change: "+3",
    changeType: "increase",
    period: "this week",
    icon: "file",
  },
  {
    id: "connections",
    label: "Lawyer Connections",
    value: 5,
    change: "All verified",
    changeType: "neutral",
    period: "",
    icon: "shield",
  },
];

// ══════════════════════════════════════════════════════════════
//  APPOINTMENTS (Full list for My Appointments page)
// ══════════════════════════════════════════════════════════════

export const appointments = [
  {
    id: "APT-2026-001",
    lawyerName: "Atty. Kamal Perera",
    lawyerSpecialization: "Criminal Law",
    dateTime: "2026-03-01T10:00:00",
    duration: 45,
    status: "scheduled",
    type: "video",
    location: "Colombo 07",
    notes: "Bring all police reports and witness statements.",
  },
  {
    id: "APT-2026-002",
    lawyerName: "Atty. Nimalka Fernando",
    lawyerSpecialization: "Family Law",
    dateTime: "2026-03-04T14:30:00",
    duration: 60,
    status: "scheduled",
    type: "in-office",
    location: "Kandy",
    notes: "Discussion regarding custody arrangement options.",
  },
  {
    id: "APT-2026-003",
    lawyerName: "Atty. Ranjan de Silva",
    lawyerSpecialization: "Property Law",
    dateTime: "2026-02-20T09:00:00",
    duration: 30,
    status: "completed",
    type: "phone",
    location: null,
    notes: "Reviewed land deed and partition plan.",
  },
  {
    id: "APT-2026-004",
    lawyerName: "Atty. Dilini Jayawardena",
    lawyerSpecialization: "Corporate Law",
    dateTime: "2026-02-15T11:00:00",
    duration: 45,
    status: "cancelled",
    type: "video",
    location: null,
    notes: "Client requested reschedule.",
  },
  {
    id: "APT-2026-005",
    lawyerName: "Atty. Thilini Ratnayake",
    lawyerSpecialization: "Labour Law",
    dateTime: "2026-02-10T15:00:00",
    duration: 60,
    status: "completed",
    type: "in-office",
    location: "Colombo 03",
    notes: "Initial consultation — documented employment timeline.",
  },
  {
    id: "APT-2026-006",
    lawyerName: "Atty. Kamal Perera",
    lawyerSpecialization: "Criminal Law",
    dateTime: "2026-03-10T09:30:00",
    duration: 45,
    status: "scheduled",
    type: "in-office",
    location: "Colombo 07",
    notes: "Follow-up meeting regarding bail hearing preparation.",
  },
  {
    id: "APT-2026-007",
    lawyerName: "Atty. Priyanka Weerasinghe",
    lawyerSpecialization: "Constitutional Law",
    dateTime: "2026-01-25T10:00:00",
    duration: 90,
    status: "completed",
    type: "video",
    location: null,
    notes: "Fundamental rights petition discussion.",
  },
];

// ══════════════════════════════════════════════════════════════
//  CASES (Full list for My Cases page)
// ══════════════════════════════════════════════════════════════

export const cases = [
  {
    id: "CASE-2026-1024",
    title: "Property Dispute — Land Partition",
    lawyerName: "Atty. Ranjan de Silva",
    status: "hearing_scheduled",
    progress: 65,
    nextHearing: "2026-03-12",
    court: "Colombo District Court",
    updatedAt: "2026-02-27T14:30:00",
    filedDate: "2025-06-15",
    description: "Partition action regarding inherited property in Galle district. Involves three co-owners seeking equitable division of the land parcel bearing assessment No. 45/2, Unawatuna.",
    timeline: [
      { date: "2025-06-15", event: "Case Filed", status: "completed" },
      { date: "2025-08-20", event: "First Hearing", status: "completed" },
      { date: "2025-11-10", event: "Surveyor Report Submitted", status: "completed" },
      { date: "2026-01-22", event: "Objections Heard", status: "completed" },
      { date: "2026-03-12", event: "Next Hearing", status: "upcoming" },
      { date: null, event: "Final Decree", status: "pending" },
    ],
  },
  {
    id: "CASE-2026-0987",
    title: "Employment Wrongful Termination",
    lawyerName: "Atty. Nimalka Fernando",
    status: "in_progress",
    progress: 40,
    nextHearing: "2026-03-20",
    court: "Labour Tribunal — Colombo",
    updatedAt: "2026-02-25T09:15:00",
    filedDate: "2025-09-01",
    description: "Claim against former employer for unfair dismissal under the Shop & Office Act. Seeking reinstatement and compensation for lost wages.",
    timeline: [
      { date: "2025-09-01", event: "Complaint Filed", status: "completed" },
      { date: "2025-10-15", event: "Employer Response", status: "completed" },
      { date: "2026-01-08", event: "Evidence Submission", status: "completed" },
      { date: "2026-03-20", event: "Cross-examination", status: "upcoming" },
      { date: null, event: "Tribunal Decision", status: "pending" },
    ],
  },
  {
    id: "CASE-2026-0812",
    title: "Motor Accident Compensation",
    lawyerName: "Atty. Kamal Perera",
    status: "filed",
    progress: 15,
    nextHearing: null,
    court: "Magistrate's Court — Kandy",
    updatedAt: "2026-02-22T16:45:00",
    filedDate: "2026-01-10",
    description: "Compensation claim following road traffic accident on A1 highway. Medical expenses and vehicle damage recovery.",
    timeline: [
      { date: "2026-01-10", event: "Case Filed", status: "completed" },
      { date: "2026-02-05", event: "Police Report Obtained", status: "completed" },
      { date: null, event: "First Hearing Date TBD", status: "pending" },
    ],
  },
  {
    id: "CASE-2025-0654",
    title: "Tenancy Agreement Dispute",
    lawyerName: "Atty. Ranjan de Silva",
    status: "closed",
    progress: 100,
    nextHearing: null,
    court: "Colombo District Court",
    updatedAt: "2025-12-15T11:00:00",
    filedDate: "2025-03-20",
    description: "Dispute with landlord over tenancy agreement violations. Successfully resolved with favorable settlement.",
    timeline: [
      { date: "2025-03-20", event: "Case Filed", status: "completed" },
      { date: "2025-05-10", event: "Mediation Attempted", status: "completed" },
      { date: "2025-08-22", event: "Court Hearing", status: "completed" },
      { date: "2025-12-15", event: "Settlement Reached", status: "completed" },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
//  DOCUMENTS (for Document Upload page)
// ══════════════════════════════════════════════════════════════

export const documents = [
  {
    document_id: "DOC-001",
    case_id: "CASE-2026-1024",
    case_title: "Property Dispute — Land Partition",
    filename: "Land_Deed_Scan.pdf",
    fileType: "pdf",
    fileSize: 2450000,
    uploaded_at: "2026-02-28T08:30:00",
    uploadedBy: "client",
    status: "reviewed",
  },
  {
    document_id: "DOC-002",
    case_id: "CASE-2026-1024",
    case_title: "Property Dispute — Land Partition",
    filename: "Surveyor_Report_2025.pdf",
    fileType: "pdf",
    fileSize: 5800000,
    uploaded_at: "2026-02-25T10:15:00",
    uploadedBy: "lawyer",
    status: "reviewed",
  },
  {
    document_id: "DOC-003",
    case_id: "CASE-2026-0987",
    case_title: "Employment Wrongful Termination",
    filename: "Employment_Contract.pdf",
    fileType: "pdf",
    fileSize: 1200000,
    uploaded_at: "2026-02-20T14:00:00",
    uploadedBy: "client",
    status: "pending_review",
  },
  {
    document_id: "DOC-004",
    case_id: "CASE-2026-0987",
    case_title: "Employment Wrongful Termination",
    filename: "Termination_Letter.pdf",
    fileType: "pdf",
    fileSize: 890000,
    uploaded_at: "2026-02-18T09:45:00",
    uploadedBy: "client",
    status: "reviewed",
  },
  {
    document_id: "DOC-005",
    case_id: "CASE-2026-0987",
    case_title: "Employment Wrongful Termination",
    filename: "Salary_Slips_2025.xlsx",
    fileType: "xlsx",
    fileSize: 340000,
    uploaded_at: "2026-02-15T16:30:00",
    uploadedBy: "client",
    status: "reviewed",
  },
  {
    document_id: "DOC-006",
    case_id: "CASE-2026-0812",
    case_title: "Motor Accident Compensation",
    filename: "Police_Report_B1234.pdf",
    fileType: "pdf",
    fileSize: 1100000,
    uploaded_at: "2026-02-12T11:20:00",
    uploadedBy: "client",
    status: "pending_review",
  },
  {
    document_id: "DOC-007",
    case_id: "CASE-2026-0812",
    case_title: "Motor Accident Compensation",
    filename: "Medical_Report.pdf",
    fileType: "pdf",
    fileSize: 3200000,
    uploaded_at: "2026-02-10T08:00:00",
    uploadedBy: "client",
    status: "reviewed",
  },
  {
    document_id: "DOC-008",
    case_id: "CASE-2026-0812",
    case_title: "Motor Accident Compensation",
    filename: "Accident_Photos.zip",
    fileType: "zip",
    fileSize: 15600000,
    uploaded_at: "2026-02-08T14:45:00",
    uploadedBy: "client",
    status: "reviewed",
  },
  {
    document_id: "DOC-009",
    case_id: "CASE-2026-1024",
    case_title: "Property Dispute — Land Partition",
    filename: "Affidavit_Feb2026.docx",
    fileType: "docx",
    fileSize: 780000,
    uploaded_at: "2026-02-05T10:00:00",
    uploadedBy: "lawyer",
    status: "reviewed",
  },
  {
    document_id: "DOC-010",
    case_id: null,
    case_title: null,
    filename: "NIC_Copy.jpg",
    fileType: "jpg",
    fileSize: 420000,
    uploaded_at: "2026-01-20T09:30:00",
    uploadedBy: "client",
    status: "verified",
  },
];

// ══════════════════════════════════════════════════════════════
//  CLIENT PROFILE
// ══════════════════════════════════════════════════════════════

export const clientProfile = {
  user_id: "USR-2026-0001",
  name: "Ashan Bandara",
  email: "ashan.bandara@email.com",
  phone: "+94 71 234 5678",
  nic: "200012345678",
  address: "No. 42, Temple Road, Colombo 05",
  language: "Sinhala & English",
  verification_status: "verified",
  profile_picture: null,
  joined: "2025-01-15",
  dateOfBirth: "2000-05-20",
  emergencyContact: {
    name: "Nimali Bandara",
    phone: "+94 77 987 6543",
    relationship: "Spouse",
  },
};

// ══════════════════════════════════════════════════════════════
//  TIME SLOTS (for Appointment Booking)
// ══════════════════════════════════════════════════════════════

export const timeSlots = [
  { time: "09:00 AM", available: true },
  { time: "09:30 AM", available: true },
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: false },
  { time: "12:00 PM", available: false },
  { time: "01:00 PM", available: true },
  { time: "01:30 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: false },
  { time: "03:00 PM", available: true },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: true },
  { time: "04:30 PM", available: false },
];

// ══════════════════════════════════════════════════════════════
//  RECENT ACTIVITY
// ══════════════════════════════════════════════════════════════

export const recentActivity = [
  {
    id: "ACT-001",
    type: "document",
    title: "Document uploaded",
    description: "Land deed scan uploaded to Case #1024",
    timestamp: "2026-02-28T08:30:00",
    relatedId: "CASE-2026-1024",
  },
  {
    id: "ACT-002",
    type: "appointment",
    title: "Appointment confirmed",
    description: "Consultation with Atty. Kamal Perera on March 1",
    timestamp: "2026-02-27T16:20:00",
    relatedId: "APT-2026-001",
  },
  {
    id: "ACT-003",
    type: "case",
    title: "Hearing date set",
    description: "Case #0987 hearing scheduled for March 20 at Labour Tribunal",
    timestamp: "2026-02-25T11:00:00",
    relatedId: "CASE-2026-0987",
  },
  {
    id: "ACT-004",
    type: "message",
    title: "New message from lawyer",
    description: "Atty. Nimalka Fernando sent a case update",
    timestamp: "2026-02-24T09:45:00",
    relatedId: null,
  },
  {
    id: "ACT-005",
    type: "payment",
    title: "Payment processed",
    description: "LKR 25,000 consultation fee — Receipt #RCP-4421",
    timestamp: "2026-02-22T14:10:00",
    relatedId: null,
  },
  {
    id: "ACT-006",
    type: "document",
    title: "Document reviewed",
    description: "Atty. Ranjan de Silva reviewed your affidavit",
    timestamp: "2026-02-20T10:30:00",
    relatedId: "CASE-2026-1024",
  },
];

// ══════════════════════════════════════════════════════════════
//  QUICK ACTIONS
// ══════════════════════════════════════════════════════════════

export const quickActions = [
  {
    id: "find-lawyer",
    label: "Find a Lawyer",
    description: "Search by specialization & district",
    icon: "search",
    href: "/dashboard/client/search",
    color: "gold",
  },
  {
    id: "book-appointment",
    label: "Book Appointment",
    description: "Schedule a consultation session",
    icon: "calendar-plus",
    href: "/dashboard/client/appointments",
    color: "blue",
  },
  {
    id: "upload-document",
    label: "Upload Documents",
    description: "Securely share files with your lawyer",
    icon: "upload",
    href: "/dashboard/client/documents",
    color: "emerald",
  },
  {
    id: "track-case",
    label: "Track Case",
    description: "Monitor your case progress in real-time",
    icon: "activity",
    href: "/dashboard/client/cases",
    color: "purple",
  },
];

// ══════════════════════════════════════════════════════════════
//  SUPPORTED FILE TYPES (for Document Upload)
// ══════════════════════════════════════════════════════════════

export const supportedFileTypes = {
  pdf: { label: "PDF", color: "text-red-400", bg: "bg-red-500/10" },
  docx: { label: "DOCX", color: "text-blue-400", bg: "bg-blue-500/10" },
  xlsx: { label: "XLSX", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  jpg: { label: "JPG", color: "text-purple-400", bg: "bg-purple-500/10" },
  png: { label: "PNG", color: "text-purple-400", bg: "bg-purple-500/10" },
  zip: { label: "ZIP", color: "text-amber-400", bg: "bg-amber-500/10" },
};

export const maxFileSize = 25 * 1024 * 1024; // 25 MB

// ══════════════════════════════════════════════════════════════
//  HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function formatRelativeTime(isoString) {
  const now = new Date();
  const date = new Date(isoString);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-LK", { month: "short", day: "numeric" });
}

export function formatAppointmentDate(isoString) {
  const date = new Date(isoString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = date.toDateString() === now.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  const time = date.toLocaleTimeString("en-LK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;

  return `${date.toLocaleDateString("en-LK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })}, ${time}`;
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(isoString) {
  return new Date(isoString).toLocaleString("en-LK", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// ══════════════════════════════════════════════════════════════
//  MESSAGES / CONVERSATIONS
//  API: GET /api/v1/client/conversations
//       GET /api/v1/client/conversations/:id/messages
//       POST /api/v1/client/conversations/:id/messages
// ══════════════════════════════════════════════════════════════

export const conversations = [
  {
    id: "CONV-001",
    lawyer_id: "LWR-001",
    lawyerName: "Atty. Kamal Perera",
    lawyerSpecialization: "Criminal Law",
    lawyerAvatar: null,
    verified: true,
    unreadCount: 2,
    lastMessage: "I've reviewed the police report. We have a strong case for bail. Let's discuss the strategy in our next meeting.",
    lastMessageAt: "2026-02-28T09:15:00",
    lastMessageBy: "lawyer",
    status: "active",
    caseRef: "CASE-2026-1024",
    messages: [
      { id: "MSG-001", sender: "lawyer", text: "Good morning, Ashan. I've received the documents you uploaded.", timestamp: "2026-02-26T08:30:00", read: true },
      { id: "MSG-002", sender: "client", text: "Thank you, Attorney. Did you get the witness statement as well?", timestamp: "2026-02-26T08:45:00", read: true },
      { id: "MSG-003", sender: "lawyer", text: "Yes, I have it. The statement from Mr. Wijesuriya corroborates your account. I'll need a few days to prepare the motion.", timestamp: "2026-02-26T09:00:00", read: true },
      { id: "MSG-004", sender: "client", text: "That's great to hear. Please let me know if you need anything else from my side.", timestamp: "2026-02-26T09:10:00", read: true },
      { id: "MSG-005", sender: "lawyer", text: "Will do. I'll also need the original police report — can you upload a scanned copy?", timestamp: "2026-02-26T14:20:00", read: true },
      { id: "MSG-006", sender: "client", text: "I've uploaded the scan to the case documents section. Please check.", timestamp: "2026-02-26T15:00:00", read: true },
      { id: "MSG-007", sender: "lawyer", text: "Perfect, received it. Everything looks in order.", timestamp: "2026-02-27T10:00:00", read: true },
      { id: "MSG-008", sender: "lawyer", text: "I've reviewed the police report. We have a strong case for bail. Let's discuss the strategy in our next meeting.", timestamp: "2026-02-28T09:15:00", read: false },
    ],
  },
  {
    id: "CONV-002",
    lawyer_id: "LWR-002",
    lawyerName: "Atty. Nimalka Fernando",
    lawyerSpecialization: "Family Law",
    lawyerAvatar: null,
    verified: true,
    unreadCount: 1,
    lastMessage: "The custody hearing is set for March 15. I'll send the preparation notes by tomorrow.",
    lastMessageAt: "2026-02-27T16:40:00",
    lastMessageBy: "lawyer",
    status: "active",
    caseRef: null,
    messages: [
      { id: "MSG-101", sender: "client", text: "Good afternoon, Attorney Fernando. I wanted to follow up on the custody case.", timestamp: "2026-02-25T13:00:00", read: true },
      { id: "MSG-102", sender: "lawyer", text: "Hello Ashan. I'm currently reviewing the mediation report. There are a few points we need to address.", timestamp: "2026-02-25T14:30:00", read: true },
      { id: "MSG-103", sender: "client", text: "Should I be worried about anything?", timestamp: "2026-02-25T14:45:00", read: true },
      { id: "MSG-104", sender: "lawyer", text: "Not at all. The mediator's observations are largely in your favour. I just want to strengthen a couple of areas.", timestamp: "2026-02-25T15:00:00", read: true },
      { id: "MSG-105", sender: "client", text: "Thank you for the reassurance. When is the next hearing?", timestamp: "2026-02-26T10:00:00", read: true },
      { id: "MSG-106", sender: "lawyer", text: "The custody hearing is set for March 15. I'll send the preparation notes by tomorrow.", timestamp: "2026-02-27T16:40:00", read: false },
    ],
  },
  {
    id: "CONV-003",
    lawyer_id: "LWR-003",
    lawyerName: "Atty. Ranjan de Silva",
    lawyerSpecialization: "Property Law",
    lawyerAvatar: null,
    verified: true,
    unreadCount: 0,
    lastMessage: "Thank you, Attorney. I'll bring the original deed to the next meeting.",
    lastMessageAt: "2026-02-24T11:30:00",
    lastMessageBy: "client",
    status: "active",
    caseRef: "CASE-2026-1024",
    messages: [
      { id: "MSG-201", sender: "lawyer", text: "Ashan, the surveyor's report is ready. The partition plan shows three equal lots.", timestamp: "2026-02-22T09:00:00", read: true },
      { id: "MSG-202", sender: "client", text: "That's good news. Are the other co-owners in agreement?", timestamp: "2026-02-22T09:30:00", read: true },
      { id: "MSG-203", sender: "lawyer", text: "Two of the three are agreeable. The third has raised minor objections about boundary markers. I believe we can resolve this at the next hearing.", timestamp: "2026-02-22T10:15:00", read: true },
      { id: "MSG-204", sender: "client", text: "I see. What do you need from me before the hearing?", timestamp: "2026-02-23T08:00:00", read: true },
      { id: "MSG-205", sender: "lawyer", text: "Please bring the original deed of the property. We'll need it for the court records.", timestamp: "2026-02-24T10:00:00", read: true },
      { id: "MSG-206", sender: "client", text: "Thank you, Attorney. I'll bring the original deed to the next meeting.", timestamp: "2026-02-24T11:30:00", read: true },
    ],
  },
  {
    id: "CONV-004",
    lawyer_id: "LWR-005",
    lawyerName: "Atty. Thilini Ratnayake",
    lawyerSpecialization: "Labour Law",
    lawyerAvatar: null,
    verified: true,
    unreadCount: 3,
    lastMessage: "I've drafted the demand letter for wrongful termination. Please review the attached draft and let me know your thoughts.",
    lastMessageAt: "2026-02-28T11:00:00",
    lastMessageBy: "lawyer",
    status: "active",
    caseRef: "CASE-2026-0987",
    messages: [
      { id: "MSG-301", sender: "client", text: "Attorney Ratnayake, I received a termination letter from my employer today.", timestamp: "2026-02-20T08:00:00", read: true },
      { id: "MSG-302", sender: "lawyer", text: "I'm sorry to hear that. Can you send me a photo of the termination letter immediately?", timestamp: "2026-02-20T08:15:00", read: true },
      { id: "MSG-303", sender: "client", text: "Just uploaded it to the documents section.", timestamp: "2026-02-20T08:30:00", read: true },
      { id: "MSG-304", sender: "lawyer", text: "Got it. This appears to be without due process — they haven't followed the disciplinary procedure outlined in your employment contract.", timestamp: "2026-02-20T10:00:00", read: true },
      { id: "MSG-305", sender: "client", text: "What are my options?", timestamp: "2026-02-20T10:15:00", read: true },
      { id: "MSG-306", sender: "lawyer", text: "We can file a complaint with the Labour Tribunal for wrongful termination. I'll also send a demand letter first to attempt an amicable resolution.", timestamp: "2026-02-21T09:00:00", read: true },
      { id: "MSG-307", sender: "client", text: "Please proceed with the demand letter. I trust your judgment.", timestamp: "2026-02-21T09:30:00", read: true },
      { id: "MSG-308", sender: "lawyer", text: "The Labour Tribunal hearing has been scheduled for March 20. I'll prepare you for it.", timestamp: "2026-02-25T14:00:00", read: false },
      { id: "MSG-309", sender: "lawyer", text: "Also, I need your last three months' payslips and the employment contract for the tribunal filing.", timestamp: "2026-02-27T09:00:00", read: false },
      { id: "MSG-310", sender: "lawyer", text: "I've drafted the demand letter for wrongful termination. Please review the attached draft and let me know your thoughts.", timestamp: "2026-02-28T11:00:00", read: false },
    ],
  },
  {
    id: "CONV-005",
    lawyer_id: "LWR-006",
    lawyerName: "Atty. Priyanka Weerasinghe",
    lawyerSpecialization: "Constitutional Law",
    lawyerAvatar: null,
    verified: true,
    unreadCount: 0,
    lastMessage: "The petition was filed successfully. We'll await the court notice.",
    lastMessageAt: "2026-02-10T15:00:00",
    lastMessageBy: "lawyer",
    status: "archived",
    caseRef: null,
    messages: [
      { id: "MSG-401", sender: "client", text: "Good day, Attorney. I'm concerned about a fundamental rights issue regarding my land acquisition.", timestamp: "2026-01-20T09:00:00", read: true },
      { id: "MSG-402", sender: "lawyer", text: "Good day, Ashan. Please provide the details of the land acquisition notice you received.", timestamp: "2026-01-20T10:00:00", read: true },
      { id: "MSG-403", sender: "client", text: "The government issued a compulsory acquisition notice without proper compensation valuation.", timestamp: "2026-01-20T10:30:00", read: true },
      { id: "MSG-404", sender: "lawyer", text: "This is a clear violation under Article 14(1)(g) of the Constitution. We can file a fundamental rights petition.", timestamp: "2026-01-21T09:00:00", read: true },
      { id: "MSG-405", sender: "lawyer", text: "The petition was filed successfully. We'll await the court notice.", timestamp: "2026-02-10T15:00:00", read: true },
    ],
  },
];

// ══════════════════════════════════════════════════════════════
//  CLIENT PROFILE — Extended fields for My Profile page
//  API: GET /api/v1/client/profile/full
// ══════════════════════════════════════════════════════════════

export const clientProfileFull = {
  ...clientProfile,
  bio: "I'm a business owner based in Colombo seeking legal assistance for property matters and employment disputes. I value transparency and prompt communication with my legal representatives.",
  occupation: "Business Owner",
  company: "Bandara Trading (Pvt) Ltd",
  maritalStatus: "Married",
  nationality: "Sri Lankan",
  district: "Colombo",
  postalCode: "00500",
  preferredContactMethod: "email",
  notificationPreferences: {
    email: true,
    sms: true,
    push: true,
    appointmentReminders: true,
    caseUpdates: true,
    promotions: false,
  },
  billingAddress: "No. 42, Temple Road, Colombo 05",
  paymentMethods: [
    { id: "PM-001", type: "card", brand: "Visa", last4: "4242", expiry: "12/27", isDefault: true },
    { id: "PM-002", type: "bank", bankName: "Bank of Ceylon", last4: "8901", isDefault: false },
  ],
  stats: {
    totalAppointments: 12,
    completedAppointments: 8,
    activeCases: 2,
    resolvedCases: 3,
    documentsUploaded: 10,
    totalSpent: 185000,
  },
  activityLog: [
    { id: "LOG-001", action: "Profile updated", timestamp: "2026-02-27T14:30:00" },
    { id: "LOG-002", action: "Password changed", timestamp: "2026-02-15T10:00:00" },
    { id: "LOG-003", action: "Payment method added", timestamp: "2026-01-20T16:45:00" },
    { id: "LOG-004", action: "Email verified", timestamp: "2025-01-15T09:00:00" },
    { id: "LOG-005", action: "Account created", timestamp: "2025-01-15T08:30:00" },
  ],
};
