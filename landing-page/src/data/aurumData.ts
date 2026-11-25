export interface VaultItem {
  id: string;
  title: string;
  issuer: string;
  location: string;
  karat: string;
  grossGrams: string;
  netGrams: string;
  badge: 'Retailer-Verified' | 'Owner-Reported';
  invoiceStatus: string;
  hallmarkNote: string;
}

export interface BentoBenefit {
  id: string;
  span: 'wide' | 'narrow';
  kicker: string;
  title: string;
  body: string;
  metric: string;
  iconName: 'safe' | 'scales' | 'lineage' | 'shield' | 'lock' | 'timer' | 'scan' | 'device';
}

export interface PrototypePlate {
  id: string;
  index: string;
  tag: string;
  layout: 'mobile' | 'desktop';
  imageSrc: string;
  imageAlt: string;
  width: number;
  height: number;
  headline: string;
  description: string;
  highlights: string[];
}

export interface SimulatorRole {
  id: 'owner' | 'issuer' | 'rival';
  tabLabel: string;
  badgeLabel: string;
  httpStatus: string;
  statusTone: 'ok' | 'restricted' | 'blocked';
  summary: string;
  rows: {
    field: string;
    value: string;
    state: 'visible' | 'masked' | 'denied';
  }[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface TeamMember {
  id: string;
  memberIndex: string;
  initials: string;
  name: string;
  role: string;
  focusTag: string;
  responsibility: string;
  avatarSrc?: string;
  avatarAlt?: string;
}

export const HERO_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'AUR · 0842 · 6190',
    title: 'Kandyan Studded Bridal Bangle',
    issuer: 'Serendib Jewellers',
    location: 'Colombo 03',
    karat: '18K · 750',
    grossGrams: '4.80 g',
    netGrams: '4.20 g',
    badge: 'Retailer-Verified',
    invoiceStatus: 'AES-256 VAT Invoice Sealed',
    hallmarkNote: '0.60 g stone weight separated on Day 1',
  },
  {
    id: 'AUR · 3910 · 2048',
    title: '22K Traditional Thali Chain',
    issuer: 'Swarna Mahal',
    location: 'Sea Street, Colombo 11',
    karat: '22K · 916',
    grossGrams: '24.00 g',
    netGrams: '24.00 g',
    badge: 'Retailer-Verified',
    invoiceStatus: 'AES-256 VAT Invoice Sealed',
    hallmarkNote: '3.00 Sovereigns · Counter Pass Ready',
  },
  {
    id: 'AUR · 7721 · 9914',
    title: "Grandmother's Twisted Bangle Pair",
    issuer: 'Family Safe Record',
    location: 'Logged on Day 1',
    karat: '22K · 916',
    grossGrams: '20.05 g',
    netGrams: '20.05 g',
    badge: 'Owner-Reported',
    invoiceStatus: 'Macro Photo + Locker Note Saved',
    hallmarkNote: 'Ready for Parent → Child bridal lineage',
  },
];

export const BUYER_BENEFITS: BentoBenefit[] = [
  {
    id: 'buyer-day-one',
    span: 'wide',
    kicker: 'Immediate Day-1 Utility',
    title: 'Log existing home-safe heirlooms today, before your next purchase',
    body: 'Photograph and record older family bangles and chains already in your safe or bank locker as Owner-Reported items right alongside gold-sealed Retailer-Verified showroom purchases.',
    metric: 'Day-1 Safe Inventory + Live CBSL Value',
    iconName: 'safe',
  },
  {
    id: 'buyer-net-weight',
    span: 'narrow',
    kicker: 'Zero Stone Guesswork',
    title: 'Keep full own-gold exchange weight',
    body: 'Separated Gross vs. Net gold weight (4.80 g total / 4.20 g pure gold) stops unverified 2%–5% cutting deductions and stone-prying arguments during bridal upgrades.',
    metric: '0.001 g Separated Net Gold Proof',
    iconName: 'scales',
  },
  {
    id: 'buyer-lineage',
    span: 'narrow',
    kicker: 'Generational Continuity',
    title: 'Mother-to-daughter melting lineage',
    body: 'When heirloom bangles are melted to craft a wedding necklace, AURUM links Parent → Child passports permanently so family provenance never breaks.',
    metric: 'Unbroken Parent → Child Graph',
    iconName: 'lineage',
  },
  {
    id: 'buyer-dossier',
    span: 'wide',
    kicker: 'Emergency Readiness',
    title: 'Export a police and insurance dossier from your phone in 10 seconds',
    body: 'Thermal paper receipts fade blank within two humid monsoon seasons. Keep macro photographs, milligram weights, and untouched VAT invoice PDFs sealed in your pocket if burglary or flood ever strikes.',
    metric: 'AES-256 Original Invoice PDF',
    iconName: 'shield',
  },
];

export const SHOWROOM_BENEFITS: BentoBenefit[] = [
  {
    id: 'shop-lockin',
    span: 'wide',
    kicker: 'Lifetime Issuer Retention',
    title: 'Lock in repeat bridal and servicing buyers without leaking a single sale',
    body: 'Rival jewellers are mathematically blocked at the database layer from viewing or logging repairs on your passports. Customers return to your counter for life to keep their 100% Original Issuer Verified seal intact.',
    metric: 'PostgreSQL RLS Tenant Isolation',
    iconName: 'lock',
  },
  {
    id: 'shop-tradein',
    span: 'narrow',
    kicker: 'Faster Counter Velocity',
    title: 'Close bridal trade-ins in 2 minutes',
    body: 'Read exact original Net Gold Weight instantly at the counter without touchstone scraping or prying Kundan stones out of delicate settings.',
    metric: 'Zero Destructive Scraping on Own Pieces',
    iconName: 'timer',
  },
  {
    id: 'shop-fraud',
    span: 'narrow',
    kicker: 'Shrinkage & Swap Defense',
    title: 'Catch warranty swaps and 0.250 g shaving',
    body: 'Pair XRF alloy checks with exact original instance weight (±1.5% wear tolerance) and intake/post-polish gram audits to stop 8-year-old lookalike swaps and workshop pilferage.',
    metric: '±1.5% Natural Wear Audit Gate',
    iconName: 'scan',
  },
  {
    id: 'shop-pos',
    span: 'wide',
    kicker: 'Zero Counter Disruption',
    title: 'Hand over verified proof in 8 seconds alongside your current barcode tags',
    body: 'Keep your existing ERP and tray tags untouched. Any counter tablet handles live 4-digit PIN handovers, SIM-bound surprise gift invites, bridal set batching, and Nokia button-phone buyers.',
    metric: '4 Real-World Showroom Handover Modes',
    iconName: 'device',
  },
];

export const PROTOTYPE_PLATES: PrototypePlate[] = [
  {
    id: 'passport',
    index: 'Plate 01',
    tag: 'Customer Vault & Digital Jewellery Passport',
    layout: 'mobile',
    imageSrc: '/images/prototype-passport.png',
    imageAlt:
      'High-fidelity Project AURUM Figma mobile screen showing Customer Digital Jewellery Passport AUR 0842 6190 with 4.80g gross and 4.20g net gold weight, 18K 750 purity, encrypted original invoice PDF, and 15-minute Counter Pass QR.',
    width: 356,
    height: 774,
    headline: 'Prove exact net gold weight decades after paper fades.',
    description:
      'Stores Permanent Asset ID (AUR · 0842 · 6190), separated Gross vs. Net gold weight (4.80 / 4.20 g), 18K · 750 and 22K · 916 purity seals, untouched encrypted Original Invoice PDF, Lifecycle Timeline, and a 15-minute Counter Pass QR.',
    highlights: [
      'Separated 4.80 g Gross / 4.20 g Net Gold',
      'AES-256 Original VAT Invoice PDF',
      '15-Minute Ephemeral Counter Pass QR',
    ],
  },
  {
    id: 'gold-news',
    index: 'Plate 02',
    tag: 'Weekly Wealth & Hallmark Literacy Hub',
    layout: 'mobile',
    imageSrc: '/images/prototype-gold-news.png',
    imageAlt:
      'High-fidelity Project AURUM Figma mobile screen displaying daily Sri Lankan CBSL gold reference rates for 22K 916 at LKR 36,640 per gram and LKR 293,120 per sovereign alongside 24K 999 rates and hallmarking guides.',
    width: 311,
    height: 670,
    headline: 'Daily CBSL 22K & 24K rates, without store promo spam.',
    description:
      'Turns a once-every-few-years purchase record into a calm weekly utility: official CBSL reference rates in LKR per gram (36,640/g · 40,000/g) and 8g sovereign (Pavan), paired with plain-English guides on 916 hallmarking, purity, and care.',
    highlights: [
      '22K / 916: LKR 36,640/g · 293,120/Sovereign',
      '24K / 999: LKR 40,000/g · 320,000/Sovereign',
      'Zero Promotional Push Spam Policy',
    ],
  },
  {
    id: 'retailer-pos',
    index: 'Plate 03',
    tag: 'Partner Scan & Sell Web Portal (Showroom POS)',
    layout: 'desktop',
    imageSrc: '/images/prototype-retailer-pos.png',
    imageAlt:
      'High-fidelity Project AURUM Figma web portal screen for Partner Scan and Sell POS showing multi-item bridal batching at 12.20g combined net gold, masked customer phone +94 4821, and four counter handover modes.',
    width: 1022,
    height: 728,
    headline: '8-second digital handover for bridal sets, gifts, and button phones.',
    description:
      'Engineered for high-traffic showroom counters with shared-screen privacy enforced automatically at every step:',
    highlights: [
      '4 Counter Modes: Live 4-Digit PIN, SIM-Bound Claim-Later Gift SMS, Offline Button-Phone Buyer, and 7-Day Return/Exchange',
      'Multi-Item Bridal Batching: Group rings, chains, and pendants (12.20 g combined net gold) under one 1-tap bride handover',
      'Customer-Present Lock: Masks mobile numbers (+94 •• ••• 4821) and seals historical invoices the second checkout closes',
    ],
  },
];

export const SIMULATOR_ROLES: SimulatorRole[] = [
  {
    id: 'owner',
    tabLabel: '1. Authenticated Owner (Family)',
    badgeLabel: 'RLS ROLE: OWNER_SESSION_VERIFIED',
    httpStatus: 'HTTP 200 OK · Biometric Device Key',
    statusTone: 'ok',
    summary:
      'Full cross-shop family vault unlocked on the owner’s handset. Rupee portfolio value is multiplied locally on-device and never written to public tables.',
    rows: [
      {
        field: 'Cross-Shop Portfolio',
        value: 'Serendib + Swarna + Raja + Devi (3 Verified, 1 Heirloom)',
        state: 'visible',
      },
      {
        field: 'Selected Asset & Weights',
        value: 'AUR · 0842 · 6190 — 4.80 g Gross / 4.20 g Pure Gold',
        state: 'visible',
      },
      {
        field: 'Original VAT Invoice PDF',
        value: 'Decrypted locally via AES-256 signed URL',
        state: 'visible',
      },
      {
        field: 'Private Safe / Bank-Locker Note',
        value: '“BOC Kollupitiya Locker #14 — Bridal Set” (Owner Eyes Only)',
        state: 'visible',
      },
      {
        field: 'Home Street Address Column',
        value: 'NULL — 0 address or GPS columns exist in schema',
        state: 'masked',
      },
    ],
  },
  {
    id: 'issuer',
    tabLabel: '2. Issuing Jeweller (Serendib)',
    badgeLabel: 'RLS ROLE: TENANT_ISSUER_ONLY',
    httpStatus: 'HTTP 200 OK · Scoped to Shop A Ledger',
    statusTone: 'restricted',
    summary:
      'Serendib Jewellers sees strictly the bangle it issued. Pieces bought by the same family at Swarna, Raja, or Devi are invisible.',
    rows: [
      {
        field: 'Cross-Shop Portfolio',
        value: 'HIDDEN — Scoped strictly to Serendib tenant_id',
        state: 'masked',
      },
      {
        field: 'Selected Asset & Weights',
        value: 'AUR · 0842 · 6190 — 4.80 g Gross / 4.20 g Pure Gold',
        state: 'visible',
      },
      {
        field: 'Buyer Identity & Phone',
        value: '+94 •• ••• 4821 (Customer-Present Counter Pass required)',
        state: 'masked',
      },
      {
        field: 'Workshop Weight-Audit Log',
        value: 'Intake 4.800 g → Post-Polish 4.798 g (Within ±1.5% gate)',
        state: 'visible',
      },
      {
        field: 'Private Owner Locker Notes',
        value: 'REDACTED — Zero showroom read permission',
        state: 'denied',
      },
    ],
  },
  {
    id: 'rival',
    tabLabel: '3. Rival Shop B / Stranger',
    badgeLabel: 'RLS ROLE: UNAUTHORISED_TENANT',
    httpStatus: 'HTTP 403 FORBIDDEN · Zero-Knowledge Denial',
    statusTone: 'blocked',
    summary:
      'When a rival shop or stranger scans the bangle without an active Owner Counter Pass, PostgreSQL RLS rejects the query before a single byte leaves the database.',
    rows: [
      {
        field: 'Item Existence Confirmation',
        value: 'DENIED — Indistinguishable from non-existent ID',
        state: 'denied',
      },
      {
        field: 'Issuing Showroom & Purchase Date',
        value: '0 BYTES RETURNED — Zero competitor intelligence leaked',
        state: 'denied',
      },
      {
        field: 'Gram Weight, Karatage & Invoice',
        value: '0 BYTES RETURNED — Encrypted & RLS blocked',
        state: 'denied',
      },
      {
        field: 'Owner Identity & Contact',
        value: '0 BYTES RETURNED — Anti-poaching lock enforced',
        state: 'denied',
      },
      {
        field: 'Security Audit Trail',
        value: 'Scan timestamp & tenant hash appended to SHA-256 log',
        state: 'visible',
      },
    ],
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    numeral: '01',
    kicker: '8 Seconds at Checkout',
    title: 'Confirm at checkout in 8 seconds (or claim later at home)',
    body: 'Showrooms keep their normal barcode tags inside the display tray. At checkout, one scan sends a 4-digit PIN handover to your phone, a SIM-bound invite for surprise gifts, or a plain-text SMS receipt for Nokia button phones.',
  },
  {
    numeral: '02',
    kicker: 'Biometric Family Vault',
    title: 'Track showroom purchases and home heirlooms in one vault',
    body: 'New Retailer-Verified passports sit alongside older home-safe heirlooms you photograph on day one, showing live LKR metal value multiplied privately on your device.',
  },
  {
    numeral: '03',
    kicker: 'Generational Proof',
    title: 'Service, upgrade, or pass down with unbroken gram lineage',
    body: 'Walk back into the issuing showroom 5 or 25 years later without a paper bill for instant weight-verified polishing, full-value bridal trade-ins, or Parent → Child melting records.',
  },
];

export const SKEPTIC_FAQS: FaqItem[] = [
  {
    id: 'faq-competitors',
    question: 'Can another jewellery shop see what I bought—or poach my showroom’s customers?',
    answer:
      'No. PostgreSQL Row-Level Security isolates every showroom at the database engine layer. Rival Shop B receives HTTP 403 Forbidden and cannot even tell whether a customer owns a single gram of gold from Shop A.',
  },
  {
    id: 'faq-breach',
    question: 'If AURUM’s servers were ever breached, could criminals find out where I live?',
    answer:
      'Never. AURUM never asks for or stores residential street addresses, postal codes, or GPS coordinates anywhere in our database, and original VAT invoice PDFs sit in AES-256 encrypted private buckets with no routine admin access.',
  },
  {
    id: 'faq-rupees',
    question: 'Are rupee purchase prices exposed to analytics or third parties?',
    answer:
      'No. Participation is 100% opt-in, zero rupee totals sit in public or analytics tables, and your live LKR metal valuation is multiplied privately on your own phone using daily CBSL reference rates.',
  },
  {
    id: 'faq-nokia-gifts',
    question: 'What if my grandmother uses a Nokia button phone—or a husband is buying a surprise gift?',
    answer:
      'Both work out of the box at checkout. Surprise gifts use a theft-proof Claim-Later Invite bound to the recipient’s SIM card and Invoice ID, while non-smartphone buyers use Offline Buyer Mode (plain-text SMS receipt + permanent showroom ledger binding).',
  },
  {
    id: 'faq-soft-gold',
    question: '22K gold is soft—what happens if a surface mark fades after years of wear, or a chain is too thin?',
    answer:
      'AURUM decouples your permanent digital passport from any physical mark. Delicate chains work 100% digitally via in-app Counter Pass QR, and if a surface mark ever wears smooth, the issuing showroom verifies the piece via precision scale weight (±1.5% natural wear tolerance) and craftsmanship match to relink a fresh code without losing a day of history.',
  },
  {
    id: 'faq-pawning-melting',
    question: 'What happens when old bangles are pawned at a bank, gifted to a daughter, or melted into a new necklace?',
    answer:
      'You retain full vault ownership during bank pawning (with private locker reminder notes), transfer gifts via biometric approval plus a 24-hour cancelable security hold, and link melted heirloom bangles permanently as Parent → Child records when crafting new bridal jewellery.',
  },
  {
    id: 'faq-cost-pdpa',
    question: 'Does joining the Colombo early-access pilot cost anything?',
    answer:
      'No. Early-access registration is free for both jewellery owners and founding partner showrooms, enforces a strict zero-promotional-spam rule, and lets you permanently purge your email anytime under Section 14 of the Sri Lanka PDPA.',
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'perera',
    memberIndex: '01',
    initials: 'HP',
    name: 'R. A. H. D. Perera',
    role: 'Product Owner & Web Lead',
    focusTag: 'Product Strategy & Web Engineering',
    responsibility:
      'Product vision, scope governance, GitHub and Notion workspace setup, marketing web development, and Netlify HTTPS deployment.',
    avatarSrc: '/images/team-perera.jpg',
    avatarAlt:
      'Editorial studio portrait of R. A. H. D. Perera, Product Owner and Web Lead of Project AURUM Group SE-10.',
  },
  {
    id: 'abisheak',
    memberIndex: '02',
    initials: 'SA',
    name: 'S. Abisheak',
    role: 'Scrum Master & Agile Lead',
    focusTag: 'Sprint Governance & Risk Control',
    responsibility:
      'Scrum sprint facilitation, Notion backlog tracking, burndown metrics, risk register governance, and Agile ceremony documentation.',
    avatarSrc: '/images/team-abisheak.jpg',
    avatarAlt:
      'Editorial studio portrait of S. Abisheak, Scrum Master and Agile Lead of Project AURUM Group SE-10.',
  },
  {
    id: 'senuthi',
    memberIndex: '03',
    initials: 'SR',
    name: 'G. D. Senuthi Thewathma Rathansekara',
    role: 'System Architect',
    focusTag: 'PostgreSQL RLS & Lineage Schema',
    responsibility:
      'Multi-tier system architecture, UML modelling, PostgreSQL Row-Level Security (RLS) schema, atomic POS handover, and asset lineage design.',
  },
  {
    id: 'inuthie',
    memberIndex: '04',
    initials: 'IT',
    name: 'D. S. Inuthie Tharinma',
    role: 'UI/UX Designer',
    focusTag: 'Design System & Figma Prototypes',
    responsibility:
      'Low-fidelity wireframes, WCAG 2.2 AA design system tokens, high-fidelity Figma prototype (Customer Vault & Retailer POS), and usability testing.',
    avatarSrc: '/images/team-inuthie.jpg',
    avatarAlt:
      'Editorial studio portrait of D. S. Inuthie Tharinma, UI/UX Designer of Project AURUM Group SE-10.',
  },
  {
    id: 'kajendran',
    memberIndex: '05',
    initials: 'MK',
    name: 'M. Kajendran',
    role: 'Business Analyst & QA/Ethics Lead',
    focusTag: 'SRS, QA Strategy & Sri Lanka PDPA',
    responsibility:
      'Stakeholder elicitation, SRS requirements and user stories, QA test strategy, Sri Lanka PDPA compliance, and UoW research ethics.',
  },
];
