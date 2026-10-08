/**
 * =========================================================================
 * IRONFORGE GYM - MASTER CONFIGURATION FILE (REVISION)
 * =========================================================================
 * 
 * Single source of truth for all content, pricing, trainers, programs,
 * contact details, and WhatsApp integration.
 */

export const CONFIG = {
  // -----------------------------------------------------------------------
  // 1. BRAND & CONTACT INFORMATION
  // -----------------------------------------------------------------------
  brand: {
    name: "IRONFORGE",
    siteUrl: import.meta.env.VITE_SITE_URL || "https://gym-three-smoky.vercel.app",
    tagline: "STRONGER MEN. A BETTER TOMORROW.",
    overline: "TRAIN HARD. STAY DISCIPLINED. BECOME UNSTOPPABLE.",
    established: "2016",
    copyrightYear: 2026,
    localStorageKey: "ironforge_pass_claimed",
  },

  contact: {
    whatsappNumber: "919876543210", // Digits only with country code
    displayPhone: "+91 98765 43210",
    email: "info@ironforgegym.in",
    address: "123 Fitness Street, Nanded, Maharashtra 431601",
    hours: "Open 24/7 (All 365 Days)",
    googleMapsUrl: "https://maps.google.com/?q=IRONFORGE+Gym+Nanded",
  },

  socialLinks: {
    instagram: "https://instagram.com/ironforgegym",
    youtube: "https://youtube.com/@ironforgegym",
    facebook: "https://facebook.com/ironforgegym",
    tiktok: "https://tiktok.com/@ironforgegym",
    twitter: "https://x.com/ironforgegym",
  },

  // -----------------------------------------------------------------------
  // 2. HERO SECTION
  // -----------------------------------------------------------------------
  hero: {
    badge: "MORE THAN A GYM",
    headlineLine1: "FORGE YOUR STRENGTH.",
    headlineLine2: "OWN YOUR POWER.",
    description:
      "A premium men's gym built for disciplined individuals who choose progress over comfort. State-of-the-art iron, world-class coaching, and an uncompromising brotherhood.",
    primaryCta: "START TRAINING",
    secondaryCta: "BOOK A FREE TRIAL",
    ratingScore: 4.9,
    ratingCountText: "Trusted by 2,000+ members",
    athleteImage: "/images/hero-athlete.png",
    athleteImageWebp: "/images/hero-athlete.webp",
    videoMobile: "/videos/hero-loop-mobile.mp4",
    videoDesktop: "/videos/hero-loop-desktop.mp4",
    scrollCueText: "SCROLL TO DISCOVER",
  },

  // -----------------------------------------------------------------------
  // 3. INFINITE TICKER MARQUEE (ONE ROW, SMOOTH SPEED)
  // -----------------------------------------------------------------------
  tickerWords: [
    "STRENGTH",
    "DISCIPLINE",
    "POWER",
    "NO EXCUSES",
    "BUILT DIFFERENT",
    "RESILIENCE",
    "IRON BROTHERHOOD",
    "RELENTLESS",
  ],

  // -----------------------------------------------------------------------
  // 4. SIGNATURE PROGRAMS
  // -----------------------------------------------------------------------
  programsSection: {
    overline: "SIGNATURE PROGRAMS",
    title: "BUILT FOR THE",
    titleHighlight: "RELENTLESS",
    description:
      "Structured programs, expert guidance and a serious training environment to help you become a stronger, fitter and more disciplined version of yourself.",
  },

  programs: [
    {
      id: "strength-powerlifting",
      slug: "strength-powerlifting",
      title: "STRENGTH & POWERLIFTING",
      category: "RAW STRENGTH",
      description:
        "Build raw strength, perfect your squat, bench, and deadlift form, and lift heavier with proven periodization protocols.",
      image: "/images/program-strength.webp",
      icon: "Dumbbell",
      assignedTrainerSlug: "marcus-vance",
      chips: ["Heavy Iron", "1RM Periodization", "Bar Path Analysis"],
      overview:
        "Engineered for serious lifters seeking maximum mechanical tension, strength breakthroughs, and bulletproof joint integrity. Master the squat, bench press, deadlift, and overhead press under the direct guidance of national champion coaches.",
      whatsIncluded: [
        "Calibrated competition steel & bumper plates",
        "Weekly video form breakdown & bar-path telemetry",
        "Personalized 1RM periodization cycle",
        "Access to specialized power bars & safety squat bars",
        "Pre-meet peaking and competition taper protocols",
      ],
      weeklySchedule: [
        { day: "Monday", focus: "Heavy Squat Progression & Quad Accessories" },
        { day: "Tuesday", focus: "Competition Bench Press & Tricep Hypertrophy" },
        { day: "Wednesday", focus: "Active Recovery, Mobility & Core Stabilization" },
        { day: "Thursday", focus: "Deadlift Variations & Upper Back Thickness" },
        { day: "Friday", focus: "Overhead Press & Dynamic Effort Volume" },
        { day: "Saturday", focus: "Full Body Strongman & Grip Conditioning" },
        { day: "Sunday", focus: "Rest & Recovery" },
      ],
      whoItsFor:
        "Ideal for men wanting to build brute raw strength, break through plateaus on the big compound lifts, and forge a powerful, resilient skeletal framework.",
    },
    {
      id: "muscle-building",
      slug: "muscle-building",
      title: "MUSCLE BUILDING",
      category: "HYPERTROPHY",
      description:
        "Structured training and precision nutrition support engineered to help you build dense lean muscle and sculpt a commanding aesthetic.",
      image: "/images/program-muscle.webp",
      icon: "BicepsFlexed",
      assignedTrainerSlug: "david-chen",
      chips: ["Hypertrophy", "Macro Roadmap", "Muscle Symmetry"],
      overview:
        "Targeted hypertrophy training optimizing metabolic stress, mechanical tension, and eccentric muscle breakdown. Designed to craft broad shoulders, thick lats, dense arms, and a chiseled torso.",
      whatsIncluded: [
        "Targeted weekly volume & RPE tracking",
        "High-protein macro calculation & meal blueprint",
        "Prime muscle pump biomechanics & cable variations",
        "Monthly 3D InBody scan & composition adjustments",
        "Access to elite plate-loaded hammer strength machines",
      ],
      weeklySchedule: [
        { day: "Monday", focus: "Chest & Front/Side Delts (Upper Push)" },
        { day: "Tuesday", focus: "Back Thickness & Rear Delts (Upper Pull)" },
        { day: "Wednesday", focus: "Quads, Hamstrings & Calves (Leg Hypertrophy)" },
        { day: "Thursday", focus: "Arms Mastery (Biceps, Triceps & Forearms)" },
        { day: "Friday", focus: "Upper Body Aesthetics & Shoulders V-Taper" },
        { day: "Saturday", focus: "Lower Body Posterior Chain & Abs" },
        { day: "Sunday", focus: "Rest & Nutrition Reset" },
      ],
      whoItsFor:
        "Designed for lifters looking to maximize lean mass gains, fix muscular imbalances, and sculpt an imposing, muscular physique.",
    },
    {
      id: "fat-loss-conditioning",
      slug: "fat-loss-conditioning",
      title: "FAT LOSS & CONDITIONING",
      category: "METABOLIC DRIVE",
      description:
        "High intensity functional training to incinerate body fat, elevate stamina, improve cardiovascular output, and build athletic endurance.",
      image: "/images/program-fatloss.webp",
      icon: "Flame",
      assignedTrainerSlug: "alexander-cole",
      chips: ["Fat Incinerator", "HIIT Circuits", "Endurance"],
      overview:
        "Combines heavy kettlebell complexes, battle ropes, sled pushes, rowers, and metabolic intervals to torch stubborn body fat while safeguarding hard-earned muscle mass.",
      whatsIncluded: [
        "Heart-rate zone metabolic conditioning circuits",
        "Lactate threshold & VO2 max athletic progression",
        "Fat-shredding nutrient timing & caloric deficit guides",
        "Functional agility, sled pushes, and sandbag work",
        "Daily recovery and hydration protocols",
      ],
      weeklySchedule: [
        { day: "Monday", focus: "High Intensity Metabolic Circuit & Battle Ropes" },
        { day: "Tuesday", focus: "Kettlebell Complexes & Core Anti-Rotation" },
        { day: "Wednesday", focus: "Zone 2 Steady-State Aerobic Base & Mobility" },
        { day: "Thursday", focus: "Sled Pushes, Farmer Walks & Grip Endurance" },
        { day: "Friday", focus: "Tabata Sprints & Athletic Plyometrics" },
        { day: "Saturday", focus: "Team Strongman Challenge & Recovery Sauna" },
        { day: "Sunday", focus: "Rest" },
      ],
      whoItsFor:
        "Perfect for men who want to shed body fat rapidly, skyrocket their daily energy, and build unbreakable cardiovascular stamina.",
    },
  ],

  // -----------------------------------------------------------------------
  // 5. IMPACT & STATS
  // -----------------------------------------------------------------------
  statsSection: {
    overline: "OUR IMPACT",
    title: "A STRONGER",
    titleHighlight: "TOMORROW",
  },

  stats: [
    {
      id: "members",
      value: 2000,
      suffix: "+",
      label: "MEMBERS",
      description: "A growing community of disciplined individuals.",
      icon: "Users",
    },
    {
      id: "trainers",
      value: 25,
      suffix: "+",
      label: "EXPERT TRAINERS",
      description: "Certified and experienced strength professionals.",
      icon: "Award",
    },
    {
      id: "access",
      value: "24/7",
      isString: true,
      label: "ACCESS",
      description: "Train on your schedule. Anytime, any day.",
      icon: "Clock",
    },
    {
      id: "years",
      value: 10,
      suffix: "",
      label: "YEARS OF IRON",
      description: "A decade of building stronger, resilient men.",
      icon: "Trophy",
    },
  ],

  // -----------------------------------------------------------------------
  // 6. TRANSFORMATIONS (BEFORE / AFTER)
  // -----------------------------------------------------------------------
  transformationsSection: {
    overline: "TRANSFORMATIONS",
    title: "REAL PEOPLE.",
    titleHighlight: "REAL RESULTS.",
    subtitle:
      "Different backgrounds. Different goals. One common mindset — never give up.",
  },

  transformations: [
    {
      id: "trans-1",
      name: "Rohan S.",
      duration: "8 months member",
      quote:
        "IRONFORGE gave me the discipline I was always missing. I feel stronger in every area of my life.",
      beforeImage: "/images/transform-1-before.webp",
      afterImage: "/images/transform-1-after.webp",
      stats: { weight: "-14 kg", muscle: "+5.5 kg" },
    },
    {
      id: "trans-2",
      name: "Vikram P.",
      duration: "1 year member",
      quote:
        "The trainers here actually care and push you to be better. Best decision I made this year.",
      beforeImage: "/images/transform-2-before.webp",
      afterImage: "/images/transform-2-after.webp",
      stats: { bench: "+35 kg", deadlift: "+60 kg" },
    },
    {
      id: "trans-3",
      name: "Aditya K.",
      duration: "6 months member",
      quote:
        "A stronger, leaner and more confident version of myself. IRONFORGE changed my mindset completely.",
      beforeImage: "/images/transform-3-before.webp",
      afterImage: "/images/transform-3-after.webp",
      stats: { bodyFat: "24% → 11%", energy: "Peak" },
    },
    {
      id: "trans-4",
      name: "Sameer M.",
      duration: "1 year member",
      quote:
        "From no confidence to a completely new lifestyle. Grateful for this place and the brotherhood.",
      beforeImage: "/images/transform-4-before.webp",
      afterImage: "/images/transform-4-after.webp",
      stats: { muscleGain: "+8 kg", mindset: "Unstoppable" },
    },
  ],

  // -----------------------------------------------------------------------
  // 7. EXPERT TRAINERS
  // -----------------------------------------------------------------------
  trainersSection: {
    overline: "WORLD CLASS COACHING",
    title: "FORGED BY THE",
    titleHighlight: "MASTERS",
    description:
      "Our coaches don't just instruct; they walk the walk. Certified, experienced, and dedicated to your personal breakthrough.",
  },

  trainers: [
    {
      id: "trainer-1",
      slug: "marcus-vance",
      name: "Marcus Vance",
      role: "Head Strength Coach",
      experience: "12+ Years Exp",
      specialty: "Powerlifting & Biomechanics",
      image: "/images/trainer-1.webp",
      badge: "National Champ",
      stats: { athletesCoached: "450+", championships: "3 National", maxDeadlift: "340 kg" },
      bio: "Former national powerlifting champion specializing in raw strength development, kinetic chain stabilization, and structural joint safety under extreme loads.",
      achievements: [
        "3x National Powerlifting Gold Medalist",
        "CSCS Certified Strength & Conditioning Specialist",
        "Over 12 years of coaching elite athletes and powerlifters",
        "Master Coach at IRONFORGE since inception",
      ],
      coachedProgramSlugs: ["strength-powerlifting"],
    },
    {
      id: "trainer-2",
      slug: "david-chen",
      name: "David Chen",
      role: "Physique Specialist",
      experience: "8+ Years Exp",
      specialty: "Hypertrophy & Macro Nutrition",
      image: "/images/trainer-2.webp",
      badge: "IFBB Pro Certified",
      stats: { athletesCoached: "600+", proCards: "12", clientAvgLoss: "-12 kg" },
      bio: "Master trainer focused on aesthetic physique transformation, muscle symmetry, metabolic acceleration, and precision high-protein nutrition design.",
      achievements: [
        "IFBB Pro Certified Coach",
        "Precision Nutrition Level 2 Master",
        "Over 600 successful body transformations",
        "Specialist in injury-free hypertrophy training",
      ],
      coachedProgramSlugs: ["muscle-building"],
    },
    {
      id: "trainer-3",
      slug: "alexander-cole",
      name: "Alexander Cole",
      role: "Conditioning & Recovery",
      experience: "9+ Years Exp",
      specialty: "Athletic Conditioning & Mobility",
      image: "/images/trainer-3.webp",
      badge: "Tactical Coach",
      stats: { athletesCoached: "380+", tacticalCamps: "40+", vo2MaxBoost: "+24%" },
      bio: "Ex-military performance specialist coaching high-intensity endurance, functional stamina, sprint mechanics, and ice/heat contrast therapy recovery.",
      achievements: [
        "Tactical Strength & Conditioning Facilitator (TSAC-F)",
        "Certified Functional Movement Screen (FMS) Expert",
        "Specialist in VO2 max expansion and metabolic drive",
        "Head of Recovery & Cold Plunge Protocols",
      ],
      coachedProgramSlugs: ["fat-loss-conditioning"],
    },
  ],

  // -----------------------------------------------------------------------
  // 8. PRICING & MEMBERSHIP PLANS (RICH & COMPACT)
  // -----------------------------------------------------------------------
  pricingSection: {
    overline: "MEMBERSHIP PLANS",
    title: "INVEST IN YOUR",
    titleHighlight: "POTENTIAL",
    subtitle:
      "Transparent pricing. No hidden fees. Lock in your rate today and claim your free starter kit.",
    billingToggles: [
      { id: "monthly", label: "Monthly", discount: null, unit: "/month" },
      { id: "quarterly", label: "Quarterly", discount: "SAVE 10%", unit: "/quarter" },
      { id: "yearly", label: "Yearly", discount: "SAVE 25%", unit: "/year" },
    ],
  },

  pricingPlans: [
    {
      id: "starter",
      name: "STARTER IRON",
      tagline: "Essential access for the committed beginner.",
      popular: false,
      prices: {
        monthly: "₹2,499",
        quarterly: "₹6,499",
        yearly: "₹22,499",
      },
      headlineChips: ["Full Gym Access", "Mobile App", "Locker Room"],
      features: [
        "Full gym floor & competition free weights access",
        "Private locker room & luxury hot shower facilities",
        "Initial fitness & 3D body composition assessment",
        "Full access to IRONFORGE Mobile App & workout tracker",
        "Free IRONFORGE starter shaker & towel",
        "Standard access hours (6 AM - 11 PM)",
        "Standard locker room amenities",
      ],
      ctaText: "JOIN STARTER",
    },
    {
      id: "elite",
      name: "FORGE ELITE",
      tagline: "Our most chosen plan for serious transformation.",
      popular: true,
      badge: "MOST POPULAR",
      prices: {
        monthly: "₹3,999",
        quarterly: "₹10,499",
        yearly: "₹34,999",
      },
      headlineChips: ["24/7 Access", "2x PT Sessions/mo", "Sauna & Ice Bath"],
      features: [
        "24/7/365 unrestricted priority gym access",
        "Customized periodized workout blueprint",
        "Monthly 3D InBody scan & coach progress review",
        "2 x 1-on-1 Personal Training sessions every month",
        "Infrared sauna & ice bath recovery lounge access",
        "Custom nutrition & macro calculation roadmap",
        "Free guest pass (1 guest per month)",
        "Official IRONFORGE Gym Tee & Premium Shaker Kit",
        "Access to members-only strength workshops",
      ],
      ctaText: "JOIN ELITE NOW",
    },
    {
      id: "legend",
      name: "LEGEND ACCESS",
      tagline: "The all-inclusive elite athlete experience.",
      popular: false,
      badge: "VIP EXPERIENCE",
      prices: {
        monthly: "₹6,999",
        quarterly: "₹18,499",
        yearly: "₹59,999",
      },
      headlineChips: ["Unlimited Coach Check-ins", "VIP Locker", "Tailored Diet"],
      features: [
        "All Forge Elite privileges included",
        "Unlimited Personal Coach weekly check-ins & form reviews",
        "Reserved permanent private VIP locker & laundry service",
        "Full tailored chef-designed meal plans & supplement advice",
        "Complimentary post-workout protein shakes at the bar",
        "Unlimited infrared sauna & ice bath recovery access",
        "Priority booking for specialized strength masterclasses",
        "Complete IRONFORGE Elite Apparel Kit (Hoodie, Tee, Shaker, Straps)",
        "2 Free guest passes every month",
      ],
      ctaText: "BECOME A LEGEND",
    },
  ],

  // -----------------------------------------------------------------------
  // 9. FINAL CTA SECTION
  // -----------------------------------------------------------------------
  finalCta: {
    title: "THE IRON NEVER LIES.",
    titleHighlight: "NEVER LIES.",
    subtitle: "DISCIPLINE TODAY. A STRONGER TOMORROW.",
    description:
      "Step onto the iron floor. Feel the energy of men who refuse to settle. Claim your complimentary 1-day all-access trial pass now.",
    sliderText: "SLIDE BARBELL TO LIFT →",
    sliderCompletedText: "LIFT COMPLETED! OPENING PASS...",
  },

  // -----------------------------------------------------------------------
  // 10. NAVIGATION (REMOVED 'STATS' AS REQUESTED)
  // -----------------------------------------------------------------------
  navigation: [
    { label: "Home", href: "/#hero" },
    { label: "Programs", href: "/#programs" },
    { label: "Trainers", href: "/#trainers" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Contact", href: "/#contact" },
  ],
};

/**
 * Helper to construct WhatsApp link with formatted prefilled text
 */
export const getWhatsAppLink = (customMessage) => {
  const number = CONFIG.contact.whatsappNumber.replace(/[^0-9]/g, "");
  const defaultMsg = "Hi, I would like to know more about joining IRONFORGE Gym!";
  const text = encodeURIComponent(customMessage || defaultMsg);
  return `https://wa.me/${number}?text=${text}`;
};
